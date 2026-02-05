/* ===== CONTACT FORM VALIDATION ===== */
const contactForm = document.getElementById("contactForm");
const feedback = document.getElementById("feedback");

if(contactForm){
  contactForm.addEventListener("submit", e=>{
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Name validation -> letters only
    if(!name){
      feedback.textContent = "Name is required!";
      feedback.style.color = "red";
      return;
    }
    if(/[^A-Za-z\s]/.test(name)){  // If contains non-letters
      feedback.textContent = "Name must contain letters only!";
      feedback.style.color = "red";
      return;
    }

    // Email validation
    if(!email){
      feedback.textContent = "Email is required!";
      feedback.style.color = "red";
      return;
    }
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if(!emailPattern.test(email)){
      feedback.textContent = "Enter a valid email!";
      feedback.style.color = "red";
      return;
    }

    // Message validation -> letters only
    if(!message){
      feedback.textContent = "Message is required!";
      feedback.style.color = "red";
      return;
    }
    if(/[^A-Za-z\s]/.test(message)){
      feedback.textContent = "Message must contain letters only!";
      feedback.style.color = "red";
      return;
    }

    // If all validations pass
    feedback.textContent = "Message sent successfully!";
    feedback.style.color = "green";
    contactForm.reset();
  });
}
