import axios from "axios";
import { generateToken } from '../../utils/token.js';


const signin = document.querySelector('#signin');

signin.onclick = () => {
    window.location.href = "/src/pages/signin/"
};

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const nameInput = this.querySelector('input[type="text"]'); 
    const emailInput = this.querySelector('input[type="email"]');
    const passwordInput = this.querySelector('input[type="password"]');
    const checkbox = this.querySelector('input[type="checkbox"]');
  
    let valid = true;
  
    if (nameInput.value.trim() === '' || /\d/.test(nameInput.value)) {
      nameInput.style.border = '2px solid red';
      valid = false;
    } else {
      nameInput.style.border = '';
    }
  
    if (!emailInput.value.includes('@')) {
      emailInput.style.border = '2px solid red';
      valid = false;
    } else {
      emailInput.style.border = '';
    }
  
    if (passwordInput.value.trim().length < 6) {
      passwordInput.style.border = '2px solid red';
      valid = false;
    } else {
      passwordInput.style.border = '';
    }
  
    if (!checkbox.checked) {
      checkbox.nextElementSibling.style.color = 'red';
      valid = false;
    } else {
      checkbox.nextElementSibling.style.color = '';
    }

    let token = generateToken();
  
    if (valid) {
      const user = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        token,
      };
    
      axios.post("http://localhost:3000/users", user)
        .then(res => {
          alert('Регистрация успешна!');
          if(res.status === 201) {
            sessionStorage.setItem("accessToken", token)
            window.location.href = "/";
          }
        })
        .catch(err => console.error(err));
    }
    
});