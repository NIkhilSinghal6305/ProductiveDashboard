function openFeatures() {
  var allElems = document.querySelectorAll(".elem");
  var allfullElem = document.querySelectorAll(".fullElem");
  var allfullElemBack = document.querySelectorAll(".fullElem .back");

  allElems.forEach(function (elem) {
    elem.addEventListener("click", function () {
      allfullElem[elem.id].style.display = "block";
    });
  });

  allfullElemBack.forEach(function (back) {
    back.addEventListener("click", function () {
      allfullElem[back.id].style.display = "none";
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
        <div class="task">
        <div>
        <h2>${elem.task}</h2>
        <span class='${elem.impo}'>important</span>
        </div>
        <button class="complete" id="${idx}"> Mark as Complete</button>
        </div>
        `;
    });

    alltask.innerHTML = sum;
    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    document.querySelectorAll(".task button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentTask.splice(btn.id, 1);
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
  var dayPlannerInput = document.querySelectorAll(".day-planner input");
  var dayPlanner = document.querySelector(".day-planner");
  var deleteDayPlanner = document.querySelector(".day-planner-delete");

  var hours = Array.from(
    { length: 24 },
    (elem, idx) => `${0 + idx}:00 - ${1 + idx}:00 `
  );
  var dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};

  let Wholedaysum = "";

  function renderDay() {
    hours.forEach(function (elem, idx) {
      var saveData = dayPlanData[idx] || "";
      Wholedaysum += `
        <div class="day-planner-time">
        <p>${elem}</p>
        <input id="${idx}" type="text" placeholder="..." value='${saveData}'>
        </div>
        `;
    });
    dayPlanner.innerHTML = Wholedaysum;
  }
  renderDay();


  dayPlannerInput.forEach(function (elem) {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;
      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });

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
    var motivationQuoteContent = document.querySelector('.motivation-2 h2')
    var motivationAuthor = document.querySelector('.motivation-3 h2')

    async function fetchQuote() {
        let response = await fetch('https://api.quotable.io/random')
        let data = await response.json()

        motivationQuoteContent.innerHTML=data.content
        motivationAuthor.innerHTML=data.author
    }

    fetchQuote()
}
motivationalQuote()