
/**
 * Created by Administrator on 2018/4/8.
 */

//加载查询
$.ajax({
  type: "post",
  url: "/merchant/discount/getDiscountRuleLineBySiteId",
  success: function(data) {
    if(data.status==0){
      var ruleMap=data.ruleMap;
      if (ruleMap != null){
        //          document.getElementById('discount_type').value=ruleMap.discount_type;//优惠形式
        document.getElementById('total_fee').value=numNullReturn(ruleMap.total_fee);//累计优惠总额
        document.getElementById('day_total_fee').value=numNullReturn(ruleMap.day_total_fee);//每日优惠总额
        // document.getElementById('total_money').innerText=numNullReturn(ruleMap.total_money);//优惠总额
        // document.getElementById('total_money_day').innerText=numNullReturn(ruleMap.total_money_day);//每日优惠总额
        document.getElementById('discount_desc').value=ruleMap.discount_desc;//规则描述
        document.getElementById('discount_start_time').value=new Date(ruleMap.discount_start_time).Format("yyyy-MM-dd hh:mm");//开始时间
        document.getElementById('discount_end_time').value=new Date(ruleMap.discount_end_time).Format("yyyy-MM-dd hh:mm");//结束时间

        //优惠规则回显
        var rule_val = JSON.parse(ruleMap.rule_val);
        for (var i = 0; i < rule_val.length;i++){
          if (JSON.parse(rule_val[i]).index == 1){
            document.getElementById('free_one').value=numNullReturn(JSON.parse(rule_val[i]).man_start);
            document.getElementById('free_two').value=numNullReturn(JSON.parse(rule_val[i]).man_end);
            document.getElementById('free_three').value=numNullReturn(JSON.parse(rule_val[i]).jian_start);
            document.getElementById('free_fore').value=numNullReturn(JSON.parse(rule_val[i]).jian_end);
            document.getElementById('free_five').value=numNullReturn(JSON.parse(rule_val[i]).point);
          }

          if (JSON.parse(rule_val[i]).index == 2){
            document.getElementById('free_seven').value=numNullReturn(JSON.parse(rule_val[i]).man_start);
            document.getElementById('free_eight').value=numNullReturn(JSON.parse(rule_val[i]).man_end);
            document.getElementById('free_nine').value=numNullReturn(JSON.parse(rule_val[i]).jian_start);
            document.getElementById('free_ten').value=numNullReturn(JSON.parse(rule_val[i]).jian_end);
            document.getElementById('free_eleven').value=numNullReturn(JSON.parse(rule_val[i]).point);
          }

          if (JSON.parse(rule_val[i]).index == 3){
            document.getElementById('free_twelve').value=numNullReturn(JSON.parse(rule_val[i]).man_start);
            document.getElementById('free_thirteen').value=numNullReturn(JSON.parse(rule_val[i]).man_end);
            document.getElementById('free_fourteen').value=numNullReturn(JSON.parse(rule_val[i]).jian_start);
            document.getElementById('free_fiveteen').value=numNullReturn(JSON.parse(rule_val[i]).jian_end);
            document.getElementById('free_sixteen').value=numNullReturn(JSON.parse(rule_val[i]).point);
          }
        }


      }else {
        document.getElementById('discount_start_time').value=new Date().Format("yyyy-MM-dd hh:mm");//开始时间
        document.getElementById('discount_end_time').value=new Date().Format("yyyy-MM-dd ")+"23:59";//结束时间
      }
      console.log(ruleMap);
    }
    else {
      alert("查询异常，请联系管理员")
    }

  },
  error: function() {
    console.log("请求失败！");
  }
});

//编辑
function add_sure() {
  var discount_type = 1;
//      var discount_type = $("#youhui_phone").attr("status_value");
  var total_fee = numNull($("#total_fee").val());
  var day_total_fee = numNull($("#day_total_fee").val());
  var discount_start_time = $("#discount_start_time").val();
  var discount_end_time = $("#discount_end_time").val();
  var discount_desc = {
    "pc_desc":$("#discount_desc").val(),
    "wx_desc":$("#discount_desc").val().split("/nn/")
  }

  //第一组满减
  var first_obj = {
    "man_start":numNull($("#free_one").val()),
    "man_end":numNull($("#free_two").val()),
    "jian_start":numNull($("#free_three").val()),
    "jian_end":numNull($("#free_fore").val()),
    "point":numNull($("#free_five").val()),
    "index":1
  }
  //第二组满减
  var second_obj = {
    "man_start":numNull($("#free_seven").val()),
    "man_end":numNull($("#free_eight").val()),
    "jian_start":numNull($("#free_nine").val()),
    "jian_end":numNull($("#free_ten").val()),
    "point":numNull($("#free_eleven").val()),
    "index":2
  }
  //第三组满减
  var third_obj = {
    "man_start":numNull($("#free_twelve").val()),
    "man_end":numNull($("#free_thirteen").val()),
    "jian_start":numNull($("#free_fourteen").val()),
    "jian_end":numNull($("#free_fiveteen").val()),
    "point":numNull($("#free_sixteen").val()),
    "index":3
  }

  //满减对象
  var rule_val = []
  if (isNullObj(first_obj)){
    rule_val.push(isNullObj(first_obj))
  }
  if (isNullObj(second_obj)){
    rule_val.push(isNullObj(second_obj))
  }
  if (isNullObj(third_obj)){
    rule_val.push(isNullObj(third_obj))
  }


  if($("#total_fee").val() == "" || $("#total_fee").val() == null){
    alert("请输入：累计优惠总额");
  }
  else if ($("#total_fee").val() != "" && numNull($("#total_fee").val()) > 9999999900){
    alert("请输入：累计优惠总额最大值为 99999999");
  }
  else if($("#day_total_fee").val() == "" || $("#day_total_fee").val() == null){
    alert("请输入：每日优惠总额");
  }
  else if(numNull($("#day_total_fee").val()) > numNull($("#total_fee").val())){
    alert("金额输入有误：每日优惠总额不能大于累计优惠总额");
  }
  else if (boolFullRuleOne() == 0 ){
    alert("请输入：至少一组完整的优惠规则");
  }
  else if(($("#free_one").val() !="" && $("#free_one").val() == 0)
    || ($("#free_two").val() !="" && $("#free_two").val() == 0)
    || ($("#free_three").val() !="" && $("#free_three").val() == 0)
    || ($("#free_fore").val() !="" && $("#free_fore").val() == 0)
    || ($("#free_seven").val() !="" && $("#free_seven").val() == 0)
    || ($("#free_eight").val() !="" && $("#free_eight").val() == 0)
    || ($("#free_nine").val() !="" && $("#free_nine").val() == 0)
    || ($("#free_ten").val() !="" && $("#free_ten").val() == 0)
    || ($("#free_twelve").val() !="" && $("#free_twelve").val() == 0)
    || ($("#free_thirteen").val() !="" && $("#free_thirteen").val() == 0)
    || ($("#free_fourteen").val() !="" && $("#free_fourteen").val() == 0)
    || ($("#free_fiveteen").val() !="" && $("#free_fiveteen").val() == 0)){
    alert("输入有误：输入金额必须大于0");
  }
  else if(($("#free_three").val() !="" && numNull($("#free_three").val()) > numNull($("#day_total_fee").val()))
    || ($("#free_fore").val() !="" && numNull($("#free_fore").val()) > numNull($("#day_total_fee").val()))
    || ($("#free_nine").val() !="" && numNull($("#free_nine").val()) > numNull($("#day_total_fee").val()))
    || ($("#free_ten").val() !="" && numNull($("#free_ten").val()) > numNull($("#day_total_fee").val()))
    || ($("#free_fourteen").val() !="" && numNull($("#free_fourteen").val()) > numNull($("#day_total_fee").val()))
    || ($("#free_fiveteen").val() !="" && numNull($("#free_fiveteen").val()) > numNull($("#day_total_fee").val()))){
    alert("输入有误：红包优惠金额不能大于每日优惠总额");
  }
  else if (isFullDat($("#free_one").val(),$("#free_two").val(),$("#free_three").val(),$("#free_fore").val(),$("#free_five").val()) == "Error"){
    alert("输入有误：请完善第一组优惠规则");
  }
  else if (isFullDat($("#free_seven").val(),$("#free_eight").val(),$("#free_nine").val(),$("#free_ten").val(),$("#free_eleven").val()) == "Error"){
    alert("输入有误：请完善第二组优惠规则");
  }
  else if (isFullDat($("#free_twelve").val(),$("#free_thirteen").val(),$("#free_fourteen").val(),$("#free_fiveteen").val(),$("#free_sixteen").val()) == "Error"){
    alert("输入有误：请完善第三组优惠规则");
  }
  else if (numNull($("#free_five").val())+numNull($("#free_eleven").val())+numNull($("#free_sixteen").val()) != 10000){
    alert("比例输入有误：单组或多组‘最高占每日总额’之和，必须等于100%");
  }
  else if(numNull($("#free_one").val())>numNull($("#free_two").val())
    || numNull($("#free_seven").val())>numNull($("#free_eight").val())
    ||numNull($("#free_twelve").val())>numNull($("#free_thirteen").val())){
    alert("金额输入有误：订单金额必须由小到大输入");
  }
  else if(numNull($("#free_three").val())>numNull($("#free_fore").val())
    || numNull($("#free_nine").val())>numNull($("#free_ten").val())
    ||numNull($("#free_fourteen").val())>numNull($("#free_fiveteen").val())){
    alert("金额输入有误：红包优惠金额必须由小到大输入");
  }
  else if(discount_start_time >= discount_end_time){
    alert("时间格式输入有误：结束时间需要大于开始时间！");
  }else {
    $.ajax({
      type: "post",
      url: "/merchant/discount/updateDiscountRuleLine",
      dataType: "json",
      data:{
        "discount_type":discount_type,
        "total_fee":total_fee,
        "day_total_fee":day_total_fee,
        "discount_start_time":discount_start_time,
        "discount_end_time":discount_end_time,
        "discount_desc":JSON.stringify(discount_desc),
        "rule_val":JSON.stringify(rule_val),
      },
      success: function(data) {
        if(data.status==0){
          alert("编辑成功")
          location.reload();
        }
        else {
          alert("添加异常，请联系管理员")
        }

      },
      error: function() {
        console.log("请求失败！");
      }
    });
  }
}

//控制输入日期大于当前日期
// $('#discount_end_time').datepicker({
//   startDate: new Date()
// });
// $('#discount_start_time').datepicker({
//   startDate: getNowFormatDate()
// });

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
}

//格式化时间
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds() //秒
  };
  if (/(y+)/.test(fmt)){ //根据y的长度来截取年
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o){
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  }
  return fmt;
}

//允许输入两位小数
function num(obj){
  obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
  obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字
  obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
  obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
  obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
}

function boolFullRuleOne() {
  var one = 0;
  if ($("#free_one").val() && $("#free_two").val()  && $("#free_three").val()  && $("#free_fore").val()  && $("#free_five").val() ){
    one++;
  }
  if ($("#free_seven").val()  && $("#free_eight").val()  && $("#free_nine").val()  && $("#free_ten").val()  && $("#free_eleven").val() ){
    one++;
  }
  if ($("#free_twelve").val()  && $("#free_thirteen").val()  && $("#free_fourteen").val()  && $("#free_fiveteen").val()  && $("#free_sixteen").val() ){
    one++;
  }
  return one;
}

//判断如果输入框为空，默认为0
function isNullNum(val) {
  if(val){
    return 0;
  }
  return val;
}

//判断如果数字框不为""就*100
function numNull(val) {
  if (val){
    return val*100;
  }
  return val;
}

//判断如果数字框不为""就/100
function numNullReturn(val) {
  if (val){
    return val/100;
  }
  return val;
}

//判断：规则不符合，不传参数
function isNullObj(obj) {
  if(obj.man_start!=null && obj.man_end!=null && obj.jian_start!=null && obj.jian_end!=null && obj.point!=null){
    return JSON.stringify(obj);
  }
}

//判断每一组优惠
function isFullDat(v1,v2,v3,v4,v5) {
  var count = 0;
  if (v1){count++;}
  if (v2){count++;}
  if (v3){count++;}
  if (v4){count++;}
  if (v5){count++;}
  if (0 < count && count < 5){
    return "Error";
  }
}
