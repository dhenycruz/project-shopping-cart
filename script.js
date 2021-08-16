function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchProduct() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await response.json();
  return json;
}

async function requestIdProduct(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const json = await response.json();
  const itemCart = createCartItemElement({ sku: json.id, name: json.title, salePrice: json.price });
  itemCart.addEventListener('click', () => cartItemClickListener);
  document.querySelector('.cart__items').appendChild(itemCart);
}

async function listProduct() {
  const data = await fetchProduct();
    data.results.forEach((result) => {
    const item = createProductItemElement({
      sku: result.id, name: result.title, image: result.thumbnail,
    });
    const addCartButton = item.querySelector('.item__add');
    addCartButton.addEventListener('click', () => {
      const idProduct = getSkuFromProductItem(item);
      requestIdProduct(idProduct);
    });
    document.querySelector('.items').appendChild(item);
  });
}

window.onload = function () {
  listProduct();
};