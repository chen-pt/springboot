/**
 * cookie 操作模块
 * Created by boren on 15/5/9.
 */
define(function(){
    /**
     *
     * @param c_name
     * @param value
     * @param expiredays （过期天数）
     */
   var setCookie =  function (c_name,value,expiredays)
    {
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
    };
    var getCookie = function (c_name)
    {
        if (document.cookie.length>0)
        {
            c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1)
            {
                c_start=c_start + c_name.length+1;
                c_end=document.cookie.indexOf(";",c_start);
                if (c_end==-1) c_end=document.cookie.length;
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return "";
    };

    return {
        setCookie:setCookie,
        getCookie:getCookie
    };
});
