// null_service.js

/**
 * Generate a row of "null" objects simulating empty data.
 * @param {number} rowCount - The number of rows to generate.
 * @param {Array<string>} columnNames - List of column names for the table.
 * @returns {Array<object>} - Array of objects containing null values.
 */
function generateNullRows(rowCount, columnNames) {
    const nullRows = [];
    for (let i = 0; i < rowCount; i++) {
        const nullRow = { Lp: i + 1 };
        columnNames.forEach(col => {
            nullRow[col] = 'null';
        });
        nullRows.push(nullRow);
    }
    return nullRows;
}

/**
 * Fill the table body with the provided rows.
 * @param {Array<object>} rows - Array of rows to be inserted into the table.
 * @param {string} tableBodyId - The HTML ID of the table body where rows are inserted.
 */
function populateTable(rows, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) {
        console.error(`Table body with ID "${tableBodyId}" not found.`);
        return;
    }
    tableBody.innerHTML = ''; // Clear existing rows
    rows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.Lp}</td>
            ${Object.values(row).slice(1).map(val => `<td>${val}</td>`).join('')}
        `;
        tableBody.appendChild(tr);
    });
}

/**
 * Fetch data from the server or fallback to "null" data.
 * @param {string} url - The API URL to fetch data from.
 * @param {number} rowCount - Number of fallback rows to generate if no data.
 * @param {Array<string>} columnNames - List of column names to represent.
 * @param {string} tableBodyId - The HTML ID of the table body where rows are inserted.
 */
async function fetchAndPopulate(url, rowCount, columnNames, tableBodyId) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Server responded with status ${response.status}`);

        const data = await response.json();
        if (data.length === 0) throw new Error('No data available');

        // Populate table with actual data
        const rows = data.map((row, index) => ({
            Lp: index + 1,
            ...row
        }));
        populateTable(rows, tableBodyId);
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        // Fallback to "null" rows
        const nullRows = generateNullRows(rowCount, columnNames);
        populateTable(nullRows, tableBodyId);
    }
}// Usuwa zaznaczony wiersz na podstawie zaznaczonego radio buttona
function deleteSelectedRow() {
    // Znajduje zaznaczony radio button w tabeli
    const selectedRadio = document.querySelector('tbody input[name="pracownik"]:checked');
    if (selectedRadio) {
        // Pobiera wiersz rodzica wybranego radio buttona i go usuwa
        const row = selectedRadio.closest('tbody');
        if (row) {
            row.parentElement.removeChild(row);
            console.log('Usuniêto zaznaczony wiersz.');
        } else {
            console.warn('Nie znaleziono wiersza do usuniêcia.');
        }
    } else {
        console.warn('Nie zaznaczono ¿adnego wiersza.');
    }
}

// Dodaje obs³ugê klikniêcia na przycisk "Usuñ"
document.addEventListener('DOMContentLoaded', function () {
    const deleteButton = document.getElementById('button3');
    if (deleteButton) {
        deleteButton.addEventListener('click', deleteSelectedRow);
    } else {
        console.error('Nie znaleziono przycisku "Usuñ".');
    }
});
