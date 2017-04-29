// Application Dependencies
var mysql = require('mysql');
var connection = require('./config.js');
var inquirer = require('inquirer');
var prompt = inquirer.createPromptModule();

var Table = require('tty-table/automattic-cli-table');

var itemList = [];


//connection to MySQL
connection.connect(function(err) {
    if (err) throw err;
    // console.log('Connected to DB Successful');
});

//Load point of the app which grabs all rows from the DB and displays them
function listProducts() {
    connection.query('SELECT * FROM products', function(err, res) {
        
        if (err) throw err;
        displayTable(res);
        for (var i = 0; i < res.length; i++) {
            itemList.push(res[i].product_name);
        }
        userPrompt(itemList);
    });
}

// Function for formatting and displaying table data. 
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
};

// Commandline prompt for user to select an item and ammount
function userPrompt(items) {
    prompt([{
        type: 'list',
        message: 'Which item would you like to purchase?',
        choices: items,
        name: 'selectedItem'
    }]).then(function(selection) {
        prompt([{
            type: 'input',
            message: 'How many ' + selection.selectedItem + ' would you like to purchase?',
            validate: function(value) {
                if (!isNaN(value) && (function(x) {
                        return (x | 0) === x; })(parseFloat(value))) {
                    return true
                } else {
                    console.log('  ::  Numbers only pls.');
                }
            },
            name: 'number'
        }]).then(function(ammount) {
            connection.query('SELECT * FROM products WHERE product_name = ?', [selection.selectedItem], function(err, res) {
                
                var stock = parseInt(res[0].stock_quantity);
                var purchased = parseInt(ammount.number);
               
                if (stock >= purchased) {
                    var newStock = stock - purchased;
                    connection.query('UPDATE products SET ? WHERE ?', [{
                        stock_quantity: newStock
                    }, {
                        product_name: selection.selectedItem
                    }]);

                    console.log('Thank you for your purchase!');
         			displayTotal(selection.selectedItem, purchased);
                } else {
                    console.log('Insufficient stock. Please choose a lower ammount or a new item.');
                    userPrompt(itemList);
                }
            });
        });
    });
}

// Given a functional update to the DB, this will display what the user purchased and the total cost, the application then exits.
function displayTotal(item, stock){
	console.log('Thank you for your purchse of '+ item);
	connection.query('SELECT price FROM products WHERE product_name = ?', [item], function(err, res){
		var price = parseFloat(res[0].price);
		var totalCost = price * parseInt(stock);

		console.log('Your total comes to:  $' + totalCost);
		exit();
	});
}

function exit(){
	connection.end();
}

listProducts();

module.exports = displayTable;