-- # Insert data into the tables

-- USE myBookshop;

-- INSERT INTO books (name, price)VALUES('database book', 40.25),('Node.js book', 25.00), ('Express book', 31.99) ;
INSERT INTO users (user_id, user_name, user_email) VALUES
(1, 'JohnDoe', 'john@example.com'),
(2, 'JaneSmith', 'jane@example.com');

INSERT INTO topics (topic_id, topic_name) VALUES
(1, 'JavaScript'),
(2, 'Python');

INSERT INTO posts (post_id, text, topic_id, user_id) VALUES
(1, 'I love JavaScript because...', 1, 1),
(2, 'Python is my favorite language. Here\why...', 2, 2);
