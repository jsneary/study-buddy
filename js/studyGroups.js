let studyGroups = async function(URL) {
    
    let url = "https://studybuddy-api.azurewebsites.net/studygroups"

    if (URL == 'none') {
        let search = document.getElementById('search').value
        let sortBy = document.getElementById('sortBy').value
        let desc = document.getElementById('desc').checked
        let onGoing = document.getElementById('onGoing').checked
        let mine = document.getElementById('mine').checked
        let joined = document.getElementById('joined').checked
        let skip = document.getElementById('skip').value
        let limit = document.getElementById('limit').value
        
        if (search.length > 0) {
            url = url + "?search=" + search + "&"
        }
        else {
            url = url + "?"
        }
        if (desc) {
            url = url + "sortBy=" + sortBy + ":desc&"
        }
        else {
            url = url + "sortBy=" + sortBy + ":asc&"
        }
        if (onGoing) {
            url = url + "ongoing=true&"
        }
        if (mine) {
            url = url + "mine=true&"
        }
        if (joined) {
            url = url + "member=true&"
        }
        if (skip > 0) {
            url = url + "skip=" + skip + "&"
        }
        if (limit > 0) {
            url = url + "limit=" + limit + "&"
        }
        
        localStorage.setItem('url', url)
        console.log(url)
    }   
    else {
        url = URL;
    }
    const token = localStorage.getItem("token")
    const options = {
        method: "GET",
        headers: { 
            Authorization: `Bearer ${token}`
            /*"Content-Type": "application/json"*/
        }
    }
    let response = await fetch(url, options)

    if (response.status == 200) {

        const res = await response.json();
        //console.log(res)

        document.querySelectorAll('.searchResults').forEach(e => e.remove());
        let table = document.getElementById('table')


        for (i = 0; i < res.length; i++) {
            
            let nextRow = document.createElement('tr')
            let nextCol = document.createElement('td')
            table.appendChild(nextRow)
            nextRow.classList.add("searchResults")
            

            if (localStorage.getItem('id') == res[i].owner) {
                let editButton = document.createElement('input')
                editButton.type = "button"
                editButton.value = res[i].name
                //editButton.style.margin = "0 auto 0 auto"
                editButton.id = "editButton"
                
                /*console.log("ID: " + res[i]._id)
                let resID = res[i]._id
                editButton.addEventListener('click', function(){editModal(resID)}, false)*/
                let curRes = res[i]
                editButton.setAttribute("class", res[i]._id)
                editButton.addEventListener('click', function(){editModal(curRes)}, false)
                nextCol.appendChild(editButton)
                
            }
            else {
                nextCol.innerHTML = res[i].name
            }
            nextCol.style.textAlign = "center"
            nextRow.appendChild(nextCol)

            nextCol = document.createElement('td')
            nextCol.innerHTML = res[i].school
            nextCol.style.textAlign = "center"
            nextRow.appendChild(nextCol)

            nextCol = document.createElement('td')
            nextCol.innerHTML = res[i].course_number
            nextCol.style.textAlign = "center"
            nextRow.appendChild(nextCol)

            nextCol = document.createElement('td')
            nextCol.innerHTML = res[i].description
            nextRow.appendChild(nextCol)

            nextCol = document.createElement('td')
            nextCol.innerHTML = res[i].start_date.split('T')[0]
            nextCol.style.textAlign = "center"
            nextRow.appendChild(nextCol)

            nextCol = document.createElement('td')
            nextCol.innerHTML = res[i].end_date.split('T')[0]
            nextCol.style.textAlign = "center"
            nextRow.appendChild(nextCol)


            nextCol = document.createElement('td')
            //nextCol.innerHTML = res[i].participants.length + "/" + res[i].max_participants
            let participantText = res[i].participants.length + "/" + res[i].max_participants
            nextCol.style.textAlign = "center"

            let participantButton = document.createElement('input')
            participantButton.setAttribute('value', participantText)
            participantButton.setAttribute('type', 'button')
            //participantButton.setAttribute('id', 'participantButton')
            participantButton.setAttribute('class', 'button')
            let curRes = res[i]
            participantButton.addEventListener('click', function(){participantModal(curRes)}, false)
            nextCol.appendChild(participantButton)
            nextRow.appendChild(nextCol)


            nextCol = document.createElement('td')
            if (localStorage.getItem('id') != res[i].owner) {
                //console.log("ID: " + localStorage.getItem('id'))
                //console.log(res[i].participants + " & " + localStorage.getItem('id'))
                
                
                joinButton = document.createElement('input')
                joinButton.setAttribute("id", res[i]._id)   
                joinButton.setAttribute("type", "button")
                //let curRes = res[i]
                if(res[i].participants.indexOf(localStorage.getItem('id')) == -1) {
                    joinButton.setAttribute("value", "Join")
                    joinButton.addEventListener('click', function(){join(curRes._id, true)}, false)
                }
                else {
                    //console.log("in group")
                    joinButton.setAttribute("value", "Leave")
                    joinButton.addEventListener('click', function(){join(curRes._id, false)}, false)
                }
                
                joinButton.setAttribute("class", "joinButton")
                
                
                nextCol.appendChild(joinButton)
            }
            nextCol.style.textAlign = "center"
            
            nextRow.appendChild(nextCol)
        }        

        setTimeout(() => {
            //location.href = "main.html"
        }, 2000)
    }
    else {
        console.log("study group request error")
    }
}

let editModal = async function(res) {
    //console.log(res)
    localStorage.setItem('openModal', res._id)
    
    document.getElementById('name').value = res.name
    document.getElementById('maxParticipants').value = res.max_participants
    document.getElementById('startDate').value = res.start_date.split('T')[0]
    document.getElementById('endDate').value = res.end_date.split('T')[0]
    document.getElementById('description').value = res.description
    document.getElementById('school').value = res.school
    document.getElementById('courseCode').value = res.course_number
    document.getElementById('public').checked = res.is_public

    let participantNames = ""
    let names = []
    const token = localStorage.getItem("token")
    const options = {
        method: "GET",
        headers: { 
            Authorization: `Bearer ${token}`
        }
    }
    for (let i = 0; i < res.participants.length; i++) {
        
        let participantURL = "https://studybuddy-api.azurewebsites.net/user/" + res.participants[i]

        let response = await fetch(participantURL, options)
        //console.log(response.body)
        if (response.status == 200) {

            const user = await response.json();

            names.push(user.user.username)
            if (i < res.participants.length - 1) {
                participantNames = participantNames + user.user.username + ", "
            }
            else {
                participantNames = participantNames + user.user.username
            }




            
            let nameContainer = document.createElement('div')
            nameContainer.setAttribute('id', res.participants[i])
            nameContainer.setAttribute('class', 'removeUser')
            document.getElementById('participants').appendChild(nameContainer)
            nameContainer.innerHTML = user.user.username + "&nbsp"
            
            //let newName = document.createElement('div')
            //newName.innerHTML = user.user.username
            
            let newButton = document.createElement('input')
            newButton.setAttribute('type', 'button')
            newButton.setAttribute('value', 'Remove')
            newButton.setAttribute('class', 'removeButton')
            newButton.addEventListener('click', function(){removeUser(res.participants[i])}, false)
            
            //nameContainer.appendChild(newName)
            nameContainer.appendChild(newButton)
        }
        else {
            console.log("error getting user")
        }
    }
    //document.getElementById('participants').innerHTML = participantNames

    for (i = 0; i < res.meeting_times.length; i++){
        let curMeeting = res.meeting_times[i]
        if(curMeeting.day == "Monday") {
            document.getElementById('monday').checked = true
            document.getElementById('timeM').value = curMeeting.time
            document.getElementById('locationM').value = curMeeting.location
        }
        if(curMeeting.day == "Tuesday") {
            document.getElementById('tuesday').checked = true
            document.getElementById('timeTU').value = curMeeting.time
            document.getElementById('locationTU').value = curMeeting.location
        }
        if(curMeeting.day == "Wednesday") {
            document.getElementById('wednesday').checked = true
            document.getElementById('timeW').value = curMeeting.time
            document.getElementById('locationW').value = curMeeting.location
        }
        if(curMeeting.day == "Thursday") {
            document.getElementById('thursday').checked = true
            document.getElementById('timeTH').value = curMeeting.time
            document.getElementById('locationTH').value = curMeeting.location
        }
        if(curMeeting.day == "Friday") {
            document.getElementById('friday').checked = true
            document.getElementById('timeF').value = curMeeting.time
            document.getElementById('locationF').value = curMeeting.location
        }
        if(curMeeting.day == "Saturday") {
            document.getElementById('saturday').checked = true
            document.getElementById('timeSA').value = curMeeting.time
            document.getElementById('locationSA').value = curMeeting.location
        }
        if(curMeeting.day == "Sunday") {
            document.getElementById('sunday').checked = true
            document.getElementById('timeSU').value = curMeeting.time
            document.getElementById('locationSU').value = curMeeting.location
        }
    }

    let modalContainer = document.getElementById('modalContainer')
    modalContainer.style.display = "block";
}

let participantModal = async function(res) {

    //console.log("WORKING")
    localStorage.setItem('openModal', res._id)
    console.log(res)

    let participantNames = ""
    let names = []
    const token = localStorage.getItem("token")
    const options = {
        method: "GET",
        headers: { 
            Authorization: `Bearer ${token}`
        }
    }



    let participantURL = "https://studybuddy-api.azurewebsites.net/user/" + res.owner

    let response = await fetch(participantURL, options)

    const owner = await response.json();

    console.log(owner)

    let nameContainer = document.createElement('div')
    if (res.participants == 0) {
        document.getElementById('modalParticipants').appendChild(nameContainer)
        nameContainer.innerHTML = "Owner: " + owner.user.username
    }
    else {
        document.getElementById('modalParticipants').appendChild(nameContainer)
        //nameContainer.innerHTML = "Owner: " + owner.user.username + ","
        nameContainer.innerHTML = "Owner: " + owner.user.username 
    }
    
    console.log("Owner: " + owner.user.username)

    //document.getElementById('modalParticipants').appendChild(nameContainer)
    //nameContainer.innerHTML = user.user.username + "&nbsp"



    console.log("participants: " + participantNames)

    for (let i = 0; i < res.participants.length; i++) {
        
        participantURL = "https://studybuddy-api.azurewebsites.net/user/" + res.participants[i]

        response = await fetch(participantURL, options)
        //console.log(response.body)
        if (response.status == 200) {

            const user = await response.json();
            console.log("User:")
            console.log(user.user)
            names.push(user.user.username)

            console.log("Participant names: " + participantNames)
            if (i < res.participants.length - 1) {
                participantNames = participantNames + user.user.username + ", "
            }
            else {
                participantNames = participantNames + user.user.username
            }

            console.log("Participant names: " + participantNames)
            nameContainer = document.createElement('div')
            document.getElementById('modalParticipants').appendChild(nameContainer)
            nameContainer.innerHTML = user.user.username + "&nbsp"


        }
        else {
            console.log("error getting user")
        }
    }

    let modalContainer = document.getElementById('participantModalContainer')
    modalContainer.style.display = "block";
}
let closeParticipantModal = function() {
    //console.log("close participant")
    document.getElementById('modalParticipants').innerHTML = ""
    let modalContainer = document.getElementById('participantModalContainer')
    modalContainer.style.display = "none";
}

let save = async function() {

    let url = "https://studybuddy-api.azurewebsites.net/studygroup/" + localStorage.getItem('openModal')
    console.log(url)

    let name = document.getElementById('name').value
    let maxParticipants = document.getElementById('maxParticipants').value
    let startDate = document.getElementById('startDate').value
    let endDate = document.getElementById('endDate').value
    let description = document.getElementById('description').value
    let school = document.getElementById('school').value
    let courseCode = document.getElementById('courseCode').value
    let public = document.getElementById('public').checked
    let meeting_times = []

    if (document.getElementById('monday').checked) {
        meeting_times.push({
            "day": "Monday",
            "time": document.getElementById('timeM').value,
            "location": document.getElementById('locationM').value
        })
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
        "school": school,
        "max_participants": maxParticipants,
        "start_date": startDate,
        "end_date": endDate,
        "description": description,
        "course_number": courseCode,
        "is_public": public,
        "meeting_times": meeting_times
    }
    const token = localStorage.getItem("token")
    const options = {
        method: "PATCH",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(studygroup)
    }

    console.log("sending patch request")
    let response = await fetch(url, options)

    if (response.status == 200) {
        console.log("Study Group Patched")
        console.log(response)
    }
    else {
        console.log("request error")
        console.log(response.status)
    }
    modalContainer.style.display = "none";
    studyGroups(localStorage.getItem('url'))
    //location.reload()
}

let del = async function() {
    if (confirm("Are you sure you want to delete this group?")) {
        let url = "https://studybuddy-api.azurewebsites.net/studygroup/" + localStorage.getItem('openModal')
        const token = localStorage.getItem("token")
        const options = {
            method: "DELETE",
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }

        console.log("sending delete request")
        let response = await fetch(url, options)

        if (response.status == 200) {
            console.log("Study Group Deleted")
            console.log(response)
        }
        else {
            console.log("request error")
            console.log(response.status)
        }
        modalContainer.style.display = "none";
        studyGroups(localStorage.getItem('url'))
    }
}

let join = async function(id, join) {
    let url
    if (join) {
        url = "https://studybuddy-api.azurewebsites.net/studygroup/" + id + "/participants?add"
    }
    else {
        url = "https://studybuddy-api.azurewebsites.net/studygroup/" + id + "/participants?remove"
    }
    
    const token = localStorage.getItem("token")
    body = {
        "participants": localStorage.getItem('id')
    }
    console.log("ID: " + localStorage.getItem('id'))
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
        console.log("Study Group Patched")
        console.log(response)
        if (join) {
            document.getElementById(id).setAttribute("value", "Leave")
            console.log(id)
            console.log(document.getElementById(id))
        }
        else {
            document.getElementById(id).setAttribute("value", "Join")
            console.log(id)
            console.log(document.getElementById(id))
        }
    }
    else {
        console.log("request error")
        console.log(response.status)
    }
    studyGroups(localStorage.getItem('url'))
}
let removeUser = async function(id) {
    console.log("REMOVE USER")

    console.log("OPEN MODAL:")
    console.log(localStorage.getItem('openModal'))
    let studyGroupID = localStorage.getItem('openModal')

    let url = "https://studybuddy-api.azurewebsites.net/studygroup/" + studyGroupID + "/participants?remove"
    
    
    const token = localStorage.getItem("token")
    body = {
        "participants": id
    }

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
        console.log("Study Group Patched")
        console.log(response)

        document.getElementById(id).remove()
        
    }
    else {
        console.log("request error")
        console.log(response.status)
    }















    /*const studygroup = {
        "name": name,
        "school": school,
        "max_participants": maxParticipants,
        "start_date": startDate,
        "end_date": endDate,
        "description": description,
        "course_number": courseCode,
        "is_public": public,
        "meeting_times": meeting_times
    }
    const token = localStorage.getItem("token")
    const options = {
        method: "PATCH",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(studygroup)
    }

    console.log("sending patch request")
    let response = await fetch(url, options)

    if (response.status == 200) {
        console.log("Study Group Patched")
        console.log(response)
    }
    else {
        console.log("request error")
        console.log(response.status)
    }*/
}