/**
 * Created by bigFeng on 2017/4/10...
 */
$(document).ready(function () {
  select();

  $("#find_btn").click(function () {
    pagination_page_no = 1;
    select();
  });
});


function select(){
  var param = {
    "pageSize":pagination_pagesize,
    "pageNum":pagination_page_no
  };
  $.ajax({
    type:'post',
    url:'/management/querySchedulingMax',
    data:param,
    dataType: 'json',
    success: function(data) {
      console.log(data);
      var uri = location.search;
      var day = window.location.search.substr(uri.lastIndexOf("=")+1,uri.length);
      $("#days").val(day);
      pagination_pages = data.value.pages;
      pagination_totals = data.value.total;
      var obj = transform(data.value.list);
      for(var i =0;i<obj.length;i++){
        var obj2 = transform(obj[i]);
        for (var j =0;j<obj2[0].length;j++){
          obj2[0][j].startTime = dataFormat(new Date(obj2[0][j].startTime),"hh:mm");
          obj2[0][j].endTime = dataFormat(new Date(obj2[0][j].endTime),"hh:mm:")
        }
      }
      var tmpl = document.getElementById('templateList').innerHTML;
      var doTtmpl = doT.template(tmpl);
      var temps =doTtmpl(obj);
      $("#template-list").html(doTtmpl(data.value.list));
      temps += "<tr><td colspan='9'><span class='pageinfo'></span></td></tr>";
      $("#template-list").html(temps);
      addpage(select);
    },
    error:function(){
      console.log("error .....");
    }
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

function _choose(templateNo) {
  alert(templateNo);
}



