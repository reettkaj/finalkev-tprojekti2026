/* 🔹 ESIMERKKI RR-DATA (ms) */
const rr = [800, 810, 790, 805, 795, 820, 810, 800, 790, 815];

/* 🔹 RR TIME SERIES */
const rrCtx = document.getElementById('rrChart');

new Chart(rrCtx, {
  type: 'line',
  data: {
    labels: rr.map((_, i) => i + 1),
    datasets: [{
      label: 'RR (ms)',
      data: rr,
      borderColor: 'blue',
      fill: false
    }]
  }
});

/* 🔹 POINCARÉ DATA */
const rr_n = rr.slice(0, -1);
const rr_n1 = rr.slice(1);

const poincareData = rr_n.map((val, i) => ({
  x: val,
  y: rr_n1[i]
}));

const poincareCtx = document.getElementById('poincareChart');

new Chart(poincareCtx, {
  type: 'scatter',
  data: {
    datasets: [{
      label: 'Poincaré',
      data: poincareData,
      backgroundColor: 'red'
    }]
  },
  options: {
    scales: {
      x: {
        title: { display: true, text: 'RR(n)' }
      },
      y: {
        title: { display: true, text: 'RR(n+1)' }
      }
    }
  }
});

/* 🔹 RMSSD */
const diff = rr.slice(1).map((v, i) => v - rr[i]);
const rmssd = Math.sqrt(
  diff.reduce((sum, d) => sum + d * d, 0) / diff.length
);

document.getElementById("rmssd").innerText =
  "RMSSD: " + rmssd.toFixed(2) + " ms";