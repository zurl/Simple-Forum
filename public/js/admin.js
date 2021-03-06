/**
 * Created by furry on 10/2/2015.
 */
//Using in admin_user
function onUpdate_user(_this){
    var uid = $(_this).attr('uid');
    var password = $(_this).parent().parent().find('[name=\'password\']').val();
    var lv = $(_this).parent().parent().find('[name=\'lv\']').val();
    if( checkInput(password) &&  checkInput(lv,/[^0-9]+/,'Error : lv only can be numbers')) {
        $.post('/admin_user', {ope: 'UPDATE', uid: uid, password: password, lv: lv}, function (res) {
            onAlert(res.rtype, res.rdata);
            window.setTimeout('window.location=\'/admin_user\'', 800);
        });
    }
}
function onDelete_user(_this){
    var uid = $(_this).attr('uid');
    $.post('/admin_user',{ope : 'DELETE' , uid : uid },function(res){
        onAlert(res.rtype,res.rdata);
        window.setTimeout('window.location=\'/admin_user\'',800);
    });
}
function onInsert_user(_this){
    var username = $(_this).parent().parent().find('[name=\'username\']').val();
    var password = $(_this).parent().parent().find('[name=\'password\']').val();
    var lv = $(_this).parent().parent().find('[name=\'lv\']').val();
    if(checkInput(username) && checkInput(password) && checkInput(lv,/[^0-9]+/,'Error : lv only can be numbers')) {
        $.post('/admin_user',{ope : 'INSERT' , username : username , password : password , lv : lv},function(res){
            onAlert(res.rtype,res.rdata.toString());
            window.setTimeout('window.location=\'/admin_user\'',800);
        });
    }
}
//Using in admin_article
function onView_article(_this){
    window.location.href = '/admin_article_view?aid=' + $(_this).attr('aid' );
}
function toInsert_article(){
    window.location.href = '/admin_article_insert';
}
function onInsert_article(){
    var title = $('[name=\'title\']').val();
    var brief = $('[name=\'brief\']').val();
    var content =  $('[name=\'content\']').val();
    var atype = $('#atypeselect').find('option:selected').val();
    if(title != '' && brief != '' && content != '') {
        $.post('/admin_article',{ope : 'INSERT' , atype :atype,title : title , brief : brief , content : content},function(res){
            onAlert(res.rtype,res.rdata.toString());
            window.setTimeout('window.location=\'/admin_article\'',800);
        });
    }
}
function onTop_article(_this,_x){
    $.post('/admin_article',{ope : 'TOP' , top : _x , aid :  $(_this).attr('aid')},function(res){
        onAlert(res.rtype,res.rdata.toString());
        window.setTimeout('window.location=\'/admin_article\'',800);
    });
}
function onUpdate_article(){
    var aid = $('[name=\'aid\']').attr('aid');
    var title = $('[name=\'title\']').val();
    var brief = $('[name=\'brief\']').val();
    var atype = $('#atypeselect').find('option:selected').val();
    var content =  $('[name=\'content\']').val();
    if(title != '' && brief != '' && content != '') {
        $.post('/admin_article',{ope : 'UPDATE', atype :atype , title : title , brief : brief , content : content ,aid :aid},function(res){
            onAlert(res.rtype,res.rdata.toString());
            window.setTimeout('window.location=\'/admin_article\'',800);
        });
    }
}
function onDelete_article(_this){
    $.post('/admin_article',{ope : 'DELETE' , aid :  $(_this).attr('aid')},function(res){
        onAlert(res.rtype,res.rdata.toString());
        window.setTimeout('window.location=\'/admin_article\'',800);
    });
}