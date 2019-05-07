// =============
// PUERTO
// =============
process.env.PORT = process.env.PORT || 3000;

// =============
// ENTORNO 
// =============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============
// DB
// =============
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //urlDB = 'mongodb+srv://joseluis:eh6nEwiAbba9zxI2@cluster0-vz2q4.mongodb.net/cafe';
    // COn vatiables de entorno de heroku
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;