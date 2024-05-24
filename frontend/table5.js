//obsługa zakładki premii

document.addEventListener("DOMContentLoaded", function() {
    loadDataForBonusTable();
});

function loadDataForBonusTable() {
    fetch('frontend/listaProjektów.csv')
    .then(response => {
        if (!response.ok) {
            throw new Error('Wystąpił problem podczas pobierania danych.');
        }
        return response.text();
    })
    .then(csvData => {
        fillTableWithBonusData(csvData);
    })
    .catch(error => {
        console.error('Błąd:', error);
        alert('Wystąpił błąd podczas pobierania danych.');
    });
}

function fillTableWithBonusData(csvData) {
    const tableBody = document.getElementById("tableBodyProjektyWPremii");
    tableBody.innerHTML = ''; // Wyczyść zawartość tabeli przed wypełnieniem nowymi danymi

    const rows = csvData.split('\n');
    rows.forEach((row, rowIndex) => {
        // Pomijaj puste wiersze
        if (row.trim() === '') {
            return;
        }

        const rowData = row.split(',');
        const tableRow = document.createElement('tr');

        // Dodaj przycisk radio do pierwszej komórki
        const radioCell = document.createElement('td');
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'projekt';
        // Ustaw unikalne ID dla każdego radia na podstawie indeksu wiersza
        radioInput.id = 'projekt_' + rowIndex;
        radioCell.appendChild(radioInput);
        tableRow.appendChild(radioCell);

        // Dodaj ID projektu
        const idCell = document.createElement('td');
        idCell.textContent = rowData[0].toUpperCase(); // Zakładając, że pierwsza kolumna to ID projektu
        tableRow.appendChild(idCell);

        // Dodaj nazwę projektu
        const nameCell = document.createElement('td');
        nameCell.textContent = rowData[1].toUpperCase(); // Zakładając, że druga kolumna to nazwa projektu
        tableRow.appendChild(nameCell);

        tableBody.appendChild(tableRow);
    });
}



