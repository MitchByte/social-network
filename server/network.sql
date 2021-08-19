DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS messages;


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    imageurl VARCHAR,
    bio VARCHAR,
    hashedpassword VARCHAR NOT NULL
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships(
   id SERIAL PRIMARY KEY,
   sender_id INT REFERENCES users(id) NOT NULL,
   recipient_id INT REFERENCES users(id) NOT NULL,
   accepted BOOLEAN DEFAULT false
);

CREATE TABLE messages(
   id SERIAL PRIMARY KEY,
   text VARCHAR,
   user_id INT REFERENCES users(id) NOT NULL ,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
