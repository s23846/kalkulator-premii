//OBSŁUGA TABEL PREMII
typCzasuRozliczenia.style.display="none";
premiaPodsumowanie.style.display="none";
button26.style.display="none";

document.addEventListener("DOMContentLoaded", function() {
    fillLabelsFromLocalStorage();
    loadDataForBonusTable();
});

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
        projektyDoPremii.style.display="none";
        document.getElementById("button25").style.display = "none";  
        typCzasuRozliczenia.style.display="table";
        document.getElementById("button26").style.display = "inline-block";  

        showMonthlyBonusTable(kpiData);
    });
}

function showMonthlyBonusTable(kpiData) {
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.getElementById("premiaPodsumowanieCialo");

    tableHeader.innerHTML = "<th>Miesiąc</th><th>Wartość projektu</th><th>MAX premii</th>";

    const kpiRows = kpiData.split('\n').slice(1); // pomijając pierwszą linię z nagłówkiem projektu
    let kpis = [];
    kpiRows.forEach((row, index) => {
        const [kpiId, kpiName, kpiWeight, , , kpiBonus] = row.split(',');
        kpis.push({ id: kpiId, name: kpiName, weight: kpiWeight, bonus: kpiBonus });
        tableHeader.innerHTML += `<th>KPI: ${kpiName}</th><th>Udział w KPI ${index + 1}</th>`;
    });

    const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    months.forEach(month => {
        const row = tableBody.insertRow();
        let rowHTML = `<td>${month}</td><td contenteditable="true"></td><td></td>`;
        kpis.forEach(kpi => {
            rowHTML += `<td>${kpi.weight}%</td><td contenteditable="true"></td>`;
        });
        row.innerHTML = rowHTML;
    });

    // Load rentowności data from CSV file
    fetch('frontend/listaRentownościProjektu.csv')
        .then(response => response.text())
        .then(csvData => {
            const rentownościRows = csvData.split('\n').map(row => row.split(','));
            const rentownościData = rentownościRows.map(row => ({
                lowerBound: parseFloat(row[2]),
                upperBound: parseFloat(row[3]),
                percent: parseFloat(row[4]),
                maxBonus: parseFloat(row[5])
            }));

            // Add an event listener to the table body to calculate the MAX wartość premii
            tableBody.addEventListener('input', function(event) {
                const row = event.target.parentElement;
                const projectValueCell = row.cells[1]; // Assuming 2nd cell is "Wartość projektu"
                const maxBonusCell = row.cells[2]; // Assuming 3rd cell is "MAX wartość premii"

                if (projectValueCell && maxBonusCell) {
                    const projectValue = parseFloat(projectValueCell.innerText);

                    if (!isNaN(projectValue)) {
                        const rentowność = rentownościData.find(r => projectValue >= r.lowerBound && projectValue <= r.upperBound);

                        if (rentowność) {
                            if (projectValue === rentowność.upperBound) {
                                maxBonusCell.innerText = rentowność.maxBonus;
                            } else {
                                const maxBonus = (projectValue * rentowność.percent / 100).toFixed(2);
                                maxBonusCell.innerText = maxBonus;
                            }
                        } else {
                            maxBonusCell.innerText = '';
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error loading rentowności data:', error));

    // Ukrywanie lub wyświetlanie elementów na dole strony
    document.getElementById("typCzasuRozliczenia").style.display = "none";
    document.getElementById("premiaPodsumowanie").style.display = "table";
    document.getElementById("button26").style.display = "inline-block"; 
}
