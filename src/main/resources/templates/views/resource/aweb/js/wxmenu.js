var menu = {
    init: function() {

        menu.getMenu();
        $("#save_content").on('click',menu.saveMenu);

        $("#refresh_content").on('click',menu.refreshMenu);
        
    },
    getMenu:function(){
        $.get("/merchant/get",function(data){
            if(data && data.data && data.data.metaVal){

                var data = JSON.parse(data.data.metaVal);
                var tmpl = document.getElementById('buttom_menu_templete').innerHTML;

                var doTtmpl = doT.template(tmpl);

                $('#menuList').html(doTtmpl(data));
            }




        });
    },
    refreshMenu: function() { 
        YIB.post("/menuv2/freshMenu", {}, function(response) {
            alert(response.msg);
        });

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



