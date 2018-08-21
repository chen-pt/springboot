/**
 * Created by boren on 15/8/20.
 */

/**
 * Created by boren on 15/7/1.
 * 基础包
 */
define(function (){
  $.ajaxSetup({
      'complete': function(rsp) {
        try {
          var data = JSON.parse(rsp.responseText);
          if (!data.status && typeof(data.result) != 'undefined') {
             if(data.result.code === 302) layer.confirm('您没有操作权限,无法使用该功能');
          }
        } catch(e) {

        }
      }
  });
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

    var vueInit = function(){
        Vue.config.debug = true;
        Vue.config.delimiters = ['<%', '%>'];
    }

  try {
    vueInit();
    ReConsole();
    doTinit();
  } catch (e) {
      // todo
  }

  function getControllerAction () {
    var url = window.location.pathname;
    var patten = /(\w+)\/(\w+)/;

    return url.match(patten).slice(1);
  }

  function getControllerActionTernary () {
    var url = window.location.pathname;
    var patten = /(\w+)\/(\w+)\/(\w+)/;

    return url.match(patten).slice(1);
  }

  function getQueryString(name)
  {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
  }

  return {
    doTinit: doTinit,
    getHost:getHost,
    exeError:exeError,
    formatDate:formatDate,
    ReConsole:ReConsole,
    isExitsVariable:isExitsVariable,
    vueInit:vueInit,
    isExitsFunction:isExitsFunction,
    getControllerAction: getControllerAction,
    getUrlParam: getQueryString,
    getControllerActionTernary:getControllerActionTernary
  };

});

