CREATE table USER_DETAIL (
id serial primary key,
Names text not null,
Code text not null
);

Create table catagories(
    id serial not null primary key,
    descriptions text not null
);

Create table expense(
    id serial primary key,
    Names_id int not null,
    catagories_id int not null,
    amount float not null,
    dates DATE,
    foreign key (Names_id) references USER_DETAIL(id),
    foreign key (catagories_id) references catagories(id)
);

insert into catagories (descriptions) values ('food'), ('communication'), ('Toileries'),
('travel');


