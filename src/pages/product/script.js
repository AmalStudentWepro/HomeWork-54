import axios from 'axios';

const productId = localStorage.getItem("productId");

axios.get(`http://localhost:3000/goods/${productId}`)
  .then(res => showProductData(res.data))
  .catch(err => console.error("Ошибка загрузки товара:", err));

function showProductData(data) {
  document.querySelector('.main-image img').src = data.media[0];
  
  const thumbnails = document.querySelectorAll('.thumbnails img');
  thumbnails.forEach(el => el.src = data.media[0]);

  document.querySelector('h1').textContent = data.title;
  document.querySelector('.new-price').textContent = `${data.price} сум`;

  const oldPrice = Math.round(data.price / (1 - (data.salePercentage / 100)));
  document.querySelector('.old-price').textContent =
    data.salePercentage ? `${oldPrice} сум` : '';

  document.querySelector('.description p').innerHTML = data.description || "Описание скоро появится";
}
