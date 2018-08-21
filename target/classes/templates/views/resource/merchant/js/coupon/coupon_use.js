define(['core', 'utils'], function (core, utils) {
  var couponUse = {}
  couponUse.pageno = 1
  couponUse.cur_per_page = 15

  couponUse.getCouponUseList = function () {
    var params = {}

    var search_type = $('select[name=search_type] :selected').val()

    if ($('input[name=coupon_input]').val() != '') {
      if (search_type == 1) { //编号搜索
        params.no = $('input[name=coupon_input]').val()
      } else if (search_type == 2) { // 手机号搜索
        params.mobile = $('input[name=coupon_input]').val()
      }
    }

    params.page = couponUse.pageno
    params.pageSize = couponUse.cur_per_page

    if (parseInt($('#status :selected').val()) >= 0) {
      params.status = parseInt($('#status :selected').val())
    }

    params.use = 'use'

    var startTime = $('#startTime').val()
    var endTime = $('#endTime').val()
    if (startTime && endTime) {
      params.startTime = startTime + ' 00:00:00'
      params.endTime = endTime + ' 23:59:59'
    }

    params.ruleId = getUrlParam('id')
    params.type = getUrlParam('type')
    if (!params.type) {
      params.type = $('div[name="save_type"]').prop('id')
    }

    var url = core.getHost() + '/merchant/export_by_coupon_table'

    $.post(url, params, function (data) {
      if (data.code == '000') {
        data.type = params.type
        $('#coupon_table').empty()
        var tmpl = document.getElementById('coupon_list_template').innerHTML
        var doTtmpl = doT.template(tmpl)
        $('#coupon_table').html(doTtmpl(data))

        $('#pageinfo').data('sui-pagination', '')
        $('#pageinfo').pagination({
          pages: data.pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 4,
          currentPage: couponUse.pageno,
          onSelect: function (num) {
            couponUse.pageno = num
            couponUse.getCouponUseList()
          }
        })

        $('#pageinfo').find('span:contains(共)').append('(' + data.total + '条记录)')
        addPageExtd(couponUse.cur_per_page)
        $('#singleLeftCheckBoxFirst').attr('checked', false)
      }
    })

    if (params.type == 1) {
      if (params.status == null) {
        couponUse.getCouponUseUnuse(params, 0)
        couponUse.getCouponUseUnuse(params, 1)
      } else {
        couponUse.getCouponUseUnuse(params, -1)
      }
    } else if (params.type == 2) {
      if (params.status == null) {
        params.status = -1
      }
      couponUse.getPromotionsStatusByConditions(params)
    }
  }

  /**
   * 优惠券使用情况数量
   */
  couponUse.getCouponUseUnuse = function (param, status) {
    var url = core.getHost() + '/merchant/coupon_use_unuse'
    if (parseInt(status) === -1) {
      if (parseInt(param.status) === 0) {
        $.post(url, param, function (data) {
          if (data.code = '000') {
            if (parseInt(param.status) === 0) {
              $('#use').html(data.value)
              $('#unused').html('0')
            } else if (parseInt(param.status) === 1) {
              $('#unused').html(data.value)
              $('#use').html('0')
            }
          }
        })
      } else if (parseInt(param.status) === 1) {
        $.post(url, param, function (data) {
          if (data.code = '000') {
            if (parseInt(param.status) === 0) {
              $('#use').html(data.value)
              $('#unused').html('0')
            } else if (parseInt(param.status) === 1) {
              $('#unused').html(data.value)
              $('#use').html('0')
            }
          }
        })
      }
    } else {
      param.status = status
      $.post(url, param, function (data) {
        if (data.code = '000') {
          if (status == 0) {
            $('#use').html(data.value)
          } else if (status == 1) {
            $('#unused').html(data.value)
          }
        }
      })
    }
  }

  couponUse.getPromotionsStatusByConditions = function (params) {
    var url = core.getHost() + '/merchant/coupon_use_unuse'
    if (params.status == -1) {
      //查询全部
      url = core.getHost() + '/merchant/promotions_status'
      $.post(url, params, function (data) {
        if (data.code == '000') {
          data.value.use ? $('#use').html(data.value.use) : $('#use').html('0')
          data.value.refund ? $('#refund').html(data.value.refund) : $('#refund').html('0')
          data.value.cancel ? $('#cancel').html(data.value.cancel) : $('#cancel').html('0')
        }
      })
    } else if (params.status == 0) {
      //已使用 refund cancel is 0
      $.post(url, params, function (data) {
        if (data.code == '000') {
          $('#use').html(data.value)
          $('#refund').html('0')
          $('#cancel').html('0')
        }
      })
    } else if (params.status == 1) {
      //已退款 use cancel is 0
      $.post(url, params, function (data) {
        $('#use').html('0')
        $('#refund').html(data.value)
        $('#cancel').html('0')
      })
    } else if (params.status == 2) {
      //订单取消 use refund is 0
      $.post(url, params, function (data) {
        $('#use').html('0')
        $('#refund').html('0')
        $('#cancel').html(data.value)
      })
    }
  }

  couponUse.exportCouponDetail = function (obj, ruleId) {
    var url = 'exportCouponDetailList'
    url += '?ruleId=' + ruleId
    var search_type = parseInt($('select[name=search_type] :selected').val())

    var params = {}
    if ($('input[name=coupon_input]').val() !== '') {
      if (search_type === 1) { //编号搜索
        params.no = $('input[name=coupon_input]').val()
        url += '&no=' + params.no
      } else if (search_type === 2) { // 手机号搜索
        params.mobile = $('input[name="coupon_input"]').val()
        url += '&mobile=' + params.mobile
      }
    }

    if (parseInt($('#status :selected').val()) >= 0) {
      params.status = parseInt($('#status :selected').val())
      url += '&status=' + params.status
    }

    params.use = 'use'

    var startTime = $('#startTime').val()
    var endTime = $('#endTime').val()
    if (startTime != '' && endTime != '') {
      if (startTime != null && endTime != null) {
        params.startTime = startTime + ' 00:00:00'
        params.endTime = endTime + ' 23:59:59'
        url += '&startTime=' + params.startTime
        url += '&endTime=' + params.endTime
      }
    }

    params.ruleId = ruleId

    if (params.status == null) {
      params.status = -1
    }

    params.type = getUrlParam('type')
    url += '&type=' + params.type

    $.ajax({
      type: 'post',
      url: '/merchant/coupon_use_unuse',
      data: params,
      async: false,
      dataType: 'json',
      success: function (result) {
        $('#ecd').html('<span>数据正在查询中....请您稍等一下下</span>')
        if (result.code == 000) {
          if (result.value <= 0) {
            $('#ecd').html('根据本次查询条件，未查询到相关领取详情...')
          } else if (result.value > 2000) {
            $('#ecd').html('根据本次查询条件，共查询到' + result.value + '条结果，已经超过&nbsp;2000&nbsp;条的最大值，请修改查询条件分批次下载。')
          } else {
            $('#ecd').html('根据本次查询条件，共查询到' + result.value + '条结果，请<a href=\'' + url + '\' id= \'a_e\'>点击下载</a>.')
          }
        } else {
          $('#ecd').html('系统通讯异常')
        }
      }
    })
  }

  return couponUse
})

function addPageExtd (pageSize) {
  var pageArr = [10, 15, 30, 50]
  var pageSelect = '&nbsp;<select class="page_size_select">'

  $.each(pageArr, function () {
    if (this == pageSize) {
      pageSelect = pageSelect + '<option value="' + this + '" selected>' + this + '</option>'
    } else {
      pageSelect = pageSelect + '<option value="' + this + '" >' + this + '</option>'
    }
  })

  pageSelect = pageSelect + '</select>&nbsp;'
  $('#pageinfo').find('span:contains(共)').prepend(pageSelect)
}
