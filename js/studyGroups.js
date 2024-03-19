let studyGroups = async function(URL) {
    
    let url = "https://studybuddy-api.azurewebsites.net/studygroups"

    if (URL == 'none') {
        let search = document.getElementById('search').value
        let sortBy = document.getElementById('sortBy').value
        let desc = document.getElementById('desc').checked
        let onGoing = document.getElementById('onGoing').checked
        let mine = document.getElementById('mine').checked
        let skip = document.getElementById('skip').value
        let limit = document.getElementById('limit').value
        console.log(skip)

        
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
    //console.log(token);
    const options = {
        method: "GET",
        headers: { 
            Authorization: `Bearer ${token}`
            /*"Content-Type": "application/json"*/
        }
        //body: JSON.stringify(studygroup)
    }

    console.log("sending request")
    let response = await fetch(url, options)

    if (response.status == 200) {

        const res = await response.json();
        console.log(res)
        let groups = document.getElementById('groups');

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
                console.log("ids match")
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

            console.log(res[i].name)
            console.log(res[i].owner)
            //groups.innerHTML = "<tr><td>name</td><td>school</td><td>course</td><td>description</td><td>start date</td><td>end date</td></tr>"
        }

        

        setTimeout(() => {
            //location.href = "main.html"
        }, 2000)
    }
    else {

        console.log("study group request error")
        console.log(response.status)
    }
}

let editModal = function(res) {
    console.log(res)
    localStorage.setItem('openModal', res._id)
    
    document.getElementById('name').value = res.name
    document.getElementById('maxParticipants').value = res.max_participants
    document.getElementById('startDate').value = res.start_date.split('T')[0]
    document.getElementById('endDate').value = res.end_date.split('T')[0]
    document.getElementById('description').value = res.description
    document.getElementById('school').value = res.school
    document.getElementById('courseCode').value = res.course_number
    

    for (i = 0; i < res.meeting_times.length; i++){
        let curMeeting = res.meeting_times[i]
        console.log(curMeeting)
        if(curMeeting.day == "Monday") {
            document.getElementById('monday').checked = true
            document.getElementById('timeM').value = curMeeting.time
            document.getElementById('locationM').value = curMeeting.location
        }
        if(curMeeting.day == "Tuesday") {
            console.log("day is tuesday")
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


    console.log("editModal")
    let modalContainer = document.getElementById('modalContainer')
    modalContainer.style.display = "block";
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
        "school": school,

        "max_participants": maxParticipants,
        "start_date": startDate,
        "end_date": endDate,
        "description": description,
        "course_number": courseCode,
        /*"is_public": public,*/
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