import { fetchData } from "./fetch";

const collectTSQAnswers = () => {
  const answers = [];

  for (let i = 1; i <= 10; i++) {
    const checked = document.querySelector(`input[name="tsq${i}"]:checked`);

    if (!checked) {
      return null; // validointi epäonnistui
    }

    answers.push({
      question: i,
      answer: checked.value === "kylla" ? 1 : 0
    });
  }

  return answers;
};

const removeNewUserTag = async () => {
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  if (!userId || !token) {
    console.error('user_id tai token puuttuu');
    return;
  }

  const url = `http://localhost:3000/api/users/newuser/${userId}`;

  const data = await fetchData(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!data || data.error) {
    console.log('isNew päivitys epäonnistui');
    return;
  }

  localStorage.setItem('isNew', '0');

  console.log('isNew poistettu käyttäjältä');
};

const initTSQBlocking = () => {
  const isNew = localStorage.getItem("isNew");

  if (!(isNew === "1" || isNew === "true")) return;

  const overlay = document.querySelector("#tsq-overlay");
  const form = document.querySelector("#tsq-form");

  if (!overlay || !form) return;

  //Näytetään overlay
  overlay.classList.remove("hidden");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    //tarkistetaan että kaikkiin kysymyksiin on vastattu
    const totalQuestions = 10;
    let answered = 0;

    for (let i = 1; i <= totalQuestions; i++) {
      const checked = document.querySelector(`input[name="tsq${i}"]:checked`);
      if (checked) answered++;
    }

    if (answered !== totalQuestions) {
      alert("Vastaa kaikkiin kysymyksiin ennen jatkamista.");
      return;
    }

    // valmis → piilotetaan
    overlay.classList.add("hidden");

    //merkataan ettei käyttäjä ole enää uusi
    removeNewUserTag();

    console.log("Kysely suoritettu");
  });
};

document.addEventListener("DOMContentLoaded", initTSQBlocking);