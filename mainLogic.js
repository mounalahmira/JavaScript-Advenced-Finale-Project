const baseUrl = "https://tarmeezacademy.com/api/v1"
let currentPage = 1
let lastPage = 1

// === START ALERT ===
const alertBox = document.querySelector("#alertBox");
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
// === END ALERT === 

// === START NAVBAR ===
const menuButtons = document.querySelectorAll('.menu-btn');
const mobileMenus = document.querySelectorAll('.mobile-menu');

menuButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        mobileMenus[index].classList.toggle('hidden');
    });
});
// === END NAVBAR ===

// === START INFINIT SCROLL ===
window.addEventListener("scroll", ()=>{
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight
    if(endOfPage && currentPage < lastPage){
        currentPage += 1
        getAllPosts(false,currentPage)
    }
})
// === END INFINIT SCROLL ===

// ===== START GET USER =====
function getCurrentUser(){
    let user = null
    const storageUser = localStorage.getItem("user")
    if(storageUser != null){
        user = JSON.parse(storageUser)
    }
    // console.log(user)
    return user
}
// ===== END GET USER =====
// === START SETUPUI ===
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
// === END SETUPUI ===

// ==== START LOGIN ====
// -- START LOGING MODEL --
const openButtonDesktop = document.querySelector("#openLoginDesktop");
const closeButton = document.querySelector("#close");
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
// -- END LOGING MODEL AND --

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
// ==== END LOGIN ====

// =====REGISTER =====
// --START REGISTER MODEL ---
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

// --END REGISTER MODEL --


// --START REGISTER --
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
// -- END REGISTER --
// ===== REGISTER =====




// ===== START LOGOUT =====
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
// === END LOGOUT ===

// === START POST CLICKED === 
function postClicked(postId){
    window.location = `postDetails.html?postId=${postId}`
    // alert(postId)
}
// === END POST CLICKED ===
// === START USER CLICKED === 
function userClicked(userId){
    window.location = `profile.html?userId=${userId}`
    // alert(postId)
}
// === END USER CLICKED ===

// === START PROFILE CLICKED ===
function profileClicked(){
    const user = getCurrentUser()
    console.log(user.id)
    window.location = `profile.html?userId=${user.id}`
}
// === END PROFILE CLICKED ===

// ==== START DELETE POST ====
// --- START DELETE MODAL
const deletePostModal = document.querySelector("#delete-post-modal");
const deletePostModalContent = document.querySelector("#delete-post-content");

// Close the modal using the X button
deletePostModalContent.addEventListener("click", () => {
    deletePostModal.classList.add("hidden");
});
// Close when clicking outside the form
deletePostModal.addEventListener("click", (event) => {
    if (!deletePostModalContent.contains(event.target)) {
        deletePostModal.classList.add("hidden");
    }
});
// --- END DELETE MODAL ---
// --- START CLICK DELETE POST ---
function deletPostClicked(postObject){

    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post.id)
    document.getElementById("delete-post-id-input").value = post.id

    deletePostModal.classList.remove("hidden");
}
// --- END CLICK DELETE POST ---

// -- START CONFIRM DELETE POST --
function confirmPostDelete(){
    let postId = document.getElementById("delete-post-id-input").value
    
    const url= `${baseUrl}/posts/${postId}`
    const token = localStorage.getItem("token")
    const headers = {
        "authorization":`Bearer ${token}`
    }
    axios.delete(url,{
        headers:headers
    })
    .then((response)=>{
        getAllPosts()
        // Show success alert
        showAlert(
            "Post Deleted Successfuly",
            "Post Deleted Successfuly!",
            "success"
        );

    }).catch((error) => {
            showAlert(
                "Post Deleted Failed",
                "Post Deleted Failed",
                "error"
            );
        });
}
// -- END CONFIRM DELETE POST --
// === END DELETE POST ===



