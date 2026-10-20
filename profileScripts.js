const user = getCurrentUser()
console.log(user)
fillProfileDetails()
function fillProfileDetails() {
    const username = user.username
    const profileImage = user.profile_image
    const postsCount = user.posts_count
    const name = user.name
    const email = user.email
    const commentsCont = user.comments_count

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
}