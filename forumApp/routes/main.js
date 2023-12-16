module.exports = function (app, forumData) {

    // Handle our routes
    app.get('/', function (req, res) {
        res.render('index.ejs', forumData)
    });
    app.get('/about', function (req, res) {
        res.render('about.ejs', forumData);
    });
    app.get('/search', function (req, res) {
        res.render("search.ejs", forumData);
    });
    /*
    This route handles the search functionality for books based on a given keyword.
    It first attempts to find an exact match for the keyword in the database.
    If an exact match is found, it renders the "search-result.ejs" template with the exact match result.
    If no exact match is found, it performs a partial match search and renders the template with the partial match result.
    If there are still no matches, it includes a message indicating that no results were found.
    The rendered template includes the search results and an optional message, and it is combined with the existing shopData for display.
    */

    // Search result route
    app.get('/search-result', function (req, res) {
        const searchKeyword = req.query.keyword;
        const queryParamExact = [searchKeyword];
        const queryParamPartial = ['%' + searchKeyword + '%'];
        const sqlqueryExact = `SELECT * FROM posts WHERE post_text = ?`;
        const sqlqueryPartial = `SELECT * FROM posts WHERE post_text LIKE ?`;

        db.query(sqlqueryExact, queryParamExact, (errExact, resultExact) => {
            if (errExact) {
                console.error('Error executing exact match SQL query:', errExact);
                return;
            }

            if (resultExact.length > 0) {
                res.render("search-result.ejs", Object.assign({}, forumData, {
                    result: resultExact,
                    message: null
                }));
            } else {
                db.query(sqlqueryPartial, queryParamPartial, (errPartial, resultPartial) => {
                    if (errPartial) {
                        console.error('Error executing partial match SQL query:', errPartial);
                        return;
                    }

                    const message = resultPartial.length > 0 ? null : 'No matching results found.';
                    res.render("search-result.ejs", Object.assign({}, forumData, {
                        result: resultPartial,
                        message: message
                    }));
                });
            }
        });
    });
    app.get('/register', function (req, res) {
        res.render('register.ejs', forumData);
    });


    app.post('/registered', function (req, res) {
        // Get user registration data from the request body
        const {
            first,
            last,
            email
        } = req.body;

        // Perform validation on user input
        if (!first || !last || !email) {
            return res.status(400).json({
                error: 'Invalid input. Please provide first name, last name, and email.'
            });
        }

        // Insert the user data into the 'users' table
        const user_name = `${first.charAt(0)}${last.slice(0, 4)}`; //registered_date
        const insertUserQuery = 'INSERT INTO users (user_name, user_email, registered_date) VALUES (?, ?, ?)';
        const userValues = [user_name, email, new Date().toISOString().slice(0, 19).replace('T', ' ')];

        db.query(insertUserQuery, userValues, (err, result) => {
            if (err) {
                console.error('Error inserting user into database:', err);
                return res.status(500).json({
                    error: 'Error registering user'
                });
            }

            // Assuming the user is successfully inserted, send a registration success message
            res.json({
                message: `Hello ${first} ${last}, your user name is ${user_name}. You are now registered! We will send an email to you at ${email}`
            });
        });
    });


    app.get('/users', function (req, res) {
        let sqlquery = "SELECT * FROM users"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            // The Object.assign() call merges the shopData object with the new {availableBooks:result} 
            // object to create a new object called newData.
            //   This is all our data packaged up, ready to pass to the ejs file.
            let newData = Object.assign({}, forumData, {
                ourUsers: result
            });
            //console.log(newData)
            res.render("users.ejs", newData);
        });
    });

    app.get('/topics', function (req, res) {
        let sqlquery = "SELECT * FROM topics"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            // The Object.assign() call merges the shopData object with the new {availableBooks:result} 
            // object to create a new object called newData.
            //   This is all our data packaged up, ready to pass to the ejs file.
            let newData = Object.assign({}, forumData, {
                availableTopics: result
            });
            //console.log(newData)
            res.render("topics.ejs", newData);
        });
    });


    // Add post page route
    app.get('/addpost', function (req, res) {
        res.render("addpost.ejs", forumData);
    });

    //  addpost route
    app.post('/addpost', function (req, res) {
        // saving data in the database
        let sqlquery = "SELECT user_id FROM users WHERE user_name = ?"; // add the book with value name and price should not be null 
        // execute sql query
        let newrecord = [req.body.username];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            user_id = result[0].user_id;

            let sqlquery = "SELECT topic_id FROM topics WHERE topic_name = ?"; // add the book with value name and price should not be null 
            // execute sql query
            let newrecord = [req.body.topicname];
            db.query(sqlquery, newrecord, (err, result1) => {
                if (err) {
                    return console.error(err.message);
                }
                topic_id = result1[0].topic_id;

                let sqlquery = "INSERT INTO posts(post_text,user_id,topic_id) Values(?,?,?)"; // add the book with value name and price should not be null 
                // execute sql query
                let newrecord = [req.body.post_text, user_id, topic_id];
                db.query(sqlquery, newrecord, (err, result2) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    res.send('Thanks You have add a post successfully');

                });

            });

        });

    });



    app.get('/posts', function (req, res) {
        let sqlquery = "SELECT posts.post_id, posts.post_text, users.user_id AS poster_id, users.user_name AS poster_name, topics.topic_id, topics.topic_name FROM posts JOIN users ON posts.user_id = users.user_id JOIN topics ON posts.topic_id = topics.topic_id"; // query database to get all the books

        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
                return; // Return early in case of an error
            }




            // The Object.assign() call merges the forumData object with the new {availablePosts: result} 
            // object to create a new object called newData.
            // This is all our data packaged up, ready to pass to the ejs file.
            let newData = Object.assign({}, forumData, {
                availablePosts: result
            }, );
            //console.log(newData);
            res.render("posts.ejs", newData);
        });
    });


    app.get('/addreply', function (req, res) {
        let sqlquery2 = `SELECT p.post_id,
                            p.post_text,
                            u.user_id AS poster_id,
                            u.user_name AS poster_name,
                            t.topic_id,
                            t.topic_name,
                            (SELECT GROUP_CONCAT(CONCAT(r.reply_text, ' by ', ru.user_name) SEPARATOR ', ') 
                            FROM reply r JOIN users ru ON r.user_id = ru.user_id WHERE r.post_id = p.post_id) AS replies
                            FROM posts p
                            JOIN users u ON p.user_id = u.user_id
                            JOIN topics t ON p.topic_id = t.topic_id`;
    
        // Corrected query to fetch replies
        db.query(sqlquery2, (err, result2) => {
            if (err) {
                res.redirect('./');
                return; // Return early in case of an error
            }
    
            // Render the addreply.ejs template with availableReply data
            res.render("addreply.ejs", { forumData: forumData, availableReply: result2 });
        });
    });
    

    //  addpost route
    app.post('/addreply', function (req, res) {
              // saving data in the database
        let sqlquery = "SELECT user_id FROM users WHERE user_name = ?"; // add the book with value name and price should not be null 
        // execute sql query
        let newrecord = [req.body.username];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            user_id = result[0].user_id;

            let sqlquery = "SELECT topic_id FROM topics WHERE topic_name = ?"; // add the book with value name and price should not be null 
            // execute sql query
            let newrecord = [req.body.topicname];
            db.query(sqlquery, newrecord, (err, result1) => {
                if (err) {
                    return console.error(err.message);
                }
                topic_id = result1[0].topic_id;

                let sqlquery = "SELECT post_id FROM posts WHERE post_id = ?"; // add the book with value name and price should not be null 
                // execute sql query
                let newrecord = [req.body.postid];
                db.query(sqlquery, newrecord, (err, resultp) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    post_id = resultp[0].post_id;

                    let sqlquery = "INSERT INTO reply(reply_text,post_id,user_id,topic_id) Values(?,?,?,?)"; // add the book with value name and price should not be null 
                    // execute sql query
                    let newrecord = [req.body.replytext, post_id, user_id, topic_id];
                    db.query(sqlquery, newrecord, (err, result2) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        res.send('Thanks You have add a reply successfully');

                    });
                });
            });
        });
    });
}