const API_URL = 'http://localhost:5000'; //This defines the base URL for your API. You're saying "talk to the server running locally on port 5000."

/*
for below register form : When a user submits the register form ➔ their info gets sent to your server ➔ server responds ➔ user sees a message ➔ if successful, they are sent to the login page.
*/

const registerForm = document.getElementById('registerForm');

/*
if (registerForm) { ... } :

    =>Checks if the form exists on the page (to avoid errors if it doesn’t).

    =>If it does, it adds an event listener to it.
*/

if(registerForm){
  registerForm.addEventListener('submit',async (e)=>{
    e.preventDefault(); //Prevents the default behavior of form submission (which would normally reload the page).
    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    /*
    res is the response "object" you get from fetch(), and it contains a lot of information like:

      status (HTTP status code)

      headers (the response headers)

      body (the actual content, which could be a JSON string or something else)
    */

    /*
    Send data to server:

        It uses fetch to make an async POST request to the server (${API_URL}/register).

        headers: { 'Content-Type': 'application/json' } tells the server that the body of the request is JSON.

        body: JSON.stringify({ username, password }) converts the username and password into JSON format to send.
    */

    const data = await res.json(); //reads the response object's(response object has several things like headers, body, status etc) body and automatically parses it into JSON.

    alert(data.message); //Pops up an alert box showing the server's response message (maybe "Registration successful" or "Username already exists").
    if (res.ok) window.location.href = "login.html"; //If the server responded successfully (res.ok means status 200-299), it redirects the user to login.html.
  });
}

const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${API_URL}/login`,{
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({username, password})
    });
    const data = await res.json();
    if(res.ok){
      localStorage.setItem('token',data.token);
      window.location.href = 'tasks.html';
    }else{
      alert(data.message);
    }
  });
}

//below function:  This function fetches the user's tasks from the backend, clears the old tasks, and displays all the current tasks with "Delete" and "Toggle" buttons for each.

async function getTasks(){
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  }); //GET is the default request type for fetch
  const tasks = await res.json();

  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${task.title} - ${task.completed ? "Completed" : "Pending"}
      <button onclick="deleteTask('${task._id}')">Delete</button>
      <button onclick="toggleTask('${
        task._id
      }', ${!task.completed})">Toggle</button>
    `;
    taskList.appendChild(li);
  });
}

async function addTask(title) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (res.ok) {
    getTasks();
  } else {
    const data = await res.json();
    alert(data.message);
  }
}

//e.g(for title part in body of fetch) : body: JSON.stringify({ title: "Complete homework" })  // << here you send the title

async function  deleteTask(id) {
  const token = localStorage.getItem("token");
  await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  getTasks();

  /*
  Content-Type is only needed when you're sending a body (like JSON data with POST or PUT).
  Since there’s no body here, no need to tell the server what format it would be.

  DELETE requests usually don't send a body.
  You're just telling the server: "Hey, delete the resource (task) at this specific URL (/tasks/:id)."


  */
}

async function toggleTask(id, completed){
  const token = localStorage.getItem('token');
  await fetch(`${API_URL}/tasks/${id}`,{
    method: 'PUT',
    headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`},
    body: JSON.stringify({completed})
  });
  getTasks();
}

const taskForm = document.getElementById("taskForm");
if (taskForm) {
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value;
    addTask(title);
    taskForm.reset();
  });
  getTasks();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}


