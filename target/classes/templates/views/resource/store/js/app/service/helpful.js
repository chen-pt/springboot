/**
 * Created by vv on 2015/11/19.
 */

define(['core','service/pagin'],function(core,pagin){
    var page_size = 15;
    /**
     * 问题列表
     * @param opt
     * @param num
     */
    var showHelpful = function(opt,status,num)
    {
        var postdata = {};
        var pagesize =  $('.page-size-sel').val() || 15;

        postdata.pageSize = pagesize;
        postdata.pageno = num;
        postdata.status =status;

        if(opt=='search') {
            postdata.actor_name = $('#actor_name').val();
            postdata.has_answers = $('#has_answers').val();
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
            url: core.getHost()+ '/helpful/getHelpful',

            success:function(e) {

                // 最少需要加载1.5S
                if(new Date() - idxTime < 1500) {
                    setTimeout(function() {
                        layer.close(idx);
                    }, 1500 - (new Date() - idxTime));
                } else {
                    layer.close(idx);
                }

                //console.log('helpful getHelpful :'+e);

                var data = JSON.parse(e);

                if(data.status) {

                    var tpl =  $("#list_template").html();

                    var doTtmpl = doT.template(tpl);

                    var html = doTtmpl(data);

                    $("#helpful").html(html);

                    pagin('#pagelsit', +data.result.current, data.result.total_pages, pagesize, data.result.total_items, function(num) {
                        showHelpful(opt,status,num);
                    });
                    $('#pagelsit').show();
                }else{
                    $("#helpful").html('<tr><td colspan="7"  style="text-align: center;">'+ data.result.msg +'</td></tr>');
                    $('#pagelsit').hide();
                }
            }
        });
        console.log('展示');
    };

    /**
     *添加问题
     */
    var showQuestion = function ()
    {
        if(! $('[name="q_type"]:checked').val()){
            layer.msg("请先选择“分类”。");
            return;
        }
        if($("#q_title").val().length<5){
            layer.msg("请填写“问题”且不少于5个字符。");
            return ;
        }
        if(!editor.html()){
            layer.msg("请填写“描述”。");
            return;
        }
        var postdata = {};

        postdata.q_type = $('[name="q_type"]:checked').val();
        postdata.q_title = $("#q_title").val();
        postdata.q_content= editor.html();


        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost()+ '/helpful/getQuestion',

            success:function(e){

                var data = JSON.parse(e);

                if(data.status) {

                    layer.confirm('提交成功，谢谢！', {
                        btn: ['确定'] //按钮
                    }, function(){
                        location.pathname = 'helpful/index';
                    });

                }else{
                    $.alert({'title':'温馨提示!','body':data.result.msg});
                }

            }
        });
    };


    /**
     *添加问题
     */
    var showDetail = function ()
    {
        var postdata = {};

        postdata.q_no=$("#detail_huifu").val();

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost()+ '/helpful/getDetail',

            success:function(e){

                var data = JSON.parse(e);

                if(data.status) {

                    $('#tw_question').html(data.result.actor_name);
                    $('#tw_store').html((data.result.actor_store_name?data.result.actor_store_name:"总店"));
                    $('#tw_time').html(data.result.create_time);
                    $('#tw_title').html(data.result.q_title);
                    $('#tw_content').html(data.result.q_content);

                }

            }
        });
    };

    /**
     *回复列表
     */
    var showAnswersList = function(opt,status,num)
    {
        var postdata = {};
        var pagesize =  $('.page-size-sel').val() || 15;

        postdata.q_no=$("#detail_huifu").val();

        postdata.pageSize = pagesize;
        postdata.pageno = num;
        postdata.status =status;

        // 加载层
        var idx = layer.load(1, {
            shade: [0.1,'#fff']
        });
        //加载层时间
        var idxTime = new Date();

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost()+ '/helpful/getAnswersList',

            success:function(e) {

                // 最少需要加载1.5S
                if(new Date() - idxTime < 1500) {
                    setTimeout(function() {
                        layer.close(idx);
                    }, 1500 - (new Date() - idxTime));
                } else {
                    layer.close(idx);
                }

                //console.log('helpful getHelpful :'+e);

                var data = JSON.parse(e);

                if(data.status) {

                    var tpl =  $("#list_template").html();

                    var doTtmpl = doT.template(tpl);

                    var html = doTtmpl(data);

                    $("#detail").html(html);

                    pagin('#pagelsit', +data.result.current, data.result.total_pages, pagesize, data.result.total_items, function(num) {
                        showAnswersList(opt,status,num);
                    });
                }else{
                    $("#detail").html('<table class="sui-table table-bordered-simple table-helpful"><tbody><tr><td colspan="3"  style="text-align: center;padding: 50px 0;">没有回复问题！</td></tr></tbody></table>');
                }
            }

        });

        console.log('展示');
    };

    /**
     *回复问题
     */
    var showAnswer = function () {
        if (!editorhui.html()) {
            layer.msg("请先填写“回复”。");
            return;
        }
        var postdata = {};

        postdata.q_no = $('#reply_id').val();
        postdata.q_content = editorhui.html();

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost() + '/helpful/getAnswer',

            success: function (e) {

                var data = JSON.parse(e);

                if (data.status) {

                    layer.alert("提交成功，谢谢！", {btn: ['确定']},
                        function () {
                            location.href = '/helpful/detail' + location.search;
                        })

                } else {
                    $.alert({'title': '温馨提示!', 'body': data.result.msg});
                }

            }
        });
    };

    //图片
    var newhandleFileSelect = function (evt) {

        var img_url = '';

        var files = evt.target.files;
        var cur_success_file_num = 0;
        var cur_error_file_num = 0;

        for (var i = 0, f; f = files[i]; i++) {

            if (!f.type.match('image.*')) {
                continue;
            }
            var formData = new FormData();
            formData.append("ad_img_file", f);

            $.ajax({
                url: core.getHost() + '/helpful/upload_pic_ajax',
                type: 'POST',
                async: false,
                success: function (e) {

                    var data = JSON.parse(e);

                    if (data && data.status) {
                        cur_success_file_num++;

                        img_url = data.result.imgsrc;

                        if (cur_error_file_num + cur_success_file_num == files.length) {
                            alert("本次选择" + files.length + "张图片，其中" + cur_success_file_num + "张添加成功，" + cur_error_file_num + "张添加失败！");
                        }
                    } else {
                        cur_error_file_num++;
                        if (cur_error_file_num + cur_success_file_num == files.length) {
                            alert("本次选择" + files.length + "张图片，其中" + cur_success_file_num + "张添加成功，" + cur_error_file_num + "张添加失败！");
                        }
                    }
                },
                error: function (data) {
                },
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            });
        }

        return img_url;
    };

    return {

        showHelpful:showHelpful,
        showAnswersList:showAnswersList,
        showQuestion:showQuestion,
        newhandleFileSelect:newhandleFileSelect,
        showAnswer:showAnswer,
        showDetail:showDetail
    };
});
