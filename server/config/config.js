// =============
// PUERTO
// =============
process.env.PORT = process.env.PORT || 3000;

// =============
// ENTORNO 
// =============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =============
// VENCIMIENTO DEL TOKEN 
// =============
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// =============
// SEED - Semilla de autenticacion 
// =============
process.env.SEED = process.env.SEED || 'este-es-la-semilla-para-el-desarrollo';

// =============
// GOGLE_CLIENT
// =============
process.env.CLIENT_ID = process.env.CLIENT_ID || '908946070543-6qsv5dpbfs60npmclvk0s7dmn0hne7k8.apps.googleusercontent.com';


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