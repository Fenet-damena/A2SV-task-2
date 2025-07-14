"use strict";
const tasksUl = document.getElementById('tasks');
const taskTitleInput = document.getElementById('taskTitle');
const dueDateInput = document.getElementById('dueDate');
const addTaskBtn = document.getElementById('addTaskBtn');
const allBtn = document.getElementById('allBtn');
const pendingBtn = document.getElementById('pendingBtn');
const completedBtn = document.getElementById('completedBtn');
const allCount = document.getElementById('allCount');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentView = 'all';
let editingTaskId = null;
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function renderTasks() {
    tasksUl.innerHTML = '';
    let filtered = tasks;
    if (currentView === 'pending') {
        filtered = tasks.filter(t => !t.completed);
    }
    else if (currentView === 'completed') {
        filtered = tasks.filter(t => t.completed);
    }
    if (filtered.length === 0) {
        const emptyMsg = document.createElement('li');
        let message = "No tasks added.";
        if (currentView === 'pending') {
            message = "No pending tasks.";
        }
        else if (currentView === 'completed') {
            message = "No completed tasks.";
        }
        emptyMsg.textContent = message;
        emptyMsg.style.textAlign = "center";
        emptyMsg.style.color = "#888";
        emptyMsg.style.fontStyle = "italic";
        tasksUl.appendChild(emptyMsg);
        updateCounts();
        return;
    }
    filtered.forEach(task => {
        const li = document.createElement('li');
        const left = document.createElement('div');
        left.className = 'task-left';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = () => {
            task.completed = checkbox.checked;
            saveTasks();
            updateCounts();
            renderTasks();
        };
        const text = document.createElement('div');
        text.innerHTML = `<strong>${task.title}</strong><br><span class="task-due">${task.dueDate || ''}</span>`;
        if (task.completed) {
            text.classList.add("completed-task");
        }
        else {
            text.classList.remove("completed-task");
        }
        left.appendChild(checkbox);
        left.appendChild(text);
        const actions = document.createElement('div');
        actions.className = 'task-actions';
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.onclick = () => {
            taskTitleInput.value = task.title;
            dueDateInput.value = task.dueDate || '';
            editingTaskId = task.id;
            addTaskBtn.textContent = "Update Task";
        };
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.onclick = () => {
            deleteTask(task.id);
        };
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        li.appendChild(left);
        li.appendChild(actions);
        tasksUl.appendChild(li);
    });
    updateCounts();
}
function updateCounts() {
    allCount.textContent = tasks.length.toString();
    pendingCount.textContent = tasks.filter(t => !t.completed).length.toString();
    completedCount.textContent = tasks.filter(t => t.completed).length.toString();
}
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}
addTaskBtn.addEventListener('click', () => {
    const title = taskTitleInput.value.trim();
    const dueDate = dueDateInput.value;
    if (!title || !dueDate) {
        alert("Please enter both task title and due date.");
        return;
    }
    if (editingTaskId) {
        const taskToEdit = tasks.find(t => t.id === editingTaskId);
        if (taskToEdit) {
            taskToEdit.title = title;
            taskToEdit.dueDate = dueDate;
            alert("Task updated successfully!");
        }
        editingTaskId = null;
        addTaskBtn.textContent = "+ Add Task";
    }
    else {
        const newTask = {
            id: crypto.randomUUID(),
            title,
            dueDate,
            completed: false,
        };
        tasks.push(newTask);
    }
    saveTasks();
    renderTasks();
    taskTitleInput.value = '';
    dueDateInput.value = '';
});
function setMinDate() {
    const today = new Date().toISOString().split("T")[0];
    dueDateInput.setAttribute("min", today);
}
setMinDate();
allBtn.onclick = () => {
    currentView = 'all';
    setActiveTab(allBtn);
    renderTasks();
};
pendingBtn.onclick = () => {
    currentView = 'pending';
    setActiveTab(pendingBtn);
    renderTasks();
};
completedBtn.onclick = () => {
    currentView = 'completed';
    setActiveTab(completedBtn);
    renderTasks();
};
function setActiveTab(activeBtn) {
    [allBtn, pendingBtn, completedBtn].forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}
renderTasks();
//# sourceMappingURL=todo.js.map