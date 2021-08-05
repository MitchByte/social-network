const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const bcrypt = require("./bcrypt");
const cookieSession = require('cookie-session');
const db = require("./db");
const cryptoRandomString = require('crypto-random-string');
const ses = require("./ses");


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
                    res.json({error: "Sorry your password is incorrect!"});
                    req.session = null;
                } else {
                    res.json({success: true});
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
            let secretCode = cryptoRandomString({length: 6});
            console.log("result.rows[0].email, secretCode", result.rows[0].email, secretCode)
            db.userCode(result.rows[0].email, secretCode)
            .then(()=> {
                let mail = 'cautious.tire@spicedling.email'
                let message = `Here is your code to reset your password: ${secretCode}. This code will expire within 10 minutes.`;
                let subject= "Koisa - Reset password";
                ses.sendEmail(mail,message,subject);
                res.json({success: true});
            })
            .catch((err) => {
                console.log("SERVER: insert code error: ", err)
            })
        })
        .catch((err) => {
            res.json({error: "User not found"});
            console.log("SERVER ERROR RESET PASSWORD GET USER: ", err)
        })
    }
});

app.post("/reset-password/verify", (req,res)=> {
    console.log("password verify: REQ:BODY: ", req.body)
    if(!req.body.code || !req.body.newPassword) {
        res.json({error: "Required input is missing"})
    } else {
        db.getCode()
        .then((result) => {
            console.log("code result", result.rows)
            if (req.body.code == result.rows[result.rows.length -1].code){
                res.json({success:true})
            } else {
                res.json({
                    error: "Your code is invalid",
                    success: false
                })
                
            }
        })

    }
})



app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});



app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening on Port 3000.");
});
