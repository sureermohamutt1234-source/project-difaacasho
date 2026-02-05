/* ================= LOGIN / SIGNUP ================= */
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

const suUser = document.getElementById("suUser");
const suPass = document.getElementById("suPass");
const suMsg = document.getElementById("suMsg");

const liUser = document.getElementById("liUser");
const liPass = document.getElementById("liPass");
const liMsg = document.getElementById("liMsg");

function getUsers(){ return JSON.parse(localStorage.getItem("users"))||[]; }
function saveUsers(u){ localStorage.setItem("users",JSON.stringify(u)); }
function usernameExists(u){ return getUsers().some(x=>x.username===u); }

// SIGNUP
if(signupForm){
  signupForm.addEventListener("submit", e=>{
    e.preventDefault();
    const u = suUser.value.trim();
    const p = suPass.value.trim();
    if(!u||!p){ suMsg.textContent="All fields required"; suMsg.style.color="red"; return; }
    if(usernameExists(u)){ suMsg.textContent="Username exists"; suMsg.style.color="red"; return; }
    const users = getUsers(); users.push({username:u,password:p}); saveUsers(users);
    suMsg.textContent="Signup success"; suMsg.style.color="green"; signupForm.reset();
  });
}

// LOGIN
if(loginForm){
  loginForm.addEventListener("submit", e=>{
    e.preventDefault();
    const u = liUser.value.trim();
    const p = liPass.value.trim();
    const validUser = getUsers().find(x=>x.username===u && x.password===p);
    if(validUser){
      localStorage.setItem("loggedInUser",u);
      liMsg.textContent="Login success, redirecting..."; liMsg.style.color="green";
      setTimeout(()=>window.location.href="dashboard.html",500);
    } else {
      liMsg.textContent="Invalid credentials"; liMsg.style.color="red";
    }
  });
}

/* ================= DASHBOARD ================= */
const welcomeMsg = document.getElementById("welcomeMsg");
const logoutBtn = document.getElementById("logoutBtn");
const appointmentForm = document.getElementById("appointmentForm");
const appointmentList = document.getElementById("appointmentList");
const appMsg = document.getElementById("appMsg");

const loggedInUser = localStorage.getItem("loggedInUser");

// Redirect if dashboard accessed without login
if(welcomeMsg && !loggedInUser){
  window.location.href="index.html"; // redirect to homepage instead of auth.html
}

// Show user welcome
if(welcomeMsg) welcomeMsg.textContent = "Welcome " + loggedInUser;

// Logout
if(logoutBtn){
  logoutBtn.addEventListener("click",()=>{
    localStorage.removeItem("loggedInUser");
    window.location.href="index.html"; // redirect to homepage after logout
  });
}

// Appointment storage
function getAppointments(){ return JSON.parse(localStorage.getItem("appointments"))||[]; }
function saveAppointments(a){ localStorage.setItem("appointments",JSON.stringify(a)); }

// Add/Edit appointment
let editIndex = null;
if(appointmentForm){
  appointmentForm.addEventListener("submit", e=>{
    e.preventDefault();
    const name = document.getElementById("patientName").value.trim();
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;

    // VALIDATION
    if(!name||!service||!date){
      appMsg.textContent="All fields required"; 
      appMsg.style.color="red"; 
      return; 
    }

    const apps = getAppointments();
    if(editIndex !== null){
      // Update appointment
      apps[editIndex] = {user:loggedInUser, patientName:name, service, date};
      editIndex = null;
      appMsg.textContent="Appointment updated!";
    } else {
      // Add new appointment
      apps.push({user:loggedInUser, patientName:name, service, date});
      appMsg.textContent="Saved!";
    }
    saveAppointments(apps);
    appMsg.style.color="green";
    appointmentForm.reset();
    displayAppointments();
  });
}

// Display appointments with Edit/Delete buttons
function displayAppointments(){
  if(!appointmentList) return;
  appointmentList.innerHTML="";
  const myApps = getAppointments().filter(a=>a.user===loggedInUser);

  myApps.forEach((a,index)=>{
    const li = document.createElement("li");
    li.innerHTML = `
      ${a.patientName} | ${a.service} | ${a.date} 
      <button class="editBtn">Edit</button>
      <button class="deleteBtn">Delete</button>
    `;

    // EDIT BUTTON
    li.querySelector(".editBtn").addEventListener("click",()=>{
      document.getElementById("patientName").value = a.patientName;
      document.getElementById("service").value = a.service;
      document.getElementById("date").value = a.date;
      editIndex = getAppointments().findIndex(app => app.user===loggedInUser && app.patientName===a.patientName && app.date===a.date);
      appMsg.textContent="Editing appointment..."; 
      appMsg.style.color="orange";
    });

    // DELETE BUTTON
    li.querySelector(".deleteBtn").addEventListener("click",()=>{
      if(confirm("Delete this appointment?")){
        const apps = getAppointments();
        const delIndex = apps.findIndex(app => app.user===loggedInUser && app.patientName===a.patientName && app.date===a.date);
        apps.splice(delIndex,1);
        saveAppointments(apps);
        displayAppointments();
      }
    });

    appointmentList.appendChild(li);
  });
}

// Initial display
displayAppointments();
