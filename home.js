getAllPosts()

// --START GET ALL POSTS--
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

    
    let content = 
        `
            <div id="post" class="post w-2/3 border-1 border-indigo-800 mx-auto my-10 rounded-2xl shadow-indigo-200 shadow-xl px-10 " >
                <div class="user flex justify-start items-center py-2 gap-2">
                    <div class="profil-pic w-14 h-14 rounded-full overflow-hidden">
                        <img src="${profileImage}" alt="" class="w-full h-full object-center object-cover">
                    </div>
                    <p class="user-name text-xl">${userName}</p>
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
// -- END GET ALL POSTS--

// --START MODEL AND ALERT---
const addPostButton = document.querySelector("#add-post-btn");
const closePostModal = document.querySelector("#close-post-modal");

const addPostModel = document.querySelector("#add-post-modal");
const addPostContent = document.querySelector("#add-post-content");

// Open the modal Deaktop
addPostButton.addEventListener("click", () => {
    addPostModel.classList.remove("hidden");
});


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
// --START ADD POST--
function addPost(){
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

    const url= `${baseUrl}/posts`

    axios.post(url,formData,{
        headers:headers
    })
    .then((response)=>{

        // Close the login Modal
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
}
// -- END ADD POST --

// -- START POST CLICKED -- 
function postClicked(postId){
    window.location = `postDetails.html?postId=${postId}`
    // alert(postId)
}
// -- END POST CLICKED --