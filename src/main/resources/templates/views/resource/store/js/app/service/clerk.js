define(['core','tools','service/pagin'],function(core,tools,pagin){

    var page_size = 15;

    /**
     * 设置页码
     * @param val
     */
    var setPageSize = function(val)
    {
        page_size = val;
    };

    /**
     * 店员列表展示
     * @param opt
     * @param num
     */
    var showClerks = function(opt,num)
    {
        var postdata = {};
        var pagesize =  $('.page-size-sel').val() || 15;

        postdata.pagesize = pagesize;
        postdata.pageno = num;

        if(opt=='search')
        {
            postdata.start = $('#date_start').val();
            postdata.end = $('#date_end').val();
            postdata.mobile = $('#phone').val();
            postdata.clerk_name = $('#clerk_name').val();
            postdata.invite_code = $('#invite_code_input').val();
        }

        // 加载层
        var idx = layer.load(1, {
            shade: [0.1,'#fff']
        });
        //加载层时间
        var idxTime = new Date();

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost()+ '/clerk/getClerks',
            success:function(e) {

                //console.log('clerk getClerks :'+e);

                // 最少需要加载1.5S
                if(new Date() - idxTime < 1500) {
                    setTimeout(function() {
                        layer.close(idx);
                    }, 1500 - (new Date() - idxTime));
                } else {
                    layer.close(idx);
                }

                var data = JSON.parse(e);

                if(data.status==true) {

                    var tpl =  $("#list_template").html();

                    var doTtmpl = doT.template(tpl);

                    var html = doTtmpl(data);

                    $("#clerk_list").html(html);

                    pagin('#pagelsit', +data.result.current, data.result.total_pages, pagesize, data.result.total_items, function(num) {
                        showClerks(opt,num);
                    });
                }else{
                    $("#clerk_list").html('<tr><td colspan="8"  style="text-align: center;">' + data.result.msg + '</td></tr>');
                    $("#pagelsit").html('');
                }
            }
        });
        console.log('展示');
    };

    /**
     * 编辑信息
     * @
     */
    var setinfo = function()
    {
        var sexval = $('#clerksex').val();
        //$("input[name=sex]").attr('checked',false);
        if($.isNumeric(sexval)) {
            $("input[name=sex][value="+ sexval +"]").attr("checked",true);
        }
    };

    /**
     * 增加店员
     */
    var addClerks = function() {
        var postdata = {};
        postdata.mobile = $('#mobile').val();
        postdata.password = $('#password').val();
        postdata.name = $('#name').val();
        postdata.name = postdata.name.replace(/(\s*)/g, "");
        postdata.sex = $('input[name="sex"]:checked').val();
        postdata.idcard_number = $('#idcard').val();
        //postdata.age = $('#age').val();
        postdata.birthday = $("#birthday").val();
        postdata.email = $('#email').val();
        postdata.qq = $('#qq').val();
        postdata.clerk_job = $('#work').val();
        postdata.memo = $('#mark').val();
        postdata.employee_number = $('#employee_number').val();
        postdata.status = $('[name=status]:checked').val();
        postdata.group_ids = $('[name="group-ids[]"]:checked').map(function() {
            return this.value;
        }).get().join(',');
        postdata.role_ids = $('[name="role-ids[]"]:checked').map(function() {
            return this.value;
        }).get().join(',');
        var valresult = paramsValidate(postdata);

        if (valresult.flag) {
            $.ajax({
                type: 'POST',
                data: postdata,
                async: false,
                url: core.getHost() + '/clerk/addclerks',
                success: function (e) {
                    console.log('添加店员:' + e);
                    var data = JSON.parse(e);
                    if (data.status == true) {
                        //window.history.back(-1);
                        layer.msg('添加店员成功！',function(){
                            window.location.href = core.getHost()+'/clerk/index'
                        });
                    } else {
                        $.alert({'title': '温馨提示!', 'body': data.result.msg});
                    }
                }
            });
        } else {
            $.alert({'title': '温馨提示!', 'body': valresult.msg});
        }
    };
    /**
     * 修改店员
     */
    var editClerks = function() {
        var postdata = {};
        postdata.id = $('#clerkid').val();
        postdata.mobile = $('#mobile').val();
        postdata.password = $('#password').val();
        postdata.name=$('#name').val();
        postdata.name=postdata.name.replace(/(\s*)/g, "");
        postdata.sex= $('input[name="sex"]:checked').val();
        postdata.idcard_number=$('#idcard').val();
        //postdata.age=$('#age').val();
        postdata.birthday = $("#birthday").val();

        postdata.email=$('#email').val();
        postdata.qq=$('#qq').val();
        postdata.clerk_job=$('#work').val();
        postdata.memo=$('#mark').val();
        postdata.employee_number = $('#employee_number').val();
        postdata.status = $('[name=status]:checked').val();
        postdata.group_ids = $('[name="group-ids[]"]:checked').map(function() {
            return this.value;
        }).get().join(',');
        postdata.role_ids = $('[name="role-ids[]"]:checked').map(function() {
            return this.value;
        }).get().join(',');
        var valresult = paramsValidate(postdata);

        if(valresult.flag) {

            $.ajax({
                type: 'POST',
                data: postdata,
                async:false,
                url: core.getHost()+'/clerk/editclerks',
                success:function(e){
                    console.log('修改店员:'+e);
                    var data = JSON.parse(e);
                    if(data.status==true) {
                        //window.history.back(-1);
                        layer.msg('修改店员成功！',function(){
                            window.location.href = core.getHost()+'/clerk/index'
                        });
                    }else{
                        $.alert({'title':'温馨提示!','body':data.result.msg});
                    }
                }
            });
        }else{
            $.alert({'title':'温馨提示!','body':valresult.msg});
        }
    };

    /**
     * 删除店员
     */
    var deleteClerks = function(clerk_id)
    {
        var postdata = {};
        postdata.id = clerk_id;

        $.ajax({
            type: 'POST',
            data: postdata,
            async:false,
            url: core.getHost()+'/clerk/deleteClerks',
            success:function(e){
                console.log('删除店员:'+e);
                var data = JSON.parse(e);
                if(data.status){
                    $.alert({'title':'温馨提示!','body':'店员删除成功' , okHide: function() {
                        window.location.href = core.getHost()+'/clerk/index'
                    }});
                }else{
                    $.alert({'title':'温馨提示!','body':data.result.msg });
                }
            }
        });
    };
    /**
     * 参数验证
     */
    var paramsValidate = function (data)
    {
        var valmsg = {flag:true,msg:''};

        if(!tools.validate('mobile',data.mobile,null))
        {
            valmsg.flag = false;
            valmsg.msg = '请填写正确的手机号！';
        }else if(!tools.validate('min',data.name.replace(/(^\s*)|(\s*$)/g, ""),0.5)||!tools.validate('max',data.name,10))
        {
            valmsg.flag = false;
            valmsg.msg = '姓名不能为空且不超过10个字！';
        }

        if(data.idcard_number.replace(/(^\s*)|(\s*$)/g, "").length>0 && !tools.validate('idcard',data.idcard_number,null))
        {
            valmsg.flag = false;
            valmsg.msg = '身份证号码格式不正确！';
        }

        if(data.email.length>0 && !tools.validate('email',data.email,null))
        {
            valmsg.flag = false;
            valmsg.msg = '邮箱格式不正确！';
        }

        if(data.email.length>0 && !tools.validate('max',data.email,20))
        {
            valmsg.flag = false;
            valmsg.msg = '邮箱格式不正确！';
        }

        /*if(data.age.length>0 && !tools.validate('member',data.age,null))
        {
            valmsg.flag = false;
            valmsg.msg = '年龄只能为数字！';
        }*/

        if(data.qq.length>0 &&!tools.validate('qq',data.qq,null))
        {
            valmsg.flag = false;
            valmsg.msg = 'QQ 号格式不正确！';
        }

        if(data.clerk_job.length>0 && !tools.validate('cmax',data.clerk_job,10))
        {
            valmsg.flag = false;
            valmsg.msg = '店员职业必须为汉字且不超过10个字！';
        }
        if(data.memo.length>0 && !tools.validate('max',data.memo,200))
        {
            valmsg.flag = false;
            valmsg.msg = '备注不能超过200个字！';
        }

        return valmsg;
    };
    //门店调配
    var showChangeStore = function()
    {
        var postdata = {};
        postdata.assistant_mobile = $('#assistant_mobile').val();
        postdata.assistant_new_store = $('#assistant_new_store').val();
        postdata.store_name = $('#autocomplete').val();
        postdata.authcode = $('#auth_code').val();
        postdata.clerk_id = $('#admin_id').val();

        $.ajax({
            type: 'POST',
            data: postdata,
            async:true,
            url: core.getHost()+'/clerk/ChangeStore',
            success:function(e){
                console.log('门店调配:'+e);
                var data = JSON.parse(e);
                if(data.status){
                    $.alert({'title':'温馨提示!','body':'门店修改成功' , okHide: function() {
                        window.location.href = core.getHost()+'/clerk/index'
                    }});
                }else{
                    $.alert({'title':'温馨提示!','body':data.result.msg });
                }
            }
        });
    };

    //获取分类门店列表显示
    function showstorelist() {
        var postdata = {}
        var store_name = $('#store_name').val();
        var store_id = $('#store_id').val();

        postdata.per_page = 1000000;
        postdata.stores_status = 1;

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost()+ '/store/getList',
            success:function(e){
                var data = JSON.parse(e);

                if (data.status) {
                    var countries = [];
                    for(var i = 0,len = data.result.items.length; i < len;i++) {
                        var krr = {};
                        krr.value = data.result.items[i].name;
                        krr.data = data.result.items[i].id;
                        countries[i] = krr;
                    }
                    $('#autocomplete').autocomplete({
                        lookup: countries,
                        minChars: 0,
                        onSelect: function (suggestion) {
                            $('#assistant_new_store').val(suggestion.data);
                        }
                    });
                }
            }
        });
    }
    //获取门店的调配记录
    var showAllocateHistory = function (page,opt)
    {
        var pagesize =  $('#pagelsits').find('.page-size-sel').val() || 15;
        
        var param = {};
        param.pagesize = pagesize;
        param.pageno = page;


        if(opt=='search')
        {
            param.clerk_name = $('#clerk_name').val();
            param.clerk_mobile = $('#clerk_mobile').val();
        }

        $.ajax({
            type: 'POST',
            data: param,
            url: core.getHost()+ '/clerk/getAllocateHistory',
            // url: core.getHost()+ '/clerk/getClerks',
            success:function(e) {

                var data = JSON.parse(e);

                if(data.status==true) {

                    var tpl =  $("#allocate_history").html();

                    var doTtmpl = doT.template(tpl);

                    var html = doTtmpl(data);

                    $("#allocate_list").html(html);

                    pagin('#pagelsits', +data.result.current, data.result.total_pages, pagesize, data.result.total_items, function(page) {
                        showAllocateHistory(page,opt);
                    });

                }else{
                    $("#allocate_list").html('<tr><td colspan="8"  style="text-align: center;">' + data.result.msg + '</td></tr>');
                    $("#pagelsits").html('');
                }
            }
        });
    };

    return{
        showClerks:showClerks,
        addClerks:addClerks,
        editClerks:editClerks,
        deleteClerks:deleteClerks,
        setinfo:setinfo,
        setPageSize:setPageSize,
        showChangeStore:showChangeStore,
        showstorelist:showstorelist,
        showAllocateHistory:showAllocateHistory
    };
});
