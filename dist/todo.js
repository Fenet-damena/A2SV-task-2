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
        left.appendChild(checkbox);
        left.appendChild(text);
        const actions = document.createElement('div');
        actions.className = 'task-actions';
        const editBtn = document.createElement('button');
        editBtn.textContent = '✎';
        editBtn.onclick = () => {
            taskTitleInput.value = task.title;
            dueDateInput.value = task.dueDate || '';
            deleteTask(task.id);
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
    if (!title)
        return;
    const newTask = {
        id: crypto.randomUUID(),
        title,
        dueDate: dueDateInput.value,
        completed: false,
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskTitleInput.value = '';
    dueDateInput.value = '';
});
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