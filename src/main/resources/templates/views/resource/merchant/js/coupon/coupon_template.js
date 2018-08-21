/**
 * Created by Administrator on 2017/10/26.
 */

define(['core','utils','coupon_new'], function (core,utils,couponNew) {
  var couponTemplate={}
  couponTemplate.create_ = function (action_url) {
    core.formatDate()
    var $parent = $('#coupon_form')
    var couponRule = couponNew.getDataFromPage($parent)
    if (typeof(couponRule) === 'string') {
      layer.msg(couponRule)
      console.log("创建失败-0")
      couponTemplate.defeatedSubmit($parent)
      return
    }
    $('#coupon_send').on('click.a', function () {
      layer.msg('请不要重复提交')
    })
    $('#coupon_send').prop('type', 'button')

    $('#coupon_later').on('click.a', function () {
      layer.msg('请不要重复提交')
    })
    $('#coupon_later').prop('type', 'button')
    $('#coupon_send').attr("disabled",true);
    $('#coupon_later').attr("disabled",true);
    var url = 'couponRule/createReleasedCouponRuleReturnKey'
    utils.doGetOrPostOrJson(url, couponRule, 'json', true, function (data) {
      if (data.code === '000') {
        layer.msg('添加成功')
        if(!action_url){
          action_url= '/merchant/couponManager'
        }
        if(data.value){
          action_url+="?ruleId="+data.value
        }else {
          console.log("创建失败-1")
          couponTemplate.defeatedSubmit($parent)
        }
        location.href = core.getHost() +action_url

      } else {
        console.log("创建失败-2")
        couponTemplate.defeatedSubmit($parent)
      }
    },function(){
      console.log("创建失败-3")
      couponTemplate.defeatedSubmit($parent)
    })
  }
  couponTemplate.defeatedSubmit =function($parent){
    $('#coupon_send').off('click.a').prop('type', 'submit')
    $('#coupon_later').off('click.a').prop('type', 'submit')
    $('#coupon_send').attr("disabled",false);
    $('#coupon_later').attr("disabled",false);
  }


  couponTemplate.saveActivity=function(action_url){
    require(['core'],function (core) {
      var signMembers = {}
      var params = {}
      var title = $('input[name="title"]').val()
      var content =''
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
        if (sendType == 4) {
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
            layer.msg('请至少选择一项限制作为条件')
            return ;
            /*var full_id = $('#much_select_goods input[name=__goodsIds]').val()
            if (sendCondition_type != 0) {
              if (full_id == '') {
                layer.msg('先选择商品')
                return
              }
            }

            if (sendCondition_type == 2) {
              var full_ids = full_id.replace(/\,/g, ':')
              var sendCondition = '-1&&'+full_ids  //指定商品
            } else if (sendCondition_type == 3) {
              var full_ids = full_id.replace(/\,/g, ':')
              var sendCondition =  '-1&&non&&' + full_ids  //指定商品不参加
            } else if (sendCondition_type == 0) {
              var sendCondition = '-1&&all'
            }*/
          }
        }
        if (sendType == 5) {
          //-----发放条件
          var sendConditionType
          var testSendConditionType1 = $('input[name=sendConditionType2][value=\'1\']').is(':checked')
          var testSendConditionType2 = $('input[name=sendConditionType2][value=\'2\']').is(':checked')

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
            var full_money_limit = $('input[name="full_money_limit2"]').val()

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
            var full_num_limit = $('input[name="full_num_limit2"]').val()

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

            var full_money_limit = $('input[name="full_money_limit2"]').val()
            var full_num_limit = $('input[name="full_num_limit2"]').val()

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
            layer.msg('请至少选择一项限制作为条件')
            return ;
            /*var full_id = $('#much_select_goods input[name=__goodsIds]').val()
            if (sendCondition_type != 0) {
              if (full_id == '') {
                layer.msg('先选择商品')
                return
              }
            }

            if (sendCondition_type == 2) {
              var full_ids = full_id.replace(/\,/g, ':')
              var sendCondition = '-1&&'+full_ids  //指定商品
            } else if (sendCondition_type == 3) {
              var full_ids = full_id.replace(/\,/g, ':')
              var sendCondition =  '-1&&non&&' + full_ids  //指定商品不参加
            } else if (sendCondition_type == 0) {
              var sendCondition = '-1&&all'
            }*/
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

          sendType = $('input[name=sendType]:checked').val()
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
      var send_limit_temp=$('input[name="send_limit"]').val()
      if(send_limit_temp===''){
        layer.msg('优惠券可领取数量不能为空')
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

      var activityId = core.getUrlParam('activityId')
      var param = null
      var url='/merchant/createActivity'
      if(action_url){
        url = core.getHost() + action_url
      }
      //编辑发布
      if(activityId&&action_url){
        url = core.getHost() + '/merchant/activityedit'
        params.id = activityId
        params.status = 0
      }else if(activityId){
        //编辑不发布
        url = core.getHost() + '/merchant/activityedit'
        params.id = activityId
        params.status = 10
      }
      param = JSON.stringify(params)

      $('#send_activity_ok_issue').unbind('click')
      $('#send_activity_ok_issue').on('click', function () {
        layer.msg('请不要重复提交')
      })
      $('#send_activity_ok').unbind('click')
      $('#send_activity_ok').on('click', function () {
        layer.msg('请不要重复提交')
      })
      $.ajax({
        url:url,
        type: 'POST',
        data:{'data': param},
        success: function (data) {
          console.log(data)
          if (data.code == '000') {
            var alert_title=''
            if(action_url){
              alert_title='发布成功！<br>操作提示:<br>1.活动时间小于等于当前时间的，立即开始发放优惠券;<br>2.活动时间大于当前时间的，需等到时间后，自动开始发放优惠券。'
            }else {
              var status='创建'
              if(activityId){
                status='修改'
              }
              alert_title='恭喜，优惠券发布规则'+status+'成功！<br>操作提示:<br>1.当前为待发布状态，请检查后在确认发布;<br>2.在待发布状态下，您可以随时修改无任何影响'
            }
            //弹框提示
            layer.confirm(alert_title, {
              btn: ['我知道了'] //按钮
            }, function () {
              location.href = core.getHost() + '/merchant/activityManager'
            })
            //如果用户把弹窗搞没了，没点我知道了，5秒刷走
            setTimeout(function () {
              location.href = core.getHost() + '/merchant/activityManager'
            }, 5000)

          } else {
            $('#send_activity_ok').unbind('click')
            $('#send_activity_ok').on('click', function () {
              couponTemplate.saveActivity()
            })
            $('#send_activity_ok_issue').unbind('click')
            $('#send_activity_ok_issue').on('click', function () {
              couponTemplate.saveActivity(action_url)
            })
            layer.msg('发布失败')
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          $('#send_activity_ok').unbind('click')
          $('#send_activity_ok').on('click', function () {
            couponTemplate.saveActivity()
          })
          $('#send_activity_ok_issue').unbind('click')
          $('#send_activity_ok_issue').on('click', function () {
            couponTemplate.saveActivity(action_url)
          })
        }
      })
    })
  }

  return couponTemplate
})

