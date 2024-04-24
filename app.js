const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Dane otrzymane przez POST');
});

app.listen(port, () => {
    console.log(`Application is listening at http://localhost:${port}`);
});

function newFunction(res) {
    res.setHeader('Content-Type', 'text/css');
}
