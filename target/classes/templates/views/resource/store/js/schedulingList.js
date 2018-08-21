/**
 * Created by admin on 2017/4/13.
 */
$(document).ready(function () {

  // 初始化插件
  getList();

  $("#search_store_btn").click(function () {
    pagination_page_no = 1;
    select();
  });
  select();
  $("#find_btn").click(function () {
    pagination_page_no = 1;
    select();
  });
});
function select() {
  var param = {
    // "siteId":100030,
    "doctorName": $("#name").val(),
    "userCateid": $("#userCateid").val(),
    "status": $("#statues").val(),
    "startTime": $("#start_last_time").val(),
    "endTime": $("#end_last_time").val(),
    "pageSize":pagination_pagesize,
    "pageNum":pagination_page_no
  };
  console.log($("#userCateid").val());
  $.ajax({
    type: 'post',
    url: '/management/schedulingList',
    dataType: 'json',
    data:param,
    success: function (data) {
      console.log(data);


      $("#template-list").html('');
      if (data.value.total > 0) {
        pagination_pages = data.value.pages;
        pagination_totals = data.value.total;
        var tmpl = document.getElementById('templateList').innerHTML;
        var doTtmpl = doT.template(tmpl);
        var temps = doTtmpl(data.value);
        $("#template-list").html(doTtmpl(data.value));
        temps += "<tr><td colspan='9'><span class='pageinfo'></span></td></tr>";
        $("#template-list").html(temps);
        addpage(select);
      }
    },
    error: function () {
      console.log("error .....");
    }
  });
}

function getList() {
  $.ajax({
    url:'/merchant/categories',
    type:'POST',
    success: function (data) {
      if (data.status === "success") {
        var obj = data.result.children[8].children;
        console.log(obj);
        var optionstring = '<option value="">全部</option>';
        for (var i = 0;i<obj.length;i++) {
          optionstring += "<option value=\"" + obj[i].cateId + "\" >" + obj[i].cateName + "</option>";
        }
        $("#userCateid").html(optionstring);
      }
    },
    error: function (data) {
      alert("获取分类失败！");
    },
  });
}

function transform(obj){
  var arr = [];
  for(var item in obj){
    arr.push(obj[item]);
  }
  return arr;
}


function  dataFormat (date, fmt){
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
