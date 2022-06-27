const express =require('express');
const router = express.Router();
router.use(express.json());
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
// const cookieParser = require('cookie-parser');
// router.use(cookieParser());

const db = require('./database.js');
// var sql = `USE jwtpractice`;
// db.query(sql, (err, result) => {
//     if(err) throw err;
//     console.log('Database selected');
// });
const userMiddleware =require('./users.js');

router.post('/sign-up', userMiddleware, (req, res) => {
    let sql = `SELECT * FROM userinfo2 WHERE email = '${req.body.email}'`;
    try {
        db.query(sql, (err, result) => {
            if (result.length > 0) return res.send("profile already exist");
            else {
                let sql = `INSERT INTO userinfo2 (name, phone, email, password) VALUES (?, ?, ?, ?)`;
                let count = 0;
                for(let key in Object.keys(req.body)) {
                    count++;
                }
                if(count < 5) {
                    return res.send("ENTER ALL DETAILS");
                }
                db.query(sql, [req.body.name, req.body.phone, req.body.email, req.body.password], (err, result) => {
                    if (err) return res.send(err);
                    else return res.send("profile created");
                });
            }
        });
    } catch(err) {
        return res.send(err);
    }
}); 

router.post('/login', (req, res, next) => {
    let sql = `SELECT * FROM userinfo2 WHERE email = '${req.body.email}'`;
    try {
        db.query(sql, (err, result) => {
            if (result.length <= 0) {
                return res.send("email doesn't exist");
            } else if(result[0].password !== req.body.password) {
                return res.send("incorrect password");
            } else {
                token = jwt.sign(req.body.email, process.env.SECRET_KEY); 
                // res.cookie('token', token, {secure : true, httpOnly : true,});
                process.env.TOKEN = token;
                return res.status(200).send("logged in successfully. token is: " + token)
            }
        });
    } catch(err) {
        return res.send(err);
    }
});

router.get('/profiles', (req, res) => {
    let sql = `SELECT * FROM userinfo2 ORDER BY id`;
    try {
        db.query(sql, (err, result) => {
            return res.send(result);
        })
    } catch(err) {
        return res.send(err);
    }
})

var validate = (req, res, next) => {
    try {
        const token = req.header("Authorization").replace('Bearer', '').trim();
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(req.params.email);
        console.log(req);
        if(req.body.email) {
            console.log(verified);
            console.log(req.body.email);
            if(verified === req.body.email) {
                next();
            } else {
                return res.send("NOT AUTHORIZED TO ACCESS THIS PROFILE");
            } 
        } else {
            if(verified === req.params.email) {
                next();
            } else {
                return res.send("NOT AUTHORIZED TO ACCESS THIS PROFILE");
            }          
        }

    } catch(err) {
        return res.send("INVALID TOKEN");
    }
}

router.get('/profiles/:email', validate, (req, res) => {
    let sql = `SELECT * FROM userinfo2 WHERE email = '${req.params.email}'`;
    try {
        db.query(sql, (err, result) => {
            return res.send(result);
        })
    } catch (err) {
        return res.send(err);
    }
});

router.patch('/update', validate, (req, res) => {
    let email = req.body.email;
    for(let [key, value] of Object.entries(req.body)) {
        if(key != 'email') {
            console.log(key + " " + value);
            let sql = `UPDATE userinfo2 SET ${key} = '${value}' WHERE email = '${email}'`;
            db.query(sql, (err, result) => {
                if(err) throw err;
            });
        }
    }
    return res.send(req.body);
}); 

// router.patch('/update', validate, (req, res) => {
//     var id = req.params.id;
//     var newBook = new Book(req.body);
//     Book.update(id, newBook, function (err, book) {
//       if (err) {
//         res.status(400).send(err);
//       } 
//       console.log("Result : ", book);
//       res.status(200).send(book);
//     });
// });


router.delete('/delete/:email', validate, (req, res) => { 
    let sql = `DELETE FROM userinfo2 WHERE email = '${req.params.email}'`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        return res.send("profile deleted");
    });
});

router.get('/secret-route', (req, res, next) => {
    res.send('logged in users');
});
module.exports = router;