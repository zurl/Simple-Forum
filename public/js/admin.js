/**
 * Created by furry on 10/2/2015.
 */
//Using in admin_user
function onUpdate_user(_this){
    var name = $(_this).parent().parent().find("[name='name']").val();
    var password = $(_this).parent().parent().find("[name='password']").val();
    var lv = $(_this).parent().parent().find("[name='lv']").val();
    if(checkInput(name) && checkInput(password) && checkInput(lv,/[^0-7]+/,"Error : lv only can be in [0-7]")) {
        $.post("/admin_user", {ope: 'UPDATE', username: name, password: password, lv: lv}, function (res) {
            onAlert(res.rtype, res.rdata);
            window.setTimeout("window.location='/admin_user'", 800);
        });
    }
}
function onDelete_user(_this){
    var name = $(_this).parent().parent().find("[name='name']").val();
    $.post("/admin_user",{ope : 'DELETE' , username : name },function(res){
        onAlert(res.rtype,res.rdata);
        window.setTimeout("window.location='/admin_user'",800);
    });
}
function onInsert_user(_this){
    var name = $(_this).parent().parent().find("[name='name']").val();
    var password = $(_this).parent().parent().find("[name='password']").val();
    var lv = $(_this).parent().parent().find("[name='lv']").val();
    if(checkInput(name) && checkInput(password) && checkInput(lv,/[^0-7]+/,"Error : lv only can be in [0-7]")) {
        $.post("/admin_user",{ope : 'INSERT' , username : name , password : password , lv : lv},function(res){
            onAlert(res.rtype,res.rdata.toString());
            window.setTimeout("window.location='/admin_user'",800);
        });
    }
}