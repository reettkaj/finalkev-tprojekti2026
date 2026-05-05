const setUsername = () => {
  const name = localStorage.getItem("username") || "Vieras";
  const el = document.getElementById("username-display");

  if (el) el.textContent = name;
};

const initLogout = () => {
  const btn = document.getElementById("logout-btn");

  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });
};

document.addEventListener("DOMContentLoaded", () => {
  setUsername();
  initLogout();
});