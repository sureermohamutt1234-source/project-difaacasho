let users = JSON.parse(localStorage.getItem("users")) || [];

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const signupMsg = document.getElementById("signupMsg");
const loginMsg = document.getElementById("loginMsg");

// PASSWORD STRENGTH CHECK
function strongPassword(password){
  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(password);
}

if(signupForm){
  signupForm.addEventListener("submit", e=>{
    e.preventDefault();

    const username =
      document.getElementById("signupUsername").value.trim();
    const password =
      document.getElementById("signupPassword").value.trim();

    if(!username || !password){
      signupMsg.textContent = "All fields required!";
      signupMsg.style.color = "red";
      return;
    }

    if(!strongPassword(password)){
      signupMsg.textContent =
        "Password must be 8+ chars, include letter, number & symbol";
      signupMsg.style.color = "red";
      return;
    }

    if(users.find(u => u.username === username)){
      signupMsg.textContent = "Username exists!";
      signupMsg.style.color = "red";
      return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    signupMsg.textContent = "Signup success! Login now.";
    signupMsg.style.color = "green";
    signupForm.reset();
  });
}

if(loginForm){
  loginForm.addEventListener("submit", e=>{
    e.preventDefault();

    const username =
      document.getElementById("loginUsername").value.trim();
    const password =
      document.getElementById("loginPassword").value.trim();

    const user =
      users.find(u => u.username === username && u.password === password);

    if(!user){
      loginMsg.textContent = "Invalid username/password!";
      loginMsg.style.color = "red";
      return;
    }

    localStorage.setItem("loggedInUser", username);
    window.location.href = "dashboard.html";
  });
}

/* ===== DASHBOARD ===== */
const welcomeMsg = document.getElementById("welcomeMsg");
const logoutBtn = document.getElementById("logoutBtn");
const appointmentForm = document.getElementById("appointmentForm");
const appointmentList = document.getElementById("appointmentList");
const appMsg = document.getElementById("appMsg");
const dateInput = document.getElementById("date");

function getLoggedInUser(){
  return localStorage.getItem("loggedInUser");
}

// Redirect haddii login la'aan dashboard la galo
if(document.body.classList.contains("dashboard-page")
   && !getLoggedInUser()){
  window.location.href = "index.html";
}

if(welcomeMsg){
  welcomeMsg.textContent = "Welcome " + getLoggedInUser();
}

if(logoutBtn){
  logoutBtn.addEventListener("click", ()=>{
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  });
}

/* ===== DATE VALIDATION (NO PAST DATE) ===== */
const today = new Date().toISOString().split("T")[0];
if(dateInput){
  dateInput.setAttribute("min", today);
}

/* ===== APPOINTMENTS CRUD ===== */
function getAppointments(){
  return JSON.parse(localStorage.getItem("appointments")) || [];
}

function saveAppointments(a){
  localStorage.setItem("appointments", JSON.stringify(a));
}

function getAppointmentIndex(app){
  const all = getAppointments();
  return all.findIndex(a =>
    a.user === app.user &&
    a.patientName === app.patientName &&
    a.service === app.service &&
    a.date === app.date
  );
}

if(appointmentForm){
  appointmentForm.addEventListener("submit", e=>{
    e.preventDefault();

    const user = getLoggedInUser();
    const name =
      document.getElementById("patientName").value.trim();
    const service =
      document.getElementById("service").value;
    const date = dateInput.value;

    if(!name || !service || !date){
      appMsg.textContent = "All fields required";
      appMsg.style.color = "red";
      return;
    }

    if(date < today){
      appMsg.textContent = "Past dates are not allowed";
      appMsg.style.color = "red";
      return;
    }

    const apps = getAppointments();
    apps.push({ user, patientName: name, service, date });
    saveAppointments(apps);

    appMsg.textContent = "Appointment saved!";
    appMsg.style.color = "green";
    appointmentForm.reset();
    displayAppointments();
  });
}

function displayAppointments(){
  if(!appointmentList) return;

  appointmentList.innerHTML = "";
  const user = getLoggedInUser();

  const myApps =
    getAppointments().filter(a => a.user === user);

  myApps.forEach(app =>{
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
      all.splice(getAppointmentIndex(app), 1);
      saveAppointments(all);
      displayAppointments();
    });

    li.querySelector(".editBtn").addEventListener("click", ()=>{
      document.getElementById("patientName").value = app.patientName;
      document.getElementById("service").value = app.service;
      dateInput.value = app.date;

      const all = getAppointments();
      all.splice(getAppointmentIndex(app), 1);
      saveAppointments(all);
      displayAppointments();
    });
  });
}

displayAppointments();