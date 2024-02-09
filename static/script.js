function showSection(id) {
    var sections = document.getElementsByClassName('content');
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
    }
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}
function validateForm() {
    var username = document.forms["loginForm"]["username"].value;
    var password = document.forms["loginForm"]["password"].value;

    if (username == "" || password == "") {
        alert("Username and Password must be filled out");
        return false;
    }
}
