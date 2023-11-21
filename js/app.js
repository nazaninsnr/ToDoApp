const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const alertMessage = document.getElementById("alert-message");
const tasksBody = document.querySelector("tbody");
const deleteAll = document.getElementById("delete-all-button");

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

const displayTasks = () => {
  tasksBody.innerHTML = "";
  if (!tasks.length) {
    tasksBody.innerHTML = "<tr><td colspan='4'>No task!</td></tr>";
    return;
  }

  tasks.forEach((task) => {
    tasksBody.innerHTML += `
        <tr>
            <td>${task.task}</td>
            <td>${task.date || "No date"}</td>
            <td>${task.completed ? "Completed" : "Pending"}</td>
            <td>
                <button>Edit</button>
                <button>Do</button>
                <button>Delete</button>
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

window.addEventListener("load", displayTasks);
addButton.addEventListener("click", addHandler);
deleteAll.addEventListener("click", deleteAllHandler);
