let api = document.querySelector(".api");
let statusText = document.getElementById("status");

let searchInput = document.getElementById("search");
let categorySelect = document.getElementById("category");

let sortSelect = document.getElementById("sort");

let allProducts = [];
let filteredProducts = [];

fetch("https://fakestoreapi.com/products/")

    .then((response) => {
        return response.json();
    })

    .then((data) => {

        statusText.style.display = "none";
        allProducts = data;

        filteredProducts = [...allProducts];

        loadCategories(allProducts);
        applyFilters();
    })

    .catch((error) => {
        console.log(error);
        statusText.innerText = "Failed to load data!!!!!";
    });



function displayProducts(data) {

    api.innerHTML = "";
    if (data.length === 0) {
        api.innerHTML = "<h2>No Products Found</h2>";
        return;
    }

    data.forEach((product) => {

        let div = document.createElement("div");
        div.innerHTML = `
            <div class="card-content">

                <h3>${product.title.slice(0, 50)}...</h3>
                <img src="${product.image}">
                <h4>$ ${product.price}</h4>
                <p>${product.description.slice(0, 60)}...</p>

            </div>

            <div class="btn-group">

                <button class="view-btn">View More</button>
                <button class="cart-btn">Add to Cart</button>

            </div>
        `;
        div.querySelector(".view-btn")
            .addEventListener("click", () => {

                viewMore(product);
            });
        div.querySelector(".cart-btn")
            .addEventListener("click", () => {

                addToCart(product);
            });

        api.append(div);
    });
}


function loadCategories(data) {

    let categories = [...new Set(data.map(item => item.category))];
    categories.forEach((cat) => {

        let option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.append(option);
    });
}

function applyFilters() {

    let searchValue = searchInput.value.toLowerCase();
    let categoryValue = categorySelect.value;
    let sortValue = sortSelect.value;

    filteredProducts = [...allProducts];
    filteredProducts = filteredProducts.filter((product) => {

        return product.title.toLowerCase().includes(searchValue);
    });

    if (categoryValue !== "all") {

        filteredProducts = filteredProducts.filter((product) => {
            return product.category === categoryValue;
        });
    }

    if (sortValue === "low" || sortValue == "Low") {
        filteredProducts.sort((a, b) => {
            return a.price - b.price
        });
    }

    if (sortValue === "high" || sortValue == 'High') {
        filteredProducts.sort((a, b) =>{
         return b.price - a.price
        });
    }
    displayProducts(filteredProducts);
}

searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);


function viewMore(product) {
    document.getElementById("modal").style.display = "block";
    document.getElementById("modalTitle").innerText = product.title;
    document.getElementById("modalImg").src = product.image;
    document.getElementById("modalDesc").innerText = product.description;
    document.getElementById("modalPrice").innerText = "$ " + product.price;
}



document.getElementById("close")
    .addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
    });



function addToCart(product) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let alreadyExists = cart.find((item) => {
        return item.id === product.id;
    });

    if (alreadyExists) {
        alert("Item already in cart....");
        return;
    }

    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart..");
}

document.getElementById("cartBtn")
    .addEventListener("click", () => {
        showCart();
    });


function showCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItems = document.getElementById("cartItems");

    cartItems.innerHTML = "";
    if (cart.length === 0) {
        cartItems.innerHTML = `
    <h3>
        <i class="fa-solid fa-cart-shopping"></i>
        Cart is Empty
    </h3>
`;
    }

    cart.forEach((item) => {

        let div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <img src="${item.image}">
            <p>${item.title.slice(0, 20)}...</p>
            <h4>₹ ${item.price}</h4>
            <button class="remove-btn">
                Remove
            </button>
        `;

        div.querySelector(".remove-btn")
            .addEventListener("click", () => {
                removeFromCart(item.id);
            });

        cartItems.append(div);
    });
    document.getElementById("cartModal").style.display = "block";
}
function removeFromCart(id) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => {
        return item.id !== id;
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
}

document.getElementById("cartClose")
    .addEventListener("click", () => {
        document.getElementById("cartModal").style.display = "none";
    });