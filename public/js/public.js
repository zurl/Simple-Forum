/**
 * Created by furry on 9/28/2015.
 */
//Using in Website
function onAlert(type,msg){
    //type
    //success danger warning danger
    $("#alertdiv").html('<div class="alert alert-'+type+'" role="alert">'+msg+'</div>');
}
//Using in login.html
function onLogin(){
    $.post("/login",{username : $("input[name='username']").val(),password : $("input[name='password']").val()},function(res){
       onAlert(res.rtype,res.rdata);
    });
}
function onRegister(s){
    $.post("/register",{username : $("input[name='username']").val(),password : $("input[name='password']").val()},function(res){
        onAlert(res.rtype,res.rdata);
    });
}