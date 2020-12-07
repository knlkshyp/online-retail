function add(evt, operation) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(operation).style.display = "block";
  evt.currentTarget.className += " active";
}

document.getElementById("default").click();

function confirmPassword() {
  let password = document.getElementById("adminPassword").value;
  let confirmPassword = document.getElementById("adminConfirmPassword").value;
  if(confirmPassword==password) {
    return;
  } else {
    alert("Password doesn't match");
  }
}