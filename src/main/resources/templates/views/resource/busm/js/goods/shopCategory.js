


$(function () {



/*
  //一级子类展开
  $(".first_classify>p i").on("click", function() {
    if ($(this).parents(".first_classify").find(".second_classify").hasClass("hide")) {
      $(this).removeClass("icon-caret-right").addClass("icon-caret-down");
      $(this).parents(".first_classify").find(".second_classify").removeClass("hide");
    } else {
      $(this).removeClass("icon-caret-down").addClass("icon-caret-right");
      $(this).parents(".first_classify").find(".second_classify").addClass("hide");
    }
  });

  //二级子类展开
  $(".second_classify>p i").on("click", function () {
    if ($(this).parents(".second_classify").find(".third_classify").hasClass("hide")) {
      $(this).removeClass("icon-caret-right").addClass("icon-caret-down");
      $(this).parents(".second_classify").find(".third_classify").removeClass("hide");
    } else {
      $(this).removeClass("icon-caret-down").addClass("icon-caret-right");
      $(this).parents(".second_classify").find(".third_classify").addClass("hide");
    }
  });

  //moseover moseout事件
  $(".p").on("mouseover", function () {
    $(this).find(".hide").removeClass("hide");
  }).on("mouseout", function () {
    $(this).find(".add_sub_classify").addClass("hide");
    $(this).find(".del_classify").addClass("hide");
  });
*/

  /*// 添加一级分类
  $(".add_first_sub_classify").on("click", function () {
    initAddDialog();
   /!* $("#qs_floor_span").html("一");
    $("#alert_title").html("");
    curParentId = 0;*!/
  });*/

/*  /!**添加子类目**!/
  $('.add_sub_classify').on("click", function () {
    var classifyId=$(this).attr("data-id");
    console.log(classifyId);
    if($(this).hasClass("second")) {
      $("#qs_floor_span").html("二");
      $("#alert_title").html("上级分类：" + $(this).parents(".first_classify").children("p").find("input").val());
    } else {
      $("#qs_floor_span").html("三");
      $("#alert_title").html("上级分类：" + $(this).parents(".first_classify").children("p").find("input").val() + ">" + $(this).parents(".second_classify").children("p").find("input").val());
    }
    curParentId = classifyId;
  });*/



  init();
  initAddDialog();
  $(".del_classify ").bind("click",function() {

    //获取删除分类的类型
    var classifyType =  $(this).attr("classifyType");
    //如果删除分类的类型为一级或二级，判断是否有子级存在，如果有，不能删除该分类
    if(classifyType==="second_classify"){
      var third_classify = $(this).parents(".second_classify").find(".third_classify");
      if(third_classify.length!==0){
        alert("修改分类存在子级分类，不能删除");
        return;
      }
    }
    if(classifyType==="first_classify"){
      var second_classify = $(this).parents(".first_classify").find(".second_classify");
      if(second_classify.length!==0){
        alert("修改分类存在子级分类，不能删除");
        return;
      }
    }
    var cate_id=$(this).parents(".qs_classify_name").find(".input-xlarge").attr("cate_id");
    $.ajax({
      type: 'POST',
      url: "/jk51b/goodscategory/delete",
      data: {cate_id:cate_id},
      dataType: 'json',
      success: function(data){
        if(data.status==="OK"){
          location.reload();
        }else{
          alert(data.errorMessage);
        }

      },
      error:function(){
        alert("删除商品分类失败");
      }
    });
  });
});

//moseover moseout事件
$(".p").on("mouseover", function () {
  $(this).find(".hide").removeClass("hide");
}).on("mouseout", function () {
  $(this).find(".add_sub_classify").addClass("hide");
  $(this).find(".del_classify").addClass("hide");
});

function init() {
  doPostReq("/jk51b/goodscategory/list", {}, loadCategoies);
  //doPostReq("./categories", {}, modifySave);
  expandToggle();
  $(".second_classify,.third_classify").hide();
  $(".input-xlarge").siblings("a").hide();
  $("#categories").find("p").bind("mouseenter", function () {
    $(this).find(".add_sub_classify,.del_classify ").show();
  }).bind("mouseleave",function(){
    $(this).find(".add_sub_classify,.del_classify ").hide();
  });
}

//商品类目列表
function loadCategoies(data) {
  if (data.code != "000") return;
  var attrs = ["cate_name", "cate_id", "parent_id","cate_code"];
  var htmls = "";
  var htmlst = $("#cate_first").html();
  var htmlnd = $("#cate_second").html();
  var htmlrd = $("#cate_third").html();

  var dataM = data.value.ybCategoryList;
  for (var itemst in dataM) {
    htmls += "<div class=\"first_classify\">";
    htmls += setv(attrs, dataM[itemst], htmlst);

    if (dataM[itemst].subYbCategory) {
      var datand = dataM[itemst].subYbCategory;
      for (var itemnd in datand) {
        htmls += "<div class=\"second_classify\">";
        htmls += setv(attrs, datand[itemnd], htmlnd);

        if (datand[itemnd].subYbCategory) {
          var datard = datand[itemnd].subYbCategory;
          for (var itemrd in datard) {
            htmls += setv(attrs, datard[itemrd], htmlrd);
          }
        }

        htmls += "</div>";
      }
    }
    htmls += "</div>";
  }


  htmls += "<input type='button' value=' 保 存  ' class='sui-btn btn-xlarge save-classify-btn'onclick='modifySave()' />";
  $("#categories").append(htmls);


}

//类目修改保存
function modifySave(){
  var datas = [];

  // 获取到被修改过的分类
  $('#categories').find('input').each(function() {
    if($(this).attr("oldvalue")&&this.value != $(this).attr("oldvalue") ) {
      datas.push({
        'cate_id': $(this).attr("cate_id") ,
        'cate_name': this.value
      });
    }
  });

  if( ! datas.length ) {
    layer.msg('没有任何分类需要修改');
    return;
  }

  var data = JSON.stringify(datas);
  // 发送数据
  $.ajax({
    type: 'POST',
    url: "/jk51b/goodscategory/modifySave",
    data: {datas:data},
    dataType: 'json',
    success: function(data){
      if( data.status==="OK") {
          location.reload();
      } else {
        layer.msg(data.errorMessage  );
      }

    },
    error:function(){
      alert("error ....");
    }
  });
}

//类目展开合并
function expandToggle(data) {
  $(".sui-icon.icon-caret-right").bind("click", function () {
    if ($(this).hasClass("icon-caret-right")) {
      $(this).removeClass("icon-caret-right").addClass("icon-caret-down");
      $(this).parent("span").parent("p").siblings().show();
    } else {
      $(this).parent("span").parent("p").siblings().hide();
      $(this).removeClass("icon-down-down").addClass("icon-caret-right");
    }
  });
  //展开所有
  $(".qs-unfold-shrink").bind("click",function(){
    if ($(".sui-icon.icon-caret-right").hasClass("icon-caret-right")) {
      $(".sui-icon.icon-caret-right").removeClass("icon-caret-right").addClass("icon-caret-down");
      $(".second_classify").show();
      $(".third_classify").show();
    }else {
      $(".sui-icon.icon-caret-down").removeClass("icon-caret-down").addClass("icon-caret-right");
      $(".second_classify").hide();
      $(".third_classify").hide();
    }
  })
}

//初始化新增modal
function initAddDialog(){
  var curParentId = 0;
  $(".add_sub_classify").bind("click",function(){
    $("#qs_floor_span").text('');
    $("#alert_title").text('');
    var catest = $(this).parents(".first_classify").find(".qs_classify_name").find(".input-xlarge").val();
    catest = catest?catest:"";
    var catend = $(this).parents(".second_classify").find(".qs_classify_name").find(".input-xlarge").val();

    //如果存在二级分类,
    var first_classify_cate_id =  $(this).parents(".first_classify").find(".qs_classify_name").find(".input-xlarge").attr("cate_id");
    var second_classify_cate_id =  $(this).parents(".second_classify").find(".qs_classify_name").find(".input-xlarge").attr("cate_id");
    var cate_id = second_classify_cate_id?second_classify_cate_id:first_classify_cate_id
    if(cate_id){
      curParentId = cate_id;
    }

    $("#cate_name").attr("catest",catend?catend:catest);
    $("#cate_name").attr("parent_id",curParentId);
    catend=catend?">"+catend:"";

    var cateLevel = "一";
    if((catest+catend)!=""){
      $("#alert_title").text("上级分类： " + catest+catend);
      cateLevel = catend?"三":"二";
    }

    $("#qs_floor_span").text(cateLevel);

  });
}

//新增保存，TO DO
function saveCate(){
  var cate_name = $("#cate_name").val();
  var parent_id = $("#cate_name").attr("parent_id");
  /*var  parentCode=$("#cateAddName").attr("catest");*/
  if(!cate_name||cate_name.length>10){
    alert("分类名称为空或长度超过10");
    return;
  }
  $.ajax({
    type: 'POST',
    url: "/jk51b/goodscategory/add",
    data: {"cate_name":cate_name,"parent_id":parent_id},
    dataType: 'json',
    success: function(data){
      location.reload();
      //$("#add_classify").modal("hide");
    },
    error:function(){
      alert("添加分类错误");
    }
  });

}
function setv(attrs, item, str) {
  var text = str;
  for (attr in attrs) {
    var value = item[attrs[attr]] || "";
    text = text.replace(new RegExp("{" + attrs[attr] + "}", 'g'), value);
  }
  return text;
}

function replaceUtil(fromStr, toStr) {
  return str.replace(fromStr, toStr);
}

function doPostReq(url, param, cb) {


  $.ajax({
    type: 'POST',
    url: url ? url : "",
    async: false,
    data: param ? param : {},
    dataType: 'json',
    success: function (data) {
      if (cb) {
        cb(data);
      }
    },
    error: function (error) {
      alert(error);
    }
  });
}
