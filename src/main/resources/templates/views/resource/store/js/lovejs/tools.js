/**
 * Created by boren on 15/7/1.
 * 常用功具包
 */
define(function(){

  /**
   * 检验函数
   * @param type  检验类型如：member,email,gt,lt
   * @param obj  string
   * @param value gt,lt 时用
   */
  var validate = function(type,obj,value)
  {
    var validate_result = false;
    var reg;
    switch (type)
    {
      //验证数字
      case  'member':{
        reg = new RegExp("^[0-9]*$");
        if(reg.test(obj))
        {
          validate_result = true;
        }
      };break;
      //验证手机号
      case 'mobile':
      {
        reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(reg.test(obj))
        {
          validate_result = true;
        }
      };break;
      //大于某个数
      case 'gt':{
        if(parseInt(obj)>parseInt(value))
        {
          validate_result = true;
        }
      };break;
      //小于某个数
      case 'lt':{
        if(parseInt(obj)<parseInt(value))
        {
          validate_result = true;
        }
      };break;
      //最大长度
      case 'max':{
        if(getStringLength(obj)<=parseFloat(value))
        {
          validate_result = true;
        }
      };break;
      //最小长度
      case 'min':{
        if(getStringLength(obj)>=parseFloat(value))
        {
          validate_result = true;
        }
      };break;
      //汉字
      case 'cmax':
      {
        if(obj.length!=0){

          reg=/^[\u4E00-\u9FA5]+$/;

          if(reg.test(obj)&&getStringLength(obj)<=parseFloat(value)){

            validate_result = true;
          }
        }

      };break;
      //汉字
      case 'cmin':
      {
        if(obj.length!=0){

          reg=/^[\u4E00-\u9FA5]+$/;

          if(reg.test(obj)&&getStringLength(obj)>=parseFloat(value)){

            validate_result = true;
          }
        }

      };break;
      //身份证
      case 'idcard':{

        var ident = IdentityCodeValid(obj);

        if(ident){

          validate_result = true;

        }
      };break;
      //邮箱帐号
      case 'email': {

        if(obj.length!=0){

          reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

          if(reg.test(obj)){

            validate_result = true;

          }
        }

      };break;
      //qq
      case 'qq': {

        reg = /^\d{5,15}$/;

        if (reg.test(obj)) {

          validate_result = true;
        }

      };break;
    }
    //console.log('type:'+type+'  obj:'+obj+'  val:'+value+ '  result:'+validate_result);
    return validate_result;

  };

  /**
   * 身份证号合法性验证
   * @returns
   * @constructor
   */
  var IdentityCodeValid = function (num) {

    num = num.toUpperCase();

    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)))
    {
      //输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或
      //console.log('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或');
      return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //下面分别分析出生日期和校验位
    var len, re;
    len = num.length;
    if (len == 15)
    {
      re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
      var arrSplit = num.match(re);

      //检查生日日期是否正确
      var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
      var bGoodDay;
      bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
      if (!bGoodDay)
      {
        //('输入的身份证号里出生日期不对！');
        return false;
      }
      else
      {
        //将15位身份证转成18位
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var nTemp = 0, i;
        num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
        for(i = 0; i < 17; i ++)
        {
          nTemp += num.substr(i, 1) * arrInt[i];
        }
        num += arrCh[nTemp % 11];
        return true;
      }
    }
    if (len == 18)
    {
      re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
      var arrSplit = num.match(re);

      //检查生日日期是否正确
      var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
      var bGoodDay;
      bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
      if (!bGoodDay)
      {
        //('输入的身份证号里出生日期不对！');
        return false;
      }
      else
      {
        return true;
      }
    }
    return false;
  };

  /**
   * 取字符串长度，包括中文
   * @param
   * @returns {number}
   */
  var getStringLength = function(s){

    var char_length = 0;

    for (var i = 0; i < s.length; i++){

      var son_char = s.charAt(i);

      encodeURI(son_char).length > 2 ? char_length += 1 : char_length += 0.5;

    }

    console.log(s+" length:"+char_length);

    return char_length;
  };


  /**
   *设置cookie
   * @param c_name
   * @param value
   * @param expiredays （过期天数）
   */
  var setCookie =  function (c_name,value,expiredays){

    var exdate=new Date();

    exdate.setDate(exdate.getDate()+expiredays);

    document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());

  };

  /**
   * 取 cookie
   * @param c_name
   * @returns {string}
   */
  var getCookie = function (c_name){

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
    validate: validate,
    getStringLength:getStringLength,
    setCookie:setCookie,
    getCookie:getCookie

  };
});
