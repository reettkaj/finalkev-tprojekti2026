import { fetchData } from "./fetch.js";
const renderByRole = () => {
  const roleId = Number(localStorage.getItem("role_id"));

  const doctorContent = document.querySelector(".laakarincontent");
  const adminContent = document.querySelector(".yllapitajancontent");

  if (!doctorContent || !adminContent) return;

  // piilota kaikki ensin
  doctorContent.classList.add("hidden");
  adminContent.classList.add("hidden");

  if (roleId === 2) {
    doctorContent.classList.remove("hidden");
  } else if (roleId === 1) {
    adminContent.classList.remove("hidden");
  } else {
    console.warn("Tuntematon role_id:", roleId);
  }
};

const initRegisterToggle = () => {
  const button = document.getElementById("show-register-form");
  const container = document.getElementById("register-form-container");

  if (!button || !container) return;

  button.addEventListener("click", () => {
    container.classList.toggle("hidden");
  });
};

const handleRegister = () => {
  const form = document.getElementById("register-form");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const userData = {
      email: document.getElementById("email").value,
      name: document.getElementById("name").value,
      password: document.getElementById("password").value,
      role_id: Number(document.getElementById("role").value),
      auth_provider: 'local'
    };

    const response = await fetchData("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response || response.error) {
      alert("Käyttäjän luonti epäonnistui");
      return;
    }

    alert("Käyttäjä luotu");

    form.reset();
  });
};


document.addEventListener("DOMContentLoaded", () => {
  renderByRole();        
  initRegisterToggle();
  handleRegister(); 
});