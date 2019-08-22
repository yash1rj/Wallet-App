const dbLayer = require("../model/account")
const validator = require("../utilities/validator")

let service = {}

service.insertScript = () => {
    return dbLayer.insertScript().then((data) => {
        return data
    })
}

service.validateLogin = (loginObj) => {
    return dbLayer.getUser(loginObj.username).then((response) => {
        if (!response) {
            let err = new Error("User does not exist")
            err.status = 401
            throw err
        }
        else if (response.password != loginObj.password) {
            let err = new Error("Incorrect password")
            err.status = 401
            throw err
        } else {
            return true
        }
    })
}


service.getTransactions = (username) => {
    return dbLayer.getTransactions(username).then((data) => {
        if (data && data.transactions.length > 0) {
            return data.transactions
        } else {
            let err = new Error("No transaction details found")
            err.status = 404
            throw err
        }
    })
}

service.createAccount = (accountObj) => {
    validator.validatePAN(accountObj.PAN)
    return dbLayer.getUser(accountObj.username).then((data) => {
        if (data) {
            let err = new Error("User already exists")
            err.status = 406
            throw err
        } else {
            return dbLayer.createAccount(accountObj).then((data) => {
                if (data) {
                    return data
                } else {
                    let err = new Error("Account not created")
                    err.status = 500
                    throw err;
                }
            })
        }
    })

}

service.updateTransactions = (username, transactionObj) => {
    return dbLayer.updateTransactions(username, transactionObj).then((tid) => {
        if (tid) {
            return tid
        } else {
            let err = new Error("Transaction details not updated")
            err.status = 400
            throw err
        }
    })
}

service.deleteTransaction = (username, tid) => {
    return dbLayer.deleteTransaction(username, tid).then((resp) => {
        if (resp) return resp
        else {
            let err = new Error("No transaction details found or operation failed");
            err.status = 500;
            throw err;
        }
    })
}



module.exports = service