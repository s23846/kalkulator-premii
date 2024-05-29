//obsługa zakładki premii
typCzasuRozliczenia.style.display="none";
premiaPodsumowanie.style.display="none";
button26.style.display="none";

document.addEventListener("DOMContentLoaded", function() {
    const labels = document.querySelectorAll('#labels-container label');
    const employeeId = labels[0].textContent.replace('ID: ', '').trim();
    const employeeName = labels[1].textContent.replace('Imię: ', '').trim();
    const employeeSurname = labels[2].textContent.replace('Nazwisko: ', '').trim();
    loadDataForBonusTable(employeeId, employeeName, employeeSurname);
});

function loadDataForBonusTable(employeeId, employeeName, employeeSurname) {
    Promise.all([
        fetch('frontend/listaProjektów.csv').then(response => response.text()),
        fetch('/get-pracownikow-per-projekt').then(response => response.text())
    ]).then(([projectsData, employeesProjectsData]) => {
        const assignedProjects = parseEmployeeProjects(employeesProjectsData, employeeId, employeeName, employeeSurname);
        if (assignedProjects.length === 0) {
            alert('Pracownik nie jest przypisany do żadnego projektu. Przypisz pracownika do projektu.');
            document.getElementById("tableBodyProjektyWPremii").innerHTML = ''; // Pokaż pustą tabelę
            return;
        }
        fillTableWithBonusData(projectsData, assignedProjects);
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
        
        // Sprawdzenie, czy linia definiuje nowy projekt
        const projectHeaderMatch = row.match(/^Id projektu to: (\d+), Nazwa projektu to: (.+):$/);
        if (projectHeaderMatch) {
            currentProjectId = projectHeaderMatch[1];
            return; // Przechodzimy do następnej iteracji, bo to nagłówek projektu
        }

        const rowData = row.split(',');
        // Sprawdzenie, czy linia zawiera dane pracownika i czy pasują do szukanych
        if (rowData[0] == employeeId && rowData[1].toUpperCase() === employeeName.toUpperCase() && rowData[2].toUpperCase() === employeeSurname.toUpperCase()) {
            if (currentProjectId) {
                assignedProjects.push(currentProjectId);
            }
        }
    });
    return assignedProjects;
}


function fillTableWithBonusData(csvData, assignedProjects) {
    const tableBody = document.getElementById("tableBodyProjektyWPremii");
    tableBody.innerHTML = ''; // Wyczyść zawartość tabeli przed wypełnieniem nowymi danymi

    const rows = csvData.split('\n');
    rows.forEach((row, rowIndex) => {
        const rowData = row.split(',');
        if (assignedProjects.includes(rowData[0])) { // Sprawdź, czy ID projektu jest wśród przypisanych projektów
            const tableRow = document.createElement('tr');

            const radioCell = document.createElement('td');
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'projekt';
            radioInput.id = 'projekt_' + rowIndex;
            radioCell.appendChild(radioInput);
            tableRow.appendChild(radioCell);

            const idCell = document.createElement('td');
            idCell.textContent = rowData[0].toUpperCase(); // ID projektu
            tableRow.appendChild(idCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = rowData[1].toUpperCase(); // Nazwa projektu
            tableRow.appendChild(nameCell);

            tableBody.appendChild(tableRow);
        }
    });
}

document.getElementById("button25").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the form from submitting
    projektyDoPremii.style.display="none";
    document.getElementById("button25").style.display = "none";  
    typCzasuRozliczenia.style.display="table";
    document.getElementById("button26").style.display = "inline-block";  
});

document.getElementById("button26").addEventListener("click", function(event) {
    event.preventDefault(); // Zapobiega domyślnej akcji formularza

    // Ukrywanie tabeli wyboru i przycisku
    const typCzasuRozliczenia = document.getElementById("typCzasuRozliczenia");
    const button26 = document.getElementById("button26");
    const premiaPodsumowanie = document.getElementById("premiaPodsumowanie");
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.getElementById("premiaPodsumowanieCialo");

    if (!typCzasuRozliczenia || !premiaPodsumowanie || !tableHeader || !tableBody) {
        console.error("Brak jednego z wymaganych elementów w DOM.");
        return;
    }

    typCzasuRozliczenia.style.display = "none";
    button26.style.display = "none";  

    // Wyświetlanie nowej tabeli
    premiaPodsumowanie.style.display = "table"; 

    // Pobieranie zaznaczonej opcji
    const typRozliczeniaElement = document.querySelector('input[name="typRozliczenia"]:checked');
    if (!typRozliczeniaElement) {
        console.error("Nie wybrano typu rozliczenia.");
        return;
    }
    const typRozliczenia = typRozliczeniaElement.value;

    // Czyszczenie istniejących nagłówków i wierszy
    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";

    if (typRozliczenia === "Miesięczne") {
        tableHeader.innerHTML = "<th>Miesiąc</th><th>Wartość projektu</th>";

        const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
        months.forEach(month => {
            const row = tableBody.insertRow();
            row.innerHTML = `<td>${month}</td><td></td>`;
        });

    } else if (typRozliczenia === "Kwartalne") {
        tableHeader.innerHTML = "<th>Kwartał</th><th>Wartość projektu</th>";

        const quarters = ["Kwartał I", "Kwartał II", "Kwartał III", "Kwartał IV"];
        quarters.forEach(quarter => {
            const row = tableBody.insertRow();
            row.innerHTML = `<td>${quarter}</td><td></td>`;
        });

    } else if (typRozliczenia === "Roczne") {
        tableHeader.innerHTML = "<th>Roczne</th><th>Wartość projektu</th>";

        const row = tableBody.insertRow();
        row.innerHTML = `<td>Roczne</td><td></td>`;
    }
});