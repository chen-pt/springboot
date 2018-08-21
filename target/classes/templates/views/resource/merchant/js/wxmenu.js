var menu = {
    init: function() {

        menu.getMenu();
        $("#save_content").on('click',menu.saveMenu);

        $("#refresh_content").on('click',menu.refreshMenu);
        
    },
    getMenu:function(){
        $.get("/merchant/get",function(data){
          var datas = "";
            if(data && data.data && data.data.metaVal){

             datas = JSON.parse(data.data.metaVal);

            }
            var tmpl = document.getElementById('buttom_menu_templete').innerHTML;

            var doTtmpl = doT.template(tmpl);

            $('#menuList').html(doTtmpl(datas));
        });
    },
    refreshMenu: function() {
        $.get("/merchant/reflush",function(res){
            if(res.code == 200){
                alert("刷新成功");
            }else{
               alert("刷新失败，请联系51健康管理员。");
            }
        })
    },
    saveMenu: function() {       

        var tmpObj = $(".jslevel1");
        var tmpArr = [];
        for(var i = 0 ,len = tmpObj.length;i<len;i++){
            tmpArr[i] = {};
            tmpArr[i].name = tmpObj.eq(i).find(".js_l1Title").html().trim();
            tmpArr[i].sub_button = [];
            var jlen = tmpObj.eq(i).find(".jslevel2").length;
            if(jlen < 1){
                 alert("必须有一个子菜单后才能做保存操作！");
                 return false;
            }
            for(var j = 0 ;j<jlen;j++){
                tmpArr[i].sub_button[j] = {};
                tmpArr[i].sub_button[j].type = 'view'; 
                tmpArr[i].sub_button[j].name = tmpObj.eq(i).find(".jslevel2").eq(j).find(".js_l2Title").html().trim();
                tmpArr[i].sub_button[j].url = tmpObj.eq(i).find(".jslevel2").eq(j).find(".js_l2Title").attr("data-src").trim();

                if(!tmpArr[i].sub_button[j].url || tmpArr[i].sub_button[j].url == "user-defined"){
                    alert("请选择链接地址后，再做保存操作！");
                    return false;
                }
              if(!IsURL(tmpArr[i].sub_button[j].url)){
                alert("请填写正确链接地址后，再做保存操作！");
                return false;
              }
              if(tmpObj.eq(i).find(".jslevel2").eq(j).find(".js_l2Title").attr("data-encodeURL")){
                    tmpArr[i].sub_button[j].encodeURL = true; 
                }
            }
        }
        var tmpStr = JSON.stringify(tmpArr);
        if(!confirm("确定要保存修改后的菜单吗？\n提示：【保存】并【刷新公众号菜单】才有效")){
            return false;
        }
        var data = {};

        data.metaVal = tmpStr;

        $.ajax({
                type: "POST",
                url:"/merchant/update",
                data:data,
                contentType:"application/x-www-form-urlencoded",
                async: false,
                error: function() {
                  alert("服务器忙error");
                },
                success: function(res) {

                  if(res != null && res.code == 200){
                      alert("操作成功")
                    //location.reload();

                  }else{
                      alert("服务器忙");
                  }


                }
              });
    },
};

$(function() {

    menu.init();
});
function IsURL (str_url) {
  //不判断了
  return (true);
  if( str_url.indexOf(":")==-1){
    return (true);
  }
  /*var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
    + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
    + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
    + '|' // 允许IP和DOMAIN（域名）
    + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
    + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
    + '[a-z]{2,6})' // first level domain- .com or .museum
    + '(:[0-9]{1,4})?' // 端口- :80
    + '((/?)|' // a slash isn't required if there is no file name
    + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';*/
  //var strRegex ="^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+";
  var strRegex ="^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$";
  var re=new RegExp(strRegex);
//re.test()
  if (re.test(str_url)) {
    return (true);
  } else {
    return (false);
  }
}


