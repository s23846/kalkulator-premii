// load-header.js
document.addEventListener("DOMContentLoaded", function () {
    fetch(newFunction())
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            highlightActiveLink();
            loadCss();
        });
});

function newFunction() {
    return '/frontend/Header/header.html';
}

function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link');
    const currentUrl = window.location.href;
    links.forEach(link => {
        console.log('Link URL:', link.getAttribute('href'));
        console.log('Current URL:', currentUrl);
        if (currentUrl.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}

function loadCss() {
    // Get HTML head element
    let head = document.getElementsByTagName('HEAD')[0];
 
    // Create new link Element
    let link = document.createElement('link');

    // set the attributes for link element
    link.rel = 'stylesheet';

    link.type = 'text/css';

    link.href = '/frontend/Header/header.css';

    // Append link element to HTML head
    head.appendChild(link);
}
