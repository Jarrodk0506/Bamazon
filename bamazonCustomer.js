var mysql = require("mysql");
var inquirer = require("inquirer");

//connection to mysql
var connection = mysql.createConnection({
    host: "127.0.0.1",
  
    port: 3306,
  
    user: "root",
  
    password: "",
    database: "bamazon"
  });


//Start connection and Display the products
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
});


//function to display the current products for the user. Once displayed run Choice function.
function displayProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      for(var i = 0; i < res.length; i++){
      console.log("\nItem ID: " + res[i].item_id + ", \nProduct Name: " + res[i].product_name + 
      "\nDepartment Name: " + res[i].department_name + "\nPrice: $" + res[i].price + "\nLeft in stock: " + res[i].stock_quantity);
      }
      choice();
    });
  }


//Prompt user to choose which item they would like by ID, then ask how many units of the product 
//the user would like to purchase show the total and end connection.

var choice = function(){
    inquirer.prompt([
        {
            name: "Choice",
            message: "Select the item you would like to purchase by the Item ID"
        }
    ]).then(function(answers){
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            for(var i = 0; i < res.length; i++){
                if(answers.Choice == res[i].item_id){
                    console.log("\nYou chose: " + res[i].product_name + "." +
                    "\nPrice: " + res[i].price + "\nStock left: " + res[i].stock_quantity + "\n");
                    var item_id = res[i].item_id;
                    var item = res[i].product_name;
                    var cost = res[i].price;
                    var stock = res[i].stock_quantity;
                    inquirer.prompt([
                        {
                            name:"choice",
                            message: "How many would you like to purchase?"
                        }
                    ]).then(function(answers){
                       cost = cost * answers.choice;
                       if(stock > answers.choice){
                           connection.query("UPDATE products SET stock_quantity = stock_quantity -" + answers.choice + " WHERE item_id = " + item_id);
                           console.log("The price for " + answers.choice + " " + item + "s is: $" + cost + "\nThank you come again!");
                           connection.end();
                       }else{
                           console.log("Insufficient Stock");
                           connection.end();
                       }
                    })
                }
            }
        })
    })
}
