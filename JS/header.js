// Loading the navbar
function loadNavbar() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        })
        .catch(error => console.log('Error loading footer:', error));
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadNavbar);
