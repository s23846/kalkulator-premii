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
    const { projectId, projectName } = req.query;

    if (!projectId || !projectName) {
        return res.status(400).send('Brakujące dane: ID projektu lub nazwa projektu.');
    }

    fs.readFile('frontend/Listapracowników.csv', 'utf8', (err, allEmployeesData) => {
        if (err) {
            console.error('Błąd podczas odczytu pliku pracowników:', err);
            return res.status(500).send('Błąd serwera.');
        }

        fs.readFile('frontend/listaPraconikówPerProjekt.csv', 'utf8', (err, projectAssignmentsData) => {
            if (err) {
                console.error('Błąd podczas odczytu pliku przypisania pracowników:', err);
                return res.status(500).send('Błąd serwera.');
            }

            const allEmployees = allEmployeesData.split('\n').filter(line => line.trim() !== '');
            const projectAssignments = projectAssignmentsData.split('\n').map(line => line.trim()).filter(line => line !== '');

            let assignedEmployeeIds = [];

            let i = 0;
            while (i < projectAssignments.length) {
                const line = projectAssignments[i];
                if (line.startsWith(`Id projektu to: ${projectId}, Nazwa projektu to: ${projectName}`)) {
                    i++;
                    while (i < projectAssignments.length && !projectAssignments[i].startsWith('Id projektu to: ')) {
                        const employeeId = projectAssignments[i].split(',')[0];
                        assignedEmployeeIds.push(employeeId);
                        i++;
                    }
                } else {
                    i++;
                }
            }

            const unassignedEmployees = allEmployees.filter(employee => {
                const employeeId = employee.split(',')[1]; // ID pracownika jest na drugim miejscu
                return !assignedEmployeeIds.includes(employeeId);
            });

            res.send(unassignedEmployees.join('\n'));
        });
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

    const filePath = 'frontend/listaPraconikówPerProjekt.csv';

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Błąd odczytu pliku:', err);
            return res.status(500).send('Błąd serwera.');
        }

        // Usuń puste linie i białe znaki
        const lines = data.split('\n').map(line => line.trim()).filter(line => line !== '');
        let projectFound = false;
        let updatedData = [];
        let newProjectData = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith(`Id projektu to: ${projectId}, Nazwa projektu to: ${cleanProjectName}:`)) {
                projectFound = true;
                updatedData.push(line); // Dodaj nagłówek projektu

                const existingEmployees = [];
                let j = i + 1;

                while (j < lines.length && !lines[j].startsWith('Id projektu to: ')) {
                    existingEmployees.push(lines[j]);
                    j++;
                }

                const existingEmployeeIds = existingEmployees.map(e => e.split(',')[0]);

                const newEmployees = employees.filter(employee => !existingEmployeeIds.includes(employee.employeeId.toString()))
                    .map(employee => `${employee.employeeId},${employee.employeeName},${employee.employeeSurname}`);

                updatedData = updatedData.concat(existingEmployees, newEmployees);
                i = j - 1;
            } else {
                updatedData.push(line);
            }
        }

        if (!projectFound) {
            newProjectData.push(`Id projektu to: ${projectId}, Nazwa projektu to: ${cleanProjectName}:`);
            newProjectData = newProjectData.concat(employees.map(employee => `${employee.employeeId},${employee.employeeName},${employee.employeeSurname}`));
            updatedData = updatedData.concat(newProjectData);
        }

        const finalData = updatedData.join('\n');
        console.log('updatedData:', finalData); // Dodano logowanie zaktualizowanych danych

        fs.writeFile(filePath, finalData, 'utf8', err => {
            if (err) {
                console.error('Błąd zapisu pliku:', err);
                return res.status(500).send('Błąd serwera.');
            }

            res.send('Dane zostały zaktualizowane pomyślnie.');
        });
    });
});

app.get('/get-data-KPI-for-project', (req, res) => {
    const { projectId, projectName } = req.query;

    if (!projectId || !projectName) {
        return res.status(400).send('Brakujące dane: ID projektu lub nazwa projektu.');
    }

    fs.readFile('frontend/listaKPIdlaProjektu.csv', 'utf8', (err, kpiData) => {
        if (err) {
            console.error('Błąd podczas odczytu pliku:', err);
            return res.status(500).send('Wystąpił błąd podczas odczytu danych.');
        }

        const allKpiData = kpiData.split('\n').filter(line => line.trim() !== '');

        let projectKpiData = [];

        let i = 0;
        while (i < allKpiData.length) {
            const line = allKpiData[i];
            if (line.startsWith(`Id projektu to: ${projectId}, Nazwa projektu to: ${projectName}`)) {
                i++;
                while (i < allKpiData.length && !allKpiData[i].startsWith('Id projektu to: ')) {
                    projectKpiData.push(allKpiData[i]);
                    i++;
                }
            } else {
                i++;
            }
        }

        res.send(projectKpiData.join('\n'));
    });
});

app.post('/update-kpi-assignments', (req, res) => {
    console.log(req.body);
    const { projectId, projectName, KPIs } = req.body;

    // Walidacja danych wejściowych
    if (!projectId || !projectName || !KPIs || KPIs.length === 0) {
        console.error('Brakujące dane: ID projektu, nazwa projektu lub dane KPI.');
        return res.status(400).send('Brakujące dane: ID projektu, nazwa projektu lub dane KPI.');
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

    const filePath = 'frontend/listaKPIdlaProjektu.csv';

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Błąd odczytu pliku:', err);
            return res.status(500).send('Błąd serwera.');
        }

        // Usuń puste linie i białe znaki
        const lines = data.split('\n').map(line => line.trim()).filter(line => line !== '');
        let projectFound = false;
        let updatedData = [];
        let newProjectData = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith(`Id projektu to: ${projectId}, Nazwa projektu to: ${cleanProjectName}:`)) {
                projectFound = true;
                updatedData.push(line); // Dodaj nagłówek projektu

                const existingKPIs = [];
                let j = i + 1;

                while (j < lines.length && !lines[j].startsWith('Id projektu to: ')) {
                    existingKPIs.push(lines[j]);
                    j++;
                }

                const existingKPIIds = existingKPIs.map(e => e.split(',')[0]);

                const newKPIs = KPIs.filter(kpi => !existingKPIIds.includes(kpi.KPIId.toString()))
                    .map(kpi => `${kpi.KPIId},${kpi.KPIName},${kpi.KPIProcent}`);

                updatedData = updatedData.concat(existingKPIs, newKPIs);
                i = j - 1;
            } else {
                updatedData.push(line);
            }
        }

        if (!projectFound) {
            newProjectData.push(`Id projektu to: ${projectId}, Nazwa projektu to: ${cleanProjectName}:`);
            newProjectData = newProjectData.concat(KPIs.map(kpi => `${kpi.KPIId},${kpi.KPIName},${kpi.KPIProcent}`));
            updatedData = updatedData.concat(newProjectData);
        }

        const finalData = updatedData.join('\n');
        console.log('updatedData:', finalData); // Dodano logowanie zaktualizowanych danych

        fs.writeFile(filePath, finalData, 'utf8', err => {
            if (err) {
                console.error('Błąd zapisu pliku:', err);
                return res.status(500).send('Błąd serwera.');
            }

            res.send('Dane KPI zostały zaktualizowane pomyślnie.');
        });
    });
});

app.get('/get-pracownikow-per-projekt', (req, res) => {
    fs.readFile('frontend/listaPraconikówPerProjekt.csv', 'utf8', (err, data) => {
        if (err) {
            console.error('Błąd podczas odczytu pliku:', err);
            res.status(500).send('Wystąpił błąd podczas odczytu danych.');
            return;
        }
        res.send(data);
    });
});

app.post('/save-premia-data', (req, res) => {
    const data = req.body;
    const csvFilePath = path.join(__dirname, 'frontend/premiaPraconiwkaPerProjekt.csv');

    fs.readFile(csvFilePath, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error reading CSV file:', err);
            return res.status(500).json({ message: 'Error reading CSV file' });
        }

        let existingData = fileData.split('\n\n').filter(row => row.trim().length > 0);
        const employeeHeader = `Rok: ${data.year}, Dane pracownika: ID: ${data.employeeId}, Imię: ${data.employeeName}, Nazwisko: ${data.employeeSurname}, Dane projektu: ID: ${data.projectId}, Nazwa projektu: ${data.projectName}`;

        // Znaleźć istniejący wpis pracownika, projektu i roku
        let employeeIndex = existingData.findIndex(row => row.startsWith(employeeHeader));

        // Nowe dane pracownika do zapisania
        const newEmployeeData = data.tableData.map(row => row.join(',')).join('\n');

        if (employeeIndex !== -1) {
            // Aktualizacja istniejących danych, rozdzielić nagłówek i dane
            let existingEntry = existingData[employeeIndex].split('\n');
            let existingHeader = existingEntry.shift();
            let existingRows = existingEntry;

            // Zastępujemy tylko zmienione miesiące
            const updatedRows = data.tableData.map((newRow, index) => {
                return newRow.join(',');
            });

            existingData[employeeIndex] = `${employeeHeader}\n${updatedRows.join('\n')}`;
        } else {
            // Dodaj nowe dane pracownika
            existingData.push(`${employeeHeader}\n${newEmployeeData}`);
        }

        const csvContent = existingData.join('\n\n');

        fs.writeFile(csvFilePath, csvContent, 'utf8', (err) => {
            if (err) {
                console.error('Error writing CSV file:', err);
                return res.status(500).json({ message: 'Error writing CSV file' });
            }

            res.json({ message: 'Data saved successfully' });
        });
    });
});

app.get('/get-premia-data', (req, res) => {
    const csvFilePath = path.join(__dirname, 'frontend/premiaPraconiwkaPerProjekt.csv');
    
    fs.readFile(csvFilePath, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error reading CSV file:', err);
            return res.status(500).json({ message: 'Error reading CSV file' });
        }
        
        res.send(fileData);
    });
});