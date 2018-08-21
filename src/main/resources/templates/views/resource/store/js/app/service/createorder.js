/**
 * Created by boren on 15/7/8.
 * 创建订单
 */

define(['core', 'tools'], function (core, tools) {

  var mod = {};

  //购物车
  mod.shopcar = {};
  //购物车信息
  mod.shopcarinfo = {};

  /**
   * 商品搜索
   */
  mod.searchGoods = function () {
    var goods_name = $('#item_title').val();
    if (goods_name.replace(/(^\s*)|(\s*$)/g, "").length > 0) {
      var postdata = {};
      postdata.goods_name = goods_name;
      postdata.goods_status = "1";

      //满足产品很傻的需求，要求全显示，而es只支持一次最多返回1w条，此处分页设置10000
      //postdata.pageNum = 100;

      $.ajax({
        type: 'POST',
        data: postdata,
        url: '/wechat/ecBgoodsList',
        success: function (data) {
          $('#search_result_table').children().remove();
          if (data.total > 0) {
            var tpl = $("#drug_template").html();
            var doTtmpl = doT.template(tpl);
            var html = doTtmpl(data);
            $("#goods_list").html(html);
            $('#search_lab').show();

          } else {
            $("#goods_list").html("唉，没有找到相关的商品！");
            $('#search_lab').show();
          }
        }
      });
    }
  };
  // /**
  //  * 门店后台商品搜索
  //  */
  // mod.searchGoodsByName = function () {
  //   var drug_name = $('#item_title').val();
  //   if (drug_name.replace(/(^\s*)|(\s*$)/g, "").length > 0) {
  //     var postdata = {};
  //     postdata.drug_name = drug_name;
  //     postdata.goods_status = "1";
  //     $.ajax({
  //       type: 'POST',
  //       data: postdata,
  //       url: '/wechat/ecBgoodsList',
  //       success: function (data) {
  //         $('#search_result_table').children().remove();
  //         if (data.total > 0) {
  //           var tpl = $("#goods_template").html();
  //           var doTtmpl = doT.template(tpl);
  //           var html = doTtmpl(data);
  //           $("#goods_list").html(html);
  //           $('#search_lab').show();
  //
  //         } else {
  //           //$('#search_lab').show();
  //           // $.alert({'title':'温馨提示!','backdrop':'static','body':'没有找到相关信息！'});
  //         }
  //       }
  //     });
  //   }
  // };

  /**
   * 添加到购物车
   * @param good_id
   */
  mod.addShopCar = function (good_id) {
    mod.shopcar[good_id] = 1;

  };

  /**
   * 更新购物车数量
   */
  mod.changeShopCar = function (opt, good_id, num) {

    if (opt == 'update') {//更新

      if (mod.shopcar[good_id] + parseInt(num) > 0) {
        mod.shopcar[good_id] += parseInt(num);
      }

    } else if (opt == 'set') {//重设
      mod.shopcar[good_id] = parseInt(num);
    }

    var tempitem = {
      product_id: good_id,
      product_num: mod.shopcar[good_id],
      product_price: mod.shopcarinfo[good_id]
    };

    return tempitem;

  };

  /**
   * 删除购物车
   */
  mod.delShopCar = function (good_id) {
    //删除购物车记录
    var tempshopcar = {};

    for (var tempitemid in mod.shopcar) {
      if (good_id != tempitemid) {
        tempshopcar[tempitemid] = mod.shopcar[tempitemid];
      }
    }

    mod.shopcar = tempshopcar;

  };


  /**
   * 显示购物车
   */
  mod.showShopCar = function (template) {
    var postdata = {goodsIds: ''};

    for (var goodsId in mod.shopcar) {
      if (goodsId != 'num') {
        postdata.goodsIds = postdata.goodsIds + goodsId + ',';
      }
    }
    if (postdata.goodsIds != '') {
      $.ajax({
        type: 'POST',
        data: postdata,
        url: core.getHost() + '/store/order/getGoodsInfoDB',
        success: function (data) {
          if (data.code = "000") {
            for (var i in data.goodsList) {
              var row = data.goodsList[i];
              row.product_num = mod.shopcar[row.product_id];
              mod.shopcarinfo[row.product_id] = row.product_price;
            }
            if (!("undefined" != typeof template)) {
              template = "shopcar_template";
            }
            var tpl = $("#" + template).html();

            var doTtmpl = doT.template(tpl);

            var html = doTtmpl(data);

            $("#shopcar_list").html(html);


          } else {

            $.alert({'title': '温馨提示!', 'backdrop': 'static', 'body': data.result.msg});

          }
        }

      });

    } else {

      $("#shopcar_list").html('');

    }
  };

  /**
   * 校验输入宽值
   * @param value  要校验的值
   * @param control 限购
   * @returns {number}  返回所需要的值
   * @constructor
   */
  mod.ValidateinputChange = function (value, control) {
    var flag = true;

    control = parseInt(control);

    var defaultvalue = 1;

    if (value.length == 0) {

      defaultvalue = 1;

      flag = false;
    }

    if (!(new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(value))) {
      if (parseInt(value) <= 0) {
        defaultvalue = 1;

        flag = false;

      } else if (control != 0 && parseInt(value) > control) {
        //限购
        defaultvalue = control;

        flag = false;

      } else if (parseInt(value) > 100) {
        defaultvalue = 100;

        flag = false;
      }
      var exp = eval("/^[0-9]*$/");

      if (!exp.test(value)) {
        defaultvalue = 1;

        flag = false;
      }
    }

    if (flag) {
      defaultvalue = value;
    }


    return defaultvalue;
  };

  /**
   * 计算购物车中的宝贝件数，数量，价格
   * @constructor
   */
  mod.CalculationShopCar = function () {

    var item_num = 0;

    var item_total = 0;

    for (var good_id in mod.shopcar) {
      item_num += mod.shopcar[good_id];

      item_total += mod.shopcar[good_id] * mod.shopcarinfo[good_id];
    }

    var itemtemp = {

      type_num: Object.keys(mod.shopcar).length,
      item_num: item_num,
      item_total: item_total
    };

    return itemtemp;
  };

  /**
   * 结算价格
   */
  mod.calculate = function (mobile, integral) {

    if (Object.keys(mod.shopcar).length > 0) {
      var postdata = {};
      postdata.mobile = mobile;
      postdata.integral = integral;
      var items = [];
      for (var good_id in mod.shopcar) {
        var item = {goodsId: good_id, goodsNum: mod.shopcar[good_id]};
        items.push(item);
      }
      postdata.goods = JSON.stringify(items);
      $.ajax({
        type: 'POST',
        data: postdata,
        dataType: 'json',
        async: false,
        url: '/store/order/beforequery',
        success: function (data) {
          console.log('结算:' + data);
          if (data.status) {
            var tpl = $("#calculate_template").html();

            var doTtmpl = doT.template(tpl);

            var html = doTtmpl(data);

            $("#create_commit").html(html);
            //mod.showShopCar('shopcarcalculate_template');
            mod.showShopCar('shopcar_template');
          } else {
            $('#item_title').removeAttr("disabled");
            mod.showShopCar();
            $.alert({'title': '温馨提示!', 'backdrop': 'static', 'body': ''});
          }
          var tmpi = $("#integral_use").val();
          $("#integral_use").val("").focus().val(tmpi);

        }
      });
    }
  };
  /**
   * 下单
   * @param user
   */
  mod.commitOrder = function (mobile, integral_use, storeUserId) {
    var flag = true;
    if (Object.keys(mod.shopcar).length > 0) {
      var postdata = {};
      postdata.mobile = mobile;
      postdata.integral = integral_use;
      postdata.storeUserId = storeUserId;
      var items = [];
      for (var good_id in mod.shopcar) {
        var item = {goodsId: good_id, goodsNum: mod.shopcar[good_id]};
        items.push(item);
      }
      postdata.goods = JSON.stringify(items);
      $.ajax({
        type: 'POST',
        data: postdata,
        async: false,
        url: core.getHost() + '/store/order/create/storedirect',
        success: function (data) {
          //var resultData = JSON.parse(data);
          console.log('下单:' + data);
          if (data.code == "0000") {
            flag = true;
          } else {
            $.alert({'title': '温馨提示!', 'backdrop': 'static', 'body': data.message});
            flag = false;
          }
        }

      });

    } else {

      $.alert({'title': '温馨提示!', 'backdrop': 'static', 'body': '请先添加商品哦！'});

      flag = false;
    }

    return flag;

  };
  /**
   * 用户验证
   */
  mod.checkUser = function (mobile) {
    var postdata = {};

      if (mobile.length==11) {

      postdata.mobile = mobile;

      $.ajax({
        type: 'POST',
        data: postdata,
        async: false,
        url: core.getHost() + '/store/member/checkMobile',
        success: function (data) {
          console.log('用户验证:' + data);
          if (data.status) {
            $('#check_user').attr('style', 'display: none;');
          } else {
            $('#check_user').html('该会员不是您店铺的注册会员');
            $('#check_user').attr('style', 'display: inline;');
          }
        }
      });
    } else {
      $('#check_user').html('手机号码不正确！');
      $('#check_user').attr('style', 'display: inline;');
      $('#username').val("");
    }

  };

  /**
   * 显示店员
   * @param clerk
   */
  mod.showClerkStore = function () {
    $.ajax({
      type: 'POST',
      data: {},
      url: '/store/clerk/list',
      success: function (e) {
        var data = JSON.parse(e);
        if (data.status) {
          var tpl = $("#clerk_template").html();
          var doTtmpl = doT.template(tpl);
          var html = doTtmpl(data);
          $("#clerk_select").html(html);
        } else {
          if (data.result.code == '8561') {
            $.confirm({
              'title': '温馨提示!',
              'body': '本店还没有店员，请添加店员哦！',
              'okBtn': '立即添加',
              'cancelBtn': '稍后再说',
              okHide: function () {
                window.location.href = '/store/clerk/add';
              }
            });
          } else {
            $.alert({'title': '温馨提示!', 'body': data.result.msg});
          }
          $("#clerk_select").html('本店还没有店员，请<a href="/store/clerk/add">添加店员</a>');
        }
      }
    });
  };

  return mod;

  /*return {
   searchGoods:searchGoods,
   addShopCar:addShopCar,
   changeShopCar:changeShopCar,
   delShopCar:delShopCar,
   showShopCar:showShopCar,
   ValidateinputChange:ValidateinputChange,
   CalculationShopCar:CalculationShopCar,
   commitOrder:commitOrder,
   checkUser:checkUser
   };*/
});
