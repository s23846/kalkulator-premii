//OBSŁUGA ZAKŁADKI LISTA PROJEKTÓW
const button10 = document.getElementById('button10');
const button11 = document.getElementById('button11');
const button12 = document.getElementById('button12');
const button13 = document.getElementById('button13');
const button14 = document.getElementById('button14');
const row = document.getElementById('tableBody2');

document.getElementById("button10").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the form from submitting
    var input9Value = document.getElementById("input9").value;
    var input10Value = document.getElementById("input10").value;

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
    row.innerHTML += `<tr>
    <td><input type="radio" name="projekt"></td>
    <td>${input9Value}</td>
    <td>${input10Value}</td>
</tr>`
    // Wyczyść pola tekstowe formularza po dodaniu wiersza
    document.getElementById("myForm2").reset();
});

document.getElementById("button11").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    // Pobierz wszystkie radio buttons
    var radioButtons = document.querySelectorAll('input[type="radio"][name="projekt"]');
    
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
        alert("Proszę wybrać projekt do edycji.");
    }
});

document.getElementById("button12").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    // Pobierz wszystkie radio buttons
    var radioButtons = document.querySelectorAll('input[type="radio"][name="projekt"]');
    
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
        alert("Proszę wybrać projekt do edycji.");
    }
});

document.getElementById("button13").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    // Pobierz wszystkie radio buttons
    var radioButtons = document.querySelectorAll('input[type="radio"][name="projekt"]');
    
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
        alert("Proszę wybrać projekt do usunięcia.");
    }
});

document.getElementById("button14").addEventListener("click", function() {
    saveDataAboutProject();
});

function saveDataAboutProject() {
    const rows = document.querySelectorAll("#tableBody2 tr");
    let csvContent = "";
    rows.forEach(row => {
        const rowData = Array.from(row.children).map(td => td.textContent).join(",");
        csvContent += rowData.replace(/^,/,'') + "\n";
    });
    console.log("Dane do wysłania:", csvContent);
    fetch('/save-data-project-to-repository', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
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
    loadDataProjectFromCSV();
});

function loadDataProjectFromCSV() {
    fetch('/save-data-project-to-repository')
    .then(response => {
        if (!response.ok) {
            throw new Error('Wystąpił problem podczas pobierania danych.');
        }
        return response.text();
    })
    .then(csvData => {
        fillTableWithDataProject(csvData);
    })
    .catch(error => {
        console.error('Błąd:', error);
        alert('Wystąpił błąd podczas pobierania danych.');
    });
}

function fillTableWithDataProject(csvData) {
    const tableBody = document.getElementById("tableBody2");
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
        radioInput.name = 'projekt';
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