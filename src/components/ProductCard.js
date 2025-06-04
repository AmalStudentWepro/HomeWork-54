export function ProductCard(item) {
  const card = document.createElement('div');
  card.className = 'good-card';

  const img = document.createElement('img');
  img.src = item.media[0];
  card.appendChild(img);

  const title = document.createElement('h3');
  title.textContent = item.title;
  card.appendChild(title);

  if (item.salePercentage > 0) {
    const oldPrice = document.createElement('div');
    oldPrice.className = 'old-price';
    oldPrice.textContent = item.price + '₽';
    card.appendChild(oldPrice);

    const salePrice = document.createElement('div');
    salePrice.className = 'price';
    const newPrice = Math.floor(item.price * (1 - item.salePercentage / 100));
    salePrice.textContent = newPrice + '₽';
    card.appendChild(salePrice);
  } else {
    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = item.price + '₽';
    card.appendChild(price);
  }

  card.onclick = () => {
    localStorage.setItem('productId', item.id)
    window.location.href = "/src/pages/product/"
  }

  return card;
}
