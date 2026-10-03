const firebaseConfig = {
  apiKey: "AIzaSyBVLSeqrux0LDlHQcWvLW1KF7H2LxYbxN0",
  authDomain: "crisisguard-2026.firebaseapp.com",
  projectId: "crisisguard-2026",
  storageBucket: "crisisguard-2026.firebasestorage.app",
  messagingSenderId: "889170731440",
  appId: "1:889170731440:web:2beb90b07b42164eea3675"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

let currentUser = null;

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;
});

let latitude = "Unavailable";
let longitude = "Unavailable";
const locationBox = document.getElementById("location");

let map;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      locationBox.textContent = `Location: Lat: ${latitude}, Long: ${longitude}`;

      map = L.map('map').setView([latitude, longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.marker([latitude, longitude]).addTo(map)
        .bindPopup('Your Location')
        .openPopup();
    },
    (error) => {
      console.error("Location error:", error);
      locationBox.textContent = `Location: Not available`;
      document.getElementById("map").textContent = "Map unavailable";
    }
  );
} else {
  locationBox.textContent = "Geolocation is not supported by this browser.";
}

function submitProblem() {

  const problem = document.getElementById("problem").value.trim();

  if (!problem) {
    alert("Please describe your problem.");
    return;
  }

  if (!currentUser) {
    alert("You must be logged in to submit a report.");
    window.location.href = "login.html";
    return;
  }

  const report = {
    userId: currentUser.uid,
    name: currentUser.displayName,
    email: currentUser.email,
    latitude: latitude,
    longitude: longitude,
    location: `Lat: ${latitude}, Long: ${longitude}`,
    problem,
    timestamp: new Date().toISOString()
  };

  db.collection("disaster_reports").add(report)
    .then(() => {
      alert("Problem submitted successfully!");
      document.getElementById("problem").value = "";
      window.location.href = "emergency.html";
    })
    .catch((error) => {
      console.error("Error submitting problem:", error);
      alert("Failed to submit problem.");
    });
}