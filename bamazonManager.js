// Application Dependencies
var mysql = require('mysql');
var connection = require('./config.js');
var inquirer = require('inquirer');
var prompt = inquirer.createPromptModule();

var Table = require('tty-table/automattic-cli-table');

var itemList = [];

function listProducts() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        displayTable(res);
    	menu();
    });
}

function listLowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res) {
        if (err) throw err;
        displayTable(res);
    	menu();
    });
}

function addInventory() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        itemList = [];
        for (var i = 0; i < res.length; i++) {
            itemList.push(res[i].product_name);
        }
        displayTable(res);
        prompt({
            type: 'list',
            message: 'Which item would you like to add inventory to?',
            choices: itemList,
            name: 'item'
        }).then(function(selection) {
            prompt({
                type: 'input',
                message: 'How many ' + selection.item + ' would you like to add?',
                validate: function(value) {
                    if (!isNaN(value) && (function(x) {
                            return (x | 0) === x;
                        })(parseFloat(value))) {
                        return true
                    } else {
                        console.log('  ::  Numbers only pls.');
                    }
                },
                name: 'input'
            }).then(function(ammount) {
                connection.query('SELECT * FROM products WHERE product_name = ?', [selection.item], function(err, res) {
                    var currentStock = parseInt(res[0].stock_quantity);
                    var change = parseInt(ammount.input);
                    var newStock = currentStock + change;
                    connection.query('UPDATE products SET ? WHERE ?', [{
                        stock_quantity: newStock
                    }, {
                        product_name: selection.item
                    }]);
                    listProducts();
                    
                });
            });
        });
    });
}

function addNewProduct() {
	prompt([{
		type: 'input',
		message: 'What is the name of the product?',
		name: 'product_name'
	},{
		type: 'input',
		message: 'What department does the product belong to?',
		name: 'department_name'
	},{
		type: 'input',
		message: 'What is the starting stock of the product?',
		name: 'stock_quantity'
	},{		
		type: 'input',
		message: 'What is the price of the product?',
		name: 'price'
	}]).then(function(newItem){
		connection.query('INSERT INTO products SET ?', {
			product_name: newItem.product_name,
			department_name: newItem.department_name,
			stock_quantity: newItem.stock_quantity,
			price: newItem.price,	
		}, function(err, res){
			if (err) throw err;
			listProducts();
			
		});

	})
}

function displayTable(data) {
    var table = new Table({
        head: ['Item ID', 'Name', 'Department', 'Stock', 'Price'],
        colWidths: [10, 20, 20, 20, 10],
        footer: this.head
    });

    for (var i = 0; i < data.length; i++) {

        table.push(
            [data[i].item_id, data[i].product_name, data[i].department_name, data[i].stock_quantity, data[i].price]
        );

    }
    console.log(table.toString());
}

function menu() {
    inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View All Products', 'View Low Inventory', 'Add Inventory', 'Add a New Product', 'Exit'],
        name: 'selection'
    }]).then(function(answer) {
        switch (answer.selection) {
            case 'View All Products':
                listProducts();
                break;
            case 'View Low Inventory':
                listLowInventory();
                break;
            case 'Add Inventory':
                addInventory();
                break;
            case 'Add a New Product':
                addNewProduct();
                break;
            case 'Exit':
            	exit();
                break;
        }
    });
}

function exit(){
	console.log('Bye now!');
	connection.end();
}

menu();