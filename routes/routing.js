const express = require('express');
const routing = express.Router();
const service = require("../service/account");
const Transaction = require("../model/transaction")


routing.get("/setupDB", (req, res, next) => {
    service.insertScript().then((data) => {
        if (data) {
            res.status(201)
            res.json({ message: "Inserted " + data + " document in database" })
        }
    })
})

//Routing for login
routing.post("/login", (req, res, next) => {
    let loginObj = req.body
    service.validateLogin(loginObj).then((resp) => {
        if (resp) {
            res.status(200)
            res.json({ message: "Logged in Successfully as : " + loginObj.username })
        }
    }).catch((err) => {
        next(err)
    })
})


//---------------------------------------------------------------------------------------


//Routing to get transactions details 
routing.get('/transactions/:username', (req, res, next) => {
    let username = req.params.username;
    service.getTransactions(username).then((transactionDetails) => {
        res.status(200)
        res.json(transactionDetails)
    }).catch((err) => {
        next(err)
    })
})


//---------------------------------------------------------------------------------------

//Routing to create new account for user 
routing.post("/accounts", (req, res, next) => {
    let accountObj = req.body
    service.createAccount(accountObj).then((data) => {
        res.json({ message: "Account Created Successfully" })
    }).catch((err) => {
        next(err)
    })
})

//---------------------------------------------------------------------------------------

//Routing to update transactions
routing.put("/transactions/:username", (req, res, next) => {
    let transactionObj = new Transaction(req.body)
    let username = req.params.username
    service.updateTransactions(username, transactionObj).then((tid) => {
        res.json({ message: "Transaction updated with id : " + tid })
    }).catch((err) => {
        next(err)
    })
})

//---------------------------------------------------------------------------------------

//Routing to delete transactions
routing.delete("/transactions/:username/:tid", (req, res, next) => {
    // console.log("akduhk");
    
    let username = req.params.username
    let tid = Number(req.params.tid)
    service.deleteTransaction(username, tid).then((tid) => {
        res.json({ message: "Removed transaction with Id : " + tid })
    }).catch((err) => {
        next(err)
    })
})

module.exports = routing;