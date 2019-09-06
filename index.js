const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'EmployeeDB',
    multipleStatements: true
});

mysqlConnection.connect((err)=>{
    if(!err)
        console.log('DB connection success');
    else 
        console.log('DB connection failed \n Error: '+ JSON.stringify(err, undefined,2));
});

app.listen(3000,()=>{
    console.log('Express Server is Running on port 3000.');
});

// retrieved all employees from database.
app.get('/employees', (req, res)=>{
    mysqlConnection.query('SELECT * FROM Employee',(err, rows, fields)=>{
        if(!err)
            res.send(rows);
        else
            console.log(err);
    })
});

// get an employee
app.get('/employees/:id', (req, res)=>{
    mysqlConnection.query('SELECT * FROM Employee WHERE EmpID = ?',[req.params.id],(err, rows, fields)=>{
        if(!err)
            res.send(rows);
        else
            console.log(err);
    })
});

// delete an employee
app.delete('/employees/:id', (req, res)=>{
    mysqlConnection.query('DELETE FROM Employee WHERE EmpID = ?',[req.params.id],(err, rows, fields)=>{
        if(!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

// insert an employee
app.post('/employees', (req, res)=>{
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],(err, rows, fields) => {
        if(!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                    res.send('Inserted employee id : ' + element[0].EmpID)
            });
        else
            console.log(err);
    })
});

// update an employee
app.put('/employees', (req, res)=>{
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],(err, rows, fields) => {
        if(!err)
            res.send("Updated Successfully");
        else
            console.log(err);
    })
});