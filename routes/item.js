var express = require('express');
var validator = require('validator');
var isEmpty = require('lodash/isEmpty');
import commonValidation from '../shared/validations/signup';
import authenticate from '../middleware/authenticate';
import db from '../db';
import mysql from 'mysql';
import moment from 'moment'

let router = express.Router();

function serverValidate(body) {
    let errors = {}
    return new Promise((resolve, reject) => {
        let query = mysql.format("SELECT * FROM companyItems JOIN companies_item ON id = itemID WHERE name = ? AND companyID = ?;", [body.name, body.companyID]);
        console.log("body: ", body);
        if (Number(body.price) < 0 || body.price === null || !Number.isInteger(Number(body.price))) {
            errors.price = "Enter valid price"
        }
        if (Number(body.qty) < 0 || body.qty === null || !Number.isInteger(Number(body.qty))) {
            errors.qty = "Enter qty price"
        }
        if (body.name === '') {
            errors.itemName = "Item cannot be empty"
        }
        db.query(query, (err, result, fields) => {
            if (err) {
                console.log("err", err);
                return reject(err);
            }
            if (result.length !== 0) {
                errors.itemName = "Item Already Exists"
            }

            resolve({
                errors,
                isValid: isEmpty(errors)
            })
        });
    });
}

router.get('/getItems/', (req, res) => {
    var id = req.query.ID
    let query = mysql.format("SELECT * FROM companyItems JOIN companies_item ON itemID = id AND companyID = ?;", [id]);
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: err })
            return;
        } else {
            // result.unshift([{ id: -1, name: "Empty", description: "Empty", dateCreated: "", price: 0, qty: 0, companyID: id, itemID: -5 }])
            res.json(result);
            return;
        }
    });
})

router.post('/updateInventory', authenticate, (req, res) => {
    const { name, itemID, oldQty, newQty, companyID, reason } = req.body;
    let errors = {};
    if (oldQty - Number(newQty) === 0) {// because newqty is give back as a string
        errors.qty = "Needs to be a new value";
    }
    if (Number(newQty) < 0) {
        errors.qty = "Cannot be negative number";
    }
    if (isEmpty(errors)) {
        let query = mysql.format("UPDATE companyItems SET qty = ? WHERE id = ?", [newQty, itemID])
        db.query(query, (err, result) => {
            if (err) {
                throw err;
            }
        });
        let type = (oldQty - Number(newQty)) > 0 ? 'DECREASE' : 'INCREASE';
        let data = { itemID, companyID, transactionType: type, qty: (Number(newQty) - oldQty), Reason: reason }
        let query2 = mysql.format("INSERT INTO itemTransactions SET ?", data)
        db.query(query2, (err, result) => {
            if (err) {
                throw err;
            }
        });
        res.status(200).json({ Success: "Updated!" });
        return;
    }
    res.status(400).json(errors);
    return;
});

router.post("/updateItem", authenticate, (req, res) => {
    serverValidate(req.body).then((errors, isValid) => {
        if (isValid) {
            const { name, price, description } = req.body;
            db.query(mysql.format(`UPDATE companyItem SET name = ?, description = ?, price=?`, [name, price, description]), (err, result) => {
                if (err) {
                    res.status(500).json({ error: err })
                    return;
                } else {
                    res.send(200);
                }
            })
        } else {
            res.status(400).json(errors)
            return;
        }
    })

})

router.post('/add', authenticate, (req, res) => {
    serverValidate(req.body).then(({ errors, isValid }) => {
        if (isValid) {
            const { name, companyID, price, description, qty } = req.body;
            let query = mysql.format("SELECT insertNewItem(?,?,?,?,?);", [name, description, price, companyID, qty]);
            db.query(query, (err, result, fields) => {
                if (err) {
                    res.status(500).json({ error: err })
                    return;
                } else {
                    let query = mysql.format("SELECT * FROM companyItems WHERE id = ?;", [Object.values(result[0])[0]]);
                    db.query(query, (err, result) => {
                        if (err) {
                            res.status(500).json({ error: err })
                            return;
                        } else {
                            res.json(result[0]);
                        }
                        return;
                    });
                }
            });
        } else {
            res.status(400).json(errors)
            return;
        }
    })
});

module.exports = router;