//OBSŁUGA ZAKŁADKI LISTA PROJEKTÓW
const button10 = document.getElementById('button10');
const button11 = document.getElementById('button11');
const button12 = document.getElementById('button12');
const button13 = document.getElementById('button13');
const button14 = document.getElementById('button14');
const button15 = document.getElementById('button15')
const row = document.getElementById('tableBody2');
const rentownoscTable = document.getElementById('rentownoscTable');

// Początkowe ukrycie elementów
rentownoscTable.style.display = "none";
employeeToProject.style.display="none";
KpiForProject.style.display="none";
button16.style.display = "none";
button17.style.display = "none";
button18.style.display = "none";
button19.style.display = "none";
button20.style.display = "none";
addEmployeeToProjectFile.style.display="none";
button21.style.display = "none";
button22.style.display = "none";
button23.style.display = "none";
button24.style.display = "none";
SaveAfterEdition.style.display= "none";
document.addEventListener('DOMContentLoaded', updateSum);

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
    fetch('/get-data-project-from-repository')
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
        radioInput.id = rowData[0];
        radioCell.appendChild(radioInput);
        tableRow.appendChild(radioCell);

        // Dodaj wartości z indeksu 0 i 1 (pierwsza i druga kolumna) do tabeli
        for (let i = 0; i < 2; i++) {
            const tableCell = document.createElement('td');
            tableCell.textContent = rowData[i] ? rowData[i].toUpperCase() : ''; // Zamień dane na wielkie litery
            tableRow.appendChild(tableCell);
        }

        tableBody.appendChild(tableRow);
    });
}

    document.getElementById("button15").addEventListener("click", function() {
        // Schowaj wiersze tabeli poza zaznaczonym radiobuttonem
        const radioButtons = document.querySelectorAll('#tableBody2 input[type="radio"]');
        radioButtons.forEach(radioButton => {
            const row = radioButton.closest('tr');
            if (!radioButton.checked) {
                row.style.display = 'none'; // Ukryj wiersz
            }
        });
    
        // Schowaj przyciski od button10 do button15
        const buttonsToHide = ['button10', 'button11', 'button12', 'button13', 'button14', 'button15', 'addEmployeeToProject', 'addKpiToProject'];
        buttonsToHide.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.style.display = 'none'; // Ukryj przycisk
            }
        });
    
        // Ukryj formularz
        document.getElementById("myForm2").style.display = "none";

            // Pokaż tabelę rentowności i przyciski 16-20
            rentownoscTable.style.display = "table";
            button16.style.display = "inline-block";
            button17.style.display = "inline-block";
            button18.style.display = "inline-block";
            button19.style.display = "inline-block";
            button20.style.display = "inline-block";
            loadDataRentabilityFromCSV();

    });

function loadDataRentabilityFromCSV() {
    fetch('/get-data-project-profitability-from-repository')
    .then(response => {
        if (!response.ok) {
            throw new Error('Wystąpił problem podczas pobierania danych.');
        }
        return response.text();
    })
    .then(csvData => {
        console.log('Pobrane dane CSV:', csvData);
        fillTableWithDataRentability(csvData);
    })
    .catch(error => {
        console.error('Błąd:', error);
        alert('Wystąpił błąd podczas pobierania danych.');
    });
}

function getSelectedProjectId() {
    const selectedRadio = document.querySelector('input[name="projekt"]:checked');
    const selectedProjectId = selectedRadio ? selectedRadio.getAttribute('id') : null;
    console.log('Wybrane ID projektu:', selectedProjectId);
    return selectedProjectId;
}

function fillTableWithDataRentability(csvData) {
    const tableBody = document.getElementById("tableBody4");
    tableBody.innerHTML = ''; // Wyczyść zawartość tabeli przed wypełnieniem nowymi danymi

    const selectedProjectId = getSelectedProjectId();
    if (!selectedProjectId) {
        alert('Proszę wybrać projekt.');
        return;
    }

    const rows = csvData.split('\n');
    console.log('Wiersze CSV:', rows);
    
    rows.forEach((row, index) => {
        // Pomijaj puste wiersze
        if (row.trim() === '') {
            return;
        }

        const rowData = row.split(',');
        console.log('Dane wiersza:', rowData);

        const projectId = rowData[0]; // Załóżmy, że ID projektu jest na indeksie 0
        console.log('ID projektu w wierszu:', projectId);

        if (projectId !== selectedProjectId) {
            return;
        }

        const rentabilityData = rowData.slice(2, 6); // Wybierz odpowienie kolumny z pliku rentowności
        console.log('Dane rentowności:', rentabilityData);

        const tableRow = document.createElement('tr');

        // Dodaj przycisk radio do pierwszej komórki
        const radioCell = document.createElement('td');
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'rentownosc';
        radioCell.appendChild(radioInput);
        tableRow.appendChild(radioCell);

        // Dodaj dane rentowności do kolejnych komórek
        rentabilityData.forEach(cellData => {
            const tableCell = document.createElement('td');
            // Zamień dane na wielkie litery
            tableCell.textContent = cellData.toUpperCase();
            tableRow.appendChild(tableCell);
        });

        tableBody.appendChild(tableRow);
        console.log('Dodano wiersz do tabeli:', tableRow);
    });
}    

    document.getElementById("button16").addEventListener("click", function() {
        // Sprawdź, czy formularz już istnieje
        if (!document.getElementById('dynamicForm')) {
            // Utwórz formularz dynamicznie
            const form = document.createElement('form');
            form.id = 'dynamicForm';
            form.innerHTML = `
                <label for="input1">Od:</label>
                <input type="text" id="input1"><br>
                <label for="input2">Do:</label>
                <input type="text" id="input2"><br>
                <label for="input3">Procent:</label>
                <input type="text" id="input3"><br>
                <label for="input4">Max:</label>
               <input type="text" id="input4" disabled><br> 
                <button type="button" id="addDataButton">Dodaj</button>
            `;
            document.body.appendChild(form);
    
            // Dodaj zdarzenie kliknięcia dla przycisku dodawania danych
            document.getElementById('addDataButton').addEventListener('click', function() {
                // Pobierz wartości z formularza
                const input1Value = document.getElementById('input1').value;
                const input2Value = document.getElementById('input2').value;
                const input3Value = document.getElementById('input3').value;
    
                // Sprawdź, czy wszystkie pola są wypełnione
                if (input1Value === '' || input2Value === '' || input3Value === '') {
                    alert("Proszę wypełnić wszystkie pola formularza.");
                    return;
                }
    
                // Oblicz wartość dla komórki "Max"
                const max = (parseFloat(input2Value) * parseFloat(input3Value) / 100).toFixed(2); // Zaokrąglenie do dwóch miejsc po przecinku
    
                // Dodaj nowy wiersz do tabeli
                const rentownoscTableBody = document.getElementById('tableBody4');
                rentownoscTableBody.innerHTML += `<tr>
                    <td><input type="radio" name="rentownosc"></td>
                    <td>${input1Value}</td>
                    <td>${input2Value}</td>
                    <td>${input3Value}</td>
                    <td>${max}</td>
                </tr>`;
    
                // Usuń formularz po dodaniu danych
                form.remove();
            });
    
            // Dodaj nasłuchiwanie zdarzeń zmiany wartości dla inputów 1, 2 i 3
            document.getElementById('input1').addEventListener('input', updateMax);
            document.getElementById('input2').addEventListener('input', updateMax);
            document.getElementById('input3').addEventListener('input', updateMax);
        }
    });
    
    function updateMax() {
        // Pobierz wartości z inputów 1, 2 i 3
        const input1Value = document.getElementById('input1').value;
        const input2Value = document.getElementById('input2').value;
        const input3Value = document.getElementById('input3').value;
    
        // Oblicz wartość dla komórki "Max"
        const max = (parseFloat(input2Value) * parseFloat(input3Value) / 100).toFixed(2); // Zaokrąglenie do dwóch miejsc po przecinku
    
        // Ustaw wartość dla komórki "Max"
        document.getElementById('input4').value = max;
    }

    document.getElementById("button17").addEventListener("click", function() {
        // Pobierz wszystkie radio buttons
        var radioButtons = document.querySelectorAll('input[type="radio"][name="rentownosc"]');
    
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
    
                if (i === 4) {
                    // Kolumna z wartością maksymalną, pominij edycję
                    continue;
                }
    
                // Utwórz pole tekstowe
                var input = document.createElement("input");
                input.type = "text";
                input.value = cells[i].textContent; // Przypisz aktualną zawartość komórki jako wartość pola tekstowego
                cells[i].textContent = ''; // Wyczyść zawartość komórki
                cells[i].appendChild(input); // Dodaj pole tekstowe do komórki
            }
    
            // Dodaj zdarzenie na zmianę wartości pól, aby automatycznie przeliczać wartość maksymalną
            var inputFields = selectedRow.querySelectorAll("input[type='text']");
            inputFields.forEach(function(input) {
                input.addEventListener('input', updateMaxValue);
            });
    
            function updateMaxValue() {
                // Pobierz wartości z pól tekstowych
                var odValue = parseFloat(cells[1].querySelector("input").value);
                var doValue = parseFloat(cells[2].querySelector("input").value);
                var procentValue = parseFloat(cells[3].querySelector("input").value);
    
                if (!isNaN(doValue) && !isNaN(procentValue)) {
                    // Oblicz wartość dla komórki "Max"
                    var max = (doValue * procentValue / 100).toFixed(2); // Zaokrąglenie do dwóch miejsc po przecinku
    
                    // Zaktualizuj wartość w komórce "Max"
                    cells[4].textContent = max;
                }
            }
        } else {
            alert("Proszę wybrać widełki rentowności do edycji.");
        }
    });

    document.getElementById("button18").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Pobierz wszystkie radio buttons
        var radioButtons = document.querySelectorAll('input[type="radio"][name="rentownosc"]');
        
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
            
            // Pobierz wartości z pól tekstowych i przelicz wartość "Max"
            var odValue = parseFloat(cells[1].querySelector("input").value);
            var doValue = parseFloat(cells[2].querySelector("input").value);
            var procentValue = parseFloat(cells[3].querySelector("input").value);
            
            // Oblicz wartość dla komórki "Max"
            var max = (doValue * procentValue / 100).toFixed(2); // Zaokrąglenie do dwóch miejsc po przecinku
            
            // Zamień pola tekstowe na zwykły tekst, aktualizując wartość "Max"
            for (var i = 0; i < cells.length; i++) {
                var input = cells[i].querySelector("input[type='text']");
                if (input) {
                    var textNode = document.createTextNode(input.value);
                    cells[i].textContent = ''; // Wyczyść zawartość komórki
                    cells[i].appendChild(textNode); // Dodaj tekst do komórki
                }
            }
            
            // Ustaw obliczoną wartość "Max" w odpowiedniej komórce
            cells[4].textContent = max;

            //odznacz radio button
            selectedRadioButton.checked = false;
        } else {
            alert("Proszę wybrać widełki rentowności do edycji.");
        }
    });

    document.getElementById("button19").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Pobierz wszystkie radio buttons
        var radioButtons = document.querySelectorAll('input[type="radio"][name="rentownosc"]');
        
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
            alert("Proszę wybrać widełki rentowności do usunięcia.");
        }
    });
    
    document.getElementById("button20").addEventListener("click", function() {
        updateProjectProfitability();
    });
    
    function updateProjectProfitability() {
        // Pobierz zaznaczony projekt z tableBody2
        const selectedProjectRadio = document.querySelector('input[name="projekt"]:checked');
        if (!selectedProjectRadio) {
            alert('Wybierz projekt.');
            return;
        }
    
        const projectRow = selectedProjectRadio.closest('tr');
        const projectId = projectRow.cells[1].innerText; 
        const projectName = projectRow.cells[2].innerText; 

        // Pobierz dane rentowności z tableBody4
        const profitabilityRows = document.querySelectorAll("#tableBody4 tr");
        const profitabilityData = Array.from(profitabilityRows).map(row => {
            return {
                od: row.cells[1].innerText,
                do: row.cells[2].innerText,
                procenty: row.cells[3].innerText,
                max: row.cells[4].innerText
            };
        });
    
        // Przygotuj dane do wysłania
        const dataToSend = {
            projectId,
            projectName,
            profitabilityData: profitabilityData.map(d => `${d.od},${d.do},${d.procenty},${d.max}`).join('\n')
        };
    
        // Wysyłka danych do serwera
        fetch('/update-project-profitability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Wystąpił problem podczas zapisywania danych.');
            }
            return response.text();
        })
        .then(result => {
            console.log(result);
            alert('Dane zostały zaktualizowane pomyślnie.');
        })
        .catch(error => {
            console.error('Błąd:', error);
            alert('Wystąpił problem podczas zapisywania danych.');
        });
    }

    document.getElementById("addEmployeeToProject").addEventListener("click", function() {
        document.getElementById("addEmployeeToProjectFile").style.display = "inline-block";  
        // Schowaj wiersze tabeli poza zaznaczonym radiobuttonem
        const radioButtons = document.querySelectorAll('#tableBody2 input[type="radio"]');
        radioButtons.forEach(radioButton => {
            const row = radioButton.closest('tr');
            if (!radioButton.checked) {
                row.style.display = 'none'; // Ukryj wiersz
            }
        });
    
        // Schowaj przyciski od button10 do button15
        const buttonsToHide = ['button10', 'button11', 'button12', 'button13', 'button14', 'button15', 'addEmployeeToProject', 'addKpiToProject', 'button16','button17','button18','button19','button20'];
        buttonsToHide.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.style.display = 'none'; // Ukryj przycisk
            }
        });
    
        // Ukryj formularz
        document.getElementById("myForm2").style.display = "none";
    
        // Pokaż tabelę pracowników do projektu
        employeeToProject.style.display = "table";
        loadUnassignedEmployees();
    });
    
    function loadUnassignedEmployees() {
        const selectedProjectRadio = document.querySelector('input[name="projekt"]:checked');
        if (!selectedProjectRadio) {
            alert('Wybierz projekt.');
            return;
        }
    
        const projectRow = selectedProjectRadio.closest('tr');
        const projectId = projectRow.cells[1].innerText;
        const projectName = projectRow.cells[2].innerText;
    
        fetch(`/get-data-employee-from-repository-to-project?projectId=${projectId}&projectName=${projectName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Wystąpił problem podczas pobierania danych.');
            }
            return response.text();
        })
        .then(csvData => {
            fillTableWithDataEmployeeToProject(csvData);
        })
        .catch(error => {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas pobierania danych.');
        });
    }
    
    function fillTableWithDataEmployeeToProject(csvData) {
        const tableBody = document.getElementById("tableBody5");
        tableBody.innerHTML = ''; // Wyczyść zawartość tabeli przed wypełnieniem nowymi danymi
    
        const rows = csvData.split('\n');
        rows.forEach(row => {
            if (row.trim() === '') {
                return; // Pomijaj puste wiersze
            }
    
            const rowData = row.split(',');
            const tableRow = document.createElement('tr');
    
            // Dodaj przycisk checkbox do pierwszej komórki
            const checkboxCell = document.createElement('td');
            const checkboxInput = document.createElement('input');
            checkboxInput.type = 'checkbox';
            checkboxInput.name = 'pracownik';
            checkboxInput.id = rowData[1]; // ID pracownika jako identyfikator dla inputa checkbox
            checkboxInput.value = rowData[1]; // Możesz ustawić wartość na ID pracownika lub inną istotną informację
            checkboxCell.appendChild(checkboxInput);
            tableRow.appendChild(checkboxCell);
    
            // Dodaj wartości ID pracownika, Imię i Nazwisko do tabeli
            for (let i = 1; i <= 3; i++) {
                const tableCell = document.createElement('td');
                tableCell.textContent = rowData[i] ? rowData[i].toUpperCase() : ''; // Zamień dane na wielkie litery
                tableRow.appendChild(tableCell);
            }
    
            tableBody.appendChild(tableRow);
        });
    }

    document.getElementById("addEmployeeToProjectFile").addEventListener("click", function() {
        sendSelectedEmployeesData();
    });

    function sendSelectedEmployeesData() {
        // Pobierz zaznaczony projekt z tableBody2
        const selectedProjectRadio = document.querySelector('input[name="projekt"]:checked');
        if (!selectedProjectRadio) {
            alert('Wybierz projekt.');
            return;
        }
        
        const projectRow = selectedProjectRadio.closest('tr');
        const projectId = projectRow.cells[1].innerText; 
        const projectName = projectRow.cells[2].innerText; 
    
        // Zbierz wszystkie zaznaczone checkboxy z tabeli tableBody5
        const selectedCheckboxes = document.querySelectorAll('#tableBody5 input[type="checkbox"]:checked');
    
        if (selectedCheckboxes.length === 0) {
            alert('Wybierz przynajmniej jednego pracownika.');
            return;
        }
    
        // Przygotuj dane pracowników do wysłania
        const selectedEmployeesData = Array.from(selectedCheckboxes).map(checkbox => {
            const employeeRow = checkbox.closest('tr');
            const employeeId = employeeRow.cells[1].innerText;
            const employeeName = employeeRow.cells[2].innerText;
            const employeeSurname = employeeRow.cells[3].innerText;
            
            return {
                employeeId,
                employeeName,
                employeeSurname
            };
        });
    
        // Przygotuj dane do wysłania, włączając informacje o projekcie
        const dataToSend = {
            projectId,
            projectName,
            employees: selectedEmployeesData
        };
    
        // Wysyłka danych do serwera
        fetch('/update-employee-assignments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Wystąpił problem podczas zapisywania danych.');
            }
            return response.text();
        })
        .then(result => {
            console.log(result);
            alert('Przypisanie pracowników zaktualizowane pomyślnie.');
        })
        .catch(error => {
            console.error('Błąd:', error);
            alert('Wystąpił problem podczas zapisywania danych.');
        });
    }

    document.getElementById("addKpiToProject").addEventListener("click", function() {
        document.getElementById("button21").style.display = "inline-block";
        document.getElementById("button22").style.display = "inline-block"; 
        document.getElementById("SaveAfterEdition").style.display = "inline-block"; 
        document.getElementById("button23").style.display = "inline-block";  
        document.getElementById("button24").style.display = "inline-block";  
        // Schowaj wiersze tabeli poza zaznaczonym radiobuttonem
        const radioButtons = document.querySelectorAll('#tableBody2 input[type="radio"]');
        radioButtons.forEach(radioButton => {
            const row = radioButton.closest('tr');
            if (!radioButton.checked) {
                row.style.display = 'none'; // Ukryj wiersz
            }
        });
    
        // Schowaj przyciski od button10 do button15
        const buttonsToHide = ['button10', 'button11', 'button12', 'button13', 'button14', 'button15', 'addEmployeeToProject', 'addKpiToProject', 'button16','button17','button18','button19','button20'];
        buttonsToHide.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.style.display = 'none'; // Ukryj przycisk
            }
        });
    
        // Ukryj formularz
        document.getElementById("myForm2").style.display = "none";
    
        // Pokaż tabelę Kpi dla projektu
        KpiForProject.style.display = "table";
        loadDataKPIForProject(); // Wywołaj funkcję, aby zbudować tabelę
        updateSum();
    });
    
    function fillTableWithDataAboutKpiForProject(csvData) {
        const tableBody = document.getElementById("tableBody6");
        tableBody.innerHTML = ''; // Wyczyść zawartość tabeli przed wypełnieniem nowymi danymi
        const rows = csvData.split('\n').filter(line => line.trim() !== '');
        rows.forEach(row => {
            const rowData = row.split(',');
            const tableRow = document.createElement('tr');
    
            // Tworzenie komórki z radio buttonem
            const radioCell = document.createElement('td');
            const radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.name = 'KPI';
            radioCell.appendChild(radioButton);
            tableRow.appendChild(radioCell);
    
            // Dodawanie pozostałych komórek z danymi
            rowData.forEach(cellData => {
                const tableCell = document.createElement('td');
                tableCell.textContent = cellData;
                tableRow.appendChild(tableCell);
            });
            
            tableBody.appendChild(tableRow);
        });
        updateSum();
    }
    
    function loadDataKPIForProject() {
        const selectedProjectRadio = document.querySelector('input[name="projekt"]:checked');
        if (!selectedProjectRadio) {
            alert('Wybierz projekt.');
            return;
        }
    
        const projectRow = selectedProjectRadio.closest('tr');
        const projectId = projectRow.cells[1].innerText;
        const projectName = projectRow.cells[2].innerText;
    
        fetch(`/get-data-KPI-for-project?projectId=${projectId}&projectName=${projectName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Wystąpił problem podczas pobierania danych.');
            }
            return response.text();
        })
        .then(csvData => {
            fillTableWithDataAboutKpiForProject(csvData);
        })
        .catch(error => {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas pobierania danych.');
        });
        updateSum();
    }    
    
    function updateSum() {
        const weights = document.querySelectorAll('#tableBody6 tr td:nth-child(4)'); // Wybierz komórki z wagą KPI
        let total = 0;
        weights.forEach(function(td) {
            const input = td.querySelector('input') || {value: td.textContent.trim()};
            total += parseInt(input.value, 10) || 0;
        });
        const sumCell = document.getElementById('kpiSumCell');
        sumCell.textContent = total + '%'; // Aktualizacja komórki sumy
    
        if (total > 100) {
            alert('Suma wartości przekracza 100%. Proszę dokonać korekty.');
            document.getElementById('button24').disabled = true;
        } else {
            document.getElementById('button24').disabled = false;
        }
    }

    document.getElementById("button21").addEventListener("click", function() {
        // Sprawdź, czy formularz już istnieje
        if (!document.getElementById('dynamicForm2')) {
            // Utwórz formularz dynamicznie
            const form = document.createElement('form');
            form.id = 'dynamicForm2';
            form.innerHTML = `
                <label for="input1">ID KPI:</label>
                <input type="text" id="inputID_KPI"><br>
                <label for="input2">Nazwa KPI:</label>
                <input type="text" id="inputNameKPI"><br>
                <label for="input3">Procent:</label>
                <input type="text" id="inputKpiProcent"><br>
                <button type="button" id="addDataKPI">Dodaj KPI</button>
            `;
            document.body.appendChild(form);
    
            // Dodaj zdarzenie kliknięcia dla przycisku dodawania danych
            document.getElementById('addDataKPI').addEventListener('click', function() {
                // Pobierz wartości z formularza
                const input1Value = document.getElementById('inputID_KPI').value.toUpperCase();
                const input2Value = document.getElementById('inputNameKPI').value.toUpperCase();
                const input3Value = document.getElementById('inputKpiProcent').value.toUpperCase();
    
                // Sprawdź, czy wszystkie pola są wypełnione
                if (input1Value === '' || input2Value === '' || input3Value === '') {
                    alert("Proszę wypełnić wszystkie pola formularza.");
                    return;
                }
    
                // Dodaj nowy wiersz do tabeli
                const rentownoscTableBody = document.getElementById('tableBody6');
                rentownoscTableBody.innerHTML += `<tr>
                    <td><input type="radio" name="KPI"></td>
                    <td>${input1Value}</td>
                    <td>${input2Value}</td>
                    <td>${input3Value}</td>
                </tr>`;
    
                // Usuń formularz po dodaniu danych
                form.remove();
                updateSum();
            });
        }
    });

    document.getElementById("button22").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Pobierz wszystkie radio buttons
        var radioButtons = document.querySelectorAll('input[type="radio"][name="KPI"]');
        
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
            alert("Proszę wybrać KPI do edycji.");
        }
        updateSum();
    });

    document.getElementById("SaveAfterEdition").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Pobierz wszystkie radio buttons
        var radioButtons = document.querySelectorAll('input[type="radio"][name="KPI"]');
        
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
            alert("Proszę wybrać KPI do zapisu po edycji.");
        }
        updateSum();
    });

    document.getElementById("button23").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Pobierz wszystkie radio buttons
        var radioButtons = document.querySelectorAll('input[type="radio"][name="KPI"]');
        
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
            alert("Proszę wybrać KPI do usunięcia.");
        }
        updateSum();
    });

    document.getElementById("button24").addEventListener("click", function(event) {
        event.preventDefault(); // Zapobiegaj domyślnej akcji formularza
    
        // Pobierz wszystkie radio buttons
        var radioButtons = document.querySelectorAll('input[type="radio"][name="KPI"]');
        
        radioButtons.forEach(radioButton => {
            // Zamień radio na checkbox
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'KPI';
            checkbox.checked = radioButton.checked; // Zachowaj stan zaznaczenia
            radioButton.parentNode.replaceChild(checkbox, radioButton);
        });
        
        alert('Proszę zaznaczyć dane do wysyłki.');
    
        // Wywołaj funkcję sendSelectedKPIData
        sendSelectedKPIData();
    });
    
    function sendSelectedKPIData() {
        // Pobierz zaznaczony projekt z tableBody2
        const selectedProjectRadio = document.querySelector('input[name="projekt"]:checked');
        if (!selectedProjectRadio) {
            alert('Wybierz projekt.');
            return;
        }
        
        const projectRow = selectedProjectRadio.closest('tr');
        const projectId = projectRow.cells[1].innerText; 
        const projectName = projectRow.cells[2].innerText; 
    
        // Zbierz wszystkie zaznaczone checkboxy z tabeli tableBody6
        const selectedCheckboxes = document.querySelectorAll('#tableBody6 input[type="checkbox"]:checked');
    
        if (selectedCheckboxes.length === 0) {
            alert('Proszę zaznaczyć dane do wysyłki.');
            return;
        }
    
        // Przygotuj dane KPI do wysłania
        const selectedKPIData = Array.from(selectedCheckboxes).map(checkbox => {
            const KPIRow = checkbox.closest('tr');
            const KPIId = KPIRow.cells[1].innerText;
            const KPIName = KPIRow.cells[2].innerText;
            const KPIProcent = KPIRow.cells[3].innerText;
            
            return {
                KPIId,
                KPIName,
                KPIProcent
            };
        });
    
        // Przygotuj dane do wysłania, włączając informacje o projekcie
        const dataToSend = {
            projectId,
            projectName,
            KPIs: selectedKPIData
        };
    
        // Wysyłka danych do serwera
        fetch('/update-kpi-assignments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Wystąpił problem podczas zapisywania danych.');
            }
            return response.text();
        })
        .then(result => {
            console.log(result);
            alert('Przypisanie KPI zaktualizowane pomyślnie.');
        })
        .catch(error => {
            console.error('Błąd:', error);
            alert('Wystąpił problem podczas zapisywania danych.');
        });
    }


    