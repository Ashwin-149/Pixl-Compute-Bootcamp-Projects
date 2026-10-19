
//Getting various Elements
const taskInput = document.getElementById("task-input");
const timeInput = document.getElementById("time-input");
const dateInput = document.getElementById("date-input");
const addTaskButton = document.getElementById("add-task-button");
const tasksContainer = document.getElementById("tasks-container");
const searchInput = document.getElementById("search-input");

const messagePopup = document.getElementById("message-popup");
const messageText = document.getElementById("message-text");
const closeMessageButton = document.getElementById("close-message-button");
const messageOkButton = document.getElementById("message-ok-button");

let today = `${String(new Date().getDate()).padStart(2, "0")}/${String(new Date().getMonth() + 1).padStart(2, "0")}/${new Date().getFullYear()}`;

//change time format
const changeTimeFormatTo12hr = (time) => {
    if (!time) return "";

    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
};

//change date to  day month year
const changeDateFormat = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
};

//clear input fields after adding a task
const resetInputFields = () => {
    taskInput.value = "";
    timeInput.value = "";
    dateInput.value = "";
};

//to hide the task and buttons during editing
const hideTask = (taskDiv) => {
    const dateHeading = taskDiv.querySelector(".date-heading");
    const taskLine = taskDiv.querySelector(".task-line");
    const editButton = taskDiv.querySelector(".edit-button");
    const deleteButton = taskDiv.querySelector(".delete-button");

    dateHeading.style.display = "none";
    taskLine.style.display = "none";
    editButton.style.display = "none";
    deleteButton.style.display = "none";
};

//To show back the task and buttons after editing
const showTask = (taskDiv) => {
    const dateHeading = taskDiv.querySelector(".date-heading");
    const taskLine = taskDiv.querySelector(".task-line");
    const editButton = taskDiv.querySelector(".edit-button");
    const deleteButton = taskDiv.querySelector(".delete-button");

    dateHeading.style.display = "";
    taskLine.style.display = "";
    editButton.style.display = "";
    deleteButton.style.display = "";
};

//popup message
const showMessage = (message) => {
    messageText.textContent = message;
    messagePopup.style.display = "flex";
};

const hideMessage = () => {
    messagePopup.style.display = "none";
};

//creates a new task object and save it in local storage
const createNewTask = () => {

    if (!taskInput.value.trim() || !dateInput.value || !timeInput.value) {
        showMessage("Please fill in all fields.");
        return;
    }

    const tasksList = JSON.parse(localStorage.getItem("tasksList")) ?? [];

    const task = taskInput.value;
    const date = dateInput.value;
    const time = timeInput.value;

    tasksList.push({
        id: Date.now(), task, date, time
    });

    localStorage.setItem("tasksList", JSON.stringify(tasksList));

    displayTasks();
    resetInputFields();
};

//displays the tasks taken from local storage as different sections(due, today and upcoming)
const displayTaskSection = (heading, tasks) => {
    if(tasks.length > 0){
        console.log(tasks);
        const sectionHeading = document.createElement("h2");
        sectionHeading.textContent = heading;
        tasksContainer.appendChild(sectionHeading);

        tasks.forEach(task => {
            const tasksDiv = document.createElement("div");
            tasksDiv.id = `task-${task.id}`;
            tasksDiv.classList.add("task-item");

            const dateHeading = document.createElement('h3');
            dateHeading.classList.add("date-heading");
            dateHeading.textContent = changeDateFormat(task.date) === today ? "Today":changeDateFormat(task.date);

            const taskLine = document.createElement("p");
            taskLine.classList.add("task-line");
            taskLine.innerHTML = `${task.task} at <span class="task-time">${changeTimeFormatTo12hr(task.time)}</span>`;

            const editButton = document.createElement("button");
            editButton.classList.add("edit-button");
            editButton.textContent = "Edit";

            editButton.addEventListener("click", () => {
                editTask(task.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", () => {
                deleteTask(task.id);
            });

            tasksDiv.append(dateHeading, taskLine, editButton, deleteButton);
            tasksContainer.appendChild(tasksDiv);
        });
    }
};

//to handle deleting a task
const deleteTask = (taskId) => {
    const tasksList = JSON.parse(localStorage.getItem("tasksList")) ?? [];

    const updatedTasks = tasksList.filter(task => task.id !== taskId);

    localStorage.setItem("tasksList", JSON.stringify(updatedTasks));

    displayTasks();
};

//handle editing a task
const editTask = (taskId) => {
    const tasksList = JSON.parse(localStorage.getItem("tasksList")) ?? [];

    const task = tasksList.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    const tasksDiv = document.getElementById(`task-${taskId}`);

    hideTask(tasksDiv)

    const editDiv = document.createElement("div");
    editDiv.className = "edit-div";

    editDiv.innerHTML = `
        <input type="text" class="edit-task-input"
            value="${task.task}" required>

        <input type="date" class="edit-date-input"
            value="${task.date}" required>

        <input type="time" class="edit-time-input"
            value="${task.time}" required>

        <div class="save-and-cancel-buttons">
            <button class="save-edit-button">Save</button>
            <button class="cancel-edit-button">Cancel</button>
        </div>
    `;

    tasksDiv.appendChild(editDiv);

    const taskInput = editDiv.querySelector(".edit-task-input");
    const dateInput = editDiv.querySelector(".edit-date-input");
    const timeInput = editDiv.querySelector(".edit-time-input");

    editDiv.querySelector(".save-edit-button").addEventListener("click", () => {
        if (!taskInput.value.trim() || !dateInput.value || !timeInput.value) {
            showMessage("Please fill in all fields.");
            return;
        }

        task.task = taskInput.value.trim();
        task.date = dateInput.value;
        task.time = timeInput.value;

        localStorage.setItem("tasksList", JSON.stringify(tasksList));
        showTask(tasksDiv);
        displayTasks();
    });

    editDiv.querySelector(".cancel-edit-button").addEventListener("click", () => {
        editDiv.remove();
        showTask(tasksDiv);
    });
};

//Display the sections on screen
const displayTasks = () => {
    const tasksList = JSON.parse(localStorage.getItem("tasksList")) ?? [];
    const searchText = searchInput.value.trim().toLowerCase();

    const filteredTasks = tasksList.filter(task =>
        task.task.toLowerCase().includes(searchText)
    );

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const dueTasks = filteredTasks.filter(task => task.date <= today);

    const upcomingTasks = filteredTasks.filter(task => task.date > today);

    tasksContainer.innerHTML = "";

    displayTaskSection("Due Tasks", dueTasks);
    displayTaskSection("Upcoming Tasks", upcomingTasks);
};

//event listners for functions
addTaskButton.addEventListener("click", createNewTask);
searchInput.addEventListener("input", displayTasks);
closeMessageButton.addEventListener("click", hideMessage);
messageOkButton.addEventListener("click", hideMessage);

displayTasks();

