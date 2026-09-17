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

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";


/* =========================================
   FIREBASE CONFIG
========================================= */

const firebaseConfig = {

    apiKey: "PASTE_YOUR_API_KEY",

    authDomain: "PASTE_YOUR_AUTH_DOMAIN",

    projectId: "PASTE_YOUR_PROJECT_ID",

    storageBucket: "PASTE_YOUR_STORAGE_BUCKET",

    messagingSenderId:
        "PASTE_YOUR_MESSAGING_SENDER_ID",

    appId: "PASTE_YOUR_APP_ID"

};


/* =========================================
   INITIALIZE
========================================= */

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);

const storage =
    getStorage(app);


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

    const user =
        result.user;


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

            createdAt:
                serverTimestamp()

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
   UPLOAD PROFILE PICTURE
========================================= */

export async function uploadProfilePicture(
    uid,
    file
) {

    if (!file) {
        throw new Error(
            "No profile picture selected."
        );
    }


    if (!file.type.startsWith("image/")) {

        throw new Error(
            "Please select an image."
        );

    }


    if (file.size > 5 * 1024 * 1024) {

        throw new Error(
            "Profile picture must be 5MB or smaller."
        );

    }


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const imageRef =
        ref(
            storage,
            `profilePictures/${uid}/avatar.${extension}`
        );


    await uploadBytes(
        imageRef,
        file
    );


    const downloadURL =
        await getDownloadURL(
            imageRef
        );


    await updateDoc(
        doc(db, "users", uid),
        {

            photoURL:
                downloadURL,

            profileCompleted:
                true

        }
    );


    return downloadURL;

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

            profileCompleted:
                true

        }
    );

}


/* =========================================
   EXPORT
========================================= */

export {
    auth,
    db,
    storage
};
