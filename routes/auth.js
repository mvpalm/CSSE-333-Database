import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import db from '../db';
import mysql from 'mysql';
var isEmpty = require('lodash/isEmpty');

let router = express.Router();

function validateInput(body) {
    let errors = {}
    console.log("Body: ", body);
    return new Promise((resolve, reject) => {
        if (body.Address1.length === 0) {
            errors.address1 = "Address1 cannot be empty";
        }
        if (body.State.length === 0) {
            errors.form = "Must enter state";
        }
        if (body.City.length === 0) {
            errors.form = "Must enter city";
        }
        if (body.zipCode.length === 0) {
            errors.zipCode = "Zip code cannot by empty";
        }
        resolve({
            errors,
            isValid: isEmpty(errors)
        })
    })
}


router.post("/Submit", (req, res) => {
    const authorizationHeader = req.headers['authorization'];
    let token = authorizationHeader.split(' ')[1];
    if (token) {
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
                console.log(err);
                res.status(500);
                return;
            }
            const companyID = decoded.id;
            validateInput(req.body).then(({ errors, isValid }) => {
                if (isValid) {
                    const { Address1, Address2, State, City, zipCode } = req.body;
                    console.log("valid");
                    db.query(mysql.format("UPDATE companies SET address_line1 = ?, address_line2 = ?, state= ?, city= ?, zipCode= ?, init= 1 WHERE id = ?", [Address1, Address2, State, City, Number(zipCode), companyID]), (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            return;
                        } else {
                            res.sendStatus(200);
                            return;
                        }
                    })
                } else {
                    res.status(400).json(errors)
                    return;
                }
            }).catch((errors) => {
                res.status(400).json(errors);
                return;
            })
        })
    } else {
        res.status(401).json({ error: "User credentials invalid" });
    }
});

router.get('/', (req, res) => {
    const id = req.query.id;
    db.query(mysql.format("SELECT init FROM companies WHERE id = ?", [id]), (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ err });
            return;
        } else {
            res.json({ result: result[0] });
            return;
        }
    })
})
router.post('/', (req, res) => {
    const { email, password } = req.body;
    let query = mysql.format("SELECT * FROM companies WHERE email = ?", [email]);
    db.query(query, (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length === 1) {
            if (bcrypt.compareSync(password, result[0].password_digest)) {
                const token = jwt.sign({
                    id: result[0].id,
                    companyName: result[0].name
                }, config.jwtSecret);
                console.log("return token: ", token);
                res.json({ token });
            } else {
                res.status(401).json({ form: 'invalid credentials' })
            }
        } else {
            res.status(401).json({ form: 'invalid credentials' })
        }
    })
});
module.exports = router;