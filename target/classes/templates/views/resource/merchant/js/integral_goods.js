$(document).ready(function () {
  $(".content").css("overflow", "visible");
  /**
   * 商品列表页面所有文本框按回车时搜索商品
   */

  //回收站页面字段
  isrecycleBin();
  function isrecycleBin() {
    var statusInfo = $("input[name='status']").val();
    if (statusInfo == 4) {
      $("input[name='status']").next().next("span").html("已删除");
      $("input[name='status']").parent().parent().parent("span").attr("class", "sui-dropdown dropdown-bordered disabled");
      $(".putaway_batch_btn").attr("style", "display: none");
      $(".saleout_batch_btn").attr("style", "display: none");
      $(".restore_batch_btn").attr("style", "display: display");
    }

  }

  $('.more_condition_a').click(function () {
    $(".more_condition").each(function () {
      if ($(this).hasClass("lee_hide")) {
        $(this).removeClass("lee_hide");
      } else {
        $(this).addClass("lee_hide");
      }
    });
    if ($(".more_condition_a").html() == "隐藏更多条件") {
      $(".more_condition_a").html("显示更多条件");
      $(".need_three_row").each(function () {
        $(this).attr("rowspan", "1");
      });
    } else {
      $(".more_condition_a").html("隐藏更多条件");
      $(".need_three_row").each(function () {
        $(this).attr("rowspan", "3");
      });
    }
  })


  $("#delisting").click(function () {
    var goods_ids = new Array();
    var count=0;
    var sucnum=0;
    $('input[name="gid"]:checked').each(function () {
      count++;
      if($(this).attr("status") ==1){
        goods_ids.push($(this).val());
        sucnum++;
      }
    });
    goods_ids = goods_ids.join(',');
    if (count > 0) {
      if(sucnum > 0){
        if (confirm("确定要下架吗？")) {
          var url = "/merchant/batch/delisting";
          var datas = {};
          datas.goods_ids = goods_ids;
          $.post(url, datas, function (data) {
            //var data = JSON.parse(e);
            console.log(data);
            if (!data.status && typeof(data.result) == 'undefined') return false;
            $("#product_status").modal("show");
            $("#product_status .lee_status_table").empty();
            if (data.status) {
              if (data.result.fail_num == 0) {
                $("#product_status .lee_status_ts").html("恭喜，成功下架" + data.result.success_num + "个。");
              } else {
                $("#product_status .lee_status_ts").html("下架成功" + data.result.success_num + "个，失败" + data.result.fail_num + "个。");
                $("#product_status .lee_status_table").appendChild("<tr><td>商品标题</td><td>失败原因</td></tr>");
                for (var i = 0, len = data.result.error_list; i < len; i++) {
                  $("#product_status .lee_status_table").appendChild("<tr><td>" + data.result.error_list[i].goods_id + "</td><td>" + data.result.error_list[i].reason + "</td></tr>");
                }
              }
              $('#putarray_sure').prev('#hard-up').remove();
            }
          });
        }
      }else{
        layer.confirm('所选商品均以下架啦！', {
          btn: ['确定'] //按钮
        }, function () {
          setTimeout(function () {
            layer.closeAll('dialog');
            getgoodsList();
          }, 0)
        });
      }
    } else {
      alert("请先选择商品！");
    }
  });


  $(".restore_batch_btn").click(function () {
    var goods_ids = new Array();
    $('input[name="gid"]:checked').each(function () {
      goods_ids.push($(this).val());
    });
    goods_ids = goods_ids.join(',');
    if (goods_ids.length > 0) {
      if (confirm("确定要还原吗？")) {
        var url = "/merchant/batch/delisting";
        var datas = {};
        datas.goods_ids = goods_ids;
        $.post(url, datas, function (data) {
          //var data = JSON.parse(e);
          console.log(data);
          if (!data.status && typeof(data.result) == 'undefined') return false;
          $("#product_status").modal("show");
          $("#product_status .lee_status_table").empty();
          if (data.status) {
            if (data.result.fail_num == 0) {
              $("#product_status .lee_status_ts").html("恭喜，成功还原" + data.result.success_num + "个。");
            } else {
              $("#product_status .lee_status_ts").html("还原成功" + data.result.success_num + "个，失败" + data.result.fail_num + "个。");
              $("#product_status .lee_status_table").appendChild("<tr><td>商品标题</td><td>失败原因</td></tr>");
              for (var i = 0, len = data.result.error_list; i < len; i++) {
                $("#product_status .lee_status_table").appendChild("<tr><td>" + data.result.error_list[i].goods_id + "</td><td>" + data.result.error_list[i].reason + "</td></tr>");
              }
            }
            $('#putarray_sure').prev('#hard-up').remove();
          }
        });
      }
    } else {
      alert("请先选择商品！");
    }
  });


  $("#listing").click(function () {
    var goods_ids = new Array();
    var ids=new Array();
    var fails=0;
    var sucnum=0;
    var dis="";
    $('input[name="gid"]:checked').each(function () {
      ids.push($(this).val());
      if(!$(this).attr("hash")){
        fails++;
      }else{
        goods_ids.push($(this).val());
        sucnum++;
      }
    });
    goods_ids = goods_ids.join(',');
    ids=ids.join(',');
    if (ids.length > 0) {
      if(fails >0){
        dis="有"+fails+"个商品缺少图片,无法上架!";
      }
      if(sucnum >0){
        layer.confirm(dis+" 确定要上架吗", {title: '提示', icon: 3}, function (index) {

          var url = "/merchant/batch/listing";

          var datas = {};

          datas.goods_ids = goods_ids;

          $.post(url, datas, function (data) {

            // var data = JSON.parse(e);
            console.log(data);

            if (!data.status && typeof(data.result) == 'undefined') return false;

            $("#product_status").modal("show");

            $("#product_status .lee_status_table").empty();

            $('#putarray_sure').prev().empty();

            if (data.result.fail_num == 0) {
              $("#product_status .lee_status_ts").html("恭喜，成功上架" + data.result.success_num + "个。");
            } else {
              $("#product_status .lee_status_ts").html("成功上架" + data.result.success_num + "个,"+"失败"+data.result.fail_num+"个");
              getgoodsList();
            }
          });
          layer.close(index);
        });
      }else{
        layer.confirm('所选商品均无图片，无法上架！', {
          btn: ['确定'] //按钮
        }, function () {
          setTimeout(function () {
            layer.closeAll('dialog');
            getgoodsList();
          }, 0)
        });
      }
    } else {
      alert("请先选择商品！");
    }

  });


  var changeBuyWay;  //存储所有选中的id
  //批量修改购买方式,获取并校验选中的商品的id
  $("#modify").click(function () {
    // $("#batcHChangeByWay").reset(); //使用前清空
    // $("#change_buyWay").show();
    changeBuyWay = new Array();
    $('input[name="gid"]:checked').each(function () {
      changeBuyWay.push($(this).val());  //push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
    });
    var len = changeBuyWay.length;
    changeBuyWay = changeBuyWay.join(',');
    console.log(changeBuyWay);
    if (len <= 0) { //选中的数量小于等于零
      alert("请先选择商品！");
    } else {
      layer.confirm(" 确定要修改吗", {title: '提示', icon: 3}, function (index) {
        layer.close(index);
        $("#change_buyWay").modal("show");
        $("#remindNum").html("您已选中"+"<font color='red'>"+len+"</font>"+"个商品，统一修改成以下购买方式：")
      });
    }
  });

  //提交表单
  $(".set-userPoint-qs").click(function () {
    // $('#change_buyWay').modal('hide');  //关闭窗口
    // alert(changeBuyWay);
    // console.log(changeBuyWay);
    var cpuByWay = $("input[name='cpuByWay']").val(); //电脑购买
    var phoByWay = $("input[name='phoByWay']").val(); //移动购买
    var datas = {};
    datas.cpuByWay = cpuByWay;
    datas.phoByWay = phoByWay;
    datas.changeBuyWay = changeBuyWay;

    if ((cpuByWay == null || cpuByWay == "") && (phoByWay == null || phoByWay == "")) {
      $("#selectOne").html("<font color='red'>请至少选择一项</font>");
      // alert("请至少选择一项!")
      // return false;
    }else{
      $('#change_buyWay').modal('hide');  //关闭窗口
      $.ajax({
        type: 'POST',
        url: "/merchant/batch/buyWay",
        data:datas,
        dataType: 'json',

        success: function(data){
          console.log(data);
          var result1 = data.result;
          console.log(result1);
          // totalNum = result.total;
          // console.log(totalNum);
          // $("#product_table").empty();
          if(result1 == "success"){
            // $("#product_table").append("<tr><td colspan='8' style='text-align: center'>暂无数据</td></tr>");
            alert("批量修改成功!")
            location.reload();
            return;
          }else{
            alert("批量修改失败!")
          }
        },
        error:function(){
          console.log("error ....");
        }
      });
    }
  });


  //批量参加积分商城
  var joinIds;
  $(".join_batch_btn").click(function () {
    $("input[name='startTime']").val("");
    $("input[name='endTime']").val("");
    $("#limit").val("");
    $("#limitBtn").attr("checked",true);
    joinIds = new Array();
    $('input[name="gid"]:checked').each(function () {
      joinIds.push($(this).val());
    });
    joinIds = joinIds.join(',');
    if (joinIds.length > 0) {
      var comm="";
      comm+=" <input type='hidden' value='20'' name='joinType'>";
      comm+="<p>";
      comm+="设置所有添加商品的统一积分兑换汇率";
      comm+="</p>";
      comm+="1 元<span id='commonPrice'>=</span>"+
        "<input type='text' value='1'  id='integral_price' style='border:1px solid lightgrey; width: 40px' />积分(请输入正整数)";
      $("#commonTitle").html(comm);
      $("#join_integralGoods").modal("show");
    } else {
      alert("请先选择商品！");
    }
  });



  $(".join_integral").live("click",function () {
    $("#integral_price").val("");
    $("input[name='startTime']").val("");
    $("input[name='endTime']").val("");
    $("#limit").val("");
    $("#limitBtn").attr("checked",true);
    var goods_id=$(this).attr("goodsid");
    var goodsPrice=$(this).attr("goodsPrice");
    joinIds = "";
    joinIds=goods_id;
    var comm="";
    comm+=" <input type='hidden' value='10'' name='joinType'>";
    comm+="<p>";
    comm+="当前商品价格:"+(goodsPrice / 100).toFixed(2)+"元";
    comm+="</p>";
    comm+="兑换积分数额:"+
      "<input type='text'  id='integral_price' style='border:1px solid lightgrey; width: 40px' />积分(请输入正整数)";
    $("#commonTitle").html(comm);
    $("#join_integralGoods").modal("show");
  });

  $(".checkNum").live('click',function () {
    joinIds = new Array();
    var nums=0;
    $('input[name="gid"]:checked').each(function () {
      joinIds.push($(this).val());
      nums++;
    });
    if(nums>0){
      $("#checkNum").text("商品选择(已选"+nums+")");
      $("#checkNum").css("display","inline-block");
    }else{
      $("#checkNum").css("display","none");
    }

  });


  $("#limit").keyup(function () {
    var limit=$("#limit").val();
    if(limit){
      $("#limitBtn").attr("checked",false);
    }else{
      $("#limitBtn").attr("checked",true);
    }
  });

  $("#limitBtn").click(function () {
    if($(this).attr("checked")){
      $("#limit").val("");
    }
  });

  $("#join_integralGoods_ok").click(function () {
    var reg = /^\+?[1-9]\d*$/;
    var parities=$("#integral_price").val();
    var limit=$("#limit").val();
    var startTime=$("input[name='startTime']").val();
    var endTime=$("input[name='endTime']").val();
    var joinType=$("input[name='joinType']").val();
    if(!reg.test(parities)){
      alert('请输入大于0的正整数');
      return false;
    }

    if(!$("#limitBtn").attr("checked")){
      if(!reg.test(limit) && limit !=""){
        alert('请输入大于0的正整数');
        return false;
      }
    }

    var datas = {};
    datas.goods_ids=joinIds;
    datas.parities=parseInt(parities);
    datas.limit_each=limit;
    datas.start_time=startTime;
    datas.end_time=endTime;
    datas.join_type=joinType;
    var url="/merchant/product/join";
    $.post(url,datas,function (e) {
      console.log(e);
      var data=JSON.parse(e);


        $("#product_status .lee_status_table").empty();
        if (data.status) {
          if (data.result.failNum == 0) {
            $("#product_status .lee_status_ts").html("恭喜，成功参加积分商品" + data.result.successNum + "个。");
          } else {
            $("#product_status .lee_status_ts").html("参加成功" + data.result.successNum + "个，失败" + data.result.failNum + "个。");
            $("#product_status .lee_status_table").append("<tr><td style='color: red'>商品标题</td><td style='color: red'>失败原因</td></tr>");
            for (var i = 0, len = data.result.recode.length; i < len; i++) {
              $("#product_status .lee_status_table").append("<tr><td>"+data.result.recode[i].goodsName + "</td><td>" + data.result.recode[i].reason+"</td></tr>");
            }
          }
          $("#product_status").modal("show");
          $('#putarray_sure').prev('#hard-up').remove();

        //location.reload();
      }else{
        alert("操作失败")
      }
    })

  });


  $("#set_parities").live("click",function () {
    $("#integral_price").attr("readOnly",false);
    $("#integral_price").focus();
    $("#integral_price").val("");
    $("#off_span").css("display","inline-block");
  });

  $("#off").live("click",function () {
    $("#integral_price").attr("readOnly",true);
    $("#integral_price").blur();
    $("#integral_price").val("1.00");
    $("#off_span").css("display","none");
  });


  $(".restore").live("click", function () {
    var goodsid = $(this).attr("goodsid");
    if (goodsid) {
      if (confirm("确定要还原吗？")) {
        var url = "/merchant/batch/delisting";
        var datas = {};
        datas.goods_ids = goodsid;
        $.post(url, datas, function (data) {
          //var data = JSON.parse(e);
          console.log(data);
          if (!data.status && typeof(data.result) == 'undefined') return false;
          $("#product_status").modal("show");
          $("#product_status .lee_status_table").empty();
          if (data.status) {
            if (data.result.fail_num == 0) {
              $("#product_status .lee_status_ts").html("恭喜，成功还原" + data.result.success_num + "个。");
            } else {
              $("#product_status .lee_status_ts").html("还原成功" + data.result.success_num + "个，失败" + data.result.fail_num + "个。");
              $("#product_status .lee_status_table").appendChild("<tr><td>商品标题</td><td>失败原因</td></tr>");
              for (var i = 0, len = data.result.error_list; i < len; i++) {
                $("#product_status .lee_status_table").appendChild("<tr><td>" + data.result.error_list[i].goods_id + "</td><td>" + data.result.error_list[i].reason + "</td></tr>");
              }
            }
            $('#putarray_sure').prev('#hard-up').remove();
          }
        });
      }
    } else {
      alert("还原失败");
    }
  });


  $(".goodsdelisting").live("click", function () {
    var goodsid = $(this).attr("goodsid");
    if (goodsid) {
      if (confirm("确定要下架吗？")) {
        var url = "/merchant/batch/delisting";
        var datas = {};
        datas.goods_ids = goodsid;
        $.post(url, datas, function (data) {
          //var data = JSON.parse(e);
          console.log(data);
          if (!data.status && typeof(data.result) == 'undefined') return false;
          $("#product_status").modal("show");
          $("#product_status .lee_status_table").empty();
          if (data.status) {
            if (data.result.fail_num == 0) {
              $("#product_status .lee_status_ts").html("恭喜，成功下架" + data.result.success_num + "个。");
            } else {
              $("#product_status .lee_status_ts").html("下架成功" + data.result.success_num + "个，失败" + data.result.fail_num + "个。");
              $("#product_status .lee_status_table").appendChild("<tr><td>商品标题</td><td>失败原因</td></tr>");
              for (var i = 0, len = data.result.error_list; i < len; i++) {
                $("#product_status .lee_status_table").appendChild("<tr><td>" + data.result.error_list[i].goods_id + "</td><td>" + data.result.error_list[i].reason + "</td></tr>");
              }
            }
            $('#putarray_sure').prev('#hard-up').remove();
          }
        });
      }
    } else {
      alert("下架失败");
    }
  });


  $(".goodlisting").live("click", function () {
    var goodsid = $(this).attr("goodsid");
    var imageId = $(this).attr("imageId");
    if(!imageId){
      alert("请先添加图片！！");
      return false;
    }else{
      if (goodsid) {
        layer.confirm("确定要上架吗", {title: '提示', icon: 3}, function (index) {

          var url = "/merchant/batch/listing";

          var datas = {};
          datas.goods_ids = goodsid;

          $.post(url, datas, function (data) {
            // console.log(data);
            if (!data.status && typeof(data.result) == 'undefined') return false;

            $("#product_status").modal("show");

            $("#product_status .lee_status_table").empty();

            $('#putarray_sure').prev().empty();

            if (data.result.fail_num == 0) {
              $("#product_status .lee_status_ts").html("恭喜，成功上架" + data.result.success_num + "个。");

            } else {

              $("#product_status .lee_status_table").append("<tr><th>商品标题</th><th>失败原因</th><th>无法强制上架的原因</th></tr>");

              var num = 0;

              var hard = 0;

              var goods_id = new Array();

              for (var i = 0, len = data.result.error_list.length; i < len; i++) {

                if (data.result.error_list[i].hard_msg && data.result.error_list[i].hard_msg != '无' && data.result.error_list[i].goods_status != 1) { //不可强制上架
                  num += 1;
                } else {
                  goods_id.push(data.result.error_list[i].goods_id);
                }
                if (data.result.error_list[i].goods_status == 1) {
                  hard = hard + 1;  //已经上架成功的个数
                } else {//<a href='product_add?gid=" + data.result.error_list[i].goods_id + "' target='_blank'>
                  $("#product_status .lee_status_table").append("<tr><td><a href='javascript:void(0);'>" + data.result.error_list[i].name + "</a></td><td>" + data.result.error_list[i].reason + "<span style='color:red;margin-left:20px'>x</span></td><td>" + data.result.error_list[i].hard_msg + "</td></tr>");
                }
              }
              var no = (parseInt(data.result.fail_num) - parseInt(num) - parseInt(hard));
              if (no <= 0) {
                no = 0
              }
              $("#goods_id_str").val(goods_id.join(','));
              $("#product_status .lee_status_ts").html("上架成功" + data.result.success_num + "个，失败" + data.result.fail_num + "个。<label style='color: #FF0000;'></label>");
              pagination_page_no = 1;
              getgoodsList();
            }
          });

          layer.close(index);
        });

      } else {
        alert("请先选择商品！");
      }
    }

  });


  $(document).on('click', '.sui-dropdown-menu a', function () {
    var $target = $(this),
      $li = $target.parent(),
      $container = $target.parents('.sui-dropdown, .sui-dropup'),
      $menu = $container.find("[role='menu']")
    if ($li.is('.disabled, :disabled')) {
      return
    }
    if ($container.is('.disabled, :disabled')) {
      return
    }
    $container.find('input').val($target.attr('value') || '').trigger('change')
    $container.find('[data-toggle=dropdown] span').html($target.text())
    $menu.find('.active').removeClass('active')
    $li.addClass('active')
    $li.parents('[role=presentation]').addClass('active')
  });

  getgoodsList();

  //商品还原
  /*  function productRestore(product_goods_ids) {
   console.log("product_goods_ids:" + product_goods_ids);

   if (product_goods_ids) {

   if (confirm("确定要还原吗？")) {

   var url = core.getHost() + "/admin/bshop/product_restore_ajax";

   var datas = {};

   datas.goods_ids = product_goods_ids;

   $.post(url, datas, function (e) {

   var data = JSON.parse(e);

   $("#product_status").modal("show");
   $("#product_status .lee_status_table").empty();

   if (data.result.error.num == 0) {
   $("#product_status .lee_status_ts").html("恭喜，成功还原" + data.result.success.num + "个。");
   } else {

   $("#product_status .lee_status_ts").html("还原成功" + data.result.success.num + "个，失败" + data.result.error.num + "个。");
   $("#product_status .lee_status_table").appendChild("<tr><td>商品标题</td><td>失败原因</td></tr>");

   for (var i = 0, len = data.result.error.success_list; i < len; i++) {
   $("#product_status .lee_status_table").appendChild("<tr><td>" + data.result.error.success_list[i].name + "</td><td>" + data.result.error.success_list[i].message + "</td></tr>");
   }
   }
   });
   }
   } else {
   alert("请先选择商品！");
   }
   }*/

  /*  //还原商品
   $(".restore_btn").live("click",function() {
   var goods =$(this).parents("tr").find("input[name='goods_id']").val();
   productRestore(goods);
   });

   //批量还原商品
   $(".restore_batch_btn").live("click",function() {
   var goods = "";
   $("input[name='gid']:checkbox:checked").each(function(){
   goods += $(this).parents("tr").find("input[name='goods_id']").val()+",";
   });
   goods = goods.replace(/(,*$)/g,"");
   productRestore(goods);
   });*/

  $('#search_report').click(function () {
    exportProductList();
  })


  $(document).keyup(function(event){
    if(event.keyCode ==13){
      getgoodsList();
    }
  });

});

function getgoodsList() {
  var datas = {};
  var classify = $("input[name='classify']").val();
  datas.userCateid = classify > 0 ? classify : "";

  datas.goodsTitle = $("input[name='goods_title']").val().trim();
  //datas.bar_code_status = $("input[name='bar_code_status']").val();

  datas.barCode = $("input[name='bar_code_status']").val();

  datas.barCodeValue=$("input[name='bar_code']").val();

  datas.drugName = $("input[name='drug_name']").val().trim();

  datas.drugCategory=$("input[name='drug_category']").val().trim();

  datas.approvalNumber = $("input[name='approval_number']").val().trim();

  var hasImg = $("input[name='has_pic']").val();

  if (!hasImg) {
    datas.hasImage = -1;
  } else {
    datas.hasImage = hasImg;
  }

  var goodstatus = $("input[name='status']").val();

  if (!goodstatus) {
    datas.goodsStatus = 0;      //goodsStatus:0查询状态1：上架，2：下架（避免查询到4：已删除商品）
  } else {
    datas.goodsStatus = goodstatus;
  }

  //datas.goodsStatus = $("input[name='status']").val();

  datas.goodsProperty = $("input[name='goods_property']").val();

  datas.startPrice = ($("input[name='price_small']").val() ? $("input[name='price_small']").val().trim() * 100 : "0");
  datas.endPrice = ($("input[name='price_large']").val() ? $("input[name='price_large']").val().trim() * 100 : "99999999");
  datas.brandName = $("input[name='brand_name']").val().trim();

  datas.detailTpl = $("input[name='detail_tpl']").val();

  datas.purchaseWay = $("input[name='purchase_way']").val();

  datas.wxPurchaseWay = $("input[name='wx_purchase_way']").val();

  datas.goodsCode = $("input[name='goods_code']").val();


  datas.startRow = pagination_page_no;
  datas.pageSize = pagination_pagesize;

  //$("#product_table").html("<tr><td colspan='8' style='text-align: center'>数据正在加载中。。。</td></tr>");
  $("#product_table").empty();
  AlertLoading($("#product_table"));
  $.ajax({
    type: 'POST',
    url: "/merchant/bgoodsList",
    data: datas,
    dataType: 'json',
    success: function (data) {
      console.log(1);
      console.log(data);
      $("#product_table").empty();
      var goodsResult = data.goodsPage;
      pagination_pages = goodsResult.pages;
      pagination_totals = goodsResult.total;

      if (goodsResult.list.length <= 0) {
        $("#product_table").html("<tr><td colspan='8' style='text-align: center'>暂无数据</td></tr>");
        return;
      }
      var tmpHtml = "";
      for (var i=0;i<goodsResult.list.length;i++){
        var goods=goodsResult.list[i];
        var imageId =goods.imgHash;
        var imageIdurl=imageId? imgLink(imageId,100,100,'.jpg'):'/templates/views/resource/merchant/img/empty.jpg';
        console.log(imageIdurl,'imageIdurl');
        var updateTime=(new Date(parseFloat(goods.updateTime.toString()))).format("yyyy-MM-dd hh:mm:ss");
        var statusStr = "";
        switch (goods.goodsStatus) {
          case 1:
            statusStr = "<span class='goodsdelisting'  goodsId=" + goods.goodsId + ">上架</span>";
            break;

          case 2:
            statusStr = "<span class='goodlisting'  goodsId=" + goods.goodsId + " imageId=" + imageId + ">下架</span>";
            break;

          case 3:
            statusStr = "违规";
            break;

          case 4:
            statusStr = "<span class='restore' goodsId='" + goods.goodsId + "' style='color:red'>已删除</span>";
            break;
        }
        $("#bar_code_input").val(goods.barCode);
        tmpHtml += "<tr><td><label data-toggle='checkbox' class='checkbox-pretty inline'>" +
          "<input type='checkbox' name='gid' status='"+goods.goodsStatus+"' class='checkNum'  hash='"+goods.imgHash+"' value='" + goods.goodsId + "'>" +
          "<span>" +
          "<a href='/merchant/productImgEdit?goods_id=" + goods.goodsId + "' target='_blank'><img class='product_img' style='padding: 0 !important;'  src='" + imageIdurl + "' /></a>" +
          "</span>" +
          "</label>" +
          "</td>" +
          "<td style='word-break: break-all;'>" +
          goods.drugName + "</br>" + goods.specifCation + "</br>商品编码：" + goods.goodsCode + "</td>" +
          "<td style='word-break: break-all;'>" + goods.approvalNumber + "</td>" +
          "<td style='word-break: break-all;'>" + (goods.shopPrice / 100).toFixed(2) + "</td>" +
          "<td style='word-break: break-all;'>" + (goods.inStock ? goods.inStock : '') + "</td>" +
          "<td>" +
          "<span class='saleout_btn'>" + statusStr + "</span></td>" +
          "<td style='word-break: break-all;'>" + updateTime + " </td>" +
          "<td class='center'>" +
          "<a class='sui-btn join_integral' goodsid='"+goods.goodsId+"' goodsPrice='"+goods.shopPrice+"'  data-toggle='modal' data-toggle='modal' data-keyboard='false'style='margin-left:6px;'>" +
          "参加" +
          "</a>" +
          "</td><input type='hidden' name='goods_id' value='" + goods.goodsId + "' data-title='" + goods.drugName + "'/></tr>"
      }
      $("#product_table").html(tmpHtml);
      $("#pagediv").html("<span class='pageinfo'></span>")
      addpage(getgoodsList);

      $('.select_all_btn').attr("checked", false);
      $('.select_all_btn').parent().removeClass("checked");
      pagination_page_no = 1;
    },
    error: function () {
      console.log("error ....");
    }
  });
}

function choosetemple(goodsId, detailTpl) {
  if (detailTpl == 100) {
    window.location.href = "/merchant/doctorSelect?goodsId="+ goodsId +"&detailTpl="+detailTpl;
  } else {
    window.open("/merchant/productModify?goodsId="+ goodsId);
  }
}

function reload() {
  location.reload();
}

function exportProductList() {
  var datas = {};
  var classify = $("input[name='classify']").val();
  datas.userCateid = classify > 0 ? classify : "";
  datas.goodsTitle = $("input[name='goods_title']").val().trim();
  datas.barCode = $("input[name='bar_code_status']").val();
  datas.drugName = $("input[name='drug_name']").val().trim();
  datas.drugCategory=$("input[name='drug_category']").val().trim();
  datas.approvalNumber = $("input[name='approval_number']").val().trim();
  var goodstatus = $("input[name='status']").val();
  var hasImg = $("input[name='has_pic']").val();
  if (!hasImg) {
    datas.hasImage = -1;
  } else {
    datas.hasImage = hasImg;
  }
  if (!goodstatus) {
    datas.goodsStatus = 0;      //goodsStatus:0查询状态1：上架，2：下架（避免查询到4：已删除商品）
  } else {
    datas.goodsStatus = goodstatus;
  }
  datas.goodsProperty = $("input[name='goods_property']").val();
  datas.startPrice = ($("input[name='price_small']").val() ? $("input[name='price_small']").val().trim() * 100 : "0");
  datas.endPrice = ($("input[name='price_large']").val() ? $("input[name='price_large']").val().trim() * 100 : "99999999");
  datas.brandName = $("input[name='brand_name']").val().trim();
  datas.detailTpl = $("input[name='detail_tpl']").val();
  datas.purchaseWay = $("input[name='purchase_way']").val();
  datas.wxPurchaseWay = $("input[name='wx_purchase_way']").val();
  datas.goodsCode = $("input[name='goods_code']").val();

  $.ajax({
    type: 'POST',
    url: "/merchant/findGoodsList",
    data: datas,
    dataType: 'json',
    success: function (data) {
      var total = data.total;
      console.log(total);
      if (total == 0) {
        $('.order_hint').html('根据本次查询条件，未查询到相关商品信息！');
      } else if (0 < total <= 2000) {
        $('.order_hint').html('根据本次查询条件，共查询到 <span class="list_record"></span>条结果,请<a href="javascript:void(0)" class="download_address" >点击下载</a>。');
        //$(".download_address").attr("href","/merchant/productWriteExcel");
        $(".list_record").html(total);
        $('#search_report').removeClass("lee_hide");
      } else {
        $('.order_hint').html('根据本次查询条件，共查询到 <span style="color:red">' + total + '</span> 条结果,已超过&nbsp;2000&nbsp;条的最大值，请修改查询条件，分批次下载。');
        $('#search_report').removeClass("lee_hide");
      }
    }
  })

}

$(".download_address").live("click", function () {
  var datas = {};
  var classify = $("input[name='classify']").val();
  datas.userCateid = classify > 0 ? classify : "";
  datas.goodsTitle = $("input[name='goods_title']").val().trim();
  datas.barCode = $("input[name='bar_code_status']").val();
  datas.drugName = $("input[name='drug_name']").val().trim();
  datas.drugCategory=$("input[name='drug_category']").val().trim();
  datas.approvalNumber = $("input[name='approval_number']").val().trim();
  var goodstatus = $("input[name='status']").val();
  var hasImg = $("input[name='has_pic']").val();
  if (!hasImg) {
    datas.hasImage = -1;
  } else {
    datas.hasImage = hasImg;
  }
  if (!goodstatus) {
    datas.goodsStatus = 0;      //goodsStatus:0查询状态1：上架，2：下架（避免查询到4：已删除商品）
  } else {
    datas.goodsStatus = goodstatus;
  }
  datas.goodsProperty = $("input[name='goods_property']").val();
  datas.startPrice = ($("input[name='price_small']").val() ? $("input[name='price_small']").val().trim() * 100 : "0");
  datas.endPrice = ($("input[name='price_large']").val() ? $("input[name='price_large']").val().trim() * 100 : "99999999");
  datas.brandName = $("input[name='brand_name']").val().trim();
  datas.detailTpl = $("input[name='detail_tpl']").val();
  datas.purchaseWay = $("input[name='purchase_way']").val();
  datas.wxPurchaseWay = $("input[name='wx_purchase_way']").val();
  datas.goodsCode = $("input[name='goods_code']").val();
  var url = "/merchant/productWriteExcel";
  location.href = url;
  /*$.ajax({
   type: 'POST',
   url: "/merchant/productWriteExcel",
   data: datas,
   dataType: 'json',
   success: function (data) {
   window.open();
   }})*/
})

//刷新
function gooodsRefresh(goodsId) {
  console.log("product_goods_ids:" + goodsId);
  var datas = {};
  datas.goods_id = goodsId;
  datas.update_time = 1111;
  $.ajax({
    type: 'POST',
    url: "/merchant/productUpdate",
    data: datas,
    dataType: 'json',
    success: function (data) {
      if (data.status) {
        layer.confirm('刷新成功！', {
          btn: ['确定'] //按钮
        }, function () {
          setTimeout(function () {
            layer.closeAll('dialog');
            pagination_page_no = 1;
            getgoodsList();
          }, 0)

        });
      } else {
        layer.confirm('刷新失败！', {
          btn: ['确定'] //按钮
        }, function () {
          setTimeout(function () {
            layer.closeAll('dialog');
          }, 0)

        });
      }
    }
  });
};

var goodsdate;

//增加条形码
function goodsBarCode(goods) {
  $("#codetip").show();
  $("#stybtn").css("color","black");
  if (goods.barCode == "NULL") {
    goods.barCode = "";
  }
  $("#bar_code_input").val(goods.barCode);
  goodsdate = goods;
};


//验证商品验证码是否存在，可以为空
var barCodeValidateStatus = true;
$("#jiaoyan").live("click",function(){
  var bar_code = $("#bar_code_input").val();
  if(bar_code==""){
    return;
  }
  $.ajax({
    type:"post",
    url:"/merchant/queryByBarCode?bar_code="+bar_code,
    success:function (data) {
      if(data.status==="OK"){
        barCodeValidateStatus = true;
        $('#bar_code_ok').removeAttr('disabled');
        $("#codetip").hide();
        $("#stybtn").attr("style","");
        setTimeout("$('#bar_code_ok').attr('disabled','true')",'5000')
      }else if(data.status==="ERROR"){
        layer.msg(data.errorMessage);
      }else{
        barCodeValidateStatus = false;
        layer.msg("商品条形码已存在，请重新输入");
        $("#codetip").html("　　　请先校验条形码是否可用在保存");
        //barCodeValidateStatus = true;
        $("#bar_code_ok").attr("disabled","disabled");
      }
    }
  });
});

$("#bar_code_ok").live("click", function () {
  var datas = {};
  var barcode = $("#bar_code_input").val();
  if (barcode == "") {
    datas.bar_code = -1;
  } else {
    datas.bar_code = barcode;
  }
  datas.goods_id = goodsdate.goodsId;

  // if(!barCodeValidateStatus){
  //   layer.msg("商品条形码已存在，请重新输入");
  //   barCodeValidateStatus = true;
  //    return;
  // }
  if (barcode == "NULL" || barcode == goodsdate.barCode) {
    layer.confirm('未更改数据！', {
      btn: ['确定'] //按钮
    }, function () {
      setTimeout(function () {
        $("#bar_code_ok").attr("disabled","true");
        layer.closeAll('dialog');
      }, 500)

    });
  } else {
    $.ajax({
      type: 'POST',
      url: "/merchant/productUpdate",
      data: datas,
      dataType: 'json',
      success: function (data) {
        if (data.status) {
          layer.confirm('修改条形码成功！', {
            btn: ['确定'] //按钮
          }, function () {
            setTimeout(function () {
              layer.closeAll('dialog');
              $("#bar_code_ok").attr("disabled","true");
              getgoodsList();
            }, 500)

          });
        } else {
          layer.confirm('修改条形码失败！', {
            btn: ['确定'] //按钮
          }, function () {
            setTimeout(function () {
              $("#bar_code_ok").attr("disabled","true");
              layer.closeAll('dialog');
            }, 500)

          });
        }
      }
    });
  }
});


function cleanThis() {
  $("#bar_code_input").val('');
  $('#bar_code_ok').removeAttr('disabled');
  setTimeout("$('#bar_code_ok').attr('disabled','true')",'5000')
}



$(".qr_code_edit").live("click",function () {
  var goods_id=$(this).attr("goodsid");
  var siteid=$(this).attr("siteid");
  var goodstitle=$(this).attr("goodstitle");
  var url = "/common/getQRCode";
  var rl="single/product?goodsId="+goods_id;
  $('#qrcode_img').attr('src',url+'?url='+rl);
  $('#qrcode_dwonload').attr('href',url+'?url='+rl);
  $('#qrcode_dwonload').attr('download',goodstitle+".png");
});

/*$(document).on('click','#qrcode_dwonload',function () {
 var src = $(this).parent('div').prev('div').find('img').attr('src');
 var url = "/common/getQRCode";
 var goodsId = src.match(/.?goodsId=([0-9]+){1,10}/)[1];

 var param={};
 param.url=src.substr(parseInt(src.indexOf('=')+1),src.length);
 param.download = 1;
 param.goods_id = goodsId;

 console.log(param)
 $.get(url, param ,function () {
 $('#qr_code_edit').modal('hide');
 console.log('success')
 })
 });*/


/**
 * 日期格式化
 * @param format
 * @returns {*}
 */
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(format) || /(Y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};

$('#bar_code_edit').on('hidden', function () {
  $("#bar_code_ok").attr("disabled","true");
})

//
// $(this).attr("disabled","true"); //设置变灰按钮
// submit();
// setTimeout("$('#submit').removeAttr('disabled')",'3000'); //设置三秒后提交按钮 显示
