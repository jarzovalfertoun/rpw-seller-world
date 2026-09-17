import {
  registerUser,
  loginUser,
  logoutUser,
  watchAuth,
  getUserProfile
} from "./firebase.js";

/* =========================================
   RPW: SELLER WORLD
   FRONTEND PROTOTYPE
========================================= */


/* =========================================
   DEMO PRODUCTS

   IMPORTANT:
   These are temporary.

   Later these will come from the backend.
========================================= */

let products = [

    {
        id: 1,
        name: "Premium Digital Service",
        price: 150,
        category: "Services",
        seller: "Alex Digital",
        orders: 27,
        rating: 4.9,
        icon: "⚡",
        badge: "verified"
    },

    {
        id: 2,
        name: "Gaming Service Package",
        price: 250,
        category: "Gaming",
        seller: "Marcus Shop",
        orders: 68,
        rating: 4.9,
        icon: "🎮",
        badge: "rainbow"
    },

    {
        id: 3,
        name: "Mobile Data Package",
        price: 99,
        category: "Load & Data",
        seller: "Nica Store",
        orders: 14,
        rating: 4.8,
        icon: "📶",
        badge: "verified"
    },

    {
        id: 4,
        name: "Digital Download",
        price: 75,
        category: "Digital Goods",
        seller: "Ken Digital",
        orders: 6,
        rating: 4.7,
        icon: "💻",
        badge: null
    },

    {
        id: 5,
        name: "Social Media Service",
        price: 120,
        category: "Social Media",
        seller: "Jade Services",
        orders: 52,
        rating: 4.9,
        icon: "📱",
        badge: "rainbow"
    },

    {
        id: 6,
        name: "Custom Online Service",
        price: 300,
        category: "Services",
        seller: "Lance Works",
        orders: 11,
        rating: 4.8,
        icon: "✨",
        badge: "verified"
    }

];


/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });


    const selectedPage =
        document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }


    /* Update bottom navigation */

    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.page === pageId) {
            item.classList.add("active");
        }

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /* Refresh search page */

    if (pageId === "search") {
        renderSearchResults(products);
    }

}


/* =========================================
   BADGE GENERATOR

   TEMPORARY FRONTEND VERSION.

   SECURITY VERSION COMES LATER.
========================================= */

function getBadge(orders) {

    if (orders >= 50) {

        return `
            <span
                class="rainbow-badge"
                title="50+ completed orders"
            >
                ★
            </span>
        `;

    }

    if (orders >= 10) {

        return `
            <span
                class="verified-badge"
                title="10+ completed orders"
            >
                ✓
            </span>
        `;

    }

    return "";

}


/* =========================================
   PRODUCT CARD
========================================= */

function createProductCard(product) {

    return `

        <article
            class="product-card"
            onclick="openProduct(${product.id})"
        >

            <div class="product-image">
                <span>${product.icon}</span>
            </div>

            <div class="product-body">

                <div class="product-title">
                    ${escapeHTML(product.name)}
                </div>

                <div class="product-price">
                    ₱${Number(product.price).toLocaleString()}
                </div>

                <div class="product-seller">

                    <small>
                        ${escapeHTML(product.seller)}
                        ${getBadge(product.orders)}
                    </small>

                </div>

                <div class="product-rating">
                    ★ ${product.rating}
                    · ${product.orders} orders
                </div>

            </div>

        </article>

    `;
}


/* =========================================
   RENDER PRODUCTS
========================================= */

function renderProducts() {

    const container =
        document.getElementById("homeProducts");

    if (!container) return;

    container.innerHTML =
        products
            .slice(0, 4)
            .map(createProductCard)
            .join("");

}


/* =========================================
   SEARCH RESULTS
========================================= */

function renderSearchResults(list) {

    const container =
        document.getElementById("searchResults");

    if (!container) return;


    if (list.length === 0) {

        container.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    padding:50px;
                    text-align:center;
                    color:#718096;
                "
            >

                <div style="font-size:40px;">
                    🔎
                </div>

                <p style="margin-top:10px;">
                    No listings found.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        list.map(createProductCard).join("");

}


/* =========================================
   SEARCH
========================================= */

function searchProducts(value) {

    const query =
        value.trim().toLowerCase();


    const results =
        products.filter(product => {

            return (

                product.name
                    .toLowerCase()
                    .includes(query)

                ||

                product.category
                    .toLowerCase()
                    .includes(query)

                ||

                product.seller
                    .toLowerCase()
                    .includes(query)

            );

        });


    renderSearchResults(results);


    /* Keep both search fields synchronized */

    const desktop =
        document.getElementById("desktopSearch");

    const mobile =
        document.getElementById("mobileSearch");


    if (document.activeElement === desktop) {
        if (mobile) mobile.value = value;
    }

    if (document.activeElement === mobile) {
        if (desktop) desktop.value = value;
    }

}


/* =========================================
   CATEGORY FILTER
========================================= */

function filterCategory(category) {

    showPage("search");


    const results =
        products.filter(
            product =>
                product.category === category
        );


    renderSearchResults(results);


    showToast(
        `Showing ${category}`
    );

}


/* =========================================
   SEARCH TABS
========================================= */

function setSearchTab(button, type) {

    document
        .querySelectorAll(".search-tabs button")
        .forEach(btn =>
            btn.classList.remove("active")
        );


    button.classList.add("active");


    let results = products;


    if (type === "services") {

        results =
            products.filter(
                p => p.category === "Services"
            );

    }


    if (type === "products") {

        results =
            products.filter(
                p => p.category !== "Services"
            );

    }


    renderSearchResults(results);

}


/* =========================================
   OPEN PRODUCT

   Temporary demo behavior.
========================================= */

function openProduct(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) return;


    showToast(
        `${product.name} selected`
    );

}


/* =========================================
   CREATE DEMO LISTING
========================================= */

function createDemoListing() {

    const name =
        document.getElementById(
            "productName"
        ).value.trim();

    const price =
        document.getElementById(
            "productPrice"
        ).value;

    const category =
        document.getElementById(
            "productCategory"
        ).value;


    if (!name || !price) {

        showToast(
            "Please enter a product name and price."
        );

        return;
    }


    const newProduct = {

        id: Date.now(),

        name: name,

        price: Number(price),

        category: category,

        seller: "You",

        orders: 0,

        rating: 0,

        icon: "🛍️",

        badge: null

    };


    products.unshift(newProduct);


    document.getElementById(
        "productName"
    ).value = "";

    document.getElementById(
        "productPrice"
    ).value = "";

    document.getElementById(
        "productDescription"
    ).value = "";


    renderProducts();


    showToast(
        "Listing created in prototype."
    );

}


/* =========================================
   MIDMAN REQUEST
========================================= */

function requestMidman() {

    showToast(
        "Midman request created."
    );

}


/* =========================================
   TOAST
========================================= */

let toastTimer;

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;


    toast.querySelector("p").textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* =========================================
   SECURITY HELPER

   Prevents basic HTML injection when
   displaying user-entered text.

   Backend validation will also be required.
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderProducts();

        renderSearchResults(products);

    }
);

// ==========================================
// RPW AUTH STATE
// ==========================================

watchAuth(async (user) => {

  if (user) {

    console.log("RPW user logged in:", user.email);

    const profile = await getUserProfile(user.uid);

    if (profile) {

      console.log("RPW Profile:", profile);

      // Update your existing profile UI here later.
      // Example:
      //
      // document.querySelector(".profile-name").textContent =
      //   profile.username;

    }

  } else {

    console.log("No RPW user logged in.");

  }

});
