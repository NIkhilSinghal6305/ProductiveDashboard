function openFeatures() {
  landingPage = document.querySelector("section.allElems");
  var allElems = document.querySelectorAll(".elem");
  var allfullElem = document.querySelectorAll(".fullElem");
  var allfullElemBack = document.querySelectorAll(".fullElem .back");

  allElems.forEach(function (elem) {
    elem.addEventListener("click", function () {
      allfullElem[elem.id].style.display = "block";
      landingPage.style.display = "none";
    });
  });

  allfullElemBack.forEach(function (back) {
    back.addEventListener("click", function () {
      allfullElem[back.id].style.display = "none";
      landingPage.style.display = "flex";
      landingPage.style.flexDirection = "column";
    });
  });
}
openFeatures();

function todoList() {
  let currentTask = [];
  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  } else {
    console.log("Task List is empty");
  }
  function renderTask() {
    var alltask = document.querySelector(".allTask");
    let sum = "";
    currentTask.forEach(function (elem, idx) {
      sum += `
        <div class="task" data-index="${idx}">
          <div>
            <h2>${elem.task}</h2>
            <span class='${elem.impo}'>important</span>
          </div>
          <button class="complete" data-index="${idx}">Mark as Complete</button>
        </div>
        <div class="task-details" data-index="${idx}" style="display: none;">
          <p>${elem.details || "No details provided"}</p>
        </div>
      `;
    });
    alltask.innerHTML = sum;
    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    
    document.querySelectorAll(".task").forEach(function (taskDiv) {
      taskDiv.addEventListener("click", function (e) {
        
        if (e.target.tagName === "BUTTON") return;

        const index = taskDiv.getAttribute("data-index");
        const detailsDiv = document.querySelector(
          `.task-details[data-index="${index}"]`
        );

        if (detailsDiv.style.display === "none") {
          detailsDiv.style.display = "block";
        } else {
          detailsDiv.style.display = "none";
        }
      });
    });


    document.querySelectorAll(".task button").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const index = btn.getAttribute("data-index");
        currentTask.splice(index, 1);
        renderTask();
        if (currentTask.length == 0) {
          localStorage.clear();
        }
      });
    });
  }

  renderTask();

  let form = document.querySelector(".addTask form");
  let taskinput = document.querySelector(".addTask form input");
  let taskDetailsinput = document.querySelector(".addTask form textarea");
  let checkImpo = document.querySelector("#checkbox");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    currentTask.push({
      task: taskinput.value,
      details: taskDetailsinput.value,
      impo: checkImpo.checked,
    });
    taskDetailsinput.value = "";
    taskinput.value = "";
    checkImpo.checked = false;
    renderTask();
  });
}
todoList();

function DayPlannerDashboard() {
  var dayPlanner = document.querySelector(".day-planner");
  var deleteDayPlanner = document.querySelector(".day-planner-delete");

  var hours = Array.from(
    { length: 24 },
    (elem, idx) => `${idx}:00 - ${idx + 1}:00`
  );

  var dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};

  function renderDay() {
    let Wholedaysum = "";

    hours.forEach(function (elem, idx) {
      var saveData = dayPlanData[idx] || "";
      Wholedaysum += `
        <div class="day-planner-time">
          <p>${elem}</p>
          <input id="${idx}" type="text" placeholder="..." value="${saveData}">
        </div>
      `;
    });

    dayPlanner.innerHTML = Wholedaysum;

    var dayPlannerInput = document.querySelectorAll(".day-planner input");

    dayPlannerInput.forEach(function (elem) {
      elem.addEventListener("input", function () {
        dayPlanData[elem.id] = elem.value;
        localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
      });
    });
  }

  renderDay();

  deleteDayPlanner.addEventListener("click", function () {
    dayPlanData = {};
    localStorage.removeItem("dayPlanData");

    document.querySelectorAll(".day-planner input").forEach(function (input) {
      input.value = "";
    });
  });
}

DayPlannerDashboard();

function motivationalQuote() {
  var motivationQuoteContent = document.querySelector(".motivation-2 h2");
  var motivationAuthor = document.querySelector(".motivation-3 h2");

  async function fetchQuote() {
    let response = await fetch(
      "https://motivational-spark-api.vercel.app/api/quotes/random"
    );
    let data = await response.json();

    motivationQuoteContent.innerHTML = data.quote;
    motivationAuthor.innerHTML = data.author;
  }

  fetchQuote();
}
motivationalQuote();

function pomodoroTimer() {
  let timer = document.querySelector(".pomo-timer h1");
  var startBtn = document.querySelector(".pomo-timer .start");
  var pauseBtn = document.querySelector(".pomo-timer .pause");
  var resetBtn = document.querySelector(".pomo-timer .reset");
  var session = document.querySelector(".pomodoro-fullpage .pomo-status");
  var isWorkSession = true;

  let totalSeconds = 25 * 60;
  let timerInterval = null;

  function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    timer.innerHTML = `${String(minutes).padStart("2", "0")}:${String(
      seconds
    ).padStart("2", "0")}`;
  }

  function startTimer() {
    clearInterval(timerInterval);

    if (isWorkSession) {
      timerInterval = setInterval(function () {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateTimer();
        } else {
          isWorkSession = false;
          clearInterval(timerInterval);
          timer.innerHTML = "05:00";
          session.innerHTML = "Enjoy It's Break Time";
          session.style.color = "rgb(64, 170, 206)";
          totalSeconds = 5 * 60;
        }
      }, 1000);
    } else {
      timerInterval = setInterval(function () {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateTimer();
        } else {
          isWorkSession = true;
          clearInterval(timerInterval);
          timer.innerHTML = "25:00";
          session.innerHTML = "It's Working Time";
          session.style.color = "#D4A373";
          totalSeconds = 25 * 60;
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    clearInterval(timerInterval);
  }
  function resetTimer() {
    totalSeconds = 25 * 60;
    clearInterval(timerInterval);
    updateTimer();
  }
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
}
pomodoroTimer();

async function weatherAPICall() {
  const city = "Jaipur";
  const API_KEY = "54a5314cf4ca4ae0b7073636251012";
  var temperature = document.querySelector(".header2 h1");
  var condition = document.querySelector(".header2 h2");
  var precipitation = document.querySelector(".header2 .precipitation");
  var humidity = document.querySelector(".header2 .humidity");
  var wind = document.querySelector(".header2 .wind");

  var response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
  );
  var data = await response.json();

  document.querySelector(
    ".header1 h2"
  ).innerHTML = `${city} (${data.location.region})`;

  temperature.innerHTML = `${data.current.temp_c}°C`;
  condition.innerHTML = data.current.condition.text;
  precipitation.innerHTML = `Precipitation: ${data.current.precip_in}%`;
  humidity.innerHTML = `Humidity: ${data.current.humidity}`;
  wind.innerHTML = `Wind: ${data.current.wind_kph} Km/h`;
}
weatherAPICall();
setInterval(function () {
  weatherAPICall();
}, 3000);

function DayTime() {
  let Week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var header = document.querySelector("header");
  var DayOfWeek = document.querySelector("header .header1 h1");
  var todaydate = document.querySelector(".header1 h3");
  var date = new Date();

  todaydate.innerHTML = `${date.getDate()} ${
    month[date.getMonth()]
  } ${date.getFullYear()}`;
  if (date.getHours() > 12) {
    DayOfWeek.innerHTML = `${Week[date.getDay()]}, ${String(
      date.getHours() - 12
    ).padStart("2", "0")}:${String(date.getMinutes()).padStart(
      "2",
      "0"
    )}:${String(date.getSeconds()).padStart("2", "0")} PM`;
  } else {
    DayOfWeek.innerHTML = `${Week[date.getDay()]}, ${String(
      date.getHours()
    ).padStart("2", "0")}:${String(date.getMinutes()).padStart(
      "2",
      "0"
    )}:${String(date.getSeconds()).padStart("2", "0")} AM`;
  }
  let hours = date.getHours();
  if (hours >= 5 && hours < 12) {
    header.style.backgroundImage = "url('./assets/morning.avif')";
    header.style.backgroundPositionY = "60%";
  } else if (hours >= 12 && hours < 18) {
    header.style.backgroundImage =
      "url('https://plus.unsplash.com/premium_photo-1663127326631-5ee411a224d0?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
  } else {
    header.style.backgroundImage = "url('./assets/night.jpg')";
    header.style.backgroundPositionY = "55%";
  }
}
setInterval(function () {
  DayTime();
}, 1000);

function ChangeTheme() {
  var ChangeTheme = document.querySelector("nav button");
  var rootElement = document.documentElement;
  var flag = 0;
  ChangeTheme.addEventListener("click", function () {
    if (flag == 0) {
      rootElement.style.setProperty("--pri", "#222831");
      rootElement.style.setProperty("--sec", "#393E46");
      rootElement.style.setProperty("--tri1", "#00ADB5");
      rootElement.style.setProperty("--tri2", "#EEEEEE");
      flag = 1;
    } else if (flag == 1) {
      rootElement.style.setProperty("--pri", "#2F3A3D");
      rootElement.style.setProperty("--sec", "#4F5D57");
      rootElement.style.setProperty("--tri1", "#A27B5C");
      rootElement.style.setProperty("--tri2", "#DCD7C9");

      flag = 2;
    } else {
      rootElement.style.setProperty("--pri", "#452829");
      rootElement.style.setProperty("--sec", "#57595B");
      rootElement.style.setProperty("--tri1", "#f2d8ca");
      rootElement.style.setProperty("--tri2", "#F3E8DF");
      flag = 0;
    }
  });
}
ChangeTheme();

function NavAnimation() {
  const main = document.getElementById("main");
  const nav = document.querySelector("nav");

  main.addEventListener("wheel", function (e) {
    if (e.deltaY > 0) {
      console.log(e);
      
      nav.classList.add("navOut");
      nav.classList.remove("navIn")
    } else {
      nav.classList.add("navIn");
      nav.classList.remove("navOut")
    }
  });
}
NavAnimation();
