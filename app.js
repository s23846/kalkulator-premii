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

app.get('/projekty.html', (req, res)=>{
    res.sendFile(path.join(__dirname, 'frontend', 'projekty.html'));
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

app.post('/save-employee-data', (req, res) => {
    const newRecords = req.body.split('\n').filter(line => line.trim() !== "");
    const filePath = 'frontend/rozliczeniePracownika.csv';

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Wystąpił błąd podczas odczytu danych.');
            return;
        }

        const existingRecords = data.split('\n').filter(line => line.trim() !== "");
        const header = existingRecords.shift();
        const combinedRecords = new Map();

        existingRecords.forEach(record => {
            const [id, imie, nazwisko, rok, miesiac, godziny, wynagrodzenie] = record.split(',');
            const key = `${id}-${rok}-${miesiac}`;
            combinedRecords.set(key, record);
        });

        newRecords.forEach(record => {
            const [id, imie, nazwisko, rok, miesiac, godziny, wynagrodzenie] = record.split(',');
            const key = `${id}-${rok}-${miesiac}`;
            combinedRecords.set(key, record);
        });

        const updatedRecords = [header, ...combinedRecords.values()].join('\n');

        fs.writeFile(filePath, updatedRecords, 'utf8', err => {
            if (err) {
                console.error(err);
                res.status(500).send('Wystąpił błąd podczas zapisywania danych.');
            } else {
                res.send('Dane zostały zapisane pomyślnie.');
            }
        });
    });
});


app.get('/get-saved-data', (req, res) => {
    fs.readFile('frontend/rozliczeniePracownika.csv', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Wystąpił błąd podczas odczytu danych.');
            return;
        }
        res.send(data);
    });
});

app.post('/save-data-project-to-repository', (req, res) => {
    const csvContent = req.body;
    console.log("Otrzymane dane CSV:", csvContent); // Loguj otrzymane dane

    // Dodaj sprawdzenie, czy dane są prawidłowe
    if (!csvContent || csvContent.trim() === "") {
        console.error('Otrzymane dane są puste.');
        return res.status(400).send('Otrzymane dane są puste.');
    }

    fs.writeFile('frontend/listaProjektów.csv', csvContent, 'utf8', (err) => {
        if (err) {
            console.error('Błąd podczas zapisywania pliku:', err);
            res.status(500).send('Wystąpił błąd podczas zapisywania danych.');
        } else {
            res.send('Dane zostały zapisane pomyślnie.');
        }
    });
});


app.get('/get-data-project-from-repository', (req, res) => {
    fs.readFile('frontend/listaProjektów.csv', 'utf8', (err, data) => {
        if (err) {
            console.error('Błąd podczas odczytu pliku:', err);
            res.status(500).send('Wystąpił błąd podczas odczytu danych.');
            return;
        }
        res.send(data);
    });
});

app.post('/update-project-profitability', (req, res) => {
    console.log(req.body);
    const {projectId, projectName, profitabilityData } = req.body;

    // Walidacja danych wejściowych
    if (!projectId || !projectName || !profitabilityData) {
        console.error('Brakujące dane: ID, nazwa projektu lub dane rentowności.');
        return res.status(400).send('Brakujące dane: ID, nazwa projektu lub dane rentowności.');
    }

    if (!/^\d+$/.test(projectId)) { // Sprawdza, czy ID składa się tylko z cyfr
        console.error('Nieprawidłowe ID projektu.');
        return res.status(400).send('Nieprawidłowe ID projektu.');
    }

    if (typeof projectName !== 'string' || projectName.trim().length === 0) {
        console.error('Nieprawidłowa nazwa projektu.');
        return res.status(400).send('Nieprawidłowa nazwa projektu.');
    }

    // Sanitacja danych
    const cleanProjectName = projectName.replace(/,|;|\r?\n|\r/g, ' '); // Usuwa przecinki, średniki i nowe linie
    const cleanProfitabilityData = profitabilityData; // Usuwa przecinki, średniki i nowe linie

    const filePath = 'frontend/listaRentownościProjektu.csv';

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Błąd odczytu pliku:', err);
            return res.status(500).send('Błąd serwera.');
        }

        const lines = data.split('\n').filter(line => line.trim() !== '');
        let updated = false;

        const newData = lines.map(line => {
            const [existingId, existingProjectName, ...rest] = line.split(',');

            if (existingId === projectId && existingProjectName === cleanProjectName) {
                updated = true;
                return `${projectId},${cleanProjectName},${cleanProfitabilityData}`;
            }

            return line;
        });

        if (!updated) {
            newData.push(`${projectId},${cleanProjectName},${cleanProfitabilityData}`);
        }

        const updatedData = newData.join('\n');

        fs.writeFile(filePath, updatedData, 'utf8', err => {
            if (err) {
                console.error('Błąd zapisu pliku:', err);
                return res.status(500).send('Błąd serwera.');
            }

            res.send('Dane zostały zaktualizowane pomyślnie.');
        });
    });
});

app.get('/get-data-project-profitability-from-repository', (req, res) => {
    fs.readFile('frontend/listaRentownościProjektu.csv', 'utf8', (err, data) => {
        if (err) {
            console.error('Błąd podczas odczytu pliku:', err);
            res.status(500).send('Wystąpił błąd podczas odczytu danych.');
            return;
        }
        res.send(data);
    });
});

app.get('/get-data-employee-from-repository-to-project', (req, res) => {
    fs.readFile('frontend/Listapracowników.csv', 'utf8', (err, data) => {
        if (err) {
            console.error('Błąd podczas odczytu pliku:', err);
            res.status(500).send('Wystąpił błąd podczas odczytu danych.');
            return;
        }
        res.send(data);
    });
});

app.post('/update-employee-assignments', (req, res) => {
    console.log(req.body);
    const { projectId, projectName, employees } = req.body;

    // Walidacja danych wejściowych
    if (!projectId || !projectName || !employees || employees.length === 0) {
        console.error('Brakujące dane: ID projektu, nazwa projektu lub dane pracowników.');
        return res.status(400).send('Brakujące dane: ID projektu, nazwa projektu lub dane pracowników.');
    }

    if (!/^\d+$/.test(projectId)) { // Sprawdza, czy ID składa się tylko z cyfr
        console.error('Nieprawidłowe ID projektu.');
        return res.status(400).send('Nieprawidłowe ID projektu.');
    }

    if (typeof projectName !== 'string' || projectName.trim().length === 0) {
        console.error('Nieprawidłowa nazwa projektu.');
        return res.status(400).send('Nieprawidłowa nazwa projektu.');
    }

    // Sanitacja nazwy projektu
    const cleanProjectName = projectName.replace(/,|;|\r?\n|\r/g, ' ');

    // Przygotowanie danych pracowników do zapisu
    const employeeData = employees.map(employee => `${employee.employeeId},${employee.employeeName},${employee.employeeSurname}`).join(';');

    const filePath = 'frontend/listaPraconikówPerProjekt.csv';

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Błąd odczytu pliku:', err);
            return res.status(500).send('Błąd serwera.');
        }

        const lines = data.split('\n').filter(line => line.trim() !== '');
        let updated = false;

        const newData = lines.map(line => {
            const [existingId, existingProjectName, ...rest] = line.split(',');

            if (existingId === projectId && existingProjectName === cleanProjectName) {
                updated = true;
                return `${projectId},${cleanProjectName},${employeeData}`;
            }

            return line;
        });

        if (!updated) {
            newData.push(`${projectId},${cleanProjectName},${employeeData}`);
        }

        const updatedData = newData.join('\n');

        fs.writeFile(filePath, updatedData, 'utf8', err => {
            if (err) {
                console.error('Błąd zapisu pliku:', err);
                return res.status(500).send('Błąd serwera.');
            }

            res.send('Dane zostały zaktualizowane pomyślnie.');
        });
    });
});