const spicedPg = require("spiced-pg");
const db = spicedPg(process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/network");


module.exports.userRegister = (first, last, email, hashedpw) => {
    return db.query(`INSERT INTO users (firstname, lastname, email, hashedpassword) VALUES ($1, $2, $3, $4) RETURNING id;`,
    [first, last, email, hashedpw])
}

module.exports.userLogin = (mail) => {
    return db.query(`SELECT * FROM users WHERE email = '${mail}';`)
}

module.exports.userCode = (email,code) => {
    return db.query(`INSERT INTO reset_codes (email,code) VALUES ($1, $2) ;`,
    [email,code])
}

module.exports.getCode = () => {
    return db.query(`SELECT * FROM reset_codes WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes';`)
}

module.exports.getUser = (id)  => {
    return db.query(`SELECT id,firstname,lastname,email,imageUrl,bio FROM users WHERE id = ${id};`)
}

module.exports.uploadImage = (url,id) => {
    return db.query(`UPDATE users SET imageurl = $1 WHERE id = ${id} RETURNING imageurl;`,
                    [url]) 
}

module.exports.userBio= (bio,id) => {
    return db.query(`UPDATE users SET bio = $1 WHERE id = ${id} RETURNING bio;`,
    [bio])
}

module.exports.getUserLimitDesc = () => {
    return db.query(`SELECT id,firstname,lastname,imageUrl FROM users ORDER BY id DESC LIMIT 3;`)
}

module.exports.searchedUsers = (val) => {
    return db.query(`SELECT * FROM users WHERE (firstname || ' ' || lastname) ILIKE $1 LIMIT 20;`,
    [val + '%'])
}

module.exports.getFriendshipStatus = (recipient_id ,sender_id) => {
    return db.query(`SELECT * FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1);`,
    [recipient_id ,sender_id])
}

module.exports.sendRequest = (sender_id, recipient_id, request) => {
    return db.query(`INSERT INTO friendships (sender_id, recipient_id ,accepted) VALUES ($1, $2, $3) RETURNING accepted;`,
    [sender_id, recipient_id, request])
}

module.exports.cancelRequest = (sender_id, recipient_id) => {
    return db.query(`DELETE FROM friendships WHERE sender_id = $1 AND recipient_id =$2`,
    [sender_id, recipient_id])
}

module.exports.updateFriendship = (sender_id, recipient_id, request) => {
    return db.query(`UPDATE friendships SET accepted = $3 WHERE sender_id = $1 AND recipient_id = $2 RETURNING accepted;`,
    [sender_id, recipient_id, request])
}

module.exports.receiveFriendsAndWannabees = (id) => {
    return db.query(`SELECT users.id, firstname, lastname, imageurl, accepted FROM friendships JOIN users ON (accepted = FALSE AND recipient_id = $1 AND sender_id = users.id) OR
                (accepted = TRUE AND recipient_id = $1 AND sender_id = users.id) OR
                (accepted = TRUE AND sender_id = $1 AND recipient_id = users.id)`,
                [id])
}

module.exports.addMessage = (text,userId) => {
    return db.query(`INSERT INTO messages (text,user_id) VALUES ($1, $2)`,
    [text, userId])
}

module.exports.getLastTenMessages = () => {
    return db.query(`SELECT firstname, lastname, imageurl, text, created_at, user_id 
        FROM messages 
        JOIN users ON users.id = messages.user_id
        ORDER BY created_at DESC
        LIMIT 10;`)
}