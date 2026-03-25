import '../css/style.css';
import '../css/mobile.css';
import '../css/bmi.css';

// Painoindeksitiedot
const lowBmi = `Jos painoindeksi on alle 18,5, se merkitsee liiallista laihuutta.`;

const normalBmi = `Normaali painoindeksin alue on välillä 18,5–25.`;

const highBmi = `Kun painoindeksi ylittää 25, ollaan liikapainon puolella.`;


// DOM elementit
const bmiForm = document.querySelector('form');

const bmiScore = document.querySelector('.bmi-score');
const analysis = document.querySelector('.analysis');

const rowLow = document.querySelector('.bmi0-19');
const rowNormal = document.querySelector('.bmi19-25');
const rowHigh = document.querySelector('.bmi25-30');


// Tyylien nollaus
const resetBMIStyles = () => {

  rowLow.classList.remove('lowBmi');
  rowNormal.classList.remove('normalBmi');
  rowHigh.classList.remove('highBmi');

};


// BMI laskenta
const calculateBMI = (weight, height) => {

  const bmi = (weight / (height / 100) ** 2).toFixed(1);

  bmiScore.textContent = bmi;

  if (bmi < 19) {

    analysis.textContent = lowBmi;
    rowLow.classList.add('lowBmi');

  } 
  else if (bmi < 25) {

    analysis.textContent = normalBmi;
    rowNormal.classList.add('normalBmi');

  } 
  else {

    analysis.textContent = highBmi;
    rowHigh.classList.add('highBmi');

  }

};


// Form submit
bmiForm.addEventListener('submit', (evt) => {

  evt.preventDefault();

  const weight = Number(document.querySelector('#weight').value);
  const height = Number(document.querySelector('#height').value);

  if (!weight || !height) {
    alert("Anna paino ja pituus");
    return;
  }

  resetBMIStyles();
  calculateBMI(weight, height);

});