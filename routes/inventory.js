var express = require('express');
var validator = require('validator');
var isEmpty = require('lodash/isEmpty');
import commonValidation from '../shared/validations/signup';
import authenticate from '../middleware/authenticate';
import db from '../db';
import mysql from 'mysql';
import moment from 'moment'

let router = express.Router();

router.get("/", (req, res) => {
    let itemID = req.query.itemID;
    let chartData = [];
    db.query(mysql.format(`SELECT qty,transactionDate from itemTransactions WHERE itemID = ? ORDER BY transactionDate ASC`, [itemID]), (err, result) => {
        if (err) {
            console.log("Error: ", err);
            res.status(500).json({ err })
        }
        console.log(result);
        try {
            let initialValue = result[0].qty;
            chartData.push({ ...result[0], qty: initialValue });
            result.forEach(function (element, i) {
                if (i === 0) {
                    return;
                }
                initialValue += element.qty;
                chartData.push({ ...result[i], qty: initialValue });
            });
            res.status(200).json({ chartData })
        }
        catch (e) {
            res.status(400).json({ error: e });
        }
    });

});

router.get("/getTransactions/", (req, res) => {
    let companyID = req.query.companyID;// company id
    let currentPage = req.query.page;//currentPage
    let sortBy = req.query.sortBy; // sort column
    let sortType = req.query.sortType //ASC or DESC
    let itemsPerPage = Number(req.query.itemsperPage); // items per page
    let searchBy = (req.query.searchBy); // search by term
    let searchQuery = (req.query.searchQuery);// search query string
    let transactionList = []

    if (searchBy === "qty") {//sigh
        searchBy = "IT.qty"
    }

    console.log(`CompanyID: ${companyID} CurrentPage: ${currentPage} SortBy: ${sortBy}  itemsPerPage: ${itemsPerPage} searchBy: ${searchBy} query: ${searchQuery} sortType: ${sortType}`)
    let offset = (currentPage - 1) * itemsPerPage;
    let query = mysql.format("SELECT itemID, CI.name as itemName, companyID, transactionDate, transactionType, IT.qty,Reason FROM (itemTransactions as IT JOIN companyItems as CI ON IT.itemID = id) HAVING IT.companyID = ? AND " + searchBy + " LIKE " + db.escape(searchQuery + '%') + " ORDER BY " + sortBy + " " + sortType + " " + "LIMIT ? OFFSET ?;", [companyID, itemsPerPage, offset]);
    console.log(query);
    db.query(query, (err, result) => {
        if (err) {
            console.log("err: ", err);
        }
        transactionList = result

        db.query(mysql.format("SELECT count(*) FROM (itemTransactions as IT JOIN companyItems as CI ON IT.itemID = id) WHERE IT.companyID = ? AND " + searchBy + " LIKE " + db.escape(searchQuery + '%') + ";", [companyID]), (err, result) => {
            if (err) {
                console.log("err: ", err);
            }
            console.log(Object.values(result[0])[0])
            res.status(200).json({
                transactionList,
                Pages: Math.ceil(Object.values(result[0])[0] / itemsPerPage)
            })
            return;
        })
    });

    res.status(500);
    return;
});

module.exports = router;