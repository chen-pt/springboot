/**
 * Created by xiapeng on 2017/8/10.
 */

var ACCOUNT = {}
var page_total = 1
var pagesize = 1
var total = 0

function pageInfo (container, pageno, page_total, pagesize, total, callback) {
  if (!('object' === typeof(container))) {
    var $pagein = $(container)
  } else {
    $pagein = container
  }
  // 清空缓存的配置
  $pagein.data('sui-pagination', '')
  $pagein.pagination({
    pages: page_total,
    styleClass: ['pagination-large', 'pagination-right'],
    showCtrl: true,
    displayPage: 6,
    pageSize: pagesize,
    itemsCount: total,
    currentPage: pageno,
    onSelect: function (num) {
      $pagein.find('span:contains(共)').append('(' + total + '条记录)')
      callback(num)
    }
  })
  $pagein.find('span:contains(共)').append('(' + total + '条记录)')
}

ACCOUNT.GetNum = {
  init: function () {
    // this.ajaxGetList(1)
    this.even()
  },
  even: function () {
    $('#coupon_search').on('click', function () {
      ACCOUNT.GetNum.ajaxGetList(1)
    })
  },
  ajaxGetList: function (pageNum) {
    pageNum = pageNum || 1
    var pageSize = 15
    var mobile=$("input[name='member_mobile']").val();
    if('' == mobile|| undefined == mobile||null == mobile){
      alert("请输入会员手机号！");
      return;
    }
    var datas = {
/*      proRuleName:$("input[name='coupon_name']").val(),
      proRuleType:$("#couponType").val(),
      status:$("#status").val(),
      startTime:$("#start_time").val(),
      endTime:$("#end_time").val(),*/
      mobile:mobile,
      pageNum:pageNum,
      pageSize:pageSize
    }
    AlertLoading($('#coupon_table'))
    $.ajax({
      type: 'post',
      url: '/merchant/promotions/getCouponActivity',
      data: datas,
      dataType: 'json',
      success: function (data) {
        console.log('list:',data)
        $('#coupon_table').empty()
        page_total = data.value.pages
        pagesize = data.value.pageSize
        total = data.value.total
        // pageInfo($('.pageinfo'), pageNum, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList)
        var tmpl = document.getElementById('coupon_templete').innerHTML
        var doTtmpl = doT.template(tmpl)
        $('#coupon_table').html(doTtmpl(data.value))
        pageInfo($('.pageinfo'), pageNum, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList)
      }
    })
  }
}

ACCOUNT.init = function () {
  ACCOUNT.GetNum.init()
}
$(function () {
  ACCOUNT.init()
})
