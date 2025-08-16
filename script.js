const form = document.getElementById("creation-form");
const formInput = document.getElementById("input-el");
const outputEl = document.getElementById("task-list--container");

let tagEl = document.getElementById("tag-select");

let TASKS = [];
let savedTasks = localStorage.getItem("taskData");
if (savedTasks) {
  TASKS = JSON.parse(savedTasks); // Convert back to array
  displayTask();
}
// Display tasks
function displayTask() {
  outputEl.innerHTML = "";

  TASKS.forEach((item) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-list--item";
    taskItem.id = `${item.id}`;

    taskItem.innerHTML = `
    <div class="item-text">
    <span>${item.text}</span>
    <small>${item.timestamp}</small>
    <div class="tag">${item.tag}</div>
    </div>
    
    <div class="item-buttons">
    <button class="deleteBtn"><i class="bi bi-trash-fill"></i></button>
    <button class="editBtn"><i class="bi bi-pencil-square"></i></button>
    </div>
    </div>`;

    taskItem.querySelector(".deleteBtn").addEventListener("click", () => {
      TASKS = TASKS.filter((task) => task.id !== item.id);
      localStorage.setItem("taskData", JSON.stringify(TASKS));

      displayTask();
    });

    taskItem.querySelector(".editBtn").addEventListener("click", () => {
      formInput.value = item.text;
      TASKS = TASKS.filter((task) => task.id !== item.id);
      formInput.focus();

      localStorage.setItem("taskData", JSON.stringify(TASKS));
    });
    outputEl.appendChild(taskItem);
  });

  formInput.value = "";
}

// Create a new task
const createNewTask = (TIMESTAMP) => {
  let task = {
    id: TASKS.length + 1,
    text: formInput.value,
    timestamp: TIMESTAMP,
    tag: tagEl.value,
  };

  TASKS.push(task);
  localStorage.setItem("taskData", JSON.stringify(TASKS));

  displayTask();
};

// Get date and time
function getDateandTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const weekday = weekdays[now.getDay()];

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const TIMESTAMP = `${day}-${month}-${year} ${weekday}, ${hours}:${minutes}`;
  createNewTask(TIMESTAMP);
}

// Get user input
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (formInput.value === "") {
    console.log("Enter a task!");
  } else {
    getDateandTime();
  }
});

// localStorage.clear();
