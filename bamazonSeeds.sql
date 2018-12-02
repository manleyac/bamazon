drop database if exists bamazon_DB;
create database bamazon_DB;
 use bamazon_DB;
 
 create table products(
	id int not null auto_increment,
    item_id integer(10)  not null,
    product_name varchar(30) not null,
    department_name varchar(30) not null,
    price decimal(6,2) not null,
    stock_quantity integer(5) not null,
    primary key(id)
 );
 
 insert into products(item_id,product_name,department_name,price,stock_quantity)
 values(0101,"guitar","Music",500.00,8), (0102,"drum set","Music",900.0,4), (0103, "microphone", "Music",75.00, 12),
			(0201, "Macbook", "Technology", 1200.00,10), (0202, "iPad", "Technology", 799.00,6), (0203,"iPhone","Technology",999.0,3),
            (0204,"headphones","Technology",199.00,20),
            (0301,"The Lord of The Rings", "Books", 15.00,15), (0302,"A Game of Thrones","Books",9.00,15), (0303, "The Name of The Wind", "Books", 12.00, 15);
            
select * from products