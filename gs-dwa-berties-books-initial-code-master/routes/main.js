module.exports = function(app, forumData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', forumData)
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', forumData);
    });
    app.get('/search',function(req,res){
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
    const sqlqueryExact = `SELECT * FROM posts WHERE text = ?`;
    const sqlqueryPartial = `SELECT * FROM posts WHERE text LIKE ?`;

    db.query(sqlqueryExact, queryParamExact, (errExact, resultExact) => {
        if (errExact) {
            console.error('Error executing exact match SQL query:', errExact);
            return;
        }

        if (resultExact.length > 0) {
            res.render("search-result.ejs", Object.assign({}, forumData, { result: resultExact, message: null }));
        } else {
            db.query(sqlqueryPartial, queryParamPartial, (errPartial, resultPartial) => {
                if (errPartial) {
                    console.error('Error executing partial match SQL query:', errPartial);
                    return;
                }

                const message = resultPartial.length > 0 ? null : 'No matching results found.';
                res.render("search-result.ejs", Object.assign({}, forumData, { result: resultPartial, message: message }));
            });
        }
    });
});
    app.get('/register', function (req,res) {
        res.render('register.ejs', forumData);                                                                     
    });                                                                                                 
    app.post('/registered', function (req,res) {
        // saving data in database
        res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);                                                                              
    }); 
    app.get('/posts', function(req, res) {
        let sqlquery = "SELECT * FROM posts"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            // The Object.assign() call merges the shopData object with the new {availableBooks:result} 
            // object to create a new object called newData.
            //   This is all our data packaged up, ready to pass to the ejs file.
            let newData = Object.assign({}, forumData, { availablePosts: result });
            //console.log(newData)
            res.render("posts.ejs", newData);
        });
    });

    app.get('/users', function(req, res) {
        let sqlquery = "SELECT * FROM users"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
           // The Object.assign() call merges the shopData object with the new {availableBooks:result} 
            // object to create a new object called newData.
            //   This is all our data packaged up, ready to pass to the ejs file.
            let newData = Object.assign({}, forumData, { ourUsers: result });
            //console.log(newData)
            res.render("users.ejs", newData);
        });
    });

    app.get('/topics', function(req, res) {
        let sqlquery = "SELECT * FROM topics"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            // The Object.assign() call merges the shopData object with the new {availableBooks:result} 
            // object to create a new object called newData.
            //   This is all our data packaged up, ready to pass to the ejs file.
            let newData = Object.assign({}, forumData, { availableTopics: result });
            //console.log(newData)
            res.render("topics.ejs", newData);
        });
    });

    

    // Add book page route
    app.get('/addpost', function (req, res) {
        res.render("addpost.ejs", forumData);
    });

    // Book added post route
    app.post('/postadded', function (req, res) {
        // saving data in the database
        let sqlquery = "INSERT INTO posts (user_id, topic_id, text) VALUES (?, ? , ?)"; // add the book with value name and price should not be null 
        // execute sql query
        let newrecord = [req.body.user_id, req.body.topic_id,req.body.text];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            } else {
                res.send(' This book is added to the database, name: '
                    + req.body.user_id + ' user Number add somthing about' + req.body.topic_id + 'Is says ' + req.body.text);
            }
        });
    });



}
