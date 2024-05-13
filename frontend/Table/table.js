// Pobierz przyciski
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const button3 = document.getElementById('button3');
const row = document.getElementById('tableBody');

button2.addEventListener('click', function() {
    // Obsługa kliknięcia dla przycisku "Edytuj"
    console.log('Kliknięto przycisk "Edytuj"');
});

button3.addEventListener('click', function() {
    // Obsługa kliknięcia dla przycisku "Usuń"
    console.log('Kliknięto przycisk "Usuń"');
});

document.getElementById("button1").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the form from submitting
    var input1Value = document.getElementById("input1").value;
    var input2Value = document.getElementById("input2").value;
    var input3Value = document.getElementById("input3").value;
    var input4Value = document.getElementById("input4").value;
    var input5Value = document.getElementById("input5").value;
    var input6Value = document.getElementById("input6").value;
    var input7Value = document.getElementById("input7").value;

    var inputs = document.querySelectorAll('input[type="text"]'); // Pobierz wszystkie pola wejściowe typu tekstowego
        
    // Iteruj przez wszystkie pola wejściowe i sprawdź, czy jakiekolwiek z nich są puste
    var isEmpty = false;
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value.trim() === "") {
            isEmpty = true;
            break; // Jeśli jakiekolwiek pole jest puste, przerwij pętlę
        }
    }
    
    // Jeśli jakiekolwiek pole wejściowe jest puste, wyświetl komunikat
    if (isEmpty) {
        alert("Proszę wypełnić wszystkie pola formularza.");
        return; // Przerwij działanie funkcji, jeśli jakieś pole jest puste
    }
    
    // Do something with the values, for example, log them to the console
    console.log("Input 1:", input1Value);
    console.log("Input 2:", input2Value);
    console.log("Input 3:", input3Value);
    console.log("Input 4:", input4Value);
    console.log("Input 5:", input5Value);
    console.log("Input 6:", input6Value);
    console.log("Input 7:", input7Value);
    row.innerHTML += ` <tr>
    <td><input type="radio" name="pracownik"></td>
    <td>${input1Value}</td>
    <td>${input2Value}</td>
    <td>${input3Value}</td>
    <td>${input4Value}</td>
    <td>${input5Value}</td>
    <td>${input6Value}</td>
    <td>${input7Value}</td>
</tr>`
    // Wyczyść pola tekstowe formularza po dodaniu wiersza
    document.getElementById("myForm").reset();
});

document.getElementById("button2").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission
    
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
        // Pobierz wszystkie komórki w wybranym wierszu
        var cells = selectedRow.getElementsByTagName("td");
        
        // Zamień zawartość każdej komórki (z wyjątkiem pierwszej) na pole tekstowe
        for (var i = 1; i < cells.length; i++) {
            if (cells[i].querySelector("input[type='radio']")) {
                continue; // Ignoruj kolumnę z przyciskiem typu radio
            }
            
            // Utwórz pole tekstowe
            var input = document.createElement("input");
            input.type = "text";
            input.value = cells[i].textContent; // Przypisz aktualną zawartość komórki jako wartość pola tekstowego
            cells[i].textContent = ''; // Wyczyść zawartość komórki
            cells[i].appendChild(input); // Dodaj pole tekstowe do komórki
        }
    } else {
        alert("Proszę wybrać pracownika do edycji.");
    }
});

    document.getElementById("button4").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default form submission
        
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
            // Pobierz wszystkie komórki w wybranym wierszu
            var cells = selectedRow.getElementsByTagName("td");
            
            // Iteruj przez wszystkie komórki i zamień pola tekstowe na zwykły tekst
            for (var i = 0; i < cells.length; i++) {
                var input = cells[i].querySelector("input[type='text']");
                if (input) {
                    var textNode = document.createTextNode(input.value);
                    cells[i].textContent = ''; // Wyczyść zawartość komórki
                    cells[i].appendChild(textNode); // Dodaj tekst do komórki
                }
            }
        } else {
            alert("Proszę wybrać pracownika do edycji.");
        }
    });

    document.getElementById("button3").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default form submission
        
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
            selectedRow.remove(); // Usuń zaznaczony wiersz
        } else {
            alert("Proszę wybrać pracownika do usunięcia.");
        }
    });

    document.getElementById("button5").addEventListener("click", function(event) {
        event.preventDefault(); // Zapobiega domyślnej akcji przycisku
        
        // Pobierz tabelę
        var table = document.getElementById("tableBody");
    
        // Przygotuj dane CSV
        var csv = [];
        var rows = table.querySelectorAll("tr");
        rows.forEach(function(row) {
            var rowData = [];
            var cells = row.querySelectorAll("td");
            cells.forEach(function(cell) {
                rowData.push(cell.innerText);
            });
            csv.push(rowData.join(","));
        });
        var csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
    
        // Utwórz link do pobrania danych CSV
        var link = document.createElement("a");
        link.setAttribute("href", csvContent);
        link.setAttribute("download", "dane.csv");
        document.body.appendChild(link); // Dodaj link do dokumentu
        link.click(); // Kliknij link (uruchom pobieranie)
    });

    document.getElementById("button6").addEventListener("click", function() {
        saveDataToFileRepository();
    });
    
    function saveDataToFileRepository() {
        const rows = document.querySelectorAll("#tableBody tr");
        let csvContent = "";
        rows.forEach(row => {
            const rowData = Array.from(row.children).map(td => td.textContent).join(",");
            csvContent += rowData.replace(/^,/,'') + "\n";
        });
    
        console.log("Dane do wysłania:", csvContent);
    
        fetch('/save-to-repository', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain' // Zmiana typu treści na text/plain
            },
            body: csvContent
        })
        .then(response => {
            console.log("Odpowiedź serwera:", response);
            if (!response.ok) {
                throw new Error('Wystąpił problem podczas zapisywania danych.');
            }
            alert('Dane zostały zapisane pomyślnie.');
        })
        .catch(error => {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas zapisywania danych.');
        });
    }

    document.addEventListener("DOMContentLoaded", function() {
        loadDataFromCSV();
    });
    
    function loadDataFromCSV() {
        fetch('/get-csv-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Wystąpił problem podczas pobierania danych.');
            }
            return response.text();
        })
        .then(csvData => {
            fillTableWithData(csvData);
        })
        .catch(error => {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas pobierania danych.');
        });
    }
    
    function fillTableWithData(csvData) {
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
    
            // Dodaj przycisk radio do pierwszej komórki
            const radioCell = document.createElement('td');
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'pracownik';
            radioCell.appendChild(radioInput);
            tableRow.appendChild(radioCell);
    
            rowData.forEach(cellData => {
                const tableCell = document.createElement('td');
                // Zamień dane na wielkie litery
                tableCell.textContent = cellData.toUpperCase();
                tableRow.appendChild(tableCell);
            });
            tableBody.appendChild(tableRow);
        });
    }
    
    
    
    


