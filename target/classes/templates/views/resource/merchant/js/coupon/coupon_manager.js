define(['core'], function (core) {
  var couponManager = {}
  couponManager.pageno = 1
  couponManager.cur_per_page = 15


  couponManager.getCouponList = function (action_url) {
    var create_btime = $('#start_time').val()
    var create_etime = $('#end_time').val()
    var coupon_type = $('#couponType :selected').val()

    var datas = {}
    if (create_btime) datas.startTime = create_btime + ' 00:00:00'
    if (create_etime) datas.endTtime = create_etime + ' 23:59:59'

    if (create_btime != '' && create_etime != '') {
      if (create_btime > create_etime) {
        layer.msg('开始时间不能晚于结束')
        return false
      }
    }

    if (coupon_type && coupon_type != '0') datas.proRuleType = coupon_type
    datas.pageNum = couponManager.pageno
    datas.pageSize = couponManager.cur_per_page

    if ($('input[name="coupon_name"]').val() != '') {
      datas.proRuleName = $('input[name="coupon_name"]').val()
    }

    if (parseInt($('#status :selected').val()) >= 0) {
      datas.status = parseInt($('#status :selected').val())
    }
    var url='/merchant/promotions/promRuleList'
    if(action_url){
      url=action_url
    }

    $.ajax({
      type: 'post',
      url: url,
      data: datas,
      dataType: 'json',
      success: function (data) {
        if (data.code == '000') {
          core.formatDate()
          $.each(data.value.list, function (i, v) {
            data.value.list[i].createTime = new Date(v.createTime).format()
          })

          $('#coupon_table').empty()
          var tmpl = document.getElementById('coupon_list_template').innerHTML
          var doTtmpl = doT.template(tmpl)
          $('#coupon_table').html(doTtmpl(data))

          getUsedNumAndUnusedNumAsync()

          var pages = Math.ceil(data.value.total / data.value.pageSize)
          $('#pageinfo').pagination({
            pages: pages,
            styleClass: ['pagination-large'],
            showCtrl: true,
            displayPage: 6,
            currentPage: couponManager.pageno,
            onSelect: function (num) {
              couponManager.pageno = num
              couponManager.getCouponList(url)
            }
          })

          $('#pageinfo').find('span:contains(共)').append('(' + data.value.total + '条记录)')
          $('#pageinfo').find('span:contains(共)').prepend('<select class=\'page_size_select\' style=\'width: 40px !important;\'><option value=\'15\'>15</option><option value=\'30\'>30</option><option value=\'50\'>50</option><option value=\'100\'>100</option></select>')
          $('.page_size_select').find('option[value=' + couponManager.cur_per_page + ']').attr('selected', true)
        }
      }
    })
  }

  couponManager.getCouponUseList = function () {
    var search_type = $('select[name="search_type"] :selected').val()

    var params = {}
    if ($('input[name="coupon_input"]').val() != '') {
      if (search_type == 1) { //编号搜索
        params.no = $('input[name="coupon_input"]').val()
      } else if (search_type == 2) { // 手机号搜索
        params.mobile = $('input[name="coupon_input"]').val()
      }
    }

    params.page = couponManager.pageno
    params.pageSize = couponManager.cur_per_page
    params.use = 'use'

    if (parseInt($('#status :selected').val()) >= 0) {
      params.status = parseInt($('#status :selected').val())
    }

    var startTime = $('#startTime').val()
    var endTime = $('#endTime').val()

    if (startTime != '' && endTime != '') {
      if (startTime != null && endTime != null) {
        params.startTime = startTime + ' 00:00:00'
        params.endTime = endTime + ' 23:59:59'
      }
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
        var tmpl = document.getElementById('coupon_list_templete').innerHTML
        var doTtmpl = doT.template(tmpl)
        $('#coupon_table').html(doTtmpl(data))

        $('#pageinfo').data('sui-pagination', '')
        $('#pageinfo').pagination({
          pages: data.pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 4,
          currentPage: couponManager.pageno,
          onSelect: function (num) {
            couponManager.pageno = num
            couponManager.getCouponUseList()
          }
        })

        $('#pageinfo').find('span:contains(共)').append('(' + data.total + '条记录)')
        couponManager.addPageExtd(couponManager.cur_per_page)
        $('#singleLeftCheckBoxFirst').attr('checked', false)
      }
    })

    if (params.type == 1) {
      if (params.status == null) {
        couponManager.getCouponUseUnuse(params, 0)
        couponManager.getCouponUseUnuse(params, 1)
      } else {
        couponManager.getCouponUseUnuse(params, -1)
      }
    } else if (params.type == 2) {
      if (params.status == null) {
        params.status = -1
      }
      couponManager.getPromotionsStatusByConditions(params)
    }
  }

  couponManager.getCouponUseUnuse = function (param, status) {
    var url = core.getHost() + '/merchant/coupon_use_unuse'

    if (status == -1) {
      if (param.status == 0) {
        $.post(url, param, function (data) {
          if (data.code = '000') {
            if (param.status == 0) {
              $('#use').html(data.value)
              $('#unused').html('0')
            } else if (param.status == 1) {
              $('#unused').html(data.value)
              $('#use').html('0')
            }
          }
        })
      } else if (param.status == 1) {
        $.post(url, param, function (data) {
          if (data.code = '000') {
            if (param.status == 0) {
              $('#use').html(data.value)
              $('#unused').html('0')
            } else if (param.status == 1) {
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

  couponManager.getPromotionsStatusByConditions = function (params) {
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

  couponManager.addPageExtd = function (pageSize) {
    var pagearr = [10, 15, 30, 50]
    var pageselect = '&nbsp;<select class="page_size_select">'

    $.each(pagearr, function () {
      if (this == pageSize) {
        pageselect = pageselect + '<option value="' + this + '" selected>' + this + '</option>'
      } else {
        pageselect = pageselect + '<option value="' + this + '" >' + this + '</option>'
      }
    })

    pageselect = pageselect + '</select>&nbsp;'
    $('#pageinfo').find('span:contains(共)').prepend(pageselect)
  }

  return couponManager
})

function getUsedNumAndUnusedNumAsync () {
  var $tr = $('#coupon_table tr'), idArr = [], params = {}, obj = {}

  for (var i = 0; i < $tr.length; i++) {
    var $td = $tr.eq(i).find('td')
    var ruleType = $td.find('input[name=ruleType]').val()
    if (ruleType === '1') {
      idArr.push($td.find('input[name=id]').val())
    }
  }

  if (idArr.length === 0) return

  obj.ids = idArr.join(',')
  var url = 'couponRule/queryUsedNumAndUnusedNum'
  params.requestParams = obj
  params.isPost = 'get'

  require(['utils'], function (utils) {
    utils.doGetOrPostOrJson(url, obj, 'get', false, function (data) {
      if (data.code === '000') {
        var res = data.value
        console.log(res)

        for (var i = 0; i < $tr.length; i++) {
          var $td = $tr.eq(i).find('td')
          var ruleType = $td.find('input[name=ruleType]').val()
          if (ruleType === '1') {
            var id = $td.find('input[name=id]').val()
            var usedNum = 0, unusedNum = 0

            for (var j = 0; j < res.length; j++) {
              if (res[j].rule_id === parseInt(id)) {
                if (res[j].status) { // status == 1
                  unusedNum = res[j].countNum
                } else {
                  usedNum = res[j].countNum
                }
              }
            }

            $td.eq(3).html(usedNum)
            $td.eq(4).html(unusedNum)
          }
        }
      }
    })
  })
}
