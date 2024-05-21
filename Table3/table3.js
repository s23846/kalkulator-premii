//OBSŁUGA TABEL PREMII

document.addEventListener("DOMContentLoaded", function() {
    fillLabelsFromLocalStorage();
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
