const baseUrl = "https://tarmeezacademy.com/api/v1"
let currentPage = 1
let lastPage = 1

// --START MODEL ---
const openButtonDesktop = document.querySelector("#openLoginDesktop");
// const openButtonMobile = document.querySelector("#openLoginMobile");
const closeButton = document.querySelector("#closeLogin");

const loginModal = document.querySelector("#loginModal");
const loginModalContent = document.querySelector("#loginContent");

// Open the modal Deaktop
openButtonDesktop.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
});



// Close the modal using the X button
closeButton.addEventListener("click", () => {
    loginModal.classList.add("hidden");
});

// Close when clicking outside the form
loginModal.addEventListener("click", (event) => {
    if (!loginModalContent.contains(event.target)) {
        loginModal.classList.add("hidden");
    }
});

// Close when pressing Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        loginModal.classList.add("hidden");
    }
});

// --END MODEL AND --


// -- START ALERT --
const alertBox = document.querySelector("#loginAlert");
const alertTitle = document.querySelector("#alertTitle");
const alertMessage = document.querySelector("#alertMessage");
const closeAlert = document.querySelector("#closeAlert");

// Store the timer so we can reset it when another alert appears
let alertTimeout;

// Colors for each alert type
const alertStyles = {
    success: [
        "border-green-400",
        "bg-green-50",
        "text-green-700"
    ],
    error: [
        "border-red-400",
        "bg-red-50",
        "text-red-700"
    ],
    warning: [
        "border-yellow-400",
        "bg-yellow-50",
        "text-yellow-700"
    ]
};

// Reusable alert function
function showAlert(title, message, type) {

    // Update the title and message
    alertTitle.textContent = title;
    alertMessage.textContent = message;

    // Remove the previous alert colors
    Object.values(alertStyles).flat().forEach(className => {
        alertBox.classList.remove(className);
        alertTitle.classList.remove(className);
    });

    // Apply the colors for the selected type
    const colors = alertStyles[type] || alertStyles.success;

    alertBox.classList.add(colors[0], colors[1]);
    alertTitle.classList.add(colors[2]);

    // Show the alert
    alertBox.classList.remove("hidden");
    alertBox.classList.add("flex");

    // Cancel the previous timer, if there is one
    clearTimeout(alertTimeout);

    // Hide the alert after 3 seconds
    alertTimeout = setTimeout(() => {
        hideAlert();
    }, 3000);
}

// Function to hide the alert
function hideAlert() {
    alertBox.classList.add("hidden");
    alertBox.classList.remove("flex");

    clearTimeout(alertTimeout);
}

// Close the alert when clicking X
closeAlert.addEventListener("click", hideAlert);
// -- END ALERT -- 
// NAVBAR
const menuButtons = document.querySelectorAll('.menu-btn');
const mobileMenus = document.querySelectorAll('.mobile-menu');

menuButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        mobileMenus[index].classList.toggle('hidden');
    });
});
// NAVBAR

// -- START INFINIT SCROLL --
window.addEventListener("scroll", ()=>{
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight
    // console.log(currentPage)
    // console.log(lastPage)
    if(endOfPage && currentPage < lastPage){
        currentPage += 1
        getAllPosts(false,currentPage)

    }

})
// -- END INFINIT SCROLL --

// -- START SETUPUI --
function setupUI(){
    const loggedIndivDesktop = document.getElementById("logged-in-div")
    const currentUserDiv = document.getElementById("current-user-div")
    const logoutDesktop = document.getElementById("logoutDesktop")
    const token = localStorage.getItem("token")

    // add btn
    const addPostBtn = document.getElementById("add-post-btn")

    if(token == null){//user is guest (not logged in)
        if(addPostBtn != null){
            addPostBtn.style.visibility = "hidden"
        }
        loggedIndivDesktop.style.visibility = "visible"
        loggedIndivDesktop.style.display = "block"

        logoutDesktop.style.visibility = "hidden"
        logoutDesktop.style.display = "none"

        
        currentUserDiv.style.visibility = "hidden"
        currentUserDiv.style.display = "none"

    }else{//for logged in user
        if(addPostBtn != null){
            addPostBtn.style.visibility = "visible"
        }
        loggedIndivDesktop.style.visibility = "hidden"
        loggedIndivDesktop.style.display = "none"
        logoutDesktop.style.visibility = "visible"
        logoutDesktop.style.display = "block"
        
        currentUserDiv.style.visibility = "visible"
        currentUserDiv.style.display = "flex"
        
        const user = getCurrentUser()
        document.getElementById("profile-username").innerHTML = user.username
        document.getElementById("user-profile-image").innerHTML = ""
        document.getElementById("user-profile-image").innerHTML += `<img src="${user.profile_image}" alt="" class="w-full h-full object-center object-cover"></img>`

    }
}
setupUI()
// -- END SETUPUI --

// --START LOGIN--
function login(){
    const username =  document.getElementById("username").value
    const password = document.getElementById("password").value
    const params = {
        "username" : username,
        "password" : password
    }

    const url= `${baseUrl}/login`

    axios.post(url,params)
    .then((response)=>{
        console.log(response.data.token)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user",JSON.stringify( response.data.user))
        // Close the login Modal
        loginModal.classList.add("hidden");

        // Show success alert
        showAlert(
            "Login Successful",
            "Welcome to our community!",
            "success"
        );
        
        setupUI()

        })
        .catch((error) => {

            showAlert(
                "Login Failed",
                "Please check your username and password.",
                "error"
            );
        });
}
// --END LOGIN--

// =====REGISTER =====
// --START MODEL AND ALERT---
const regesterButtonDesktop = document.querySelector("#openRegesterDesktop");
const closeRegesterModal = document.querySelector("#closeRegester");

const regesterModal = document.querySelector("#regesterModal");
const regesterContent = document.querySelector("#regesterContent");

// Open the modal Deaktop
regesterButtonDesktop.addEventListener("click", () => {
    regesterModal.classList.remove("hidden");
});


// Close the modal using the X button
closeRegesterModal.addEventListener("click", () => {
    regesterModal.classList.add("hidden");
});

// Close when clicking outside the form
regesterModal.addEventListener("click", (event) => {
    if (!regesterContent.contains(event.target)) {
        regesterModal.classList.add("hidden");
    }
});

// Close when pressing Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        regesterModal.classList.add("hidden");
    }
});

// --END MODEL AND ALERT--


// --START LOGIN--
function regester(){
    const profileImage = document.getElementById("profile-image").files[0]
    const name =  document.getElementById("regester-name").value
    const username =  document.getElementById("regester-username").value
    const password = document.getElementById("regester-password").value

    const formData = new FormData()
    formData.append("image",profileImage)
    formData.append("name",name)
    formData.append("username",username)
    formData.append("password",password)
    console.log(name,username,password,profileImage)

    const url= `${baseUrl}/register`

    axios.post(url,formData)
    .then((response)=>{
        console.log(response.data.token)
        console.log(response.data.user)

        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user",JSON.stringify( response.data.user))
        // Close the login Modal
        regesterModal.classList.add("hidden");

        // Show success alert
            showAlert(
                "Register Successful",
                "Welcome to our community!",
                "success"
            );
        setupUI()
        })
        .catch((error) => {
            const message = error.response.data.message
            showAlert(
                "Register Failed",
                message,
                "warning"
            );
        });
}
// =====REGISTER =====



// -- START GET USER --
function getCurrentUser(){
    let user = null
    const storageUser = localStorage.getItem("user")
    if(storageUser != null){
        user = JSON.parse(storageUser)
    }
    return user

}
// -- END GET USER --
// -- START LOGOUT --
function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    // Show success alert
        showAlert(
            "Logout Successful",
            "Logout Successful!",
            "success"
        );
    setupUI()
}
// -- END LOGOUT --


// -- START ADD POST --


