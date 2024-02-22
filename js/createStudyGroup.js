let createStudyGroup = async function() {

    const url = "https://studybuddy-api.azurewebsites.net/studygroup"

    let name = document.getElementById('name').value
    let maxParticipants = document.getElementById('maxParticipants').value
    let startDate = document.getElementById('startDate').value
    let endDate = document.getElementById('endDate').value
    let public = document.getElementById('public').checked
    console.log(public)
    let meeting_times = []

    if (document.getElementById('monday').checked) {
        meeting_times.push({
            "day": "Monday",
            "time": document.getElementById('timeM').value,
            "location": document.getElementById('locationM').value
        })
        console.log(meeting_times[0])
    }
    if (document.getElementById('tuesday').checked) {
        meeting_times.push({
            "day": "Tuesday",
            "time": document.getElementById('timeTU').value,
            "location": document.getElementById('locationTU').value
        })
    }
    if (document.getElementById('wednesday').checked) {
        meeting_times.push({
            "day": "Wednesday",
            "time": document.getElementById('timeW').value,
            "location": document.getElementById('locationW').value
        })
    }
    if (document.getElementById('thursday').checked) {
        meeting_times.push({
            "day": "Thursday",
            "time": document.getElementById('timeTH').value,
            "location": document.getElementById('locationTH').value
        })
    }
    if (document.getElementById('friday').checked) {
        meeting_times.push({
            "day": "Friday",
            "time": document.getElementById('timeF').value,
            "location": document.getElementById('locationF').value
        })
    }
    if (document.getElementById('saturday').checked) {
        meeting_times.push({
            "day": "Saturday",
            "time": document.getElementById('timeSA').value,
            "location": document.getElementById('locationSA').value
        })
    }
    if (document.getElementById('sunday').checked) {
        meeting_times.push({
            "day": "Sunday",
            "time": document.getElementById('timeSU').value,
            "location": document.getElementById('locationSU').value
        })
    }

    const studygroup = {
        "name": name,
        "is_public": public,
        "max_participants": maxParticipants,
        "start_date": startDate,
        "end_date": endDate,
        "meeting_times": meeting_times
    }
    /*const studygroup = {
        "name":"TEST",
        "is_public": "true",
        "max_participants": "10",
        /*"meeting_times": [{
            "day":"Monday",
            "time":"10:10",
            "location":"Bowman" 
        }]
        "meeting_times": meeting_times

    }*/

    console.log(studygroup)

    const token = localStorage.getItem("token")
    console.log(token);
    const options = {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(studygroup)
    }

    console.log("sending request")
    let response = await fetch(url, options)

    if (response.status == 201) {

        console.log("Study Group Created")
        console.log(response)


        setTimeout(() => {
            location.href = "main.html"
        }, 2000)
    }
    else {

        console.log("request error")
        console.log(response.status)
    }
}