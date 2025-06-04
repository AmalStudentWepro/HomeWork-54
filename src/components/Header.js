export function createHeader() {
  const header = document.createElement('header');
  header.className = 'site-header';

  header.innerHTML = `
    <div class="logo">
      <img src="/img/uzum.png" />
      <span>Uzum market</span>
    </div>
    <button class="catalog-button">Каталог</button>
    <div class="search">
      <input placeholder="Искать товары и категории" />
      <img src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="Поиск" />
    </div>
    <div class="actions"></div>
  `;

  const main = document.querySelector('main');
  main.appendChild(header);

  const catalog = header.querySelector('.catalog-button');
  let categoriesVisible = false;
  let categoriesBlock = null;

  catalog.addEventListener('click', () => {
    const existingOverlay = document.querySelector('.overlay');

    if (!categoriesVisible) {
      axios.get('http://localhost:3000/goods')
        .then(res => {
          const goods = res.data;
          const types = [...new Set(goods.map(good => good.type))];
          const counts = {};

          goods.forEach(g => {
            counts[g.type] = (counts[g.type] || 0) + 1;
          });

          createCatalogMenu(types, counts);
          categoriesVisible = true;

          const overlay = document.createElement('div');
          overlay.className = 'overlay';
          overlay.addEventListener('click', () => {
            categoriesBlock.classList.remove('open');
            overlay.remove();
            categoriesVisible = false;
          });

          document.body.appendChild(overlay);

          requestAnimationFrame(() => {
            categoriesBlock.classList.add('open');
            overlay.classList.add('active');
          });
        })
        .catch(err => console.error(err));
    } else {
      if (categoriesBlock) categoriesBlock.classList.remove('open');
      if (existingOverlay) existingOverlay.remove();
      categoriesVisible = false;
    }
  });

  const input = header.querySelector('.search input');
  const actions = header.querySelector('.actions');
  let searchResultsBlock = null;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();

    if (searchResultsBlock) {
      searchResultsBlock.remove();
      searchResultsBlock = null;
    }

    if (query.length === 0) return;

    axios.get('http://localhost:3000/goods')
      .then(res => {
        const goods = res.data.filter(g => g.title.toLowerCase().includes(query));
        createSearchResults(goods.slice(0, 5), query);
      });
  });

  function createSearchResults(results, query) {
    searchResultsBlock = document.createElement('div');
    searchResultsBlock.className = 'search-results';

    const blur = document.createElement('div');
    blur.className = 'blur';
    blur.addEventListener('click', () => {
      blur.remove();
      searchResultsBlock.remove();
      searchResultsBlock = null;
      input.value = '';
    });

    document.body.appendChild(blur);

    const label = document.createElement('p');
    label.textContent = 'Поиск';
    searchResultsBlock.appendChild(label);

    if (results.length === 0) {
      const notFound = document.createElement('div');
      notFound.textContent = 'Ничего не найдено';
      searchResultsBlock.appendChild(notFound);
    } else {
      results.forEach(good => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.textContent = good.title;
        searchResultsBlock.appendChild(item);
      });
    }

    document.body.appendChild(searchResultsBlock);
  }

  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    axios.get(`http://localhost:3000/users?token=${accessToken}`)
      .then(res => {
        if (res.data.length > 0) {
          const user = res.data[0];

          actions.innerHTML += `
            <button class="icon user">
              <img src="/img/user.webp" />
              <span>${user.name}</span>
            </button>
          `;

          actions.querySelector('.user').onclick = () => {
            window.location.href = "/src/pages/profile/";
          };
        } else {
          showLoginButton();
        }
      })
      .catch(err => {
        console.error("Ошибка при получении пользователя:", err);
        showLoginButton();
      });
  } else {
    showLoginButton();
  }

  function showLoginButton() {
    actions.innerHTML += `
      <button class="icon login_btn">
        <img src="/img/user.webp" />
        <span>Войти</span>
      </button>
    `;

    actions.querySelector('.login_btn').onclick = () => {
      window.location.href = "/src/pages/signup/";
    };
  }

  actions.innerHTML += `
    <button class="icon favorites_btn">
      <img src="/img/heart.webp" />
      <span>Избранное</span>
    </button>
    <button class="icon cart_btn">
      <img src="/img/korzina.png" />
      <span>Корзина</span>
    </button>
  `;

  function createCatalogMenu(types, counts) {
    if (categoriesBlock) categoriesBlock.remove();

    categoriesBlock = document.createElement('div');
    categoriesBlock.className = 'catalog-menu';

    const title = document.createElement('p');
    title.textContent = 'Категории товаров';
    title.className = 'catalog-title';
    categoriesBlock.appendChild(title);

    types.forEach(type => {
      const row = document.createElement('div');
      row.className = 'catalog-item';

      const h3 = document.createElement('h3');
      h3.textContent = type;

      const badge = document.createElement('span');
      badge.className = 'count-badge';
      badge.textContent = `${counts[type]} товаров`;

      row.append(h3, badge);
      categoriesBlock.appendChild(row);
    });

    document.body.appendChild(categoriesBlock);
  }
}

