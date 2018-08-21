
$(function () {
  getPlanList();
});

function getPlanList(pageNum, pageSize){
  var data = {pageNum:pageNum, pageSize:pageSize};
  AlertLoading($("#plan_list"));
  $.ajax({
    type: 'post',
    url: '/merchant/planList',
    data: data,
    dataType: 'json',
    success: function (data) {
      if(data.status == "ERROR"){
        layer.msg(data.message);
        return;
      }

      clearTime();

      $("#plan_list").empty();
      var tmpl = document.getElementById('templateDetail').innerHTML;
      var doTtmpl = doT.template(tmpl);
      var tr= doTtmpl(data);
      $("#plan_list").append(tr);

      $(".pageinfo").pagination({
        itemsCount: data.pageInfo.total,
        pageSize: data.pageInfo.pageSize,
        currentPage: data.pageInfo.pageNum,
        displayPage: 6,
        displayInfoType: "itemsCount",
        styleClass: ['pagination-large'],
        showCtrl: true,
        onSelect: function (num) {
          getPlanList(num, data.pageInfo.pageSize);
        }
      });
    },
    error: function () {
      console.log("error ....");
    }
  });
};

function getPlanDetail(id) {
    $.ajax({
      type: 'post',
      url: '/merchant/planDetail',
      data: {id:id},
      dataType: 'json',
      success: function (data) {
        if(data.status == "ERROR"){
          layer.msg(data.message);
          return;
        }
        $("#planDetail").empty();
        var tmpl = document.getElementById('planDetailTemplate').innerHTML;
        var doTtmpl = doT.template(tmpl);
        var tr= doTtmpl(data);
        $("#planDetail").append(tr);
        $("#planDetailTip").modal('show');
      },
      error: function () {
        console.log("error ....");
      }
    });
}

function planStopOrDel(id,flag) {
    var tip = "";
    var data = {};
    data.id = id;
    if(flag == 0){
      data.planStop = 1;
      tip = "停用";
    }else if(flag == 1){
      data.planDelete = 1;
      tip = "删除";
    }
    $.confirm({
      title: '确认',
      body: "您确认"+ tip +"吗？",
      backdrop: false,
      okHide: function() {
          var flag = false;
          $.ajax({
            type: 'post',
            url: '/merchant/stopOrDelPlan',
            data: data,
            dataType: 'json',
            async: false,
            success: function (data) {
              if(data.status == "ERROR"){
                layer.msg(data.message);
                return;
              }

              clearTime(id);

              window.location.href = "/merchant/planListView";
            },
            error: function () {
              console.log("error ....");
            }
          });
          return flag;
      }
    });
}

function getExecutorClerks(id, storeId) {
    // alert(storeId);
    $.ajax({
      type: 'post',
      url: '/merchant/planClerks',
      data: {id:id, storeId:storeId},
      dataType: 'json',
      success: function (data) {
        if(data.status == "ERROR"){
          layer.msg(data.message);
          return;
        }
        $("#planClerks").empty();
        var tmpl = document.getElementById('planClerksTemplate').innerHTML;
        var doTtmpl = doT.template(tmpl);
        var tr= doTtmpl(data);
        $("#planClerks").append(tr);
        $("#planClerksTip").modal('show');
      },
      error: function () {
        console.log("error ....");
      }
    });
};


function cutstr(str, len) {
  var str_length = 0;
  var str_len = 0;
  str_cut = new String();
  str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4
      str_length++;
    }
    str_cut = str_cut.concat(a);
    if (str_length >= len) {
      str_cut = str_cut.concat("...");
      return str_cut;
    }
  }
  //如果给定字符串小于指定长度，则返回源字符串；
  if (str_length < len) {
    return str;
  }
};


function clearTime(id) {
  if(id){
    // alert($("span[name='countDownId_" + id + "']").attr("val"));
    window.clearInterval($("span[name='countDownId_" + id + "']").attr("val"));
  }else {
    $("span[name^='countDownId_']").each(function () {
      // alert($(this).attr("val"));
      window.clearInterval($(this).attr("val"));
    });
  }
};

function changeEndTime(id, serverTime, expireTime){
  var t = Math.max(expireTime - serverTime, 0);
  var days = padleft(parseInt(t / 1000 / 60 / 60 / 24 , 10));
  var hours = padleft(parseInt(t / 1000 / 60 / 60 % 24 , 10));
  var minutes = padleft(parseInt(t / 1000 / 60 % 60, 10));
  var seconds = padleft(parseInt(t / 1000 % 60, 10));
  var milliSeconds = padleft(parseInt(t % 1000, 10));
  var interval = window.setInterval(function(){initData(id);}, 100);

  var timeStr = days>0?"剩余"+days+"天:"+hours+":"+minutes+":"+seconds+"."+milliSeconds:"剩余"+hours+":"+minutes+":"+seconds+"."+milliSeconds;
  var timeElement = '<span name="countDownId_' + id + '" val="' + interval + '" st="' + serverTime + '" et="' + expireTime + '">' + timeStr + '</span>';
  return timeElement;
};

function initData(id){
  // alert(id + " -- " + $("span[name='countDownId_" + id + "']").html());
  if($("span[name='countDownId_" + id + "']")){
    var serverTime = Math.floor(parseInt($("span[name='countDownId_" + id + "']").attr("st"))/100) + 1;
    var expireTime = Math.floor(parseInt($("span[name='countDownId_" + id + "']").attr("et"))/100);
    var t = Math.max(expireTime - serverTime, 0);
    var s = Math.floor(t/10);
    var o = Math.floor(s/60);
    var a = Math.floor(o/60);
    var i = Math.floor(a/24);

    i%=365;
    a=this.padleft(a%24);
    o=this.padleft(o%60);
    s=this.padleft(Math.floor(s%60));
    t%=10;

    var days = i;
    var hours = a;
    var minutes = o;
    var seconds = s;
    var milliSeconds = t;
    var timeStr = days>0?"剩余"+days+"天:"+hours+":"+minutes+":"+seconds+"."+milliSeconds:"剩余"+hours+":"+minutes+":"+seconds+"."+milliSeconds;
    $("span[name='countDownId_" + id + "']").attr("st", serverTime*100);
    $("span[name='countDownId_" + id + "']").empty();
    $("span[name='countDownId_" + id + "']").append(timeStr);
  }
};

function padleft(num){
  return num<10?"0"+num:num;
};


