getAllPosts()

// ===== START GET ALL POSTS =====
function getAllPosts(reload = true,page = 1){
    const url= `${baseUrl}/posts?limit=2&page=${page}`
    axios.get(url)
    .then((response)=>{
        let data = response.data.data
        lastPage = response.data.meta.last_page
        if(reload){
            document.getElementById("posts").innerHTML = ""
        }
        for(let post of data){
            fillPost(post)
        }
    }).catch((error) => {
        console.error(error);
    })
    .finally(() => {
        console.log("Request completed");
    });
}
// -- START FILL POST --
function fillPost(post){
    let userName = post.author.username
    let profileImage = post.author.profile_image
    let image = post.image
    let title =""
    if (post.title != null) {
        title = post.title
    }
    let body = post.body
    let commentsCount = post.comments_count
    let createdAt = post.created_at

    
    // show or hide (edit) button
    let user = getCurrentUser()
    let isMyPost = user != null && user.id == post.author.id 
    let editBtnContent = ``
  
    if(isMyPost){
        editBtnContent = `
            <div class="flex justify-center items-center  gap-2" >  
                <i id="edit-post-btn" class="fa-solid fa-ellipsis text-2xl cursor-pointer text-gray-700" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"></i>
                <i class="fa-solid fa-trash text-xl cursor-pointer text-gray-700" onclick="deletPostClicked('${encodeURIComponent(JSON.stringify(post))}')"></i> 
            </div>
        `
    }
    let content = 
        `
            <div id="post" class="post w-2/3 border-1 border-indigo-800 mx-auto my-10 rounded-2xl shadow-indigo-200 shadow-xl px-10 " >
                <div onclick="userClicked(${post.author.id})" class="flex justify-between items-center ">
                    <div on class="flex justify-start items-center cursor-pointer  py-2 gap-2">
                        <div class="profil-pic w-14 h-14 rounded-full overflow-hidden">
                            <img src="${profileImage}" alt="" class="w-full h-full object-center object-cover">
                        </div>
                        <p class="user-name text-xl">${userName}</p>   
                    </div>
                    ${editBtnContent}
                </div>
                
                <hr class=" mb-2 border-gray-300 ">
                <div class="card-body  cursor-pointer" onclick="postClicked(${post.id})">
                    <div class=" w-full h-80 ">
                        <img src="${image}" alt="" class="w-full h-full object-center object-cover" >
                    </div>
                    <p class="text-sm text-gray-500">${createdAt}</p>
                    <div class="text-content">
                        <h1 class="titel text-2xl">${title}</h1>
                        <p overflow-auto>${body}</p>
                    </div>
                    <hr class=" my-1 border-gray-300 ">
                    <div class="comments flex items-center my-4 gap-2  ">
                        <i class="fa-solid fa-pen"></i>
                        <p>(${commentsCount}) Comments
                            <span id="post-tags-${post.id}"> 
                                <span class=" bg-gray-200 rounded-2xl px-3 py-1 text-gray-600">Policy</span>
                                <span class=" bg-gray-200 rounded-2xl px-3 py-1 text-gray-600">Policy</span>
                                <span class=" bg-gray-200 rounded-2xl px-3 py-1 text-gray-600">Policy</span>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        `;
    document.getElementById("posts").innerHTML += content

    const currentPostTagsId = `post-tags-${post.id}`
    document.getElementById(currentPostTagsId).innerHTML = ""
    for(tag of post.tags){
        console.log(tag.name)
        let tagsContent = `
        <span class=" bg-gray-200 rounded-2xl px-3 py-1 text-gray-600">${tag.name}</span>
        `
        document.getElementById(currentPostTagsId).innerHTML += tagsContent
    }
    
}
// -- START FILL POST --
// ===== END GET ALL POSTS =====

// ===== START CREAT POST MODEL =====
const closePostModal = document.querySelector("#close-post-modal");
const addPostModel = document.querySelector("#add-post-modal");
const addPostContent = document.querySelector("#add-post-content");

// Close the modal using the X button
closePostModal.addEventListener("click", () => {
    addPostModel.classList.add("hidden");
});

// Close when clicking outside the form
addPostModel.addEventListener("click", (event) => {
    if (!addPostContent.contains(event.target)) {
        addPostModel.classList.add("hidden");
    }
});

// Close when pressing Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        addPostModel.classList.add("hidden");
    }
});
// ===== END CREAT POST MODEL =====

// === START CREAT POST ===
function createNewPost(){
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == ""
    
    const title =  document.getElementById("post-title").value
    const body = document.getElementById("post-body").value
    const image = document.getElementById("post-image").files[0]

    let formData = new FormData()
    formData.append("title",title)
    formData.append("body",body)
    formData.append("image",image)

    const token = localStorage.getItem("token")
    const headers = {
        "authorization":`Bearer ${token}`
    }
    let url = ""
    if (isCreate) {
        url= `${baseUrl}/posts`
        axios.post(url,formData,{
        headers:headers
    })
    .then((response)=>{
        addPostModel.classList.add("hidden");
        getAllPosts()
        // Show success alert
        showAlert(
            "Post added successfuly!",
            "New Post Has Been Created",
            "success"
        );

        })
        .catch((error) => {
            const message = error.response.data.message
            showAlert(
                "Failed to add the post",
                message,
                "error"
            );
        });
    }else{
        formData.append("_method","put")
        url= `${baseUrl}/posts/${postId}`
        axios.post(url,formData,{
            headers:headers
        })
        .then((response)=>{

            // Close the login Modal
            addPostModel.classList.add("hidden");
            getAllPosts()
            // Show success alert
            showAlert(
                "Post edited successfuly!",
                "Your Post Has Been Edited",
                "success"
            );

            })
            .catch((error) => {
                const message = error.response.data.message
                showAlert(
                    "Failed to add the post",
                    message,
                    "error"
                );
            }
    );
    } 
}
// === END CREAT POST ===

// === START EDIT POST ===
function editPostBtnClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))
    
    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-title").value = post.title
    document.getElementById("post-body").value = post.body
    document.getElementById("add-edit-post-btn").innerHTML = "Edit"
    // Open the modal Deaktop
    addPostModel.classList.remove("hidden");
}
// === END EDIT POST ===

// === START CREAT BTN POST ===
function addBtnClicked(){
    document.getElementById("post-id-input").value = ""
    document.getElementById("post-modal-title").innerHTML = "Add Post"
    document.getElementById("post-title").value = ""
    document.getElementById("post-body").value = ""
    document.getElementById("add-edit-post-btn").innerHTML = "Add"
    // Open the modal Deaktop
    addPostModel.classList.remove("hidden");
}
// === START CREAT BTN POST ===

