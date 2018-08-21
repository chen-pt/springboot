
  var curPage = 1;
  var totalNum = 0;
  var pageSize = 15;

  /**
   * 初始化动作
   */
  $(function () {

    $("title").html("会员列表");

    getMemebers();

    // initHtml();
    /**
     *查看所有会员
     */
    $("#member_list_index_all_search").click(function (){
      location.reload();
    })

    /**
     *搜索
     */
    $("#member_list_index_search").click(function (){
      curPage=1;
      totalNum = 0;
      pageSize = 15;
      getMemebers();
    })

    /**
     * 改变个数
     */
  $(document).on('change', '.page_size_select',function () {
    curPage=1;
    totalNum = 0;
    pageSize = $(this).val();

    getMemebers();
  })

  })

 /**
  * 获取membersList
  * @param pageIndex
  * @param pageSize
  * @param mobile
  * @param invite_code
  * @param date_start
  * @param date_end
  */
 function getMemebers() {
   // 加载数据动画
   function AlertLoading(dom){
     dom.parent().css('position','relative');
     //dom给需要的标签内 加 效果
     var load =
       '<div class="sk-circle" style="position: absolute; top: 50%;left: 50%;">'+
       '<div class="sk-circle1 sk-child"></div>'+
       '<div class="sk-circle2 sk-child"></div>'+
       '<div class="sk-circle3 sk-child"></div>'+
       '<div class="sk-circle4 sk-child"></div>'+
       '<div class="sk-circle5 sk-child"></div>'+
       '<div class="sk-circle6 sk-child"></div>'+
       '<div class="sk-circle7 sk-child"></div>'+
       '<div class="sk-circle8 sk-child"></div>'+
       '<div class="sk-circle9 sk-child"></div>'+
       '<div class="sk-circle10 sk-child"></div>'+
       '<div class="sk-circle11 sk-child"></div>'+
       '<div class="sk-circle12 sk-child"></div>'+
       '</div>';
     dom.append(load);   //loading追加到tbody之后
   }
   AlertLoading($("#member_list"));
   // $("#member_list").html('<tr><td colspan="8" style="text-align:center;">数据正在加载中。。。</td></tr>');
   var member_list_html="";

   var mobile = $("#mobile").val();
   var invite_code= $("#invite_code").val();
   var date_start= $("#date_start").val();
   var date_end = $("#date_end").val();


   $.post("/store/member/getMemberList",
     {
       pageIndex : curPage,
       pageSize : pageSize,
       mobile: mobile,
       inviteCode : invite_code,
       dateStart : date_start,
       dateEnd : date_end
     },
     function (result) {
       $("#member_list").html('');
       if(result.status == 1 ){

         if(!result.memberCount>0){

           $("#member_list").html("<tr><td colspan='8' style='text-align:center;'>暂无数据</td></tr>");
           pagination_pages = 1;
           pagination_totals = 0;
           itemsCount = 0;
           //$("#vip_table").html(tmpHtml);
           $("#pagediv").html("<span class='pageinfo'></span>")
           //addpage(emptyList);
           $('.select_all_btn').attr("checked", false);
           $('.select_all_btn').parent().removeClass("checked");

         }else{
           var list = result.members;
           totalNum = result.memberCount;

           $("#last_page_index").html(result.pageCount);
           $("#page_count").html("共" + result.pageCount + "页");
           $("#row_count").html("("+result.memberCount+"条记录)");

           for(var i =0; i < list.length; i++){
             var member = list[i];

             var last_time = formatTime(member.lastTime ,"yyyy-MM-dd hh:mm:ss");

             member_list_html +=
               "<tr> " +
               "<td>"+isExistzj(member.mobile)+"</td> " +
               "<td> "+isExistzj(member.name)+"  </td> " +
               "<td>"+formatTime(member.createTime,"yyyy-MM-dd hh:mm:ss")+"</td> " +
               "<td>"+(isEmpty(member.inviteCode) ? "" : (member.inviteCode.indexOf("_") > 0 ? member.inviteCode.split("_")[1] : member.inviteCode))+"</td> " +
               "<td>"+ isExistzj(member.adminName)+"</td> " +
               "<td> "+(isEmpty(last_time) ? "0000-00-00 00:00:00" : last_time)+"</td> " +
               "<td>"+isExistzj(member.integrate)+"</td> " +
               "<td> <a class='sui-btn btn-small btn-primary' href='/store/member/updatemember/" + member.memberId + "'>修改</a> </td> " +
               "</tr> ";


           }

           $("#member_list").html(member_list_html);
           $("#pagediv").html("<span class='pageinfo'></span>")

           //addpage(getMemebers);
           $('.pageinfo').pagination({
             pages: result.pageCount,
             styleClass: ['pagination-large'],
             showCtrl: true,
             displayPage: 6,
             currentPage: curPage,
             onSelect: function (num) {
               curPage = num;
               getMemebers();
             }
           });
           getNum();
         }

       }else{
         $("#member_list").html('<tr><td colspan="8" style="text-align:center;">请点击查看所有会员刷新重试或联系客服。。。。。。。。。。。</td></tr>');
       }

     });

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
   * Created by Administrator on 2017/3/21.
   */
  function parseDate(fDate) {

    if(fDate){
      var fullDate = fDate.split("-");

      return new Date(fullDate[0], fullDate[1]-1, fullDate[2], 0, 0, 0)
    }else {
      return "";
    }
  }

  function isExist(obj) {

    return isEmpty(obj) ? undefined : obj;

  }

  function isExistzj(obj) {

    return isEmpty(obj) ? "" : obj;

  }

  function isEmpty(val) {

    return val == undefined || val == null || val == "";
  }

  function formatTime(time,format) {

    if(time){
      try {
        var date = new Date(time);
        var paddNum = function(num){
          num += "";
          return num.replace(/^(\d)$/,"0$1");
        }
        //指定格式字符
        var cfg = {
          yyyy : date.getFullYear() //年 : 4位
          ,yy : date.getFullYear().toString().substring(2)//年 : 2位
          ,M  : date.getMonth() + 1  //月 : 如果1位的时候不补0
          ,MM : paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
          ,d  : date.getDate()   //日 : 如果1位的时候不补0
          ,dd : paddNum(date.getDate())//日 : 如果1位的时候补0
          ,hh : paddNum(date.getHours())  //时
          ,mm : paddNum(date.getMinutes()) //分
          ,ss : paddNum(date.getSeconds()) //秒
        }
        format || (format = "yyyy-MM-dd hh:mm:ss");
        return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
      }catch (e){
        return time;
      }
    }else {
      return "";
    }
  }






