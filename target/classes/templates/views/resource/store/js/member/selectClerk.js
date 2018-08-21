/**
 * Created by aaron on 2017/3/20.
 */

var curPage = 1;
var totalNum = 0;
var pageSize = 15;
var type = "all";

var register_clerks;

$(function () {

  $("#selectClerkButton").click(function () {

    $("#clerk_name").val("");
    $("#invite_code_input").val("");
    getClerkList();

  })


  $('#selectClerkModal').on('okHide', function(e){console.log('okHide')})
  $('#selectClerkModal').on('okHidden', function(e){console.log('okHidden')})
  $('#selectClerkModal').on('cancelHide', function(e){console.log('cancelHide')})
  $('#selectClerkModal').on('cancelHidden', function(e){console.log('cancelHidden')})

  /**
   *搜索
   */
  $("#member_list_index_search").click(function (){
    curPage=1;
    totalNum = 0;
    pageSize = 15;
    type = "other";
    getMemebers();
  })

  /**
   * 改变个数
   */
  $(document).on('change', '.page_size_select',function () {
    curPage=1;
    totalNum = 0;
    pageSize = $(this).val();

    if(pageSize<=15){
      $("#selectClerk").removeAttr("class");
    }else{
      $("#selectClerk").addClass("modal-body");
    }

    getClerkList()
  })

  /**
   * 触发选择
   */
  $(document).on("click","[name='invit_code_button']",function () {

    $("#invite_code").val("");
    $("#invite_code").val(isEmpty($(this).val()) ? "" : $(this).val().split(":")[0]);

    try {
      register_clerks = isEmpty($(this).val()) ? undefined : $(this).val().split(":")[1];
    }catch (e){

    }


  })


})

function getClerkList() {

  var name = $("#clerk_name").val();
  var invite_code = $("#invite_code_input").val();

  $.post("/store/clerk/getClerks",
    {
      pageIndex : curPage,
      pageSize : pageSize,
      storeadmin_status : 1,
      name : isExist(name),
      clerk_invitation_code : isExist(invite_code),
    },
    function (result) {

      totalNum = result.data.page.count;

      $("#last_page_index").html(result.data.page.pageCount);
      $("#page_count").html("共" + result.data.page.pageCount + "页");
      $("#row_count").html("("+result.data.page.count+"条记录)");

      var clerkList =  result.data.clerkList;

      var changeStoreList = "";

      var clerkListHtml="<table class='sui-table table-bordered' style='margin-top: 10px;'> <thead> <tr> <th>邀请码</th> <th>店员名称</th> <th>手机号</th> <th>店员状态</th> <th>操作</th> </tr> </thead> <tbody id='clerk_list'>";


      for(var i=0;i<clerkList.length;i++){
        var clerkModel = clerkList[i];

        var clerk_invitation_code = clerkModel.clerk_invitation_code;
        var button_val = isEmpty(clerk_invitation_code) ? "" : (clerk_invitation_code.indexOf("_") > 0 ? clerk_invitation_code.split("_")[1] : clerk_invitation_code) + ":" +  clerkModel.id ;

        clerkListHtml += ("<tr> " +
          "<td>"+ (isEmpty(clerk_invitation_code) ? "" : (clerk_invitation_code.indexOf("_") > 0 ? clerk_invitation_code.split("_")[1] : clerk_invitation_code))  +"</td> " +
          "<td>"+ clerkModel.name +" </td> " +
          "<td>"+ clerkModel.mobile+" </td> " +
          "<td>"+(clerkModel.storeadmin_status ? '开启' : '关闭')+"</td> " +
          "<td> " +
              "<button type='button' data-ok='modal' class='sui-btn btn-primary btn-large btn-small clerk_select_ok' name='invit_code_button' onclick='' value='"+ button_val +"'>确定</button> " +
          "</td>  " +
          "</tr> ");
      }

      clerkListHtml +=" <tr><td colspan='8'><span class ='pageinfo' style='float: right'></span></td></tr></tbody> </table> </tbody></table>";

      $("#selectClerk").html(changeStoreList + clerkListHtml);

      $('.pageinfo').pagination({

        pages:  result.data.page.pageCount,
        styleClass: ['pagination-large'],
        showCtrl: true,
        displayPage: 6,
        currentPage: curPage,
        onSelect: function (num) {
          curPage = num;
          getClerkList();
        }

      });
      getNum();

    })

  function getNum(){
    $('.pageinfo').find('span:contains(共)').append("<span id='m_t_n'>(" + totalNum + "条记录)</span>");
    //页码选择
    var pagearr = [15,30,50,100];

    var pageselect = '<select class="page_size_select">';

    $.each(pagearr, function(){

      if(this==pageSize)
      {
        pageselect =pageselect+'<option value="'+this+'"  selected>'+this+'</option>';
      }else{
        pageselect =pageselect+'<option value="'+this+'">'+this+'</option>';
      }
    });

    pageselect = pageselect+'</select>&nbsp;';

    $('.pageinfo').find('span:contains(共)').prepend(pageselect);
  }

}

/**
 * 搜索店员
 */
function searchClerk() {

  curPage = 1;
  pageSize = 15;

  getClerkList();

}




