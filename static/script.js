function showSection(id) {
    var sections = document.getElementsByClassName('content');
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
    }
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);

    if (id === 'video') {
        StartMeeting('newRoom_' + (new Date()).getTime(), 'New User');
    }
}

function validateForm() {
    var username = document.forms["loginForm"]["username"].value;
    var password = document.forms["loginForm"]["password"].value;

    if (username == "" || password == "") {
        alert("Username and Password must be filled out");
        return false;
    }
}

function StartMeeting(roomName, dispNme) {
    const domain = 'meet.jit.si';
    const options = {
        roomName: roomName,
        width: '100%',
        height: '500px',
        parentNode: document.querySelector('#jitsi-meet-conf-container'),
        userInfo: {
            displayName: dispNme
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
