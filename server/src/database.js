const mysql = require('mysql');

class Database {
    constructor(){
        this.host = process.env.DB_ADDRESS;
        this.user = process.env.DB_USERNAME;
        this.password = process.env.DB_PASSWORD;
    }

    connect(){
        var con = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password
          });
        con.connect(function(err){
            if (err) throw err;
            console.log("Successfully connected to database");
        })
        return con;
    }

    // random number between 0-999999;
    getRandomId(){
        return Math.floor(Math.random() * 10000000);
    }
}

module.exports = Database;