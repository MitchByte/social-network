const spicedPg = require("spiced-pg");
const db = spicedPg(process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/petition");


module.exports.userRegister = (first, last, email, hashedpw) => {
    return db.query(`INSERT INTO users (firstname, lastname, email, hashedpassword) VALUES ($1, $2, $3, $4) RETURNING id`,
    [first, last, email, hashedpw])
}
