/* ===== AUTH ===== */
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const signupMsg = document.getElementById("signupMsg");
const loginMsg = document.getElementById("loginMsg");

let users = JSON.parse(localStorage.getItem("users")) || [];

// SIGNUP
if(signupForm){
  signupForm.addEventListener("submit", e=>{
    e.preventDefault();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if(!username||!password){ signupMsg.textContent="All fields required!"; signupMsg.style.color="red"; return; }
    if(password.length<5){ signupMsg.textContent="Password must be at least 5 chars!"; signupMsg.style.color="red"; return; }
    if(users.find(u=>u.username===username)){ signupMsg.textContent="Username exists!"; signupMsg.style.color="red"; return; }

    users.push({username,password});
    localStorage.setItem("users",JSON.stringify(users));
    signupMsg.textContent="Signup successful! You can login."; signupMsg.style.color="green";
    signupForm.reset();
  });
}

// LOGIN
if(loginForm){
  loginForm.addEventListener("submit", e=>{
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const user = users.find(u=>u.username===username && u.password===password);

    if(!user){ loginMsg.textContent="Invalid username or password!"; loginMsg.style.color="red"; return; }

    localStorage.setItem("loggedInUser",username);
    window.location.href="dashboard.html";
  });
}

/* ===== DASHBOARD ===== */
const welcomeMsg = document.getElementById("welcomeMsg");
const logoutBtn = document.getElementById("logoutBtn");
const appointmentForm = document.getElementById("appointmentForm");
const appointmentList = document.getElementById("appointmentList");
const appMsg = document.getElementById("appMsg");

function getLoggedInUser(){ return localStorage.getItem("loggedInUser"); }

if(welcomeMsg) welcomeMsg.textContent = "Welcome " + getLoggedInUser();

// Redirect if dashboard accessed without login
if(document.body.classList.contains("dashboard-page") && !getLoggedInUser()){
  window.location.href="index.html";
}

// Logout
if(logoutBtn){
  logoutBtn.addEventListener("click", ()=>{
    localStorage.removeItem("loggedInUser");
    window.location.href="index.html"; // go to home
  });
}

// Appointments CRUD
function getAppointments(){ return JSON.parse(localStorage.getItem("appointments"))||[]; }
function saveAppointments(a){ localStorage.setItem("appointments",JSON.stringify(a)); }
function getAppointmentIndex(app){
  const all = getAppointments();
  return all.findIndex(a => a.user===app.user && a.patientName===app.patientName && a.service===app.service && a.date===app.date);
}

// Add
if(appointmentForm){
  appointmentForm.addEventListener("submit", e=>{
    e.preventDefault();
    const user = getLoggedInUser();
    const name = document.getElementById("patientName").value.trim();
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;

    if(!name||!service||!date){ appMsg.textContent="All fields required"; appMsg.style.color="red"; return; }

    const apps = getAppointments();
    apps.push({user,patientName:name,service,date});
    saveAppointments(apps);

    appMsg.textContent="Saved!"; appMsg.style.color="green";
    appointmentForm.reset();
    displayAppointments();
  });
}

// Display
function displayAppointments(){
  if(!appointmentList) return;
  appointmentList.innerHTML="";
  const user = getLoggedInUser();
  const myApps = getAppointments().filter(a=>a.user===user);

  myApps.forEach(app=>{
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${app.patientName} | ${app.service} | ${app.date}</span>
      <div>
        <button class="editBtn">Edit</button>
        <button class="deleteBtn">Delete</button>
      </div>
    `;
    appointmentList.appendChild(li);

    li.querySelector(".deleteBtn").addEventListener("click", ()=>{
      const all = getAppointments();
      all.splice(getAppointmentIndex(app),1);
      saveAppointments(all);
      displayAppointments();
    });

    li.querySelector(".editBtn").addEventListener("click", ()=>{
      document.getElementById("patientName").value = app.patientName;
      document.getElementById("service").value = app.service;
      document.getElementById("date").value = app.date;
      const all = getAppointments();
      all.splice(getAppointmentIndex(app),1);
      saveAppointments(all);
      displayAppointments();
    });
  });
}

// Auto display dashboard appointments if logged in
if(document.body.classList.contains("dashboard-page")){
  displayAppointments();
}
