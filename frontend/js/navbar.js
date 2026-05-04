const setUsername = () => {
  const name = localStorage.getItem("username") || "Vieras";
  const el = document.getElementById("username-display");

  if (el) el.textContent = name;
};

const initUserMenu = () => {
  const menu = document.getElementById("user-menu");
  const dropdown = document.getElementById("dropdown");

  if (!menu || !dropdown) return;

  menu.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", () => {
    dropdown.classList.add("hidden");
  });
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
  initUserMenu();
  initLogout();
});