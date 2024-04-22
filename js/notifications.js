let displayNotifications = async function() {
    let dropdownContent = document.getElementById('dropdownContent');
    console.log("Count: " + dropdownContent.childElementCount)

    if (dropdownContent.childElementCount > 0) {
        dropdownContent.style.display = 'none'
        dropdownContent.innerHTML = '';
        return;
    }

    let url = "https://studybuddy-api.azurewebsites.net/notifications";

    const token = localStorage.getItem("token");
    console.log("ID: " + localStorage.getItem('id'));
    const options = {
        method: "GET",
        headers: { 
            Authorization: `Bearer ${token}`,
        }
    }
    let response = await fetch(url, options);

    const res = await response.json();
    console.log("res:");
    console.log(res);
    console.log(res.notifications[0]);

    for (let i = 0; i < res.notifications.length; i++) {
        
        url = "https://studybuddy-api.azurewebsites.net/user/" + res.notifications[i].senderId;

        response = await fetch(url, options);
        //console.log(response.body)
        if (response.status == 200) {
            let userRes = await response.json();
            console.log(userRes.user.username);

            //<input type="button" value="Notification1" id='123' onclick="displayNotification()">
            let newNotification = document.createElement('input');
            newNotification.setAttribute('type', 'button')
            //let notificationText = "Notification from " + userRes.user.username
            let notificationText = res.notifications[i].subject
            newNotification.setAttribute('value', notificationText)
            newNotification.addEventListener('click', function(){openNotificationModal(res.notifications[i], userRes.user.username)}, false)
            dropdownContent.appendChild(newNotification);

        }
    }
    //document.getElementById('dropdownContent').classList.toggle("show");
    dropdownContent.style.display = 'block'
}
let closeNotificationModal = function() {
    //document.getElementById('modalNotification').innerHTML = ""
    let modalContainer = document.getElementById('notificationModalContainer')
    modalContainer.style.display = "none";
}
let openNotificationModal = function(notification, sender) {
    console.log("Notif modal")

    let notificationSender = document.getElementById('notificationSender')
    notificationSender.innerHTML = "Sender: " + sender
    notificationSender.style.padding = "0 0 20px 0"

    let notificationBody = document.getElementById('notificationBody')
    notificationBody.innerHTML = notification.body
    notificationBody.style.padding = "0 0 20px 0"

    let notificationSubject = document.getElementById('notificationSubject')
    notificationSubject.innerHTML = notification.subject
    notificationSubject.style.padding = "0 0 20px 0"

    let modalContainer = document.getElementById('notificationModalContainer')
    modalContainer.style.display = "block";

    //let sendButton = document.getElementById('sendMessage')
    //sendButton.addEventListener('click', function(){sendMessage(id)}, false)
}