const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const bcrypt = require("./bcrypt");
const cookieSession = require('cookie-session');
const db = require("./db");
const cryptoRandomString = require('crypto-random-string');
const ses = require("./ses");
const s3 = require("./ses");
const multer = require('multer');
const uidSafe = require('uid-safe');
const server = require('http').Server(app);

const io = require('socket.io')(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000"))
});

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 4097152
    }
});

const cookieSessionMiddleware = cookieSession({
    secret: `set second cookie`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true
});

app.use(express.json()); 
app.use(compression());
app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});



app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.get("/user", (req,res) => {
    console.log("server/user : userId:",req.session.userId )
    db.getUser(req.session.userId)
    .then((result) => {
        console.log("SERVER.JS: /user: db.getuser", result.rows[0])
        req.session.bio = result.rows[0].bio;
        req.session.id = result.rows[0].id;
        res.json({
            success:true,
            userObj: result.rows[0]
        })
    })
    .catch((err) => {
        console.log("ERROR: Server/user: getUser:",err);
        res.json({
            success: false
        })
    })
})


app.get("/api/user/:id", (req,res)=> {
    console.log("SERVER.JS/ user/id: req.query:", req.query);

    console.log("SERVER.JS/ user/id: req.params:", req.params);
    db.getUser( req.params.id)
    .then((result)=> {
        console.log("SERVER.JS: user/id/: db.getUser: ", result.rows[0]);
        res.json({
            success:true,
            userObj: result.rows[0]

        })
    })
})

app.get("/find-users", (req,res) => {
    db.getUserLimitDesc()
        .then((result) => {
            console.log("db.getUserLimitDesc: ",result.rows)
            res.json({users: result.rows})
        })
        .catch((err) => {
            console.log("ERROR: SERVER.JS/find-users: db.getUserLimitDesc ", err);
            res.json({error: "Could not find other users."})
        })

})

app.get("/find/:searchTerm", (req,res) => {
    console.log("/find/:searchTerm: .params", req.params.searchTerm);
    db.searchedUsers( req.params.searchTerm)
    .then((result) => {
        console.log("/find/:searchTerm: searchedUsers: ", result.rows);
        res.json({searchTerm: result.rows})
    })
    .catch((err) => {
        console.log("ERROR: /find/searchterm: ", err)
    })
})


app.get("/checkFriendStatus/:otherUserId", (req,res) => {
    console.log("/checkFriendStatus/:otherUserId:  otherUserId", req.params.otherUserId);
    let recipient_id = req.params.otherUserId;
    let sender_id = req.session.id;

    req.session.recipient_id = req.params.otherUserId;

    console.log("/checkFriendStatus/:otherUserId: recipient_id ,sender_id", recipient_id ,sender_id);

    db.getFriendshipStatus(recipient_id ,sender_id)
    .then((result) => {
        console.log("/checkFriendStatus/:otherUserId : db.getFriendshipStatus: ", result.rows);
        res.json({friendshipStatus: result.rows})
    })
    .catch((err) => {
        console.log("ERROR: /checkFriendStatus/:otherUserId: getFriendshipStatus: ", err)
    })
})

app.get("/api/friends", (req,res) => {
    console.log("/api/friends working");

    db.receiveFriendsAndWannabees(req.session.id)
    .then((result) => {
        console.log("friends and wannabees", result.rows);
        res.json({friendsAndWannabees: result.rows});
    })
    .catch((err) => {
        console.log("ERROR in /api/friends: db.receivFriendsAndWannabees", err)
    })
})


app.get("/logout", (req,res) => {
    req.session = null;
    res.redirect("/");
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
            console.log("server.js/login: db.userlogin:",result.rows[0])
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
});


app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    console.log("req.body", req.body);

    if (req.file) {
        let url = "https://s3.amazonaws.com/spicedling/"+req.file.filename;
        
        db.uploadImage(url,req.session.userId)
        .then((result)=> {
            console.log("RESULT insertImage",result.rows);
            res.json({
                success: true,
                imgUrl: url
            });
        })
        .catch((err) => {
            console.log("SERVER.JS / insertImage/ Error:",err)
        });
        
    } else {
        res.json({
            success: false
        });
    }
});

app.post("/profile/bio", (req, res) => {
    console.log("/PROFILE/BIO; REQ:BODY: ", req.body)
    if (req.body.bio){
        db.userBio(req.body.bio, req.session.userId)
        .then((result) => {
            console.log("BIO REsULT:", result.rows);
            res.json({success: true, bio: result.rows[0]})
        })
        .catch((err) => {
            console.log("ERROR: Server.js/profile/bio: userBio: ", err);
            res.json({success: false,
            error: "We are sorry, updating profile does not work at the moment. Please try again later."})
        })
    } else {
        console.log("req.session.bio:",req.session.bio)
        res.json({success: true, bio: req.session.bio})

    }
    
})

app.post("/checkButton/:buttonText", (req,res) => {
    console.log("/checkButton/:buttonText", req.params.buttonText);
    let id_sender = req.session.id;
    let id_recipient = req.session.recipient_id;
    if (req.params.buttonText == "Send Friend Request") {
        let request = false;
        console.log("/checkButton/send request: sender -> recipient: ", id_sender, id_recipient)
        db.sendRequest(id_sender, id_recipient, request)
        .then((result) => {
            console.log("/checkButton/db.sendrequest:  RESULT: ", result.rows[0])
            res.json({accepted: result.rows[0].accepted, recipient:id_recipient})
        })

    }  else if (req.params.buttonText == "Accept friend request") {
        let request = true;
        console.log("/checkButton/update Friendship: sender -> recipient: ", id_sender, id_recipient, "status: ", request)
        //recipient needs to be sender
        db.updateFriendship( id_recipient, id_sender, request)
        .then((result)=> {
            console.log("req.session.id; req.session.recipient_id", req.session.id, req.session.recipient_id)
            console.log("/checkButton/db.updateFriendship:  RESULT: ",result.rows[0]);
            res.json({accepted: result.rows[0].accepted, recipient:id_recipient})
        })
        .catch((err) => {
            console.log("ERROR: post/checkButton/buttontext/ updateFriendship", err);
           
        })

    } else if (req.params.buttonText == "Cancel friend request" || req.params.buttonText == "End friendship" ) {
        db.cancelRequest(id_sender, id_recipient)
        .then(()=> {
            console.log("Friendship deleted")
            res.json({})
        }) 
        .catch((err) => {
            console.log("ERROR: post/checkButton/buttontext/ cancelRequest", err)
        })

    }
})

app.post("/button/:text", (req,res) => {
    let id_sender = req.session.id;
    let id_recipient = req.body.otherId;
    if (req.params.text == "cancel") {
        db.cancelRequest(id_sender, id_recipient)
        .then(()=> {
            console.log("Friendship deleted")
            res.json({success: true})
        }) 
        .catch((err) => {
            console.log("ERROR: post/Button/cancel", err)
        })

    } else if (req.params.text == "accept") {
        let request = true;
        db.updateFriendship( id_recipient, id_sender, request)
        .then((result)=> {
            console.log("/button/db.updateFriendship:  RESULT: ",result.rows[0]);
            res.json({success: true})
        })
        .catch((err) => {
            console.log("ERROR: post/button/ updateFriendship", err);
           
        })
    }
})



app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});



server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening on Port 3000.");
});


io.on('connection', function(socket) {
    console.log(`socket with id: ${socket.id} has connected!`)
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    console.log("socket.request.session.userId",socket.request.session.userId)

    const userId = socket.request.session.userId;

    //db.addMessage(text,userId)
     /*
    db.getLastTenMessages()
    .then(({rows}) => {
        console.log("chatmessages: ", rows)
        socket.emit("chatMessages",rows)})
    .catch((err) => {
        console.log("ERROR: IO: getlasttenmessages: ",err)
    });
    
   
    socket.on("chatMessage", async (data) => {
        const { rows } = await db.addMessage(data, userId);
        io.emit("updateChat", rows);
    });
    */



});