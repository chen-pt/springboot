$(document).ready(function () {
  getcommentList();
  //回车搜索
  $(document).keyup(function(event){
    if(event.keyCode ==13){
      getcommentList();
    }
  });

  $(document).on('click', '.comment_status', function () {
    var commentId = $(this).attr("commentId");
    var isShow = $(this).attr("isShow");
    $.ajax({
      type: 'POST',
      url: "/merchant/updateState",
      data: {commentIds: [commentId], isShow: isShow},
      dataType: 'text',
      success: function (data) {
        location.reload();
      },
      error: function () {
        console.log("error ....");
      }
    })

  });
  //批量隐藏
  $('.hidden_all_btn').live("click",function()
  {
    var commentIds = [];
    $("input[name='gid']").each(function () {
      if ($(this).attr("checked")) {
        commentIds.push($(this).val());
      }
    });
    $.ajax({
      type: 'POST',
      url: "/merchant/updateState",
      data: {commentIds: commentIds, isShow:0},
      dataType: 'text',
      success: function (data) {
        location.reload();
      },
      error: function () {
        console.log("error ....");
      }
    })
  });
  // $('[name="gid"]').live("click",function () {
  //     if($('[name="gid"]:checked').length != tradesObj.nowPageSize){
  //       $('.select_all_btn').attr("checked", false);
  //       $('.select_all_btn').parent().removeClass("checked");
  //     }else{
  //       $('.select_all_btn').attr("checked", true);
  //       $('.select_all_btn').parent().addClass("checked");
  //     }
  // });
  $(".show_all_btn").bind("click", function () {
    var commentIds = [];
    $("input[name='gid']").each(function () {
      if ($(this).attr("checked")) {
        commentIds.push($(this).val());
      }
    });
    $.ajax({
      type: 'POST',
      url: "/merchant/updateState",
      data: {commentIds: commentIds, isShow: 1},
      dataType: 'text',
      success: function (data) {
        location.reload();
      },
      error: function () {
        console.log("error ....");
      }
    })
  })

  $(".hidden_all_btn").bind("click", function () {
    var commentIds = [];
    $("input[name='gid']").each(function () {
      if ($(this).attr("checked")) {
        commentIds.push($(this).val());
      }
    });
    $.ajax({
      type: 'POST',
      url: "/merchant/updateStateAll",
      data: {commentIds: commentIds, isShow: 1},
      dataType: 'text',
      success: function (data) {
        location.reload();
      },
      error: function () {
        console.log("error ....");
      }
    })
  })
});
function getcommentList() {

  var start = $("#start_time").val().trim();
  var end = $("#end_time").val().trim();
  if(end!=''&& start>end){
    alert("开始时间不可以大于结束时间");
    return ;
  }

  var datas = {};
  datas.commentContent = $("#comment_content").val().trim();
  datas.commentRank = $("#comment_rank").val();
  datas.isShow = $("#is_show").val();
  datas.startTime = $("#start_time").val().trim();
  var date = new Date($("#end_time").val().trim());
  if($("#end_time").val()!='')
  {
    var mon = date.getMonth()+1;
    var formatDate =  date.getFullYear()+"-"+(mon<10?('0'+mon):mon)+"-"+(date.getDate()+1);
    datas.endTime=formatDate;
  }else{
    datas.endTime = $("#end_time").val().trim();
  }

  datas.pageSize = pagination_pagesize;
  datas.pageNum = pagination_page_no;

  $("#comment_table").empty();
  AlertLoading($("#comment_table"));
  $.ajax({
    type: 'POST',
    url: "/merchant/commentlist",
    data: datas,
    dataType: 'json',
    success: function (data) {
      console.log(data);
      pagination_pages = data.pages;
      pagination_totals = data.total;

      var tmpHtml = "";
      if(data.list==null || data.list.length==0){
        $("#comment_table").html('<div>暂无数据</div>');
        return ;
      }
      for (var i = 0; i < data.list.length; i++) {
        var obj = data.list[i];
        var commentRank = "";
        if (obj.commentRank == '1') {
          commentRank = "很差";
        } else if (obj.commentRank == '2') {
          commentRank = "较差";
        } else if (obj.commentRank == '3') {
          commentRank = "一般";
        } else if (obj.commentRank == '4') {
          commentRank = "较好";
        } else if (obj.commentRank == '5') {
          commentRank = "非常好";
        }
        tmpHtml += "<tr><td>" +
          "<label data-toggle='checkbox' class='checkbox-pretty inline'>" +
          "<input  type='checkbox' name='gid' value='" + obj.commentId + "' onclick=checkItem(this,'all')>" +
          "<span style='float:left;'></span>" + commentRank + "</label>" +
          "</td><td>" +
          "<span style='float:left;text-align: left;'>" + obj.commentContent + "</span></td>" +
          "<td>" +
          "<span style='float:left;text-align: left;'>" +
          "" + obj.goodsTitle + "（"+obj.goodsCode +"）</span>" +
          "</td><td>" + timeToDate(obj.createTime) + "</td><td>" +
          "<span style='color:#6bc5a4'>" + (obj.isShow == 1 ? "显示" : "隐藏") + "</span></td><td>" +
          "<a href='javascript:void(0)' class='margin-right-10 comment_status' onclick='isShow("+(obj.isShow == 0 ? 1 : 0)+","+obj.commentId+")' isShow='" + (obj.isShow == 0 ? 1 : 0) + "' commentId='" + obj.commentId + "'>" + (obj.isShow == 0 ? "显示" : "隐藏") + "评价</a>" +
          "<a href='/merchant/orderDetail?tradesId=" + obj.tradesId + "'>查看订单</a></td></tr>";
      }
      $("#comment_table").html(tmpHtml);
      $("#comment_table").append("<tr><td colspan='6'><span class='pageinfo'></span></td></tr>");

      addpage(getcommentList);

      $('.select_all_btn').attr("checked", false);
      $('.select_all_btn').parent().removeClass("checked");

    },
    error: function () {
      console.log("error ....");
    }
  });
}
function timeToDate(time){
    var timestamp4 = new Date(time);
    return timestamp4.toLocaleDateString().replace(/\//g, "-") + " " + timestamp4.toTimeString().substr(0, 8);
}

Date.prototype.toLocaleString = function () {
  return this.getYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
};

function isShow(is_show, commentId) {
  var data = {
    "commentId": commentId,
    "is_show": is_show
  };
  $.ajax({
    type: 'POST',
    url: "/merchant/isShow",
    data: data,
    dataType: 'json',
    success: function (data) {
      console.log(data);
      select(1, 15);
    },
    error: function () {
      console.log("error ....");
    }
  });
}
// var tradesObj = {
//    nowPageSize:""
// }

function checkAll(e, itemName)
{
  var aa = document.getElementsByName(itemName);
  for (var i=0; i<aa.length; i++)
    aa[i].checked = e.checked;
}
function checkItem(e, allName)
{
  var all = document.getElementsByName(allName)[0];
  if(!e.checked){
    $(".select_all_btn").attr("checked", false);
    $('.select_all_btn').parent().removeClass("checked");

  } else
  {
    var aa = document.getElementsByName(e.name);
    for (var i=0; i<aa.length; i++)
      if(!aa[i].checked) return;
    $(".select_all_btn").attr("checked", true);
    $('.select_all_btn').parent().addClass("checked");

  }
}



