const flash = require("express-flash");
const session = require("express-session");
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

const myDailyExpense = require("./daily-expense");
const ShortUniqueId = require("short-unique-id");
const pgp = require("pg-promise")();
const app = express();

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const DATABASE_URL =
  process.env.DATABASE_URL ||
   "postgresql://postgres:pg123@localhost:5432/daily_expense";

const config = {
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const db = pgp(config);

const expenses = myDailyExpense(db);

const uid = new ShortUniqueId({ length: 4 });

// const route = myDailyRoutes(regNo)

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    secret: "using session http",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", async function(req, res){
  res.render("index", {

  })
})

app.post("/registered", async function(req, res){
  let usernames = req.body.user
  const code = uid();
  if(await expenses.userDetails(usernames) !== null){
    
    req.flash("error",'YOUR NAME IS ALREADY HAVE A CODE')
  }else if(code == null ){
    req.flash("error",`PLEASE TYPE IN THE CORRECT CODE`)
  }
  else if(usernames){
  const code = uid();
await expenses.storedDetails(usernames,code)
req.flash("success","PLEASE SAVE YOUR CODE" + " " + " : " + " "+code)

}

  res.redirect("register")
})

app.get("/register", async function(req, res){

  res.render("register", {

  })
})




app.post("/login", async function(req, res){
  let username = req.body.uname
  
  if(username){
    await expenses.storedDetails(username)
  }
  let userInput = await expenses.userDetails(username)
  res.redirect("/categories/"+userInput.names)
})

app.post("/categories/:name", async function(req, res){
  let dropdown = req.body.groups
  let user = req.params.name
  let price = req.body.amount 
  let dated = req.body.date


  
 if(!price){
    req.flash('error','PLEASE INSERT THE AMOUNT OF YOUR EXPENSE')
  }
  else if(!dated){
    req.flash('error','SELECT A DATE')
  }

  if(dropdown && price && dated){
    await expenses.storedInfo(user,dropdown,price,dated)
    req.flash('success','YOUR EXPENSE HAS BEEN ADDED')
  }
 
   
  res.redirect("back")
})



app.get("/categories/:name", async function(req, res){
  
  res.render("expense", {
    name:req.params.name
  })
})


app.get("/costs/:name",async function(req, res){

  let users = req.params.name

  let output =  await expenses.total(users)
  let outputs = `${users} has spend R${output.sum}`
  
   await expenses.joiningTables()

  console.log(users)
  console.log(output)
  console.log(outputs)
  res.render('costs',{
    users,
    outputs
  })
})

app.post("/payments/:name", function(req, res){


  res.redirect("expense",{
    name:req.params.name
  })
})
app.get("/payments/:name", function(req, res){


  res.redirect("expense",{
    name:req.params.name
  })
})


app.get("/resets",async function resets (req, res){

  
   await expenses.rested();    
   req.flash("error","YOU RESETED EVERYTHING");
   res.redirect("back");

})



const PORT = process.env.PORT || 3009;
app.listen(PORT, function () {
  console.log("APP STARTED AT PORT", PORT);
});