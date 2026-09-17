import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
getAuth,
onAuthStateChanged,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut
} from
"https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
getFirestore,
doc,
setDoc,
getDoc,
updateDoc,
serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

/* =========================================
FIREBASE CONFIG
========================================= */

const firebaseConfig = {
apiKey: "AIzaSyCf1_ldd1PxAPgcRH_vd6L5oXXtrRSMjpk",
authDomain: "rpw-seller-world-ccb3a.firebaseapp.com",
projectId: "rpw-seller-world-ccb3a",
storageBucket: "rpw-seller-world-ccb3a.firebasestorage.app",
messagingSenderId: "645033393554",
appId: "1:645033393554:web:30a2a7fa26ada1ab26d54b"
};

/* =========================================
INITIALIZE
========================================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

/* =========================================
REGISTER
========================================= */

export async function registerUser(
email,
password,
username
) {

const result =
    await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

const user = result.user;


await setDoc(
    doc(db, "users", user.uid),
    {
        uid: user.uid,

        username: username,

        email: email,

        photoURL: "",

        profileCompleted: false,

        completedOrders: 0,

        sellerRating: 0,

        sellerReviews: 0,

        isVerified: false,

        badge: "none",

        role: "user",

        createdAt: serverTimestamp()
    }
);


return user;

}

/* =========================================
LOGIN
========================================= */

export async function loginUser(
email,
password
) {

const result =
    await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

return result.user;

}

/* =========================================
LOGOUT
========================================= */

export async function logoutUser() {

await signOut(auth);

}

/* =========================================
AUTH STATE
========================================= */

export function watchAuth(callback) {

return onAuthStateChanged(
    auth,
    callback
);

}

/* =========================================
GET PROFILE
========================================= */

export async function getUserProfile(uid) {

const snapshot =
    await getDoc(
        doc(db, "users", uid)
    );


if (!snapshot.exists()) {
    return null;
}


return snapshot.data();

}

/* =========================================
COMPLETE PROFILE WITHOUT PHOTO
========================================= */

export async function completeProfileWithoutPhoto(
uid
) {

await updateDoc(
    doc(db, "users", uid),
    {
        photoURL: "",
        profileCompleted: true
    }
);

}

/* =========================================
EXPORT
========================================= */

export {
auth,
db
};
