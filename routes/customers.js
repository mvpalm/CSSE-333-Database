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
        let query = mysql.format("SELECT email FROM customerview WHERE companyID =? AND email =?;", [body.companyID, body.customerEmail]);
        console.log("body: ", body);
        db.query(query, (err, result) => {
            if (err) {
                console.log("err", err);
                return reject(err);
            }
            if (result.length !== 0) {
                errors.email = "Customer Already Exists"
            }

            resolve({
                errors,
                isValid: isEmpty(errors)
            })
        });
    });
}

router.post('/add', authenticate, (req, res) => {
    serverValidate(req.body).then(({ errors, isValid }) => {
        if (isValid) {
            const { customerFirstName, customerLastName, customerEmail, companyID } = req.body; //fname,lname,email,companyid
            let query = mysql.format("SELECT InsertCustomer(?,?,?,?);", [customerFirstName, customerLastName, customerEmail, companyID]);
            db.query(query, (err, result, fields) => {
                if (err) {
                    res.status(500).json({ error: err })
                    return;
                } else {
                    let query = mysql.format("SELECT * FROM customer WHERE id = ?;", [Object.values(result[0])[0]]);
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

router.delete('/', authenticate, (req, res) => {
    const customerID = req.query.id;
     console.log("called?", customerID)
    db.query(mysql.format(`DELETE FROM customer WHERE id = ?`, [customerID]), (err, result) => {
        if (err) {
            console.log("err")
            res.status(500).json({ err })
        } else {
            console.log(result);
            res.send(200);
        }
    });
})

/**
 * Get customers
 */
router.get('/', authenticate, (req, res) => {
    const companyID = req.query.id;


    db.query(mysql.format(`SELECT * FROM customerview WHERE companyID = ?`, [companyID]), (err, customers) => {
        if (err) {
            console.log("err")
            res.status(500).json({ err })
            return;
        } else {
            if (customers.length > 0) {
                const CustomerIDs = customers.reduce((acc, value, index) => {
                    acc.push(value.id);
                    return acc;
                }, [])
                let query = ""
                CustomerIDs.forEach((id) => {
                    query += mysql.format(`SELECT IFNULL(COUNT(*), 0) as timesVisited,COALESCE(sum(qty),0) as itemsBought ,customerID FROM receiptview WHERE customerID=?;`, [id]);
                }); // this query is nasty.  Returns count based off receipt so if the customer is not attached to a receit the customerid is null.
                try {
                    db.query(query, (err, result) => {
                        if (err) {
                            console.log("err")
                            res.status(500).json({ err })//select all the ids
                            return;
                        } else {
                            console.log(result);
                            if (result.length === 1) {
                                customers.forEach((value, i) => {
                                    if (!result[0].customerID) {
                                        value.timesVisited = 0;
                                        value.itemsBought = 0;
                                    } else {
                                        value.timesVisited = result[0].timesVisited;
                                        value.itemsBought = result[0].itemsBought;
                                    }

                                })
                            } else if (result.length > 1) {
                                for (let j = 0; j < result.length; j++) {
                                    customers.forEach((value, i) => {
                                        value.timesVisited = result[i][0].timesVisited;
                                        value.itemsBought = result[i][0].itemsBought;
                                    })
                                }
                            } else {
                                customers.forEach((value, i) => {
                                    value.timesVisited = 0;
                                    value.itemsBought = 0;
                                })
                            }
                        }
                        customers.unshift({ id: -1, fName: "", lName: "", email: "No Info Provided", companyID });
                        res.json(customers);
                        return;
                    });
                }
                catch (err) {
                    console.log(err);
                    res.status(500).json({ err });
                    return;
                }
            } else {
                res.status(404).json({ err });
                return;
            }
        }
    });
});

module.exports = router;