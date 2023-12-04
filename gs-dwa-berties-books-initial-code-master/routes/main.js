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
    app.get('/search-result', function (req, res) {
        //searching in the database
        res.send("You searched for: " + req.query.keyword);
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
}
