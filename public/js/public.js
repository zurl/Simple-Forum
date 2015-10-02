/**
 * Created by furry on 9/28/2015.
 */
//Using in Website
function onAlert(type,msg){
    //type
    //success danger warning danger
    $("#alertdiv").html('<div class="alert alert-'+type+'" role="alert">'+msg+'</div>');
}
function checkInput(str,_reg,_str){
    if(arguments.length==1) {
        var reg=/[^a-zA-Z0-9_]+/;
        var rstr = "ERROR : You only can input 0-9,a-z,A-Z and _ in blanks.";
    }else if(arguments.length==3) {
        var reg=_reg;
        var rstr = _str;
    }

    if(str == ''){
        onAlert('danger','ERROR : You must fill in all blanks.');
        return 0;
    }else if(reg.test(str)){
        onAlert('danger',rstr );
        return 0;
    }else{
        return 1;
    }
}
//Using in login.html
function onLogin(){
    var name = $("input[name='username']").val();
    var password =  $("input[name='password']").val();
    if(checkInput(name) && checkInput(password)) {
        $.post("/login", {username: name, password: password}, function (res) {
            onAlert(res.rtype, res.rdata);
        });
    }
}
function onRegister(s){
    $.post("/register",{username : $("input[name='username']").val(),password : $("input[name='password']").val()},function(res){
        onAlert(res.rtype,res.rdata);
    });
}