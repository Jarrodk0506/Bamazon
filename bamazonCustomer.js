var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "127.0.0.1",
  
    port: 3306,
  
    user: "root",
  
    password: "",
    database: "bamazon"
  });


connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
});



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
                    "\nPrice: " + res[i].price + "\nStock left: " + res[i].stock_quantity);
                    var cost = res[i].price;
                    inquirer.prompt([
                        {
                            name:"choice",
                            message: "How many would you like to purchase?"
                        }
                    ]).then(function(answers){
                       cost = cost * answers.choice;
                       console.log(cost);
                    })
                }
            }
        })
    })
}
