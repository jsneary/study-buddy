function closeInstaModal () {
    let modalContainer = document.getElementById('instaModalContainer')
    modalContainer.style.display = "none";
    let urlParse = window.location.href.split('/')
    if (urlParse[urlParse.length - 1] == "createStudyGroup.html") {
        console.log("Is equal")
        location.href = "studyGroups.html"
    }
}

let openInstaModal = async function() {
    //console.log("FUNCTION WORKS")
    //console.log(name)
    //console.log(id)
    document.getElementById('instaUsername').value = localStorage.getItem('ig_username')
    document.getElementById('instaPassword').value = localStorage.getItem('ig_password')
    

    let modalContainer = document.getElementById('instaModalContainer')
    modalContainer.style.display = "block";
}

let postInsta = async function(cap) {
    await saveInsta(false);
    console.log(cap)
    let url = "https://studybuddy-api.azurewebsites.net/user/insta-post"

    let caption
    if (cap == 'join') {
        caption = "I've just joined a study group on Study Buddy!"
    }
    else if (cap == 'create') {
        caption = "Come join the group I've created on Study Buddy!"
    }
    console.log(caption)
    body = {
        "image_url": "https://user-images.githubusercontent.com/22846441/133135927-a69e57cf-375d-481a-9609-8e084ac236f1.jpg",
        "caption": caption
    }
    console.log("ID: " + localStorage.getItem('id'))
    const token = localStorage.getItem("token")
    const options = {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    let response = await fetch(url, options)
    if (response.status == 201) {
        console.log("Posted successfully")
        /*if (urlParse[urlParse.length - 1] == "createStudyGroup.html") {
            console.log("Is equal")
            location.href = "studyGroups.html"
        }*/
    }
    else {
        console.log(response.status)
        console.log("failed to post")
    }
    closeInstaModal()
}
let saveInsta = async function(close) {
    let url = "https://studybuddy-api.azurewebsites.net/user/insta"
    let username = document.getElementById('instaUsername').value
    let password = document.getElementById('instaPassword').value
    console.log(username + ", " + password)

    localStorage.setItem('ig_username', username)
    localStorage.setItem('ig_password', password)

    body = {
        "ig_username": username,
        "ig_password": password
    }
    console.log("ID: " + localStorage.getItem('id'))
    const token = localStorage.getItem("token")
    const options = {
        method: "PATCH",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    let response = await fetch(url, options)
    if (response.status == 200) {
        console.log("Updated login info")
        if (close) {
            closeInstaModal();
        }
        //location.href = "studyGroups.html"
        /*let urlParse = window.location.href.split('/')
        if (urlParse[urlParse.length - 1] == "createStudyGroup.html") {
            console.log("Is equal")
            location.href = "studyGroups.html"
        }*/
    }
    else {
        console.log(response.status)
        console.log("failed to update login info")
    }
}


