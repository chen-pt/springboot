/**
 * Created by Administrator on 2017/3/28.
 */

function verfiyMobile(mebile) {

  var  reg =/^[1][0-9][0-9]{9}$/;

  return reg.test(mebile);

}

function verfiyIdCard(num) {

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

}

function verfiyEmail(email) {

  var  reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return reg.test(email);

}

//判断日期类型是否为YYYY-MM-DD格式的类型
function verfiyDate(birthday){
  if(birthday.length!=0){
    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
    var r = str.match(reg);
    return r != null;
  }else{
    return false;
  }
}

function verfiyQQ(qq) {

  return RegExp(/^[1-9][0-9]{4,9}$/).test(qq);

}

function verfiyCode(code) {

  return RegExp(/^[0-9]{4,6}$/).test(code);

}

function verfiyInvitCode(invit_code) {

  return RegExp(/^[0-9]{5}$/).test(invit_code);

}




