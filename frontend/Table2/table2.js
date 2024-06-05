//OBSŁUGA ROZLICZENIA PODSTAWOWEGO
document.addEventListener("DOMContentLoaded", function() {
    loadDataFromCSV();
    loadSavedData();
    hideFutureYears();
    document.getElementById("button7").addEventListener("click", handleEmployeeSelection);
    document.getElementById("button8").addEventListener("click", saveTableToServer);
    document.getElementById("button9").addEventListener("click", handleBonusSelection);
    document.getElementById("mySelect").addEventListener("change", function() {
        if (document.querySelector('table').style.display === "none") {
            buildTableForYear(selectedEmployeeId);
        }
    });
});

let employeesData = {}; // Obiekt do przechowywania danych pracowników
let selectedEmployeeId = null; // Zmienna globalna do przechowywania wybranego ID pracownika
let savedData = {}; // Obiekt do przechowywania zapisanych danych

function loadDataFromCSV() {
    fetch('/frontend/Listapracowników.csv') // Wczytaj dane z serwera
    .then(response => {
        if (!response.ok) {
            throw new Error('Wystąpił problem podczas pobierania danych o pracownikach.');
        }
        return response.text();
    })
    .then(csvData => {
        employeesData = parseCSVData(csvData); // Parsuj i przechowuj dane pracowników
        displayData(csvData); // Wyświetl dane w tabeli
    })
    .catch(error => {
        console.error('Błąd:', error);
        alert('Wystąpił błąd podczas pobierania danych o pracownikach.');
    });
}

function loadSavedData() {
    fetch('/get-saved-data') // Wczytaj zapisane dane z serwera
    .then(response => {
        if (!response.ok) {
            throw new Error('Wystąpił problem podczas pobierania danych rozliczenia pracownika.');
        }
        return response.text();
    })
    .then(csvData => {
        savedData = parseSavedData(csvData); // Parsuj i przechowuj zapisane dane
    })
    .catch(error => {
        console.error('Błąd:', error);
        alert('Wystąpił błąd podczas pobierania zapisanych danych rozliczenia pracownika.');
    });
}

function parseCSVData(csvData) {
    const rows = csvData.split('\n');
    const data = {};
    rows.forEach(row => {
        const rowData = row.split(',');
        if (rowData.length < 7) return; // Pomijaj niekompletne wiersze
        const employeeId = rowData[1]; // Zakładam, że ID pracownika jest w kolumnie 1
        const salary = parseFloat(rowData[6]); // Zakładam, że kwota brutto jest w kolumnie 7
        const imie = rowData[2]; // Imię pracownika w kolumnie 2
        const nazwisko = rowData[3]; // Nazwisko pracownika w kolumnie 3
        data[employeeId] = { salary, imie, nazwisko };
    });
    return data;
}

function parseSavedData(csvData) {
    const rows = csvData.split('\n');
    const data = {};
    rows.forEach(row => {
        const rowData = row.split(',');
        if (rowData.length < 7) return; // Pomijaj niekompletne wiersze
        const employeeId = rowData[0]; // Zakładam, że ID pracownika jest w kolumnie 0
        const year = rowData[3]; // Rok w kolumnie 3
        const month = rowData[4]; // Miesiąc w kolumnie 4
        const hoursWorked = rowData[5]; // Ilość godzin wypracowanych w kolumnie 5
        const salary = rowData[6]; // Wynagrodzenie w kolumnie 6
        if (!data[employeeId]) data[employeeId] = {};
        data[employeeId][`${year}-${month}`] = { hoursWorked, salary };
    });
    return data;
}

function displayData(csvData) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ''; // Wyczyść zawartość tabeli przed wypełnieniem nowymi danymi

    const rows = csvData.split('\n');
    rows.forEach(row => {
        if (row.trim() === '') return;

        const rowData = row.split(',');
        if (rowData.length < 7) return;

        const tableRow = document.createElement('tr');

        const radioCell = document.createElement('td');
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'pracownik';
        radioInput.value = rowData[1];
        radioCell.appendChild(radioInput);
        tableRow.appendChild(radioCell);

        for (let i = 1; i <= 3; i++) {
            const tableCell = document.createElement('td');
            tableCell.textContent = rowData[i].toUpperCase();
            tableRow.appendChild(tableCell);
        }
        tableBody.appendChild(tableRow);
    });
}

document.getElementById("applyFilters").addEventListener("click", function() {
    const imieValue = document.getElementById("filterImie").value.toUpperCase();
    const nazwiskoValue = document.getElementById("filterNazwisko").value.toUpperCase();
    const rows = document.querySelectorAll("#tableBody tr");

    rows.forEach(function(row) {
        const imie = row.cells[2].textContent.toUpperCase();
        const nazwisko = row.cells[3].textContent.toUpperCase();

        if (imie.includes(imieValue) && nazwisko.includes(nazwiskoValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

function hideFutureYears() {
    const select = document.getElementById("mySelect");
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < select.options.length; i++) {
        const year = parseInt(select.options[i].text);
        if (year > currentYear) {
            select.options[i].style.display = 'none';
        }
    }
}

function handleEmployeeSelection() {
    const radioButtons = document.querySelectorAll('input[type="radio"][name="pracownik"]');
    let selectedRow = null;

    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            selectedRow = radioButtons[i].parentElement.parentElement;
            selectedEmployeeId = radioButtons[i].value;
            break;
        }
    }
    if (selectedRow) {
        document.getElementById("filter-container").style.display = "none";
        document.getElementById("button7").style.display = "none";
        document.getElementById("button9").style.display = "none";
        document.getElementById("tableBody").style.display = "none";
        document.querySelector('table thead').style.display = "none";
        document.querySelector('table').style.display = "none";

        buildTableForYear();
    } else {
        alert("Proszę wybrać pracownika.");
    }
}

function buildTableForYear() {
    const select = document.getElementById("mySelect");
    const selectedOption = select.options[select.selectedIndex];
    const selectedYear = parseInt(selectedOption.text);

    const months = [
        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ];

    const existingTable = document.getElementById("yearTable");
    if (existingTable) existingTable.remove();

    const table = document.createElement('table');
    table.id = "yearTable";
    table.innerHTML = `
        <thead>
            <tr>
                <th>Rok</th>
                <th>Miesiąc</th>
                <th>Liczba godzin pracy</th>
                <th>Ilość godzin wypracowanych</th>
                <th>Wynagrodzenie</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    const tbody = table.querySelector('tbody');

    months.forEach((month, index) => {
        const year = selectedYear;
        const monthIndex = index;

        const workHours = calculateWorkHours(year, monthIndex);
        const key = `${year}-${month}`;
        const savedEntry = savedData[selectedEmployeeId] ? savedData[selectedEmployeeId][key] : null;

        const hoursWorked = savedEntry ? savedEntry.hoursWorked : '';
        const salary = savedEntry ? savedEntry.salary : '';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${year}</td>
            <td>${month}</td>
            <td>${workHours}</td>
            <td>
                <span class="hours-worked-text">${hoursWorked}</span>
                <input type="text" class="hours-worked-input" style="display:none;" />
                <button class="edit-button">✏️</button>
                <button class="save-button" style="display:none;">✔️</button>
            </td>
            <td class="salary-cell">${salary}</td>
        `;
        tbody.appendChild(row);
    });

    document.body.appendChild(table);

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function () {
            const td = this.parentElement;
            const span = td.querySelector('.hours-worked-text');
            const input = td.querySelector('.hours-worked-input');
            const saveButton = td.querySelector('.save-button');

            span.style.display = 'none';
            input.style.display = 'inline';
            saveButton.style.display = 'inline';
            this.style.display = 'none';
            input.value = span.textContent;
            input.focus();
        });
    });

    document.querySelectorAll('.save-button').forEach(button => {
        button.addEventListener('click', function () {
            saveHoursWorked(this, selectedEmployeeId);
        });
    });

    document.querySelectorAll('.hours-worked-input').forEach(input => {
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                saveHoursWorked(this.nextElementSibling, selectedEmployeeId);
            }
        });
    });
}

function saveHoursWorked(button, employeeId) {
    const td = button.parentElement;
    const span = td.querySelector('.hours-worked-text');
    const input = td.querySelector('.hours-worked-input');
    const editButton = td.querySelector('.edit-button');
    const salaryCell = td.parentElement.querySelector('.salary-cell');

    const hoursWorked = parseFloat(input.value);
    const salaryRate = employeesData[employeeId]?.salary || 0;
    const salary = hoursWorked * salaryRate;

    const formattedSalary = salary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' PLN';

    span.textContent = hoursWorked;
    salaryCell.textContent = formattedSalary;

    span.style.display = 'inline';
    input.style.display = 'none';
    button.style.display = 'none';
    editButton.style.display = 'inline';
}

function calculateWorkHours(year, month) {
    const holidays = getHolidays(year);
    let workDays = 0;
    let daysOff = 0;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let additionalDaysOff = 0;

    holidays.forEach(holiday => {
        if (holiday.getDay() === 6 && holiday.getMonth() === month) {
            additionalDaysOff++;
        }
    });

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const isWeekend = (currentDate.getDay() === 0 || currentDate.getDay() === 6);
        const isHoliday = holidays.some(holiday =>
            holiday.getDate() === currentDate.getDate() &&
            holiday.getMonth() === currentDate.getMonth()
        );

        if (isHoliday) {
            daysOff++;
        }

        if (!isWeekend && !isHoliday) {
            workDays++;
        }
    }

    daysOff += additionalDaysOff;

    const workHours = workDays * 8;

    return workHours;
}

function getHolidays(year) {
    return [
        new Date(year, 0, 1),   // Nowy Rok
        new Date(year, 0, 6),   // Trzech Króli
        calculateEasterMonday(year), // Poniedziałek Wielkanocny
        new Date(year, 4, 1),   // Święto Pracy
        new Date(year, 4, 3),   // Święto Konstytucji 3 Maja
        calculateCorpusChristi(year), // Boże Ciało
        new Date(year, 7, 15),  // Wniebowzięcie Najświętszej Maryi Panny
        new Date(year, 10, 1),  // Wszystkich Świętych
        new Date(year, 10, 11), // Narodowe Święto Niepodległości
        new Date(year, 11, 25), // Boże Narodzenie
        new Date(year, 11, 26)  // Drugi dzień Bożego Narodzenia
    ];
}

function calculateEasterMonday(year) {
    const f = Math.floor,
        G = year % 19,
        C = f(year / 100),
        H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
        I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
        J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
        L = I - J,
        month = 3 + f((L + 40) / 44),
        day = L + 28 - 31 * f(month / 4);

    const easterSunday = new Date(year, month - 1, day);
    const easterMonday = new Date(easterSunday);
    easterMonday.setDate(easterSunday.getDate() + 1);

    return easterMonday;
}

function calculateCorpusChristi(year) {
    const easterMonday = calculateEasterMonday(year);
    const corpusChristi = new Date(easterMonday);
    corpusChristi.setDate(easterMonday.getDate() + 59);
    return corpusChristi;
}

// Funkcja do zapisywania tabeli do pliku CSV na serwerze
function saveTableToServer() {
    fetch('/get-saved-data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Wystąpił problem podczas pobierania danych o rozliczeniu pracownika.');
        }
        return response.text();
    })
    .then(existingData => {
        const existingRows = existingData.split('\n').filter(line => line.trim() !== '');
        let csvContent = "ID,Imię,Nazwisko,Rok,Miesiąc,Ilość godzin wypracowanych,Wynagrodzenie\n"; // Nagłówki CSV

        const table = document.getElementById("yearTable");
        if (!table) {
            alert('Tabela nie istnieje.');
            return;
        }

        const rows = table.querySelectorAll("tbody tr");
        rows.forEach(row => {
            const year = row.children[0].textContent;
            const month = row.children[1].textContent;
            const workHours = row.children[2].textContent;
            const hoursWorked = row.children[3].querySelector('.hours-worked-text').textContent;
            const salary = row.children[4].textContent;
            const employee = employeesData[selectedEmployeeId];
            const newRowData = [selectedEmployeeId, employee.imie, employee.nazwisko, year, month, hoursWorked, salary];
            let found = false;

            // Update the existing data with the new row data
            for (let i = 1; i < existingRows.length; i++) { // Start from 1 to skip the header
                const existingRowData = existingRows[i].split(',');
                if (existingRowData[0] === selectedEmployeeId && existingRowData[3] === year && existingRowData[4] === month) {
                    existingRows[i] = newRowData.join(",");
                    found = true;
                    break;
                }
            }

            if (!found) {
                existingRows.push(newRowData.join(","));
            }
        });

        csvContent += existingRows.join("\n");

        fetch('/save-employee-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: csvContent
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Wystąpił problem podczas zapisywania danych rozliczenia pracownika.');
            }
            alert('Dane rozliczenia pracownika zostały zapisane pomyślnie.');
        })
        .catch(error => {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas zapisywania danych rozliczenia pracownika.');
        });
    })
    .catch(error => {
        console.error('Błąd:', error);
        alert('Wystąpił błąd podczas pobierania zapisanych danych o rozliczeniu pracownika.');
    });
}

function handleBonusSelection() {
    var radios = document.querySelectorAll('input[name="pracownik"]');
    var selectedEmployee = null;
    for (var radio of radios) {
        if (radio.checked) {
            selectedEmployee = radio;
            break;
        }
    }

    if (selectedEmployee) {
        var employeeId = selectedEmployee.value;
        var employeeRow = selectedEmployee.closest('tr');
        var employeeName = employeeRow.cells[2].textContent;
        var employeeSurname = employeeRow.cells[3].textContent;

         // Zapis danych do lokalnego przechowywania
         localStorage.setItem('selectedEmployeeId', employeeId);
         localStorage.setItem('selectedEmployeeName', employeeName);
         localStorage.setItem('selectedEmployeeSurname', employeeSurname);

        // Przypieszenie przekierowania poprzez usunięcie opóźnienia
        window.location.href = `http://localhost:3005/premie.html?id=${employeeId}&name=${encodeURIComponent(employeeName)}&surname=${encodeURIComponent(employeeSurname)}`;

        // Tworzenie etykiet na nowej stronie
        createLabels(employeeId, employeeName, employeeSurname);
    } else {
        alert('Proszę wybrać pracownika.');
    }
}


