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
    managerMenu();
});

function managerMenu() {
    inquirer.prompt([
        {
            name: "Choice",
            type: "list",
            message: "Welcome back Manager. What you would like to do?",
            choices: ["View Products for sale" , "View Low inventory" , "Add to inventory", "Add new product", "EXIT"]
          }
    ]).then(function(answers){
        if(answers.Choice === "View Products for sale"){
            console.log("View Products for sale");
            productsForSale();
        }else if(answers.Choice == "View Low inventory"){
            console.log("View Low inventory");
            lowInventory();
        }else if(answers.Choice == "Add to inventory"){
            console.log("Add to inventory");
            addToInventory();
        }else if(answers.Choice == "Add new product"){
            console.log("Add new product");
            addProduct();
        }else if(answers.Choice == "EXIT"){
            console.log("Goodbye!");
            connection.end();
        }
        });  
}

function productsForSale(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for(var i = 0; i < res.length; i++){
        console.log("\nItem ID: " + res[i].item_id + ", \nProduct Name: " + res[i].product_name + 
        "\nDepartment Name: " + res[i].department_name + "\nPrice: $" + res[i].price + "\nLeft in stock: " + res[i].stock_quantity + "\n");
        }
        managerMenu();
      });
}

function lowInventory(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for(var i = 0; i < res.length; i++){
            if(res[i].stock_quantity <= 5){
                console.log(res[i].product_name + " is low and has " + res[i].stock_quantity + " left in stock \n");
            }
        }
        managerMenu();
    });

}

function addToInventory(){
    inquirer.prompt([
        {
            name: "Choice",
            message: "Select the item you would like to add to by the Item ID"
        }
    ]).then(function(answers){
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            for(var i = 0; i < res.length; i++){
                if(answers.Choice == res[i].item_id){
                    console.log("\nYou chose: " + res[i].product_name + "." +
                    "\nStock left: " + res[i].stock_quantity + "\n");
                    var item_id = res[i].item_id;
                    inquirer.prompt([
                        {
                            name:"choice",
                            message: "How many would you like to add?"
                        }
                    ]).then(function(answers){
                        connection.query("UPDATE products SET stock_quantity = stock_quantity +" 
                        + answers.choice + " WHERE item_id = " + item_id);
                        console.log("\n");
                        managerMenu();
                    })
                }
            }
        });
    });
}

function addProduct(){
    inquirer.prompt([
        {
            name: "name",
            message: "\nWhat is the product name?"
        },
        {
            name: "department",
            message: "\nWhat department does this item belong to?"
        },
        {   
            name: "price",
            message: "\nWhat is the price of this item?"
        },
        {
            name: "stock",
            message: "\nHow many are in stock?"
        }
    ]).then(function(answers){
        connection.query("INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES(" + '"'+
        answers.name + '"' + ", " + '"' +  answers.department + '"' + ", " + '"' + answers.price + '"' + ", " + '"' + answers.stock + '"' + ")");
        console.log("done?");
        managerMenu();
})
}