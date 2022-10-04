module.exports = function myDailyExpense(db){

    async function userDetails(user) {
        let personalDetails = await db.oneOrNone("SELECT Names FROM USER_DETAIL where Names= $1",[
          user
        ]);
    
        return personalDetails;
      }

      async function personsId(usernames) {
      
        let personalDetails = await db.oneOrNone("SELECT id FROM USER_DETAIL where Names= $1",[
          usernames
        ]);

        return personalDetails.id;
      }

    
      async function existingNames(names){
        
        let results = await db.one("SELECT Names FROM USER_DETAIL WHERE Names= $1"[names]);
        return results.Names !== 0;
      }

      async function storedDetails(name,codes) {
        let checkedName = await userDetails(name);
    
        if (checkedName === null) {
          await db.none("INSERT INTO USER_DETAIL(Names,Code) values($1, $2)", [name,codes]);
        }
      }


      
      async function storedInfo(named,group, amount, dates) {
        let Names_id= await personsId(named);
  

       let catagories_id = await db.oneOrNone("SELECT id FROM catagories where descriptions = $1",[
          group
        ])
     
        await db.none(
          "INSERT INTO expense( Names_id , catagories_id,  amount, dates) values($1, $2, $3, $4)",
          [Names_id,catagories_id.id,amount, dates]
        );

        }
    
      

        async function joiningTables(){

          const joined = await db.manyOrNone("SELECT *, to_char(dates, 'Day') as day from expense join catagories on expense.catagories_id = catagories_id")
        return joined
        }


        async function total(total){
        
        let inputss = await db.one("SELECT SUM(amount) FROM expense inner join USER_DETAIL ON expense.Names_id = USER_DETAIL.id where Names =$1", [total]) 
       
        return inputss
        }
// async function joiningTables(usernames){
//   let joined = await db.manyOrNone("Select catagories.descriptions,expense.amount, expense.dates from expense inner join USER_DETAIL on expense.Names_id = USER_DETAIL.id inner join catagories on expense.catagories_id = catagories.id where USER_DETAILS.Names =$1 order by expense.dates DESC", 
//   [usernames])
//   return joined
// }
      
        async function rested() {
          return await db.none("DELETE FROM expense");
        }
      
      
    return{
        userDetails, 
        storedDetails,
        personsId,
        storedInfo,
        joiningTables,
        total,
        existingNames,
        rested,
     
      
    }
   
}