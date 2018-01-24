var express = require('express');
import db from '../db';
import mysql from 'mysql';
let router = express.Router();

router.post('/add', (req, res) => {
    console.log(req.body);
    const { name, price, description, qty } = req.body;
    let query = mysql.format("INSERT INTO Item set ?", { name, description, price, qty });
    db.query(query, (err, result, fields) => {
        if (err) {
            res.status(500).json({ error: err })
            return;
        }
        res.status(200).json({
            itemAdded: { id: result.insertId, ...req.body }
        });
    });
});

router.delete('/', (req, res) => {
    const itemID = req.query.id;
    console.log(req.query);
    let query = mysql.format("DELETE FROM Items WHERE id =  ?", [itemID]);
    db.query(query, (err, result, fields) => {
        if (err) {
            res.status(500).json({ error: err })
            return;
        }
        res.status(200).json({
            message: `Sucesfully deleted item id: ${itemID}`
        });
    });
});



module.exports = router;