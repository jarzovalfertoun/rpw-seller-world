import {
registerUser,
loginUser,
logoutUser,
watchAuth,
getUserProfile,
completeProfileWithoutPhoto
} from "./firebase.js";

/* =========================================
RPW: SELLER WORLD
========================================= */

/* =========================================
DEMO PRODUCTS
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

document
    .querySelectorAll(".page")
    .forEach(page => {
        page.classList.remove("active");
    });


const selectedPage =
    document.getElementById(pageId);

if (selectedPage) {
    selectedPage.classList.add("active");
}


document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.classList.remove("active");

        if (item.dataset.page === pageId) {
            item.classList.add("active");
        }

    });


window.scrollTo({
    top: 0,
    behavior: "smooth"
});


if (pageId === "search") {
    renderSearchResults(products);
}

}

/* =========================================
BADGE
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
    list
        .map(createProductCard)
        .join("");

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


const desktop =
    document.getElementById("desktopSearch");

const mobile =
    document.getElementById("mobileSearch");


if (document.activeElement === desktop) {

    if (mobile) {
        mobile.value = value;
    }
}


if (document.activeElement === mobile) {

    if (desktop) {
        desktop.value = value;
    }
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
            p =>
                p.category === "Services"
        );
}


if (type === "products") {

    results =
        products.filter(
            p =>
                p.category !== "Services"
        );
}


renderSearchResults(results);

}

/* =========================================
OPEN PRODUCT
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
    document
        .getElementById("productName")
        ?.value
        .trim();


const price =
    document
        .getElementById("productPrice")
        ?.value;


const category =
    document
        .getElementById("productCategory")
        ?.value;


if (!name || !price) {

    showToast(
        "Please enter a product name and price."
    );

    return;
}


products.unshift({

    id: Date.now(),

    name,

    price: Number(price),

    category,

    seller: "You",

    orders: 0,

    rating: 0,

    icon: "🛍️",

    badge: null

});


const nameInput =
    document.getElementById("productName");

const priceInput =
    document.getElementById("productPrice");

const descriptionInput =
    document.getElementById(
        "productDescription"
    );


if (nameInput) {
    nameInput.value = "";
}

if (priceInput) {
    priceInput.value = "";
}

if (descriptionInput) {
    descriptionInput.value = "";
}


renderProducts();

showToast(
    "Listing created in prototype."
);

}

/* =========================================
MIDMAN
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


const text =
    toast.querySelector("p");


if (text) {
    text.textContent = message;
}


toast.classList.add("show");

clearTimeout(toastTimer);


toastTimer =
    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

/* =========================================
SECURITY
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
GLOBAL FUNCTIONS
========================================= */

window.showPage = showPage;
window.searchProducts = searchProducts;
window.filterCategory = filterCategory;
window.setSearchTab = setSearchTab;
window.openProduct = openProduct;
window.createDemoListing = createDemoListing;
window.requestMidman = requestMidman;
window.showToast = showToast;

/* =========================================
AUTH UI
========================================= */

let currentRPWUser = null;

function initializeAuthUI() {

const authScreen =
    document.getElementById("authScreen");

const profileSetup =
    document.getElementById("profileSetup");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const authTitle =
    document.getElementById("authTitle");

const authSubtitle =
    document.getElementById("authSubtitle");

const authSwitchText =
    document.getElementById("authSwitchText");

const authSwitchButton =
    document.getElementById("authSwitchButton");

const authError =
    document.getElementById("authError");

const profileSetupError =
    document.getElementById("profileSetupError");

const skipProfilePicture =
    document.getElementById("skipProfilePicture");


/* -----------------------------------------
   CHECK REQUIRED ELEMENTS
----------------------------------------- */

if (
    !authScreen ||
    !profileSetup ||
    !loginForm ||
    !registerForm ||
    !authTitle ||
    !authSubtitle ||
    !authSwitchText ||
    !authSwitchButton ||
    !authError
) {

    console.error(
        "RPW AUTH ERROR: Authentication HTML elements are missing."
    );

    return;
}


/* -----------------------------------------
   AUTH MODE
----------------------------------------- */

let authMode = "login";


function setAuthMode(mode) {

    authMode = mode;

    authError.textContent = "";


    if (mode === "register") {

        loginForm.classList.add("hidden");

        registerForm.classList.remove(
            "hidden"
        );

        authTitle.textContent =
            "Create your account";

        authSubtitle.textContent =
            "Join RPW: Seller World and start trading.";

        authSwitchText.textContent =
            "Already have an account?";

        authSwitchButton.textContent =
            "Login";

    } else {

        registerForm.classList.add("hidden");

        loginForm.classList.remove(
            "hidden"
        );

        authTitle.textContent =
            "Welcome back";

        authSubtitle.textContent =
            "Login to continue to Seller World.";

        authSwitchText.textContent =
            "Don't have an account?";

        authSwitchButton.textContent =
            "Create Account";
    }
}


authSwitchButton.addEventListener(
    "click",
    () => {

        setAuthMode(
            authMode === "login"
                ? "register"
                : "login"
        );

    }
);


/* -----------------------------------------
   LOGIN
----------------------------------------- */

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        authError.textContent =
            "Logging in...";


        const email =
            document
                .getElementById("loginEmail")
                ?.value
                .trim();


        const password =
            document
                .getElementById("loginPassword")
                ?.value;


        if (!email || !password) {

            authError.textContent =
                "Please enter your email and password.";

            return;
        }


        try {

            await loginUser(
                email,
                password
            );

            authError.textContent = "";

        } catch (error) {

            console.error(
                "RPW LOGIN ERROR:",
                error
            );

            authError.textContent =
                getAuthErrorMessage(error);
        }
    }
);


/* -----------------------------------------
   REGISTER
----------------------------------------- */

registerForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        authError.textContent =
            "Creating your account...";


        const username =
            document
                .getElementById(
                    "registerUsername"
                )
                ?.value
                .trim();


        const email =
            document
                .getElementById(
                    "registerEmail"
                )
                ?.value
                .trim();


        const password =
            document
                .getElementById(
                    "registerPassword"
                )
                ?.value;


        if (!username || username.length < 3) {

            authError.textContent =
                "Username must be at least 3 characters.";

            return;
        }


        if (!email) {

            authError.textContent =
                "Please enter your email.";

            return;
        }


        if (!password || password.length < 6) {

            authError.textContent =
                "Password must be at least 6 characters.";

            return;
        }


        try {

            await registerUser(
                email,
                password,
                username
            );

            authError.textContent = "";

        } catch (error) {

            console.error(
                "RPW REGISTER ERROR:",
                error
            );

            authError.textContent =
                getAuthErrorMessage(error);
        }
    }
);


/* -----------------------------------------
   SKIP PROFILE PICTURE
----------------------------------------- */

if (skipProfilePicture) {

    skipProfilePicture.addEventListener(
        "click",
        async () => {

            if (!currentRPWUser) return;


            skipProfilePicture.disabled =
                true;

            skipProfilePicture.textContent =
                "Setting up...";


            try {

                await completeProfileWithoutPhoto(
                    currentRPWUser.uid
                );


                profileSetup.classList.add(
                    "hidden"
                );

                authScreen.classList.add(
                    "hidden"
                );

                showPage("home");


            } catch (error) {

                console.error(
                    "RPW PROFILE ERROR:",
                    error
                );


                if (profileSetupError) {

                    profileSetupError.textContent =
                        "Something went wrong. Please try again.";
                }


                skipProfilePicture.disabled =
                    false;

                skipProfilePicture.textContent =
                    "Skip for now";
            }
        }
    );
}


/* -----------------------------------------
   INITIAL MODE
----------------------------------------- */

setAuthMode("login");

}

/* =========================================
AUTH STATE
========================================= */

watchAuth(
async user => {

    currentRPWUser = user;


    const authScreen =
        document.getElementById("authScreen");

    const profileSetup =
        document.getElementById("profileSetup");


    if (!authScreen || !profileSetup) {

        console.error(
            "RPW AUTH ERROR: authScreen/profileSetup missing."
        );

        return;
    }


    /* -----------------------------------------
       NOT LOGGED IN
    ----------------------------------------- */

    if (!user) {

        authScreen.classList.remove(
            "hidden"
        );

        profileSetup.classList.add(
            "hidden"
        );

        return;
    }


    /* -----------------------------------------
       LOGGED IN
    ----------------------------------------- */

    try {

        const profile =
            await getUserProfile(
                user.uid
            );


        if (
            profile &&
            profile.profileCompleted === true
        ) {

            authScreen.classList.add(
                "hidden"
            );

            profileSetup.classList.add(
                "hidden"
            );

            showPage("home");

        } else {

            authScreen.classList.add(
                "hidden"
            );

            profileSetup.classList.remove(
                "hidden"
            );
        }


    } catch (error) {

        console.error(
            "RPW PROFILE LOAD ERROR:",
            error
        );

        authScreen.classList.remove(
            "hidden"
        );

        profileSetup.classList.add(
            "hidden"
        );
    }
}

);

/* =========================================
DOM READY
========================================= */

document.addEventListener(
"DOMContentLoaded",
() => {

    renderProducts();

    renderSearchResults(products);

    initializeAuthUI();

}

);

/* =========================================
ERROR TRANSLATOR
========================================= */

function getAuthErrorMessage(error) {

switch (error.code) {

    case "auth/email-already-in-use":
        return "That email is already registered.";

    case "auth/invalid-email":
        return "Please enter a valid email.";

    case "auth/weak-password":
        return "Password must be at least 6 characters.";

    case "auth/invalid-credential":
        return "Incorrect email or password.";

    case "auth/user-not-found":
        return "No account was found with that email.";

    case "auth/wrong-password":
        return "Incorrect email or password.";

    case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";

    case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

    case "permission-denied":
        return "Firebase permission denied. Check Firestore rules.";

    default:

        console.error(
            "Unhandled Firebase error:",
            error
        );

        return error.message ||
            "Something went wrong. Please try again.";
}

}
