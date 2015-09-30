/**
 * Created by furry on 9/28/2015.
 */
//Using in index.html
function onLogin(){
    $("#loginform").attr("action","/login");
    $("#loginform").submit();
}
function onRegister(){
    $("#loginform").attr("action","/register");
    $("#loginform").submit();
}