const express = require('express');
const path = require('path');
const app = express();
const port = 3005;
const fs= require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.text());



// Serve static files
app.use('/frontend', express.static('frontend'));


// Middleware do ustawiania Content-Type z UTF-8
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});

app.use(express.static(path.join(__dirname)));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pracownicy.html', (req, res) => {
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

// Start the server
app.listen(port, () => {
    console.log(`Application is listening at http://localhost:${port}`);
});

app.post('/save-to-repository', (req, res) => {
    const csvContent = req.body;

    fs.writeFile('frontend/Listapracowników.csv', csvContent, 'utf8', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Wystąpił błąd podczas zapisywania danych.');
        } else {
            res.send('Dane zostały zapisane pomyślnie.');
        }
    });
});

app.get('/get-csv-data', (req, res) => {
    fs.readFile('frontend/Listapracowników.csv', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Wystąpił błąd podczas odczytu danych.');
            return;
        }
        res.send(data);
    });
});