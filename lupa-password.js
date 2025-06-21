const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxL9n0sQfUP4-hvne-_MYZhlHBfA1-8X7hqOm-Gao43gYt8vJXzo7Tr_kWYZYTuLvGd/exec";

document.getElementById("lupaPasswordForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("username").value.trim(); // ← sesuaikan ID di sini
  const messageBox = document.getElementById("message");

  messageBox.textContent = "Memproses...";
  messageBox.style.color = "black";

  fetch(`${SCRIPT_URL}?action=lupaPassword&email=${encodeURIComponent(email)}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        messageBox.style.color = "green";
        messageBox.textContent = `Password Anda: ${data.password}`;
      } else {
        messageBox.style.color = "red";
        messageBox.textContent = "Email tidak ditemukan.";
      }
    })
    .catch(err => {
      console.error("Error:", err);
      messageBox.style.color = "red";
      messageBox.textContent = "Terjadi kesalahan. Silakan coba lagi.";
    });
});
