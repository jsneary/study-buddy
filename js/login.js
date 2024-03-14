let loginUser = async function() {
    console.log("running login user")

    const url = "https://studybuddy-api.azurewebsites.net/user/login"

    let email = document.getElementById('email').value
    let password = document.getElementById('password').value

    const user = {
        "email": email,
        "password": password
    }

    const options = {
        method: "POST",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }

    console.log("sending request")
    let response = await fetch(url, options)

    /*const params = (new URL(document.location)).searchParams;
    const token = params.get("token")
    console.log(params)*/

    if (response.status == 200) {

        console.log("User logged in")
        const res = await response.json();
        const token = res.token
        console.log(token);
        localStorage.setItem("token", token);
        localStorage.setItem("id", res.user._id)

        setTimeout(() => {
            location.href = "main.html"
        }, 2000)
    }
    else {

        console.log("request error")
        console.log(response.status)
    }
}