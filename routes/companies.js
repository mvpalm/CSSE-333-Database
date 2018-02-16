var express = require('express');
var validator = require('validator');
var isEmpty = require('lodash/isEmpty');
import commonValidation from '../shared/validations/signup';
import bcrypt from 'bcrypt';
import db from '../db';
import mysql from 'mysql';


let router = express.Router();
function serverValidate(body, commonValidation) {
    let { errors } = commonValidation(body);
    //SELECT * FROM companies WHERE email === email OR companyName === companyName
    return new Promise((resolve, reject) => {
        let query = mysql.format("SELECT * FROM companies WHERE email = ? OR name = ?", [body.email, body.companyName]);
        db.query(query, (err, result, fields) => {
            if (err) {
                return reject(err);
            }
            if (result.length !== 0) {
                if (result.companyName === body.companyName) {
                    errors.companyName = "Company has already registered"
                }
                if (result.email === body.email) {
                    errors.email = "Email has already exists"
                }

            }
            resolve({
                errors,
                isValid: isEmpty(errors)
            })
        })

    })
}


router.get('/:value', (req, res) => {
    console.log(req.params);
    console.log(req.params.value);
    let query = mysql.format("SELECT name,email FROM companies WHERE email = ? OR name = ?", [req.params.value, req.params.value]);
    db.query(query, (err, result, fields) => {
        if (err) {
            throw err;
        }
        if (result.length === 0) {
            res.json({ success: true });
            return;
        }
        console.log(result);
        res.json({ company: result })
        return;
    })
})


router.post('/', (req, res) => {
    serverValidate(req.body, commonValidation).then(({ errors, isValid }) => {
        if (isValid) {
            const { companyName, password, email } = req.body;
            const password_digest = bcrypt.hashSync(password, 10);
            let data = { name: companyName, email, password_digest, init: 0 }
            let query = mysql.format("INSERT INTO companies SET ?", data);
            console.log("Query: " + query);
            db.query(query, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err })
                    return;
                }
                if (result.affectedRows === 1) {
                    res.json({ success: true });
                    return;
                }
            })
        } else {
            res.status(400).json(errors)
            return;
        }
    });
});

module.exports = router;