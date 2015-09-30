/**
 * Created by furry on 9/28/2015.
 */
//Using in Website
function onAlert(Msg){

}
//Using in index.html
function onLogin(){
    $("#loginform").attr("action","/login");
    $("#loginform").submit(function(res){
        alert(res);
    });
}
function onRegister(){
    $("#loginform").attr("action","/register");
    $("#loginform").submit(function(res){
        alert(res);
    });
}