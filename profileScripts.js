function getClickedUserId(){
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get("userId")
    return userId
}

fillProfileDetails()
function fillProfileDetails() {
    let userId = getClickedUserId()
    const url= `${baseUrl}/users/${userId}`
    axios.get(url)
    .then((response)=>{
        const user = response.data.data
        const username = user.username
        const profileImage = user.profile_image
        const postsCount = user.posts_count
        const name = user.name
        const email = user.email
        const commentsCont = user.comments_count
        document.getElementById("profile-details").innerHTML = ""
        let profileContent = `
            <div class="flex items-center w-5/10">
                <img src="${profileImage}" class="w-40 h-40 rounded-full" alt="">
                <div class="ml-3 text-gray-600 text-2xl flex gap-3 flex-col">
                    <p>${username}</p>
                    <p>${name}</p>    
                    <p>${email}</p>    
                </div>
            </div>

            <div class="w-3/10 text-gray-500">
                <p><span class="text-6xl text-gray-900">${postsCount}</span> Posts </p>
                <p><span class="text-6xl text-gray-900">${commentsCont}</span> Comments </p>    
            </div>
        `
        document.getElementById("profile-details").innerHTML = profileContent
    })  
    
}

getAllPosts()
// // --START GET ALL POSTS--
function getAllPosts(){
    let userId = getClickedUserId()
    const url= `${baseUrl}/users/${userId}/posts`
    axios.get(url)
    .then((response)=>{
        let data = response.data.data
        fillProfileDetails()
        document.getElementById("posts").innerHTML = ""
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
                <div class="flex justify-between items-center ">
                    <div class="flex justify-start items-center py-2 gap-2">
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
// -- END GET ALL POSTS--

