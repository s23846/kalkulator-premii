// load-header.js
document.addEventListener("DOMContentLoaded", function () {
    fetch(newFunction())
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            highlightActiveLink();
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

function loadPage(pageUrl) {
    fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            highlightActiveLink(); // Refresh active link highlights when new page is loaded
        }).catch(err => console.error('Failed to load page: ', err));
}