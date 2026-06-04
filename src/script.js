let columns = []

function createTaskCard(task_data){
    return `
    <div class="task">
    <h2 class="task-title">${task_data.title}</h2>
    <p class="task-title">${task_data.description}</p>
    </div>   
    `
}

function getColumnData(){
    const title = prompt("Enter column tilte");
    
    if(!title){
        return null;
    }
    
    const column_data = {
        "id": Date.now(),
        "title": title,
        "tasks": []
    }
    return column_data;
}

function addColumn(){
    openModal("column", function(data) {

        const column_data = {
            id: Date.now(),
            title: data.title,
            tasks: []
        };

        columns.push(column_data);
        renderPage();

    });
}

function renderPage(){
    const board = document.querySelector(".board");
    
    board.innerHTML = "";
    
    columns.forEach(column => {
        board.innerHTML += `
        <div class="column">
        <h1 class="column-title">${column.title}</h1>
        
        ${column.tasks.map(createTaskCard).join("")}
        
        <button onclick="addTask(${column.id})" class="addTask" id="addTask">+ Add task</button>
        </div>
        `;
    });
    board.innerHTML += `       
    <div class="addColumn">
    <button id="addColumn">+</button>
    </div>`
    
    eventListener();
}

function getTaskData(){
    const title = prompt("Enter task tilte");
    const description = prompt("Enter task description");
    
    if(!title){
        return null;
    }
    
    const task_data = {
        "id": Date.now(),
        "title": title,
        "description": description,
    }
    return task_data;
}

function addTask(column_id) {
    openModal("task", function(data) {

        const column = columns.find(c => c.id == column_id);

        if (!column) return;

        column.tasks.push({
            id: Date.now(),
            title: data.title,
            description: data.description
        });

        renderPage();

    }, column_id);
}


function eventListener(){
    document.getElementById("addColumn").addEventListener("click", addColumn);
    document.getElementById("confirmBtn").addEventListener("click", confirmModal);
    document.getElementById("cancelBtn").addEventListener("click", closeModal);

    document.getElementById("modal").addEventListener("click", function(e){
        if (e.target === this) closeModal();
    });
}


let modalType = null;
let activeColumnId = null;
let onConfirmCallback = null;


function openModal(type, callback, columnId = null) {
    modalType = type;
    activeColumnId = columnId;
    onConfirmCallback = callback;

    document.getElementById("modal").classList.remove("hidden");

    document.getElementById("inputTitle").value = "";
    document.getElementById("inputDescription").value = "";

    document.getElementById("modalTitle").innerText =
        type === "column" ? "New Column" : "New Task";

    if (type === "column") {
        document.getElementById("inputDescription").style.display = "none";
    } else {
        document.getElementById("inputDescription").style.display = "block";
    }
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

function getModalData() {
    return {
        title: document.getElementById("inputTitle").value,
        description: document.getElementById("inputDescription").value
    };
}

function confirmModal() {
    const data = getModalData();

    if (!data.title) return;

    onConfirmCallback(data);
    closeModal();
}

renderPage();