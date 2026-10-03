const firebaseConfig = {
  apiKey: "AIzaSyBVLSeqrux0LDlHQcWvLW1KF7H2LxYbxN0",
  authDomain: "crisisguard-2026.firebaseapp.com",
  projectId: "crisisguard-2026",
  storageBucket: "crisisguard-2026.firebasestorage.app",
  messagingSenderId: "889170731440",
  appId: "1:889170731440:web:2beb90b07b42164eea3675"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const googleLoginButton = document.getElementById("google-login");

googleLoginButton.addEventListener("click", function () {

  auth.signInWithPopup(provider)
    .then(() => {
      window.location.href = "problem.html";
    })
    .catch((error) => {

      console.error("Google Sign-In Error:", error);

      alert("Google Sign-In failed. Please try again.");
    });

});