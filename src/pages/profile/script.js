const container = document.getElementById('profile-container');
const accessToken = sessionStorage.getItem("accessToken");

if (accessToken) {
  axios.get("http://localhost:3000/users")
    .then(res => {
      const user = res.data.find(u => u.token === accessToken);

      if (!user) {
        container.innerHTML = "<p>Пользователь не найден. Пожалуйста, войдите снова.</p>";
        return;
      }

      const form = document.createElement('form');
      form.className = 'profile-form';

      const title = document.createElement('h2');
      title.className = 'form-title';
      title.textContent = 'Мои данные';
      form.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'form-grid';

      const fields = [
        ['Фамилия', user.surname || '', 'text', true],
        ['Имя', user.name || '', 'text', true],
        ['Отчество', user.patronymic || '', 'text', false],
        ['Дата рождения', '', 'date', false],
        ['Пол', '', 'gender', false],
        ['Электронная почта', user.email || '', 'email', true],
        ['Номер телефона', user.phone || '', 'tel', true]
      ];

      fields.forEach(([label, value, type, required]) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';

        const lbl = document.createElement('label');
        lbl.className = 'form-label';
        lbl.textContent = label + (required ? ' *' : '');
        wrapper.appendChild(lbl);

        if (type === 'gender') {
          const genderWrap = document.createElement('div');
          genderWrap.className = 'gender-wrap';

          const male = document.createElement('button');
          male.type = 'button';
          male.className = 'gender-button';
          male.textContent = 'Мужской';

          const female = document.createElement('button');
          female.type = 'button';
          female.className = 'gender-button';
          female.textContent = 'Женский';

          genderWrap.appendChild(male);
          genderWrap.appendChild(female);
          wrapper.appendChild(genderWrap);
        } else {
          const input = document.createElement('input');
          input.type = type;
          input.value = value;
          input.required = required;
          input.className = 'form-input';
          wrapper.appendChild(input);
        }

        grid.appendChild(wrapper);
      });

      form.appendChild(grid);

      const buttonRow = document.createElement('div');
      buttonRow.className = 'form-buttons';

      const logout = document.createElement('button');
      logout.className = '   logout-button';
      logout.type = 'button';
      logout.textContent = 'Выйти из системы';
      logout.onclick = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      };

      const home = document.createElement('button');
      home.className = 'button save-button';
      home.type = 'button';
      home.textContent = 'Сохранить';
      home.onclick = () => {
        window.location.href = '/';
      };


      buttonRow.appendChild(logout);
      buttonRow.appendChild(home);

      form.appendChild(buttonRow);
      container.appendChild(form);
    });
} else {
  const message = document.createElement('p');
  message.innerHTML = 'Вы не вошли в аккаунт. <a href="/">Войти</a>';
  container.appendChild(message);
}
