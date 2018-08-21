/**
 * Created by Administrator on 2017/3/16.
 */

define(['core'], function (core) {
  var activity = {}

  activity.much_coupon_list_pageno = 1
  activity.much_coupon_cur_per_page = 100
  activity.pageno = 1
  activity.cur_per_page = 15

  var couponDetail1 = {};
  couponDetail1.pageSize = 15;
  couponDetail1.currentPage = 1;
  /**
   * 获取发放优惠券列表
   */
  activity.getSendCouponList = function (action_url) {
    var params = {}
    var sendType = $('#sendType :selected').val()
    if (typeof (sendType) !== 'undefined' && sendType != '') {
      params.proActivitySendWay = sendType
    }

    var status = $('#status :selected').val()
    if (typeof status != 'undefined' && status != '') {
      params.status = status
    }

    var title = $('input[name="title"]').val()
    if (title != '') {
      params.proActivityName = title
    }

    var create_btime = $('#start_time').val()
    var create_etime = $('#end_time').val()

    if (create_btime) params.startTime = create_btime + ' 00:00:00'
    if (create_etime) params.endTime = create_etime + ' 23:59:59'

    params.pageNum = activity.pageno
    params.pageSize = activity.cur_per_page

    var url = core.getHost() + '/merchant/promotions/proActivityList'
    if(action_url){
      url=core.getHost()+action_url
    }
    console.log('params')
    console.log(params)

    $('#coupon_table').empty()
    $.get(url, params, function (data) {
      console.log('get data')
      console.log(data)
      if (data.code == '000') {
        core.formatDate()
        $.each(data.value.list, function (i, v) {
          data.value.list[i].create_time = new Date(v.create_time).format()
        })
        var tmpl = document.getElementById('coupon_list_templete').innerHTML
        var doTtmpl = doT.template(tmpl)
        $('#coupon_table').html(doTtmpl(data))

        showUseNumAndSendNumAsync()

        var pages = Math.ceil(data.value.total / data.value.pageSize)
        $('#pageinfo').pagination({
          pages: pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 6,
          currentPage: activity.pageno,
          onSelect: function (num) {
            activity.pageno = num
            activity.getSendCouponList(action_url)
          }
        })

        $('#pageinfo').find('span:contains(共)').append('(' + data.value.total + '条记录)')
        activity.addPageExtd(activity.cur_per_page)

      } else {
        var tmpl = document.getElementById('coupon_list_templete').innerHTML
        var doTtmpl = doT.template(tmpl)
        $('#coupon_table').html(doTtmpl(data))
      }

    })
  }

  //获取门店信息
  activity.getAllStore = function () {
    $.ajax({
      url: core.getHost() + '/merchant/account/getAllBStores',
      type: 'POST',
      data: {
        'store_name': 'default',
      },
      success: function (data) {
        console.log(data)
        var liArr = new Array('<option value="">全部</option>')
        var items = data.storeMaps
        $.each(items, function (i, item) {
          liArr.push('</option><option value="' + item.id + '">' + item.name + '</a></option>')
        })
        var liAppend = liArr.join('')
        $('#select_register_store').append(liAppend)
      }
    })
  }

  //会员列表信息（多选）
  activity.get_vip_member_list = function () {

    //手机号
    var mobilePhone = $('#select_mobile_phone').val()

    //注册的开始时间
    var startTime = $('#select_register_start_time').val()

    //注册的结束时间
    var endTime = $('#select_register_end_time').val()

    //门店
    var storeId = $('#select_register_store').val()

    //状态
    var status = $('#select_register_status').val()

    var url = core.getHost() + '/merchant/getAllMembers'

    var params = {}

    params.pageNum = activity.pageno
    params.pageSize = activity.cur_per_page

    params.mobilePhone = mobilePhone
    params.startTime = startTime
    params.endTime = endTime
    params.storeId = storeId
    params.status = status

    $.post(url, params, function (data) {

      console.log(data)
      var e = data.value
      console.log(e)
      var tmpl = document.getElementById('much_vipmembers_list_templete').innerHTML
      var doTtmpl = doT.template(tmpl)
      $('.member_list').html(doTtmpl(e))
      var pages = Math.ceil(e.total / activity.cur_per_page)

      $('#direct_memmer_page_info').data('sui-pagination', '')
      $('#direct_memmer_page_info').pagination({
        pages: e.pages,
        styleClass: ['pagination-large'],
        showCtrl: true,
        displayPage: 4,
        currentPage: activity.pageno,
        onSelect: function (num) {
          activity.pageno = num
          activity.get_vip_member_list()
        }
      })
      $('#direct_memmer_page_info').find('span:contains(共)').html('共' + pages + '页(' + e.total + '条记录)')
      $('.page_size_select').find('option[value=' + activity.cur_per_page + ']').prop('selected', true)
      $('#singleLeftCheckBoxFirst').attr('checked', false)

    })
  }

  /**
   *获取会员标签信息
   */
  activity.getMemberSignInfo = function () {
    $('#content-box-main_a').children().remove()
    var url = core.getHost() + '/merchant/label/getLabelAll'
    var params = {}

    $.post(url, params, function (data) {
      console.log(data)
      if (data.code == '200') {
        var send_html = ''
        if (data.memberList.length > 0) {
          for (var i = 0; i < data.memberList.length; i++) {
            var this_a = '<a href=\'#\'  class=\'main-item main-item-a\' id="' + data.memberList[i].id + '">' + data.memberList[i].crowdName + '<input type="hidden" name="sign-member-a-input" value="' + data.memberList[i].id + '"></a> '
            send_html += this_a
          }
          $('#content-box-main_a').children().remove().append(send_html)
          $('#content-box-main_a').append(send_html)
        } else {
          $('#err_Msg_for_sign_member').children().remove()
          $('#err_Msg_for_sign_member').html('<h4 style=\'padding-left: 250px\'>该商户尚未添加任何标签信息！</h4>')

        }

      } else {
        $('#err_Msg_for_sign_member').children().remove()
        $('#err_Msg_for_sign_member').html('<h4 style=\'padding-left: 250px\'>该商户尚未添加任何标签信息！</h4>')
      }

    })
  }

  /**
   *获取会员标签库信息
   */
  activity.getMemberSignGroupInfo = function () {
    $('#content-box-main_a_group').children().remove()
    var url = core.getHost() + '/merchant/label/getCustomNameAll'
    var params = {}
    //params.crowdSort = 1003

    $.post(url, params, function (data) {
      console.log(data)
      if (data.msg == '查询成功') {
        var send_html = ''
        if (data.nameList.length > 0) {
          for (var i = 0; i < data.nameList.length; i++) {
            var this_a = '<a href=\'#\'  class=\'main-item main-item-a-group\' id="' + data.nameList[i] + '">' + data.nameList[i] + '<input type="hidden" name="sign-member-a-input_group" value="' + data.nameList[i] + '"></a> '
            send_html += this_a
          }
          $('#content-box-main_a_group').children().remove().append(send_html)
          $('#content-box-main_a_group').append(send_html)
        } else {
          $('#err_Msg_for_sign_group_member').children().remove()
          $('#err_Msg_for_sign_group_member').html('<h4 style=\'padding-left: 250px\'>该商户尚未添加任何标签信息！</h4>')

        }

      } else {
        $('#err_Msg_for_sign_group_member').children().remove()
        $('#err_Msg_for_sign_group_member').html('<h4 style=\'padding-left: 250px\'>该商户尚未添加任何标签信息！</h4>')
      }

    })
  }

  //sui 翻页控件增加页码选择框
  activity.addPageExtd = function (pageSize, ele) {
    var pagearr = [15, 30, 50, 100]

    if (typeof ele == 'undefined') {
      var source = $('#pageinfo')
    } else {
      var source = ele
    }

    console.log(source)

    var pageselect = '&nbsp;<select class="page_size_select">'

    $.each(pagearr, function () {

      if (this == pageSize) {
        pageselect = pageselect + '<option value="' + this + '" selected>' + this + '</option>'
      } else {
        pageselect = pageselect + '<option value="' + this + '" >' + this + '</option>'
      }
    })

    pageselect = pageselect + '</select>&nbsp;'

    source.find('span:contains(共)').prepend(pageselect)
  }

  /**
   * 获取优惠券发放详情
   */
  activity.get_detail_activity = function (coupon_detail) {
    var activityId = $('#edit_id').val()
    var url = core.getHost() + '/merchant/getActivityDetail'
    var params = {}
    params.activityId = activityId

    $.ajax({
      type: 'GET',
      url: url,
      data: params,
      complete: function (data) {
        if (data.code = '000') {
          var res = JSON.parse(data.responseText)
          if (res.value) {
            core.formatDate()
            console.log(res)

            var tmpl = document.getElementById('reissure_body').innerHTML
            var doTtmpl = doT.template(tmpl)
            $('#export_coupon_history_log').html(doTtmpl(res.value))
            activity.get_vip_member_list()
            activity.getAllStore()
            var status = res.value.status
            switch (status) { // 0发布中 1定时发布 2过期结束 3已发完结束 4手动结束 10待发布
              case 0:
                status = '发布中（已开始）'
                break
              case 1:
                status = '定时发布'
                break
              case 2:
                status = '过期结束'
                break
              case 3:
                status = '已发完结束'
                break
              case 4:
                status = '手动结束'
                break
              case 10:
                status = '待发布'
                break
              case 11:
                status = '发布中（未开始）'
                break
            }
            $('#activityStatus').html(status)

            $('input[name=isReissUreRecord]').val(res.value.map.length)
            $('input[name=status]').val(res.value.status)
            $('input[name=sendWay]').val(res.value.sendWay)
            $('input[name=isReissUre]').val(res.value.isReissUre)
            $('#hidden_end_time').val(new Date(res.value.endTime).format('yyyy-MM-dd hh:mm:ss'))
            if (res.value.status != 4 && res.value.status != 10) {
              $('#setTime_button').html('<button data-toggle=\'modal\' data-target=\'#setTime\' data-keyboard=\'false\' class=\'sui-btn btn-primary btn-lg\'>延长活动时间</button>')
            }
            if (res.value.endTime) {
              $('input[name=endTime]').val(res.value.endTime)
              $('#send_time').prepend(new Date(res.value.startTime).format('yyyy-MM-dd hh:mm:ss') + ' 至 ' + new Date(res.value.endTime).format('yyyy-MM-dd hh:mm:ss'))
            } else {
              $('#send_time').html('--')
            }
            $('#activity_title').html(res.value.title)
            if (res.value.sendWay == 2 || res.value.sendWay == 3) {
              if (res.value.content == '') {
                $('#descp').hide()
              } else {
                $('#activity_desc').html(res.value.content)
                $('#image').attr('src', res.value.image)
              }
            } else {
              if (res.value.content == '') {
                $('#descp').hide()
              } else {
                $('#ac_desc').hide()
                $('#ac_img').hide()
              }
            }
            $('#qrcode_dwonload').attr('download', 'yhq_coupon_' + res.value.id + '.jpg')
            if (res.value.sendObj == 1) {
              $('#send_obj').html('全体会员')
            } else if (res.value.sendObj == 2) {
              $('#send_obj').html('指定标签组会员')
              var active_html = ''
              var list = res.value
              if (list['memberLabels'].length > 0) {
                for (var i = 0; i < list['memberLabels'].length; i++) {
                  var this_a = '<a href=\'#\'  class=\'main-item\'>' + list['memberLabels'][i].crowdName + '</a> '
                  active_html += this_a
                }
                $('#send_obj_group_info').append(active_html)
                $('#show_active_obj_group').show()

              }
            }
            else if (res.value.sendObj == 4) {
              $('#send_obj').html('指定标签库会员')
              var active_html = ''
              var list = res.value
              if (list['labelList'].length > 0) {
                for (var i = 0; i < list['labelList'].length; i++) {
                  var this_a = '<a href=\'#\'  class=\'main-item main-item-a_group\'>' + list['labelList'][i] + '</a> '
                  active_html += this_a
                }
                $('#send_obj_group_info').append(active_html)
                $('#show_active_obj_group').show()

              }
            } else if (res.value.sendObj == 3) {
              $('#send_obj').html('自定义会员 &nbsp;<button data-toggle="modal" data-target="#mobile_show" data-keyboard="false" class="sui-btn btn-primary btn-lg">查看会员</button>')
              var signMembers = JSON.parse(res.value.signMermbers)
              if (signMembers.type == 2) {
                var members = signMembers.promotion_members
                var arr_mobiles = members.split(',')
                var mobiles = ''
                for (var i = 1; i <= arr_mobiles.length; i++) {
                  mobiles += arr_mobiles[i - 1]
                  mobiles += ',&emsp;'
                  if (i % 5 == 0) {
                    mobiles = mobiles.substring(0, mobiles.length - 7)
                    mobiles += '<br/>'
                  }
                }
                $('#send_obj_info').html(mobiles)
                $('#show_active_obj').show()
              }
            }

            if (res.value.sendType == 1) {
              $('#send_type').html('注册后发放')
            } else if (res.value.sendType == 2) {
              $('#send_type').html('立即发放')
            } else if (res.value.sendType == 3) {
              core.formatDate()
              var start_time = new Date(res.value.startTime).format('yyyy-MM-dd') + ' 00:00:00'
              var end_time = new Date(res.value.endTime).format('yyyy-MM-dd') + ' 23:59:59'
              var str = '<span id="start_time">' + start_time + '</span> - <span id="end_time">' + end_time + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;延长&nbsp;&nbsp;<input type="text" name="delay_data" class="input-small" value="">&nbsp;&nbsp;天'
              $('#send_type').html(str)
            } else if (res.value.sendType == 4) {
              $('#send_type').html('付款后发放')
            } else if (res.value.sendType == 5) {
              $('#send_type').html('仅首单付款后发放')
            } else if (res.value.sendType == 6) {
              $('#send_type').html('会员自领')
            }

            if (res.value.sendCondition != null) {
              var goodsType
              var temp_value_1 = (res.value.sendCondition).split('&&')
              var limitOrNot = temp_value_1[1] == 'all' ? '' : '限品'
              var ids = ''
              if (temp_value_1[1] && temp_value_1[1] != 'all'&&temp_value_1[1] != 'non') {
                ids = temp_value_1[1].replace(/:/g, ',')
                goodsType = 1 //指定参加
              }else if(temp_value_1[1] == 'non'){
                ids = temp_value_1[2].replace(/:/g, ',')
                goodsType = 2 //指定不参加
              }else {
                goodsType=0
              }
              if (res.value.sendConditionType == 1) {
                $('#send_condition').prepend(limitOrNot + '满元发放(' + (temp_value_1[0] / 100).toFixed(2) + '元)')
                $('#goods_show').prop('style', 'display:inline-block')
              } else if (res.value.sendConditionType == 2) {
                $('#send_condition').prepend(limitOrNot + '满件发放(' + temp_value_1[0] + '件)')
                $('#goods_show').prop('style', 'display:inline-block')
              } else if (res.value.sendConditionType == 3) {
                var temp_value_1 = temp_value_1[0].split(',')
                $('#send_condition').prepend(limitOrNot + '满元(' + (temp_value_1[0] / 100).toFixed(2) + '元)且满件(' + temp_value_1[1] + '件)发放')
                $('#goods_show').prop('style', 'display:inline-block')
              } else if (res.value.sendConditionType == 4) {
                $('#send_condition').prepend('限品')
              }
              activity.getGoodsInfoByIds(core, ids,goodsType)
            } else {
              $('#send_condition').prepend('全部商品')
            }
            // 发放种类
            console.log(res)

            if (res.value.sendRules) {
              var sendRules = JSON.parse(res.value.sendRules)
              var sendNumTag = sendRules.sendNumTag
            } else {
              var sendNumTag = res.value.couponRules.length == 1 ? 1 : 3
            }

            if (sendNumTag == 1) {
              $('#send_label_type').html('发放一张')
            } else if (sendNumTag == 2) {
              $('#send_label_type').html('随机发放一张')
            } else if (sendNumTag == 3) {
              $('#send_label_type').html('发放多张')
            } else if(sendNumTag == 4){
             /* $('#send_label_type').html('多张选择一张发放（优惠券大转盘）')*/
              $('#send_label_type').html('动多张选择一张发放（互动营销活动）')
            }
            var send_way=''
            if (res.value.sendWay == 0) {
              //$('#send_way').html('显示在领券中心。活动期间内每张优惠券，每人可领' + res.value.sendLimit + '张');
              send_way+='显示在领券中心。'
            } else if (res.value.sendWay == 1) {
              //$('#send_way').html('自动发放至会员领券中心')
              send_way+='自动发放至会员中心。'
            } else if (res.value.sendWay == 2) {
              send_way+='生成固定链接与二维码。'
              /*
              if (res.value.sendLimit > 0) {
                  $('#send_way').html('生成固定链接与二维码。活动期间内每张优惠券，每人可领' + res.value.sendLimit + '张')
              } else {
                $('#send_way').html('生成固定链接与二维码，用户自领，每人最多可领张数不限')
              }
              */

              if (res.value.ybMerchant.shopwx_url) {
                var url=''
                var url2=''
                //var url3 = '/common/getQRCode?url=' + 'new/sendCoupons?id=' + activityId + '&ruleId=' + res.value.ybMerchant.merchant_id + '&needCompress=true'
                var url_wx=res.value.ybMerchant.shopwx_url.split(",")
                if(url_wx[0].indexOf('http://')>-1){
                  url=core.getHost() + '/wechat/getQRCode?url=' + url_wx[0] +
                    '%2Fnew%2FsendCoupons%3FactivityId%3D' + activityId + '%26siteId%3D' + res.value.ybMerchant.merchant_id + '&needCompress=true'
                  url2=url_wx[0] +
                    '/new/sendCoupons?activityId=' + activityId + '&siteId=' + res.value.ybMerchant.merchant_id + '&needCompress=true'
                }else {
                  url = core.getHost() + '/wechat/getQRCode?url=http://' + url_wx[0] +
                    '%2Fnew%2FsendCoupons%3FactivityId%3D' + activityId + '%26siteId%3D' + res.value.ybMerchant.merchant_id + '&needCompress=true'

                  url2 = 'http://' + url_wx[0] +
                    '/new/sendCoupons?activityId=' + activityId + '&siteId=' + res.value.ybMerchant.merchant_id + '&needCompress=true'
                }
                $('#wxCodeUrlImg').attr('src', url)
                $('#wxCodeUrlShow').text(url2)
                $('#qrcode_dwonload').attr('href', url)
                $('[name=sendTime]').hide()
              }
              $('[name=ewm]').show()

            } else if (res.value.sendWay == 3) {
                send_way+='发送红包，需要分享后领取。'
                //$('#send_way').html('发送红包，需要分享后领取。活动期间内每张优惠券，每人可领' + res.value.sendLimit + '张');

            } else if (res.value.sendWay == 4) {
                send_way+='派发给门店,然后店员自己收券后，再分享个顾客领取使用。'
                //$('#send_way').html('派发给门店,然后店员自己收券后，再分享个顾客领取使用。活动期间内每张优惠券，每人可领' + res.value.sendLimit + '张')

            } else if (res.value.sendWay == 5) {
                send_way+='直接派发给店员,无需领，直接分享给顾客领取使用。'
                //$('#send_way').prepend('直接派发给店员,无需领，直接分享给顾客领取使用。活动期间内每张优惠券，每人可领' + res.value.sendLimit + '张')
              var stores = res.value.sendWayValue
              if (stores == '-1') {
                $('#sotre_list_data').html('。指定全部门店')
                $('#sotre_list_data').prop('style', 'inline-block')
              } else {
                var url = core.getHost() + '/merchant/account/getStoresListByStoreIds'
                $.post(url, 'ids=' + stores, function (data) {
                  if (data.code == '000') {
                    $('#sotre_list_data').html('。指定门店(您已选择 <span style="color:red">' + data.value.length + '</span> 家门店，' + '<span data-toggle=\'modal\' data-target=\'#stores_list_box\' id="show_stores" data-value = "' + encodeURIComponent(JSON.stringify(data.value)) + '" style="color: #6BC5A4">点击查看</span>)')
                    $('#sotre_list_data').prop('style', 'inline-block')
                  }
                })
              }

            }
            var sendNum = 1
            if(res.value.sendLimit<0){
              sendNum='不限'
            }else {
              sendNum=res.value.sendLimit
            }
            if(sendNumTag==1&& res.value.sendWay != 1){
              send_way+='活动期间内每人可领'+sendNum+'张'
            }else if(sendNumTag==2&& res.value.sendWay != 1){
              send_way+='活动期间内每人可以随机领'+sendNum+'张'
            }else if(sendNumTag==3&& res.value.sendWay != 1){
              send_way+='活动期间内每人每张券分别可领'+sendNum+'张'
            }
            $('#send_way').prepend(send_way)


            if (res.value.startTime && res.value.endTime) {
              core.formatDate()
              var start_time = new Date(res.value.startTime).format('yyyy-MM-dd') + ' 00:00:00'
              var end_time = new Date(res.value.endTime).format('yyyy-MM-dd') + ' 23:59:59'

              $('#validity_time').html(start_time + '-' + end_time)
            } else {
              $('#validity_div').next('div').find('a').remove('#activity_save')
              $('#validity_div').hide()
            }

            //----使用详情
            if (res.value.couponRules) {
              var trArr = new Array()
              $.each(res.value.couponRules, function (k, v) {
                switch (v.couponType) {
                  case 100:
                    var coupon_type = '现金券'
                    break
                  case 200:
                    var coupon_type = '折扣券'
                    break
                  case 300:
                    var coupon_type = '限价券'
                    break
                  case 400:
                    var coupon_type = '包邮券'
                    break
                  case 500:
                    var coupon_type = '满赠券'
                    break
                }

                switch (v.status) { // 0正常(可发放) 1已过期 2手动停发 3已发完 4手动作废 10待发放
                  case 0:
                    var status = '可发放'
                    break
                  case 1:
                    var status = '已过期'
                    break
                  case 2:
                    var status = '手动停发'
                    break
                  case 3:
                    var status = '已发完'
                    break
                  case 4:
                    var status = '手动作废'
                    break
                  case 10:
                    var status = '待发放'
                    break
                }

                if (v.total == -1) {
                  var total = '--'
                } else {
                  var total = v.total
                }
                if (res.value.sendWay == 1) {  //现在只有自动发放一种类型的 领取总数设置为“---”
                  v.receiveNum = '---'
                }
                trArr.push('<tr><td>' + v.ruleName + '</td><td>' + coupon_type + '</td><td>' + status + '</td><td>' + v.sendMemberNum + '</td><td>' + v.memberNum + '</td><td>' + v.sendNum + '</td><td>' + v.useAmount + '</td></tr>')
              })

              $('#use_list').html(trArr.join(''))
            }

            if (res.value.createTime) {
              var create_time = new Date(res.value.createTime).format()
              $('#create_time').html(create_time)
            }

            $('input[name="activity_id"]').val(res.value.id)
            $('input[name="site_id"]').val(res.value.siteId)

            if (res.value.sendType != 3) {
              $('#activity_save').remove()
            }

            if (res.value.status != 10) {
              $('#activity_send').remove()
            }
          }
        }
      },
      // 不要改动这里的false
      async: false
    })
  }

  activity.getGoodsInfoByIds = function (core, ids,type) {
    var url = core.getHost() + '/goods/getGoodsInfoByIds'
    $.post(url, 'goodsIds=' + ids, function (goods) {
      if (goods.code == '000') {
        goodsList = goods.data
        goodsIdsArr = [];
        for(var i =0;i<goodsList.length;i++){
          goodsIdsArr.push(goodsList[i].product_id)
        }
        tempArr = []
        for(var i =0;i<goodsList.length;i++){
          if(i<15) {
            tempArr.push(goodsList[i])
          }
        }
        var temp = $('#send_condition').html();
        if(type==1){
        $('#send_condition').html(temp+'&nbsp;(指定商品参加,您已选择<span style="color: red">' + goodsList.length + '</span>个商品，<span data-toggle=\'modal\' data-target=\'#goods_list_box\' id="show_goods" data-value= "' + encodeURIComponent(JSON.stringify(tempArr)) + '" style="color: #6BC5A4">点击查看</span>)')
        } else if(type==2){
          $('#send_condition').html(temp+'&nbsp;(指定商品不参加,您已选择<span style="color: red">' + goodsList.length + '</span>个商品，<span data-toggle=\'modal\' data-target=\'#goods_list_box\' id="show_goods" data-value= "' + encodeURIComponent(JSON.stringify(tempArr)) + '" style="color: #6BC5A4">点击查看</span>)')
        }else {
          $('#send_condition').html(temp+'全部商品参加');
        }
        showGoodsRule3(goodsIdsArr, couponDetail1.currentPage,couponDetail1.pageSize)
      }
    })
  }

  activity.saveActivity = function (activityId) {
    var signMembers = {}
    var params = {}
    var title = $('input[name="title"]').val()
    var content = editor.html()
    var sendObj = $('input[name="sendObj"]').parent('label.checked').find('input[name=sendObj]').val()
    var yuan = $('input[name=full_money_limit]').val()
    if (title == '' || title.trim().length == 0) {
      layer.msg('标题不能为空')
      return
    }

    // 活动时间
    var startTime = $('input[name=start_time]').val()
    var endTime = $('input[name=end_time]').val()
    if (startTime || endTime) {
      if (!startTime || !endTime) {
        layer.msg('如果选择了开始时间或结束时间，则剩下的时间也必须选择')
        return
      }

      startTime = startTime + ':00'
      endTime = endTime + ':59'

      var sTime = new Date(startTime)
      var eTime = new Date(endTime)
      if (eTime < sTime) {
        layer.msg('结束时间不能小于开始时间')
        return
      }
      if (eTime < new Date()) {
        layer.msg('结束时间不能早于现在')
        return
      }

      params.startTime = sTime.getTime()
      params.endTime = eTime.getTime()
    }

    if (typeof  sendObj == 'undefined' || sendObj == '') {
      layer.msg('请选择发放对象')
      return
    }

    if (sendObj == 2) {
      var sign_members_info = $('#send_obj_members').val()
      if (typeof  sign_members_info == 'undefined' || sign_members_info == '') {
        layer.msg('请选择具体的标签')
        return
      } else {
        signMembers.type = 1
        signMembers.promotion_members = $('#send_obj_members').val()
        params.signMermbers = signMembers

      }
    } else if (sendObj == 4) {
      var sign_members_info_group = $('#send_obj_members_group').val()
      if (typeof  sign_members_info_group == 'undefined' || sign_members_info_group == '') {
        layer.msg('请选择具体的标签')
        return
      } else {
        signMembers.type = 3
        signMembers.promotion_members = $('#send_obj_members_group').val()
        params.signMermbers = signMembers
      }
    } else if (sendObj == 3) {
      var direct_members_info = $('#send_obj_members_direct').val()
      if (typeof  direct_members_info == 'undefined' || direct_members_info == '') {
        layer.msg('请至少自定义一位会员')
        return
      } else {
        signMembers.type = 2
        signMembers.promotion_members = $('#send_obj_members_direct').val()
        params.signMermbers = signMembers
      }
    }

    var sendWay = $('input[name="sendWay"]:checked').val()  //发放方式
    if (typeof sendWay == 'undefined' || sendWay == '') {
      layer.msg('请选择发放方式')
      return
    }

    // 会员最多可领多少次
    var sendLimit
      var sendLimit = $("input[name=send_limit]").val();
      if(sendWay == 1) { // 自动发放至会员中心的,默认唯一
          sendLimit = 1;
      }
    var user_send_way = [1, 3]

    if ($.inArray(parseInt($('[name="sendWay"]:checked').val()), user_send_way) >= 0) {//发放给会员

      var sendType = $('input[name="sendType"]:checked').val()

      if (typeof (sendType) == 'undefined' || sendType == '') {
        layer.msg('发放时间不能为空')
        return
      }

      if (parseInt(sendType) !== 1) {  //排除注册后发放

        if (sendType == 3) { //固定时间发放
          var startTime = $('#start_time').val()
          var endTime = $('#end_time').val()

          if (startTime == '' || endTime == '') {
            layer.msg('时间不能为空')
            return
          }
          params.startTime = startTime
          params.endTime = endTime
        }
      }

      if (sendType == 5 || sendType == 4) {
        //-----发放条件
        var sendConditionType
        var testSendConditionType1 = $('input[name=sendConditionType][value=\'1\']').is(':checked')
        var testSendConditionType2 = $('input[name=sendConditionType][value=\'2\']').is(':checked')

        if (testSendConditionType1) {
          if (testSendConditionType2)
            sendConditionType = 3
          else
            sendConditionType = 1
        } else {
          if (testSendConditionType2)
            sendConditionType = 2
          else
            sendConditionType = 4
        }

        var sendCondition_type = $('select[name=type]').val()  //0全部商品添加  2指定商品参加  3指定不参加

        if (sendConditionType == 1) { //　满元
          var full_money_id = $('#much_select_goods input[name=__goodsIds]').val()
          var full_money_limit = $('input[name="full_money_limit"]').val()

          if (!full_money_limit) {
            layer.msg('填写发放条件金额限制')
            return
          }

          if (sendCondition_type != 0) {
            if (full_money_id == '') {
              layer.msg('先选择商品')
              return
            }
          }

          if (sendCondition_type == 2) {
            var full_money_ids = full_money_id.replace(/\,/g, ':')
            var sendCondition = full_money_limit * 1000 / 10 + '&&' + full_money_ids  //满元指定商品
          } else if (sendCondition_type == 3) {
            var full_money_ids = full_money_id.replace(/\,/g, ':')
            var sendCondition = full_money_limit * 1000 / 10 + '&&non&&' + full_money_ids  //满元指定商品不参加
          } else if (sendCondition_type == 0) {
            var sendCondition = full_money_limit * 1000 / 10 + '&&all'
          }

        } else if (sendConditionType == 2) { //2满件
          var full_num_id = $('#much_select_goods input[name=__goodsIds]').val()
          var full_num_limit = $('input[name="full_num_limit"]').val()

          if (!full_num_limit) {
            layer.msg('填写发放条件件数限制')
            return
          }

          if (sendCondition_type != 0) {
            if (full_num_id == '') {
              layer.msg('先选择商品')
              return
            }
          }

          if (sendCondition_type == 2) {
            var full_num_ids = full_num_id.replace(/\,/g, ':')
            var sendCondition = full_num_limit + '&&' + full_num_ids  //满元指定商品
          } else if (sendCondition_type == 3) {
            var full_num_ids = full_num_id.replace(/\,/g, ':')
            var sendCondition = full_num_limit + '&&non&&' + full_num_ids  //满元指定商品不参加
          } else if (sendCondition_type == 0) {
            var sendCondition = full_num_limit + '&&all'
          }

        } else if (sendConditionType == 3) { // 满元且满件
          var full_id = $('#much_select_goods input[name=__goodsIds]').val()

          var full_money_limit = $('input[name="full_money_limit"]').val()
          var full_num_limit = $('input[name="full_num_limit"]').val()

          if (!full_money_limit) {
            layer.msg('填写发放条件金额限制')
            return
          }
          if (!full_num_limit) {
            layer.msg('填写发放条件件数限制')
            return
          }

          if (sendCondition_type != 0) {
            if (full_id == '') {
              layer.msg('先选择商品')
              return
            }
          }

          if (sendCondition_type == 2) {
            var full_ids = full_id.replace(/\,/g, ':')
            var sendCondition = full_money_limit * 1000 / 10 + ',' + full_num_limit + '&&' + full_ids  //满元指定商品
          } else if (sendCondition_type == 3) {
            var full_ids = full_id.replace(/\,/g, ':')
            var sendCondition = full_money_limit * 1000 / 10 + ',' + full_num_limit + '&&non&&' + full_ids  //满元指定商品不参加
          } else if (sendCondition_type == 0) {
            var sendCondition = full_money_limit * 1000 / 10 + ',' + full_num_limit + '&&all'
          }
        } else if (sendConditionType == 4) { // 不满元也不满件
          /*var full_id = $('#much_select_goods input[name=__goodsIds]').val()
          if (sendCondition_type != 0) {
            if (full_id == '') {
              layer.msg('先选择商品')
              return
            }
          }

          if (sendCondition_type == 2) {
            var full_ids = full_id.replace(/\,/g, ':')
            var sendCondition = full_ids  //指定商品
          } else if (sendCondition_type == 3) {
            var full_ids = full_id.replace(/\,/g, ':')
            var sendCondition =  '-1&&non&&' + full_ids  //指定商品不参加
          } else if (sendCondition_type == 0) {
            var sendCondition = '-1&&all'
          }*/
          layer.msg('请选择一项限制作为条件')
          return ;



        }
      }

    } else {  //发放给店员

      if (sendWay == 4) {
        var check_store = $('#store_check option:selected').val()
        if (check_store > 0) {
          var sendWayValue = $('#send_to_store').val()
          if (sendWay == '') {
            layer.msg('门店不能为空')
            return
          }
        }

      } else if (sendWay == 0) {

        sendType = $('#send_time_div').find(':checked').val()
      } else if (sendWay == 5) {

        sendType = 2
        var check_store = $('#clerk_store_check option:selected').val()

        var sendWayValue = $('#send_to_clerk').val()
        sendWayValue = sendWayValue ? sendWayValue : -1
        if (check_store > 0 && sendWayValue == -1) {
          layer.msg('门店不能为空')
          return
        }
      }
    }

    var rules = $('input[name="rules"]').val()

    if (typeof (rules) == 'undefined' || rules == '') {
      layer.msg('发放种类不能为空')
      return
    }

    var rule_val = $('#rules_val').val()
    if (rule_val == '') {
      layer.msg('请先添加优惠券')
      return
    }
      if(!sendType){
          sendType = -1;
      }
    params.title = title
    params.content = content
    params.sendObj = sendObj
    params.sendType = sendType
    params.sendConditionType = sendConditionType
    params.sendCondition = sendCondition
    params.sendWay = sendWay
    params.sendLimit = sendLimit
    params.sendWayValue = sendWayValue
    params.sendRules = rule_val
    params.image = $('[name="share_icon"]').val()

    var param = null
    var url
    if (activityId) {
      url = core.getHost() + '/merchant/activityedit'
      params.id = activityId
      params.status = 10
      param = JSON.stringify(params)
    } else {
      url = core.getHost() + '/merchant/createActivity'
      param = JSON.stringify(params)
    }
    $('#send_activity_ok').unbind('click')
    $('#send_activity_ok').on('click', function () {
      layer.msg('请不要重复提交')
    })
    $.post(url, {'data': param}, function (data) {
      console.log(data)
      if (data.code == '000') {
        //弹框提示
        layer.msg('恭喜，活动创建成功<br>操作提示:<br>1.当前为待发布状态，请检查后在确认发布;<br>2.在待发布状态下，您可以随时修改无任何影响', {
          time: 0 //不自动关闭
          , btn: ['我知道了']
          , yes: function () {
            location.href = core.getHost() + '/merchant/activityManager'
          }
        })
      } else {
        $('#send_activity_ok').unbind('click')
        $('#send_activity_ok').on('click', function () {
          require(['activity', 'core'], function (activity, core) {
            var activityId = core.getUrlParam('activityId')
            activity.saveActivity(activityId)
          })
        })
        if (activityId) {
          layer.msg('编辑失败')
        } else {
          layer.msg('添加失败')
        }
      }
    })
  }

  /**
   * 添加优惠券的弹窗内容
   *
   * @param rule
   */
  activity.getCouponList = function (rule) {
    var url = core.getHost() + '/merchant/getSendCouponList'
    var params = {}
    params.status = 0
    params.page = activity.pageno
    params.pageSize = activity.pageSize

    $.ajax({
      type: 'GET',
      url: url,
      data: params,
      complete: function (data) {
        data = JSON.parse(data.responseText)
        $('#coupon_table').empty()
        if (data.code = '000') {
          //不用方法参数传入的值，亲自获取
          data.rule = $('input[name=rules]:checked').val()

          core.formatDate()
          $.each(data.value.items, function (i, v) {
            data.value.items[i].createTime = new Date(v.createTime).format()
            if (v.couponView) {
              data.value.items[i].couponDetail = v.couponView.ruleDetail
              if (v.couponView.isAllType == 0) {
                data.value.items[i].goodLimit = '不限定'
              } else {
                data.value.items[i].goodLimit = '限定'
              }
            }

            if (v.timeRule) {
              var timeRule = JSON.parse(v.timeRule)
              if (timeRule.validity_type == 1 || timeRule.validity_type == 4) {
                data.value.items[i].validate = timeRule.startTime + '~' + timeRule.endTime
              } else {
                data.value.items[i].validate = '--'
              }
            } else {
              data.value.items[i].validate = '--'
            }
            console.info(v.amount)
            if (v.amount == -1) {
              data.value.items[i].valCount = '--'
            } else {
              data.value.items[i].valCount = parseInt(v.amount)
            }

          })

          var tmpl = document.getElementById('coupon_table_templete').innerHTML
          var doTtmpl = doT.template(tmpl)
          $('#coupon_table').html(doTtmpl(data))

          var rulesVal = $('#rules_val').val()
          showDate(rulesVal)

          radioAndCheckboxEvent()

          var pages = Math.ceil(data.value.total / data.value.pageSize)
          $('#page_info').pagination({
            pages: pages,
            styleClass: ['pagination-large'],
            showCtrl: true,
            displayPage: 6,
            currentPage: activity.pageno,
            onSelect: function (num) {
              console.log(num)
              activity.pageno = num
              activity.getCouponList(rule)
            }
          })
          $('#page_info').find('span:contains(共)').html('')
          $('#page_info').find('span:first').append('共' + pages + '页(' + data.value.total + '条记录)')
        }

        /**
         * 翻页的时候需要把选中的数据展示出来
         *
         * @param rulesVal
         */
        function showDate (rulesVal) {
          if (rulesVal != '') {
            var ruleJson = JSON.parse(rulesVal)
            var rulesArr = ruleJson.rules
            console.log(ruleJson)
            for (var i = 0; i < rulesArr.length; i++) {
              var ruleItem = rulesArr[i]
              $('input[name=coupon_id][value=' + ruleItem.ruleId + ']').attr('checked', 'true')
            }
          }
        }

        function radioAndCheckboxEvent () {
          //绑定单选框事件
          $('input[type=radio][name=coupon_id]').on('change', function () {
            var ruleId = $(this).val()
            var amount = $(this).parent().parent().children().eq($(this).parent().parent().children().length - 1).text()
            var name = $(this).parent().find('[name="coupon_name"]').val()
            var contentType = $(this).parent().find('[name="coupon_type"]').val()
            var contentMsg = $(this).parent().find('[name="coupon_couponDetail"]').val()
            if (amount == '--') {
              amount = -1
            }
            if ($(this).prop('checked')) {
              $('#rules_val').val(joinRuleIdAndAmout('', ruleId, amount, name, contentType, contentMsg))
            }
          })

          //绑定多选框事件
          $('input[type=checkbox][name=coupon_id]').on('change', function () {
            var ruleId = $(this).val()
            var amount = $(this).parent().parent().children().eq($(this).parent().parent().children().length - 1).text()
            var name = $(this).parent().find('[name="coupon_name"]').val()
            var contentType = $(this).parent().find('[name="coupon_type"]').val()
            var contentMsg = $(this).parent().find('[name="coupon_couponDetail"]').val()
            if (amount == '--') {
              amount = -1
            }
            if ($(this).prop('checked')) {
              $('#rules_val').val(joinRuleIdAndAmout($('#rules_val').val(), ruleId, amount, name, contentType, contentMsg))
            } else {
              $('#rules_val').val(deleteRuleIdAndAmout($('#rules_val').val(), ruleId))
            }
          })
        }
      },
      // 不要改动这里的false
      async: false
    })
  }

  /**
   * 编辑活动
   *
   * @param activityId
   */
  activity.toEditActivity = function (activityId,is_process) {
    var url = core.getHost() + '/merchant/getActivityDetail'
    var params = {}
    params.activityId = activityId
    $.get(url, params, function (data) {
      console.log('访问/merchant/getActivityDetail后的数据')
      console.log(data)
      if (data.code == '000') {
        var res = data.value

        console.log('data.value的值')
        console.log(res)

        // 活动标题
        $('input[name=title]').val(res.title)

        // 活动描述
        editor.html(res.content)

        // 活动海报
        $('[name="share_icon"]').val(res.image)

        // 活动时间
        core.formatDate()
        if (res.startTime) {
          var startTime = new Date(res.startTime).format('yyyy-MM-dd hh:mm')
          $('input[name=start_time]').val(startTime)
        }

        if (res.endTime) {
          var endTime = new Date(res.endTime).format('yyyy-MM-dd hh:mm')
          $('input[name=end_time]').val(endTime)
        }

        // 发放方式 + 发放时间
        sendWayAndSendType(res, res.sendObj)

        // 发放对象
        sendGroup(res, activityId)

        // 发放条件
        sendCondition(res)

        // 发放种类
        var sendRules = JSON.parse(res.sendRules)
        $('input[name=rules][value=' + sendRules.sendNumTag + ']').trigger('click')

        // 添加优惠券
        var rules = res.couponRules
        for (var i = 0; i < rules.length; i++) {
          if (rules[i].status != 0) {
            continue
          }

          $('input[name=coupon_id][value=' + rules[i].ruleId + ']').prop('checked', true)
        }
        $('#rules_val').val(res.sendRules)
        $('input[name=send_limit]').val(res.sendLimit)
        if(is_process){
          $('#send_activity_ok_issue').html('修改,立刻发放')
          $('#send_activity_ok').html('修改,稍后发放')
          $('.select-coupon-ok-btn').trigger('click')
        }
      } else if (data.code == '101') {
        layer.msg(data.message)
      } else {
        layer.msg('获取详情失败')
      }
    })

    /**
     * 发放对象
     */
    function sendGroup (res, activityId) {
      $('input[name=sendObj][value=' + res.sendObj + ']').trigger('change')
      var sel = res.sendObj
      if (sel == 1) {
        $('input[name=sendObj][value=' + res.sendObj + ']').prop('checked', true)
        $('.user_check_members').hide()
      } else if (sel == 2) {
        $('input[name=sendObj][value=' + res.sendObj + ']').prop('checked', true)
        $('.user_check_members').show()
        var list = res
        var active_html = ''
        var member_label_info = ''
        if (list['memberLabels'].length > 0) {
          for (var i = 0; i < list['memberLabels'].length; i++) {
            var this_a = '<a href=\'#\'  class=\'main-item main-item-a\'>' + list['memberLabels'][i].crowdName + '</a> '
            active_html += this_a
            member_label_info += '<a href=\'#\' data-empty-msg="' + list['memberLabels'][i].crowdName + '"  data-id = "' + list['memberLabels'][i].id + '" class=\'main-item main-item-b\' id="' + list['memberLabels'][i].id + '">' + list['memberLabels'][i].crowdName + '<input type="hidden" name="sign-member-b-input" value="' + list['memberLabels'][i].id + '"><span class="close-item close-item-a">×</span></a> '
            $('[name="sign-member-a-input"][value="' + list['memberLabels'][i].id + '"]').parent().css('background-color', 'green')
          }
          $('#send_obj_members').val(JSON.parse(res.signMermbers).promotion_members)
          $('#content-box-main_b').append(member_label_info)
          $('#send_obj_info').append(active_html)
          $('#show_active_obj').show()
        }
      } else if (sel == 4) {
        $('input[name=sendObj][value="4"]').click()
        $('.user_check_members_group').show()
        var list = res
        var active_html = ''
        var member_label_info = ''
        if (list['labelList'].length > 0) {
          for (var i = 0; i < list['labelList'].length; i++) {
            var this_a = '<a href=\'#\'  class=\'main-item main-item-a_group\'>' + list['labelList'][i] + '</a> '
            active_html += this_a
            member_label_info += '<a href=\'#\' data-empty-msg="' + list['labelList'][i] + '"  data-id = "' + list['labelList'][i] + '" class=\'main-item main-item-b_group\' id="' + list['labelList'][i] + '">' + list['labelList'][i] + '<input type="hidden" name="sign-member-b-input_group" value="' + list['labelList'][i] + '"><span class="close-item close-item-a_group">×</span></a> '
            $('[name="sign-member-a-input_group"][value="' + list['labelList'][i] + '"]').parent().css('background-color', 'green')
          }
          $('#send_obj_members_group').val(JSON.parse(res.signMermbers).promotion_members)
          $('#content-box-main_b_group').append(member_label_info)
          $('#send_obj_group_info').append(active_html)
          $('#show_active_obj_group').show()
        }
      }

      else if (sel == 3) {
        // 选中商品
        var params = {}
        params.activityId = activityId
        params.siteId = res.siteId
        var url = core.getHost() + '/merchant/getMemberListForActive'
        $.get(url, params, function (data) {
          console.log(data)
          if (data.code == '000' && data.value.length > 0) {
            var this_data = data.value
            for (var i = 0; i < this_data.length; i++) {
              var res = this_data[i]
              var data = {}
              data.memberId = res.memberId
              data.mobile = res.mobile
              data.storName = res.storName
              data.registerTime = res.registerTime
              data.ban_status = res.banStatus
              if (!$('.select_member_list [name="memberId"][value="' + data.memberId + '"]').val()) {
                var tmpl = document.getElementById('coupon_select_members_list_templete').innerHTML
                var doTtmpl = doT.template(tmpl)
                $('.select_member_list').append(doTtmpl(data))

              }
            }
            $('.select-members-ok').trigger('click')
          }
        })
        $('input[name=sendObj][value=' + res.sendObj + ']').prop('checked', true)
        $('.direct_user_check_members').show()

      }
    }

    function sendCondition (res) {
      if (!res.sendCondition)
        return
      if (res.sendCondition.indexOf('&&') != -1) {
        var sendMoneyOrNumLimit = res.sendCondition.split('&&')[0]
      }
      if(res.sendType==5){
        switch (res.sendConditionType) {
          case 1:
            $('input[name=sendConditionType2][value=\'1\']').attr('checked', true)
            $('input[name=full_money_limit2]').val(sendMoneyOrNumLimit / 100)
            break
          case 2:
            $('input[name=sendConditionType2][value=\'2\']').attr('checked', true)
            $('input[name=full_num_limit2]').val(sendMoneyOrNumLimit)
            break
          case 3:
            $('input[name=sendConditionType2][value=\'1\']').attr('checked', true)
            $('input[name=sendConditionType2][value=\'2\']').attr('checked', true)
            var split = sendMoneyOrNumLimit.split(',')
            $('input[name=full_money_limit2]').val(split[0] / 100)
            $('input[name=full_num_limit2]').val(split[1])
            break
          case 4:
            break
        }
      }else {
        switch (res.sendConditionType) {
          case 1:
            $('input[name=sendConditionType][value=\'1\']').attr('checked', true)
            $('input[name=full_money_limit]').val(sendMoneyOrNumLimit / 100)
            break
          case 2:
            $('input[name=sendConditionType][value=\'2\']').attr('checked', true)
            $('input[name=full_num_limit]').val(sendMoneyOrNumLimit)
            break
          case 3:
            $('input[name=sendConditionType][value=\'1\']').attr('checked', true)
            $('input[name=sendConditionType][value=\'2\']').attr('checked', true)
            var split = sendMoneyOrNumLimit.split(',')
            $('input[name=full_money_limit]').val(split[0] / 100)
            $('input[name=full_num_limit]').val(split[1])
            break
          case 4:
            break
        }
      }

    }
  }

  activity.editActivityTime = function () {
    var activity_id = $('input[name="activity_id"]').val()
    var site_id = $('input[name="site_id"]').val()
    var end_time = $('#end_time').html()
    var delay_data = $('input[name="delay_data"]').val()

    if (delay_data == '') {
      layer.msg('延长时间不能为空')
      return
    }
    var delay_time = (3600 * 24 * 1000) * delay_data

    require(['core'], function (core) {
      var date = new Date(parseInt(new Date(end_time).getTime()) + delay_time).format('yyyy-MM-dd')
      layer.open({
        type: 3,
        content: '<div class="sui-loading loading-inline"><i class="sui-icon icon-pc-loading"></i></div>'
      })
      var params = {}
      params.activityId = activity_id
      params.date = date

      var url = core.getHost() + '/merchant/activityUpdate/'
      $.post(url, params, function (e) {
        if (e.code == '000') {
          layer.msg('修改成功')
          location.href = core.getHost() + '/merchant/activityManager'
        }
      })
    })
  }

  //待发布改为发布
  activity.sendActivity = function () {

    var activity_id = $('input[name="activity_id"]').val()
    var site_id = $('input[name="site_id"]').val()

    require(['core'], function (core) {
      core.formatDate()
      var endTime = $('input[name=endTime]').val()
      if (endTime && new Date(parseInt(endTime)) < new Date()) {
        layer.msg('活动时间已结束，如需发布请重新设置活动时间')
        return
      }

      layer.open({
        type: 3,
        content: '<div class="sui-loading loading-inline"><i class="sui-icon icon-pc-loading"></i></div>'
      })
      var params = {}
      params.activityId = activity_id

      var url = core.getHost() + '/merchant/activitySend/'
      $.post(url, params, function (e) {
        if (e.code == '000') {
          //弹框提示
          layer.confirm('发布成功！<br>操作提示:<br>1.活动时间小于等于当前时间的，立即开始发放优惠券;<br>2.活动时间大于当前时间的，需等到时间后，自动开始发放优惠券。', {
            btn: ['我知道了'] //按钮
          }, function () {
            layer.msg('修改成功')
            location.href = core.getHost() + '/merchant/activityManager'
          })
        } else {
          layer.msg('该活动下无可发放的优惠券，发放失败')
          setTimeout(function () {
            location.reload()
          }, 1000)
        }
      })
    })
  }

  return activity
})

function sendWayAndSendType (res, type) {
  $('input[name=sendWay][value=' + res.sendWay + ']').trigger('click')

  if (res.sendWay == 5) {
    // 门店
    if (res.sendWayValue == -1) {
      $('#clerk_store_check').val(-1)
    } else {
      $('#clerk_store_check').val(1)
      $('#clerk_store_check').trigger('click')

      var url = '/merchant/selectByids'
      var params = {}
      params.storesStatus = 1
      params.ids = res.sendWayValue

      doAjax(url, params, 'get', false, function (data) {
        if (data.code == '000') {
          var res = data.value
          var tmpl = document.getElementById('select_store_list_templete').innerHTML
          var doTtmpl = doT.template(tmpl)
          for (var i = 0; i < res.length; i++) {
            var store_ = {}
            store_.id = res[i].id
            store_.name = res[i].name
            store_.service_support = res[i].serviceSupport
            store_.stores_number = res[i].storesNumber

            $('.select_stores_list').append(doTtmpl(store_))
            $('.select_stores_total').html($('.select_stores_list tr').length)
          }

          $('.select-house-ok').trigger('click')
        } else if (data.code == '101') {
          layer.msg(data.msg)
        } else {
          layer.msg('查询门店信息错误')
        }
      })
    }
  }
  if (res.sendWay == 1 || res.sendWay == 3) {
    $('input[name=sendType][value=' + res.sendType + ']').trigger('click')
    if (res.sendType == 4 || res.sendType == 5) {
      var products_ = res.sendConditionProducts
      if (products_ != 'all') {
        var params = {}
        if (products_.startsWith('non')) {
          $('select[name=type]').val(3)
          $('select[name=type]').trigger('change')
          params.goodsIds = products_.slice(5).replace(/:/g, ',')
        } else {
          $('select[name=type]').val(2)
          $('select[name=type]').trigger('change')
          params.goodsIds = products_.replace(/:/g, ',')
        }

        // 选中商品
        require(['goods_box'], function (goods_box) {
          goods_box.showSelectList(params.goodsIds)
        })
      }
    } else if (res.sendType == 2) {
    }
    if (type == 1) {
      $('#directMemberObj').find('[name="sendObj"]').eq(0).parent('label').addClass('checked')
    } else if (type == 2) {
      $('#directMemberObj').find('[name="sendObj"]').eq(1).parent('label').addClass('checked')
      $('.user_check_members').show()
    } else if (type == 3) {
      $('#directMemberObj').find('[name="sendObj"]').eq(2).parent('label').addClass('checked')
      $('.direct_user_check_members').show()
    }
  }
}

function showUseNumAndSendNumAsync () {
  // 分类收集列表页id
  var $tr = $('#coupon_table tr')
  if ($tr.size() === 0) return

  var couponActivityIds = [], promotionsActivityIds = []
  for (var i = 0; i < $tr.size(); i++) {
    var $tr_ = $tr.eq(i)
    var id_ = $tr_.find('input[name=id]').val()
    if (parseInt($tr_.find('input[name=ruleType]').val()) === 1) {
      if (id_) couponActivityIds.push(id_)
    } else {
      if (id_) promotionsActivityIds.push(id_)
    }
  }

  // 去数据库查询
  if (couponActivityIds.length !== 0) {
    var couponParams = {}
    couponParams.ids = couponActivityIds.join(',')
    doGetOrPost('coupon/queryUsedNumAndUnusedNumForActivityList', couponParams, 'get', true, function (data) {
      console.log('coupon')
      console.log(data)
      if (data.code === '000') {
        var res = data.value
        for (var i = 0; i < $tr.size(); i++) {
          var $tr_ = $tr.eq(i)
          var type_temp = $tr_.find('input[name=ruleType]').val()
          if (parseInt(type_temp) === 1) {
            var id_temp = parseInt($tr_.find('input[name=id]').val())
            var sendNum = 0, useNum = 0
            for (var j = 0; j < res.length; j++) {
              if (parseInt(res[j].source) === id_temp) {
                sendNum += res[j].countNum
                if (!res[j].status)
                  useNum += res[j].countNum
              }
            }
            $tr_.find('td').eq(2).html(sendNum)
            $tr_.find('td').eq(3).html(useNum)
          }
        }
      } else {
        layer.msg('接收异步生成总数失败')
      }
    })
  }

  if (promotionsActivityIds.length !== 0) {
    var promotionsParams = {}
    promotionsParams.ids = promotionsActivityIds.join(',')
    doGetOrPost('promotions/activity/queryUseNumAndSendNumForActivity', promotionsParams, 'get', true, function (data) {
      console.log('promotions')
      console.log(data)
      if (data.code === '000') {
        var res = data.value
        for (var i = 0; i < $tr.size(); i++) {
          var $tr_ = $tr.eq(i)
          var type_temp = $tr_.find('input[name=ruleType]').val()
          if (parseInt(type_temp) === 2) {
            var id_temp = parseInt($tr_.find('input[name=id]').val())
            var sendNum = 0, useNum = 0
            for (var j = 0; j < res.length; j++) {
              if (parseInt(res[j].activity_id) === id_temp) {
                sendNum += res[j].countNum
                if (!res[j].status)
                  useNum += res[j].countNum
              }
            }
            $tr_.find('td').eq(2).html(sendNum)
            $tr_.find('td').eq(3).html(useNum)
          }
        }
      } else {
        layer.msg('接收异步生成总数失败')
      }
    })
  }
}

/**
 * 根据 jk-service com.jk51.model.coupon.CouponActivityRulesForJson实体类添加ruleId和数量
 *
 * @param material
 * @param ruleId
 * @param amount
 * @return 在result的基础上添加ruleId和amount
 */
function joinRuleIdAndAmout (material, ruleId, amount, name, contentType, contentMsg) {
  var temp_result
  if (!material) {
    temp_result = {}
    temp_result.rules = []
    temp_result.sendNumTag = $('input[name=rules]:checked').val()
    var temp_ = {}
    temp_.ruleId = ruleId
    temp_.amount = amount
    temp_.name = name
    temp_.contentType = contentType
    temp_.contentMsg = contentMsg
    temp_result.rules.push(temp_)
  } else {
    temp_result = JSON.parse(material)
    temp_result.sendNumTag = $('input[name=rules]:checked').val()
    var temp_ = {}
    temp_.ruleId = ruleId
    temp_.amount = amount
    temp_.name = name
    temp_.name = name
    temp_.contentType = contentType
    temp_.contentMsg = contentMsg
    temp_result.rules.push(temp_)
  }

  return JSON.stringify(temp_result)
}

/**
 * 从material中移除ruleId的数据
 *
 * @param material
 * @param ruleId
 * @param amount
 * @returns {string}
 */
function deleteRuleIdAndAmout (material, ruleId) {
  var temp_result = JSON.parse(material)
  for (var i = 0; i < temp_result.rules.length; i++) {
    if (temp_result.rules[i].ruleId == ruleId) {
      temp_result.rules.splice(i, 1)
      break
    }
  }

  return JSON.stringify(temp_result)
}

/**
 *
 * @param url
 * @param params
 * @param type 'post' or 'get'
 * @param async ajax同步还是异步
 * @param callback 回调函数
 */
function doGetOrPost (url, params, type, async, callback) {
  var obj = {}
  obj.url = url
  obj.requestParams = params
  obj.isPost = type

  var result = '' // 收集处理结果
  $.ajax({
    url: '/merchant/promotions/doGetOrPost',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(obj),
    async: async,
    success: function (data) {
      callback(data)
    },
    error: function () {
      result = '请求失败'
    }
  })

  return result
}

function doAjax (url, params, type, async, callback) {
  $.ajax({
    url: url,
    type: type.toUpperCase(),
    data: params,
    async: async,
    success: function (data) {
      callback(data)
    }
  })
}

/**
 * 分页
 * @param goodsIdsArr
 */
function showGoodsRule3(goodsIdsArr, page,pageSize) {
  $('#goods_list_box #selected_goods').html('您已选择 <span style=\'color: red\'>' + goodsIdsArr.length + '</span> 个商品：');

  require(['utils'], function(utils) {
    var url = '/goods/getGoodsInfoByIdsByPage';
    var params = {
      'goodsIds': goodsIdsArr.join(','),
      'page': page,
      'pageSize': pageSize,
    };
    utils.ajax_(url, params, 'post', true, function(data) {
      if (data.code === '000') {
        var temp_data = data.value.data.map(function(obj) {
          var tempObj = {'name': obj.product_name, 'price': obj.product_price / 100};
          return tempObj;
        });
        $('#goods_list_box #selected_goods').
          html('您已选择 <span style=\'color: red\'>' + data.value.total + '</span> 个商品：');
        var tmpl = document.getElementById('goods_list_context').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $('#goods_list_box #goods_list').html(doTtmpl(temp_data));
        //分页
        $('#goodspage').pagination({
          pages: data.value.pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 6,
          currentPage: page,
          onSelect: function (num) {
            page = num
            showGoodsRule3(goodsIdsArr,num)
          }
        })
        $('#goodspage div').attr('style','display:inline')
      }
    }, function() {});
  });
}


