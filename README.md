# bamazon
### Node e-commerce site utilizing MySQL

To begin, you must create a schema and table in MySQL using the provided bamazon.sql file and then import the seed.csv to get a starting table. 

Once the table is created, create a JSON file called `config.js` that contains the following code : 

```
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '<password to database>',
	database: '<database name>'
});

module.exports = connection;
```
Be sure to include a password if your database requires one, and the name of your database. 
Also remember to run `npm i` in your console to install all required packages.

## Bamazon Customer

`node bamazonCustomer.js`
![customer_view](./pics/bamazoncustomerview1.png)

This application will allow you to view and purchase items listed in the database. After selecting an item from the list, the user is prompted for a purchase ammount. If the ammount is available, the purchase will continue and the user is given their total purchase cost. 

![customer_view](./pics/bamazoncustomerview2.png)

---
## Bamazon Manager

`node bamazonManager.js`
![manager_view](./pics/bamazonmanagerview.png)

This application allows a manager to handle inventory in the database. They can view low inventory, add inventory, add new products, and view all products available.

* View All Products - Display all the items in the shop
* View Low Inventory - Display all items whose stock quantity is less than 5
* Add Inventory - Increase the amount of an item in stock
* Add a New Product - Adds a new product to the database based on user input
* Exit - Exits the application

