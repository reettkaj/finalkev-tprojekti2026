import { fetchData } from "./fetch";

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

  const url = `http://localhost:3000/api/tsq`;

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

  const url = `http://localhost:3000/api/users/newuser/${userId}`;

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

  if (!(isNew === "1" || isNew === "true")) return;

  const overlay = document.querySelector("#tsq-overlay");
  const form = document.querySelector("#tsq-form");

  if (!overlay || !form) return;

  overlay.classList.remove("hidden");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const answers = collectTSQAnswers();

    if (!answers) {
      alert("Vastaa kaikkiin kysymyksiin ennen jatkamista.");
      return;
    }

    // 🔒 estä tuplaklikkaus
    const button = form.querySelector("button");
    button.disabled = true;

    // 1. TSQ
    const tsqResponse = await sendTSQ(answers);

    if (!tsqResponse || tsqResponse.error) {
      alert("Kyselyn tallennus epäonnistui");
      button.disabled = false;
      return;
    }

    // 2. isNew
    const updateResponse = await removeNewUserTag();

    if (!updateResponse) {
      alert("Käyttäjän päivitys epäonnistui");
      button.disabled = false;
      return;
    }

    // 3. UI
    overlay.classList.add("hidden");

    console.log("Kysely suoritettu onnistuneesti");
  });
};

document.addEventListener("DOMContentLoaded", initTSQBlocking);