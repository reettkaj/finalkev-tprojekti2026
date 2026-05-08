import { fetchData } from './fetch';

const API_BASE = "https://ptsdjahyvinvointiseurantasovellus.polandcentral.cloudapp.azure.com/api";

// Function to test and get user info from kubios API
const getUserInfo = async () => {
  console.log('Käyttäjän INFO Kubioksesta');

  const url = `${API_BASE}/kubios/user-info`;
  const token = localStorage.getItem('token');

  const options = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const userData = await fetchData(url, options);

  console.log("RAW:", userData.results);

  if (userData.error) {
    console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
    return;
  }

  console.log(userData);
};

// Function to get more actual data from Kubios API
const getUserData = async () => {
  console.log('Käyttäjän DATA Kubioksesta');

  const url = `${API_BASE}/kubios/user-data`;
  const token = localStorage.getItem('token');

  const options = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const userData = await fetchData(url, options);

  if (userData.error) {
    console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
    return;
  }

  drawChart(userData);

  const formattedData = formatKubiosResults(userData);

  console.log("RAW:", userData.results);
  console.log("FORMATTED:", formattedData);

  if (formattedData.length > 0) {
    const latest = formattedData[formattedData.length - 1];

    document.querySelector('.current-hrv').textContent =
      Math.round(latest.readiness) ?? '-';

    document.querySelector('.avg-hrv').textContent =
      Math.round(
        formattedData.reduce((sum, d) => sum + d.readiness, 0) /
        formattedData.length
      );

    document.querySelector('.today-measurements').textContent =
      formattedData.length;

    document.querySelector('.current-stress').textContent =
      Math.round(latest.stressIndex);

    const stressColor =
      latest.stressIndex <= 10
        ? '#16a34a'
        : latest.stressIndex <= 20
        ? '#f59e0b'
        : '#dc2626';

    document.querySelector('.current-stress').style.color = stressColor;

    updateRecoveryMessage(latest.readiness);

    const readinessColor =
      latest.readiness >= 80
        ? '#16a34a'
        : latest.readiness >= 60
        ? '#f59e0b'
        : '#dc2626';

    document.querySelector('.current-hrv').style.color = readinessColor;
  }
};

const formatKubiosResults = (userData) => {
  const formatter = new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'long',
  });

  return userData.results
    .filter(entry => entry.daily_result)
    .map((entry) => {
      const dateObject = new Date(entry.daily_result);

      if (isNaN(dateObject)) {
        console.log('INVALID DATE:', entry.daily_result);
        return null;
      }

      return {
        date: dateObject.getTime(),
        label: formatter.format(dateObject),
        readiness: Number(entry.result?.readiness ?? 0),
        stressIndex: Number(entry.result?.stress_index ?? 0),
      };
    })
    .filter(Boolean);
};

const updateRecoveryMessage = (readiness) => {
  const messageElement = document.querySelector('.recovery-message');
  if (!messageElement) return;

  if (readiness >= 80) {
    messageElement.textContent =
      'Viimeisimmän mittauksen mukaan palautumisesi näyttää erittäin hyvältä. Kehosi reagoi stressiin tehokkaasti.';
  } else if (readiness >= 60) {
    messageElement.textContent =
      'Viimeisimmän mittauksen mukaan palautumisesi on kohtalainen. Muista riittävä lepo ja palautuminen.';
  } else {
    messageElement.textContent =
      'Viimeisimmän mittauksen mukaan stressitasosi näyttää kohonneelta. Kevyt päivä ja lepo voivat auttaa palautumisessa.';
  }
};

const drawChart = (userData) => {
  const sortedResults = [...userData.results].sort(
    (a, b) => new Date(a.daily_result) - new Date(b.daily_result)
  );

  const formatter = new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'long',
  });

  const labels = sortedResults.map(entry =>
    formatter.format(new Date(entry.daily_result))
  );

  const readiness = sortedResults.map(entry => entry.result.readiness);
  const stressIndex = sortedResults.map(entry => entry.result.stress_index);

  const ctx = document.getElementById('jsChart');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Palautuminen',
          data: readiness,
          borderColor: 'red',
        },
        {
          label: 'Stressitaso',
          data: stressIndex,
          borderColor: 'blue',
        },
      ],
    },
  });
};

export { getUserData, getUserInfo };