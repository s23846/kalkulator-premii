//OBSŁUGA TABEL PREMII
premiaPodsumowanie.style.display="none";
button26.style.display="none";

document.addEventListener("DOMContentLoaded", function() {
    fillLabelsFromLocalStorage();
    loadDataForBonusTable();
});

function loadBonusDataFromServer() {
    fetch('/get-premia-data')
        .then(response => response.text())
        .then(csvData => {
            const labels = document.querySelectorAll('#labels-container label');
            if (labels.length < 3) {
                console.error('Missing employee labels');
                return;
            }
            const employeeId = labels[0].textContent.replace('ID: ', '').trim();
            const employeeName = labels[1].textContent.replace('Imię: ', '').trim();
            const employeeSurname = labels[2].textContent.replace('Nazwisko: ', '').trim();

            const projectLabels = document.querySelectorAll('#labels-container-project label');
            if (projectLabels.length < 2) {
                console.error('Missing project labels');
                return;
            }
            const projectId = projectLabels[0].textContent.replace('ID Projektu: ', '').trim();
            const projectName = projectLabels[1].textContent.replace('Nazwa Projektu: ', '').trim();

            parseAndFillBonusTable(csvData, employeeId, employeeName, employeeSurname, projectId, projectName);
        })
        .catch(error => console.error('Error:', error));
}

function parseAndFillBonusTable(csvData, employeeId, employeeName, employeeSurname, projectId, projectName) {
    const rows = csvData.split('\n\n');
    const employeeData = rows.find(row => row.startsWith(`Dane pracownika: ID: ${employeeId}`) && row.includes(`Dane projektu: ID: ${projectId}`));

    if (!employeeData) {
        console.log('No data found for the specified employee and project.');
        return;
    }

    const tableBody = document.getElementById("premiaPodsumowanieCialo");
    tableBody.innerHTML = '';

    const [header, ...dataRows] = employeeData.split('\n');
    dataRows.forEach(row => {
        const rowData = row.split(',');
        const tableRow = document.createElement('tr');
        rowData.forEach((cellData, index) => {
            const cell = document.createElement('td');
            if (index === 1 || (index >= 3 && (index - 3) % 3 === 1)) { // Edytowalne pola: wartość projektu i udział w KPI
                cell.contentEditable = true;
            }
            cell.textContent = cellData !== 'null' ? cellData : '';
            tableRow.appendChild(cell);
        });
        tableBody.appendChild(tableRow);
    });

    document.getElementById("premiaPodsumowanie").style.display = "table";
    document.getElementById("button26").style.display = "inline-block";

    // Reattach the event listener for calculations
    attachInputEventListener();
}

function attachInputEventListener() {
    const tableBody = document.getElementById("premiaPodsumowanieCialo");

    tableBody.addEventListener('input', function(event) {
        const row = event.target.parentElement;
        const projectValueCell = row.cells[1]; // Zakładając, że 2 komórka to "Wartość projektu"
        const maxBonusCell = row.cells[2]; // Zakładając, że 3 komórka to "MAX wartość premii"

        if (projectValueCell && maxBonusCell) {
            let projectValue = parseFloat(projectValueCell.innerText.replace('zł', '').trim());

            if (!isNaN(projectValue)) {
                const rentownosc = rentownosciData.find(r => r.projectId === projectId && projectValue >= r.lowerBound && projectValue <= r.upperBound);

                if (rentownosc) {
                    let maxBonus;
                    if (projectValue === rentownosc.upperBound) {
                        maxBonus = rentownosc.maxBonus;
                    } else {
                        maxBonus = (projectValue * rentownosc.percent / 100).toFixed(2);
                    }
                    maxBonusCell.innerText = `${maxBonus} zł`;
                } else {
                    maxBonusCell.innerText = '';
                }

                let sumaPremii = 0;
                kpis.forEach((kpi, index) => {
                    const participationCell = row.cells[4 + 3 * index]; // Dostosowany indeks dla udziału
                    const bonusCell = row.cells[5 + 3 * index]; // Dostosowany indeks dla premii

                    if (participationCell && bonusCell) {
                        let participation = parseFloat(participationCell.innerText.replace('%', '').trim());

                        // Walidacja udziału w KPI
                        if (participation > 100) {
                            participationCell.innerText = '100';
                            participation = 100;
                        }

                        if (!isNaN(participation)) {
                            const premiaZaKPI = (projectValue * kpi.weight / 100 * participation / 100 * rentownosc.percent / 100).toFixed(2);
                            bonusCell.innerText = `${premiaZaKPI} zł`;
                            sumaPremii += parseFloat(premiaZaKPI);
                        } else {
                            bonusCell.innerText = '';
                        }
                    }
                });

                const sumaPremiiCell = row.cells[row.cells.length - 1]; // Zakładając, że ostatnia komórka to "Suma Premii"
                sumaPremiiCell.innerText = `${sumaPremii.toFixed(2)} zł`;
            }
        }
    });
}

function fillLabelsFromLocalStorage() {
    var employeeId = localStorage.getItem('selectedEmployeeId');
    var employeeName = localStorage.getItem('selectedEmployeeName');
    var employeeSurname = localStorage.getItem('selectedEmployeeSurname');
    
    if (employeeId && employeeName && employeeSurname) {
        createLabels(employeeId, employeeName, employeeSurname);
    } else {
        console.error('Brak danych pracownika w lokalnym przechowywaniu.');
    }
}

function createLabels(id, name, surname) {
    var labelsContainer = document.getElementById('labels-container');
    var idLabel = document.createElement('label');
    idLabel.textContent = 'ID: ' + id;
    labelsContainer.appendChild(idLabel);

    var nameLabel = document.createElement('label');
    nameLabel.textContent = 'Imię: ' + decodeURIComponent(name);
    labelsContainer.appendChild(nameLabel);

    var surnameLabel = document.createElement('label');
    surnameLabel.textContent = 'Nazwisko: ' + decodeURIComponent(surname);
    labelsContainer.appendChild(surnameLabel);
}

function loadDataForBonusTable() {
    const labels = document.querySelectorAll('#labels-container label');
    const employeeId = labels[0].textContent.replace('ID: ', '').trim();
    const employeeName = labels[1].textContent.replace('Imię: ', '').trim();
    const employeeSurname = labels[2].textContent.replace('Nazwisko: ', '').trim();
    loadProjectsAndKPIData(employeeId, employeeName, employeeSurname);
}

function loadProjectsAndKPIData(employeeId, employeeName, employeeSurname) {
    Promise.all([
        fetch('frontend/listaProjektów.csv').then(response => response.text()),
        fetch('/get-pracownikow-per-projekt').then(response => response.text()),
        fetch('frontend/listaKPIdlaProjektu.csv').then(response => response.text())
    ]).then(([projectsData, employeesProjectsData, kpiData]) => {
        const assignedProjects = parseEmployeeProjects(employeesProjectsData, employeeId, employeeName, employeeSurname);
        if (assignedProjects.length === 0) {
            alert('Pracownik nie jest przypisany do żadnego projektu. Przypisz pracownika do projektu.');
            document.getElementById("tableBodyProjektyWPremii").innerHTML = ''; // Pokaż pustą tabelę
            return;
        }
        fillTableWithBonusData(projectsData, assignedProjects, kpiData);
    }).catch(error => {
        console.error('Błąd:', error);
        alert('Wystąpił błąd podczas pobierania danych.');
    });
}

function parseEmployeeProjects(employeesProjectsData, employeeId, employeeName, employeeSurname) {
    const rows = employeesProjectsData.split('\n');
    let assignedProjects = [];
    let currentProjectId = null;

    rows.forEach(row => {
        row = row.trim();
        if (row === '') {
            return;
        }
        
        const projectHeaderMatch = row.match(/^Id projektu to: (\d+), Nazwa projektu to: (.+):$/);
        if (projectHeaderMatch) {
            currentProjectId = projectHeaderMatch[1];
            return;
        }

        const rowData = row.split(',');
        if (rowData[0] == employeeId && rowData[1].toUpperCase() === employeeName.toUpperCase() && rowData[2].toUpperCase() === employeeSurname.toUpperCase()) {
            if (currentProjectId) {
                assignedProjects.push(currentProjectId);
            }
        }
    });
    return assignedProjects;
}

function fillTableWithBonusData(csvData, assignedProjects, kpiData) {
    const tableBody = document.getElementById("tableBodyProjektyWPremii");
    tableBody.innerHTML = '';

    const rows = csvData.split('\n');
    rows.forEach((row, rowIndex) => {
        const rowData = row.split(',');
        if (assignedProjects.includes(rowData[0])) {
            const tableRow = document.createElement('tr');

            const radioCell = document.createElement('td');
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'projekt';
            radioInput.id = 'projekt_' + rowIndex;
            radioCell.appendChild(radioInput);
            tableRow.appendChild(radioCell);

            const idCell = document.createElement('td');
            idCell.textContent = rowData[0].toUpperCase();
            tableRow.appendChild(idCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = rowData[1].toUpperCase();
            tableRow.appendChild(nameCell);

            tableBody.appendChild(tableRow);
        }
    });

    document.getElementById("button25").addEventListener("click", function(event) {
        event.preventDefault();
        assignProjectToContainer();
        projektyDoPremii.style.display="none";
        document.getElementById("button25").style.display = "none";  
        document.getElementById("button26").style.display = "inline-block"; 
        showMonthlyBonusTable(kpiData);
        loadBonusDataFromServer(); 
    });
}

function assignProjectToContainer() {
    const selectedRadio = document.querySelector('input[name="projekt"]:checked');
    if (selectedRadio) {
        const row = selectedRadio.closest('tr'); // Znajduje wiersz, który zawiera zaznaczony radio button
        const cells = row.getElementsByTagName('td'); // Pobiera wszystkie komórki wiersza

        const projectId = cells[1].textContent; // Pobiera ID projektu z drugiej komórki
        const projectName = cells[2].textContent; // Pobiera nazwę projektu z trzeciej komórki

        const labelsContainerProject = document.getElementById('labels-container-project');
        labelsContainerProject.innerHTML = '';

        const projectIdLabel = document.createElement('label');
        projectIdLabel.textContent = 'ID Projektu: ' + projectId;
        labelsContainerProject.appendChild(projectIdLabel);

        const projectNameLabel = document.createElement('label');
        projectNameLabel.textContent = 'Nazwa Projektu: ' + projectName;
        labelsContainerProject.appendChild(projectNameLabel);
    } else {
        alert('Proszę wybrać projekt.');
    }
}

function showMonthlyBonusTable(kpiData) {
    const projectInfo = getProjectInfoFromLabels();
    if (!projectInfo) {
        alert('Błąd: nie można znaleźć informacji o projekcie.');
        return;
    }

    const { projectId, projectName } = projectInfo;

    // Sprawdź, czy projekt istnieje w KPI
    const projectKPI = parseKPIForProject(kpiData, projectId, projectName);
    if (projectKPI.length === 0) {
        alert('Wybrany projekt nie posiada przypisanych KPI.');
        document.getElementById("button26").style.display = "none";
        return;
    }

    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.getElementById("premiaPodsumowanieCialo");

    tableHeader.innerHTML = "<th>Miesiąc</th><th>Wartość projektu</th><th>MAX premii</th>";

    let kpis = [];
    projectKPI.forEach((kpi, index) => {
        kpis.push({ id: kpi[0], name: kpi[1], weight: parseFloat(kpi[2]), bonus: kpi[5] });
        tableHeader.innerHTML += `<th>KPI: ${kpi[1]}</th><th>Udział w KPI ${index + 1}</th><th>Premia za KPI ${index + 1}</th>`;
    });

    // Dodaj nagłówek dla kolumny "Suma Premii"
    tableHeader.innerHTML += "<th>Suma Premii</th>";

    const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    months.forEach(month => {
        const row = tableBody.insertRow();
        let rowHTML = `<td>${month}</td><td contenteditable="true"></td><td></td>`;
        kpis.forEach(kpi => {
            rowHTML += `<td>${kpi.weight}%</td><td contenteditable="true"></td><td></td>`;
        });
        rowHTML += "<td></td>"; // Dodaj komórkę dla "Suma Premii"
        row.innerHTML = rowHTML;
    });

    // Load rentowności data from CSV file
    fetch('frontend/listaRentownościProjektu.csv')
        .then(response => response.text())
        .then(csvData => {
            const rentownościRows = csvData.split('\n').map(row => row.split(','));
            const rentownościData = rentownościRows.map(row => ({
                projectId: row[0],
                lowerBound: parseFloat(row[2]),
                upperBound: parseFloat(row[3]),
                percent: parseFloat(row[4]),
                maxBonus: parseFloat(row[5])
            }));

            // Add an event listener to the table body to calculate the MAX wartość premii, Premia za KPI, and Suma Premii
            tableBody.addEventListener('input', function(event) {
                const row = event.target.parentElement;
                const projectValueCell = row.cells[1]; // Assuming 2nd cell is "Wartość projektu"
                const maxBonusCell = row.cells[2]; // Assuming 3rd cell is "MAX wartość premii"

                if (projectValueCell && maxBonusCell) {
                    let projectValue = parseFloat(projectValueCell.innerText.replace('zł', '').trim());

                    if (!isNaN(projectValue)) {
                        const rentowność = rentownościData.find(r => r.projectId === projectId && projectValue >= r.lowerBound && projectValue <= r.upperBound);

                        if (rentowność) {
                            let maxBonus;
                            if (projectValue === rentowność.upperBound) {
                                maxBonus = rentowność.maxBonus;
                            } else {
                                maxBonus = (projectValue * rentowność.percent / 100).toFixed(2);
                            }
                            maxBonusCell.innerText = `${maxBonus} zł`;
                        } else {
                            maxBonusCell.innerText = '';
                        }

                        // Calculate Premia za KPI and Suma Premii
                        let sumaPremii = 0;
                        kpis.forEach((kpi, index) => {
                            const participationCell = row.cells[4 + 3 * index]; // Adjusted index for participation
                            const bonusCell = row.cells[5 + 3 * index]; // Adjusted index for bonus

                            if (participationCell && bonusCell) {
                                let participation = parseFloat(participationCell.innerText.replace('%', '').trim());

                                // Walidacja udziału w KPI
                                if (participation > 100) {
                                    participationCell.innerText = '100%';
                                    participation = 100;
                                }

                                if (!isNaN(participation)) {
                                    const premiaZaKPI = (projectValue * kpi.weight / 100 * participation / 100 * rentowność.percent / 100).toFixed(2);
                                    bonusCell.innerText = `${premiaZaKPI} zł`;
                                    sumaPremii += parseFloat(premiaZaKPI);
                                } else {
                                    bonusCell.innerText = '';
                                }
                            }
                        });

                        // Update Suma Premii cell
                        const sumaPremiiCell = row.cells[row.cells.length - 1]; // Assuming last cell is "Suma Premii"
                        sumaPremiiCell.innerText = `${sumaPremii.toFixed(2)} zł`;
                    }
                }
            });
        })
        .catch(error => console.error('Error loading rentowności data:', error));

    // Ukrywanie lub wyświetlanie elementów na dole strony
    document.getElementById("premiaPodsumowanie").style.display = "table";
    document.getElementById("button26").style.display = "inline-block"; 
}

function getProjectInfoFromLabels() {
    const labelsContainerProject = document.getElementById('labels-container-project');
    const labels = labelsContainerProject.querySelectorAll('label');
    if (labels.length < 2) return null;

    const projectId = labels[0].textContent.replace('ID Projektu: ', '').trim();
    const projectName = labels[1].textContent.replace('Nazwa Projektu: ', '').trim();
    return { projectId, projectName };
}

function parseKPIForProject(kpiData, projectId, projectName) {
    const kpiRows = kpiData.split('\n');
    let projectKPI = [];
    let currentProjectId = null;

    kpiRows.forEach(row => {
        row = row.trim();
        if (row === '') {
            return;
        }
        
        const projectHeaderMatch = row.match(/^Id projektu to: (\d+), Nazwa projektu to: (.+):$/);
        if (projectHeaderMatch) {
            currentProjectId = projectHeaderMatch[1];
            return;
        }

        if (currentProjectId === projectId) {
            const rowData = row.split(',');
            projectKPI.push(rowData);
        }
    });

    return projectKPI;
}

document.getElementById("button26").addEventListener("click", function() {
    saveTableToCSV();
});

function saveTableToCSV() {
    const labels = document.querySelectorAll('#labels-container label');
    const projectLabels = document.querySelectorAll('#labels-container-project label');
    const employeeId = labels[0].textContent.replace('ID: ', '').trim();
    const employeeName = labels[1].textContent.replace('Imię: ', '').trim();
    const employeeSurname = labels[2].textContent.replace('Nazwisko: ', '').trim();
    const projectId = projectLabels[0].textContent.replace('ID Projektu: ', '').trim();
    const projectName = projectLabels[1].textContent.replace('Nazwa Projektu: ', '').trim();

    const tableBody = document.getElementById("premiaPodsumowanieCialo");
    const rows = tableBody.getElementsByTagName('tr');

    let dataToSend = {
        employeeId: employeeId,
        employeeName: employeeName,
        employeeSurname: employeeSurname,
        projectId: projectId,
        projectName: projectName,
        tableData: []
    };

    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        let rowData = [];
        for (let cell of cells) {
            rowData.push(cell.innerText.replace('zł', '').trim() || 'null');
        }
        dataToSend.tableData.push(rowData);
    }

    fetch('/save-premia-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // Informacja zwrotna dla użytkownika
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Wystąpił błąd podczas zapisywania danych.');  // Informacja o błędzie
    });
}