import axios from "axios";

const signin = document.querySelector('#signup');

signin.onclick = () => {
  window.location.href = "/src/pages/signup/";
};

document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();

  const emailInput = this.querySelector('input[type="email"]');
  const passwordInput = this.querySelector('input[type="password"]');
  const checkbox = this.querySelector('input[type="checkbox"]');

  let valid = true;

  if (!emailInput.value.includes('@')) {
    emailInput.classList.add('error');
    valid = false;
  } else {
    emailInput.classList.remove('error');
  }

  if (passwordInput.value.length < 6) {
    passwordInput.classList.add('error');
    valid = false;
  } else {
    passwordInput.classList.remove('error');
  }

  if (!checkbox.checked) {
    checkbox.nextElementSibling.style.color = 'red';
    valid = false;
  } else {
    checkbox.nextElementSibling.style.color = '';
  }

  if (valid) {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim(); 
  
    axios.get(`http://localhost:3000/users?email=${email}`)
      .then(res => {
        if (res.data.length > 0) {
          let user = res.data[0];
  
          sessionStorage.setItem("accessToken", user.token);
  
          if (password === user.password) {
            window.location.href = "/";
          } else {
            alert('Неправильный пароль');
          }
        } else {
          alert('Такой почты нет :(');
        }
      })
      .catch(err => {
        console.error(err);
        alert("Ошибка при проверке почты");
      });
  }
});
