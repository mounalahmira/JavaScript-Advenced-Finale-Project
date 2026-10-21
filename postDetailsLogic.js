 const urlParams = new URLSearchParams(window.location.search)
const postId = urlParams.get("postId")
console.log(postId)


    getPost()
    // --START GET ALL POSTS--
    function getPost(){
        toggleLoader(true)
        const url= `${baseUrl}/posts/${postId}`
        axios.get(url)
        .then((response)=>{
            let post = response.data.data
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
            
            let commentsContent =``
            for(comment of post.comments){
                let commentBody = comment.body
                let userCommented = comment.author.username
                let userCommentedImage = comment.author.profile_image
                commentsContent += 
                `
                    <div class="comment flex-col bg-indigo-100 rounded-lg px-3 py-1 my-2 text-gray-600 border-1 border-gray-500-200">
                        <div class="flex items-center ">
                            <div class="profil-pic w-10 h-10  rounded-full overflow-hidden">
                                <img src="${userCommentedImage}" alt="" class="w-full h-full object-center object-cover">
                            </div>
                            <p class="text-sm ml-2">${userCommented}</p>
                        </div>
                        <p class="text-gray-800">${commentBody}</p>
                    </div>
                `
            }
            const content =
            `
                
                <h1 class=" w-3/6 mx-auto mt-6 text-2xl rounded-t-2xl p-3 bg-indigo-100"><b><span>${userName}'s</span> Post</b></h1>
                <div class=" w-8/10 h-fit mx-auto ">
                    <div id="post" class="post w-2/3 border-1 border-indigo-800 mx-auto mb-10  rounded-xl shadow-indigo-200 shadow-xl px-10 " >
                            <div class="user flex justify-start items-center py-2 gap-2">
                                <div class="profil-pic w-14 h-14 rounded-full overflow-hidden">
                                    <img src="${profileImage}" alt="" class="w-full h-full object-center object-cover">
                                </div>
                                <p class="user-name text-xl">${userName}</p>
                            </div>
                            <hr class=" mb-2 border-gray-300 ">
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
                            <div class="flex items-center mb-2 rounded-lg bg-gray-100 border-1 border-indigo-700">
                                <textarea name="comment" id="comment-body" class="w-full rounded-lg p-2 resize-none focus:outline-none focus:ring-0" placeholder="Leave a comment" rows="1"></textarea>
                                <button onclick="addComment()" class="w-12 h-13 rounded-r-lg bg-indigo-500 cursor-pointer"><i class="fa-solid fa-paper-plane" style="color: white;"></i></button>
                            </div>
                            <div id="comments">
                                ${commentsContent}
                            </div>
                        </div>
                    </div>
                
    
            `
            document.getElementById("post").innerHTML = ""
            document.getElementById("post").innerHTML += content

            const currentPostTagsId = `post-tags-${post.id}`
            document.getElementById(currentPostTagsId).innerHTML = ""
            for(tag of post.tags){
                console.log(tag.name)
                let tagsContent = `
                <span class=" bg-gray-200 rounded-2xl px-3 py-1 text-gray-600">${tag.name}</span>
                `
                document.getElementById(currentPostTagsId).innerHTML += tagsContent
            }


        }).catch((error) => {
            console.error(error);
        })
        .finally(() => {
            toggleLoader(false)
        });
    }
        function addComment(){
        const commentBody = document.getElementById("comment-body").value

        let params = {
            "body" : commentBody
        }
        console.log(commentBody)
        const token = localStorage.getItem("token")
        const headers = {
            "authorization":`Bearer ${token}`
        }

        const url= `${baseUrl}/posts/${postId}/comments`
        toggleLoader(true)
        axios.post(url,params,{
            headers:headers
        })
        .then((response)=>{
            toggleLoader(true)
            getPost()
            showAlert(
                "Comment added successfuly!",
                "Your Comment Has Been Created",
                "success"
            );

            })
            .catch((error) => {
                const message = error.response.data.message
                showAlert(
                    "Failed to add the comment",
                    message,
                    "error"
                );
            });
    }