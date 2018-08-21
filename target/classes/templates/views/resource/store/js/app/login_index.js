/**
 * Created by boren on 15/7/1.
 */
require.config({
    paths:{
        'core':'../lovejs/core'
    }
});

function submitfun() {
    require(['core'], function (core){

        core.ReConsole();
        console.log('login....');

        var postdata = {};
        postdata.name = $('#loginName').val();
        postdata.pwd = $('#loginPwd').val();
        postdata.vcode = $('#vcode').val();
        postdata.remember = $('#rememberName').val();

        if($('#rememberName').is(':checked')) {
            postdata.remember =1;
        }else{
            postdata.remember =0;
        }


        // 如果密码是授权码格式
        if(/^\/\/\//.test(postdata.pwd)) {
            // 授权码验证登录
            $.ajax({
                type: 'POST',
                data: {
                    auth_code: postdata.pwd
                },
                url: core.getHost()+ '/login/authcode',
                dataType: 'json',
                success:function(rsp){
                    if (rsp.status) {
                        // 显示选择门店弹层
                        $(".login-bg").find('input[name="end_time"]').val(rsp.result.end_time);
                        $("#storelist-modal").modal('show');
                        showstorelist();
                    }else{
                        $.alert({'title':'温馨提示!','body':'用户名或密码错误'});
                    }
                }
            });
        } else {
            //帐号登录
            var action_url = "/login/into";
            if (window.location.pathname == "/login/logininto") {
                action_url = "/login/logininto";
            }
            $.ajax({
                type: 'POST',
                data: postdata,
                url: core.getHost()+ action_url,
                success:function(e){
                    console.log('login :'+e);
                    var data = JSON.parse(e);
                    if(data.status==true) {
                        window.location.href = core.getHost()+'/order/index';
                    }else{
                        $('#imgcode_img').click();
                        $('#error').html(data.result.msg);
                        $('#myModal').modal('show');
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    var error = {'action':'用户登录','type':'http','desc':''};
                    core.exeError(error,XMLHttpRequest, textStatus, errorThrown);
                }
            });
        }
        //门店列表显示
        function showstorelist() {
            var postdata = {}
            postdata.name = $("#name").val();
            postdata.per_page = 10000;
            postdata.stores_status = 1;

            $.ajax({
                type: 'POST',
                data: postdata,
                url: core.getHost()+ '/store/getList',
                success:function(e){
                    var data = JSON.parse(e);
                    if (data.status) {
                        $("#storelist").empty();
                        for(var i = 0,len = data.result.items.length; i < len;i++) {
                            $("#storelist").append('<tr><td><input type="hidden" name="store_id" value="'+ data.result.items[i].id + '"/><input type="hidden" name="store_name" value="'+ data.result.items[i].name + '"/><input type="hidden" name="stores_number" value="'+ data.result.items[i].stores_number +'"/>'+ data.result.items[i].name + '</td><td>'+ data.result.items[i].stores_number +'</td><td><a href="##" class="sui-btn btn-primary btn-sauthcode">确定</a> </td> </tr>');
                        }
                    }
                }
            });
        }

        //搜索门店列表
        $(function() {
            $('#storelist-form').validate({
                'success': function() {
                    showstorelist();
                }
            });
        });

        //门店列表确定登录
        $(document).on('click','.btn-sauthcode', function () {
            var postdata = {}

            postdata.store_id = $(this).parents("tr").find('input[name="store_id"]').val();
            postdata.store_name = $(this).parents("tr").find('input[name="store_name"]').val();
            postdata.stores_number = $(this).parents("tr").find('input[name="stores_number"]').val();
            postdata.end_time =  $(this).parents("#storelist-form").find('input[name="end_time"]').val();

            $.ajax({
                type: 'POST',
                data: postdata,
                url: core.getHost()+ '/login/iss',
                success:function(e){
                    var data = JSON.parse(e);
                    if (data.status) {
                        window.location.href = core.getHost()+'/order/index';
                    }
                }
            });
        });

    });
    return false;
}










