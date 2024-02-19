function showSection(id) {
    var sections = document.getElementsByClassName('content');
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
    }
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

function validateSignupForm() {
    var username = document.forms["signupForm"]["username"].value;
    var password = document.forms["signupForm"]["password"].value;
    var role = document.forms["signupForm"]["role"].value;

    if (username == "" || password == "" || role == "") {
        alert("Username, Password and Role must be filled out");
        return false;
    }
}

function startMeeting(roomName, dispName) {
    const domain = 'meet.jit.si';
    const options = {
        roomName: roomName,
        width: '100%',
        height: '500px',
        parentNode: document.querySelector('#jitsi-meet-conf-container'),
        userInfo: {
            displayName: dispName
        },
        configOverwrite: {
            startWithVideoMuted: false,
            startWithAudioMuted: false
        },
        interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'closedcaptions', 
                'desktop', 'fullscreen', 
                'fodeviceselection', 'hangup',
                'profile', 'chat', 'recording',
                'livestreaming', 'etherpad', 'sharedvideo', 
                'settings', 'raisehand',
                'videoquality', 'filmstrip', 
                'invite', 'feedback', 'stats', 'shortcuts',
                'tileview', 'videobackgroundblur', 'download', 
                'help', 'mute-everyone', 'security'
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            INITIAL_TOOLBAR_TIMEOUT: 20000,
            TOOLBAR_TIMEOUT: 4000,
            TOOLBAR_ALWAYS_VISIBLE: false
        },
        onload: function () {
            console.log('Jitsi Meet API loaded');
        }
    };
    const apiObj = new JitsiMeetExternalAPI(domain, options);
}

function joinMeeting(roomName) {
    // The roomName should be provided by the doctor
    startMeeting(roomName, 'New User');
}
function selectDoctor() {
    // The selectedDoctor should be the doctor selected by the consumer
    var selectedDoctor = document.getElementById("doctorList").value;

    // Retrieve the roomName for the selected doctor from your server
    // This would require a server-side endpoint that returns the roomName for a given doctor
    fetch('/getRoomName?doctor=' + encodeURIComponent(selectedDoctor))
        .then(response => response.text())
        .then(roomName => {
            // Use the retrieved roomName to join the meeting
            joinMeeting(roomName);
        });
}


function createMeeting() {
    // Fetch the roomName for the logged in doctor from your server
    fetch('/getRoomName')
        .then(response => response.text())
        .then(roomName => {
            // Use the retrieved roomName to start the meeting
            startMeeting(roomName, 'Doctor');
        });
}


document.addEventListener('DOMContentLoaded', function() {
    // Check if the doctorList element exists on the page
    var doctorList = document.getElementById('doctorList');
    if (doctorList) {
        // Fetch the list of doctors from your server
        fetch('/getDoctors')
            .then(response => response.json())
            .then(doctors => {
                // Create an option element for each doctor
                for (var i = 0; i < doctors.length; i++) {
                    var option = document.createElement('option');
                    option.value = doctors[i];
                    option.text = doctors[i];
                    doctorList.appendChild(option);
                }
            });
    }
});

function updateDoctorList() {
    // Fetch the list of doctors from the server
    fetch('/getDoctors')
        .then(response => response.json())
        .then(doctors => {
            // Get the select element
            var doctorList = document.getElementById('doctorList');

            // Store the currently selected doctor
            var selectedDoctor = doctorList.value;

            // Remove all existing options
            while (doctorList.firstChild) {
                doctorList.removeChild(doctorList.firstChild);
            }

            // Add an option for each doctor
            for (var i = 0; i < doctors.length; i++) {
                var option = document.createElement('option');
                option.value = doctors[i];
                option.text = doctors[i];
                doctorList.appendChild(option);
            }

            // Restore the selected doctor
            doctorList.value = selectedDoctor;
        });
}

// Call updateDoctorList when the page loads
window.onload = updateDoctorList;

// Update the doctor list every 5 seconds
setInterval(updateDoctorList, 5000);

