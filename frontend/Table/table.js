// Pobierz przyciski
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const button3 = document.getElementById('button3');

// Przypisz zdarzenie kliknięcia do każdego przycisku
button1.addEventListener('click', function() {
    // Obsługa kliknięcia dla przycisku "Dodaj"
    console.log('Kliknięto przycisk "Dodaj"');
});

button2.addEventListener('click', function() {
    // Obsługa kliknięcia dla przycisku "Edytuj"
    console.log('Kliknięto przycisk "Edytuj"');
});

button3.addEventListener('click', function() {
    // Obsługa kliknięcia dla przycisku "Usuń"
    console.log('Kliknięto przycisk "Usuń"');
});

button1.click();
