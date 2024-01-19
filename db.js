const mongoose = require('mongoose');

// Database
const DB_URL = "mongodb+srv://assurance:kUnHHe6RI5dWS2VZ@cluster0.miuwv1w.mongodb.net/bills" 

console.log("Connecting to database: %s", DB_URL);

mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'db connection error'));

// Export
module.exports = db;