create database DigitalReceipt;

use DigitalReceipt;

create table Company (
	id int not null auto_increment primary key,
    name varchar(20),
    address varchar(20),
    city varchar(20),
    state char(2),
    zipCode decimal(5),
    email varchar(40),
    password_digest varchar(50),
    creation_time timestamp
);

create table Customer (
	id int not null auto_increment primary key,
    fName varchar(20),
    lName varchar(20),
    email varchar(40)
);

create table Item (
	id int not null auto_increment primary key,
    name varchar(20),
    description text,
    dateCreated datetime default current_timestamp,
    price decimal(20, 2),
    qty int unsigned
);

create table Receipt (
	receiptid int not null auto_increment primary key,
    companyid int,
    customerid int,
    foreign key(companyid) references Company(id),
    foreign key(customerid) references Customer(id),
    issued_date date
);

create table Sells_To (
	companyid int,
    customerid int,
    primary key(companyid, customerid),
    foreign key(companyid) references Company(id),
    foreign key(customerid) references Customer(id),
    created_date date
);

create table Sells (
	companyid int,
    itemid int,
    primary key(companyid, itemid),
    foreign key(companyid) references Company(id),
    foreign key(itemid) references Item(id)
);

create table Item_Receipt (
	receiptid int,
    itemid int,
    primary key(receiptid, itemid),
    foreign key(receiptid) references Ritemeceipt(receiptid),
    foreign key(itemid) references Item(id),
    qty int unsigned
);