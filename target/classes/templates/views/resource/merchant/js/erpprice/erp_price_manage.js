var vm;
$(function () {
  vm = new Vue({
    el: '#erp_price_list',
    data: {
      priceList: [],
      stores : [],
      city : [],
      country : [],
      inputPrice:'',
      inputErpPrice:'',
    },
    created: function () {
      getErpPriceList();
      getStores();
      getAreaCity();
      getAreaCountry();

    },
    computed: {
      //获取选中的id和选中的商品的goods_code
      getTotal:function(){
        //获取priceList中select为true的数据。
        var _priceList=this.priceList.filter(function (val) { return val.selected});
        var ids=[];
        var good_codes=[];
        for(var i=0;i<_priceList.length;i++){
          ids.push(_priceList[i].id);
          good_codes.push(_priceList[i].goods_code)
        }
        return {ids:ids,good_codes:good_codes};
      },
      getEdit:function () {
        var _priceList=this.priceList.filter(function (val) { return val.isEdit});
        var id=_priceList.id;
        return {id:id};
      },
      checkAll: {
        get: function () {
          return this.getTotal.ids.length == this.priceList.length;
        },
        set: function (selected) {
          this.priceList.forEach(function (v) {
            v.selected = selected;
          });
        }
      }
    },
    methods : {
      money: function (money) {
        money = (money / 100).toFixed(2);
        return money;
      },
       deleteSelect : deleteSelect,
      changePrice: function () {
        if (this.getTotal.ids.length == 0) {
          layer.msg("请先选择商品");
        } else {
          var flag=true;
          if(this.getTotal.ids.length!=1){
            for (var i = 0; i < this.getTotal.good_codes.length-1; i++) {
              if (this.getTotal.good_codes[i] != this.getTotal.good_codes[i + 1]) {
                layer.msg("批量改价只能修改同一种商品的价格");
                flag=false;
                break
              }
            }
          }
          if(flag){
            $('#batch-modal').modal('show');
          }
        }
      },
      editErpPrice:function (index) {
        this.priceList[index].isChange=false;
        this.priceList[index].isEdit=true;
        this.inputPrice=(this.priceList[index].price/100).toFixed(2);
      },
      savePrice:function (index) {
        var regax = new RegExp("^[0-9]+([.]{1}[0-9]{1,2}){0,1}$");
        if (!regax.test(this.inputPrice)) {
          alert("输入仅限正整数或者一位到两位小数");
          this.priceList[index].isChange=true;
          return
        }

        var datas = {};
        datas.price = (this.inputPrice*10*10).toFixed(0);
        datas.id = this.priceList[index].id;

        $.ajax({
          type: 'POST',
          url: "/merchant/singleErpPriceEdit",
          data: datas,
          dataType: 'json',
          success: function (data) {
            if (data.status == "OK") {
              // vm.priceList[index].price=this.inputPrice;
              // layer.msg('修改成功', function () {
              //   location.reload()
              // });
              getErpPriceList()


            } else {
              alert("修改商品价格异常")
            }
          }
        })
      },
      store_price_btn:function() {
        var regax = new RegExp("^[0-9]+([.]{1}[0-9]{1,2}){0,1}$");
        if (!regax.test(this.inputErpPrice)) {
          alert("输入仅限正整数或者一位到两位小数");
          return
        }

        var datas = {};
        datas.price = (this.inputErpPrice*10*10).toFixed(0);
        datas.ids = this.getTotal.ids.join(',');

        $.ajax({
          type: 'POST',
          url: "/merchant/batch/changePrice",
          data: datas,
          dataType: 'json',
          success: function (data) {
            if (data.status == "OK") {

              // getErpPriceList()
              window.location .href="/merchant/erpPrice/manage";

            } else {
              alert("批量修改商品rep价格异常")
            }
          }
        })
      },
    },
    mounted:function () {
    },
    // directives:{
    //   "focus":{
    //     update(el){
    //       el.focus();
    //     }
    //   }
    // }
  })

  $('.page_size_select').change(function () {
    pageSize = this.val();
    getErpPriceList();
  })
})

function getStores() {
  $.post(
    "/merchant/storelist",
    function (res) {
    console.debug(res);
    vm.stores = res;
  });
}

function getAreaCity() {
  $.post(
    "/merchant/storeArea",
    {
      type : 3
    },
    function (result) {
      console.debug(result);
      vm.city = result.value;
    }
  )
}

function getAreaCountry() {
  $.post(
    "/merchant/storeArea",
    {
      type : 4
    },
    function (result) {
      console.debug(result);
      vm.country = result.value;
    }
  )
}

//列表
var curPage = 1;
var totalNum = 0;
var pageSize = 15;

function getErpPriceList() {
  var url = "/merchant/erpPrice/list";

  var param = {};
  var drugName = $('#drug_name').val();
  if (drugName) param.drugName=drugName;
  var storeName = $('#store_name').val();
  if (storeName) param.storeName=storeName;
  var city = $('#city').val();
  if (city) param.city=city;
  var priceLow = Math.round($('#price_low').val() * 100);
  if (priceLow) param.priceLow = priceLow;
  var priceHigh = Math.round($('#price_high').val() * 100);
  if (priceHigh) param.priceHigh = priceHigh;
  var goodsCode = $('#goods_code').val();
  if (goodsCode) param.goodsCode = goodsCode;
  var storeNumber = $('#store_number').val();
  if (storeNumber) param.storeNumber = storeNumber;
  var country = $('#country').val();
  if (country) param.country = country;

  param.pageSize = pageSize;
  param.pageno = curPage;


  $.post(
    url,
    param,
    function(result){
      if(result.message == 'Success'){
        var list = result.value.list;
        //这里在返回的数据中添加一个字段,方便做批量操作
        for(var i in list){
          list[i].selected=false;
          list[i].isEdit=false;
          list[i].isChange=true;
        }

        vm.priceList = list;
        var num = result.value.total
        totalNum = num;

        $("#last_page_index").html(result.value.pages);
        $("#page_count").html("共" + result.value.pages + "页");
        $("#row_count").html("("+result.value.total+"条记录)");

        if($('.pageinfo')){
          $('.pageinfo').remove();
        }

        $(".order-list").append("<span class='pageinfo' style='text-align:right'></span>")

        $('.pageinfo').pagination({
          pages: result.value.pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 6,
          currentPage: curPage,
          onSelect: function (num) {
            curPage = num;
            getErpPriceList();
          }
        });
        getNum();
      }else {
        vm.priceList = [];
        console.log("error ....");
      }
    },
    "json");
}

function getNum(){
  $('.pageinfo').find('span:contains(共)').append("<span id='m_t_n'>(" + totalNum + "条记录)</span>");
  //页码选择
  var pagearr = [15,30,50,100];

  var pageselect = '<select class="page_size_select" style="width: 50px;">';

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

  $('.page_size_select').change(function () {
    pageSize = $('.page_size_select').val();
    getErpPriceList()
  })

}

function deleteSelect(id) {
  var data = {};
  var tipHtml = '确定删除此价格吗?';
  if (id==""){
    $(".choose-check").each(function(){
      if (this.checked == true){
        id = id + $(this).val() + ",";
      }
    });
    id = id.substring(0, id.length-1);
  }
  data.id = id;
  if (id == ""){
    layer.msg('请选择删除价格');
  }else{
    layer.confirm(tipHtml, {title: ['提示']}, function (idx) {
      var url = "/merchant/deleteErpPrice";
      $.ajax({
        type: 'post',
        url: url,
        data: data,
        dataType: 'json',
        success: function (data) {
          if (data.status == "OK"){
            layer.msg('删除成功');
          }else {
            layer.msg('删除失败');
          }
          setTimeout(function () {
            window.location.href="/merchant/erpPrice/manage";
          },2000)
        },
        error: function () {
          console.log("error ....");
        }
      });
    });
  }
}
