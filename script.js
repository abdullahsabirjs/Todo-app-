function addTodo() {
    var todoText = document.getElementById('newTodo').value;
    var li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `<span>${todoText}</span>
                    <button onclick="editTodo(this)">Edit</button>
                    <button onclick="deleteTodo(this)">Delete</button>
                    <input class='editMode' type='text' value='${todoText}'>
                    <button class='editMode' onclick='saveTodo(this)'>Save</button>`;
    document.getElementById('todoList').appendChild(li);
    document.getElementById('newTodo').value = '';
}

function deleteAllTodos() {
    document.getElementById('todoList').innerHTML = '';
}

function editTodo(button) {
    var li = button.parentNode;
    li.querySelectorAll('.editMode').forEach(function(item) {
        item.style.display = 'inline';
    });
    li.querySelectorAll('span, button:not(.editMode)').forEach(function(item) {
        item.style.display = 'none';
    });
}

function saveTodo(button) {
    var li = button.parentNode;
    var input = li.querySelector('input[type=text]');
    li.querySelector('span').innerText = input.value;
    li.querySelectorAll('.editMode').forEach(function(item) {
        item.style.display = 'none';
    });
    li.querySelectorAll('span, button:not(.editMode)').forEach(function(item) {
        item.style.display = 'inline';
    });
}

function deleteTodo(button) {
    var li = button.parentNode;
    li.parentNode.removeChild(li);
}
