let createUser = async function() {
    console.log("running create user")

    const url = "https://studybuddy-api.azurewebsites.net/user"

    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let school = document.getElementById('school').value
    let username = document.getElementById('username').value
    const user = {
        "name": name,
        "email": email,
        "password": password,
        "school": school,
        "email_verified": "false",
        "username": username
    }

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    }

    console.log("sending request")
    let response = await fetch(url, options)

    if (response.status == 201) {

        console.log("User created")

        setTimeout(() => {
            location.href = "login.html"
        }, 2000)
    }
    else {

        console.log("request error")
        console.log(response.status)
    }
}