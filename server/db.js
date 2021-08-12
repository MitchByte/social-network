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
    return db.query(`SELECT id,firstname,lastname,email,imageUrl,bio FROM users WHERE id = ${id}`)
}

module.exports.uploadImage = (url,id) => {
    return db.query(`UPDATE users SET imageurl = $1 WHERE id = ${id} RETURNING imageurl`,
                    [url]) 
}

module.exports.userBio= (bio,id) => {
    return db.query(`UPDATE users SET bio = $1 WHERE id = ${id} RETURNING bio`,
    [bio])
}

module.exports.getUserLimitDesc = (id) => {
    return db.query(`SELECT id,firstname,lastname,imageUrl, (SELECT id FROM users ORDER BY id ASC LIMIT 1) AS "lowestId" FROM users WHERE id < ${id} ORDER BY id DESC LIMIT 3;`)
}