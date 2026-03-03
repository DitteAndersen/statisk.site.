const productId = new URLSearchParams(window.location.search).get("id");
const category = new URLSearchParams(window.location.search).get("category");

const productContainer = document.querySelector("#productContainer");
const backLink = document.getElementById("backLink");

if (category && backLink) {
  backLink.href = `productlist.html?category=${encodeURIComponent(category)}`;
}

const endpoint = `https://kea-alt-del.dk/t7/api/products/${productId}`;

function getData() {
  fetch(endpoint)
    .then((response) => response.json())
    .then(renderProduct);
}

function renderProduct(data) {
  document.title = data.productdisplayname;

  const isOnSale = data.discount && data.discount > 0;
  const newPrice = isOnSale
    ? Math.round(data.price - (data.price * data.discount) / 100)
    : null;

  const isSoldOut = data.soldout == 1;

  productContainer.innerHTML = `
    <figure>
      <img
        src="https://kea-alt-del.dk/t7/images/webp/640/${data.id}.webp"
        alt="${data.productdisplayname}"
        class="productImage"
        loading="lazy"
        decoding="async"
        width="300"
        height="400"
      />
      ${isOnSale ? `<span class="saleLabel">–${data.discount}%</span>` : ``}
    </figure>

    <section class="productDetails">
      <h2 class="productName">${data.productdisplayname}</h2>

      <div>
        <p class="articleType"><span class="bold">Type:</span> ${data.articletype}</p>
        <p class="productCategory"><span class="bold">Kategori:</span> ${data.category}</p>

        <p class="productPrice">
          ${
            isOnSale
              ? `<span class="bold">Pris:</span> DKK <s>${data.price},-</s> → <span class="salePrice">${newPrice},-</span>`
              : `<span class="bold">Pris:</span> DKK ${data.price},-`
          }
        </p>

       <p class="stock"><span class="bold">Sold out:</span> ${data.soldout}</p>
      </div>

      <button class="buyButton" ${isSoldOut ? "disabled" : ""}>
        ${isSoldOut ? "UDSOLGT" : "KØB NU"}
      </button>
    </section>
  `;
}

getData();
