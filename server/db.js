const spicedPg = require("spiced-pg");
const db = spicedPg(process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/network");


module.exports.userRegister = (first, last, email, hashedpw) => {
    return db.query(`INSERT INTO users (firstname, lastname, email, hashedpassword) VALUES ($1, $2, $3, $4) RETURNING id`,
    [first, last, email, hashedpw])
}

module.exports.userLogin = (mail) => {
    return db.query(`SELECT * FROM users WHERE email = '${mail}'`)
}

module.exports.userCode = (email,code) => {
    return db.query(`INSERT INTO reset_codes (email,code) VALUES ($1, $2) `,
    [email,code])
}

module.exports.getCode = () => {
    return db.query(`SELECT * FROM reset_codes WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'`)
}

module.exports.getUser = (id)  => {
    return db.query(`SELECT firstname,lastname,email,imageUrl FROM users WHERE id = ${id}`)
}

module.exports.uploadImage = (url,id) => {
    return db.query(`UPDATE users SET imageurl = $1 WHERE id = ${id} RETURNING imageurl`,
                    [url]) 
}
