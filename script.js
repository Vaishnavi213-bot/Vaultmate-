document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const table = document.querySelector("table");

    // Load data from localStorage on page load
    loadPasswords();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const websiteInput = document.querySelector("#WebsiteName");
        const passwordInput = document.querySelector("#password");

        const website = websiteInput.value;
        const password = passwordInput.value;

        // Save to localStorage
        const passwords = JSON.parse(localStorage.getItem("passwords")) || [];
        passwords.push({ website, password });
        localStorage.setItem("passwords", JSON.stringify(passwords));

        // Clear form fields
        websiteInput.value = "";
        passwordInput.value = "";

        // Refresh table
        loadPasswords();
    });

    function loadPasswords() {
        const passwords = JSON.parse(localStorage.getItem("passwords")) || [];

        // Clear existing rows (except the header)
        const rows = table.querySelectorAll("tr");
        rows.forEach((row, index) => {
            if (index > 0) row.remove();
        });

        // Rebuild the table rows
        passwords.forEach((entry, index) => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${entry.website}</td>
                <td>******</td>
                <td>
                    <input type="password" value="${entry.password}" readonly id="pwd-${index}">
                    <button onclick="copyPassword(${index})">📋</button>
                </td>
                <td><button onclick="deletePassword(${index})">Delete</button></td>
            `;
        });
    }

    // Attach functions to window for inline use
    window.deletePassword = function(index) {
        const passwords = JSON.parse(localStorage.getItem("passwords")) || [];
        passwords.splice(index, 1);
        localStorage.setItem("passwords", JSON.stringify(passwords));
        loadPasswords();
    };

    window.copyPassword = function(index) {
        const input = document.getElementById(`pwd-${index}`);
        input.select();
        input.setSelectionRange(0, 99999); // For mobile
        document.execCommand("copy");
        alert("Password copied to clipboard!");
    };
});
