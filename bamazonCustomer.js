const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var itemMap = {};

var con = mysql.createConnection({
   host: "localhost",
   port: 3306,
   user: "root",
   password: "",
   database: "bamazon_DB"
});

con.connect((err) => {
   if (err) throw err;
   console.log("connected as id " + con.threadId + "\n");
   readProducts();
});
con.query(
   "select item_id, stock_quantity from products", (err,res) => {
      if(err) { throw err; }

      for(let item of res) {
         itemMap[item.item_id] = item.stock_quantity;
      }
   }
   
);

function readProducts() {
   console.log("Selecting all products...\n");
   con.query("select * from products", function(err, res) {
     if (err) throw err;
     console.table("Products",res);
     promptUser();
   });
 }

function promptUser() {
   inquirer.prompt([
      {
         type: "list",
         name: "cmd",
         message: "What would you like to do?",
         choices: ["Purchase an item","Exit"]
      }
   ])
   .then((answers) => {
      if(answers.cmd === "Purchase an item") {
         purchase();
      } else {
      exit();
      }
   })
 }

function purchase() {
   inquirer.prompt([{
      type: "input",
      name: "item_id",
      message: "Enter the item id",
      validate: (userInput) => {
         if(Number(userInput) in itemMap) {
            return true;
         }
         return "That item does not exist";
      }
   }, {
      type: "input",
      name: "quantity",
      message: "How many would you like?",
      validate: (quantity,answers) => {
         if(Number(quantity) >=0 && Number(quantity) <= itemMap[answers.item_id]) {
            return true;
         }
         return "Not a valid stock quantity";
      }
   }])
   .then((answers) => {
      console.log("----------------------");
      console.log("Completing purchase...");
      console.log("----------------------");
      con.query(
         "select product_name,price from products where ?",
         [
            {
               item_id: answers.item_id
            }
         ],
         (err,res) => {
            if (err) {
               throw err;
            }
            console.log(`You purchased ${answers.quantity} ${res.product_name} for $${res.price * Number(answers.quantity)}`);
         }
      );
      con.query(
         "update products set ? where ?",
         [
            {
               stock_quantity: itemMap[answers.item_id] - answers.quantity
            },
            {
               item_id: answers.item_id
            }
         ]
      );
      readProducts();
   });
}

function exit() {
   console.log("Thank you for visiting Bamazon!");
   con.end();
}