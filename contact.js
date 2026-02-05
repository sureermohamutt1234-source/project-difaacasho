/* ===== CONTACT FORM VALIDATION ===== */
const contactForm = document.getElementById("contactForm");
const feedback = document.getElementById("feedback");

if(contactForm){
  contactForm.addEventListener("submit", e=>{
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Validate Name -> letters only
    const namePattern = /^[A-Za-z\s]+$/;
    if(!name){
      feedback.textContent = "Name is required!";
      feedback.style.color = "red";
      return;
    } else if(!namePattern.test(name)){
      feedback.textContent = "Name must contain letters only!";
      feedback.style.color = "red";
      return;
    }

    // Validate Email -> proper format
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if(!email){
      feedback.textContent = "Email is required!";
      feedback.style.color = "red";
      return;
    } else if(!emailPattern.test(email)){
      feedback.textContent = "Enter a valid email!";
      feedback.style.color = "red";
      return;
    }

    // Validate Message -> numbers only
    const messagePattern = /^[0-9]+$/;
    if(!message){
      feedback.textContent = "Message is required!";
      feedback.style.color = "red";
      return;
    } else if(!messagePattern.test(message)){
      feedback.textContent = "Message must contain numbers only!";
      feedback.style.color = "red";
      return;
    }

    // If all validations pass
    feedback.textContent = "Message sent successfully!";
    feedback.style.color = "green";
    contactForm.reset();
  });
}
