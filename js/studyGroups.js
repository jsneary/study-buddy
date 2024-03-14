let studyGroups = async function() {

    let url = "https://studybuddy-api.azurewebsites.net/studygroups"


    let search = document.getElementById('search').value
    let sortBy = document.getElementById('sortBy').value
    let desc = document.getElementById('desc').checked
    let onGoing = document.getElementById('onGoing').checked
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
    if (skip > 0) {
        url = url + "skip=" + skip + "&"
    }
    if (limit > 0) {
        url = url + "limit=" + limit + "&"
    }
    
    console.log(url)

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
                //editButton.onClick = "editModal()"
                //editButton.setAttribute("onclick", "editModal(" + res[i]._id + ")")
                //let id = "editModal(" + res[i]._id + ")"
                //editButton.setAttribute("onclick", id)
                console.log("ID: " + res[i]._id)
                let resID = res[i]._id
                editButton.addEventListener('click', function(){editModal(resID)}, false)
                editButton.setAttribute("class", res[i]._id)
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

let editModal = function(id) {
    localStorage.setItem('openModal', id)

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
    
    const studygroup = {
        "name": name,
        "school": school,

        "max_participants": maxParticipants,
        "start_date": startDate,
        "end_date": endDate,
        "description": description,
        "course_number": courseCode,
        /*"is_public": public,
        "meeting_times": meeting_times*/
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
}