var attempt = 3;
function validate() {
    var username = document.getElementById("adminUserId").value;
    var password = document.getElementById("adminPassword").value;
    if (username == "admin" && password == "admin") {
        return true;
    } else {
        attempt--;
        alert("You have left " + attempt + " attempt;");
        if (attempt == 0) {
            document.getElementById("adminUserId").disabled = true;
            document.getElementById("adminPassword").disabled = true;
            document.getElementById("login").disabled = true;
        }
        return false;
    }
}