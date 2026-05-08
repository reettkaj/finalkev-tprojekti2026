import { fetchData } from "./fetch";

const API_BASE = "https://ptsdjahyvinvointiseurantasovellus.polandcentral.cloudapp.azure.com/api";

const collectTSQAnswers = () => {
  const answers = [];

  for (let i = 1; i <= 10; i++) {
    const checked = document.querySelector(`input[name="tsq${i}"]:checked`);

    if (!checked) return null;

    answers.push({
      question: i,
      answer: checked.value === "kylla" ? 1 : 0
    });
  }

  return answers;
};

const sendTSQ = async (answers) => {
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  const url = `${API_BASE}/tsq`;

  return await fetchData(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      answers
    }),
  });
};

const removeNewUserTag = async () => {
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  const url = `${API_BASE}/users/newuser/${userId}`;

  const data = await fetchData(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data || data.error) return null;

  localStorage.setItem('isNew', '0');
  return data;
};

const initTSQBlocking = () => {
  const isNew = localStorage.getItem("isNew");

  const overlay = document.querySelector("#tsq-overlay");
  const form = document.querySelector("#tsq-form");

  if (!overlay || !form) return;

  if (isNew === "1" || isNew === "true") {
    overlay.classList.remove("hidden");
  }

  const tsqButton = document.querySelector("#open-tsq-btn");

  if (tsqButton) {
    tsqButton.addEventListener("click", openTSQModal);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const answers = collectTSQAnswers();

    if (!answers) {
      alert("Vastaa kaikkiin kysymyksiin ennen jatkamista.");
      return;
    }

    const button = form.querySelector("button");
    button.disabled = true;

    const tsqResponse = await sendTSQ(answers);

    if (!tsqResponse || tsqResponse.error) {
      alert("Kyselyn tallennus epäonnistui");
      button.disabled = false;
      return;
    }

    const updateResponse = await removeNewUserTag();

    if (!updateResponse) {
      alert("Käyttäjän päivitys epäonnistui");
      button.disabled = false;
      return;
    }

    overlay.classList.add("hidden");

    console.log("Kysely suoritettu onnistuneesti");
  });
};

const openTSQModal = () => {
  const overlay = document.querySelector("#tsq-overlay");

  if (!overlay) {
    console.error("TSQ overlay puuttuu DOM:sta");
    return;
  }

  overlay.classList.remove("hidden");
};

document.addEventListener("DOMContentLoaded", initTSQBlocking);

const tsqButton = document.querySelector("#open-tsq-btn");

if (tsqButton) {
  tsqButton.addEventListener("click", openTSQModal);
}