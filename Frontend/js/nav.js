// js/nav.js

function createNavbar() {
    const userRole = localStorage.getItem('userRole');
    const navbarDiv = document.getElementById('navbar');

    if (!navbarDiv) return;

    // The navigation links
    let navLinks = `
        <a href="index.html">Search</a>
    `;

    // Conditionally add the "Upload" link for admins
    if (userRole === 'admin') {
        navLinks += `<a href="upload.html">Upload</a>`;
    }
    
    // Add the Logout button
    navLinks += `<a href="#" id="logoutButton">Logout</a>`;

    navbarDiv.innerHTML = `
        <nav class="main-nav">
            ${navLinks}
        </nav>
    `;

    // Add event listener for the logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            window.location.href = 'login.html';
        });
    }
}

// Run the function when the script loads
createNavbar();