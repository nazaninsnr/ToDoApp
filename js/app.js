const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const tasksBody = document.querySelector("tbody");
const deleteAll = document.getElementById("delete-all-button");
const filterButtons = document.querySelectorAll(".filter-todo");

let tasks = JSON.parse(localStorage.getItem("ListOfTasks")) || [];

const saveToLocalStorage = () => {
  localStorage.setItem("ListOfTasks", JSON.stringify(tasks));
};

const generateId = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const displayTasks = (data) => {
  const taskList = data || tasks;
  tasksBody.innerHTML = "";
  if (!taskList.length) {
    tasksBody.innerHTML = "<tr><td colspan='4'>No task!</td></tr>";
    return;
  }

  taskList.forEach((task) => {
    tasksBody.innerHTML += `
        <tr>
            <td>${task.task}</td>
            <td>${task.date || "No date"}</td>
            <td>${task.completed ? "Completed" : "Pending"}</td>
            <td>
                <button onClick="editHandler('${task.id}')">Edit</button>
                <button onClick="toggleHandler('${task.id}')">
                    ${task.completed ? "Undo" : "Do"}
                </button>
                <button onClick="deleteHandler('${task.id}')">Delete</button>
            </td>
        </tr>
    `;
  });
};

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const taskData = {
    id: generateId(),
    task,
    date,
    completed: false,
  };

  if (task) {
    tasks.push(taskData);
    saveToLocalStorage();
    displayTasks();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("Task added successfully!", "success");
  } else {
    showAlert("Please enter a task!", "error");
  }
};

const deleteAllHandler = () => {
  if (tasks.length) {
    tasks = [];
    saveToLocalStorage();
    displayTasks();
    showAlert("All tasks deleted successfully!", "success");
  } else {
    showAlert("There is no task!", "error");
  }
};

const deleteHandler = (id) => {
  const newTasksList = tasks.filter((task) => task.id !== id);
  tasks = newTasksList;
  saveToLocalStorage();
  displayTasks();
  showAlert("Task deleted successfully!", "success");
};

const toggleHandler = (id) => {
  const newTasksList = tasks.find((task) => task.id === id);
  newTasksList.completed = !newTasksList.completed;
  saveToLocalStorage();
  displayTasks();
  showAlert("Task status chenged successfully!", "success");
};

const editHandler = (id) => {
  const newTasksList = tasks.find((task) => task.id === id);
  taskInput.value = newTasksList.task;
  dateInput.value = newTasksList.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const newTasksList = tasks.find((task) => task.id === id);
  newTasksList.task = taskInput.value;
  newTasksList.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  saveToLocalStorage();
  displayTasks();
  showAlert("Task edited successfully!", "success");
};

const filterHandler = (event) => {
  let filteredTasks = null;
  const filter = event.target.dataset.filter;

  switch (filter) {
    case "pending":
      filteredTasks = tasks.filter((task) => task.completed === false);
      break;

    case "completed":
      filteredTasks = tasks.filter((task) => task.completed === true);
      break;

    default:
      filteredTasks = tasks;
      break;
  }

  displayTasks(filteredTasks);
};

window.addEventListener("load", () => displayTasks());
addButton.addEventListener("click", addHandler);
deleteAll.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButtons.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
