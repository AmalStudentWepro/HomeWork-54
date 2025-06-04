import { ProductCard } from '../components/ProductCard.js';

export function render(arr, place, Component) {
  place.innerHTML = "";
  for (let item of arr) {
    const elem = Component(item);
    place.append(elem);
  }
}

export function renderGoodsSection(goods, parent, titleText = 'Популярное') {
  const container = document.createElement('div');
  container.className = 'goods-section';
  parent.appendChild(container);

  const title = document.createElement('h2');
  title.textContent = `${titleText} >`;
  title.className = 'goods-title';
  container.appendChild(title);

  render(goods, container, ProductCard);
}
  