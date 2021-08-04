const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const bcrypt = require("./bcrypt");
const cookieSession = require('cookie-session');
const db = require("./db");
const cryptoRandomString = require('crypto-random-string');


app.use(express.json()); 
app.use(compression());
app.use(cookieSession({
    secret: `set second cookie`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true
}));

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: null//req.session.userId,
    });
});

app.get("/logout", (req,res) => {
    res.json({
        userId: null,
    });

});

app.post("/register", (req,res) => {
    console.log("SERVER: POST/register: req", req.body);
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
        res.json({error: "required input is missing" });
    } else {
        bcrypt.hash(req.body.password)
        .then((result) => {
            return db.userRegister(req.body.firstname,req.body.lastname,req.body.email,result)
            .then((result) => {
                console.log("result rows:", result.rows);
                req.session.userId = result.rows[0].id;
                res.json({success: true});
            })
            .catch((err) => {
                console.log("server post /register userregister error: ", err);
                res.json({success: false})
            }) 
        })
        .catch((err) => {
            console.log("Server post /register bcrypt error:", err);
            res.json({success: false})
        })
    }
});



app.post("/login", (req,res) => {
    if (!req.body.email || !req.body.password) {
        res.json({error: "Required input is missing"});
    } else {
        db.userLogin(req.body.email)
        .then((result) => {
            req.session.firstname = result.rows[0].firstname;
            req.session.lastname = result.rows[0].lastname;
            req.session.userId = result.rows[0].id;

            bcrypt.compare(req.body.password, result.rows[0].hashedpassword)
            .then((result) => {
                if (!result) {
                    res.json({error: "Sorry your password is incorrect!"})
                    req.session = null;
                } else {
                    res.json({success: true})
                    console.log("AFTER Bcrypt req.session: ", req.session)
                }

            })
            .catch((err) => {
                console.log("error in bcryp compare", err);
                res.json({error: "Either your email or your password is incorrect"})
            })

        })
        .catch((err) => {
            console.log("userlogin error: ", err)
            res.json({error: "We could not find your konto. Please register first!"})
        })
    }
});


app.post("/reset-password", (req,res) => {
    if (!req.body.email) {
        res.json({error: "Required input is missing"});
    } else {
        db.userLogin(req.body.email)
        .then((result)=> {
            console.log("result.rows", result.rows)
            let secretCode = cryptoRandomString({length: 6});
            db.userCode(result.rows[0].email, secretCode)
            .then()



        })
        .catch((err) => {
            res.json({error: "User not found"});
            console.log("SERVER ERROR RESET PASSWORD GET USER: ", err)
        })
    }


});



app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});



app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening on Port 3000.");
});
