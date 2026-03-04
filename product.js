const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const category = params.get("category");

const productContainer = document.querySelector("#productContainer");
const backLink = document.getElementById("backLink");

if (category && backLink) {
  backLink.href = `productlist.html?category=${encodeURIComponent(category)}`;
}

if (productId) {
  const endpoint = `https://kea-alt-del.dk/t7/api/products/${productId}`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      renderProduct(data);
    })
    .catch((err) => console.log(err));
}

function renderProduct(data) {
  document.title = data.productdisplayname;

  const isOnSale = data.discount && data.discount > 0;
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
        <p class="articleType">
          <span class="bold">Type:</span> ${data.articletype}
        </p>

        <p class="productCategory">
          <span class="bold">Category:</span> ${data.category}
        </p>

        <p class="productPrice">
          ${
            isOnSale
              ? `<span class="bold">Price:</span> DKK 
                 <s>${data.price},-</s>&nbsp;&nbsp;&nbsp;Now:
                 <span class="salePrice">
                   ${Math.round(data.price - (data.price * data.discount) / 100)},-
                 </span>`
              : `<span class="bold">Price:</span> DKK ${data.price},-`
          }
        </p>

        <p class="stock">
          <span class="bold">Availability:</span> 
          ${isSoldOut ? "Sold Out" : "In Stock"}
        </p>
      </div>

      <button class="buyButton" ${isSoldOut ? "disabled" : ""}>
        ${isSoldOut ? "SOLD OUT" : "BUY NOW"}
      </button>
    </section>
  `;
}
