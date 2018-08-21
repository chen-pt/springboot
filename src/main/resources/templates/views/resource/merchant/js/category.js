$(function () {
  init();
  initAddDialog();
  $(document).on('click', '.del_classify', function () {
    var cateId=$(this).parents(".qs_classify_name").find(".input-xlarge").attr("cateId");
    var ele = $(this);
    $.ajax({
      type: 'POST',
      url: "/merchant/delcategories",
      data: {cateId: cateId},
      dataType: 'json',
    }).done(function(data) {
      if(data.status=="success"){
        ele.parent().parent().parent().remove();
        layer.alert('删除成功', function() {
          location.reload();
        });
      } else {
        layer.alert(data.result);
      }
    }).fail(function () {
      layer.alert("网络错误.");
    });
  });
});

function init() {
    doPostReq("/merchant/categories", {}, loadCategoies);
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


  if (data.status != "success") return;
    var attrs = ["cateName", "cateId", "cateCode","cateName","imgHash"];
    var htmls = "";
    var htmlst = $("#cate_first").html();
    var htmlnd = $("#cate_second").html();
    var htmlrd = $("#cate_third").html();

    var dataM = data.result.children;
    console.log( $("#addDoctor"));
    console.log(data);
    //console.log(data.result.children[8].cateName);
 /*   if(data.result.children[8].cateName=='名医预约'){
      $(this).find(".add_sub_classify").hide();
    }*/

    var str="";
    for (var itemst in dataM) {
      var other = dataM[itemst].cateName=="名医预约"?true:false;
      if(other){
        str += "<div class=\"first_classify\">";
        str += setv(attrs, dataM[itemst], htmlst,true);
      }else{
        htmls += "<div class=\"first_classify\">";
        htmls += setv(attrs, dataM[itemst], htmlst,false);
      }

        if (dataM[itemst].children) {
            var datand = dataM[itemst].children;
            // var other = dataM[itemst].cateName=="名医预约"?true:false;
            for (var itemnd in datand) {
              if(other) {
                str += "<div class=\"second_classify\">";
                str += setv(attrs, datand[itemnd], htmlnd,true);
              }else{
                htmls += "<div class=\"second_classify\">";
                htmls += setv(attrs, datand[itemnd], htmlnd,false);
              }
              // htmls += "<div class=\"second_classify\">";
              // htmls += setv(attrs, datand[itemnd], htmlnd,false);
              if (datand[itemnd].children) {
                    var datard = datand[itemnd].children;
                    for (var itemrd in datard) {
                        if(other){
                          str+= setv(attrs, datard[itemrd], htmlrd,true);
                        }else{
                          htmls += setv(attrs, datard[itemrd], htmlrd,false);
                        }

                    }
                }
                htmls += "</div>";
              str +="</div>";
            }
        }
        htmls += "</div>";
      str +="</div>";
    }


  $("#categories").append(str);
  htmls += "<input type='button' value='保 存' oldvalue='保 存' class='sui-btn btn-xlarge save-classify-btn'onclick='modifySave()' />";
  $("#categories").append(htmls);


}

//类目修改保存
function modifySave(){

  var datas = [];

  var input_null_status = false;

  // 获取到被修改过的分类
  $('#categories').find('input').each(function() {

    if( !this.value ){
      input_null_status =true;
    }

    if(this.value != $(this).attr("oldvalue") ) {
      datas.push({
        'cate_id': $(this).attr("cateId") ,
        'value': this.value
      });
    }
  });

  if(input_null_status){
    layer.msg('警告:检测到分类名有为空值');
    return;
  }

  if( ! datas.length ) {
    layer.msg('没有任何分类需要修改');
    return;
  }

  // 发送数据
  $.ajax({
    type: 'POST',
    url: "/merchant/updatecategories",
    contentType:"application/json",
    data:JSON.stringify(datas),
    dataType: 'json',
    success: function(data){
      if( data.status ) {
        layer.alert(data.results.msg, function() {
          location.reload();
        });
      } else {
        layer.msg( data.results.msg || '未知错误' );
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
    $(".add_sub_classify").bind("click",function(){
      $("#qs_floor_span").text('');
      $("#alert_title").text('');
       var catest = $(this).parents(".first_classify").find(".qs_classify_name").find(".input-xlarge").val();
        var catend = $(this).parents(".second_classify").find(".qs_classify_name").find(".input-xlarge").val();
      $("#cateAddName").attr("catest",catend?catend:catest);
        catend=catend?">"+catend:"";
        $("#alert_title").text("上级分类： " + catest+catend);
        var cateLevel = catend?"二":"一";
        $("#qs_floor_span").text(cateLevel);

    });
}

//新增保存
var saveCate = (function () {
  var only = false;

  return function () {
    var cateName = $("#cateAddName").val();
    var  parentCode=$("#cateAddName").attr("catest");
    if(cateName.length>10)return;
    if (!only) {
      only = true;
      $.ajax({
        type: 'POST',
        url: "/merchant/inscategories",
        data: {"cateName": cateName, "parentCode": parentCode},
        dataType: 'json',
      }).done(function (data) {
        if (data.status === 'success') {
          $("#add_classify").modal("hide");
          layer.msg('添加成功', function () {
            location.reload();
          });
        } else {
          layer.alert('添加失败');
        }
      }).fail(function () {
        layer.alert("网络错误.");
      }).always(function () {
        only = false;
      });
    }
  }
})();

function setv(attrs, item, str, other) {
    var text = str;
    if(item.children==null){
      text = text.replace("{isDel}", '<a class="del_classify " href="javascript:void(0)">删除</a>');
      text = text.replace('<i class="sui-icon icon-caret-right"></i>', '');
      text = text.replace("padding-left: 0px;", 'padding-left: 25px;');
      text = text.replace("margin-left: 0px;", 'margin-left: 25px;');
      text = text.replace("margin-left: 23%;", 'margin-left: 20.7%;');
    }else{
      text = text.replace("{isDel}", '');
    }
    if(other) {
      text = text.replace("{addCategory}", ' ');
      text = text.replace("{productDle}",' ');
      text = text.replace("{productDel}",' ');
    } else {
      text = text.replace("{addCategory}", '<a class="add_sub_classify " href="javascript:void(0)" data-toggle="modal" data-target="#add_classify" '+
        'data-backdrop="static" >添加子分类</a></span>');
      text =text.replace('{productDle}',' <a class="product_manager_a" style="margin-left: 23%;" >商品管理</a>');
      text =text.replace('{productDel}',' <a class="product_manager_a">商品管理</a>');
    }
    for (attr in attrs) {
        var value = item[attrs[attr]] || "";
        if(attrs[attr]=="imgHash"){
          if(value==""){
            text = text.replace("{" + attrs[attr] + "}", '<a onclick="onImg('+item[attrs[2]]+')">上传图片</a>');
          }else{
            var imgSrc = imgLink(value, 100, 100, '.jpg');
            text = text.replace("{" + attrs[attr] + "}", '<img class="changeImg" style="width:30px;height:30px;" src="'+imgSrc+'">&nbsp;&nbsp;&nbsp;&nbsp;<span class="delImg" data-id="'+item[attrs[2]]+'">X</span>');
          }
        }else{
          text = text.replace("{" + attrs[attr] + "}", value);
        }

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
            console.log(error);
        }
    });
}

// 商品管理链接
$(document).on('click', '.product_manager_a', function() {
  var classify = $(this).parent().find("input").attr("cateid");
  var classifyName = $(this).parent().find("input").attr("value");
  console.log(classify);
  console.log(classifyName);
  window.location.href="/merchant/productManager?classify="+classify+"&classifyName="+classifyName;
});


function onImg(cateCode){

  $("#uploadImgBtn").attr("onchange","upLoadImg('"+cateCode+"')");

  $("#uploadImgBtn").click();

}

$(".delImg").live("click",function(){
  var cateCode = $(this).attr("data-id");
  console.log(cateCode);
  $.ajax({
    type: 'POST',
    url: "/merchant/delCateImg",
    data: {"cateCode":cateCode},
    dataType: 'json',
    success: function (data) {
      if(data.status=="OK"){
        alert("删除成功");
        window.location.reload();
      }else {
        alert("删除失败");
      }
    },
    error: function (error) {
      console.log(error);
    }
  });

});



function upLoadImg(cateCode){

  $.ajaxFileUpload({
    url: "/common/localpictureUpload",
    type: "post",
    secureuri: false, //一般设置为false
    fileElementId: "uploadImgBtn", // 上传文件的id、name属性名
    dataType: "JSON", //返回值类型
    success: function (result) {
      console.log(result,"------------------------------------");
      if(result.status==1){
          var imgHash = result.image.md5Key;
          //把图片值添加到分类中
          $.ajax({
            type: 'POST',
            url: "/merchant/updCateImg",
            data: {"imgHash":imgHash, "cateCode":cateCode},
            dataType: 'json',
            success: function (data) {
              if(data.status=="OK"){
                  window.location.reload();
              }else {
                alert("上传图片失败");
              }
            },
            error: function (error) {
              console.log(error);
            }
          });
      }
    },
    error: function (result) {
      console.log(result);
    }
  });
}

$(".changeImg").live("mouseover",function () {
  $(this).css("width","100px");
  $(this).css("height","100px");
})

$(".changeImg").live("mouseout",function () {
  $(this).css("width","30px");
  $(this).css("height","30px");
})
