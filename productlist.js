const category = new URLSearchParams(window.location.search).get("category");
const endpoint = `https://kea-alt-del.dk/t7/api/products?category=${category}`;

document.querySelector("h2").textContent = category.toUpperCase();

const container = document.querySelector(".productList");

function getData() {
  fetch(endpoint)
    .then((response) => response.json())
    .then(showProducts);
}

function showProducts(products) {
  console.table(products);

  let markup = "";

  products.forEach((product) => {
    const isSoldOut = product.soldout == 1;
    const isOnSale = product.discount && product.discount > 0;

    const saleClass = isOnSale ? "onSale" : "";
    const soldOutClass = isSoldOut ? "soldOut" : "";
    const newPrice = isOnSale
      ? Math.round(product.price - (product.price * product.discount) / 100)
      : "";

    markup += `
      <a href="product.html?id=${product.id}&category=${encodeURIComponent(category)}">
        <article class="smallProduct ${saleClass} ${soldOutClass}">
          <img
            src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp"
            alt="${product.productdisplayname}"
            loading="lazy"
            decoding="async"
            width="300"
            height="400"
          />

          <h3>${product.productdisplayname}</h3>
          <p class="subtitle">${product.articletype} | ${product.brandname}</p>

          <p class="price">DKK <span>${product.price}</span>,-</p>

          <div class="discounted">
            <p>Now DKK <span>${newPrice}</span>, -</p>
            <p><span>${product.discount || ""}</span>%</p>
          </div>
        </article>
      </a>
    `;
  });

  container.innerHTML = markup;
}

getData();
