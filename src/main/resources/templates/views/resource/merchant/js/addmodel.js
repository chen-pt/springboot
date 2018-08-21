/**
 * Created by Administrator on 2017/4/21.
 */

var ACCOUNT = {};


ACCOUNT.GetNum = {

  settings: {
    //modalID: '#modal-slider',
  },
  init: function () {
    this.ajaxGetList();
    this.even();
  },
  even: function () {

  },
  ajaxGetList: function () {


    var reward_id=getUrlParam("id");
    if(reward_id==null){
      $.ajax({
        type: 'post',
        url: "/recommend/linkWithRecruit",
        data: datas,
        dataType: 'json',
        success: function (data) {
          var rule = eval('(' + data.recruit.rule + ')');
          if(rule.level1==null || rule.level1==0){
            $("input[name=discountlevel1]").parent().parent().hide();
          }
          if(rule.level2==null || rule.level2==0){
            $("input[name=discountlevel2]").parent().parent().hide();
          }
          if(rule.level3==null || rule.level3==0){
            $("input[name=discountlevel3]").parent().parent().hide();
          }
          if(rule.level4==null || rule.level4==0){
            $("input[name=discountlevel4]").parent().parent().hide();
          }
          if(rule.level5==null || rule.level5==0){
            $("input[name=discountlevel5]").parent().parent().hide();
          }
        }
      });
        return ;
    }
    var datas = {

      "id":reward_id
    };
    console.log(datas);
    AlertLoading($("#detail-list"));
    $.ajax({
      type: 'post',
      url: "/recommend/updateAwardTemplate",
      data: datas,
      dataType: 'json',
      success: function (data) {
        var reward = eval('(' + data.value.reward + ')');
        var discount = eval('(' + data.value.discount + ')');
        var rule = eval('(' + data.value.rule + ')');
        $("input[name=id]").val(data.value.id);
        $("input[name=name]").val(data.value.name);
        if(rule.level1!=null && rule.level1!=0){
          if(discount.level1!="0"){
            $("input[name=discountlevel1]").val(discount.level1);
          }
        }else{
          $("input[name=discountlevel1]").parent().parent().hide();
        }
        if(rule.level2!=null && rule.level2!=0){
          if(discount.level2!="0") {
            $("input[name=discountlevel2]").val(discount.level2);
          }
        }else{
          $("input[name=discountlevel2]").parent().parent().hide();
        }
        if(rule.level3!=null && rule.level3!=0){
          if(discount.level3!="0") {
            $("input[name=discountlevel3]").val(discount.level3);
          }
        }else{
          $("input[name=discountlevel3]").parent().parent().hide();
        }
        if(rule.level4!=null && rule.level4!=0){
          if(discount.level4!="0") {
            $("input[name=discountlevel4]").val(discount.level4);
          }
        }else{
          $("input[name=discountlevel4]").parent().parent().hide();
        }
        if(rule.level5!=null && rule.level5!=0){
          if(discount.level5!="0") {
            $("input[name=discountlevel5]").val(discount.level5);
          }
        }else{
          $("input[name=discountlevel5]").parent().parent().hide();
        }

          if (data.value.type=="0"){

            $("#type-0").attr("checked","checked");
            $("#type-1").removeAttr("checked");

            $("input[name=reward_percentlevel1]").val(reward.level1);
           $("input[name=reward_percentlevel2]").val(reward.level2);
           $("input[name=reward_percentlevel3]").val(reward.level3);

          }
          else if(data.value.type=="1"){
            $("#type-1").attr("checked","checked");
            $("#type-0").removeAttr("checked");

            $("input[name=reward_staticlevel1]").val((reward.level1*0.01).toFixed(2));
            $("input[name=reward_staticlevel2]").val((reward.level2*0.01).toFixed(2));
            $("input[name=reward_staticlevel3]").val((reward.level3*0.01).toFixed(2));

        };


      }
    });
  }
};

ACCOUNT.init = function () {
  ACCOUNT.GetNum.init();
};
$(function () {
  ACCOUNT.init();
});

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}




function validate() {
  // var reg = new RegExp(/^([1-9]{1,2}|101)$/);
  var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
  var checkL1 = $("input[name=reward_percentlevel1]").val();
  var checkL2 = $("input[name=reward_percentlevel2]").val();
  var checkL3 = $("input[name=reward_percentlevel3]").val();


  if(checkL1=="" ||checkL2=="" || checkL3==""){
    alert("推荐人奖励为必填项")
    return false
  }

  if(checkL1==0 || checkL1==100 || !reg.test(checkL1)){
    alert("请输入0-100之间的数字！");
    return false
  }
  if(checkL1==0 || checkL1==100 || !reg.test((checkL2))) {
    alert("请输入0-100之间的数字！");
    return false
  }
  if(checkL1==0 || checkL1==100 || !reg.test((checkL3))) {
    alert("请输入0-100之间的数字！");
    return false
  }
}

function validate2() {
  var reg = new RegExp("^[0-9]*[1-9][0-9]*$");
  var checkY1 = ($("input[name=reward_staticlevel1]").val()*10*10).toFixed(0);
  var checkY2 = ($("input[name=reward_staticlevel2]").val()*10*10).toFixed(0);
  var checkY3 = ($("input[name=reward_staticlevel3]").val()*10*10).toFixed(0);
  if(!reg.test(checkY1)) {
    alert("请输入整数！");
    return false
  }
  if(!reg.test(checkY2)) {
    alert("请输入整数！");
    return false
  }
  if(!reg.test(checkY3)) {
    alert("请输入整数！");
    return false
  }
}

function validate3() {
  // var reg = new RegExp("^(\\d|[1-9]\\d|100)$");

  var reg = new RegExp(/^(\d{1,2}(\.\d{1,3})?|100)$/);
  var checkZ1 =  $("input[name=discountlevel1]").val()
  var checkZ2 =  $("input[name=discountlevel2]").val()
  var checkZ3 =  $("input[name=discountlevel3]").val()
  var checkZ4 =  $("input[name=discountlevel4]").val()
  var checkZ5 =  $("input[name=discountlevel5]").val()


  var arr=new Array()
  if (checkZ1 != null &&checkZ1 != ""){
    arr.push(checkZ1);
  }
  if (checkZ2 != null &&checkZ2 != ""){
    arr.push(checkZ2);
  }
  if (checkZ3 != null &&checkZ3 != ""){
    arr.push(checkZ3);
  }
  if (checkZ4 != null &&checkZ4 != ""){
    arr.push(checkZ4);
  }
  if (checkZ5 != null &&checkZ5 != ""){
    arr.push(checkZ5);
  }


  for (var i = 0; i < arr.length; i++)
  {
    var index=i;
    index++;
    var min=arr[i];
    var max=arr[index];

    if  (min*1<max*1){
      alert("建议推荐人折扣比例依次递减,例如T1>T2")
      break;
    }
  }

  if (checkZ1 == '' || checkZ1 == undefined || checkZ1 == null){
    return

  }else{
    if(checkZ1==0 || checkZ1==100 || !reg.test(checkZ1)) {
      alert("请输入0-100之间的数字！");
      return false
    }
  }

  if (checkZ2 == '' || checkZ2 == undefined || checkZ2 == null){
    return

  }else{
    if(checkZ2==0 || checkZ2==100 || !reg.test(checkZ2)) {
      alert("请输入0-100之间的数字！");
      return false
    }
  }

  if (checkZ3 == '' || checkZ3 == undefined || checkZ3 == null){
    return

  }else{
    if(checkZ3==0 || checkZ3==100 || !reg.test(checkZ3)) {
      alert("请输入0-100之间的数字！");
      return false
    }
  }

  if (checkZ4 == '' || checkZ4 == undefined || checkZ4 == null){
    return

  }else{
    if(checkZ4==0 || checkZ4==100 || !reg.test(checkZ4)) {
      alert("请输入0-100之间的数字！");
      return false
    }
  }

  if (checkZ5 == '' || checkZ5 == undefined || checkZ5 == null){
    return true

  }else{
    if(checkZ5==0 || checkZ5==100 || !reg.test(checkZ5)) {
      alert("请输入0-100之间的数字！");
      return false
    }
  }
}


function submitForm() {
  var val=$('input:radio[name="type"]:checked').val();
  // alert(val)
  if(val==0){
    var result=validate();
    if (result==false)
      return
    var result2=validate3();
    if (result2==false)
      return

    var  datas={
      "name": $("input[name=name]").val(),
      "id":$("input[name=id]").val(),
      "type":0,
      "level1": $("input[name=reward_percentlevel1]").val(),
      "level2": $("input[name=reward_percentlevel2]").val(),
      "level3": $("input[name=reward_percentlevel3]").val(),

      "discountlevel1": $("input[name=discountlevel1]").val(),
      "discountlevel2": $("input[name=discountlevel2]").val(),
      "discountlevel3": $("input[name=discountlevel3]").val(),
      "discountlevel4": $("input[name=discountlevel4]").val(),
      "discountlevel5": $("input[name=discountlevel5]").val(),
    }
  }
  else{
    var result=validate2();
    if (result==false)
      return
    var result2=validate3();
    if (result2==false)
      return
    var  datas={
      "name": $("input[name=name]").val(),
      "id":$("input[name=id]").val(),
      "type":1,
      "level1": $("input[name=reward_staticlevel1]").val()*100,
      "level2": $("input[name=reward_staticlevel2]").val()*100,
      "level3": $("input[name=reward_staticlevel3]").val()*100,

      "discountlevel1": $("input[name=discountlevel1]").val(),
      "discountlevel2": $("input[name=discountlevel2]").val(),
      "discountlevel3": $("input[name=discountlevel3]").val(),
      "discountlevel4": $("input[name=discountlevel4]").val(),
      "discountlevel5": $("input[name=discountlevel5]").val(),
    }
  }
  $.ajax({
    url: "/recommend/addAwardTemplate",
    type: "post",
    dataType: "JSON",
    data:datas ,
    success: function (result) {
      if (result == 200) {
        alert("操作成功");
        window.location.href="/recommend/awards_templates";

      }
      else alert("系统维护中，请稍后重试+");
    },
    error: function (e) {
      alert("系统维护中，请稍后重试")
    }
  });
}
