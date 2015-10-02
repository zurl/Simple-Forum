/**
 * Created by furry on 10/2/2015.
 */
//Using in admin_user
function onUpdate_user(_this){
    var name = $(_this).parent().parent().find("[name='name']").val();
    var password = $(_this).parent().parent().find("[name='password']").val();
    var lv = $(_this).parent().parent().find("[name='lv']").val();
    $.post("/admin_user",{ope : 'UPDATE' , username : name , password : password , lv : lv},function(res){
        onAlert(res.rtype,res.rdata);
        window.setTimeout("window.location='/admin_user'",800);
    });
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
    if( name == '' || password == '' || lv == ''){
        onAlert('danger','ERROR : You must fill all blanks');
    }else{
        $.post("/admin_user",{ope : 'INSERT' , username : name , password : password , lv : lv},function(res){
            onAlert(res.rtype,res.rdata);
            window.setTimeout("window.location='/admin_user'",800);
        });
    }
}