CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE bamazon.products (
	item_id	INT(11) auto_increment NOT NULL,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100) NULL,
    stock_quantity VARCHAR(100) NULL,
    price FLOAT(11) NULL,
    PRIMARY KEY(item_id)
    );
       
SELECT * FROM products;