/**
 * Created by furry on 10/2/2015.
 */
//Using in admin_user
function onUpdate_user(_this){
    var username = $(_this).parent().parent().find("[name='username']").val();
    var password = $(_this).parent().parent().find("[name='password']").val();
    var lv = $(_this).parent().parent().find("[name='lv']").val();
    if(checkInput(name) && checkInput(password) && checkInput(lv,/[^0-7]+/,"Error : lv only can be in [0-7]")) {
        $.post("/admin_user", {ope: 'UPDATE', username: username, password: password, lv: lv}, function (res) {
            onAlert(res.rtype, res.rdata);
            window.setTimeout("window.location='/admin_user'", 800);
        });
    }
}
function onDelete_user(_this){
    var username = $(_this).parent().parent().find("[name='username']").val();
    $.post("/admin_user",{ope : 'DELETE' , username : username },function(res){
        onAlert(res.rtype,res.rdata);
        window.setTimeout("window.location='/admin_user'",800);
    });
}
function onInsert_user(_this){
    var username = $(_this).parent().parent().find("[name='username']").val();
    var password = $(_this).parent().parent().find("[name='password']").val();
    var lv = $(_this).parent().parent().find("[name='lv']").val();
    if(checkInput(name) && checkInput(password) && checkInput(lv,/[^0-7]+/,"Error : lv only can be in [0-7]")) {
        $.post("/admin_user",{ope : 'INSERT' , username : username , password : password , lv : lv},function(res){
            onAlert(res.rtype,res.rdata.toString());
            window.setTimeout("window.location='/admin_user'",800);
        });
    }
}
//Using in admin_article
function onView_article(){
    window.location.href = '\admin_article_view';
}
function toInsert_article(){
    window.location.href = '\admin_article_insert';
}
function onInsert_article(){
    var title = $('[name="title"]').val();
    var brief = $('[name="brief"]').text();
    var content =  $('[name="content"]').text();
    if(title != '' && brief != '' && content != '') {
        $.post("/admin_article",{ope : 'INSERT' , title : title , brief : brief , content : content},function(res){
            onAlert(res.rtype,res.rdata.toString());
            window.setTimeout("window.location='/admin_article'",800);
        });
    }
}