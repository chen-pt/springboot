define(['core', 'utils', 'modelRule'], function (core, utils, modelRule) {
  var activity = {}

  activity.pageno = 1
  activity.cur_per_page = 15

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

  activity.stopPromotionsRule = function () {
    var id = $('input[name=promotionsRuleId]').val()
    var msg = modelRule.changeStatus(id, 2)
    if (msg === 'success') {
      location.reload(true)
    } else if (msg === 'fail') {
      layer.msg('手动停发失败')
    } else {}
  }

  activity.saveActivity = function (action_url) {
    require(['core'], function (core) {
      var signMembers = {}
      var params = {}
      var title = $('input[name="title"]').val()
      var content = ''
      var sendObj = $('#directMemberObj').find('input[name=sendObj]:checked').val()
      if (title == '' || title.trim().length == 0) {
        layer.msg('标题不能为空')
        return
      }

      // 活动时间
      var startTime = $('input[name=start_time]').val()
      var endTime = $('input[name=end_time]').val()
      if (startTime || endTime) {

        if (startTime == '' || endTime == '') {
          layer.msg('请设置正确的活动时间！')
        }

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

      if (sendObj == 3) {
        var sign_members_info = $('#send_obj_members').val()
        if (typeof  sign_members_info == 'undefined' || sign_members_info == '') {
          layer.msg('请选择具体的标签库会员')
          return
        } else {
          signMembers.type = 3
          signMembers.promotion_members = $('#send_obj_members').val()
          params.signMermbers = signMembers

        }
      } else if (sendObj == 1) {
        var sign_members_info_group = $('#send_obj_members_group').val()
        if (typeof  sign_members_info_group == 'undefined' || sign_members_info_group == '') {
          layer.msg('请选择具体的标签组会员')
          return
        } else {
          signMembers.type = 1
          signMembers.promotion_members = $('#send_obj_members_group').val()
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
      }

      var sendWay = $('input[name="sendWay"]:checked').val()  //发放方式
      if (typeof sendWay == 'undefined' || sendWay == '') {
        layer.msg('请选择发放方式')
        return
      }

      // 会员最多可领多少次
      var sendLimit
      var sendLimit = $('input[name=send_limit]').val()
      if (sendWay == 1) { // 自动发放至会员中心的,默认唯一
        sendLimit = 1
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

      var rule_val = $('#rules_val').val()
      if (rule_val == '') {
        layer.msg('请先添加优惠券')
        return
      }
      if (!sendType) {
        sendType = -1
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
      var url = '/merchant/createActivity'
      if (action_url) {
        url = core.getHost() + action_url
      }
      //编辑发布
      if (activityId && action_url) {
        url = core.getHost() + '/merchant/activityedit'
        params.id = activityId
        params.status = 0
      } else if (activityId) {
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
        url: url,
        type: 'POST',
        data: {'data': param},
        success: function (data) {
          console.log(data)
          if (data.code == '000') {
            var alert_title = ''
            if (action_url) {
              alert_title = '发布成功！<br>操作提示:<br>1.活动时间小于等于当前时间的，立即开始发放优惠券;<br>2.活动时间大于当前时间的，需等到时间后，自动开始发放优惠券。'
            } else {
              var status = '创建'
              if (activityId) {
                status = '修改'
              }
              alert_title = '恭喜，优惠券发布规则' + status + '成功！<br>操作提示:<br>1.当前为待发布状态，请检查后在确认发布;<br>2.在待发布状态下，您可以随时修改无任何影响'
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
  /**
   * 保存活动规则
   */
  activity.create_ = function () {
    if ($('#Page1Data').val()) {
      var promotions = JSON.parse($('#Page1Data').val())
    }
    var url = 'promotions/activity/createReleaseRuleAndDraftActivity'
    var param = saveMyData(promotions)
    if (param == false) {return}
    var isTopicPromotions = $('input[type="radio"][name="isTopicPromotions"]:checked').val()
    var registrationParams = {}
    if (!promotions) {
      url = 'promotions/activity/create'
      param = param.promotionsActivity
    }
    registrationParams.url = url
    registrationParams.requestParams = param
    registrationParams.isPost = 'post'

    $('#send_activity_ok').on('click.a', function () {
      layer.msg('请不要重复提交')
    })
    $('#send_activity_ok').prop('type', 'button')

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
            if (data.value > 0) {
              //提示弹框
              layer.confirm('您是否确认覆盖之前的主题活动？', {
                btn: ['确定', '容我三思'] //按钮
              }, function () {
                layer.msg('我已确定')
                //保存逻辑
                createOrUpdateActivity(registrationParams, core)
              }, function () {
                layer.msg('让我想想')
                return
              })
            } else {
              //保存逻辑 主题个数等于0 第一个主题活动
              createOrUpdateActivity(registrationParams, core)
            }
          } else {
            layer.msg('创建失败')
            $('#send_activity_ok').off('click.a').prop('type', 'submit')
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          layer.msg('创建失败')
          $('#send_activity_ok').off('click.a').prop('type', 'submit')
        }
      })
    } else {
      //普通活动 保存逻辑
      createOrUpdateActivity(registrationParams, core)
    }
  }

  /**
   * 获取页面数据，提交编辑
   * @private
   */
  activity.edit_ = function () {
    var promotions = JSON.parse($('#Page1Data').val())
    var url = 'promotions/activity/editReleaseRuleAndDraftActivity'
    var param = saveMyData(promotions)
    var promotionsRule = promotions
    var promotionsActivity = param.promotionsActivity

    var $promotionsRuleForm = $('#promotions_rule_form')

    promotionsRule.id = parseInt($promotionsRuleForm.find('input[name=promotionsRuleId]').val())
    promotionsRule.createTime = $promotionsRuleForm.find('input[name=promotionsRuleCreateTime]').val()
    promotionsRule.status = parseInt($promotionsRuleForm.find('input[name=promotionsRuleStatus]').val())
    promotionsRule.version = parseInt($promotionsRuleForm.find('input[name=promotionsRuleVersion]').val())
    promotionsRule.useAmount = parseInt($promotionsRuleForm.find('input[name=promotionsRuleUseAmount]').val())
    promotionsRule.sendAmount = parseInt($promotionsRuleForm.find('input[name=promotionsRuleSendAmount]').val())
    promotionsActivity.id = parseInt($promotionsRuleForm.find('input[name=promotionsActivityId]').val())
    promotionsActivity.createTime = $promotionsRuleForm.find('input[name=promotionsActivityCreateTime]').val()
    promotionsActivity.status = parseInt($promotionsRuleForm.find('input[name=promotionsActivityStatus]').val())
    promotionsActivity.promotionsId = parseInt($promotionsRuleForm.find('input[name=promotionsRuleId]').val())

    console.log(promotionsRule)
    console.log(promotionsActivity)

    param.promotionsRule = promotionsRule
    param.promotionsActivity = promotionsActivity
    utils.doGetOrPostOrJson(url, param, 'json', false, function (data) {
      if (data.code === '000') {
        location.href = '/merchant/promotions/activityDetail?id=' + promotionsActivity.id
      }
    })
  }

  activity.edit_otherLink = function () {
    var url = 'promotions/activity/update'
    var param = saveMyData()
    var promotionsActivity = param.promotionsActivity

    var $promotionsRuleForm = $('#coupon_form')
    promotionsActivity.id = parseInt($promotionsRuleForm.find('#SaveEditPromotionsId').val())
    promotionsActivity.createTime = $promotionsRuleForm.find('input[name=promotionsActivityCreateTime]').val()
    promotionsActivity.status = parseInt($promotionsRuleForm.find('#SaveStatus').val())
    promotionsActivity.promotionsId = -1

    console.log(promotionsActivity)
    param.promotionsActivity = promotionsActivity
    utils.doGetOrPostOrJson(url, param.promotionsActivity, 'json', false, function (data) {
      if (data.code === '000') {
        location.href = '/merchant/promotions/promotionsSendManager'
      }
    })
  }

  /**
   * 通过id查询数据，然后回显到页面上
   * @param activityId
   * @return 如果有返回数据，则type为string，内容是出错信息
   */
  activity.showDataToPage = function (activityId) {
    var url = 'promotions/activity/getPromotionsRuleAndActivityByActivityId'

    utils.doGetOrPostOrJson(url, {'activityId': activityId}, 'get', false, function (data) {
      if (data.code === '000') {
        var promotionsActivity = data.value.promotionsActivity
        var promotionsRule = promotionsActivity.promotionsRule
        var result

        console.log('----------promotionsActivity----------')
        console.log(promotionsActivity)

        /* -- 复制 promotionsRule 到页面 -- */
        var $promotionsRuleForm = $('#promotions_rule_form')
        $promotionsRuleForm.find('input[name=promotionsRuleId]').val(promotionsRule.id)
        $promotionsRuleForm.find('input[name=promotionsRuleCreateTime]').val(promotionsRule.createTime)
        $promotionsRuleForm.find('input[name=promotionsRuleStatus]').val(promotionsRule.status)
        $promotionsRuleForm.find('input[name=promotionsRuleVersion]').val(promotionsRule.version)
        $promotionsRuleForm.find('input[name=promotionsRuleUseAmount]').val(promotionsRule.useAmount)
        $promotionsRuleForm.find('input[name=promotionsRuleSendAmount]').val(promotionsRule.sendAmount)
        $promotionsRuleForm.find('input[name=promotionsActivityId]').val(promotionsActivity.id)
        $promotionsRuleForm.find('input[name=promotionsActivityCreateTime]').val(promotionsActivity.createTime)
        $promotionsRuleForm.find('input[name=promotionsActivityStatus]').val(promotionsActivity.status)

        // 优惠标签
        $promotionsRuleForm.find('input[name=label]').val(promotionsRule.label)

        // 优惠名称
        $promotionsRuleForm.find('input[name=ruleName]').val(promotionsRule.promotionsName)

        // 优惠规则（包括选择商品）
        result = showPromotionsRuleInPromotionsRule($promotionsRuleForm, promotionsRule)
        if (result) return result

        // 有效期
        result = showTimeRuleInPromotionsRule($promotionsRuleForm, promotionsRule)
        if (result) return result

        // 适用门店
        result = copyUseStores2New($promotionsRuleForm, promotionsRule, utils)
        if (result) return result

        // 订单类型
        result = copyOrderTypeToNew($promotionsRuleForm, promotionsRule)
        if (result) return result

        // 商家备注
        $promotionsRuleForm.find('textarea[name=limitRemark]').val(promotionsRule.limitRemark)

        /* -- 复制 promotionsActivity 到页面 -- */
        var $promotionsActivityForm = $('#promotions_activity_form')

        // 活动标题
        $promotionsActivityForm.find('input[name=title]').val(promotionsActivity.title)

        // 活动时间
        $promotionsActivityForm.find('input[name=start_time]').val(promotionsActivity.startTime.slice(0, 16))
        $promotionsActivityForm.find('input[name=end_time]').val(promotionsActivity.endTime.slice(0, 16))

        // 活动中心
        var showRule = JSON.parse(promotionsActivity.showRule)
        $promotionsActivityForm.find('input[name=active_center][value=' + showRule.isShow + ']').trigger('click')

        // 活动描述
        editor.html(promotionsActivity.intro)

        // 参与对象
        copyUseObjectToNew($promotionsActivityForm, promotionsActivity, utils)

        //独立
        $promotionsActivityForm.find("input[name=is_independent][value="+promotionsActivity.isIndependent+"]").attr("checked", true);

        //使用限制
        $promotionsActivityForm.find("input[name=can_use_coupon][value="+promotionsActivity.canUseCoupon+"]").attr("checked", true);

        // 是否主题活动
        isThemeActivities($promotionsActivityForm, promotionsActivity, showRule)

        // 活动海报
        if (promotionsActivity.templatePic) {
          $promotionsActivityForm.find('#promotionsMould').val(promotionsActivity.templatePic)
          $promotionsActivityForm.find('#template_pic').attr('src', promotionsActivity.templatePic).show()
        }
      }
    })
  }

  activity.showOtherLinkDataToPage = function (activityId) {
    var url = 'promotions/activity/proActivityDetail'
    var param = {}
    param.id = activityId
    param.proActivityType = 2
    utils.doGetOrPostOrJson(url, param, 'get', true, function (data) {
      if (data.code = '000') {
        console.log(data.value)
        $('#control_window2').click()
        var promotionsActivity = data.value
        var $promotionsActivityForm = $('#coupon_form')
        $('#SaveEditPromotionsId').val(promotionsActivity.id)
        $('#SaveStatus').val(promotionsActivity.status)
        $('#SaveActiveLink').val(promotionsActivity.active_link)
        // 活动标题
        $promotionsActivityForm.find('input[name=title]').val(promotionsActivity.title)

        // 活动时间
        $promotionsActivityForm.find('input[name=start_time]').val(promotionsActivity.startTime.slice(0, 16))
        $promotionsActivityForm.find('input[name=end_time]').val(promotionsActivity.endTime.slice(0, 16))
        $promotionsActivityForm.find('input[name=linkweb]').val(promotionsActivity.active_link)
        // 活动中心
        var showRule = JSON.parse(promotionsActivity.showRule)
        $promotionsActivityForm.find('input[name=active_center][value=' + showRule.isShow + ']').trigger('click')

        // 活动描述
        editor.html(promotionsActivity.intro)

        // 参与对象
        copyUseObjectToNew($promotionsActivityForm, promotionsActivity, utils)

        // 是否主题活动
        isThemeActivities($promotionsActivityForm, promotionsActivity, showRule)
        changeKey()
        // 活动海报
        if (promotionsActivity.templatePic) {
          $promotionsActivityForm.find('#promotionsMould').val(promotionsActivity.templatePic)
          $promotionsActivityForm.find('#template_pic').attr('src', promotionsActivity.templatePic).show()
        }
      }
    })
  }

  activity.getSendCouponList = function (action_url) {
    var params = {}
    params.proActivitySendWay = 7
    /* var sendType = $('#sendType :selected').val()
     if (typeof (sendType) !== 'undefined' && sendType != '') {
       params.proActivitySendWay = sendType
     }*/

    var status = $('#status :selected').val()
    if (typeof status != 'undefined' && status != '') {
      params.status = status
    }
    var MyPromotionsType = $('#MyPromotionsType :selected').val()
    if (typeof MyPromotionsType != 'undefined' && MyPromotionsType != '') {
      params.promotionsRuleType = MyPromotionsType
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

    var url = core.getHost() + '/merchant/promotions/proActivityListNew'
    if (action_url) {
      url = core.getHost() + action_url
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

  /**
   *获取会员标签信息
   */
  activity.getMemberSignInfo = function (utils) {
    $('#content-box-main_a').children().remove()
    var url = core.getHost() + '/merchant/label/getLabelAll'
    var params = {}
    utils.ajax_(url, params, 'post', false, function (data) {
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
  activity.getMemberSignGroupInfo = function (utils) {
    $('#content-box-main_a_group').children().remove()
    var url = core.getHost() + '/merchant/label/getCustomNameAll'
    var params = {}
    utils.ajax_(url, params, 'post', false, function (data) {
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

    utils.ajax_(url, params, 'post', false, function (data) {
      var e = data.value
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
  activity.show_ = function (modelRule, utils, core) {
    var activityId = $('#edit_id').val()
    $('input[name=activity_id]').val(activityId)
    var url = '/promotions/activity/getPromotionsRuleAndActivityByActivityId'
    var params = {}
    params.activityId = activityId
    utils.doGetOrPostOrJson(url, {'activityId': activityId}, 'get', false, function (data) {
      if (data.code = '000') {
        if (data.value) {
          core.formatDate()
          var Activity_res = data.value.promotionsActivity
          var Activity_create_res = data.value.promotionsActivity.promotionsRule
          var Activity_promotionsRuleView = data.value.promotionsRuleView

          // 向页面隐藏域添加编辑需要的数据
          insertHideDataToPage(data, Activity_create_res, Activity_res)

          modelRule.promotions_rule_detail(Activity_promotionsRuleView, Activity_create_res, core, utils)
          var status = Activity_res.status
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
          $('input[name=status]').val(Activity_res.status)
          $('#activity_title').html(Activity_res.title)
          //活动详情开始 use_list

          var promotionsTypeName = ''
          if (Activity_res.promotionsRule != null) {
            var promotionsRule = JSON.parse(Activity_res.promotionsRule.promotionsRule)
            if (Activity_res.promotionsRule.promotionsType == '10') {
              promotionsTypeName = '满赠活动'
              $('input[name=rule_type]').val(1)
            } else if (Activity_res.promotionsRule.promotionsType == '20') {
              promotionsTypeName = '打折活动'
              $('input[name=rule_type]').val(promotionsRule.ruleType)
            } else if (Activity_res.promotionsRule.promotionsType == '30') {
              promotionsTypeName = '包邮活动'
              $('input[name=rule_type]').val(1)
            } else if (Activity_res.promotionsRule.promotionsType == '40') {
              promotionsTypeName = '满减活动'
              $('input[name=rule_type]').val(promotionsRule.ruleType)
            } else if (Activity_res.promotionsRule.promotionsType == '50') {
              promotionsTypeName = '限价活动'
              $('input[name=rule_type]').val(promotionsRule.ruleType)
            } else if (Activity_res.promotionsRule.promotionsType == '60') {
              // todo ????
              promotionsTypeName = '团购活动'
              $('input[name=rule_type]').val(promotionsRule.ruleType)
              /*$("#target").attr("style","display:none");*/
            }

            var statusName = ''
            if (Activity_res.promotionsRule.status == '0') {
              statusName = '正常(可发放)'
            } else if (Activity_res.promotionsRule.status == '1') {
              statusName = '已过期'
            } else if (Activity_res.promotionsRule.status == '2') {
              statusName = '手动停发'
            } else if (Activity_res.promotionsRule.status == '3') {
              statusName = '已发完'
            } else {
              statusName = '待发放'
            }
            if (Activity_res.promotionsRule.total == -1) {
              Activity_res.promotionsRule.total = '--'
            }
            if (Activity_res.promotionsRule.amount == -1) {
              Activity_res.promotionsRule.amount = '--'
            }

            var use_list_html = '<tr>'
            use_list_html += '<td>' + Activity_res.promotionsRule.promotionsName + '</td>'
            use_list_html += '<td>' + promotionsTypeName + '</td>'
            use_list_html += '<td>' + statusName + '</td>'
            use_list_html += '<td>' + Activity_res.promotionsRule.createTime + '</td>'
            use_list_html += '<td>' + Activity_res.promotionsRule.total + '</td>'
            use_list_html += '<td>' + Activity_res.promotionsRule.useAmount + '</td>'
            use_list_html += '<td>' + Activity_res.promotionsRule.amount + '</td>'
            use_list_html += '</tr>'
          }

          $('#use_list').html(use_list_html)
          //活动详情结束
          $('#activity_time').html(Activity_res.startTime + ' 至 ' + Activity_res.endTime)
          var showRule = JSON.parse(Activity_res.showRule)
          if (showRule.isShow == 1) {
            $('#promotionsMouldDiv').show()
            $('#template_pic').attr('src', Activity_res.templatePic)
          }
          $('#activity_desc').html(Activity_res.intro)
          //参与对象 useObject
          if (Activity_res.useObject != '') {
            var useObject = JSON.parse(Activity_res.useObject)
            if (useObject.type == 1) {
              $('#send_obj').html('指定标签组会员')
              var active_html = ''
              var list = useObject.promotion_members.split(',')
              if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                  var this_a = '<a href=\'#\'  class=\'main-item main-item-a_group\'>' + list[i] + '</a> '
                  active_html += this_a
                }
                $('#send_obj_info').append(active_html)
                $('#show_active_obj').show()
              }

            } else if (useObject.type == 3) {
              $('#send_obj').html('指定标签会员')
              var active_html = ''
              var list = useObject.promotion_members.split(',')
              if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                  var this_a = '<a href=\'#\'  class=\'main-item main-item-a_group\'>' + list[i] + '</a> '
                  active_html += this_a
                }
                $('#send_obj_group_info').append(active_html)
                $('#show_active_obj_group').show()
              }

            } else if (useObject.type == 2) {
              $('#send_obj').html('自定义会员&nbsp;<button data-toggle="modal" data-target="#mobile_show" data-keyboard="false" class="sui-btn btn-primary btn-lg">查看会员</button>')
              utils.doGetOrPostOrJson('promotions/activity/getMemberInfo', {'memberIds': useObject.promotion_members}, 'get', false, function (data) {
                if (data.code = '000') {
                  var arr_mobiles = data.value.split(',')
                  var mobiles = ''
                  for (var i = 1; i <= arr_mobiles.length; i++) {
                    mobiles += arr_mobiles[i - 1]
                    if (i != arr_mobiles.length) {
                      mobiles += ',&emsp;'
                    }
                    if (i % 5 == 0) {
                      mobiles = mobiles.substring(0, mobiles.length - 7)
                      mobiles += '<br/>'
                    }
                  }
                  $('#send_obj_info').html(mobiles)
                  $('#show_active_obj').show()
                }
              })

            } else {
              $('#send_obj').html('全部会员')
            }
          }

          if(Activity_res.isIndependent==2){
            $("#is_independent").html("允许参加其他活动")
          }else  if(Activity_res.isIndependent==1){
            $("#is_independent").html("独立活动，不允许参加其他任何活动")
          }else {
            if (Activity_res.promotionsRule.promotionsType === 50 || Activity_res.promotionsRule.promotionsType === 60)
              $("#is_independent").html("独立活动，不允许参加其他任何活动")
            else
              $("#is_independent").html("允许参加其他活动")
          }

          if(Activity_res.canUseCoupon==1){
            $("#can_use_coupon").html("允许使用优惠券")
          }else  if(Activity_res.canUseCoupon==2){
            $("#can_use_coupon").html("不允许使用任何优惠券")
          }else {
            if (Activity_res.promotionsRule.promotionsType === 50 || Activity_res.promotionsRule.promotionsType === 60)
              $("#can_use_coupon").html("不允许使用任何优惠券")
            else
              $("#can_use_coupon").html("允许使用优惠券")
          }
          //是否为主题活动 showRule
          if (showRule.forcePopup == 1) {
            $('#isTopicPromotions').html('主题活动');
            $('#windowPic').show()
            $('#poster_pic').attr('src', Activity_res.posterPic)
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
              $('#windowWay').html(windowWayHtml);
            }
          } else {
            $('#isTopicPromotions').html('普通活动');
          }
          //创建时间
          $('#create_time').html(Activity_res.createTime)
        }
      }
    })
  }

  activity.show_otherLink = function (modelRule, utils, core) {
    var activityId = $('#edit_id').val()
    $('input[name=activity_id]').val(activityId)
    var url = 'promotions/activity/proActivityDetail'
    var params = {}
    params.id = activityId
    //活动
    params.proActivityType = 2
    utils.doGetOrPostOrJson(url, params, 'get', false, function (data) {
      if (data.code = '000') {
        if (data.value) {
          var Activity_res = data.value
          var status = Activity_res.status
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
          $('input[name=status]').val(Activity_res.status)
          $('#activity_title').html(Activity_res.title)
          $('#activity_time').html(Activity_res.startTime + ' 至 ' + Activity_res.endTime)
          var showRule = JSON.parse(Activity_res.showRule)
          if (showRule.isShow == 1) {
            $('#promotionsMouldDiv').show()
            $('#template_pic').attr('src', Activity_res.templatePic)
          }
          $('#activity_desc').html(Activity_res.intro)
          //隐藏域中放值
          $('input[name=active_link]').val(Activity_res.active_link)
          //参与对象 useObject
          if (Activity_res.useObject != '') {
            var useObject = JSON.parse(Activity_res.useObject)
            if (useObject.type == 1) {
              $('#send_obj').html('指定标签组会员')
              var active_html = ''
              var list = useObject.promotion_members.split(',')
              if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                  var this_a = '<a href=\'#\'  class=\'main-item main-item-a_group\'>' + list[i] + '</a> '
                  active_html += this_a
                }
                $('#send_obj_info').append(active_html)
                $('#show_active_obj').show()
              }
            } else if (useObject.type == 3) {
              $('#send_obj').html('指定标签会员')
              var active_html = ''
              var list = useObject.promotion_members.split(',')
              if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                  var this_a = '<a href=\'#\'  class=\'main-item main-item-a_group\'>' + list[i] + '</a> '
                  active_html += this_a
                }
                $('#send_obj_group_info').append(active_html)
                $('#show_active_obj_group').show()
              }
            }
            else if (useObject.type == 2) {
              $('#send_obj').html('自定义会员&nbsp;<button data-toggle="modal" data-target="#mobile_show" data-keyboard="false" class="sui-btn btn-primary btn-lg">查看会员</button>')
              utils.doGetOrPostOrJson('promotions/activity/getMemberInfo', {'memberIds': useObject.promotion_members}, 'get', false, function (data) {
                if (data.code = '000') {
                  var arr_mobiles = data.value.split(',')
                  var mobiles = ''
                  for (var i = 1; i <= arr_mobiles.length; i++) {
                    mobiles += arr_mobiles[i - 1]
                    if (i != arr_mobiles.length) {
                      mobiles += ',&emsp;'
                    }
                    if (i % 5 == 0) {
                      mobiles = mobiles.substring(0, mobiles.length - 7)
                      mobiles += '<br/>'
                    }
                  }
                  $('#send_obj_info').html(mobiles)
                  $('#show_active_obj').show()
                }
              })
            }
            else {
              $('#send_obj').html('全部会员')

            }
          }

          //是否为主题活动 showRule
          if (showRule.forcePopup == 1) {
            $('#isTopicPromotions').html('主题活动')
            $('#windowPic').show()
            $('#poster_pic').attr('src', Activity_res.posterPic)
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
          $('#create_time').html(Activity_res.createTime)
          $('#otherLink').html(Activity_res.active_link)
        }
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
    var return_html = '<a class=\'sui-btn btn-default btn-large\' id="return_list" href=\'/merchant/promotions/promotionsSendManager\'>返回列表</a>'

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
    var copy_activity = '<a href="javascript:void(0);" id="copy_promotions_rule" class="sui-btn btn-bordered btn-xlarge btn-success">复制活动</a> &nbsp;'
    var status = $('input[name=status]').val()
    var a_html
    switch (status) { // 0发布中 1定时发布 2过期结束 3已发完结束 4手动结束 10待发布
      case '0':
        a_html = copy_activity + stop_activity
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
        a_html = copy_activity + stop_activity
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
      if (endTime && endTime < new Date().format('yyyy-MM-dd hh:mm:ss')) {
        layer.msg('活动时间已结束，如需发布请重新设置活动时间')
        return
      }

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
            location.href = core.getHost() + '/merchant/promotions/promotionsSendManager'
          })
          setTimeout(function () {
            location.href = core.getHost() + '/merchant/promotions/promotionsSendManager'
          }, 5000)
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
        window.location.href = '/merchant/promotions/promotionsSendManager'
      } else if (data.code == '101') {
        layer.msg(data.message)
      } else {
        layer.msg('作废优惠券失败')
      }
    })
  }

  return activity
})

function copyGroupBookingToNew ($parent, rule) {
  console.log('copyGroupBookingToNew')
  console.log(rule)
  $parent = $parent.find('#group-booking-promotions')

  // 选择商品
  $parent.find('select[name=type]').val(rule.goodsIdsType).trigger('change')
  // 通过商品id获取相应的字段
  if (rule.goodsIds !== 'all') copySelectedGoodsToShow(rule.goodsIds)

  // 复制拼团价格数据
  $parent.find('select[name=rule_type]').val(rule.ruleType).trigger('change')
  switch (rule.ruleType) {
    case 1:
      var t_r = rule.rules[0]
      $parent.find('input[name=group_price]').val(t_r.groupPrice / 100)
      $parent.find('input[name=group_member_num_1]').val(t_r.groupMemberNum)
      $parent.find('input[name=goods_limit_num_1]').val(t_r.goodsLimitNum)
      break

    case 2:
      if (parseInt(rule.goodsIdsType) === 1) {
        var t_m = {}
        rule.rules.forEach(function (t) {
          t_m[t.goodsId.toString()] = t
        })
        require(['GBP_box'], function (GBP_box) {
          GBP_box.show_to_GBPBox_from_more(rule.goodsIds, t_m)
        })
      }
      break

    case 3:
      var t_r = rule.rules[0]
      $parent.find('input[name=group_discount]').val(t_r.groupDiscount / 10)
      $parent.find('input[name=group_member_num_3]').val(t_r.groupMemberNum)
      $parent.find('input[name=goods_limit_num_3]').val(t_r.goodsLimitNum)
      var t_mr
      if (rule.isMl === 1) {
        if (rule.isRound === 0) {
          t_mr = 3
        } else {
          t_mr = 1
        }
      } else {
        if (rule.isRound === 0) {
          t_mr = 4
        } else {
          t_mr = 2
        }
      }
      $parent.find('select[name=ml_round_3]').val(t_mr)

      if (t_r.maxReduce !== 0) {
        $parent.find('input[type=checkbox][name=max_reduce_sign_3]').trigger('click')
        $parent.find('input[name=max_reduce_3]').val(t_r.maxReduce / 100)
      }
      break

    case 4:
      if (parseInt(rule.goodsIdsType) === 1) {
        var t_m = {}
        rule.rules.forEach(function (t) {
          t_m[t.goodsId.toString()] = t
        })
        require(['GBD_box'], function (GBD_box) {
          GBD_box.show_to_GBDBox_from_more(rule.goodsIds, t_m)
        })

        var t_r = rule.rules[0]
        if (t_r.maxReduce !== 0) {
          $parent.find('input[type=checkbox][name=max_reduce_sign_4]').trigger('click')
          $parent.find('input[name=max_reduce_4]').val(t_r.maxReduce / 100)
        }
      }
      break

    default:
      return 'impossible error'
  }

  // 复制拼团时效
  switch (rule.groupLiveTime) {
    case 24:
    case 48:
    case 72:
      $parent.find('select[name=group_live_time]').val(rule.groupLiveTime / 24)
      break
    default:
      if (rule.groupLiveTime > 0) {
        $parent.find('select[name=group_live_time]').val(-1).trigger('change')
        $parent.find('input[name=group_live_time]').val(rule.groupLiveTime)
      } else return 'impossible error'
  }
}

function copyFixedPriceToNew ($parent, rule) {
  $parent = $parent.find('#fixed-price-promotions')

  // 选择商品
  $parent.find('select[name=type]').val(rule.goodsIdsType).trigger('change')
  // 通过商品id获取相应的字段
  if (rule.goodsIds !== 'all') copySelectedGoodsToShow(rule.goodsIds)

  $parent.find('input[name=rule_type][value=' + rule.ruleType + ']').trigger('click')

  if (rule.ruleType === 1) {
    $parent.find('input[name=fixed-price]').val(rule.fixedPrice / 100)
  } else { // ruleType == 2
    require(['EGFP_box'], function (EGFP_box) {
      EGFP_box.showToEGFPBoxFromGoodsIdsAndMore(rule.goodsIds)
      rule.rules.forEach(function (item) {
        $('#each-goods-fixed-price-box table.select_goods_list input[name=goods_id][value=  ' + item.goodsId + ']')
          .parent().find('input[name=fixedPrice]').val(item.fixedPrice / 100)
      })
      $('#each-goods-fixed-price-box').trigger('okHide')
    })
  }

  $parent.find('input[name=buy-num-each-order]').val(rule.buyNumEachOrder)
  $parent.find('input[name=storage]').val(rule.total)
}

function copyReduceMoneyToNew ($parent, rule) {
  $parent = $parent.find('#reduce-money-promotions')

  // 选择商品
  $parent.find('select[name=type]').val(rule.goodsIdsType).trigger('change')

  // 通过商品id获取相应的字段
  if (rule.goodsIds !== 'all') {
    require(['goods_box'], function (goods_box) {
      goods_box.showSelectList(rule.goodsIds)
    })
  }

  var rules = rule.rules
  switch (parseInt(rule.ruleType)) {
    case 1:
      $parent = $parent.find('input[name=rule_type][value=1]').parent()
      $parent.find('input[name=reduce_money]').val(rules[0].reduceMoney / 100)
      break
    case 2:
      $parent = $parent.find('input[name=rule_type][value=2]').parent()
      $parent.find('input[name=each_full_money]').val(rules[0].meetMoney / 100)
      $parent.find('input[name=reduce_price]').val(rules[0].reduceMoney / 100)
      var cap = rules[0].cap
      if (cap) {
        $parent.find('input[name=max_reduce_checkbox]').trigger('click')
        $parent.find('input[name=max_reduce]').val(cap / 100)
      }
      break
    case 3:
      $parent = $parent.find('input[name=rule_type][value=3]').parent().next()
      for (var i = 0; i < rules.length; i++) {
        var $span = $parent.find('span').eq(i)
        $span.find('input[name=each_full_money]').val(rules[i].meetMoney / 100)
        $span.find('input[name=reduce_price]').val(rules[i].reduceMoney / 100)

        if (i !== rules.length - 1) {
          $span.find('input[name=_add]').trigger('click')
        }
      }
      break
    default:
      return '数据有误'
  }
}

function createOrUpdateActivity (registrationParams, core) {
  $.ajax({
    url: core.getHost() + '/merchant/promotions/doGetOrPost',
    type: 'POST',
    data: JSON.stringify(registrationParams),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      if (data.code == '000') {
        //弹框提示
        layer.msg('恭喜，活动创建成功<br>操作提示:<br>1.当前为待发布状态，请检查后在确认发布;<br>2.在待发布状态下，您可以随时修改无任何影响', {
          time: 0 //不自动关闭
          , btn: ['我知道了']
          , yes: function () {
            location.href = core.getHost() + '/merchant/promotions/promotionsSendManager'
          }
        })

        setTimeout(function () {
          location.href = core.getHost() + '/merchant/promotions/promotionsSendManager'
        }, 5000)
      } else {
        // 删除 click.a
        layer.msg('创建失败')
        $('#send_activity_ok').off('click.a').prop('type', 'submit')
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      layer.msg('创建失败')
      $('#send_activity_ok').off('click.a').prop('type', 'submit')
    }
  })
}

function showPromotionsRuleInPromotionsRule ($parent, promotionsRule) {
  var type = promotionsRule.promotionsType
  var rule = JSON.parse(promotionsRule.promotionsRule)

  var result = ''
  switch (parseInt(type)) {
    case 10:
      result = copyGiftRuleToNew($parent, rule)
      break
    case 20:
      result = copyDiscountRuleToNew($parent, rule)
      break
    case 30:
      result = copyFreePostageToNew($parent, rule)
      break
    case 40:
      result = copyReduceMoneyToNew($parent, rule)
      break
    case 50:
      result = copyFixedPriceToNew($parent, rule)
      break
    case 60:
      result = copyGroupBookingToNew($parent, rule)
      break
    default:
      return 'impossible error, check your data'
  }

  if (result) return result
}

function copyFreePostageToNew ($parent, rule) {
  $parent = $parent.find('#free-postage-promotions')

  // 选择商品
  $parent.find('select[name=type]').val(rule.goodsIdsType).trigger('change')

  // 通过商品id获取相应的字段
  if (rule.goodsIds !== 'all') copySelectedGoodsToShow(rule.goodsIds)

  // 满元包邮金额
  $parent.find('input[name=meetMoney]').val(rule.meetMoney / 100)

  // 免邮费上限
  $parent.find('input[name=reducePostageLimit]').val(rule.reducePostageLimit / 100)

  // 地区弹框
  $parent.find('input[name=areaIdsType][value=' + rule.areaIdsType + ']').trigger('click')

  require(['area_box'], function (area_box) {
    area_box.showSelectList(rule.areaIds)
  })
}

function copyGiftRuleToNew ($parent, rule) {
  // 1、选择购买商品及组合方式
  $parent.find('input[name=calculateBase][value=' + rule.calculateBase + ']').trigger('click')

  // 通过商品id获取相应的字段
  copySelectedGoodsToShow(rule.goodsIds)

  // 2、设置赠送条件
  var $temp = $parent.find('input[name=ruleType][value=' + rule.ruleType + ']')
  $temp.trigger('click')

  var ruleConditions = rule.ruleConditions
  for (var i = 0; i < ruleConditions.length; i++) {
    var $span = $temp.next().find('span').eq(i)
    if (parseInt(rule.ruleType) === 1) {
      $span.find('input[name=meetNum]').val(ruleConditions[i].meetNum)
      $span.find('input[name=sendNum]').val(ruleConditions[i].sendNum)
    } else {
      $span.find('input[name=meetMoney]').val(ruleConditions[i].meetMoney / 100)
      $span.find('input[name=sendNum]').val(ruleConditions[i].sendNum)
    }

    if (i !== ruleConditions.length - 1) {
      $span.find('input[name=_add]').trigger('click')
    }
  }

  // 3，选择赠送的商品
  $parent.find('input[name=sendType][value=' + rule.sendType + ']').trigger('click')

  if (rule.sendType !== 2) {
    require(['gift_box'], function (gift_box) {
      gift_box.showSelectList(rule.sendGifts)
    })
  } else {
    require(['gift_box2'], function (gift_box2) {
      gift_box2.showToGiftBoxForCopyOrEdit(rule.sendGifts)
      require(['core'], function (core) {
        $('#selected_gift_box').trigger('okHide')
      })
    })
  }
}

function copyDiscountRuleToNew ($parent, rule) {
  $parent = $parent.find('#discount-promotions')

  // 选择商品
  $parent.find('select[name=type]').val(rule.goodsIdsType).trigger('change')

  // 通过商品id获取相应的字段
  if (rule.goodsIds !== 'all') {
    require(['goods_box'], function (goods_box) {
      goods_box.showSelectList(rule.goodsIds)
    })
  }

  // 是否抹零
  if (rule.isMl === 1) {
    if (rule.isRound === 0)
      $parent.find('input[name=ml-radio][value=' + 3 + ']').prop('checked', true)
    else
      $parent.find('input[name=ml-radio][value=' + 1 + ']').prop('checked', true)
  } else {
    if (rule.isRound === 0)
      $parent.find('input[name=ml-radio][value=' + 4 + ']').prop('checked', true)
    else
      $parent.find('input[name=ml-radio][value=' + 2 + ']').prop('checked', true)
  }

  // 折扣具体内容
  $parent.find('input[name=rule_type][value=' + rule.ruleType + ']').trigger('click')
  var rules = rule.rules
  switch (parseInt(rule.ruleType)) {
    case 1:
      $parent.find('input[name=direct_discount]').val(rules[0].direct_discount / 10)
      if (rules[0].goods_money_limit) {
        $parent.find('input[name=discount_direct_is_limit]').prop('checked', true)
        $parent.find('input[name=goods_money_limit]').val(rules[0].goods_money_limit / 100)
      }
      break

    case 2:
      $parent = $parent.find('#discount_money')
      for (var i = 0; i < rules.length; i++) {
        var $span = $parent.find('span').eq(i)
        $span.find('input[name=meet_money]').val(rules[i].meet_money / 100)
        $span.find('input[name=discount]').val(rules[i].discount / 10)

        if (i !== rules.length - 1) {
          $span.find('input[name=_add]').trigger('click')
        }
      }

      break

    case 3:
      $parent = $parent.find('#discount_goods_num_incr')
      for (var i = 0; i < rules.length; i++) {
        var $span = $parent.find('span').eq(i)
        $span.find('input[name=meet_num]').val(rules[i].meet_num)
        $span.find('input[name=discount]').val(rules[i].discount / 10)

        if (i !== rules.length - 1) {
          $span.find('input[name=_add]').trigger('click')
        }
      }
      break

    case 4:
      $parent = $parent.find('#discount_goods_num_per')
      $parent.find('input[name=discount]').val(rules[0].discount / 10)
      if (rules[0].goods_amount_limit) {
        $parent.find('input[name=max_reduce_sign]').prop('checked', true)
        $parent.find('input[name=max_reduce]').val(rules[0].goods_amount_limit)
      }
      break

    case 5:
      require(['EGD_box'], function (EGD_box) {
        var goodsIds = []
        var temp_map = {}
        rules.forEach(function (item) {
          var tempObj = {}
          tempObj.discount = item.discount / 10
          tempObj.maxReduce = item.max_reduce / 100
          temp_map[item.goodsId.toString()] = tempObj
          goodsIds.push(item.goodsId)
        })
        EGD_box.showToEGDBoxFromGoodsIdsAndMore(goodsIds.join(','), temp_map)
        $('#each-goods-discount-box').trigger('okHide')
      })
  }
}

function showTimeRuleInPromotionsRule ($parent, promotionsRule) {
  var timeRule = JSON.parse(promotionsRule.timeRule)

  $parent.find('input[name=validity_type][value=\'' + timeRule.validity_type + '\']').trigger('click')
  switch (parseInt(timeRule.validity_type)) {
    case 1: // 绝对时间
      $parent.find('input[name=startTime]').val(timeRule.startTime.slice(0, 16))
      $parent.find('input[name=endTime]').val(timeRule.endTime.slice(0, 16))
      break
    case 2: // 按月份间隔
      var dayOfMonth = timeRule.assign_rule.split(',')
      for (var i = 0; i < dayOfMonth.length; i++) {
        $parent.find('input[name=work-date-month][value=\'' + dayOfMonth[i] + '\']').trigger('click')
      }

      if (timeRule.lastDayWork) {
        $parent.find('input[name=work-date-month-insurance]').trigger('click')
        $parent.find('input[name=insurance-day]').val(timeRule.lastDayWork)
      }
      break
    case 3: // 按星期间隔
      var dayOfWeek = timeRule.assign_rule.split(',')
      for (var i = 0; i < dayOfWeek.length; i++) {
        $parent.find('input[name=work-date-week][value=\'' + dayOfWeek[i] + '\']').trigger('click')
      }
      break
  }
}

function copyUseStores2New ($parent, promotionsRule, utils) {
  if (parseInt(promotionsRule.useStore) === 2) {
    $parent.find('input[name=\'apply_store\'][value=\'2\']').attr('checked', true)
    $('.now_area_name_store').html(promotionsRule.useArea)
    var url = 'ybArea/getProvinceIdByCityIds'
    var params = {}
    params.cityIds = promotionsRule.useArea
    utils.doGetOrPostOrJson(url, params, 'get', false, function (data) {
      if (data.code === '000') {
        var result_map = data.value
        for (var i = 0; i < result_map.check.length; i++) {
          $('#pointid_store_' + result_map.check[i]).parent().prop('class', 'checkbox-pretty inline checked')
        }
        for (var i = 0; i < result_map.halfcheck.length; i++) {
          $('#pointid_store_' + result_map.halfcheck[i]).parent().prop('class', 'checkbox-pretty inline halfchecked')
        }
      }
    })
  }else if(parseInt(promotionsRule.useStore) === 1){
    $parent.find('input[name=\'apply_store\'][value=\'1\']').attr('checked', true)
    $('input[name=__storeIds]').html(promotionsRule.useArea)
    var url = 'store/selectStoreInfoByStoreIds'
    var params = {}
    params.storeIds = promotionsRule.useArea
    utils.doGetOrPostOrJson(url, params, 'get', false, function (data) {
      if(data.code=="000"){
        var result_map = data.value;
        result_map =JSON.parse(result_map.storeList);
        var tmpl = document.getElementById('store_list_template_replay').innerHTML
        var doTtmpl = doT.template(tmpl)
        $('.select_stores_list').append(doTtmpl(result_map))
        $('.select_stores_total').html($('.select_stores_list tr').length)
      }
    })
    }
}

function isThemeActivities ($parent, promotionsActivity, showRule) {
  $parent.find('input[name=isTopicPromotions][value=' + showRule.forcePopup + ']').trigger('click')

  if (promotionsActivity.posterPic) {
    $parent.find('#windowPic').val(promotionsActivity.posterPic)
    $parent.find('#win_pic').attr('src', promotionsActivity.posterPic).show()
  }

  $parent.find('input[name=windowWay]').attr('checked', false)
  $parent.find('input[name=window1]').attr('checked', false)
  $parent.find('input[name=window2]').attr('checked', false)
  switch (parseInt(showRule.popupAtHomePage)) {
    case 0:
      $parent.find('input[name=windowWay][value=1]').attr('checked', false)
      break
    case 1:
      $parent.find('input[name=windowWay][value=1]').attr('checked', true)
      $parent.find('input[name=window1][value=1]').trigger('click')
      break
    case 2:
      $parent.find('input[name=windowWay][value=1]').attr('checked', true)
      $parent.find('input[name=window1][value=2]').trigger('click')
      break
  }

  switch (parseInt(showRule.popupWhenLogin)) {
    case 0:
      $parent.find('input[name=windowWay][value=2]').attr('checked', false)
      break
    case 1:
      $parent.find('input[name=windowWay][value=2]').attr('checked', true)
      $parent.find('input[name=window2][value=1]').trigger('click')
      break
    case 2:
      $parent.find('input[name=windowWay][value=2]').attr('checked', true)
      $parent.find('input[name=window2][value=2]').trigger('click')
      break
  }
}

function copyUseObjectToNew ($parent, promotionActivity, utils) {
  var useObject = JSON.parse(promotionActivity.useObject)
  $parent.find('input[type=radio][name=sendObj][value=' + useObject.type + ']').trigger('click')

  switch (parseInt(useObject.type)) {
    case 0: // 全部会员 doNothing
      break
    case 1: // 按指定标签组会员
      var $parent_ = $('#select_sign_member')
      useObject.promotion_members.split(',').forEach(function (item) {
        $parent_.find('#content-box-main_a #' + item).trigger('click')
      })
      $parent_.find('.select-sign-members-ok').trigger('click')
      break
    case 2: // 自定义会员
      var url = 'member/getMemberInfoByIds'

      $('#send_obj_members_direct').val(useObject.promotion_members)
      utils.doGetOrPostOrJson(url, {'ids': useObject.promotion_members}, 'get', false, function (data) {
        if (data.code === '000') {
          data.value.map(function (item) {
            var tempObj = {}
            tempObj.memberId = item.member_id
            tempObj.mobile = item.mobile
            tempObj.storName = item.name
            tempObj.registerTime = item.create_time
            tempObj.ban_status = item.ban_status
            return tempObj
          }).forEach(function (data) {
            if (!$('.select_member_list [name="memberId"][value="' + data.memberId + '"]').val()) {
              var tmpl = document.getElementById('coupon_select_members_list_templete').innerHTML
              var doTtmpl = doT.template(tmpl)
              $('.select_member_list').append(doTtmpl(data))
            }
          })
        }
      })

      break
    case 3: // 按指定标签会员
      var $parent_ = $('#select_sign_group_member')
      useObject.promotion_members.split(',').forEach(function (item) {
        $parent_.find('#content-box-main_a_group #' + item).trigger('click')
      })
      $parent_.find('.select-sign-members-ok_group').trigger('click')
      break
  }
}

function copyOrderTypeToNew ($parent, promotionsRule) {
  var orderType = promotionsRule.orderType
  var split = orderType.split(',')

  $parent.find('input[name=order_type]').attr('checked', false)
  if (split.indexOf('200') !== -1)
    $parent.find('input[name=order_type][value=\'200\']').trigger('click')
  if (split.indexOf('100') !== -1 )
    $parent.find('input[name=order_type][value=\'100\']').trigger('click')
  if(split.indexOf('300') !== -1)
    $parent.find('input[name=order_type][value=\'300\']').trigger('click')
}

function doGetOrPostOrJson (url, params, type, async, callback, failCallback) {
  var obj = {}
  obj.url = url
  obj.requestParams = params
  obj.isPost = type

  $.ajax({
    url: '/merchant/common/doGetOrPost',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(obj),
    async: async,
    success: function (data) {
      callback(data)
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      failCallback(XMLHttpRequest, textStatus, errorThrown)
    }
  })
}

function saveMyData (promotions) {
  var params = {}
  params.promotionsRule = promotions
  params.promotionsActivity = {}
  var title = $('input[name="title"]').val()
  var rules_val = $('#rules_val').val()
  var start_time = $('input[name="start_time"]').val() + ':00'
  var end_time = $('input[name="end_time"]').val() + ':59'
  var active_center = $('input[type="radio"][name="active_center"]:checked').val()
  var promotionsMould = $('#promotionsMould').val()
  var eventDesc = editor.html()
  var sendObj = $('input[type="radio"][name="sendObj"]:checked').val()
  var signMembers = {}
   //是否独立
  var is_independent = $("input[name=is_independent]:checked").val()
  params.promotionsActivity.isIndependent=is_independent;
  // 使用限制
  var can_use_coupon = $("input[name=can_use_coupon]:checked").val()
  params.promotionsActivity.canUseCoupon=can_use_coupon;
  if (sendObj == 1) {
    var sign_members_info = $('#send_obj_members').val()
    if (typeof  sign_members_info == 'undefined' || sign_members_info == '') {
      layer.msg('请选择具体的标签')
      return false
    } else {
      signMembers.type = 1
      signMembers.promotion_members = $('#send_obj_members').val()
      params.promotionsActivity.signMermbers = signMembers
    }
  } else if (sendObj == 2) {
    var direct_members_info = $('#send_obj_members_direct').val()
    if (typeof  direct_members_info == 'undefined' || direct_members_info == '') {
      layer.msg('请至少自定义一位会员')
      return false
    } else {
      signMembers.type = 2
      signMembers.promotion_members = $('#send_obj_members_direct').val()
      params.promotionsActivity.signMermbers = signMembers
    }
  } else if (sendObj == 3) {
    var sign_members_info_group = $('#send_obj_members_group').val()
    if (typeof  sign_members_info_group == 'undefined' || sign_members_info_group == '') {
      layer.msg('请选择具体的标签')
      return false
    } else {
      signMembers.type = 3
      signMembers.promotion_members = $('#send_obj_members_group').val()
      params.promotionsActivity.signMermbers = signMembers
    }
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

  if (title == '' || title.trim().length == 0) {
    layer.msg('活动标题不能为空')
    return false
  }
  if (rules_val == '' && active_link == '') {
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
    return false
  }

  if (active_center == 1) {
    if (promotionsMould == '') {
      layer.msg('请选择活动海报')
      return false
    }
  }
  if (getQueryString('mark') == 'otherLink') {
    if (typeof ($('#control_window').find('input[name=isTopicPromotions]:checked').val()) == 'undefined') {
      layer.msg('请选择具体弹窗类型')
      return false
    }
  }

  if (getQueryString('mark') == 'otherLink') {
    var active_link = $('input[name="linkweb"]').val()
    if (active_link == null || active_link == '') {
      layer.msg('请输入链接地址')
      return false
    }
    if (IsURL(active_link) == false) {
      layer.msg('请输入正确的http://网址！')
      return false
    }
  }

  if (eventDesc == '' || eventDesc.trim().length == 0) {
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
  params.promotionsActivity.active_link = active_link
  params.promotionsActivity.title = title
  params.promotionsActivity.promotionsId = rules_val
  params.promotionsActivity.startTime = start_time
  params.promotionsActivity.endTime = end_time
  params.promotionsActivity.templatePic = promotionsMould
  params.promotionsActivity.intro = eventDesc
  params.promotionsActivity.posterPic = windowPic
  params.promotionsActivity.showRule = JSON.stringify(showRule)
  params.promotionsActivity.useObject = JSON.stringify(signMembers)
  if (sendObj == 0) {
    params.promotionsActivity.useObject = '{"type":0,"promotion_members":""}'
  }
  var param = params

  return param
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
            $tr_.find('td').eq(2).html(useNum)
            //$tr_.find('td').eq(3).html(useNum)
          }
        }
      } else {
        layer.msg('接收异步生成总数失败')
      }
    })
  }
}

function insertHideDataToPage (data, Activity_create_res, Activity_res) {
  $('input[name=promotions_type]').val(Activity_create_res.promotionsType)
  $('input[name=promotionsRuleId]').val(Activity_res.promotionsId)
  $('input[name=isRelease]').val(data.value.isRelease)
  if (Activity_create_res.promotionsType == 10
    || Activity_create_res.promotionsType == 30
    || Activity_create_res.promotionsType == 50
    || Activity_create_res.promotionsType == 60) {
    $('input[name=ruleType]').val(1)
  }
}

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

function changeKey () {
  if ($('#control_window1').is(':checked')) {
    $('input[name=isTopicPromotions]').eq(0).removeAttr('checked').attr('disabled', 'disabled')
  }

  if ($('#control_window2').is(':checked')) {
    $('input[name=isTopicPromotions]').eq(0).removeAttr('disabled').attr('checked')
  }

  $('#control_window1').live('click', function () {
    if ($('#control_window1').is(':checked')) {
      $('input[name=isTopicPromotions]').eq(0).removeAttr('checked').attr('disabled', 'disabled')
    }

    if ($('#control_window2').is(':checked')) {
      $('input[name=isTopicPromotions]').eq(0).removeAttr('disabled').attr('checked')
    }
  })

  $('#control_window2').live('click', function () {
    if ($('#control_window1').is(':checked')) {
      $('input[name=isTopicPromotions]').eq(0).removeAttr('checked').attr('disabled', 'disabled')
    }

    if ($('#control_window2').is(':checked')) {
      $('input[name=isTopicPromotions]').eq(0).removeAttr('disabled').attr('checked')
    }
  })
}

function getQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

function IsURL (str_url) {
/*
  var strRegex = /^([hH][tT]{2}[pP]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
*/
  var strRegex = /^([hH][tT]{2}[Pp][sS]*):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?$/;
  var re = new RegExp(strRegex)
  if (re.test(str_url)) {
    return (true)
  } else {
    return (false)
  }
}




