import '../css/style.css';
import '../css/mobile.css';

document.getElementById("showPatientLogin").addEventListener("click", function () {
    document.querySelector(".PatientloginForm").classList.remove("hidden");
    document.querySelector(".ProfessionalLoginForm").classList.add("hidden");
  });
  
document.getElementById("showProfessionalLogin").addEventListener("click", function () {
    document.querySelector(".ProfessionalLoginForm").classList.remove("hidden");
    document.querySelector(".PatientloginForm").classList.add("hidden");
  });

document.addEventListener("DOMContentLoaded", () => {
    const ProfessionalLoginForm = document.querySelector(".ProfessionalLoginForm");
    
});