/**
 * Created by boren on 15/7/1.
 * 基础包
 */
define(function (){
    /**
     * doT 初始化
     */
    var doTinit = function()
    {
        //配置定界符
        doT.templateSettings = {
            evaluate:    /\[\%([\s\S]+?)\%\]/g,
            interpolate: /\[\%=([\s\S]+?)\%\]/g,
            encode:      /\[\%!([\s\S]+?)\%\]/g,
            use:         /\[\%#([\s\S]+?)\%\]/g,
            define:      /\[\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\]/g,
            conditional: /\[\%\?(\?)?\s*([\s\S]*?)\s*\%\]/g,
            iterate:     /\[\%~\s*(?:\%\]|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\])/g,
            varname: 'it',
            strip: true,
            append: true,
            selfcontained: false
        };
    };


    /**
     * 取host
     * @returns {string|.event.special.swipe.start.origin|*}
     */
    var getHost = function()
    {
        // 服务地址
        var hosturl = (location.origin || location.protocol + '//' + location.hostname + (location.port == 80 ? '' : ':' + location.port));

        return hosturl;

    };


    /**
     * 前端错误处理和收集
     * @param error  exlp:{'action':'功能','type':'http or others','desc':''}
     * @param XMLHttpRequest
     * @param textStatus
     * @param errorThrown
     */
    var exeError = function (error,XMLHttpRequest, textStatus, errorThrown)
    {
        if(error.type=='http')
        {
            var desc = 'status:'+XMLHttpRequest.status+' state:'+XMLHttpRequest.readyState+' text:'+textStatus+' err:'+JSON.stringify(errorThrown);

            error.desc = desc;

        }

        //本地打印
        console.log('错误处理：'+JSON.stringify(error));

        //发到服务器
    };
    //String.prototype.toFixed = function(xxx) {
    //    var xxx = xxx || 2;
    //    var v = this.valueOf();
    //    return parseFloat(v).toFixed(xxx)
    //}

    /**
     * 时间格式化定义
     */
    var formatDate = function()
    {
        Date.prototype.format = function(format){
            /*
             * eg:format="yyyy-MM-dd hh:mm:ss";
             */
            if(!format){
                format = "yyyy-MM-dd hh:mm:ss";
            }
            var o = {
                "M+": this.getMonth() + 1, /* month*/
                "d+": this.getDate(), /* day*/
                "h+": this.getHours(), /* hour*/
                "m+": this.getMinutes(), /* minute*/
                "s+": this.getSeconds(), /* second*/
                "q+": Math.floor((this.getMonth() + 3) / 3), /* quarter*/
                "S": this.getMilliseconds()

            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" +o[k]).length));
                }
            }
            return format;
        };
    };

    /**
     * console重写，解决IE 等浏览器兼容性问题
     */
    var ReConsole = function()
    {
        window.console = window.console || (function(){
            var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};
            return c;
        })();

    };

    //是否存在指定函数
    var isExitsFunction =  function (funcName)
    {
        try {

            if (typeof(eval(funcName)) == "function")
            {
                return true;
            }
        } catch(e) {}

        return false;

    };


    //是否存在指定变量
    var isExitsVariable = function (variableName)
    {
        try {

            if (typeof(variableName) == "undefined")
            {
                return false;

            } else {

                return true;
            }

        } catch(e) {}

        return false;
    };

    $(document).on('click', '#branner .download', function() {
        // 关闭下载公告
        try {
            localStorage.setItem('is_show', true);
        } catch(e) {

        }
    });

    $(document).on('click', '#upgrade-bar .sui-close', function() {
        // 关闭升级公告
        try {
            localStorage.setItem('upgrade-version', CURRENT_VERSION);
        } catch(e) {

        }
    });

    // 修改密码的弹层 显示时
    $(document).on('shown', '#pwd-modal', function() {
        // 表单验证
        $('#pwd-form').validate({
            'success': function($form) {
                var data = $form.serializeArray();
                submitPwd(data);
            }
        });
    });

    // 修改密码的弹层 隐藏时
    $(document).on('hidden', '#pwd-modal', function() {
        // reset form
        $('#pwd-form')[0].reset();
    });

    // 在页面初始化的时候获取版本信息
    $(function() {
        $.ajax({
            type: 'get',
            url: getHost()+'/helpful/upgrade',
            dataType: 'json'
        }).done(function(rsp) {
            if (! (rsp.status && rsp.result.items.length)) {
                return null;
            }
            $('#upgrade-bar').find('.upgrade-title').empty().append(rsp.result.items[0].title).end().show();
            $('#upgrade').find('.upgrade-content').empty().append(rsp.result.items[0].content);

            if (rsp.result.items[0].tips_type == 200) {
                $('#upgrade-bar').hide();
            }
        });

    });
    //门店密码修改
    function submitPwd(data) {
        $.ajax({
            type: 'POST',
            data: data,
            url: getHost()+'/member/updatePwd',
            success:function(e) {
                var data = JSON.parse(e);
                console.log(data);
                if(data.status) {
                    layer.msg('密码修改成功！');
                    $('#pwd-modal').modal('hide');
                }else{
                    layer.msg('密码修改失败！');
                }
            }
        });
    }

  /*  $(function() {
        $.ajax({
            type: 'POST',
            //async:false,
            url: getHost()+"/store/getGrcode",
            success:function(e){
                if(e!=1) {
                if(e!=1) {
                    $("#grcode").attr("src",e);
                }
            }, error: function(XMLHttpRequest, textStatus) {
                console.log("status:"+XMLHttpRequest.status);
                console.log("state:"+XMLHttpRequest.readyState);
                console.log("text:"+textStatus);
            }
        });
    });*/

    return {
        doTinit: doTinit,
        getHost:getHost,
        exeError:exeError,
        formatDate:formatDate,
        ReConsole:ReConsole,
        isExitsVariable:isExitsVariable,
        isExitsFunction:isExitsFunction
     
    };
});
