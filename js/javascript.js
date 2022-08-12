$( function () {
    $("/profil").click(function() {
        valid = true;
        if($("#profil_email").val == "Emailgit ") {
            $("#profil_email").css("border-color", "red");
            $("#profil_email").addClass("redplace");
            valid = false;
        } else {
            $("#profil_email").css("border-color", "green");
        }
        if($("#pass").val != "") {
            $("#pass").css("border-color", "red");
            $("#pass").addClass("redplace");
            valid = false;
        } else {
            $("#pass").css("border-color", "green");
        }
        return valid
    });
});