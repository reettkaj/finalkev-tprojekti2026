import { fetchData } from "./fetch";

const API_BASE = "https://ptsdjahyvinvointiseurantasovellus.polandcentral.cloudapp.azure.com/api";

const deleteUser = async () => {
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    console.error("missing auth data");
    return;
  }

  const confirmDelete = confirm(
    "Haluatko varmasti poistaa käyttäjätilisi? Tätä ei voi perua."
  );

  if (!confirmDelete) return;

  try {
    const response = await fetchData(
      `${API_BASE}/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response || response.error) {
      alert("Käyttäjän poisto epäonnistui");
      return;
    }

    localStorage.clear();

    alert("Käyttäjä poistettu");

    window.location.href = "index.html";

  } catch (error) {
    console.error("deleteUser error:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".delete-user");

  if (!btn) return;

  btn.addEventListener("click", deleteUser);
});