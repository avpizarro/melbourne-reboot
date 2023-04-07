// saves the users login details and hides the form

var saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", function(e){
    e.preventDefault();
    var userName = document.getElementById("user_name").value;
    var userPassword = document.getElementById("password").value;
    localStorage.setItem("user", userName);
    localStorage.setItem("password", userPassword);
    document.getElementById("showRow").classList.add("hide");
    document.getElementById("saveBtn").classList.add("hide");
    M.toast({html: 'login details saved', classes: 'center-aligned'})
});