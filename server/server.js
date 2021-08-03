const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const bcrypt = require("./bcrypt");
const cookieSession = require('cookie-session');
const db = require("./db");


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
        userId: req.session.userId,
    });
});

app.post("/register", (req,res) => {
    console.log("SERVER: POST/register: req", req.body);
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
        res.json({error: "required input is missing" });
    }
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
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});



app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening on Port 3000.");
});
