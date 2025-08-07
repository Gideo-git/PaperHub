import { decodeToken } from './utils/auth.js';
 document.getElementById("loginForm").addEventListener("submit", async (e) => {
    
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        const payload = decodeToken(data.token);
        if (payload && payload.role) {
            localStorage.setItem('userRole', payload.role);
        }
        console.log("Login successful!");
        window.location.href = "index.html"; // Go to paper search page
      } else {
        console.log(data.message || "Login failed");
        localStorage.clear();
      }
    });