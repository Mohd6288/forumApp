-- # Create database script for Berties books

-- # Create the database
-- CREATE DATABASE myBookshop;
-- USE myBookshop;

-- # Create the tables
-- CREATE TABLE books (id INT AUTO_INCREMENT,name VARCHAR(50),price DECIMAL(5, 2) unsigned,PRIMARY KEY(id));
-- create_db.sql

-- Use your database
USE forumapp;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS topics (
    topic_id INT PRIMARY KEY,
    topic_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS posts (
    post_id INT PRIMARY KEY,
    text VARCHAR(1000),
    topic_id INT,
    user_id INT,
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

