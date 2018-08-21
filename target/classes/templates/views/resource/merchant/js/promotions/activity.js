/**
 * 定义(活动发放)的核心函数
 * create by ztq 2017-08-10promotionActivity
 */
$(document).ready(function(){
  var aa=$('input[type=radio][name=coupon_id]').val();
  if (aa == null) {
    $('#promitonsDetail').hide()
    $('#linkweb').hide()
  }
});

define(['core'], function (core) {
  var activity = {}

  activity.pageno = 1
  activity.cur_per_page = 15

  /**
   * 保存活动规则
   */
  activity.create_ = function (activityId) {

    console.log('activity.create_()')
    var params = {}
    var title = $('input[name="title"]').val()
    var rules_val = $('#rules_val').val()
    var start_time = $('input[name="start_time"]').val() + ':00'
    var end_time = $('input[name="end_time"]').val() + ':59'
    var active_center = $('input[type="radio"][name="active_center"]:checked').val()
    var promotionsMould = $('#promotionsMould').val()

    var eventDesc = editor.html()

    var sendObj = $('input[type="radio"][name="sendObj"]:checked').val()
    var signMembers = {}
    if (sendObj == 1) {
      var sign_members_info = $('#send_obj_members').val()
      if (typeof  sign_members_info == 'undefined' || sign_members_info == '') {
        layer.msg('请选择具体的标签')
        return
      } else {
        signMembers.type = 1
        signMembers.promotion_members = $('#send_obj_members').val()
        params.signMermbers = signMembers
      }
    } else if (sendObj == 2) {
      var direct_members_info = $('#send_obj_members_direct').val()
      if (typeof  direct_members_info == 'undefined' || direct_members_info == '') {
        layer.msg('请至少自定义一位会员')
        return
      } else {
        signMembers.type = 2
        signMembers.promotion_members = $('#send_obj_members_direct').val()
        params.signMermbers = signMembers
      }
    }else if (sendObj ==3) {
      var sign_members_info_group = $('#send_obj_members_group').val()
      if (typeof  sign_members_info_group == 'undefined' || sign_members_info_group == '') {
        layer.msg('请选择具体的标签')
        return
      } else {
        signMembers.type = 3
        signMembers.promotion_members = $('#send_obj_members_group').val()
        params.signMermbers = signMembers
      }
    }
    var active_link = $('input[name="linkweb"]').val()
    if (active_link==null &&active_link==''){
      layer.msg('输入链接地址')
      return
    }
    var showRule = {}
    var isTopicPromotions = $('input[type="radio"][name="isTopicPromotions"]:checked').val()
    var windowPic = $('#windowPic').val()
    var windowWay = []
    $('input[type="checkbox"][name="windowWay"]:checked').each(function () {
      windowWay.push($(this).val())
    })

    var window1 = $('input[type="radio"][name="window1"]:checked').val()
    var window2 = $('input[type="radio"][name="window2"]:checked').val()

    if (title == ''||title.trim().length==0) {
      layer.msg('活动标题不能为空')
      return
    }
    if ( rules_val == ''&& active_link == '' ) {
      layer.msg('请选择活动')
      return false
    }
    if (start_time == '' || end_time == '') {
      layer.msg('活动时间不能为空')
      return false
    }
    var sTime = new Date(start_time)
    var eTime = new Date(end_time)
    if (eTime.getTime() - sTime.getTime() <= 0) {
      layer.msg('结束时间不能小于开始时间')
      return
    }

    if(active_center==1){
      if(promotionsMould==""){
        layer.msg('请选择活动海报')
        return false
      }
    }

    if (eventDesc == ''||eventDesc.trim().length==0) {
      layer.msg('活动描述不能为空')
      return false
    }
    if (sendObj == '') {
      layer.msg('请选择活动对象')
      return false
    }
    if (isTopicPromotions == 1) {
      if (windowPic == '') {
        layer.msg('请选择弹窗图片')
        return false
      }
      if (windowWay == '') {
        layer.msg('请选择弹窗方式')
        return false
      }
      if (windowWay.length > 0) {
        for (var i = 0; i < windowWay.length; i++) {
          var item = windowWay[i]
          if (item == 1) {
            if (window1 == '' || typeof  window1 == 'undefined') {
              layer.msg('请选择打开商城首页时弹窗提醒方式')
              return false
            }
          }
          if (item == 2) {
            if (window2 == '' || typeof  window2 == 'undefined') {
              layer.msg('请选择登录之后弹窗弹窗方式')
              return false
            }
          }
        }
      }
    }

    showRule.isShow = active_center
    showRule.forcePopup = isTopicPromotions
    showRule.popupAtHomePage = 0
    showRule.popupWhenLogin = 0
    if (windowWay.length != 0 && showRule.forcePopup != 0) {
      for (var i = 0; i < windowWay.length; i++) {
        var item = windowWay[i]
        if (item == 1) {
          showRule.popupAtHomePage = window1
        }
        if (item == 2) {
          showRule.popupWhenLogin = window2
        }
      }
    }
    showRule.isTransformFromThemaActivity = 0
    params.active_link=active_link
    params.title = title
    params.promotionsId = rules_val
    params.startTime = start_time
    params.endTime = end_time
    params.templatePic = promotionsMould
    params.intro = eventDesc
    params.posterPic = windowPic
    params.showRule = JSON.stringify(showRule)
    params.useObject = JSON.stringify(signMembers)
    if (sendObj == 0) {
      params.useObject = '{"type":0,"promotion_members":""}'
    }

    console.log('title-->' + title)
    console.log('promotionsId-->' + rules_val)
    console.log('startTime-->' + start_time)
    console.log('endTime-->' + end_time)
    console.log('templatePic-->' + promotionsMould)
    console.log('intro-->' + eventDesc)
    console.log('posterPic-->' + windowPic)
    console.log('showRule-->' + params.showRule)
    console.log('useObject-->' + params.useObject)

    var param = null
    var url
    if (activityId) {
      url = '/promotions/activity/update'
      params.id = activityId
      params.status = 10
      param = params
    } else {
      url = '/promotions/activity/create'
      param = params
    }

    console.log('url-->' + url)

    var registrationParams = {}
    registrationParams.url = url
    registrationParams.requestParams = param
    registrationParams.isPost = 'post'



    if (isTopicPromotions == 1) {
      //效验数据库中是否有主题活动（表中只能有一个主题活动）
      $.ajax({
        url: core.getHost() + '/merchant/promotions/getForcePopupCounts',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (data) {
          if (data.code == '000') {
            console.log('主题活动个数-->' + data.value)
            if (data.value > 0) {
              //提示弹框
              layer.confirm('您是否确认覆盖之前的主题活动？', {
                btn: ['确定', '容我三思'] //按钮
              }, function () {
                layer.msg('我已确定')
                //保存逻辑
                createOrUpdateActivity(registrationParams)
              }, function () {
                layer.msg('让我想想')
                return
              })
            }else{
              //保存逻辑 主题个数等于0 第一个主题活动
              createOrUpdateActivity(registrationParams)
            }
          }
        }
      })
    }else{
      //普通活动 保存逻辑
      createOrUpdateActivity(registrationParams)
    }

  }

  /**
   * 编辑回显
   */
  activity.toEdit_ = function (activityId) {

    console.log('activity.toEdit_()')
    var url = core.getHost() + '/merchant/promotions/proActivityDetail'
    var params = {}
    params.activityId = activityId
    params.proActivityType = 2
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

            $('input[name=title]').val(res.value.title)
            $('#rules_val').val(res.value.promotionsId)
            var activity_name=$('#'+res.value.promotionsId).html()
            $('#activity_name').html(activity_name)
            $('#activity_name').prop("style","display:inline-block")
            // 活动时间
            if (res.value.startTime) {
              var startTime = new Date(res.value.startTime).format('yyyy-MM-dd hh:mm:ss')
              $('input[name=start_time]').val(startTime.slice(0, 16))

            }

            if (res.value.endTime) {
              var endTime = new Date(res.value.endTime).format('yyyy-MM-dd hh:mm:ss')
              $('input[name=end_time]').val(endTime.slice(0, 16))

            }
            var showRule = JSON.parse(res.value.showRule)
            var isShow = showRule.isShow
            $('input[type=radio][name=active_center][value=' + isShow + ']').attr('checked', 'true')
            if (isShow == '1') {
              $('#promotionsMouldDiv').show()
              $('#template_pic').attr('src', res.value.templatePic)
              $('#promotionsMould').val(res.value.templatePic)
              $('#template_pic').show()
            }
            editor.html(res.value.intro)

            var useObject = JSON.parse(res.value.useObject)
            if (useObject.type == 0) {
              $('input[type=radio][name=sendObj][value=' + useObject.type + ']').attr('checked', 'true')
            } else if (useObject.type == 1) {
              $('input[type=radio][name=sendObj][value=' + useObject.type + ']').attr('checked', 'true')
              $('.user_check_members').show()
              var active_html = ''
              var member_label_info = ''
              var list = res.value
              if (list['memberLabels'].length > 0) {
                for (var i = 0; i < list['memberLabels'].length; i++) {
                  var this_a = '<a href=\'#\'  class=\'main-item main-item-a\'>' + list['memberLabels'][i].crowdName + '</a> '
                  active_html += this_a
                  member_label_info += '<a href=\'#\' data-empty-msg="' + list['memberLabels'][i].crowdName + '"  data-id = "' + list['memberLabels'][i].id + '" class=\'main-item main-item-b\' id="' + list['memberLabels'][i].id + '">' + list['memberLabels'][i].crowdName + '<input type="hidden" name="sign-member-b-input" value="' + list['memberLabels'][i].id + '"><span class="close-item close-item-a">×</span></a> '
                  $('[name="sign-member-a-input"][value="' + list['memberLabels'][i].id + '"]').parent().css('background-color', 'green')
                }
                $('#send_obj_info').append(active_html)
                $('#content-box-main_b').append(member_label_info)
                $('#send_obj_members').val(useObject.promotion_members)
                $('#show_active_obj').show()
              }
            } else if (useObject.type == 3) {
              $('input[type=radio][name=sendObj][value=' + useObject.type + ']').attr('checked', 'true')
              $('.user_check_members_group').show()
              var active_html = ''
              var member_label_info = ''
              var list = res.value
              if (list['labelList'].length > 0) {
                for (var i = 0; i < list['labelList'].length; i++) {
                  var this_a = '<a href=\'#\'  class=\'main-item main-item-a_group\'>' + list['labelList'][i] + '</a> '
                  active_html += this_a
                  member_label_info += '<a href=\'#\' data-empty-msg="' + list['labelList'][i] + '"  data-id = "' + list['labelList'][i] + '" class=\'main-item main-item-b_group\' id="' + list['labelList'][i] + '">' + list['labelList'][i] + '<input type="hidden" name="sign-member-b-input_group" value="' + list['labelList'][i] + '"><span class="close-item close-item-a_group">×</span></a> '
                  $('[name="sign-member-a-input_group"][value="' + list['labelList'][i] + '"]').parent().css('background-color', 'green')
                }
                $('#send_obj_group_info').append(active_html)
                $('#content-box-main_b_group').append(member_label_info)
                $('#send_obj_members_group').val(useObject.promotion_members)
                $('#show_active_obj_group').show()
              }
            } else {
              //自定义会员
              $('input[type=radio][name=sendObj][value=' + useObject.type + ']').attr('checked', 'true')
              $('.direct_user_check_members').show()
              var params = {}
              params.activityId = activityId
              params.siteId = res.value.siteId
              var url = core.getHost() + '/merchant/promotions/getMemberListForActive'
              $.get(url, params, function (data) {
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
              $('#send_obj_members_direct').val(useObject.promotion_members)
            }

            var forcePopup = showRule.forcePopup
            $('input[type=radio][name=isTopicPromotions][value=' + forcePopup + ']').attr('checked', 'true')
            if (forcePopup == 1) {
              $('#win_pic').attr('src', res.value.posterPic)
              $('#windowPic').val(res.value.posterPic)
              $('#win_pic').show()
              $('#topicActivityDiv').show()
            }
            var popupAtHomePage = showRule.popupAtHomePage
            if (popupAtHomePage != 0) {
              $('input[type=checkbox][name=windowWay][value=\'1\']').attr('checked', 'true')
              $('input[type=radio][name=window1][value=' + popupAtHomePage + ']').attr('checked', 'true')
            }
            var popupWhenLogin = showRule.popupWhenLogin
            if (popupWhenLogin != 0) {
              $('input[type=checkbox][name=windowWay][value=\'2\']').attr('checked', 'true')
              $('input[type=radio][name=window2][value=' + popupWhenLogin + ']').attr('checked', 'true')
            }
          }
        }
      },
      // 不要改动这里的false
      async: false
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
    $.ajax({
      type: 'post',
      url: url,
      data: params,
      async: false,
      dataType: 'json',
      success: function (data) {
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
            $('#err_Msg_for_sign_member').children().remove()
            $('#err_Msg_for_sign_member').html('<h4 style=\'padding-left: 250px\'>该商户尚未添加任何标签信息！</h4>')

          }

        } else {
          $('#err_Msg_for_sign_member').children().remove()
          $('#err_Msg_for_sign_member').html('<h4 style=\'padding-left: 250px\'>该商户尚未添加任何标签信息！</h4>')
        }

      }
    })
   /* $.post(url, params, function (data) {
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
          $('#err_Msg_for_sign_member').children().remove()
          $('#err_Msg_for_sign_member').html('<h4 style=\'padding-left: 250px\'>该商户尚未添加任何标签信息！</h4>')

        }

      } else {
        $('#err_Msg_for_sign_member').children().remove()
        $('#err_Msg_for_sign_member').html('<h4 style=\'padding-left: 250px\'>该商户尚未添加任何标签信息！</h4>')
      }

    })*/
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
   * 详情页面
   */
  activity.show_ = function () {

    var activityId = $('#edit_id').val()
    $('input[name=activity_id]').val(activityId)
    var url = core.getHost() + '/merchant/promotions/proActivityDetail'
    var params = {}
    params.activityId = activityId
    params.proActivityType = 2
    $.ajax({
      type: 'GET',
      url: url,
      data: params,
      complete: function (data) {
        if (data.code = '000') {

          var res = JSON.parse(data.responseText)
          if (res.value.promotionsId==-1){
            $('#proDetail').html(res.value.active_link)
          }
          if (res.value) {
            core.formatDate()
            console.log(res)
            var status = res.value.status
            console.log('status-->' + status)
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
            $('input[name=status]').val(res.value.status)
            $('#activity_title').html(res.value.title)
            //活动详情开始 use_list

            var promotionsTypeName = ''
            if (res.value.promotionsRule !=null){
              if (res.value.promotionsRule.promotionsType == '10') {
                promotionsTypeName = '满赠活动'
              } else if (res.value.promotionsRule.promotionsType == '20') {
                promotionsTypeName = '打折活动'
              } else if(res.value.promotionsRule.promotionsType == '30') {
                promotionsTypeName = '包邮活动'
              }else if(res.value.promotionsRule.promotionsType == '40') {
                promotionsTypeName = '满减活动'
              }else if(res.value.promotionsRule.promotionsType == '50') {
                promotionsTypeName = '限价活动'
              }
              var statusName = ''
              if (res.value.promotionsRule.status == '0') {
                statusName = '正常(可发放)'
              } else if (res.value.promotionsRule.status == '1') {
                statusName = '已过期'
              } else if (res.value.promotionsRule.status == '2') {
                statusName = '手动停发'
              } else if (res.value.promotionsRule.status == '3') {
                statusName = '已发完'
              } else {
                statusName = '待发放'
              }
              if (res.value.promotionsRule.total == -1) {
                res.value.promotionsRule.total = '--'
              }
              if (res.value.promotionsRule.amount == -1) {
                res.value.promotionsRule.amount = '--'
              }

              var use_list_html = '<tr>'
              use_list_html += '<td>' + res.value.promotionsRule.promotionsName + '</td>'
              use_list_html += '<td>' + promotionsTypeName + '</td>'
              use_list_html += '<td>' + statusName + '</td>'
              use_list_html += '<td>' + res.value.promotionsRule.createTime + '</td>'
              use_list_html += '<td>' + res.value.promotionsRule.total + '</td>'
              use_list_html += '<td>' + res.value.promotionsRule.useAmount + '</td>'
              use_list_html += '<td>' + res.value.promotionsRule.amount + '</td>'
              use_list_html += '</tr>'
            }

            $('#use_list').html(use_list_html)
            //活动详情结束
            $('#activity_time').html(res.value.startTime + ' 至 ' + res.value.endTime)
            var showRule = JSON.parse(res.value.showRule)
            if (showRule.isShow == 1) {
              $('#promotionsMouldDiv').show()
              $('#template_pic').attr('src', res.value.templatePic)
            }
            $('#activity_desc').html(res.value.intro)
            //参与对象 useObject
            if (res.value.useObject != '') {
              var useObject = JSON.parse(res.value.useObject)
              if (useObject.type == 1) {
                $('#send_obj').html('指定标签组会员')
                var active_html = ''
                var list = res.value
                if (list['memberLabels'].length > 0) {
                  for (var i = 0; i < list['memberLabels'].length; i++) {
                    var this_a = '<a href=\'#\'  class=\'main-item main-item-a\'>' + list['memberLabels'][i].crowdName + '</a> '
                    active_html += this_a
                  }
                  $('#send_obj_info').append(active_html)
                  $('#show_active_obj').show()
                }
              } else  if (useObject.type == 3) {
                $('#send_obj').html('指定标签会员')
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
              }
              else if (useObject.type == 2) {
                $('#send_obj').html('自定义会员&nbsp;<button data-toggle="modal" data-target="#mobile_show" data-keyboard="false" class="sui-btn btn-primary btn-lg">查看会员</button>')
                var arr_mobiles=res.value.memberPhones.split(',')
                var mobiles=""
                for(var i=1;i<=arr_mobiles.length;i++){
                  mobiles+=arr_mobiles[i-1];
                  mobiles+=",&emsp;"
                  if(i%5==0){
                    mobiles=mobiles.substring(0,mobiles.length-7)
                    mobiles+="<br/>"
                  }
                }
                $('#send_obj_info').html(mobiles)
                $('#show_active_obj').show()
              }
              else {
                $('#send_obj').html('全部会员')

              }
            }



            //是否为主题活动 showRule
            if (showRule.forcePopup == 1) {
              $('#isTopicPromotions').html('主题活动')
              $('#windowPic').show()
              $('#poster_pic').attr('src', res.value.posterPic)
              if (showRule.popupAtHomePage != 0 || showRule.popupWhenLogin != 0) {
                $('#reminderMode').show()
                var windowWayHtml = ''
                if (showRule.popupAtHomePage == 1) {
                  windowWayHtml += '打开商城首页时弹窗：活动期间只提醒一次<br/>'
                } else if (showRule.popupAtHomePage == 2) {
                  windowWayHtml += '登录之后弹窗：每天（间隔24小时）提醒一次<br/>'
                } else {
                  windowWayHtml += ''
                }
                if (showRule.popupWhenLogin == 1) {
                  windowWayHtml += '登录之后弹窗：活动期间只提醒一次<br/>'
                } else if (showRule.popupWhenLogin == 2) {
                  windowWayHtml += '登录之后弹窗：每天（间隔24小时）提醒一次<br/>'
                } else {
                  windowWayHtml += ''
                }
                $('#windowWay').html(windowWayHtml)
              }
            } else {
              $('#isTopicPromotions').html('普通活动')
            }
            //创建时间
            $('#create_time').html(res.value.createTime)
          }
        }
      },
      // 不要改动这里的false
      async: false
    })
  }

  /**
   * 添加优惠券的弹窗内容
   *
   */
  activity.getCouponList = function () {
    var url = core.getHost() + '/merchant/promotions/choosePromList'
    var params = {}
    params.status = 0
    params.pageNum = activity.pageno
    params.pageSize = activity.pageSize
    $.ajax({
      type: 'GET',
      url: url,
      data: params,
      complete: function (data) {
        data = JSON.parse(data.responseText)
        $('#coupon_table').empty()
        if (data.code = '000') {
          core.formatDate()
          $.each(data.value.list, function (i, v) {
            data.value.list[i].create_time = new Date(v.create_time).format()
            data.value.list[i].time_rule=JSON.parse(data.value.list[i].time_rule)
          })
          // PromitionsDetail(data);
          var tmpl = document.getElementById('coupon_table_templete').innerHTML
          var doTtmpl = doT.template(tmpl)
          $('#coupon_table').html(doTtmpl(data))

          var rulesVal = $('#rules_val').val()
          showData(rulesVal)
          radioEvent()
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
              activity.getCouponList()
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
        function showData (rulesVal) {
          if (rulesVal != '') {
            $('input[name=coupon_id][value=' + rulesVal + ']').attr('checked', 'true')
          }
        }

        function radioEvent () {
          //绑定单选框事件
          $('input[type=radio][name=coupon_id]').on('change', function () {
            var ruleId = $(this).val()
            var ruleType=   $("input[name='rule_type']").val()
            if ($(this).prop('checked')) {
              $('#rules_val').val(ruleId)
              var name=$('#'+ruleId).html();
              $('#activity_name').html(name)
              $('#activity_name').prop("style","display:inline-block")
              PromitionsDetail(data,ruleId,ruleType);
              var aa=$('input[type=radio][name=coupon_id]').val();
              if (aa != null) {
                $('#promitonsDetail').show()
              }
            }
          })
        }
      },
      // 不要改动这里的false
      async: false
    })
  }



  /**
   * 优惠活动详情
   * @param evt
   * @param source
   * @param id
   */
  function PromitionsDetail(data,ruleId,ruleType) {
    var kk ={};
    kk.id=ruleId ;
    kk.ruleType= ruleType;
    $.ajax({
      type:'POST',
      url:'/merchant/promotions/promRuleDetail',
      data:kk,
      success: function (kk) {
        var aa=JSON.parse(kk.value);
        var cc=aa.proCouponRuleView.proruleDetail;
        var promitionName=aa.label;
        var promitonType="";
        if (aa.promotionsType == '10') {
          promitonType = '满赠活动'
        } else if (aa.promotionsType== '20') {
          promitonType = '打折活动'
        } else if(aa.promotionsType == '30') {
          promitonType = '包邮活动'
        }else if(aa.promotionsType == '40') {
          promitonType = '满减活动'
        }else if(aa.promotionsType== '50') {
          promitonType = '限价活动'
        }
        // alert(cc);
        var html="<tr><td>"+promitionName+"</td>" +
                      "<td>"+promitonType+"</td>"+
                      "<td>"+cc+"</td>"+
                  "</tr>";
        $("#aaa").html(html);
      }
    });
  }

  //上传优惠券图标
  activity.upLoadPic = function (evt, source, id) {
    var files = evt.target.files

    // $(source).prev().html("<img src='"+ core.getHost()+"/source/managers/style/img/shoploading.gif' class='product_img_tmp' alt='' style='cursor:pointer' title='点击重新上传图标' />");

    for (var i = 0, f; f = files[i]; i++) {
      if (!f.type.match('image.*')) {
        continue
      }

      var formData = new FormData()

      formData.append('ad_img_file', f)
      formData.append('min_size_width', 300)
      formData.append('min_size_height', 300)
      formData.append('width_equal_height', 1)

      $.ajax({
        url: core.getHost() + '/merchant/image/upload',
        type: 'POST',
        success: function (data) {

          console.log(data)

          if (data.status && data.result) {
            var img_url = data.result.imgsrc
            $(source).prev().find('img').css('display', 'block').attr('src', img_url).show()
            $('#' + id).val(img_url)
          }
        },
        error: function (data) {
        },
        data: formData,
        cache: false,
        contentType: false,
        processData: false
      })
    }
  }

  /**
   * 根据活动的不同状态改变底边按钮
   */
  activity.changePromotionsActivityDetailButtons = function () {
    var send_html = '<a class=\'sui-btn btn-info btn-large\' style=\'margin-right:30px\' id=\'send_activity\'>确认发布</a>'
    var edit_html = '<a class=\'sui-btn btn-info btn-large\' style=\'margin-right:30px\' id=\'edit_activity\'>修改</a>'
    var return_html = '<a class=\'sui-btn btn-default btn-large\' id="return_list" href=\'/merchant/activityManager\'>返回列表</a>'

    var status = $('input[name=status]').val()

    var a_html
    switch (status) { // 0发布中 1定时发布 2过期结束 3已发完结束 4手动结束 10待发布
      case '0':
        a_html = return_html
        break
      case '1':
        a_html = return_html
        break
      case '2':
        a_html = return_html
        break
      case '3':
        a_html = return_html
        break
      case '4':
        a_html = return_html
        break
      case '10':
        a_html = send_html + edit_html + return_html
        break
    }

    if ((status == '0' || status == '1' || status == '4')) {

      a_html = return_html
    }

    $('#buttons').append(a_html)
  }

  /**
   * 根据活动的不同状态改变右边栏入口
   */
  activity.changePromotionsActivityDetailRightSide = function () {
    var stop_activity = '<a href="javascript:void(0);" data-toggle="modal" data-target="#stop_activity" class="sui-btn btn-bordered btn-xlarge btn-warning">结束该活动</a> &nbsp;'

    var status = $('input[name=status]').val()
    var a_html
    switch (status) { // 0发布中 1定时发布 2过期结束 3已发完结束 4手动结束 10待发布
      case '0':
        a_html = stop_activity
        break
      case '1':
        break
      case '2':
        break
      case '3':
        break
      case '4':
        break
      case '10':
      case '11':
        a_html = stop_activity
        break
    }

    $('#rightSide').append(a_html)
  }

  activity.uploadMember = function () {
    $('#member_list').html('')
    var formData = new FormData()
    var name = $('#file_name').val
    var file = $('#input_file')[0].files[0]
    formData.append('file', file)
    formData.append('name', name)
    formData.append('target', 'member')
    var successMsg = '读取会员信息成功！'
    var failMsg = '未读取到会员信息！'

    $.ajax({
      url: '/merchant/import',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (result) {
        var count = 0
        console.log(result)
        if (result != null) {
          if (result.code === '101') {
            layer.msg('模板格式错误！')
            return
          }
          var tmpl = document.getElementById('importList').innerHTML
          var doTtmpl = doT.template(tmpl)
          $('#member_list').html(doTtmpl(result.value))
          var str = ''//导入成功的商品
          for (var i = 0; i < result.value.length; i++) {
            if (result.value[i].remark == 0) {
              count = count + 1
              str += result.value[i].memberId + ','
            }
          }
          str = str.substring(0, str.length - 1)
          $('#send_obj_members_direct').val(str)
          $('#importSuccessCount').text(count)
          $('#importCount').text(result.value.length)
          var importFuile = (result.value.length - count)
          $('#importFuileCount').text(importFuile)
          layer.msg(successMsg)
        } else {
          $('#importFuileCount').text(0)
          $('#importCount').text(0)
          $('#importSuccessCount').text(0)
          layer.msg(failMsg)
        }
      }

    })
  }

  //待发布改为发布
  activity.sendActivity = function () {

    var activity_id = $('input[name="activity_id"]').val()
    require(['core'], function (core) {
      core.formatDate()
      var activity_time = $('#activity_time').html()
      var endTime = activity_time.substring(activity_time.indexOf('至') + 2)
      console.log(endTime < new Date().format('yyyy-MM-dd hh:mm:ss'))
      if (endTime && endTime < new Date().format('yyyy-MM-dd hh:mm:ss')) {
        layer.msg('活动时间已结束，如需发布请重新设置活动时间')
        return
      }

      layer.open({
        type: 3,
        content: '<div class="sui-loading loading-inline"><i class="sui-icon icon-pc-loading"></i></div>'
      })
      var params = {}
      params.activityId = activity_id

      var url = core.getHost() + '/merchant/promotions/activitySend/'
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

  //结束活动
  activity.stopActivity = function () {
    var params = {}
    params.activeId = $('input[name=activity_id]').val()
    params.preStatus = $('input[name=status]').val()
    params.toUpdateStatus = 4

    var url = core.getHost() + '/merchant/promotions/updateActiveStatus'
    $.post(url, params, function (data) {
      if (data.code == '000') {
        window.location.href = '/merchant/activityManager'
      } else if (data.code == '101') {
        layer.msg(data.message)
      } else {
        layer.msg('作废优惠券失败')
      }
    })
  }

  function createOrUpdateActivity (registrationParams) {
    $('#send_activity_ok').unbind("click");
    $('#send_activity_ok').on('click',function(){
      layer.msg("请不要重复提交")
    })
    $.ajax({
      url: core.getHost() + '/merchant/promotions/doGetOrPost',
      type: 'POST',
      data: JSON.stringify(registrationParams),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      success: function (data) {
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
          $('#send_activity_ok').unbind("click");
            $('#send_activity_ok').on('click', function () {
              require(['activity', 'core'], function (activity, core) {
                var activityId = core.getUrlParam('activityId')
                activity.create_(activityId)
              })
            })
          if (registrationParams.requestParams.id) {
            layer.msg('编辑失败')
          } else {
            layer.msg('添加失败')
          }
        }
      }
    })
  }

  return activity
})

