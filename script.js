import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js';
import { getFirestore, onSnapshot, collection, doc, setDoc, updateDoc, deleteDoc, query } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDGsIt831L9--kKV0ZhcU_py7LtBHr6wcQ",
    authDomain: "addi-todo-web.firebaseapp.com",
    projectId: "addi-todo-web",
    storageBucket: "addi-todo-web.appspot.com",
    messagingSenderId: "820889415202",
    appId: "1:820889415202:web:aaf6b97eb7efcff165247b",
    measurementId: "G-497Y55PJDF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const addData = document.getElementById("addData");
const todoInput = document.getElementById("todoInput");
const blogList = document.getElementById("todoList");
let todos = [];

const getDataInRealTime = async () => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        todos = [];
        querySnapshot.forEach((doc) => {
            todos.push(doc);
        });

        let item = todos.map((doc) => {
            const todoObj = doc.data();
            return `
                <li>
                    <span id="todo-${todoObj.id}">${todoObj.todo}</span>
                    <input type="text" id="input-${todoObj.id}" class="editInput" value="${todoObj.todo}" style="display: none;">
                    <button class="editData" data-id="${todoObj.id}">Edit</button>
                    <button class="saveData" data-id="${todoObj.id}" style="display: none;">Save</button>
                    <button class="delData" data-id="${todoObj.id}">Delete</button>
                </li>`;
        }).join("");

        blogList.innerHTML = item;
    });
};
getDataInRealTime();

document.addEventListener('click', function (event) {
    if (event.target.matches('.editData')) {
        let id = event.target.getAttribute('data-id');
        document.getElementById(`todo-${id}`).style.display = 'none';
        document.getElementById(`input-${id}`).style.display = 'block';
        event.target.style.display = 'none';
        document.querySelector(`.saveData[data-id="${id}"]`).style.display = 'inline';
    }

    if (event.target.matches('.saveData')) {
        let id = event.target.getAttribute('data-id');
        let updatedTodo = document.getElementById(`input-${id}`).value;
        updateTodo(id, updatedTodo);
        document.getElementById(`todo-${id}`).style.display = 'inline';
        document.getElementById(`input-${id}`).style.display = 'none';
        event.target.style.display = 'none';
        document.querySelector(`.editData[data-id="${id}"]`).style.display = 'inline';
    }

    if (event.target.matches('.delData')) {
        let id = event.target.getAttribute('data-id');
        deleteData(id);
    }
}, false);

const addDataInFirestore = async () => {
    const inputVal = todoInput.value;
    const id = new Date().getTime();
    const payload = { id, todo: inputVal, timestamp: id };
    await setDoc(doc(db, "todos", `${id}`), payload);
    todoInput.value = "";
};

const updateTodo = async (id, updatedTodo) => {
    const updatedPayload = {
        todo: updatedTodo,
        timestamp: todos.find(todo => todo.id === id).data().timestamp,
    };
    await updateDoc(doc(db, "todos", id), updatedPayload);
    document.getElementById(`todo-${id}`).innerText = updatedTodo; // Update the display
};

const deleteData = async (id) => {
    await deleteDoc(doc(db, "todos", id));
};

addData.addEventListener("click", addDataInFirestore);
