import jwt, { decode } from 'jsonwebtoken';
import config from '../config';
import db from '../db';
import mysql from 'mysql';

export default (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    let token;

    if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
    }

    if (token) {
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Failed to authenticate' });
            } else {
                console.log(decoded.id)
                let query = mysql.format("SELECT name FROM companies WHERE id = ?", [decoded.id]);
                console.log("query: ", query);
                db.query(query, (err, results) => {
                    if (err) {
                        res.status(500).json(err);
                    }
                    if (results.length === 0) {
                        res.status(404).json({ error: 'User Does Not Exist' });
                    }
                    console.log("result: ", results[0].name);
                    console.log(req.companyName);
                    req.companyName = results[0].name;
                    console.log("good");
                    next();
                });
            }
        });
    } else {
        res.status(403).json({
            error: 'No token provided'
        });
    }
}