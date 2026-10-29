console.log("JavaScript connected");

// Select HTML elements
const taskInput = document.getElementById("taskEnter");
const addButton = document.getElementById("addButton");
const todoList = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");

const buttonAll = document.getElementById("buttonAll");
const activeB = document.getElementById("activeB");
const completedB = document.getElementById("completedB");
const clearCom = document.getElementById("clearCom");
const emptyState = document.getElementById("emptyState");

// Load saved tasks
let todos = JSON.parse(localStorage.getItem("todos")) || [];

let currentFilter = "all";

// Save tasks in localStorage
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Update remaining task count
function updateTaskCount() {
    const remaining = todos.filter(todo => !todo.completed).length;

    taskCount.textContent =
        `${remaining} ${remaining === 1 ? "task" : "tasks"} remaining`;
}

// Show or hide empty state
function updateEmptyState() {
    emptyState.style.display = todos.length === 0 ? "" : "none";
}

// Apply current filter
function filterTasks(filter) {
    currentFilter = filter;

    const taskElements = todoList.querySelectorAll(".task-item");

    taskElements.forEach(function(taskElement) {
        const isCompleted = taskElement.dataset.completed === "true";

        if (filter === "all") {
            taskElement.style.display = "";
        } else if (filter === "active") {
            taskElement.style.display = isCompleted ? "none" : "";
        } else if (filter === "completed") {
            taskElement.style.display = isCompleted ? "" : "none";
        }
    });
}

// Create and display one task
function renderTask(todo) {
    const taskElement = document.createElement("p");
    taskElement.classList.add("task-item");
    taskElement.dataset.completed = String(todo.completed);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    const taskText = document.createElement("span");
    taskText.textContent = todo.text;

    if (todo.completed) {
        taskText.style.textDecoration = "line-through";
    }

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    // Complete or uncomplete task
    checkbox.addEventListener("change", function() {
        todo.completed = checkbox.checked;

        taskElement.dataset.completed = String(todo.completed);

        taskText.style.textDecoration =
            todo.completed ? "line-through" : "none";

        saveTodos();
        updateTaskCount();
        filterTasks(currentFilter);
    });

    // Edit task
    editButton.addEventListener("click", function() {
        const newTask = prompt("Edit your task:", todo.text);

        if (newTask !== null && newTask.trim() !== "") {
            todo.text = newTask.trim();
            taskText.textContent = todo.text;

            saveTodos();
        }
    });

    // Delete task
    deleteButton.addEventListener("click", function() {
        const index = todos.indexOf(todo);

        if (index !== -1) {
            todos.splice(index, 1);
        }

        taskElement.remove();

        saveTodos();
        updateTaskCount();
        updateEmptyState();
    });

    // Add elements to task
    taskElement.appendChild(checkbox);
    taskElement.appendChild(taskText);
    taskElement.appendChild(editButton);
    taskElement.appendChild(deleteButton);

    todoList.appendChild(taskElement);
}

// Render all saved tasks
function renderTasks() {
    todoList.querySelectorAll(".task-item").forEach(function(element) {
        element.remove();
    });

    todos.forEach(function(todo) {
        renderTask(todo);
    });

    updateTaskCount();
    updateEmptyState();
    filterTasks(currentFilter);
}

// Add task
addButton.addEventListener("click", function() {
    const taskValue = taskInput.value.trim();

    if (taskValue === "") {
        return;
    }

    const todo = {
        text: taskValue,
        completed: false
    };

    todos.push(todo);

    saveTodos();
    renderTasks();

    taskInput.value = "";
});

// All filter
buttonAll.addEventListener("click", function() {
    filterTasks("all");
});

// Active filter
activeB.addEventListener("click", function() {
    filterTasks("active");
});

// Completed filter
completedB.addEventListener("click", function() {
    filterTasks("completed");
});

// Clear completed tasks
clearCom.addEventListener("click", function() {
    todos = todos.filter(todo => !todo.completed);

    saveTodos();
    renderTasks();
});

// Display saved tasks when page loads
renderTasks();