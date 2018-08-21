/**
 * vue初始化
 * @type {Vue}
 */
var vm = new Vue({
  el:"#content",
  data:{
    shopUrl:"",
    dataLst:[],
    flag:'',
    msgSwitch:'',
    maxNum:'',
  }
})

//获取设置进行展示
$(function () {
  //获取当前商家ID
  var url = window.location.href;
  var strs = url.split("=");
  vm.shopUrl=strs[strs.length - 1];

  $.ajax({
    type: "post",
    url: "/jk51b/getSmsFeeSet",
    data:{siteId:vm.shopUrl},
    dataType: "json",
    success: function(data) {
      if(data.status=='OK'){
        if(data.data){
          vm.msgSwitch = data.data.msgSwitch;
          vm.flag = 1;
          var codelst2 = $("[name='code']");
          var codeLst = data.data.code.split(",");
          for(var c in codeLst){
//                    console.log(codeLst[c])
            for (var i in codelst2){
//                      console.log(codelst2[i].value)
              if(codeLst[c]==codelst2[i].value){
                codelst2[i].checked=true;
              }
            }
          }
        }else{
          vm.flag=0;
        }
      }
    },
    error: function() {
      console.log("请求失败！");
    }
  });

  //短信收费规则设置
  $.ajax({
    type: "post",
    url: "/jk51b/getSmsFeeRuleLst",
    data:{siteId:vm.shopUrl},
    dataType: "json",
    success: function(data) {
      if(data.status=='OK'){
        if(data.data){
          vm.dataLst = data.data;
          console.log(data.data[data.data.length-1])
          vm.maxNum= data.data[data.data.length-1].bigNum;
        }
      }
    }
  });

});

$("#save").click(function () {
  show();
});

var show = function () {
  var str = "";
  $("[name='code']:checked").each(function () {
    str += $(this).val() + ",";
  })
  //保存到数据库
  if(vm.flag==0){
    //代表新增
    addSmsFeeSet(str.substring(0,str.length-1));
  }else{
    //代表修改
    updSmsFeeSet(str.substring(0,str.length-1));
  }
}

var addSmsFeeSet = function (code) {
  $.ajax({
    type: "post",
    url: "/jk51b/addSmsFeeSet",
    data:{siteId:vm.shopUrl,code:code},
    dataType: "json",
    success: function(data) {
      if(data.status=='OK'){
        alert("添加成功！");
      }else {
        alert("添加失败！");
      }
      location.reload();
    },
    error: function() {
      console.log("添加失败！");
    }
  });
}

var updSmsFeeSet = function (code) {
  $.ajax({
    type: "post",
    url: "/jk51b/updSmsFeeSet",
    data:{siteId:vm.shopUrl,code:code},
    dataType: "json",
    success: function(data) {
      if(data.status=='OK'){
        alert("修改成功！");
      }else {
        alert("修改失败！");
      }
      location.reload();
    },
    error: function() {
      console.log("修改失败！");
    }
  });
}

var addSmsFeeRuleShow = function () {
  $("#modal-addSmsFeeRule").modal("show");
}

var addSmsFeeRule = function () {
  var smlNum = $(".smlNum").val();
  var bigNum = $(".bigNum").val();
  if(smlNum>=bigNum){
    alert("起始值不能大于终点值！");
    return;
  }
  if(vm.maxNum){
    if(smlNum<=vm.maxNum){
      alert("起始值必须大于上条数据的最大值！");
      return;
    }
  }
  var fee = $(".fee").val();
  $(".fee").val(fee*100);
  var params = $("#frm-addSmsFeeRule").serialize();
  $.ajax({
    type: "post",
    url: "/jk51b/addSmsFeeRule",
    data:params,
    dataType: "json",
    success: function(data) {
      if(data.status=='OK'){
        alert("添加成功！");
      }else {
        alert("添加失败！");
      }
      location.reload();
    }
  });
}

var updSmsFeeRuleShow = function (_this) {
  var id = $(_this).attr('data-id');
  var siteId = $(_this).attr('data-siteId');
  var fee = $(_this).attr('data-fee');
  var smlNum = $(_this).attr('data-smlNum');
  var bigNum = $(_this).attr('data-bigNum');
  $(".smlNum").val(smlNum);
  $(".bigNum").val(bigNum);
  $(".fee").val(fee/100);
  $(".id").val(id);
  $("#modal-updSmsFeeRule").modal("show");
}

var updSmsFeeRule = function () {
  var smlNum = $(".smlNum").val();
  var bigNum = $(".bigNum").val();
  if(smlNum>=bigNum){
      alert("起始值不能大于终点值！");
      return;
  }
  if(vm.maxNum){
    if(smlNum<=vm.maxNum){
      alert("起始值必须大于上条数据的最大值！");
      return;
    }
  }
  var fee = $(".fee").val();
  $(".fee").val(fee*100);
  var params = $("#frm-updSmsFeeRule").serialize();
  $.ajax({
    type: "post",
    url: "/jk51b/updSmsFeeRule",
    data:params,
    dataType: "json",
    success: function(data) {
      if(data.status=='OK'){
        alert("修改成功！");
      }else {
        alert("修改失败！");
      }
      location.reload();
    }
  });
}

var del = function (_this) {
  var id = $(_this).attr('data-id');
  var siteId = $(_this).attr('data-siteId');
  if( confirm("确认删除吗?")){
    $.ajax({
      type: "post",
      url: "/jk51b/delSmsFeeRule",
      data:{siteId:siteId,id:id},
      dataType: "json",
      success: function(data) {
        if(data.status=='OK'){
          alert("已经删除");
          location.reload();
        }
      }
    });

  }
}
