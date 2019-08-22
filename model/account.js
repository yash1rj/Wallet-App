
const initialData = require("./data.json")
const collection = require("../utilities/connection")


let model = {}

model.insertScript = () => {
    return collection.getCollection().then((collection) => {
        return collection.deleteMany().then((data) => {
            return collection.insertMany(initialData).then((response) => {
                if (response && response.length > 0) {
                    return response.length
                } else {
                    let err = new Error("Script insertion failed")
                    err.status = 500
                    throw new Error
                }
            })
        })
    })
}

model.generateId = () => {
    return collection.getCollection().then((collection) => {
        return collection.distinct("transactions.tid").then((tid) => {
            newId = Math.max(...tid)
            return newId > 0 ? newId + 1 : 1001
        })
    })
}

model.getUser = (username) => {
    return collection.getCollection().then((collection) => {
        return collection.findOne({ username: username }, { _id: 0, username: 1, password: 1 })
            .then((data) => {
                return data
            })
    })
}

model.createAccount = (accountObj) => {
    return collection.getCollection().then((collection) => {
        return collection.create(accountObj).then((data) => {
            if (data) {
                return true
            } else {
                return false
            }
        })
    })
}


model.getTransactions = (username) => {
    return collection.getCollection().then((collection) => {
        return collection.findOne({ username: username }, { _id: 0, transactions: 1 }).then((data) => {
            return data
        })
    })
}



model.updateTransactions = (username, transactionObj) => {
    return model.generateId().then((tid) => {
        transactionObj.tid = tid
        return collection.getCollection().then((collection) => {
            return collection.updateOne({ username: username }, { $push: { transactions: transactionObj } }, { runValidators: true }).then((response) => {
                if (response.nModified > 0)
                    return transactionObj.tid
                else
                    return null
            })
        })
    })
}

model.deleteTransaction = (username, tid) => {
    return collection.getCollection().then((collection) => {
        return collection.updateOne({ username: username }, { $pull: { transactions: { tid: tid } } }, { runValidators: true }).then((resp) => {

            if (resp.nModified > 0) return tid
            else return null
        })
    })
}


module.exports = model