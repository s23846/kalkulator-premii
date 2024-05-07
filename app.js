const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Database connection (adjust the credentials and DB name)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db'
});

db.connect((err) => {
    if (err) {
        console.error('B³¹d po³¹czenia z baz¹ danych:', err);
    } else {
        console.log('Po³¹czono z baz¹ danych MySQL.');
    }
});

// Serve static files
app.use('/frontend', express.static('frontend'));
app.use('/frontend/Header', express.static('Header'));


// Middleware do ustawiania Content-Type z UTF-8
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});

app.use(express.static(path.join(__dirname)));

app.get('frontend/Header/header.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(path.join(__dirname, 'frontend', 'Header', 'header.html'));
});

app.get('/frontend/Header/header.css', (req, res) => {
    newFunction(res);
    res.sendFile(path.join(__dirname, 'frontend', 'Header', 'header.css'));
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('frontend/pracownicy.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'pracownicy.html'));
});

app.get('/rozliczenia.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'rozliczenia.html'));
});

app.get('/premie.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'premie.html'));
});

app.get('/podsumowanie.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'podsumowanie.html'));
});

// Middleware for parsing form and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// POST route for form submissions (example)
app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Dane otrzymane przez POST');
});

// API endpoint to get employee data
app.get('/api/employees', (req, res) => {
    const query = `SELECT * FROM Pacownik LIMIT 1`; // Adjust the table name
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Query error:', error);
            return res.status(500).json({ error: 'Database query error' });
        }
        // If no data, return a null record
        if (results.length === 0) {
            return res.json([{
                ID_pracownika: null,
                Imiê: null,
                Nazwisko: null,
                Stanowisko: null,
                Rodzaj_zatrudnienia: null,
                Stawka_godz_brutto: null
            }]);
        }
        // Return data as JSON
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Application is listening at http://localhost:${port}`);
});

function newFunction(res) {
    res.setHeader('Content-Type', 'text/css');
}
