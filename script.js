// CLASS TO REPRESENT A TASK ITEM
class Task {
  constructor(title, id, tag, timestamp) {
    this.title = title;
    this.tag = tag;
    this.timestamp = timestamp;
    this.id = id;
    this.status = "incomplete"; // Default status
  }
  markCompleted() {
    this.status = "completed";
  }
}

// GLOBAL VARIABLES
const formElement = document.getElementById("creation-form");
const inputElement = document.getElementById("input-el");
const taskListContainer = document.getElementById("task-list--container");
const tagElement = document.getElementById("tag-select");

let TASKS = [];
let editingTaskID = null;

// DISPLAY THE TASKS
const displayTasks = () => {
  taskListContainer.innerHTML = "";

  // Sort so incomplete first, completed last
  const sortedTasks = [...TASKS].sort((a, b) => {
    if (a.status === b.status) return 0;
    return a.status === "incomplete" ? -1 : 1;
  });

  sortedTasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-list--item";
    taskItem.id = `${task.id}`;

    if (task.status === "completed") {
      taskItem.classList.add("completed");
    }

    taskItem.innerHTML = `
      <div class="item-text">
        <span>${task.title}</span>
        <small>${task.timestamp}</small>
        <div class="tag tag-${task.tag.toLowerCase()}">${task.tag}</div>
      </div>
        
      <div class="item-buttons">
        <button class="deleteBtn"><i class="bi bi-trash-fill"></i></button>
        <button class="editBtn"><i class="bi bi-pencil-square"></i></button>
        <button class="completeBtn"><i class="bi bi-check-circle"></i></button>
      </div>
    `;

    // Deletes a task
    taskItem.querySelector(".deleteBtn").addEventListener("click", () => {
      TASKS = TASKS.filter((item) => item.id !== task.id);
      localStorage.setItem("User data", JSON.stringify(TASKS));

      displayTasks();
    });

    // Edits a task
    taskItem.querySelector(".editBtn").addEventListener("click", () => {
      inputElement.value = task.title;
      tagElement.value = task.tag;
      editingTaskID = task.id;

      inputElement.focus();
    });

    // Marks a task as completed
    taskItem.querySelector(".completeBtn").addEventListener("click", () => {
      task.markCompleted();
      localStorage.setItem("User data", JSON.stringify(TASKS));

      displayTasks();
    });

    taskListContainer.appendChild(taskItem);
  });
  inputElement.value = "";
};

// CREATE A NEW TASK
const createNewTask = (timestamp) => {
  let newTask = new Task(
    inputElement.value.trim(),
    Date.now(), // unique id
    tagElement.value,
    timestamp
  );

  TASKS.push(newTask);
  localStorage.setItem("User data", JSON.stringify(TASKS));
  displayTasks();
};

// GET THE TIMESTAMP
const getTimestamp = () => {
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

  return `${day}-${month}-${year} ${weekday}, ${hours}:${minutes}`;
};

// FORM SUBMISSION
formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputElement.value.trim() === "") {
    alert("Please enter a task!");
  }
  // updates existing task
  else if (editingTaskID !== null) {
    let taskToEdit = TASKS.find((item) => item.id === editingTaskID);
    if (taskToEdit) {
      taskToEdit.title = inputElement.value.trim();
      taskToEdit.tag = tagElement.value;
    }
    editingTaskID = null;
    localStorage.setItem("User data", JSON.stringify(TASKS));

    displayTasks();
  } else {
    createNewTask(getTimestamp());
  }
});

// LOAD TASKS FROM LOCALSTORAGE
let savedTasks = localStorage.getItem("User data");
if (savedTasks) {
  TASKS = JSON.parse(savedTasks).map((item) => {
    let task = new Task(item.title, item.id, item.tag, item.timestamp);
    task.status = item.status || "incomplete";
    return task;
  });
  displayTasks();
}
