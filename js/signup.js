let createUser = async function() {
    console.log("running create user")

    const url = "https://studybuddy-api.azurewebsites.net/user"

    const user = {
        "email": "jsneary7@eagles.bridgewater.edu",
        "username": "justus123",
        "school": "Bridgewater",
        "majors": [],
        "_id": "65ccdcb28d5bc75d3b5795b6"
    }

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    }

    let response = await fetch(url, options)

    if (response.status == 200) {

        console.log("User created")
    }
    else {

        console.log("request error")

    }
}