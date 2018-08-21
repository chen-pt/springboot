/**
 * Created by boren on 15/7/10.
 * 会员处理模块
 */

define(['core','tools', 'service/pagin'],function(core,tools,pagin){

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
     * 会员列表展示
     * @param opt
     * @param num
     */
    var showMembers = function(opt,num)
    {
        var postdata = {};
        var pagesize =  $('.page-size-sel').val() || 15;

        postdata.pageSize = pagesize;
        postdata.pageno = num;

        if(opt=='search'||opt=='allsearch')
        {
            postdata.start = $('#date_start').val();
            postdata.end = $('#date_end').val();
            postdata.mobile = $('#mobile').val();
            postdata.invite_code = $('#invite_code').val();
        }

        if(opt=='allsearch')
        {
            postdata.type = 'all';
            if(!tools.validate('mobile',postdata.mobile,null))
            {
                $.alert({'title':'温馨提示!','backdrop':'static','body':'请输入正确的手机号！'});
                return false;
            }
        }else{
            postdata.type = 'self';
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
            url: core.getHost()+ '/member/getMembers',
            success:function(e) {

                // 最少需要加载1.5S
                if(new Date() - idxTime < 1500) {
                    setTimeout(function() {
                        layer.close(idx);
                    }, 1500 - (new Date() - idxTime));
                } else {
                    layer.close(idx);
                }

                var data = JSON.parse(e);

                if(data.status) {

                    var tpl =  $("#list_template").html();

                    var doTtmpl = doT.template(tpl);

                    var html = doTtmpl(data);

                    $("#member_list").html(html);

                    //翻页条码
                    pagin('#pagelsit', +data.result.current, data.result.total_pages, pagesize, data.result.total_items, function(num) {
                        showMembers(opt,num);
                    });
                    $('#pagelsit').show();
                }else{
                    $("#member_list").html('<tr><td colspan="8"  style="text-align: center;">' + data.result.msg + '</td></tr>');
                    $('#pagelsit').hide();
                }
            }
        });
        console.log('展示');
    };

    /**
     * sui 翻页控件增加页码选择框
     * @param num
     * @constructor
     *//*
     var AddPageExtd = function(opt,status,num)
     {

     var pagearr = [15,30,50,100];

     var pageselect = '&nbsp;&nbsp;&nbsp;<select id="page_size" onchange="select_pages(\''+opt+'\',\''+status+'\');">';

     $.each(pagearr, function(){

     if(this==num)
     {
     pageselect =pageselect+'<option value="'+this+'" selected>'+this+'</option>';
     }else{
     pageselect =pageselect+'<option value="'+this+'" >'+this+'</option>';
     }
     });

     pageselect = pageselect+'</select>&nbsp;';

     $('#pagelsit').find('div').find('div').prepend(pageselect);

     };*/

    /**
     *会员编辑
     */
    var editMemberInfo = function()
    {

        var memberid = $('#member_id').val();

        if(memberid!='')
        {

            var postdata = {id:memberid};

            $.ajax({
                type: 'POST',
                data: postdata,
                url: core.getHost()+ '/member/getMember',
                success:function(e) {
                    var data = JSON.parse(e);

                    if(data.status)
                    {
                        $('#member_mobile').val(data.result.mobile).attr('readonly','readonly');
                        $('#member_name').val(data.result.name);

                        if(data.result.invite_code && data.result.invite_clerk_name){

                            $('#invite_code_only').html(data.result.invite_code).css('color','red').show();
                            $('#invite_code_name').html('('+data.result.invite_clerk_name+')').show();

                        }else if(data.result.invite_code){

                            $('#invite_code_only').html(data.result.invite_code+'()').show();
                        }


                        $("input[name=member_sex]").attr('checked',false);
                        $("input[name=member_sex][value="+data.result.sex+"]").attr("checked",true);
                        $('#sex_'+data.result.sex).attr('class','radio-pretty inline checked');
                        $('#member_email').val(data.result.email);
                        $('#member_qq').val(data.result.qq);
                        $('#member_vcard').val(data.result.membership_number);
                        $('#member_vcardt').val(data.result.barcode);
                        $('#member_tag').val(data.result.tag);
                        $('#member_mark').val(data.result.memo);
                        $('#member_idcard').val(data.result.idcard_number);
                        $('#member_age').val(data.result.age);

                        if (parseInt(data.result.birthday)) {
                            $('#birthday').val(data.result.birthday);
                        }

                        $('#surplus-integrate').show().html('剩余积分：' + data.result.integrate);
                        $('#div_member_code').hide();
                        $('#hsbtn').css('display','none');

                        getCitys(data.result.address);

                    }else{
                        $.alert({'title':'温馨提示!','body':data.result.msg});
                    }
                }
            });

        }else{
            $('#sex_2').attr('class','radio-pretty inline checked');
            $('input[name=member_sex][value=2]').attr("checked",true);
        }
    };
    /**
     * 初始会地区
     * @param address
     */
    var getCitys = function(address)
    {

        var postdata = {};

        if(address.length>0)
        {

            var citys = address.split(" ");

            var tmpval = "";


            if(citys.length>=4)
            {
                postdata.province = citys[0];
                postdata.city = citys[1];
                postdata.country = citys[2];


                for(var i=3;i<citys.length;i++)
                {
                    tmpval += citys[i]+" ";
                }

            }else if(citys.length>=3)
            {
                postdata.province = citys[0];
                postdata.city = citys[1];

                for(var i=2;i<citys.length;i++)
                {
                    tmpval += citys[i]+" ";
                }
            }

            $('#member_address').val(tmpval);

            $.ajax({
                type: 'POST',
                data: postdata,
                async:true,
                url: core.getHost()+"/lib/getAreaCode",
                success:function(e){

                    var data = JSON.parse(e);

                    if(data.status)
                    {
                        $('#store_citys').tree('setValue', [data.result.province,data.result.city,data.result.country])
                    }

                }
            });
        }
    };
    /**
     *编辑会员
     */
    var EditMember = function ()
    {

        var postdata = {};

        postdata.memberid = $('#member_id').val();
        postdata.mobile = $('#member_mobile').val();
        postdata.code = $('#member_code').val();
        postdata.name = $('#member_name').val();
        postdata.invite_code = $('#invite_code').val();
        postdata.sex = $('input[name="member_sex"]:checked').val();
        postdata.email = $('#member_email').val();
        postdata.qq = $('#member_qq').val();
        postdata.citys = $('#store_citys').data('tree').datas;
        postdata.address = $('#member_address').val();
        postdata.vcard = $('#member_vcard').val();
        postdata.vcardt = $('#member_vcardt').val();
        postdata.tag = $('#member_tag').val();
        postdata.mark = $('#member_mark').val();
        postdata.idcard = $('#member_idcard').val();
        postdata.age = $('#member_age').val();
        postdata.birthday = $('#birthday').val();
        postdata.invite_code = $('#invite_code').val();
        if($('#integrate').size()) {
            postdata.integrate = $('#integrate').val();
            /*if( ! $.isNumeric(postdata.integrate) ) {
             alert('积分值只能为数字');
             return;
             }*/
        }
        postdata.tag = postdata.tag.replace(/，/g,',');
        var valresult = paramsValidate(postdata);

        if(valresult.flag)
        {

            return $.ajax({
                type: 'POST',
                data: postdata,
                url: core.getHost()+ '/member/edit',
                success:function(e) {
                    var data = JSON.parse(e);

                    if(data.status)
                    {
                      layer.alert(data.result.msg, {'title': '温馨提示', 'time': 3000, 'shift': 5, 'end': function () {
                        window.location.href = core.getHost()+'/member/index';
                      }});
                    }else{
                        layer.alert(data.result.msg, {'title': '温馨提示', 'time': 3000, 'shift': 6});
                    }
                }
            });

        }else{
            layer.alert(valresult.msg, {'title': '温馨提示', 'time': 3000, 'shift': 6});
        }
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

        }else if(data.memberid==''&&!tools.validate('min',data.code,1))
        {
            valmsg.flag = false;
            valmsg.msg = '请填写验证码！';
        }else if(!tools.validate('min',data.name.replace(/(^\s*)|(\s*$)/g, ""),0.5)||!tools.validate('max',data.name,10))
        {
            valmsg.flag = false;
            valmsg.msg = '姓名不能为空且不超过10个字！';
        }

        if(data.idcard.replace(/(^\s*)|(\s*$)/g, "").length>0 && !tools.validate('idcard',data.idcard,null))
        {
            valmsg.flag = false;
            valmsg.msg = '身份证号码格式不正确！';
        }

        if(data.email.replace(/(^\s*)|(\s*$)/g, "").length>0 && !tools.validate('email',data.email,null))
        {
            valmsg.flag = false;
            valmsg.msg = '邮箱格式不正确！';

        }else if(data.email.replace(/(^\s*)|(\s*$)/g, "").length>0 &&!tools.validate('max',data.email,20)){

            valmsg.flag = false;
            valmsg.msg = '邮箱不能超过40个英文字符！';
        }

        /*if(data.age.replace(/(^\s*)|(\s*$)/g, "").length>0 && (!tools.validate('member',data.age,null) || !tools.validate('lt',data.age,150)))
         {
         valmsg.flag = false;
         valmsg.msg = '年龄只能为数字,或不能大于150！';
         }*/

        if(data.qq.replace(/(^\s*)|(\s*$)/g, "").length>0 && !tools.validate('qq',data.qq,null))
        {
            valmsg.flag = false;
            valmsg.msg = 'QQ 号格式不正确或超过了15位！';
        }

        if(data.address.replace(/(^\s*)|(\s*$)/g, "").length>0)
        {

            if ((data.citys.text.length == 3 && data.citys.value[2] =='') || (data.citys.text.length < 3 && (data.citys.text.length < 2 || (data.citys.text.length == 2 && data.citys.value[1] == ''))))
            {
                valmsg.flag = false;
                valmsg.msg = '请选择省份！';

            }else{

                data.address =  data.citys.text[0]+ ' ' + data.citys.text[1] + ' '+ (data.citys.text[2]?data.citys.text[2]+' ':'') + data.address;
            }

            if(!tools.validate('max',data.address,80))
            {
                valmsg.flag = false;
                valmsg.msg = '地址不能超过80个字！';
            }

        }

        if(data.vcard.replace(/(^\s*)|(\s*$)/g, "").length>0 && !tools.validate('max',data.vcard,30))
        {
            valmsg.flag = false;
            valmsg.msg = '卡号不能超过30个字！';
        }

        if(data.vcardt.replace(/(^\s*)|(\s*$)/g, "").length>0 && !tools.validate('max',data.vcardt,30))
        {
            valmsg.flag = false;
            valmsg.msg = '条形码不能超过30个字！';
        }

        if(data.tag.replace(/(^\s*)|(\s*$)/g, "").length>0 && !tools.validate('max',data.tag,100))
        {
            valmsg.flag = false;
            valmsg.msg = '标签不能超过100个字！';
        }

        if(data.mark.replace(/(^\s*)|(\s*$)/g, "").length>0 && !tools.validate('max',data.mark,200))
        {
            valmsg.flag = false;
            valmsg.msg = '备注不能超过200个字！';
        }
        return valmsg;
    };

    /**
     * 发送验证码
     */
    var sendSignCode = function()
    {
        var postdata = {};

        postdata.mobile = $('#member_mobile').val();

        if(!tools.validate('mobile',postdata.mobile,null))
        {
            $.alert({'title':'温馨提示!','body':'请填写正确的手机号！'});

        }else{

            $.ajax({
                type: 'POST',
                data: postdata,
                url: core.getHost()+ '/member/sendCode',
                success:function(e) {

                    console.log('edit Members :'+e);

                    var data = JSON.parse(e);

                    if(data.status)
                    {
                        layer.msg(data.result.msg);
                        DisableVcode(postdata.mobile);

                    }else{
                        layer.msg(data.result.msg);
                    }
                }
            });
        }
    };

    var DisableVcode = function (mobile)
    {

        var wait = 60;

        var util =
        {

            hsTime: function(eml)
            {
                console.log('wait:'+wait);

                var waitstr =  tools.getCookie('wait'+mobile);

                if(waitstr != "")
                {
                    wait = parseInt(waitstr);
                }

                if (wait == 0) {

                    $(eml).attr("onclick","addmember_sendvcode();").html('重发短信验证码');

                    tools.setCookie('wait'+mobile,wait,0);

                } else {

                    $(eml).removeAttr("onclick").html('在' + wait + '秒后点此重发');

                    wait--;

                    var _this = this;

                    tools.setCookie('wait'+mobile,wait,1);

                    setTimeout(function () {

                        _this.hsTime(eml);

                    }, 1000)
                }
            }
        };
        util.hsTime('#hsbtn');
    };

    /**
     * 用户验证
     */
    var checkUser = function (mobile)
    {
        var postdata = {};

        postdata.mobile = mobile;

        $.ajax({
            type: 'POST',
            data: postdata,
            async:false,
            url: core.getHost()+'/member/getCheckUser',
            success:function(e){

                console.log('用户验证:'+e);

                var data = JSON.parse(e);

                if(data.status) {

                    if(!data.result.check)
                    {
                        $('#check_user').attr('style','display: none;');
                        sendSignCode();
                    }else{
                        $('#check_user').attr('style','display: inline;');
                    }
                }
            }
        });
    };

    return {

        showMembers:showMembers,
        EditMember:EditMember,
        sendSignCode:sendSignCode,
        editMemberInfo:editMemberInfo,
        checkUser:checkUser,
        setPageSize:setPageSize
    };
});
