/*eslint-disable camelcase*/
/*eslint-disable space-return-throw-case*/
/*eslint-disable space-after-keywords*/
var editor1;
var editor2;
var editor3;
var editor4;
var curEdit;

(function () {
    var Vue;
    var _;
    var productConfig;
    var vm;
    var getTplData = function () {
        return {};
    };

  //是否加入积分商品
  function monitorIntegralGoodsDiv() {

    var integral_goods_is_del = $('input[name="integral_goods_is_del"]:checked').val();

    if(integral_goods_is_del == 1){

      this.goodsDetail.integralGoodsIsDel = 1;

      $('#integral_goods_div').css('display','block');

    }else if(integral_goods_is_del == 0){

      this.goodsDetail.integralGoodsIsDel = 0;

      $('#integral_goods_div').css('display','none');

    }

  }

  //回显，判断是否是积分商品
  function judgeIsIntegralGoods(addExchange,type) {

    if(type == 0 && (addExchange == 0 || ! addExchange)){
      // $("#integral_goods_is_del0").click();
      return true;
    }if(type == 1 && addExchange == 1){
      // $("#integral_goods_is_del1").click();
      $('#integral_goods_div').css('display','block');
      return true;
    }else {
      return false;
    }

  }

  //显示自提门店列表
  function showStoreList() {

    $("#extract_store_div").show();

    $("[name=promission]").val(1);
    $("[name=store_name]").val("");
    $("[name=store_number]").val("");
    showlist(alllist);
    oldStoresShow(alllist, toarray($("[name=integral_goods_store_ids]").val()));
    
  }

  //计算文本域字符长度
  $(document).on("keyup","textarea",function(){
    $(this).siblings('.num-limit').find('.js-pl-limit').empty().append(this.value.length);
  });

  //加载页面后计算TextArea中文本的长度
  setTimeout(function countTextArealength() {
    $("textarea").each(function () {
      $(this).siblings('.num-limit').find('.js-pl-limit').empty().append(this.value.length);
    });

  },2000);



  //表单提交前验证
  $(document).on("click","#save_product_btn",function(){
    // var barCode = $("#bar_code2").val();
    // var bar_code = $("#bar_code").val();
    // var flag = false;
    // if(bar_code){
    //   if(barCode!=bar_code){
    //     $.ajax({
    //       type: "post",
    //       url: "./queryByBarCode?bar_code=" + bar_code,
    //       async:false,
    //       success: function (data) {
    //         console.log(data);
    //         console.log(data.status);
    //         if (data.status === "OK") {
    //           flag = false;
    //         } else if (data.status === "ERROR") {
    //           layer.msg(data.errorMessage);
    //         } else if(data.status === "have"){
    //           flag = true;
    //         }
    //       }
    //     });
    //   }
    // }
    // if(flag==true){
    //   layer.msg("商品条形码已存在，请重新输入");
    //   return;
    // }

    if( 1 == $('input[name="integral_goods_is_del"]:checked').val() ){

      if($('#extract_store_all').is(':checked')){

        $('#integral_goods_store_ids').val(allStoreIds);

      }

      var integral_exchanges = $('input[name="integral_exchanges"]').val();
      var integral_goods_start_time = $('input[name="integral_goods_start_time"]').val();
      var integral_goods_end_time = $('input[name="integral_goods_end_time"]').val();
      var integral_goods_store_ids = $('input[name="integral_goods_store_ids"]').val();

      if(!integral_exchanges){
        layer.msg("积分商品的兑换积分不能为空");
        return;
      }

      if(integral_exchanges < 0 ){
        layer.msg("积分商品的兑换积分请填写大于等于0的数值");
        return;
      }

      var regDate = /^(\d{4})-(\d{2})-(\d{2})\s([0-2][0-9]):([0-5][0-9])$/;

      if(integral_goods_start_time && !regDate.test(integral_goods_start_time)){
        layer.msg("积分商品的兑换开始时间格式不正确(请使用yyyy-MM-dd hh:mm格式)");
        return;
      }

      if(integral_goods_end_time && !regDate.test(integral_goods_end_time) ){
        layer.msg("积分商品的兑换结束时间格式不正确(请使用yyyy-MM-dd hh:mm格式)");
        return;
      }

      if(!integral_goods_start_time && integral_goods_end_time && (Date.parse(integral_goods_end_time) - Date.parse(new Date())) <= 0){
        layer.msg("积分商品兑换的结束时间请大于开始时间(当前时间)或设置成永久可兑换");
        return;
      }

      if(integral_goods_start_time && integral_goods_end_time && (Date.parse(integral_goods_end_time) - Date.parse(integral_goods_start_time)) <= 0){
        layer.msg("积分商品兑换的结束时间请大于开始时间或设置成永久可兑换");
        return;
      }

      if(!integral_goods_store_ids || integral_goods_store_ids == ''){
        layer.msg("请给积分商品选择自提门店");
        return;
      }

    }

      var bar_code = $("#bar_code").val();
      var bar_code2 = $("#bar_code2").val();
      var goods_id = $("#goods_id").val();

      //zw 20170517不确定会不会影响其他逻辑
     // if(bar_code!="" && bar_code2!=bar_code){
    var data = {bar_code:bar_code,goods_id:goods_id};
    // if(bar_code!=""){
    // /* $("#bar_code_err").html("请输入商品条形码");
    //  $("#bar_code_err").show();*/
    //     // return;
    //     $.ajax({
    //       type:"post",
    //       async:false,
    //       data:data,
    //       url:"./queryByBarCode" ,
    //       success:function (data) {
    //         if(data.status==="OK"){
    //           $("#bar_code_err").hide();
    //           barCodeValidateStatus = true;
    //         }else if(data.status==="ERROR"){
    //           layer.msg(data.errorMessage);
    //         }else{
    //           barCodeValidateStatus = false;
    //           $("#bar_code_err").html("商品条形码已存在，请重新输入");
    //           $("#bar_code_err").show();
    //         }
    //       }
    //     });
    //   }


    var goods_code = $("#goods_code").val();
    var goods_code2 = $("#goods_code2").val();
    if(goods_code==""){
      $("#goods_code_err").html("请输入商品编码");
      $("#goods_code_err").show();
      return;
    }

    if(goods_code2 != goods_code||location.hash == '#copy'){
      $.ajax({
        type:"post",
        url:"./queryByGoodsCode?goods_code="+goods_code,
        success:function (data) {
          if(data.status==="OK"){
            $("#goods_code_err").hide();
            goodsCodeValidateStatus = true;
          }else if(data.status==="ERROR"){
            layer.msg(data.errorMessage);
          }else{
            goodsCodeValidateStatus = false;
            $("#goods_code_err").html("商品编码已存在，请重新输入");
            $("#goods_code_err").show();
          }
            if(!goodsCodeValidateStatus){
                layer.msg("商品编码已存在，请重新输入");
                return;
            }
            $("#product_form").submit();
        }
      });
    }else {
      $("#goods_code_err").hide();
      goodsCodeValidateStatus = true;
        if(!goodsCodeValidateStatus){
            layer.msg("商品编码已存在，请重新输入");
            return;
        }
        $("#product_form").submit();
    }


    // if(!barCodeValidateStatus){
    //   layer.msg("商品条形码已存在，请重新输入");
    //   return;
    // }


   /* var bar_code = $("#bar_code").val();
    if(bar_code==""){
      $("#bar_code_err").html("请输入商品条形码");
      $("#bar_code_err").show();
      return;
    }
    $.ajax({
      type:"post",
      url:"./queryByBarCode?bar_code="+bar_code,
      success:function (data) {
        if(data.status==="OK"){
          $("#product_form").submit();
        }else if(data.status==="ERROR"){
          layer.msg(data.errorMessage);
        }else{
          layer.msg("商品条形码已存在，请重新输入");
        }
      }
    });*/
  });

  //验证状态
  var goodsCodeValidateStatus = true;

  function queryByGoodsCode(){
    // $("#goods_code_err").hide();
    var goods_code = $("#goods_code").val();
    var goods_code2 = $("#goods_code2").val();
    if(goods_code==""){
     // $("#goods_code_err").html("请输入商品编码");
     // $("#goods_code_err").show();
     return;
    }

    if(goods_code2 != goods_code){
      $.ajax({
        type:"post",
        url:"./queryByGoodsCode?goods_code="+goods_code,
        success:function (data) {
          if(data.status==="OK"){
            $("#goods_code_err").hide();
            goodsCodeValidateStatus = true;
          }else if(data.status==="ERROR"){
            layer.msg(data.errorMessage);
          }else{
            goodsCodeValidateStatus = false;
            $("#goods_code_err").html("商品编码已存在，请重新输入");
            $("#goods_code_err").show();
          }
        }
      });

    }else {
      $("#goods_code_err").hide();
      goodsCodeValidateStatus = true;
    }
  };

  //查询商品编号是否存在
  $(document).on('change', '#goods_code', queryByGoodsCode);

  //查询商品条形码是否存在
  var barCodeValidateStatus = true;
  // $(document).on('change', '#bar_code', queryByBarCode);
  //
  // function queryByBarCode(){
  //   var bar_code = $("#bar_code").val();
  //   if(!bar_code){
  //     /* $("#bar_code_err").html("请输入商品条形码");
  //      $("#bar_code_err").show();*/
  //     barCodeValidateStatus = true
  //     return;
  //   }
  //   $.ajax({
  //     type:"post",
  //     url:"./queryByBarCode?bar_code="+bar_code,
  //     success:function (data) {
  //       if(data.status==="OK"){
  //         $("#bar_code_err").hide();
  //         barCodeValidateStatus = true;
  //       }else if(data.status==="ERROR"){
  //         layer.msg(data.errorMessage);
  //       }else{
  //         barCodeValidateStatus = false;
  //         $("#bar_code_err").html("商品条形码已存在，请重新输入");
  //         $("#bar_code_err").show();
  //       }
  //     }
  //   });
  // }

    function jQEventBind () {
        // productConfig.setFieldAttr();
        // 设置电脑端购买方式为手机扫码购买弹框显示
        $('#set-two-dimension-code').on('show', function () {
            $.ajax({
                url: '/merchant/getQRcodeTips',
                type: 'post',
                dataType: 'json',
            }).done(function (rsp) {
                if (rsp && rsp.status) {
                    $('#site-qRcodeTips').val(rsp.result.qrcode_tips);
                } else {
                    layer.msg('获取提示内容失败');
                }
            });
        });
    }

    // sui radio样式添加checked
    function radioCheckedHelper (dataValue, currentValue) {
      /*eslint-disable eqeqeq*/
        if (dataValue == currentValue) {
            return true;
        }
        return false;
    }

    // sui checkbox样式添加checked
    function multiCheckedHelper (dataList, currentValue) {
        if (!_.isArray(dataList)) {
            dataList = (dataList + '').split(',');
        }

        return (_.findIndex(dataList, function (v) {
            return v == currentValue;
        }) !== -1);
    }

    function chooseMerge (datas) {
        var options = [{
            key: '请选择',
            value: 0,
        }];
        options.push.apply(options, datas);
        return options;
    }

    // 读取商品信息
    function getInfoByApprovalNumber (thisObj,approval_number) {

        var vm = thisObj;
        // if (!this.goodsDetail.approvalNumber.trim()) {
      var type = $('input[name="detail_tpl"]').val();
        if (!approval_number.trim()) {
            layer.msg('请先填写批准文号！');
            return;
        }

        $.ajax({
            url: "product/find51jk",
            type: 'post',
            data: {
                approval_number: approval_number,
                //detail_tpl: type,
                page: 1,
                pageSize: 1000,
                hasExtdFields: 1,   //查询扩展表
              //renewable:"Y",
            }
        }).done(function (data) {
            var rsp = JSON.parse(data);
            var result = rsp.result;
            if (rsp && rsp.status && result.items.length) {
                $("#approval_number_mutiple .item_lists").empty();
                $("#approval_number_mutiple").modal('show');
                $("#approval_number_mutiple .total_items").html(result.total_items);

                if(result.items.length > 1){
                  for(var i=0;i<result.items.length;i++)
                  {
                    var itm=result.items[i];
                    var $itemLists = $("#approval_number_mutiple .item_lists");
                    $itemLists.append("<tr>\
                    <td>"+itm.drug_name+"</td>\
                    <td>"+(itm.barnd_name!=null?itm.barnd_name:"无")+"</td> \
                    <td>"+itm.specif_cation+"</td>\
                    <td><a href='#' goodsId='"+itm.goods_id+"' class='checkBtn'>确定</a></td></tr>");
                    $itemLists.find('tr:eq(-1)').find('a').data('record', itm);
                  }
                }else if(result.items.length == 1){

                  $("#approval_number_mutiple").modal("hide");
                  // var goods_id = $(this).attr("goodsId");
                  // getGoodsData(goods_id);
                  $('.lee_product_ts_info:not(.hidden)').addClass('hidden');
                  var goodsDetail = {};
                  var record = result.items[0];
                  _.each(record, function (v, k) {
                    goodsDetail[_.camelCase(k)] = v;
                  });
                  goodsDetail.goodsId = null;
                  if (!/(,?\s?\d+)+/.test(goodsDetail.goodsForpeople)) {
                    goodsDetail.goodsForpeople = [];
                  } else {
                    goodsDetail.goodsForpeople = goodsDetail.goodsForpeople.split(',');
                  }
                  vm.goodsDetail = goodsDetail;
                  $.get('/merchant/product/join51jkByCode/' + goodsDetail.userCateid, function (rsp) {
                    if (rsp.code === '000') {
                      vm.goodsDetail.userCateid = rsp.value.cate_id;
                    }
                  }, 'json');

                  // 清空富文本编辑框
                  editor2.html('');
                  editor4.html('');
                  // editor3.html("");
                  if (goodsDetail.goodsDescription) {
                    editor1.html(goodsDetail.goodsDescription);
                  } else {
                    editor1.html('');
                  }

                  //加载页面后计算TextArea中文本的长度
                  setTimeout(function countTextArealength() {
                    $("textarea").each(function () {
                      $(this).siblings('.num-limit').find('.js-pl-limit').empty().append(this.value.length);
                    });

                  },2000);
                }

            } else {
                $('.lee_product_ts_info').removeClass('hidden');
            }
        });
    }

    $(document).on('click', '.checkBtn', function (){
        $("#approval_number_mutiple").modal("hide");
        // var goods_id = $(this).attr("goodsId");
        // getGoodsData(goods_id);
        $('.lee_product_ts_info:not(.hidden)').addClass('hidden');
        var goodsDetail = {};
        var record = $(this).data('record');
        _.each(record, function (v, k) {
            goodsDetail[_.camelCase(k)] = v;
        });
        goodsDetail.goodsId = null;
        if (!/(,?\s?\d+)+/.test(goodsDetail.goodsForpeople)) {
          goodsDetail.goodsForpeople = [];
        } else {
          goodsDetail.goodsForpeople = goodsDetail.goodsForpeople.split(',');
        }
        vm.goodsDetail = goodsDetail;
        $.get('/merchant/product/join51jkByCode/' + goodsDetail.userCateid, function (rsp) {
          if (rsp.code === '000') {
            vm.goodsDetail.userCateid = rsp.value.cate_id;
          }
        }, 'json');

        // 清空富文本编辑框
        editor2.html('');
        editor4.html('');
        // editor3.html("");
        if (goodsDetail.goodsDescription) {
            editor1.html(goodsDetail.goodsDescription);
        } else {
            editor1.html('');
        }

      //加载页面后计算TextArea中文本的长度
      setTimeout(function countTextArealength() {
        $("textarea").each(function () {
          $(this).siblings('.num-limit').find('.js-pl-limit').empty().append(this.value.length);
        });

      },2000);
    });

    var purchaseWayItem = [{
        key: '显示【立即购买，购物车】',
        value: 110,
    }, {
        key: '显示【手机扫码购买】',
        value: 120,
    }, {
        key: '显示【立即购买，购物车，手机扫码购买】',
        value: 130,
    }, {
        key: '显示【该商品仅供展示，显示价格】',
        value: 140,
    }/*, {
      key: '显示【该商品仅供展示，隐藏价格】',
      value: 150,
    }*/];

    var wxPurchaseWayItem = [{
        key: '显示【立即购买，购物车】',
        value: 110,
    }, {
        key: '显示【该商品仅供展示，显示价格】',
        value: 120,
    }, {
      key: '显示【该商品仅供展示，隐藏价格】',
      value: 121,
    }, {
        key: '显示【预约购买】',
        value: 130,
    }];

    var computed = {
        goodsRadio: function () {
            return {
                drugCategory: {
                    cls: 'radio-pretty inline',
                    data: getTplData(this.goodsDetail.detailTpl, 'drugCategory'),
                },
                goodsUse: {
                    cls: 'radio-pretty inline',
                    data: getTplData(this.goodsDetail.detailTpl, 'goodsUse'),
                },
                isMedicare: {
                    cls: 'radio-pretty inline',
                    data: getTplData(this.goodsDetail.detailTpl, 'goodsIsMedicare'),
                },
                goodsStatus: {
                    cls: 'radio-pretty inline',
                    data: getTplData(this.goodsDetail.detailTpl, 'goodsStatus'),
                },
                updateStatus: {
                    cls: 'radio-pretty inline',
                    data: getTplData(this.goodsDetail.detailTpl, 'updateStatus'),
                },
                controlNum: {
                    cls: 'radio-pretty inline',
                    data: getTplData(this.goodsDetail.detailTpl, 'controlNum'),
                },
                purchaseWay: {
                    data: purchaseWayItem,
                },
                wxPurchaseWay: {
                    data: wxPurchaseWayItem,
                },
            };
        },
        goodsChoose: function () {
            return {
                goodsProperty: {
                    data: chooseMerge(getTplData(this.goodsDetail.detailTpl, 'goodsProperty')),
                },
                goodsForts: {
                    data: chooseMerge(getTplData(this.goodsDetail.detailTpl, 'goodsForts')),
                },
            };
        },
        goodsMulti: function () {
            return {
                goodsForpeople: {
                    cls: 'checkbox-pretty inline',
                    data: getTplData(this.goodsDetail.detailTpl, 'goodsForpeople'),
                },
            };
        },
    };

    var vueConfig = {
      el: '#goods-edit',
      template: '#goods-info-temp',
      data: function () {
        return {
          goodsDetail: {
            drugCategory: 110,
            goodsProperty: 0,
            goodsForts: 0,
            goodsUse: 110,
            goodsForpeople: [110],
            isMedicare: 1,
            goodsStatus: 2,
            updateStatus: 0,
            detailTpl: 0,
            purchaseWay: 110,
            wxPurchaseWay: 110,
            userCateid: 0,
            integralGoodsIsDel: 0,
            integralExchanges: '',
            net_wt: '',
            controlNum: 0,
            integralGoodsLimitEach:1,
            storeIdNum:0,
            storeIdCount:0,
            integralGoodsStoreIds:'',
            allStore:true,
          },
          warnBtn: 'sui-btn btn-warning pull-right',
          control_num_radio: 0,
        };
      },
      watch: {
        'goodsDetail.detailTpl': function (newDetailTpl) {
          if (newDetailTpl) {
            productConfig.initFieldInfo(newDetailTpl);
          }
            // this.answer = 'Waiting for you to stop typing...'
            // this.getAnswer()
        },
        'goodsDetail.userCateid': function (newUserCateid) {
          // 由代码触发的分类id变化
          if (newUserCateid) {
            $('#cate_box').find('[role=menuitem][data-cateid=' + newUserCateid + ']').click();
          }
        },
        'goodsDetail.controlNum': function (newValue) {
          if (newValue == '') {
            // 限制值为空 设置为不限购
            this.control_num_radio = 0;
          }
        }
      },
      computed: computed,
      components: {},
      methods: {
        monitorIntegralGoodsDiv: monitorIntegralGoodsDiv,
        judgeIsIntegralGoods: judgeIsIntegralGoods,
        showStoreList: showStoreList,
        extractStoreAll: function(){
          this.goodsDetail.allStore = true;
          extractStoreAll();
        },
        noExtractStoreAll:function () {
          this.goodsDetail.allStore = false;
        },
        noLimitEach:function () {
          this.goodsDetail.integralGoodsLimitEach = '';
        },
        generateNowTime:function () {
          generateTime(0);
        },
        radioCheckedHelper: radioCheckedHelper,
        multiCheckedHelper: multiCheckedHelper,
        placeholder: function (field) {
          var detailTpl = this.goodsDetail.detailTpl;
          if (detailTpl == 70) {
            if (field === 'drug_name') {
              return '请输入中药名';
            }
            if (field === 'com_name') {
              return '请输入别名';
            }
            if (field === 'goods_company') {
              return '请输入产地分布';
            }
          }
          if(detailTpl==100){
            if (field === 'drug_name') {
              return '请输入医生名';
            }
          }

          if (field === 'drug_name') {
            return '请输入商品名';
          }
          if (field === 'com_name') {
            return '请输入通用名';
          }
          if (field === 'goods_company') {
            return '请输入生产企业';
          }

          return '通用名';
        },
      },
      filters: {
          currencyFormat: function (value) {
              return value?(parseFloat(value) / 100).toFixed(2):"";
          },
      },
      mounted: function () {
        var self = this;

        if (decodeURI(location.search).match(/.*approval_number=([\u4E00-\u9FA5\uF900-\uFA2D]*[A-Z]*[a-z]*[0-9]*).*/) != null){
          var approval_number =decodeURI(location.search).match(/.*approval_number=([\u4E00-\u9FA5\uF900-\uFA2D]*[A-Z]*[a-z]*[0-9]*).*/)[1];
          getInfoByApprovalNumber(self,approval_number);
        }

        if (location.pathname === '/merchant/productModify') {
          // 如果是编辑商品
          var goodsId = (location.search.match(/.*goodsId=(\d+).*/) || [])[1];
          if (goodsId) {
            getGoodsData(goodsId).done(function (goodsDetail) {

                if(goodsDetail.integralGoodsIsDel == 0){

                  goodsDetail.integralGoodsLimitEach = 1;

                }

                self.goodsDetail = goodsDetail;

            }).done(function () {
              // 分类下拉组件
              $('#cate_box').category({
                defaultId: self.goodsDetail.userCateid,
                changed: cateChanged,
              });
              if(location.hash == '#copy'){
                self.goodsDetail = _.assign(self.goodsDetail, {
                  goodsIdOld:self.goodsDetail.goodsId,
                  goodsId: null,
                  goodsStatus: 2,
                });
              }
            });
          }
        } else {
          var detailTpl = (location.search.match(/.*type=(\d+).*/) || [])[1];
          // $('#detail_tpl').val(detailTpl);
          self.goodsDetail.detailTpl = detailTpl;
          // 分类下拉组件
          $('#cate_box').category({
            defaultId: $('[name=user_cate_id]').val(),
            changed: cateChanged,
          });
        }
      },
    };

    function cateChanged (event) {
        // console.log('cate change');
        // console.log(vm);
        vm.goodsDetail.userCateid = this.value;
        // $('[name=user_cate_id]').val(event.target.value);
    }

    function getGoodsData (goodsId) {
      return $.ajax({
        type: 'POST',
        url: "./bgoodsOne",
        data: {"goodsId": goodsId},
        dataType: 'json',
      }).pipe(function (data) {
        if (!data.goods) {
          layer.alert("商品不存在", function () {
            history.back();
          });
          return {};
        }

        $('input[name="integral_goods_start_time"]').val(data.goods.integralGoodsStartTime);
        $('input[name="integral_goods_end_time"]').val(data.goods.integralGoodsEndTime);

        if (!/(,?\s?\d+)+/.test(data.goods.goodsForpeople)) {
          data.goods.goodsForpeople = [];
        } else {
          data.goods.goodsForpeople = data.goods.goodsForpeople.split(',');
        }

        // 设置富文本编辑框文本
        setEditorHtml(data.goods);

        $("#bar_code2").val(data.goods.barCode);
        $("#goods_code2").val(data.goods.goodsCode);

        if(data.has_erp_price==1){
          $("#erpPiceDiv").show();
        }

        return data.goods;
      });
    }

  function initialization () {
    // registerComponent();

    /*eslint-disable no-new*/
    // 这是一个只使用vue双向数据绑定来避免大量dom操作
    vm = new Vue(vueConfig);
    jQEventBind();
    productPolyfill();
  }

  function setEditorHtml(goods) {
    if (goods.goodsDescription) {
      editor1.html(goods.goodsDescription);
    }
    if (goods.goodsDesc) {
      editor2.html(goods.goodsDesc);
    }
    if (goods.goodsMobileDesc) {
      editor4.html(goods.goodsMobileDesc);
    }
    if (goods.qualification) {
      $("#qualification_default").val('isexist');
      editor3.html(goods.qualification);
    }
  }

    // 下面是以前代码
    function productPolyfill () {
        KindEditor.lang({
            example1: '插入图片'
        });
        KindEditor.plugin('example1',
            function (K) {
                var self = this,
                    name = 'example1';
                self.clickToolbar(name,
                    function () {
                 /* if($('#upload_N')) {
                    console.log('------------------------------------');*/
                    $('#upload_N').attr('class','sui-modal show');
                 /* }else if($('#upload')){
                    console.log('12322222','------------------------------------');*/
                    $('#upload').modal('show');
                  /*}*/
                        curEdit = self.items[27];
                        console.log(self.items[27]);
                    });
            });

        editor1 = KindEditor.create('.kindeditor_lee_1', {
            allowFileManager: true,
            items: ['source', 'copy', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', '|', 'selectall', 'fullscreen', 'table', 'hr', 'link', '|', 'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', '|', 'example1', 'kindeditor_lee_1']
        });
        editor2 = KindEditor.create('.kindeditor_lee_2', {
            allowFileManager: true,
            items: ['source', 'copy', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', '|', 'selectall', 'fullscreen', 'table', 'hr', 'link', '|', 'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', '|', 'example1', 'kindeditor_lee_2']
        });

        editor4 = KindEditor.create('.kindeditor_lee_4', {
            allowFileManager: true,
            items: ['source', 'copy', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', '|', 'selectall', 'fullscreen', 'table', 'hr', 'link', '|', 'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', '|', 'example1', 'kindeditor_lee_4']
        });
        editor3 = KindEditor.create('.kindeditor_lee_3', {
            allowFileManager: true,
            items: ['source', 'copy', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', '|', 'selectall', 'fullscreen', 'table', 'hr', 'link', '|', 'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', '|', 'example1', 'kindeditor_lee_3'],
            afterFocus: function () {

                if ($("#qualification_default").val() == '') {
                    editor3.html("");
                }
                //用户在编辑中
                $("#qualification_default").val('editing');
            },
            afterBlur: function () {
                if (editor3.html() == '') {
                    $("#qualification_default").val('');
                    editor3.html('<span style="color: rgb(204, 204, 204); ">1、请填写或上传《药品经营质量管理规范认证证书》(GMP)；<br />2、请填写或上传《药品检验报告》。</span>');
                }
            }
        })

        require(['product', 'productedit'], function (product, edit) {
            if($('input[name="detail_tpl"]').val() == '10') {
                if($('input[name="drug_category"]').val() == '130' || $('input[name="drug_category"]').val() == '140') {
                    $('.drug_category_msg').removeClass('lee_hide')
                }else{
                    $('.drug_category_msg').addClass('lee_hide')
                }
            }
            if($('input[name="detail_tpl"]').val() == '100') {
                $('.drug_category_msg').addClass('lee_hide');
                //$('#purchaseWayRad').addClass('lee_hide');
                $('.msg-tips').addClass('lee_hide');
               // $('#H_active').html('<li class="active"><a id="Hphone_active" data-toggle="tab">手机端</a></li>');
            }

            // 初始化富文本编辑器
            createKindEditor();
            // 初始化分类
            // product.getCategory();

            // 校验
            edit.editAddValidate();
            // 添加事件
            ProductAddEvents();
            // 规格格式检查
            edit.specifcationInspect();
        });

        $(function () {
            if($('#pre_order_set').val() == 140 || $('#pre_order_set').val() == 130 || $('#pre_order_set').val() == 150) {
                $('#wx_purchase_way130').attr('checked', true);
            }
        });

        // 富文本编辑器
        function createKindEditor () {
            require(['productedit'], function (edit) {
                edit.setKindEditor(editor1, editor2, editor3)
            });
        }
    }
    // endregion

    require(['vue', 'lodash', 'productconfig', 'categoryChoose'], function (_Vue, _lodash, _pc) {
        Vue = _Vue;
        _ = _lodash;
        productConfig = _pc;
        // FIXME 这里需要修改成观察detail_tpl变化 detail_tpl变化 对应的数据也应该发生改变
        getTplData = _pc.getTplData;
// require(['categoryChoose'], function () {
      /*$('#cate_box').category({
       defaultId: $('#initcateid').val(),
       });*/
        // });
        initialization();
    });
})();

// 事件
function ProductAddEvents () {
    require(['productedit', 'pubmig'], function (edit, pubmig) {
        $('#Hpc_active').click(function () {
            $('#pc_active').removeClass('hide')
            $('#phone_active').addClass('hide')
        })
        $('#Hphone_active').click(function () {
            $('#phone_active').removeClass('hide')
            $('#pc_active').addClass('hide')
        })

        $('.pc_save').click(function () {
            edit.SaveText('pc')
        })
        $('.phone_save').click(function () {
            edit.SaveText('phone')
        })


        // 提交商品信息
        $('#product_form').validate({
            success: function ($form) {
                $('#wx_purchase_way130').val($('#pre_order_set').val())
                if($('#wx_purchase_way130').prop('checked') == true && ($('#pre_wx').prop('checked') == false && $('#pre_phone').prop('checked') == false) && !$('#wx_purchase_way130').val()) {
                    layer.alert('您还没有设置“显示【预约购买】”的类型');
                } else if (!+$('[name=user_cate_id]').val()) {
                    layer.alert('请选择分类');
                } else {
                    try {
                        edit.editSaveItem();
                    } catch (e) {
                        layer.alert("保存发生错误");
                    }
                }

                return false;
            },
            unhighlight: function ($input, $error, inputErrorClass) {
                $input.removeClass(inputErrorClass);
                $error.hide();
            },
        });


        // 相同商品确认
        $('.continue_submit').click(function () {
            $('#product_form_submit').click()
        })
        // 显示预约“设置”按钮
        $('.order_buyer_out').click(function () {
            if($('#pre_order_set').val() == 130) {
                $('#pre_wx').prop('checked', true)
                $('#pre_phone').prop('checked', true)
            }else if($('#pre_order_set').val() == 140) {
                $('#pre_wx').prop('checked', false)
                $('#pre_phone').prop('checked', true)
            }else if($('#pre_order_set').val() == 150) {
                $('#pre_wx').prop('checked', true)
                $('#pre_phone').prop('checked', false)
            }else{
                $('#pre_wx').prop('checked', false)
                $('#pre_phone').prop('checked', false)
            }
        })
        // 显示预约“设置” 保存按钮设置
        $('.order_buyer_save').click(function () {
            // FIXME ????
            if($('#pre_wx').prop('checked') == true && $('#pre_phone').prop('checked') == true && $('#wx_purchase_way130').prop('checked') == true) {
                $('#wx_purchase_way130').attr('value', 130)
                $('#pre_order_set').attr('value', 130)
            }else if($('#pre_phone').prop('checked') == true && $('#wx_purchase_way130').prop('checked') == true) {
                $('#wx_purchase_way130').attr('value', 140)
                $('#pre_order_set').attr('value', 140)
            }else if($('#pre_wx').prop('checked') == true && $('#wx_purchase_way130').prop('checked') == true) {
                $('#wx_purchase_way130').attr('value', 150)
                $('#pre_order_set').attr('value', 150)
            }
            if($('#wx_purchase_way130').prop('checked') == false) {
                layer.alert('您未选择“预约购买”!')
                return false
            }
        })
        // 获取批准文号
        $('#get_drug_info').click(function () {
            edit.editGetApprovalNumber()
        })

        // 判断限数是否显示
        $('input[name="control_num_radio"]').click(function () {
            edit.editControlNum(this)
        })

        // 品牌处理
        // $('input[name="brand_name"]').change(function () {
        //   edit.editBrand(this)
        // })

        // 设置商品二维码提示文字信息
        $('.set-site-qRcodeTips-btn').click(function () {
            edit.editQRcodeTips()
        })

        // 选择分类
        $('#lee_add_classify').on('click', 'a', function () {
            $('#lee_add_classify_a').html('<i class="caret"></i>' + ($(this).html().replace('<i class="sui-icon icon-angle-right pull-right"></i>', '')))
            $("input[name='classify']").val($(this).attr('data'))
        })

        // 设置(页面二维码)按钮，弹框时将里面的内容重置
        $('.set-dimension-btn-dialog').click(function () {
            $('#site-qRcodeTips').val($('#site-qRcodeTips').next().val())
        })
        // 设置图标弹框框显示
        $('#set_picture').on('show', function() {
            edit.getGoodsIconStatus();
        });

        $('.setGoodsIconStatus').click(function () {
            edit.setGoodsIconStatus()
        })
        // 更多图片
        document.getElementById('input_file').addEventListener('change', ProductAddHandleFileSelect, false)

        // 删除商品事件
        $('.deleteItem').on('click', function () {
            layer.confirm('确定要删除吗？', function (idx) {
                layer.close(idx);
                edit.editDeleteGood();
            });
        })

        $('[data-rules]').on('focus', function () {
            $(this).parents('.controls').find('.sui-msg.msg-error.help-inline').each(function () {
                $(this).remove()
            })
        })

        $('input[name="drug_category"]').change(function () {
            if($('input[name="detail_tpl"]').val() == '10') {
                if($(this).val() == '130' || $(this).val() == '140') {
                    $('.drug_category_msg').removeClass('lee_hide')
                }else{
                    $('.drug_category_msg').addClass('lee_hide')
                }
            }
        })
        // 图片选择事件
        pubmig.ImgEvents()
    });
}
// 医保协议
function ProductAddGetProtocol () {

    require(['productedit'], function (edit) {
        edit.editProtocol();
    })
}

// 文件上传
function ProductAddHandleFileSelect (evt) {
    require(['productedit'], function (edit) {
        edit.editHandleFileSelect(evt).done(function (img_url) {
            if(curEdit == 'kindeditor_lee_3') {
                if($('#qualification_default').val() == '') {
                    editor3.html('')
                    $('#qualification_default').val('editing')
                }
            }

            $.each(img_url, function (k, v) {
                KindEditor.insertHtml('.' + curEdit, "<img src='" + v + "' />");
            });
        });
    });
}


var alllist = [];//所有门店数组
var len = 0;//平台门店总数量
var searchlist = [];//查询得到的门店列表

var allStoreIds = '';

/**
 *页面初始化
 */
var getstores = function () {
  var name = $("[name=store_name]").val();
  var storenumber = $("[name=store_number]").val();
  $.ajax({
      async: false,
      type: "POST",
      url: "/merchant/storeList",
      data: {
        "store_name": name,
        "storeNumber": storenumber
      },
      dataType: "JSON",
      success: function (data) {
        $(".stores_list").empty();
        len = data.storeList.length;
        alllist = data.storeList;

        var stores_id = "";
        for(i in alllist){
          stores_id += alllist[i].id + ',';
        }
        stores_id = stores_id.substr(0, stores_id.length - 1);
        if (stores_id) allStoreIds = stores_id;

        $("[name=storeIds_old]").val(data.ounpricing);
      }
    }
  )
}
/**
 * 查询
 */
var search = function () {
  var name = $("[name=store_name]").val();
  var storenumber = $("[name=store_number]").val();
  $.ajax({
      async: false,
      type: "POST",
      url: "/merchant/storeList",
      data: {
        "store_name": name,
        "storeNumber": storenumber
      },
      dataType: "JSON",
      success: function (data) {
        searchlist = data.storeList;
      }
    }
  )
}

//渲染门店列表
function showlist(storelist) {
  $(".stores_total").html(len);
  $(".stores_list").empty();
  var tr = '';
  if (storelist.length > 0) {
    for (var i = 0; i < storelist.length; i++) {
      var str = "";
      // if (storelist[i].serviceSupport.indexOf("150") > -1 && storelist[i].serviceSupport.indexOf("160") > -1) {
      //   str = "送货上门，门店自提";
      // } else if (storelist[i].serviceSupport.indexOf("150") > -1) {
      //   str = "送货上门";
      // }

      if (storelist[i].serviceSupport.indexOf("160") > -1) {
        str = "门店自提";
        tr += "<tr><td width='3%'></td><td style='width:24%'><label data-toggle='checkbox' class='checkbox-pretty inline'>" +
          "<input name='gid' type='checkbox'><span>" + storelist[i].storesNumber + "</span></label></td><td style='width:33%'><span>" + storelist[i].name + "</span></td>" +
          "<td style='width:30%'>" + str + "</td><td><input name='stores_number' value='" + storelist[i].storesNumber + "' type='hidden'>" +
          "<input name='id' value='" + storelist[i].id + "' type='hidden'><input name='name' value='" + storelist[i].name + "' type='hidden'>" +
          "<input name='service_support' value='" + storelist[i].serviceSupport + "' type='hidden'><a href='javascript:void(0)' class='select_stores_btn'>指定</a>" +
          "</td></tr>";
      }

      // else {
      //   str = "---";
      // }


    }

    if(!tr || tr == '' ){
      tr = "该商户未查询到合适的自提门店"
    }

  } else {
    tr = "该商户未查询到门店信息";
  }
  $(".stores_list").append(tr);
}
/**
 * 渲染自主定价门店列表
 * @param storelist
 * @param promissionids
 */
function oldStoresShow(storelist, promissionids) {
  var tr1 = "";//参加自主定价的门店列表
  var tr2 = "";//不参加自主定价的门店列表
  var tmpl = document.getElementById('select_store_list_templete').innerHTML;
  var doTtmpl = doT.template(tmpl);
  for (var i = 0; i < len; i++) {
    var ds = {};//拥有权限的数组
    var dd = {};//禁止权限的数组
    if (promissionids.length > 0) {
      if (promissionids.indexOf(storelist[i].id) > -1) {//拥有权限的id
        ds.id = storelist[i].id;
        ds.name = storelist[i].name;
        ds.service_support = storelist[i].serviceSupport;
        ds.stores_number = storelist[i].storesNumber;
        tr1 += doTtmpl(ds);
      }
    }
  }
  $(".select_stores_list").empty();
  $(".select_stores_list").append(tr1);

}

/**
 * 将字符串切割成数组
 */
function toarray(proids) {
  var ids = [];
  if (proids != "" && proids != null) {
    if (proids.length == 1) {
      ids.push(parseInt(proids));
    } else {
      var t = proids.split(",");
      for (var i = 0; i < t.length; i++) {
        ids.push(parseInt(t[i]));
      }
    }
  }
  return ids;
}

$(function () {

  getstores();

  //列表搜索
  $(".search_stores_btn").click(function () {
    search();
    showlist(searchlist);
  });

  /**
   * 弹框确定后的操作
   */
  $(".select-store-ok").click(function () {
    var stores_id = "";
    $(".select_stores_list input[name='id']").each(function () {
      stores_id += $(this).val() + ",";
    });
    stores_id = stores_id.substr(0, stores_id.length - 1);
    if (stores_id) {

      $("#extract_store_num_div a").text($(".select_stores_list input[name='id']").length);

      $('#integral_goods_store_ids').remove();
      $('#product_form').prepend('<input type="hidden" id="integral_goods_store_ids" name="integral_goods_store_ids" value="'+ stores_id +'">');

      // $('#integral_goods_store_ids').val(stores_id);

      // var storeNamesDiv = $('.mer-box');
      // storeNamesDiv.html('');
      // $(".select_stores_list input[name='name']").each(function () {
      //   storeNamesDiv.append('<div class="box-item" title="'+ $(this).val() +'">'+ $(this).val() +'</div>')
      // });

      $("#extract_store_num_div").show();

      $("#select_stores").modal("hide");
    } else {
      layer.msg('请选择至少一个门店！');
    }
  });

})

//全选
function extractStoreAll(){
  if($("#extract_store_all").is(':checked')){
    $("#extract_store_div").hide();
    $("#extract_store_num_div").hide();

    $("#extract_store_num_div a").text(alllist.length);

    $('#integral_goods_store_ids').remove();
    $('#product_form').prepend('<input type="hidden" id="integral_goods_store_ids" name="integral_goods_store_ids" value="'+ allStoreIds +'">');
  }
}

function generateTime(value) {

  var now_time = new Date();
  var start_time = $('input[name="integral_goods_start_time"]').val();
  var end_time = '';

  var regDate = /^(\d{4})-(\d{2})-(\d{2})\s([0-2][0-9]):([0-5][0-9])$/;

  if(start_time && !regDate.test(start_time)){
    layer.msg("填写的兑换开始时间格式不正确(请使用yyyy-MM-dd hh:mm格式)");
    return;
  }

  if(value == 0){
    $('input[name="integral_goods_start_time"]').val(formatTime(now_time,"yyyy-MM-dd hh:mm"));
  }

  if(value == -1){
    $('input[name="integral_goods_end_time"]').val('');
    if(!start_time){
      $('input[name="integral_goods_start_time"]').val(formatTime(now_time,"yyyy-MM-dd hh:mm"));
    }
  }

  if(value > 0){
    if(start_time){
      start_time = new Date(start_time);
      start_time.setDate(start_time.getDate() + value - 1);
      end_time = start_time;
      $('input[name="integral_goods_end_time"]').val(formatTime(end_time,"yyyy-MM-dd")+ ' 23:59');
    }else {
      $('input[name="integral_goods_start_time"]').val(formatTime(now_time,"yyyy-MM-dd hh:mm"));
      now_time.setDate(now_time.getDate() + value - 1);
      end_time = now_time;
      $('input[name="integral_goods_end_time"]').val(formatTime(end_time,"yyyy-MM-dd") + ' 23:59');
    }
  }

}

function formatTime(time,format) {

  if (time) {
    try {
      var date = new Date(time);
      var paddNum = function (num) {
        num += "";
        return num.replace(/^(\d)$/, "0$1");
      }
      //指定格式字符
      var cfg = {
        yyyy: date.getFullYear() //年 : 4位
        , yy: date.getFullYear().toString().substring(2)//年 : 2位
        , M: date.getMonth() + 1  //月 : 如果1位的时候不补0
        , MM: paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
        , d: date.getDate()   //日 : 如果1位的时候不补0
        , dd: paddNum(date.getDate())//日 : 如果1位的时候补0
        , hh: paddNum(date.getHours())  //时
        , mm: paddNum(date.getMinutes()) //分
        , ss: paddNum(date.getSeconds()) //秒
      }
      format || (format = "yyyy-MM-dd hh:mm:ss");
      return format.replace(/([a-z])(\1)*/ig, function (m) {
        return cfg[m];
      });
    } catch (e) {
      return time;
    }
  } else {
    return "";
  }
}
