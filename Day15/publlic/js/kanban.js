const kanbanColumns = [
  { id: 'todo', title: 'To Do', color: '#6b73ff' },
  { id: 'in-progress', title: 'In Progress', color: '#ffa500' },
  { id: 'review', title: 'Review', color: '#ff6b6b' },
  { id: 'done', title: 'Done', color: '#51cf66' }
];

let tasks = [];
const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

// Fetch user info and tasks
document.addEventListener("DOMContentLoaded", async () => {
  await fetchUserInfo();
  await fetchTasks();
  renderKanbanBoard();
});

// Fetch tasks
async function fetchTasks() {
  try {
    const res = await fetch("http://localhost:3000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` }
    });
    tasks = (await res.json()).data || [];
  } catch (err) {
    console.error(err);
  }
}

// Render Kanban Board
function renderKanbanBoard() {
  const board = document.getElementById("kanban-board");
  board.innerHTML = '';
  
  kanbanColumns.forEach(column => {
    const colDiv = document.createElement("div");
    colDiv.className = "kanban-column";
    colDiv.dataset.status = column.id;
    colDiv.style.background = column.color;
    
    const title = document.createElement("h3");
    title.innerText = column.title;
    colDiv.appendChild(title);

    // Tasks for this column
    tasks.filter(task => task.status === column.id).forEach(task => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task-card";
      taskDiv.draggable = true;
      taskDiv.dataset.id = task.id;
      taskDiv.innerHTML = `<h4>${task.title}</h4><p>${task.description}</p><small>Priority: ${task.priority}</small>`;
      taskDiv.addEventListener("dragstart", handleDragStart);
      taskDiv.addEventListener("dragend", handleDragEnd);
      colDiv.appendChild(taskDiv);
    });

    // Drag events for column
    colDiv.addEventListener("dragover", handleDragOver);
    colDiv.addEventListener("drop", handleDrop);

    board.appendChild(colDiv);
  });
}

// Drag & Drop handlers
let draggedTaskId = null;

function handleDragStart(e) {
  draggedTaskId = this.dataset.id;
  this.style.opacity = '0.5';
}

function handleDragEnd(e) {
  this.style.opacity = '1';
  draggedTaskId = null;
}

function handleDragOver(e) {
  e.preventDefault();
}

async function handleDrop(e) {
  e.preventDefault();
  const newStatus = this.dataset.status;
  if (draggedTaskId) {
    try {
      await fetch(`http://localhost:3000/api/tasks/${draggedTaskId}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      // Update locally
      const task = tasks.find(t => t.id === draggedTaskId);
      if (task) task.status = newStatus;
      renderKanbanBoard();
    } catch (err) {
      console.error(err);
    }
  }
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});
