const videoItems = document.querySelectorAll('.video-item');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;

function updateVideoDisplay() {
    videoItems.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === videoItems.length - 1;
}
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateVideoDisplay();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < videoItems.length - 1) {
        currentIndex++;
        updateVideoDisplay();
    }
});

updateVideoDisplay();


const menuIcon = document.querySelector('#menu');
        const navMenu = document.getElementById('navLinks');

        menuIcon.addEventListener('click', (e) => {
            console.log(e)
            navMenu.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.navLinks a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        const firebaseConfig = {
            apiKey: "AIzaSyDH7miURtTBwk6VaWFpm_nUQ_Y0RclR23w",
            authDomain: "subscription-f065e.firebaseapp.com",
            projectId: "subscription-f065e",
            databaseURL: "https://subscription-f065e-default-rtdb.firebaseio.com",
          
            storageBucket: "subscription-f065e.firebasestorage.app",
            messagingSenderId: "220215209505",
            appId: "1:220215209505:web:24073d6bf2066433c57d60",
            measurementId: "G-EM37SJHWQV"
          };
              
              firebase.initializeApp(firebaseConfig);
              const database = firebase.database();
          
              
          
              
              function subscribe() {
                const email = document.getElementById("emailInput").value.trim();
                if (!email || !email.includes("@")) {
                  alert("Please enter a valid email.");
                  return;
                }
          
                
                const newRef = database.ref("subscribers").push();
                newRef.set({
                  email: email,
                  timestamp: new Date().toISOString()
                }).then(() => {
                  alert("Subscribed successfully!");
                  document.getElementById("emailInput").value = "";
                  sendConfirmationEmail(email);
                }).catch((error) => {
                  console.error("Firebase error:", error);
                //   alert("Failed to subscribe. Try again later.");
                });
              }