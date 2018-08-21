/*eslint-disable camelcase*/
/*eslint-disable space-return-throw-case*/
/*eslint-disable space-after-keywords*/
(function () {
  var Vue;
  var YBZF;
  var layer;
  var _;
  var product;
  var goodList;
  var vm;

  function getGoodsData(goodsId,goodsStatus) {
    var goods_status = goodsStatus?goodsStatus:'';
    var dfd = YBZF.services({
      url: '/goods/query',
      data: {
        id: goodsId,
        goods_status:goods_status
      },
    }).pipe(function (rsp) {
      if (rsp && rsp.status) {
        var goodsDetail = rsp.result.items[0];

        if (goodsDetail&&goodsDetail.goods_forpeople) {
          goodsDetail.goods_forpeople = (goodsDetail.goods_forpeople + '').split(',');
        }

        return goodsDetail;
      }

      return {};
    });
    console.log(dfd,"dfd");
    return dfd;
  }

  function getMerchantGoodsData(goodsId,goodsStatus,siteId) {
    var goods_status = goodsStatus?goodsStatus:'';
    var dfd = YBZF.services({
      url: '/goods/merchantgoodquery',
      data: {
        id: goodsId,
        siteId:siteId,
        goods_status:goods_status
      },
    }).pipe(function (rsp) {
      if (rsp && rsp.status) {
        var goodsDetail = rsp.result.items[0];

        if (goodsDetail&&goodsDetail.goods_forpeople) {
          goodsDetail.goods_forpeople = (goodsDetail.goods_forpeople + '').split(',');
        }

        return goodsDetail;
      }

      return {};
    });

    return dfd;
  }


  function formValidate() {
    $('.sui-form').validate({
      'success': function ($form) {
        var formData = new FormData($form[0]);
        var goods_id = $("input[name='goods_id']").val();
        if(goods_id){
          save (formData,$form);
        }
        confirmSave().done(function (rsp) {
          if (rsp && rsp.result && rsp.result.items.length) {
            var tmpl = document.getElementById('goods-list-template2').innerHTML;
            var doTtmpl = doT.template(tmpl);
            $("#goods-list2").html(doTtmpl(rsp.result));
            $("#multiple-standard-remimd").modal("show").on('okHide', function () {
              save(formData,$form);
            });
          } else {
            save(formData,$form);
          }
        });

        return false;
      },
    });

    function save (formData,$form ) {
      var goodsForpeoples = formData.getAll('goods_forpeople');
      formData.delete('goods_forpeople');
      formData.append('goods_forpeople', goodsForpeoples.join(','));
      YBZF.services({
        'url': $form.prop('action'),
        'type': $form.prop('method'),
        'dataType': 'json',
        'data': formData,
        'contentType': false, // 告诉jQuery不要去处理发送的数据
        'processData': false, // 告诉jQuery不要去设置Content-Type请求头
      }).done(function (rsp) {
        if (rsp.status) {
          var goods_id = rsp.result.goods_id || $('[name=goods_id]').val();
          location.href = '/jk51b/goods/joinimg?goodId=' + goods_id;
          /*if (!rsp.equaltips) {
            var goods_id = rsp.result.goods_id || $('[name=goods_id]').val();
            location.href = '/jk51b/goods/joinimg?goodId=' + goods_id;
          } else {
            // 添加商品时 存在相同批准文号的商品
            var html = $.tmpl($('#goods-list-template').html(), rsp.result);
            $.alert({
              'backdrop': 'static',
              'width': 'large',
              'title': '多规格商品提醒',
              'hasfoot': true,
              'okBtn': '确定',
              'cancelBtn': '取消',
              'body': html,
              'okHide': function () {
                formData.append('ignore_search', 1);
                YBZF.services({
                  'url': $form.prop('action'),
                  'type': $form.prop('method'),
                  'dataType': 'json',
                  'data': formData,
                  'contentType': false, // 告诉jQuery不要去处理发送的数据
                  'processData': false,  // 告诉jQuery不要去设置Content-Type请求头
                }).done(function (rsp) {
                  console.log(rsp);
                  if (rsp.status) {
                    var goods_id = rsp.result.goods_id || $('[name=goods_id]').val();
                    location.href = YBZF.hostname + '/shop/joinimg?itemid=' + goods_id;
                  } else {
                    layer.msg(rsp.result.msg || '未知错误');
                  }
                });
              },
            });
          }*/
        } else {
          layer.msg(rsp.result.msg || '未知错误');
        }
      });
    }
  }

  // 选中大选框
  function radioChecked(val, arr, ele) {
    for (var i = 0; i < arr.length; i++) {
      /*eslint-disable eqeqeq*/
      if (val == arr[i]) {
        ele.eq(i).parent().addClass('checked');
        ele.eq(i).attr('checked', true);
      }
    }
  }

  function jQEventBind() {
    // $('#barnd_name').on('blur', function () {
    //   var val = this.value;
    //   if (val) {
    //     var barnd_id = '';
    //     $.each(brand.result, function (k, v) {
    //       if (v.barnd_name == val) {
    //         barnd_id = v.barnd_id;
    //       }
    //     });
    //
    //     $('#barnd_id').val(val);
    //   }
    // });

    // 编辑页 设置分类
    if (typeof user_cateid !== 'undefined') {
      $('li[role=presentation]').each(function () {
        if ($(this).find('>a').attr('value') == user_cateid) {
          var $active = $(this).find('>a');
          $('[name=user_cateid]').siblings('span').empty().append($active.text()).end().val($active.attr('value'));
        }
      });
    }

    // setFieldAttr();
    // product.initFieldInfo(location.search.substr(location.search.length-2,2));
    formValidate();

    //计算TextArea中文本的长度
    setTimeout(function countTextArealength() {
      $("textarea").each(function () {
        $(this).siblings('.num-limit').find('.js-pl-limit').empty().append(this.value.length);
      });

    },2000);


    //表单提交
    $(document).on('click', '#formSubmit', function(){

     /* var cateId = $("input[name='user_cateid']").val();
      var bar_code = $("#bar_code").val();
      if(cateId==""||cateId=="0"){
        layer.msg("请选择商品分类");
        return;
      }
      if(bar_code==""){
        layer.msg("请输入商品条形码");
        return;
      }

      $.ajax({
        type:"post",
        url:"./bar_code_one?bar_code="+bar_code,
        success:function (data) {
          if(data.status==="OK"){
            $("#goods_form").submit();
          }else{
            layer.msg("商品条形码已存在，请重新输入");
            return;
          }
        }
      });*/

      // if(!checkCode()){
      //   layer.msg("商品条形码已存在，请重新输入");
      //   return;
      // }
      $("#goods_form").submit();

    });
    //提交 根据商品ID修改商品的疾病标签与功效标签
    $(document).on('click', '#formLabelSubmit', function(){
      // $("#goods_label").submit();
      $.ajax({
        type: "post",
        url: "/jk51b/goods/updateEffectAndDiseaseLabelById",
        dataType: "json",
        data:{
          id: vm.goodsDetail.goods_id,
          diseaseLabel:vm.showDisease.join(","),
          efficacyLabel:vm.showEffect.join(","),
        },
        success: function(data) {
          console.log(data,"根据商品ID修改商品的疾病标签与功效");
          if(status==0){
            alert('标签提交成功');
            location.href = '/jk51b/goods/list';

          }
        },
        error: function() {
          console.log("请求失败！");
        }
      });


    });
    //读取标签页面信息
    $(document).on('click', '#labelTabsA', function(){
      //获取所有功效标签
      $.ajax({
        type: "post",
        url: "/jk51b/goods/getEffectAllLabel",
        dataType: "json",
        success: function(data) {
          console.log(data,"获取功效标签");
          if(status==0){
            vm.effectAllLabel=data.effectList;
          }
        },
        error: function() {
          console.log("请求失败！");
        }
      });
      //获取所有疾病标签
      $.ajax({
        type: "post",
        url: "/jk51b/goods/getDiseaseAllLabel",
        dataType: "json",
        success: function(data) {
          console.log(data,"获取疾病标签");
          if(status==0){
            vm.diseaseAllLabel=data.diseaseList;

            //获取商品标签数据
            $.ajax({
              type: "post",
              url: "/jk51b/goods/getEffectAndDiseaseLabelById",
              dataType: "json",
              data:{
                id: vm.goodsDetail.goods_id
              },
              success: function(data) {
                console.log(data,"根据商品ID查询商品的疾病标签与功效");
                if(status==0){
                  if(data.goodsLabelMap && data.goodsLabelMap.efficacyLabel && data.goodsLabelMap.efficacyLabel!='')
                  {
                    vm.showEffect=data.goodsLabelMap.efficacyLabel.split(',');
                  }
                  if(data.goodsLabelMap && data.goodsLabelMap.diseaseLabel && data.goodsLabelMap.diseaseLabel !='')
                  {
                    vm.showDisease=data.goodsLabelMap.diseaseLabel.split(',');
                    //计算疾病大类标签showDiseaseTag
                    for(var i=0;i<vm.diseaseAllLabel.length;i++){
                      for(var j=0;j<vm.showDisease.length;j++){
                        if(vm.diseaseAllLabel[i].labelList.indexOf(vm.showDisease[j])>=0){
                          vm.showDiseaseTag.push(vm.diseaseAllLabel[i]);
                        }
                      }

                    }
                    vm.showDiseaseTag=Array.from(new Set(vm.showDiseaseTag));
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });


          }
        },
        error: function() {
          console.log("请求失败！");
        }
      });

    });


    function checkCode(){
      var url = window.location;
      var barcodeVerifyStatus = true;
      var bar_code = $("#bar_code").val();
      if(bar_code==""){
        return;
      }
      if(url.toString().indexOf("modify") != -1){
        return true;
      }
      $.ajax({
        type:"post",
        url:"./bar_code_one?bar_code="+bar_code,
        async: false,
        success:function (data) {
          if(data.status==="OK"){
            $("#bar_code_err").hide();
            barcodeVerifyStatus = true;
          }else{
            $("#bar_code_err").html("商品条形码已存在，请重新输入");
            $("#bar_code_err").show();
            barcodeVerifyStatus = false;
          }
        }
      });

      return barcodeVerifyStatus;

    }

    //查询商品条形码是否存在
    var barcodeVerifyStatus = true;
    $(document).on('change', '#bar_code', function(){

      var bar_code = $("#bar_code").val();
      if(bar_code==""){
        return;
      }
      $.ajax({
        type:"post",
        url:"./bar_code_one?bar_code="+bar_code,
        success:function (data) {
          if(data.status==="OK"){
            $("#bar_code_err").hide();
            barcodeVerifyStatus = true;
          }else{
            $("#bar_code_err").html("商品条形码已存在，请重新输入");
            $("#bar_code_err").show();
            barcodeVerifyStatus = false;
          }
        }
      });
    });

    // 删除商品
    $(document).on('click', '#del-goods', function () {
      layer.confirm('你确定删除该商品吗?', function () {
        YBZF.services({
          'url': '/goods/delete',
          'data': {
            'ids': $('[name=goods_id]').val(),
          },
        }).done(function (rsp) {
          if (rsp.status) {
            layer.msg('删除成功', function () {
              // location.reload();
              //$("#del-goods").removeClass("sui-btn btn-warning pull-right").addClass("hidden sui-btn btn-warning pull-right");
              //$("#revert-del-goods").removeClass("hidden sui-btn btn-warning pull-right").addClass("sui-btn btn-warning pull-right");
              location.href = location.href.replace(/goods_status=\d?/, "goods_status=3");
            });
          } else {
            layer.msg(rsp.result.msg);
          }
        });
      });
    });

    // 撤销删除
    $(document).on('click', '#revert-del-goods', function () {
      layer.confirm('你确定撤销删除吗?', function () {
        YBZF.services({
          'url': '/goods/restore',
          'data': {
            'goods_id': $('[name=goods_id]').val(),
          },
        }).done(function (rsp) {
          if (rsp.status) {
            layer.msg('恢复成功', function () {
              location.href = location.href.replace(/goods_status=\d?/, "goods_status=1");
            });
          } else {
            layer.msg(rsp.result.msg);
          }
        });
      });
    });

    //获取批图文号
    $(document).on('click', '#get_drug_info', function ()
    {
      var approval_number = $('input[name="approval_number"]').val();
      var type = $('input[name="detail_tpl"]').val();

      if(trim(approval_number))
      {
        console.log("window.location.href:"+window.location.href);

        var param = 'approval_number='+approval_number+'&type='+type;

        var search_param = decodeURI(location.search).replace(/approval_number=([\u4E00-\u9FA5\uF900-\uFA2D]*[A-Z]*[a-z]*[0-9]*)/,'').replace(/type=(\d*)/,'').replace(/&.*!/,'');

        console.log(param);

        console.log(search_param);

        console.log(location.origin + location.pathname+search_param+'&'+param+location.hash);

        //window.location.href = location.origin + location.pathname+search_param+'&'+param+location.hash;
        getInfoByApprovalNumber(type,approval_number);

        //计算TextArea中文本的长度
        setTimeout(function countTextArealength() {
          $("textarea").each(function () {
            $(this).siblings('.num-limit').find('.js-pl-limit').empty().append(this.value.length);
          });

        },2000);
      }else{

        layer.msg('请先填写批准文号！');
        return;
      }
    });

  }

  // 读取商品信息
  function getInfoByApprovalNumber (type,approval_number) {
    //var detail_tpl = $('input[name="detail_tpl"]').val();
    //var vm = thisObj;
    // if (!this.goodsDetail.approvalNumber.trim()) {

    if (!approval_number.trim()) {
      layer.msg('请先填写批准文号！');
      //return;
    }

    $.ajax({
      url: "/jk51b/goods/query",
      type: 'post',
      data: {
        approval_number: approval_number,
        detail_tpl: type,
        page: 1,
        pageSize: 1000,

      }
    }).done(function (rsp) {
      // var rsp = JSON.parse(data);
      if (rsp && rsp.result && rsp.result.items.length) {
        /*$('.lee_product_ts_info:not(.hidden)').addClass('hidden');
        var goodsDetail = {};
        _.each(rsp.result.items[0], function (v, k) {
          goodsDetail[k] = v;
        });
        console.log(goodsDetail);
        goodsDetail.goodsId = null;
        vm.goodsDetail = goodsDetail;*/
        //goodList = rsp.result;
        var tmpl = document.getElementById('goods-list-template').innerHTML;
        var doTtmpl = doT.template(tmpl);
        rsp.result.code=approval_number;
        $("#goods-list").html(doTtmpl(rsp.result));
        $("#approval_number_mutiple").modal("show");
      } else {
        $('.lee_product_ts_info').removeClass('hidden');
      }
    });
  }

  $(document).on('click', '.checkBtn', function (){
    $("#approval_number_mutiple").modal("hide");
    var goods_id = $(this).attr("data-goodsid");
    getGoodsData(goods_id).done(function (goodsDetail) {
      goodsDetail.goods_id = null;
      vm.goodsDetail =goodsDetail;
      $('input[name="user_cateid"]').val(goodsDetail.cate_code);
      $('a[role="button"] span').text(goodsDetail.cate_name);
    });
  });

  function  confirmSave() {
    var approval_number = $('input[name="approval_number"]').val();
    var type = $('input[name="detail_tpl"]').val();
    return YBZF.services({
      url: "/jk51b/goods/query",
      type: 'post',
      data: {
        approval_number: approval_number,
        //detail_tpl: type,
        page: 1,
        pageSize: 15,
      }
    });
  }


  // sui radio样式添加checked
  function radioCheckedHelper(dataValue, currentValue) {
    /*eslint-disable eqeqeq*/
    if (dataValue == currentValue) {
      return true;
    }
    return false;
  }

  // sui checkbox样式添加checked
  function multiCheckedHelper(dataList, currentValue) {
    if (!_.isArray(dataList)) {
      dataList = (dataList + '').split(',');
    }

    return (_.findIndex(dataList, function (v) {
      return v == currentValue;
    }) !== -1);
  }

  function getTplData() {
    return {};
  }

  function chooseMerge(datas) {
    var options = [{
      key: '请选择',
      value: 0,
    }];
    options.push.apply(options, datas);
    return options;
  }


  var computed = {
    goodsRadio: function () {
      return {
        drug_category: {
          cls: 'radio-pretty inline',
          data: getTplData(this.goodsDetail.detail_tpl, 'drugCategory'),
        },
        goods_use: {
          cls: 'radio-pretty inline',
          data: getTplData(this.goodsDetail.detail_tpl, 'goodsUse'),
        },
        is_medicare: {
          cls: 'radio-pretty inline',
          data: getTplData(this.goodsDetail.detail_tpl, 'goodsIsMedicare'),
        },
        goods_status: {
          cls: 'radio-pretty inline',
          data: getTplData(this.goodsDetail.detail_tpl, 'goodsStatus'),
        },
        update_status: {
          cls: 'radio-pretty inline',
          data: getTplData(this.goodsDetail.detail_tpl, 'updateStatus'),
        },
      };
    },
    goodsChoose: function () {
      return {
        goods_property: {
          data: chooseMerge(getTplData(this.goodsDetail.detail_tpl, 'goodsProperty')),
        },
        goods_forts: {
          data: chooseMerge(getTplData(this.goodsDetail.detail_tpl, 'goodsForts')),
        },
      };
    },
    goodsMulti: function () {
      return {
        goods_forpeople: {
          cls: 'checkbox-pretty inline',
          data: getTplData(this.goodsDetail.detail_tpl, 'goodsForpeople'),
        },
      };
    },
    effectAll:function(){
      return {
        effectList: {
          cls: '',
          data:this.effectAllLabel,
        },
      };
    },
    diseaseAll:function(){
      return {
        diseaseList: {
          cls: '',
          data:this.diseaseAllLabel,
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
          drug_category: 110,
          goods_property: 0,
          goods_forts: 0,
          goods_use: 110,
          goods_forpeople: [110],
          is_medicare: 1,
          goods_status: 1,
          update_status: 0,
          detail_tpl: 0,
          goods_id:'',
        },
        diseaseAllLabel:{
          diseaseList:[]
        },//所有疾病标签
        effectAllLabel:[],//所有功效标签
        showDisease:[],//已选疾病
        showEffect:[],//已选功效
        showDiseaseTag:[],//已选疾病大类
      };
    },
    watch: {
      'goodsDetail.detail_tpl': function (newDetailTpl) {
        if (newDetailTpl){
          product.initFieldInfo(newDetailTpl);
        }
        // this.answer = 'Waiting for you to stop typing...'
        // this.getAnswer()
      },
      showDiseaseTag:function (val){
        val=Array.from(new Set(val));
        console.log(val,'val');
        $("#diseaseLabel li").each(function(){
          if(val.length==0){
            $(this).find('i').removeClass('yuan-s');
          }
          else{
            for(var i=0;i<val.length;i++){
              if(val[i].categoryName.indexOf($(this).text())>=0){
                $(this).find('i').addClass('yuan-s');
                break;
              }
              else{
                // console.log(val[i].categoryName,"val[i].categoryName",$(this).text(),"$(this).text()");
                if($(this).find('i').hasClass('yuan-s')){
                  $(this).find('i').removeClass('yuan-s');

                }
              }
            }
          }



        });

      }
    },
    computed: computed,
    components: {},
    methods: {
      radioCheckedHelper: radioCheckedHelper,
      multiCheckedHelper: multiCheckedHelper,
      placeholder: function (field) {
        var detailTpl = this.goodsDetail.detail_tpl;
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
        if (field === 'drug_name') {
          return '请输入商品名';
        }
        if (field === 'com_name') {
          return '请输入通用名';
        }
        if (field === 'goods_company') {
          return '请输入生产企业';
        }

      },
      getInfoByApprovalNumber: getInfoByApprovalNumber,
      delBtnShow: function () {
        console.log(this.goodsDetail.goods_status);
        if (this.goodsDetail.goods_id) {
          return this.goodsDetail.goods_status == 3;
        }
        return true;
      },

      restoreBtnShow: function () {
        if (this.goodsDetail.goods_id) {
          return this.goodsDetail.goods_status != 3;
        }
        return true;
      },

      onCancel:function(){
        //标签页 返回按钮
        window.location.href='list';
      },
      compareCls:function(item){
        if(this.showDiseaseTag.length==0){
          return false;
        }
        else{
          for(var i=0;i<this.diseaseAllLabel.length;i++){
            if(this.showDiseaseTag.indexOf(item.categoryName)>=0){
              return true;
            }
            else
            {return false;}
          }
        }
      },
      removeTag:function(item,type){
        //标签页 删除已选标签
        if(type=='efficacy'){
          for(var i=0;i<this.showEffect.length;i++) {
            if (this.showEffect[i] == item) {
              this.showEffect.splice(i, 1);
            }
          }
        }
        if(type=='disease'){
          for(var i=0;i<this.showDisease.length;i++) {
            if (this.showDisease[i] == item) {
              this.showDisease.splice(i, 1);
            }
          }
          for(var i=0;i<this.showDisease.length;i++) {
            if (this.showDisease[i] == item) {
              this.showDisease.splice(i, 1);
            }
          }
          //如果一个大类标签下全空，则删除大类标签
          if (this.showDisease.length == 0) {
            this.showDiseaseTag=[];
          }
          else{
            //计算疾病大类标签showDiseaseTag
            this.showDiseaseTag=[];
            for(var i=0;i<this.diseaseAllLabel.length;i++){
              for(var j=0;j<this.showDisease.length;j++){
                if(this.diseaseAllLabel[i].labelList.indexOf(this.showDisease[j])>=0){
                  this.showDiseaseTag.push(this.diseaseAllLabel[i]);
                }
              }

            }
            this.showDiseaseTag=Array.from(new Set(this.showDiseaseTag));
          }

          console.log(this.showDiseaseTag,'this.showDiseaseTag 删除标签');
        }
      },
      addTag:function(item,type,itemParent){
        //标签页 添加标签
        if(type=='efficacy'){
          if(this.showEffect.indexOf(item)<0)
          {
            this.showEffect.push(item);
          }
        }
        if(type=='disease'){
          if(this.showDisease.indexOf(item)<0)
          {
            this.showDisease.push(item);
          }
          if(this.showDiseaseTag.indexOf(itemParent)<0)
          {
            this.showDiseaseTag.push(itemParent);
          }
        }
      },
      isExistedCls:function(item,type){
        if(type=='efficacy'){
          if(this.showEffect.indexOf(item)>=0){
            return true;
          }
          else
          {return false;}
        }
        if(type=='disease'){
          if(this.showDisease.indexOf(item)>=0){
            return true;
          }
          else
          {return false;}
        }
      },


    },
    mounted: function () {
      var self = this;

      if (decodeURI(location.search).match(/.*approval_number=([\u4E00-\u9FA5\uF900-\uFA2D]*[A-Z]*[a-z]*[0-9]*).*/) != null){
        var approval_number =decodeURI(location.search).match(/.*approval_number=([\u4E00-\u9FA5\uF900-\uFA2D]*[A-Z]*[a-z]*[0-9]*).*/)[1];
        getInfoByApprovalNumber(self,approval_number);
      }

      if (location.pathname === '/jk51b/goods/modify') {
        // 如果是编辑商品
        var goodsId = location.search.replace(/.*goods_id=(\d+).*/, '$1');
        var goodsStatus = location.search.replace(/.*goods_status=(\d+).*/, '$1');
        goodsStatus = goodsStatus?goodsStatus:1;
        if (goodsId) {
          getGoodsData(goodsId,goodsStatus).done(function (goodsDetail) {
            self.goodsDetail = goodsDetail;
            console.log(self.goodsDetail.goods_status);
            console.log(self.goodsDetail.detail_tpl,'商品类型-编辑');
            /**添加商品获取分类**/
            require(['categoryChoose'], function () {
              $('#cate_box').category({
                url: './cats',
                defaultId: $('#init_cateid').val(),
              });
              //显示删除按钮
              if($("#goods_id").val()!=null&&$("#goods_id").val()!=""){
                $("#del-goods").removeClass("hidden sui-btn btn-warning pull-right").addClass("sui-btn btn-warning pull-right");
                $("#get_drug_info").hide();
              }
            });
          });
        }
        self.goodsDetail.goods_id=goodsId;


      }else{
        var detailTpl = location.search.replace(/.*type=(\d+).*/, '$1');
        self.goodsDetail.detail_tpl = detailTpl;
        console.log(detailTpl,'商品类型-新建');
        /**添加商品获取分类**/
        require(['categoryChoose'], function () {
          $('#cate_box').category({
            url: './cats',
          });
          $('#goods_id').val(null);
        });

          $('#labelTabs').hide();//新建不需要展示标签页
      }

      if (location.pathname === '/jk51b/goods/productModify') {
        // 如果是编辑商品
        var goodsId = location.search.replace(/.*goods_id=(\d+).*/, '$1');
        var goodsStatus = location.search.replace(/.*goods_status=(\d+).*/, '$1');
        var siteId = location.search.replace(/.*site_id=(\d+).*/, '$1');
        goodsStatus = goodsStatus?goodsStatus:1;
        if (goodsId) {
          getMerchantGoodsData(goodsId,goodsStatus,siteId).done(function (goodsDetail) {
            self.goodsDetail = goodsDetail;
            console.log(self.goodsDetail.goods_status)

            // /**添加商品获取分类**/
            // require(['categoryChoose'], function () {
            //   $('#cate_box').category({
            //     url: './cats',
            //     defaultId: $('#init_cateid').val(),
            //   });
            //   //显示删除按钮
            //   if($("#goods_id").val()!=null&&$("#goods_id").val()!=""){
            //     $("#del-goods").removeClass("hidden sui-btn btn-warning pull-right").addClass("sui-btn btn-warning pull-right");
            //     $("#get_drug_info").hide();
            //   }
            // });
          });
        }
      }
    },

  };
  function registerComponent() {
    // sui 单选框组
    vueConfig.components['sui-radio-group'] = {
      template: '#sui-radio-group-temp',
      props: {
        field: {
          type: Object,
          default: {},
        },
        origin: [String, Number, Object],
        name: [String],
      },
      data: function () {
        return {
          cls: 'radio-pretty inline',
          update: '',
        };
      },
      methods: {
        radioCheckedHelper: radioCheckedHelper
      },

    };
  }


  function initialization() {
    registerComponent();

    /*eslint-disable no-new*/
    // 这是一个只使用vue双向数据绑定来避免大量dom操作
    vm = new Vue(vueConfig);
    jQEventBind();
  }


  require(['sui', 'common', 'layer', 'vue', 'lodash','/templates/views/resource/public/product/product.js'], function (_sui, _YBZF, _layer, _Vue, _lodash,_product) {
    YBZF = _YBZF;
    layer = _layer;
    Vue = _Vue;
    _ = _lodash;
    product = _product;
    getTplData = _product.getTplData;
    initialization();
  });


})();



