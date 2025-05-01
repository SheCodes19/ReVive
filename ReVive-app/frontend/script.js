document.getElementById("loginBtn").addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (res.status === 200) return res.text();
      else throw new Error("Login failed");
    })
    .then(msg => {
      alert(msg);
      window.location.href = "welcome.html";
    })
    .catch(err => alert(err.message));
  });
  
  document.getElementById("signupBtn").addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (res.status === 200) return res.text();
      else throw new Error("Signup failed or user already exists");
    })
    .then(msg => alert(msg))
    .catch(err => alert(err.message));
  });
  