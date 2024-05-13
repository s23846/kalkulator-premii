document.addEventListener("DOMContentLoaded", function() {
    loadDataFromCSV();
});

function loadDataFromCSV() {
    fetch('/get-csv-data') // Wczytaj dane z serwera
    .then(response => {
        if (!response.ok) {
            throw new Error('Wystąpił problem podczas pobierania danych.');
        }
        return response.text();
    })
    .then(csvData => {
        displayData(csvData); // Wyświetl dane z pliku CSV
    })
    .catch(error => {
        console.error('Błąd:', error);
        alert('Wystąpił błąd podczas pobierania danych.');
    });
}

function displayData(csvData) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ''; // Wyczyść zawartość tabeli przed wypełnieniem nowymi danymi

    const rows = csvData.split('\n');
    rows.forEach(row => {
        // Pomijaj puste wiersze
        if (row.trim() === '') {
            return;
        }

        const rowData = row.split(',');
        const tableRow = document.createElement('tr');

        // Dodaj pole wyboru typu radio
        const radioCell = document.createElement('td');
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'pracownik';
        radioCell.appendChild(radioInput);
        tableRow.appendChild(radioCell);

        // Wyświetl tylko dane z pozycji 2, 3 i 4
        for (let i = 1; i <= 3; i++) {
            const tableCell = document.createElement('td');
            // Zamień dane na wielkie litery
            tableCell.textContent = rowData[i].toUpperCase();
            tableRow.appendChild(tableCell);
        }
        tableBody.appendChild(tableRow);
    });
}

document.getElementById("applyFilters").addEventListener("click", function() {
    // Pobierz wartości wpisane przez użytkownika w pola tekstowe
    var imieValue = document.getElementById("filterImie").value.toUpperCase();
    var nazwiskoValue = document.getElementById("filterNazwisko").value.toUpperCase();

    // Pobierz wszystkie wiersze tabeli
    var rows = document.querySelectorAll("#tableBody tr");

    // Iteruj przez każdy wiersz tabeli
    rows.forEach(function(row) {
        // Pobierz wartości imienia i nazwiska z danego wiersza
        var imie = row.cells[2].textContent.toUpperCase(); // Indeks 2 odpowiada kolumnie z imieniem
        var nazwisko = row.cells[3].textContent.toUpperCase(); // Indeks 3 odpowiada kolumnie z nazwiskiem

        // Sprawdź, czy wprowadzone przez użytkownika imię lub nazwisko pasuje do imienia lub nazwiska w danym wierszu
        // Jeśli pasuje, pokaż ten wiersz, w przeciwnym razie ukryj
        if (imie.includes(imieValue) && nazwisko.includes(nazwiskoValue)) {
            row.style.display = ""; // Pokaż wiersz
        } else {
            row.style.display = "none"; // Ukryj wiersz
        }
    });
});

document.getElementById("button7").addEventListener("click", function() {
    // Pobierz wszystkie radio buttons
    var radioButtons = document.querySelectorAll('input[type="radio"][name="pracownik"]');
    
    var selectedRow = null;
    
    // Sprawdź, który wiersz jest zaznaczony
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            selectedRow = radioButtons[i].parentNode.parentNode; // Pobierz rodzica rodzica, czyli <tr>
            break;
        }
    }
    
    if (selectedRow) {
        // Ukryj pola tekstowe do filtrowania danych
        document.getElementById("filter-container").style.display = "none";
    
        // Ukryj przycisk "Wybierz Pracownika"
        document.getElementById("button7").style.display = "none";
    
        // Ukryj aktualną tabelę
        document.getElementById("tableBody").style.display = "none";
    
        // Ukryj stare nagłówki tabeli
        document.querySelector('table thead').style.display = "none";
    
        // Utwórz nową tabelę
        var newTable = document.createElement('table');
        newTable.innerHTML = `
            <thead>
                <tr>
                    <th>Miesiąc</th>
                    <th>Ilość godzin do przepracowania</th>
                    <th>Ilość godzin wypracowanych</th>
                    <th>Wynagrodzenie</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Dane miesiąca</td>
                    <td>Dane ilości godzin do przepracowania</td>
                    <td>Dane ilości godzin wypracowanych</td>
                    <td>Dane wynagrodzenia</td>
                </tr>
            </tbody>
        `;
    
        // Dodaj nową tabelę do dokumentu
        document.body.appendChild(newTable);
    } else {
        alert("Proszę wybrać pracownika.");
    }
    
});
    

