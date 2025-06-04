import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import { renderGoodsSection } from './utils/render.js';
// import { createHeader } from './components/Header.js';
import axios from 'axios';

const main = document.createElement('main');
document.body.appendChild(main);

createHeader();
createSwiperSlider();
createCategories();

function createHeader() {
  const header = document.createElement('header');
  header.className = 'site-header';

  const logo = document.createElement('div');
  logo.className = 'logo';

  const logoImg = document.createElement('img');
  logoImg.src = '/img/uzum.png';

  const logoText = document.createElement('span');
  logoText.textContent = 'Uzum market';

  logo.append(logoImg, logoText);

  const catalog = document.createElement('button');
  catalog.className = 'catalog-button';
  catalog.textContent = 'Каталог';

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

  const search = document.createElement('div');
  search.className = 'search';

  const input = document.createElement('input');
  input.placeholder = 'Искать товары и категории';

  const searchIcon = document.createElement('img');
  searchIcon.src = 'https://cdn-icons-png.flaticon.com/512/622/622669.png';
  searchIcon.alt = 'Поиск';

  search.append(input, searchIcon);

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



  
  const actions = document.querySelector('.actions');  

  const accessToken = sessionStorage.getItem("accessToken");
  
  if (accessToken) {
    axios.get("http://localhost:3000/users")
      .then(res => {
        const users = res.data;
        const user = users.find(u => u.token === accessToken);
  
        if (user) {
          const userDiv = document.createElement('button');
          userDiv.className = 'icon user';
  
          const userImg = document.createElement('img');
          userImg.src = '/img/user.webp';
  
          const userText = document.createElement('span');
          userText.textContent = user.name;
  
          userDiv.append(userImg, userText);
          actions.appendChild(userDiv);
  
          userDiv.onclick = () => {
            window.location.href = "/src/pages/profile/";
          };
        } else {
          console.log("Пользователь с таким токеном не найден.");
          showLoginButton(); 
        }
      })
      .catch(err => {
        console.error("Ошибка при получении пользователей:", err);
        showLoginButton();
      });
  
  } else {
    showLoginButton();
  }
  
  
  function showLoginButton() {
    const login_btn = document.createElement('button');
    login_btn.className = 'icon login_btn';
  
    const login_img = document.createElement('img');
    login_img.src = '/img/user.webp';
  
    const login_text = document.createElement('span');
    login_text.textContent = 'Войти';
  
    login_btn.append(login_img, login_text);
    actions.appendChild(login_btn);
  
    login_btn.onclick = () => {
      window.location.href = "/src/pages/signup/";
    };
  }
  
  
  
  

  const favorites_btn = document.createElement('button');
  favorites_btn.className = 'icon favorites_btn';
  const favorites_img = document.createElement('img');
  favorites_img.src = '/img/heart.webp';
  const favorites_text = document.createElement('span');
  favorites_text.textContent = 'Избранное';
  favorites_btn.append(favorites_img, favorites_text);
  actions.appendChild(favorites_btn);

  const cart_btn = document.createElement('button');
  cart_btn.className = 'icon cart_btn';
  const cart_img = document.createElement('img');
  cart_img.src = '/img/korzina.png';
  const cart_text = document.createElement('span');
  cart_text.textContent = 'Корзина';
  cart_btn.append(cart_img, cart_text);
  actions.appendChild(cart_btn);

  header.append(logo, catalog, search, actions);
  main.appendChild(header);

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

      const title = document.createElement('h3');
      title.textContent = type;

      const badge = document.createElement('span');
      badge.className = 'count-badge';
      badge.textContent = `${counts[type]} товаров`;

      row.append(title, badge);
      categoriesBlock.appendChild(row);
    });

    document.body.appendChild(categoriesBlock);
  }
}

function createSwiperSlider() {
  const swiper = document.createElement('div');
  swiper.className = 'swiper';

  const wrapper = document.createElement('div');
  wrapper.className = 'swiper-wrapper';

  const images = [
    '/img/slide1.jpg', '/img/slide2.jpg', '/img/slide3.jpg',
    '/img/slide4.jpg', '/img/slide5.jpg', '/img/slide6.jpg',
    '/img/slide7.jpg', '/img/slide8.jpg', '/img/slide9.jpg',
    '/img/slide10.jpg', '/img/slide11.jpg', '/img/slide12.jpg',
    '/img/slide13.jpg', '/img/slide14.jpg', '/img/slide15.jpg'
  ];

  images.forEach(src => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';

    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Slide image';

    slide.appendChild(img);
    wrapper.appendChild(slide);
  });

  swiper.appendChild(wrapper);

  const pagination = document.createElement('div');
  pagination.className = 'swiper-pagination';

  const prev = document.createElement('div');
  prev.className = 'swiper-button-prev';
  prev.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const next = document.createElement('div');
  next.className = 'swiper-button-next';
  next.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const scrollbar = document.createElement('div');
  scrollbar.className = 'swiper-scrollbar';

  swiper.append(pagination, prev, next, scrollbar);
  main.appendChild(swiper);

  new Swiper('.swiper', {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination'
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });
}

function createCategories() {
  const container = document.createElement('div');
  container.className = 'categories';

  const data = [
    { name: 'Детский мир', img: '/img/bear.png' },
    { name: 'Гарантия низких цен', img: '/img/check.png' },
    { name: 'Модный Базар', img: '/img/jacket.png' },
    { name: 'Товары недели', img: '/img/star.png' }
  ];

  data.forEach(({ name, img }) => {
    const block = document.createElement('div');
    block.className = 'category';

    const icon = document.createElement('img');
    icon.src = img;
    icon.alt = name;
    icon.className = `icon icon-${name.toLowerCase().replace(/[^a-zа-я0-9]/gi, '-')}`;

    const span = document.createElement('span');
    span.textContent = name;

    block.append(icon, span);
    container.appendChild(block);
  });

  main.appendChild(container);
}

axios.get('http://localhost:3000/goods')
  .then(res => renderGoodsSection(res.data, main, 'Все товары'))
  .catch(err => console.error(err));
