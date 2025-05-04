// === WEEKLY RESET LOGIC ===
const today = new Date();
const weekday = (today.getDay() + 6) % 7; // Shift so Monday = 0, Sunday = 6
const lastSaveDate = localStorage.getItem("reviveLastSaveDate");
const isNewWeek =
  lastSaveDate &&
  new Date(lastSaveDate).getDay() === 1 && // last save was Monday
  today.getDay() === 1 &&                  // today is Monday
  lastSaveDate !== today.toDateString();   // not same date

if (isNewWeek || !lastSaveDate) {
  localStorage.removeItem("reviveChartData");
}

localStorage.setItem("reviveLastSaveDate", today.toDateString());

// === LOAD CHART DATA ===
const saved = localStorage.getItem("reviveChartData");
const progressData = saved ? JSON.parse(saved) : [0, 0, 0, 0, 0, 0, 0];

// === CREATE CHART ===
const ctx = document.getElementById('progressChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      label: 'Recycling Actions',
      data: progressData,
      backgroundColor: '#b8e1af'
    }]
  },
  options: {
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// === ACTION CHECKBOX INTERACTION ===
const actions = document.querySelectorAll('.action');
actions.forEach(action => {
  action.addEventListener('change', () => {
    const index = weekday;
    const points = parseInt(action.dataset.points);

    if (action.checked) {
      progressData[index] += points;
    } else {
      progressData[index] = Math.max(0, progressData[index] - points);
    }

    chart.update();

    localStorage.setItem("reviveChartData", JSON.stringify(progressData));
    localStorage.setItem("reviveLastSaveDate", today.toDateString());
  });
});

// === TOAST DISPLAY FOR RESET ===
if (isNewWeek) {
  const toast = document.getElementById("reset-toast");
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}
