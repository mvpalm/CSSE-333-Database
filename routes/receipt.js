import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../db';
import mysql from 'mysql';
import config from '../config'
import moment from 'moment'
var isEmpty = require('lodash/isEmpty');
var nodemailer = require('nodemailer');
let router = express.Router();

router.get('/getReceipts/', (req, res) => {
    var id = req.query.ID
    console.log("ID: ", id);
    let query = mysql.format(`SELECT receiptID, itemCost, customerID,CONCAT(fname,' ',lname, ' (',email,')') as customerName, itemID,itemName, qty, issuedDate 
                                FROM receiptview
                                    JOIN customer as C
                                        ON customerID = C.id
                                WHERE companyID = ?;`, [id]);
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        console.log(result);
        if(!result){
            res.statusCode(404);
        }
        const createReceipts = () => {
            let jsonData = [];
            const items = (element, i, inputArray) => {
                let itemList = [];
                let counter = i;
                let counter2 = 1;
                let item = {};
                let totalCost = 0;
                while (inputArray[counter].receiptID === element.receiptID) {
                    itemList.push({
                        itemID: inputArray[counter].itemID,
                        itemName: inputArray[counter].itemName,
                        itemQty: inputArray[counter].qty,
                        itemPrice: inputArray[counter].itemCost,
                    })
                    totalCost += inputArray[counter].qty * inputArray[counter].itemCost
                    counter += 1;
                    counter2 += 1;
                    if (inputArray[counter] === undefined) {
                        break;
                    }
                }
                item.issueDate = moment(element.issuedDate).valueOf();
                item.uniqueID = element.receiptID;
                item.totalCost = totalCost;
                item.items = itemList;
                item.customerID = element.customerID;
                item.customerName = element.customerName;
                console.log(item);
                return {
                    item,
                    counter,
                };
            };

            for (let i = 0; i < result.length;) {
                const returnedItems = items(result[i], i, result);
                i = returnedItems.counter;
                jsonData.push(returnedItems.item);
            }
            return jsonData;
        };
        res.status(200).json(createReceipts());
    });
});

function validate(companyID) {
    return new Promise((resolve, reject) => {
        let result = "";
        let query = mysql.format("SELECT id,qty FROM companyItems JOIN companies_item ON id = itemID WHERE companyID = ?; ", [companyID])
        db.query(query, (err, result) => {
            if (err) { reject(err) }
            resolve(result);
        })
    });
}

function updateReceipt(body) {
    return new Promise((resolve, reject) => {
        let query = ""
        body.forEach((element) => {
            query += mysql.format(`UPDATE companyItems SET qty = qty - ${element.qty} WHERE id = ?;`, [element.itemID]);
        });
        console.log("QUERY 4: ", query);
        resolve(query);
    })
}

function transactionInsertData(body, companyID, receiptID) {
    return new Promise((resolve, reject) => {
        let result = [];
        body.forEach((element, i) => {
            console.log("element: ", element);
            result[i] = [element.itemID, companyID, "DECREASE", -element.qty, "Item Receipt " + receiptID];
        })
        resolve(result);
    })
}

function getMax() {
    return new Promise((resolve, reject) => {
        let query = mysql.format("SELECT COALESCE(MAX(receiptID),0) FROM receipt_item", []);
        let toReturn = 0;
        console.log(query);
        db.query(query, (err, result) => {
            if (err) {
                console.log("ERROR IN GET MAX(): ", err);
                reject(err);
            }
            toReturn = Object.values(result[0])[0] + 1;
            console.log("RESULT: ", toReturn);
            resolve(toReturn);
        });

    })
}

router.post("/getmostPopular", (req, res) => {
    if (req.body.length === 0) {
        res.json({ result: [] });
        return;
    }
    let query = "";
    req.body.forEach((element) => {
        query += mysql.format("SELECT SUM(itemCost*qty) as profit,itemName,itemID,SUM(qty) as totalSold FROM receiptview WHERE itemID= ? GROUP BY itemName,itemID;", [element.id]);
    })
    console.log(query);
    db.query(query, (err, result) => {
        if (err) {
            console.log("ERR: ", err);
            res.status(500).json({ err });
        } else {
            try {
                let reducedArray = [];
                console.log("result: ", result);
                if (result.length > 1) {
                    reducedArray = result.reduce((acc, value, i) => {
                        if (!isEmpty(value[0])) {
                            acc.push({ itemName: value[0].itemName, qty: value[0].totalSold, profit: value[0].profit });
                        }
                        return acc;
                    }, [])
                } else if (result.length === 1) {
                    reducedArray.push({ itemName: result[0].itemName, qty: result[0].totalSold, profit: result[0].profit })
                }
                console.log(reducedArray);
                res.json({
                    result: reducedArray.sort((a, b) => {
                        return b.qty - a.qty
                    })
                });
            }
            catch (err) {
                res.status(400).json({ err });
            }
        }
    })
});

function sendEmail(customerID, companyID, receiptID, body) {

    db.query(mysql.format("SELECT customerview.email, companies.name FROM customerview join companies on companyID = companies.id WHERE companyID = ? AND customerview.id = ?", [companyID, customerID]), (err, resultEmail) => {
        if (err) {
            console.log("errpr in email");
            throw err;
        } else {
            const CustomerEmail = resultEmail[0].email;
            const CompanyName = resultEmail[0].name;

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'gokusupersaiyan254@gmail.com',
                    pass: 'Blance97'
                }
            });

            let EmailBody = "";
            let total = 0;
            body.forEach((item, i) => {
                EmailBody += `${i+1}) ${item.itemName}: ${item.qty} x ${item.price}| ${item.qty * item.price}\n`;
                total += item.qty * item.price;
            })
            EmailBody +="Total: " + total;
            console.log(EmailBody);
            var mailOptions = {
                from: 'youremail@gmail.com',
                to: CustomerEmail,
                subject: `Receipt from ${CompanyName} #${receiptID}`,
                text: EmailBody
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    })

}

router.post('/add', (req, res) => {
    const authorizationHeader = req.headers['authorization'];
    let token = authorizationHeader.split(' ')[1];
    let rID; // receipt id
    let Body = req.body.items;
    let customerID = req.body.customerID;
    let companyID;
    let errors = {}
    let resultForm = []
    let toReturn = [] // returning spent qty and itemname.
    console.log("body: ", req.body);
    if (token) {
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            companyID = decoded.id;
            console.log(companyID);
            if (isEmpty(Body)) {
                errors.form = ["Receipt Cannot Be Empty"];
                res.status(400).json(errors);
                return;
            }
            validate(companyID).then((result) => {
                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < Body.length; j++) {
                        if (Body[j].itemID === result[i].id) {
                            if ((Body[j].qty - result[i].qty > 0)) {
                                resultForm.push(`Cannot sell more ${Body[j].itemName}'s than you contain (${result[i].qty} left)`)
                            }
                            if (Body[j].qty < 0) {
                                resultForm.push(`Can't sell negative items`);
                            }
                        }
                    }
                }

                if (!isEmpty(resultForm)) {
                    errors.form = resultForm;
                    res.status(400).json(errors);
                    return;
                } else {

                    getMax().then((rID) => {
                        console.log("NEW RID: ", rID);
                        var data = Body.reduce((acc, value, index) => {
                            delete value.inStock;
                            value.receiptID = rID;
                            acc.push(Object.values(value));
                            return acc;
                        }, [])

                        let query2 = mysql.format("INSERT INTO receipt_item ( itemID, itemName, qty, itemCost, receiptID) VALUES ?", [data]);
                        console.log("QUERY: ", query2);
                        db.query(query2, (err, result) => {
                            if (err) {
                                console.log("ERROR: ", err)
                                throw err;
                            }
                        });
                        transactionInsertData(Body, companyID, rID).then((data) => {
                            console.log("DATA: ", data);
                            let query25 = mysql.format("INSERT INTO itemTransactions ( itemID, companyID, transactionType, qty, Reason) VALUES ?", [data]);
                            console.log("QUERY: ", query2);
                            db.query(query25, (err, result) => {
                                if (err) {
                                    console.log("ERRORt: ", err)
                                    throw err;
                                }
                            });
                        })

                        let data2 = { receiptID: rID, companyID, customerID }
                        let query3 = mysql.format("INSERT INTO receipts SET ?", data2);
                        console.log("QUERY 3", query3)
                        db.query(query3, (err, result) => {
                            if (err) {
                                console.log("ERRORdsa: ", err)
                                throw err;
                            }
                        });
                        updateReceipt(Body).then((query) => {
                            db.query(query, (err, result) => {
                                if (err) {
                                    console.log("AND QUERY IS : ", query);
                                    console.log("ERROR IN UPDATE: ", err)
                                }
                            })
                        })
                        if (customerID !== -1) {
                            sendEmail(customerID, companyID, rID, Body);
                        }
                    }).catch((err => {
                        console.log("catch ERROR: ", err);
                    }));

                    res.status(200).json({ success: "success", Body });
                    return;
                }
            });
            res.status(500)
            return;
        });
    }
})

module.exports = router;