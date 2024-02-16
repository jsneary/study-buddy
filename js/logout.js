let logoutUser = async function() {
    console.log("running logout user")

    const url = "https://studybuddy-api.azurewebsites.net/user/logout"

    /*const user = {
        "email": "jsneary4@eagles.bridgewater.edu",
        "password": "test12345"
    }*/

    const token = localStorage.getItem("token")
    console.log(token);
    const options = {
        method: "PATCH",
        headers: { 
            Authorization: `Bearer ${token}`
            //"Content-Type": "application/json"
        },
        //body: JSON.stringify(user)
    }

    console.log("sending request")
    let response = await fetch(url, options)

    /*const params = (new URL(document.location)).searchParams;
    const token = params.get("token")
    console.log(params)*/

    if (response.status == 200) {

        console.log("User logged out")
        console.log(response)


        setTimeout(() => {
            location.href = "index.html"
        }, 2000)
    }
    else {

        console.log("request error")
        console.log(response.status)
    }
}