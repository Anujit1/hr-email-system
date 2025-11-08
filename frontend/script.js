const form = document.getElementById("emailForm");
const messageEl = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

function setMessage(text, type = "") {
  messageEl.textContent = text;
  messageEl.className = type; // "", "success", "error"
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMessage("", "");

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const role = form.role.value.trim();
  const status = form.querySelector('input[name="status"]:checked')?.value;

  // Basic validation
  if (!name || !email || !role || !status) {
    setMessage("Please fill in all fields.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    setMessage("Please enter a valid email address.", "error");
    return;
  }

  // disable button while sending
  sendBtn.disabled = true;
  setMessage("Sending...", "");

  try {
    const res = await fetch("/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role, status })
    });

    const data = await res.json();

    if (data?.success) {
      setMessage("✅ Email sent successfully!", "success");
      form.reset();
    } else {
      // show server error message if available
      const errText = data?.message || "Failed to send email. Try again.";
      setMessage(`❌ ${errText}`, "error");
    }
  } catch (err) {
    setMessage("⚠️ Error connecting to server.", "error");
  } finally {
    sendBtn.disabled = false;
  }
});
