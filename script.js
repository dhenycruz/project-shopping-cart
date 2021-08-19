const classTotalPrice = '.total-price';
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

function saveCart() {
  const cart = document.querySelectorAll('.cart__item');
  const arrayCart = [];
  cart.forEach((item) => {
    arrayCart.push(item.innerHTML);
  });
  localStorage.setItem('cart', JSON.stringify(arrayCart));
}

function subtractionPriceCart(item) {
    const stringProduct = item;
    console.log(item);
    const priceProduct = stringProduct.substr(stringProduct.indexOf('$') + 1);

    if (localStorage.getItem('total_cart') != null) {
      const totalCurrent = localStorage.getItem('total_cart');
      const totalNew = parseFloat(totalCurrent) - parseFloat(priceProduct);
      localStorage.setItem('total_cart', totalNew);
      document.querySelector(classTotalPrice).innerText = `${totalNew}`;
    }
    if (localStorage.getItem('total_cart') === '0.00') {
      localStorage.removeItem('total_cart');
      localStorage.removeItem('cart');
      document.querySelector(classTotalPrice).innerText = '0.00';
    }
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  subtractionPriceCart(event.target.innerText);
 event.target.remove();
  saveCart();
}

function loadCart() {
  if (localStorage.getItem('cart') !== null) {    
    const arrayCartStorage = JSON.parse(localStorage.getItem('cart'));
    arrayCartStorage.forEach((item) => {
      const li = document.createElement('li');
      li.innerText = item;
    document.querySelector('.cart__items').appendChild(li);
      li.addEventListener('click', cartItemClickListener);
    });
  }
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function totalPrice(price) {
  if (localStorage.getItem('total_cart') !== null) {
    const totalCurrent = localStorage.getItem('total_cart');
    const priceTotal = (price + parseFloat(totalCurrent));
    localStorage.setItem('total_cart', priceTotal);
  } else {
    localStorage.setItem('total_cart', price);
  }
  const total = localStorage.getItem('total_cart');
  document.querySelector('.total-price').innerText = `${total}`;
}

function loadingCreate() {
  const loading = document.createElement('span');
  const section = document.querySelector('.items');
  loading.setAttribute('class', 'loading');
  section.appendChild(loading);
}

function endLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

async function fetchProduct() {
  loadingCreate();
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await response.json();
  return json;
}

async function requestIdProduct(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const json = await response.json();
  totalPrice(json.price);
  const itemCart = createCartItemElement({ sku: json.id, name: json.title, salePrice: json.price });
  itemCart.addEventListener('click', () => cartItemClickListener);
  document.querySelector('.cart__items').appendChild(itemCart);
  saveCart();
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

window.onload = async function () {
   await listProduct();
   endLoading();
  loadCart();
  const buttonEmpty = document.querySelector('.empty-cart');
  buttonEmpty.addEventListener('click', () => {
    const lis = document.querySelectorAll('li');
    lis.forEach((li) => {
      li.remove();
      localStorage.removeItem('cart');
      localStorage.removeItem('total_cart');
      document.querySelector(classTotalPrice).innerText = '0.00';
    });
  });
};