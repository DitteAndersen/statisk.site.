console.log("loaded");

const params = new URLSearchParams(window.location.search);
const category = params.get("category");

console.log("category:", category);

document.querySelector("h2").textContent = category
  ? category.toUpperCase()
  : "PRODUCTS";

const container = document.querySelector(".productList");
let allProducts = [];

const endpoint = category
  ? `https://kea-alt-del.dk/t7/api/products?category=${encodeURIComponent(category)}&limit=60`
  : `https://kea-alt-del.dk/t7/api/products?limit=60`;

console.log("endpoint:", endpoint);

fetch(endpoint)
  .then((response) => response.json())
  .then((products) => {
    console.log("products:", products);
    console.log("products length:", products.length);

    allProducts = products;
    showProducts(allProducts);
    setupFilters();
  })
  .catch((err) => console.error("Fetch error:", err));

function setupFilters() {
  document.querySelectorAll(".filterBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filterBtn")
        .forEach((b) => b.classList.remove("isActive"));
      btn.classList.add("isActive");

      const chosen = btn.dataset.gender;

      if (chosen === "all") {
        showProducts(allProducts);
        return;
      }

      const filtered = allProducts.filter(
        (p) => normalizeGender(getGenderValue(p)) === chosen,
      );
      showProducts(filtered);
    });
  });
}

function getGenderValue(product) {
  return (
    product.gender ||
    product.gendername ||
    product.genderdisplayname ||
    product.genderName ||
    product.genderDisplayName ||
    ""
  );
}

function normalizeGender(value) {
  const v = String(value).trim().toLowerCase();
  if (v.includes("women")) return "women";
  if (v.includes("men")) return "men";
  if (v.includes("unisex")) return "unisex";
  return v;
}

function showProducts(products) {
  let markup = "";

  products.forEach((product) => {
    const isSoldOut = product.soldout == 1;
    const isOnSale = product.discount && product.discount > 0;

    const saleClass = isOnSale ? "onSale" : "";
    const soldOutClass = isSoldOut ? "soldOut" : "";

    const newPrice = isOnSale
      ? Math.round(product.price - (product.price * product.discount) / 100)
      : null;

    markup += `
      <a href="product.html?id=${product.id}&category=${encodeURIComponent(category ?? "")}">
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

          <p class="price">DKK <span>${product.price},-</span></p>

          ${
            isOnSale
              ? `<div class="discounted">
                  <p>Now DKK <span>${newPrice}</span>,-</p>
                  <p><span>${product.discount}</span>%</p>
                </div>`
              : ``
          }
        </article>
      </a>
    `;
  });

  container.innerHTML = markup;
}
