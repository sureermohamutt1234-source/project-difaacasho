/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById("contactForm");
const feedback = document.getElementById("feedback");

if(contactForm){
  contactForm.addEventListener("submit", e=>{
    e.preventDefault(); // prevent form submission

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Check empty fields
    if(!name || !email || !message){
      feedback.textContent = "All fields are required!";
      feedback.style.color = "red";
      return;
    }

    // Simple email validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if(!emailPattern.test(email)){
      feedback.textContent = "Enter a valid email!";
      feedback.style.color = "red";
      return;
    }

    // If all validation passes
    feedback.textContent = "Message sent successfully!";
    feedback.style.color = "green";

    // Reset form
    contactForm.reset();
  });
}
