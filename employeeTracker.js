var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "1234",
    database: "employeeTracker_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do?",
            name: "todo",
            choices: ["View all employees",
                "View all employees by department",
                "View all employees by role",
                "View all employees by Manager",
                "Add employees",
                "Add departments",
                "Add roles",
                "Update employee roles",
                "Update employee manager",
                "Delete",
                "TotalSalary",
                "Exite"]
        })
        .then(function (answer) {
            switch (answer.todo) {
                case "View all employees":
                    viewAllEmp();
                    break;
                case "View all employees by department":
                    viewAllDep();
                    break;
                case "View all employees by role":
                    viewAllRol();
                    break;
                case "View all employees by Manager":
                    viewAllMan();
                    break;
                case "Add employees":
                    addEmp();
                    break;
                case "Add departments":
                    addDep();
                    break;
                case "Add roles":
                    addRol();
                    break;
                case "Update employee roles":
                    updateRoles();
                    break;
                case "Update employee manager":
                    updateManager();
                    break;
                case "Delete":
                    deleteIt()
                    break;
                case "TotalSalary":
                    allSalary();
                    break;
                case "Exite":
                    connection.end();
                    break;
            }
        });
}

function viewAllEmp() {
    connection.query(
        "SELECT employee.id, CONCAT_WS(' ', employee.first_name, employee.last_name) AS Name, role.title AS Position, department.name AS Department, CONCAT_WS(' ', b.first_name, b.last_name) AS Manager " +
        "From employee " +
        "INNER JOIN role ON (employee.role_id = role.id) " +
        "INNER JOIN department ON (role.department_id = department.id)" +
        "LEFT JOIN employee AS b ON (employee.manager_id = b.role_id) ORDER BY employee.id;",

        function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
        })
};

function viewAllDep() {

    connection.query("SELECT name FROM department", function (err, res) {
        if (err) throw err;

        inquirer.prompt({
            type: "list",
            message: "What department are you interested ?",
            name: "listAns",

            choices: function () {
                const myArr = [];
                for (let i = 0; i < res.length; i++) {
                    myArr.push(res[i]);
                }
                return myArr;
            }

        })

            .then(function (ans) {
                connection.query("SELECT CONCAT_WS(' ', employee.first_name, employee.last_name) AS Name, " +
                    "role.title AS Position, department.name AS Department From employee INNER JOIN role " +
                    "ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) WHERE ?;", { name: ans.listAns },
                    function (err, res) {
                        if (err, res)
                            console.table(res);
                        start();
                    })
            })
    })
};

function viewAllRol() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;

        inquirer.prompt({
            type: "list",
            message: "What roles are you interested ?",
            name: "rolesAns",
            //choices: ["Software Engineer", "LEAD Engineer", "Accountant", "Accountant LEAD", "Salesperson", "Sales LEAD", "Lawyer", "Lawyer LEAD"]
            choices: function () {
                const myArr = [];
                for (let i = 0; i < res.length; i++) {
                    myArr.push(res[i].title);
                }
                return myArr;
            }
        })
            .then(function (ans) {
                connection.query("SELECT CONCAT_WS(' ', employee.first_name, employee.last_name) AS Name, role.title AS Position, department.name AS Department " +
                    "From employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) WHERE ?", { title: ans.rolesAns },
                    function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
            })
    })
};

function viewAllMan() {
    inquirer.prompt([{
        type: "input",
        message: "What manager's first name?",
        name: "fName"
    },
    {
        type: "input",
        message: "What manager's last name?",
        name: "lName"
    }
    ])
        .then(function (ans) {

            let fName = connection.escape(ans.fName);
            let lName = connection.escape(ans.lName);

            connection.query(

                "SELECT CONCAT_WS(' ', employee.first_name, employee.last_name) AS Name, role.title AS Position, department.name AS Department " +
                "From employee " +
                "INNER JOIN role ON (employee.role_id = role.id) " +
                "INNER JOIN department ON (role.department_id = department.id) " +
                "INNER JOIN employee AS b ON (employee.manager_id = b.role_id) " +
                `WHERE b.first_name = ${fName} AND b.last_name = ${lName};`,
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                })
        })
};

function addEmp() {

    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;

        inquirer.prompt([{
            type: "input",
            message: "Enter the first name",
            name: "fName"
        },
        {
            type: "input",
            message: "Enter the last name",
            name: "lName"
        },
        {
            type: "list",
            message: "Enter the position id",
            name: "role",
            choices: function () {
                const myArr = [];
                for (let i = 0; i < res.length; i++) {
                    myArr.push((res[i].id) + " " + res[i].title);
                }
                return myArr;
            }
        }

        ])

            .then(function (ans) {
                const getIndexArr = ans.role.split(" ");
                connection.query("INSERT INTO employee SET ?",
                    {
                        first_name: ans.fName,
                        last_name: ans.lName,
                        role_id: getIndexArr[0]
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log("Add employee complete");
                        start();
                    })
            })
    })
}

function addDep() {
    inquirer.prompt({
        type: "input",
        message: "What department do you like to add?",
        name: "department"
    })

        .then(function (ans) {
            connection.query("INSERT INTO department SET ?",
                {
                    name: ans.department
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("Add department complete");
                    start();
                }
            )
        })
};

function addRol() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;


        inquirer.prompt([{
            type: "input",
            message: "What role do you like to add?",
            name: "role"
        },
        {
            type: "input",
            message: "How much for salary?",
            name: "salary"
        },
        {
            type: "list",
            message: "What department is this role relate to?",
            name: "department",
            choices: function () {
                const myArr = [];
                for (let i = 0; i < res.length; i++) {
                    myArr.push(res[i].id + " " + res[i].name);
                }
                return myArr;
            }
        }
        ])

            .then(function (ans) {
                const getIndexArr = ans.department.split(" ");


                connection.query("INSERT INTO role SET ?",
                    {
                        title: ans.role,
                        salary: ans.salary,
                        department_id: getIndexArr[0]
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log("Add roles complete");
                        start();
                    }
                )
            })

    })
};

function updateRoles() {

    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;

        inquirer.prompt([{
            type: "input",
            message: "What's employee id?",
            name: "id"
        },
        {
            type: "list",
            message: "What roles you like him/her to be?",
            name: "role",
            choices: function () {
                const myArr = [];
                for (let i = 0; i < res.length; i++) {
                    myArr.push(res[i].id + " " + res[i].title);
                }
                return myArr;
            }
        }
        ])

            .then(function (ans) {
                const roleIndex = ans.role.split(" ");
                connection.query(
                    "UPDATE employee " +
                    "SET role_id = ? WHERE id = ?", [roleIndex[0], ans.id],
                    function (err, res) {
                        if (err) throw err;
                        console.log("Update complete");
                        start();
                    })
            })
    })
};

function deleteIt() {
    inquirer.prompt([
        {
            type: "list",
            message: "What do like to delete?",
            name: "deleteType",
            choices: ["department", "role", "employee"]
        },
        {
            type: "input",
            message: "ID?",
            name: "deleteID"
        }
    ])

        .then(function (ans) {
            connection.query(
                `DELETE FROM ${ans.deleteType} WHERE id = ${ans.deleteID}`,
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " Deleted!\n");
                    start();
                })
        })
};


function allSalary() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;


        inquirer.prompt({
            type: "list",
            message: "What department are you want to check?",
            name: "depart",
            choices: function () {
                const myArr = [];
                for (let i = 0; i < res.length; i++) {
                    myArr.push(res[i].id + " " + res[i].name);
                }
                return myArr;
            }
        })

        .then(function(ans){
            const getID = ans.depart.split(" ");
            connection.query(
                "SELECT SUM(role.salary) AS Total " +
                "FROM employee " +
                "INNER JOIN role ON (employee.role_id = role.id) " +
                "INNER JOIN department ON (role.department_id = department.id) " +
                "WHERE department_id = ?;",[getID[0]],
                function (err, res) {
                    if (err) throw err;
                    console.log(res);
                })
            start();

        })
        
    })

};

function updateManager() {

    inquirer.prompt([{
        type: "input",
        message: "What's employee id?",
        name: "id"

    },
    {
        type: "input",
        message: "What is his/her manager id?",
        name: "managerid"
    }
    ])

        .then(function (ans) {

            connection.query(
                "UPDATE employee " +
                "SET manager_id = ? WHERE id = ?", [ans.managerid, ans.id],
                function (err, res) {
                    if (err) throw err;
                    console.log("Update complete");
                    start();
                })
        })


}


