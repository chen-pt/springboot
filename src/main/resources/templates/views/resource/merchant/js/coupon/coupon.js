/**
 * Created by Administrator on 2017/3/12.。
 */

define(['core'], function (core) {

    var coupon = {}
    coupon.much_coupon_list_pageno = 1
    coupon.much_coupon_cur_per_page = 100
    coupon.pageno = 1
    coupon.cur_per_page = 15

    /**
     * 获取优惠券列表
     */
    coupon.getCouponList = function () {

      var create_btime = $('#start_time').val()
      var create_etime = $('#end_time').val()

      var coupon_type = $('#couponType :selected').val()
      var url = core.getHost() + '/merchant/promotions/promRuleList'

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
      datas.pageNum = coupon.pageno
      datas.pageSize = coupon.cur_per_page

      if ($('input[name="coupon_name"]').val() != '') {
        datas.proRuleName = $('input[name="coupon_name"]').val()
      }

      if (parseInt($('#status :selected').val()) >= 0) {
        datas.status = parseInt($('#status :selected').val())
      }

      $.ajax({
        type: 'post',
        url: '/merchant/promotions/promRuleList',
        data: datas,
        dataType: 'json',
        success: function (data) {

          if (data.code == '000') {
            core.formatDate()
            $.each(data.value.list, function (i, v) {
              data.value.list[i].createTime = new Date(v.createTime).format()
            })

            console.log("coupon.getCouponList")
            console.log(data)

            $('#coupon_table').empty()
            var tmpl = document.getElementById('coupon_list_templete').innerHTML
            var doTtmpl = doT.template(tmpl)
            $('#coupon_table').html(doTtmpl(data))

            getUsedNumAndUnusedNumAsync()

            var pages = Math.ceil(data.value.total / data.value.pageSize)
            $('#pageinfo').pagination({
              pages: pages,
              styleClass: ['pagination-large'],
              showCtrl: true,
              displayPage: 6,
              currentPage: coupon.pageno,
              onSelect: function (num) {
                coupon.pageno = num
                coupon.getCouponList()
              }
            })

            $('#pageinfo').find('span:contains(共)').append('(' + data.value.total + '条记录)')
            $('#pageinfo').find('span:contains(共)').prepend('<select class=\'page_size_select\' style=\'width: 40px !important;\'><option value=\'15\'>15</option><option value=\'30\'>30</option><option value=\'50\'>50</option><option value=\'100\'>100</option></select>')
            $('.page_size_select').find('option[value=' + coupon.cur_per_page + ']').attr('selected', true)
          }
        }
      })
    }

  /**
   * 清除字符串中多余的分隔符
   *
   * @param value
   * @param separator
   */
  function clearSeparator (value, separator) {
    if (!separator) separator = ','
    if (value) {
      var split = value.split(separator)
      var result = []
      for (var i = 0; i < split.length; i++) {
        if (split[i]) result.push(split[i])
      }

      return result.join(separator)
    }
  }
    coupon.saveCoupon = function () {
      var params = {}

      //-----------公共参数部分。
      params.markedWords = $('input[name=\'markedWords\']').val()
      if (params.markedWords == '') {
        layer.msg('优惠标签不能为空')
        return false
      }

      var ruleName = $('input[name=\'ruleName\']').val()

      params.ruleName = ruleName ? ruleName : params.markedWords
      params.ruleId = $('input[name=ruleId]').val()
      params.status = $('input[name=status]').val()
      params.siteId = $('input[name=siteId]').val()

        if ($('#coupon_type').children('.tab-pane').hasClass('active')) {
            var parent = $('#' + $('#coupon_type').children('.active').attr('id'))
            params.couponType = parseInt(parent.find('input[name="couponType"]').val())  //100现金券  200打折券  300限价券  400包邮券

            if (params.couponType == 100 || params.couponType == 200) {
                if (parent.children('.tab-content').children('.tab-pane').hasClass('active')) {
                    var parent_type = parent.children('.tab-content').children('.active')
                    var this_radio = parent_type.find('input[name="Rule_type"]:checked')
                    var rule_type = parent_type.find('input[name="Rule_type"]:checked').val()

                    var rule = {}
                    var orderRule = {}
                    var goodsRule = {}
                    var numArr = ['first', 'second', 'third', 'fourth', 'fifth']
                    var money_pattern = new RegExp(/^[0-9]{1,4}(\.{1}[0-9]{1,9})*$/)

                    var locationMsg = ''
                    var ruleAndMsg = {}
                    var msgArr = []
                    // 现金券
                    if (params.couponType == 100) {  //现金券
                        //rule_type 0订单实付金额立减 1每满多少减多少（现金券）  2满多少减多少(元) 3蛮多少减多少（件）  4包邮
                        var $date = $('#cash-coupon-goods').find('input[type=text]')
                        console.log($date.length)
                        for (var i = 0; i < $date.length; i++) {
                            console.log($($date[i]).val())
                            var verifyResult = verifyOrElseMsg($($date[i]).val(), /^((0+)|(0+\.0+))$/, '不能为0')
                            if (!verifyResult) return
                        }

                        // 现金券 按订单计算
                        if (parent_type.attr('id') == 'cash-coupon-order') {  //现金券按订单
                            if (rule_type == 0) { //订单实付金额，直接减
                                var direct_money = this_radio.siblings('input[name="direct_money"]').val()

                                if (!money_pattern.test(direct_money)) {
                                    layer.msg('金额格式不正确')
                                    return
                                }
                                if (!(direct_money > 0)) {
                                    layer.msg('金额必须大于0')
                                    return
                                }

                                rule.direct_money = Math.floor(direct_money * 100) / 100 * 100
                                orderRule.rule_type = 0
                                goodsRule.rule_type = 0

                                if (rule.direct_money === '') {
                                    layer.msg('立减金额不能为空')
                                    return
                                }
                            } else if (rule_type == 1) {  //订单每满多少减多少
                                orderRule.rule_type = 1
                                rule.each_full_money = Math.floor(this_radio.siblings('input[name="each_full_money"]').val() * 100) / 100 * 100
                                rule.reduce_price = Math.floor(this_radio.siblings('input[name="reduce_price"]').val() * 100) / 100 * 100

                                if (rule.each_full_money === '' || rule.reduce_price == '') {
                                    layer.msg('优惠规则不能为空')
                                    return
                                }

                                if (typeof this_radio.siblings('input[name="max_reduce_checkbox"]:checked').val() != 'undefined') {
                                    // rule.max_reduce = parseFloat(this_radio.siblings('input[name="max_reduce"]').val())*100;
                                    rule.max_reduce = Math.floor(this_radio.siblings('input[name="max_reduce"]').val() * 100) / 100 * 100
                                    if (rule.max_reduce == '') {
                                        layer.msg('封顶金额不能为空')
                                        return
                                    }
                                }
                            } else if (rule_type == 2) {  //订单满金额减金额
                                orderRule.rule_type = 2

                                if ($('#cash_order_moneyRules').find('[name="meet_money_first"]').val() == '' || $('#cash_order_moneyRules').find('[name="reduce_price_first"]').val() == '') {
                                    layer.msg('满足金额和立减金额不能为空')
                                    return
                                }
                                var is_bogger = true
                                $.each($('#cash_order_moneyRules').find('.meet_money'), function (k, v) {
                                    if ($(this).find('[name="meet_money_first"]').val() && $(this).find('[name="reduce_price_first"]').val()) {
                                        rule['meet_money_' + numArr[k]] = parseFloat($(this).find('[name="meet_money_first"]').val()) * 100
                                        if (k > 0 && (rule['meet_money_' + numArr[k]] <= rule['meet_money_' + numArr[k - 1]])) {
                                            is_bogger = false
                                            return false
                                        }
                                        rule['reduce_price_' + numArr[k]] = parseFloat($(this).find('[name="reduce_price_first"]').val()) * 100
                                        if (k > 0 && (rule['reduce_price_' + numArr[k]] <= rule['reduce_price_' + numArr[k - 1]])) {
                                            is_bogger = false
                                            return false
                                        }
                                    } else {
                                        is_bogger = false
                                        return false
                                    }
                                })

                                if (!is_bogger) {
                                    layer.msg('订单优惠金额或立减金额不正确')
                                    return
                                }
                            } else if (rule_type == 3) {  //订单满件减金额
                                orderRule.rule_type = 3

                                if ($('#cash_order_numRules').find('[name="meet_num_first"]').val() == '' || $('#cash_order_numRules').find('[name="reduce_price_first"]').val() == '') {
                                    layer.msg('满购件数和立减金额不能为空')
                                    return
                                }
                                var is_bogger = true

                                $.each($('#cash_order_numRules').find('.meet_num'), function (k, v) {
                                    if ($(this).find('[name="meet_num_first"]').val() && $(this).find('[name="reduce_price_first"]').val()) {
                                        rule['meet_num_' + numArr[k]] = $(this).find('[name="meet_num_first"]').val()
                                        if (k > 0 && (rule['meet_num_' + numArr[k]] <= rule['meet_num_' + numArr[k - 1]])) {
                                            is_bogger = false
                                            return false
                                        }

                                        rule['reduce_price_' + numArr[k]] = parseFloat($(this).find('[name="reduce_price_first"]').val()) * 100
                                        if (k > 0 && (rule['reduce_price_' + numArr[k]] <= rule['reduce_price_' + numArr[k - 1]])) {
                                            is_bogger = false
                                            return false
                                        }
                                    } else {
                                        is_bogger = false
                                        return false
                                    }
                                })
                                if (!is_bogger) {
                                    layer.msg('订单满足数量与优惠金额必须递增')
                                    return
                                }
                            } else {
                                layer.msg('订单优惠类型不能为空')
                                return
                            }
                            params.aimAt = 0
                            orderRule.rule = rule
                            params.orderRule = orderRule
                        }

                        // 现金券 按商品计算
                        if (parent_type.attr('id') == 'cash-coupon-goods') {
                            var $cash_coupon_goods = $('#cash-coupon-goods')
                            params.aimAt = 1

                            /* -- 指定商品参加 开始 -- */
                            /**
                             * 0 -> 全部商品参加
                             * 2 -> 指定商品参加
                             * 3 -> 指定商品不参加
                             */
                            var type = $cash_coupon_goods.find('select[name="type"] option:selected').val()
                            switch (type) {
                                case '0':
                                    goodsRule.promotion_goods = 'all'
                                    break
                                case '2':
                                case '3':
                                    var coupon_limit_type = $cash_coupon_goods.find('input[name="cash_coupon_limit_type"]:checked').val()

                                    if (coupon_limit_type == '0') { // 按商品
                                        goodsRule.promotion_goods = $('input[name="much_select_goods_id"]').val()
                                    } else if (coupon_limit_type == '3') { // 按分类（还没实行）
                                        goodsRule.promotion_goods = $cash_coupon_goods.find('input[name=add_classify]').val()
                                    }

                                    if (!goodsRule.promotion_goods) {
                                        layer.msg('商品或类目不能为空')
                                        return
                                    }
                                    break
                            }
                            /* -- 指定商品参加 结束 -- */

                            if (rule_type == 0) { // 商品每满多少减多少
                                goodsRule.rule_type = 0
                                var $temp_parent = $('#cash_goods_every_money')
                                locationMsg = '每满多少元件多少元（按比例）中'

                                var each_full_money = $temp_parent.children('input[name=each_full_money]').val()
                                var reduce_price = $temp_parent.children('input[name=reduce_price]').val()
                                var max_reduce_checkbox = $temp_parent.children('input[name=max_reduce_checkbox]').is(':checked')
                                var max_reduce = $temp_parent.children('input[name=max_reduce]').val()
                                // var is_post = $temp_parent.children('input[name=contains_postage_checkbox]').is(':checked')
                                var is_post = 0 //不包邮

                                /* -- 计算满足金额和满减金额 开始 -- */
                                if (!each_full_money) {
                                    layer.msg(locationMsg + '满足金额不能为空')
                                    return
                                }

                                if (!reduce_price) {
                                    layer.msg(locationMsg + '满减金额不能为空')
                                    return
                                }

                                if ((reduce_price * 1000 / 10) > (each_full_money * 1000 / 10)) {
                                    layer.msg(locationMsg + '满减金额不能大于满足金额')
                                    return
                                }

                                if (!money_pattern.test(each_full_money) || !money_pattern.test(reduce_price)) {
                                    layer.msg(locationMsg + '满足金额或立减金额格式不正确')
                                    return
                                }

                                rule.each_full_money = each_full_money * 1000 / 10
                                rule.reduce_price = reduce_price * 1000 / 10
                                /* -- 计算满足金额和满减金额 结束 -- */

                                /* -- 封顶金额计算 开始 -- */
                                if (max_reduce_checkbox) {
                                    if (!max_reduce) {
                                        layer.msg(locationMsg + '封顶金额不能为空')
                                        return
                                    }

                                    if ((max_reduce * 1000 / 10) < (reduce_price * 1000 / 10)) {
                                        layer.msg(locationMsg + '封顶金额不能小于满减金额')
                                        return
                                    }

                                    if (!money_pattern.test(max_reduce)) {
                                        layer.msg(locationMsg + '封顶金额格式不正确')
                                        return
                                    }

                                    rule.max_reduce = max_reduce * 1000 / 10
                                } else {
                                    rule.max_reduce = 0
                                }
                                /* -- 封顶金额计算 结束 -- */

                                // 运费
                              goodsRule.is_post = 0
                                /*if (is_post) {
                                    goodsRule.is_post = 1
                                } else {
                                    goodsRule.is_post = 0
                                }*/
                            } else if (rule_type == 1) {  //商品满金额减金额
                                goodsRule.rule_type = 1
                                if ($('#cash_good_moneyRules').find('[name="meet_money_first"]').val() == '' || $('#cash_good_moneyRules').find('[name="reduce_price_first"]').val() == '') {
                                    layer.msg('满足金额和立减金额不能为空')
                                    return
                                }
                                var is_bogger = true

                                $.each($('#cash_good_moneyRules').find('.meet_money'), function (k, v) {

                                    if ($(this).find('[name="meet_money_first"]').val() && $(this).find('[name="reduce_price_first"]').val()) {
                                        rule['meet_money_' + numArr[k]] = parseFloat($(this).find('[name="meet_money_first"]').val()) * 100

                                        if (k > 0 && (rule['meet_money_' + numArr[k]] <= rule['meet_money_' + numArr[k - 1]])) {
                                            is_bogger = false
                                            return false
                                        }
                                        rule['reduce_price_' + numArr[k]] = parseFloat($(this).find('[name="reduce_price_first"]').val()) * 100
                                        if (k > 0 && (rule['reduce_price_' + numArr[k]] <= rule['reduce_price_' + numArr[k - 1]])) {
                                            is_bogger = false
                                            return false
                                        }
                                    } else {
                                        is_bogger = false
                                        return false
                                    }

                                })
                                if (!is_bogger) {
                                    layer.msg('商品满足金额或立减金额必需递增')
                                    return
                                }

                            } else if (rule_type == 2) { //商品满件减金额
                                goodsRule.rule_type = 2

                                if ($('#cash_good_numRules').find('[name="meet_money_first"]').val() == '' || $('#cash_good_numRules').find('[name="reduce_price_first"]').val() == '') {
                                    layer.msg('满足金额和立减金额不能为空')
                                    return
                                }
                                var is_bogger = true
                                $.each($('#cash_good_numRules').find('.meet_num'), function (k, v) {
                                    if ($(this).find('[name="meet_num_first"]').val() && $(this).find('[name="reduce_price_first"]').val()) {

                                        rule['meet_num_' + numArr[k]] = parseInt($(this).find('[name="meet_num_first"]').val())

                                        if (k > 0 && (rule['meet_num_' + numArr[k]] <= rule['meet_num_' + numArr[k - 1]])) {
                                            is_bogger = false
                                            return false
                                        }

                                        rule['reduce_price_' + numArr[k]] = parseFloat($(this).find('[name="reduce_price_first"]').val()) * 100
                                        if (rule['reduce_price_' + numArr[k]] <= rule['reduce_price_' + numArr[k - 1]]) {
                                            is_bogger = false
                                            return
                                        }
                                    } else {
                                        is_bogger = false
                                        return false
                                    }

                                })
                                if (!is_bogger) {
                                    layer.msg('商品优满足数量或优惠金额必须递增')
                                    return
                                }
                            } else if (rule_type == 4) {
                                goodsRule.rule_type = 4
                                goodsRule.is_post = 0

                                locationMsg = '有就减多少元中'

                                var $direct_money = $('#cash_goods_direct').find('input[name=direct_money]')
                                var direct_money = $direct_money.val()
                                if (!direct_money) {
                                    layer.msg(locationMsg + '优惠金额不能为空')
                                    $direct_money.trigger('focus')
                                    return
                                } else if (!money_pattern.test(direct_money)) {
                                    layer.msg(locationMsg + '优惠金额格式不正确')
                                    $direct_money.trigger('focus')
                                    return
                                }

                                rule.direct_money = (this_radio.siblings('input[name="direct_money"]').val()) * 1000 / 10
                            } else if (rule_type == 5) {
                                goodsRule.is_post = 0
                                goodsRule.rule_type = 1

                                locationMsg = '现金券满多少元减多少元（自定义）中'

                                ruleAndMsg.rule0 = /\d/
                                ruleAndMsg.msg0 = locationMsg + '金额格式不正确'
                                ruleAndMsg.rule1 = /\d/
                                ruleAndMsg.msg1 = locationMsg + '金额格式不正确'

                                msgArr[0] = locationMsg + '每行数据请填写完整'
                                msgArr[1] = locationMsg + '每行输入中的满多少元请从小到大递增'
                                msgArr[2] = locationMsg + '每行输入中的减多少元请从小到大递增'
                                msgArr[3] = locationMsg + '每行填入的数据'
                                var ruleArr = getLadderRule('#cash_goods_every_money_ladder', ruleAndMsg, msgArr, 1)
                                if (!ruleArr) return

                                rule = new Array()
                                for (var i = 0; i < ruleArr.length; i++) {
                                    rule[i] = {}
                                    rule[i].meet_money = ruleArr[i].param0 * 1000 / 10
                                    rule[i].reduce_price = ruleArr[i].param1 * 1000 / 10
                                    rule[i].ladder = i + 1

                                    // 先赋值后判断是因为ruleArr中 meet_money/reduce_price 的类型有可能是字符串类型的，而rule里面的则肯定是数字类型
                                    if (rule[i].meet_money < rule[i].reduce_price) {
                                        layer.msg(locationMsg + '满减金额不能大于满足金额')
                                        $('#cash_goods_every_money_ladder > p').eq(i).find('input[type=text]').eq(1).trigger('focus')
                                        return
                                    }
                                }
                            } else {
                                layer.msg('商品优惠类型不能为空')
                                return
                            }

                            goodsRule.type = type
                            goodsRule.rule = rule
                            params.goodsRule = goodsRule
                        }

                        if (!params.hasOwnProperty('orderRule') && !params.hasOwnProperty('goodsRule')) {
                            layer.msg('请选择一种优惠类型')
                            return
                        }

                        if (params.hasOwnProperty('orderRule')) {
                            if (!params.orderRule.hasOwnProperty('rule_type')) {
                                layer.msg('订单优惠类型不能为空')
                                return
                            }
                        } else if (params.hasOwnProperty('goodsRule')) {
                            if (!params.goodsRule.hasOwnProperty('rule_type')) {
                                layer.msg('商品惠类型不能为空')
                                return
                            }
                        }
                    }

                    // 打折券
                    if (params.couponType == 200) {
                        // 打折券 按订单计算
                        if (parent_type.attr('id') == 'discount-coupon-order') {
                            // （折扣券 按订单）已经废弃 字段也已经变更 所以代码删除
                        }

                        // 打折券 按商品计算
                        if (parent_type.attr('id') == 'discount-coupon-goods') {
                            var $discount_coupon_goods = $('#discount-coupon-goods')

                            params.aimAt = 1
                            goodsRule.is_ml = $discount_coupon_goods.find('input[name=is_ml]').val()
                            goodsRule.is_round = $discount_coupon_goods.find('input[name=is_round]').val()

                            if (!goodsRule.is_ml || !goodsRule.is_round) {
                                layer.msg('请填写抹零设置！')
                                scrollTop('#discount-coupon-ml-radio')
                                $('#discount-coupon-ml-radio').children('div').css('display', 'block')
                                return
                            }

                            /* -- 指定商品参加 开始 -- */
                            /**
                             * 0 -> 全部商品参加
                             * 2 -> 指定商品参加
                             * 3 -> 指定商品不参加
                             */
                            var type = $discount_coupon_goods.find('select[name="type"] option:selected').val()
                            switch (type) {
                                case '0':
                                    goodsRule.promotion_goods = 'all'
                                    break
                                case '2':
                                case '3':
                                    var coupon_limit_type = $('input[name="discount_coupon_limit_type"]:checked').val()

                                    if (coupon_limit_type == '0') { // 按商品
                                        goodsRule.promotion_goods = $('input[name="much_select_goods_id"]').val()
                                    } else if (coupon_limit_type == '3') { // 按分类（还没实行）
                                        goodsRule.promotion_goods = $discount_coupon_goods.find('input[name=add_classify]').val()
                                    }

                                    if (!goodsRule.promotion_goods) {
                                        layer.msg('商品或类目不能为空')
                                        return
                                    }

                                    break
                            }
                            /* -- 指定商品参加 结束 -- */

                            if (rule_type == 1) {
                                /* -- 满多少元折多少（阶梯式） 开始 -- */
                                goodsRule.rule_type = 1

                                locationMsg = '打折券满多少元打多少折中'
                                ruleAndMsg.rule0 = /\d/
                                ruleAndMsg.msg0 = locationMsg + '金额只能输入整数数字'
                                ruleAndMsg.rule1 = /^(0\.[1-9]|[1-9](\.|\.[0-9])?)$/
                                ruleAndMsg.msg1 = locationMsg + '折扣请输入0.1~9.9'

                                msgArr[0] = locationMsg + '每行数据请填写完整'
                                msgArr[1] = locationMsg + '每行输入中的满多少元请从小到大递增'
                                msgArr[2] = locationMsg + '每行输入中的打多少折请从大到小递减'
                                msgArr[3] = locationMsg + '每行填入的数据'
                                var ruleArr = getLadderRule('#discount_goods_money', ruleAndMsg, msgArr, 2)
                                if (!ruleArr) return

                                rule = new Array()
                                for (var i = 0; i < ruleArr.length; i++) {
                                    rule[i] = {}
                                    rule[i].meet_money = ruleArr[i].param0 * 1000 / 10
                                    rule[i].discount = ruleArr[i].param1 * 10
                                    rule[i].ladder = i + 1
                                }
                              goodsRule.is_post = 0//不包邮
                                // 是否含邮费
                                /*if ($('input[name=discount_goods_money_has_post]').is(':checked')) {
                                    goodsRule.is_post = 1
                                } else {
                                    goodsRule.is_post = 0
                                }*/
                                /* -- 满多少元折多少（阶梯式） 结束 -- */

                            } else if (rule_type == 2) {
                                /* -- 满多少件折多少（阶梯式） 开始 -- */
                                goodsRule.rule_type = 2
                                goodsRule.is_post = 0

                                locationMsg = '打折券满多少件打多少折中'
                                ruleAndMsg.rule0 = /\d/
                                ruleAndMsg.msg0 = locationMsg + '数量只能输入整数数字'
                                ruleAndMsg.rule1 = /^(0\.[1-9]|[1-9](\.|\.[0-9])?)$/
                                ruleAndMsg.msg1 = locationMsg + '折扣请输入0.1~9.9'

                                msgArr[0] = locationMsg + '每行数据请填写完整'
                                msgArr[1] = locationMsg + '每行输入中的满多少件请从小到大递增'
                                msgArr[2] = locationMsg + '每行输入中的打多少折请从大到小递减'
                                msgArr[3] = locationMsg + '每行填入的数据'
                                var ruleArr = getLadderRule('#discount_goods_num', ruleAndMsg, msgArr, 2)
                                if (!ruleArr) return

                                rule = new Array()
                                for (var i = 0; i < ruleArr.length; i++) {
                                    rule[i] = {}
                                    rule[i].meet_num = ruleArr[i].param0
                                    rule[i].discount = ruleArr[i].param1 * 10
                                    rule[i].ladder = i + 1
                                }
                                /* -- 满多少件折多少（阶梯式） 结束 -- */

                            } else if (rule_type == 4) {
                                /* -- 立折多少 开始 -- */
                                goodsRule.rule_type = 4
                                goodsRule.is_post = 0

                                locationMsg = '设置打折比率（直接打折）中'
                                msgArr[0] = locationMsg + '折扣额度不能为空'
                                msgArr[1] = locationMsg + '封顶金额不能为空'
                                msgArr[2] = locationMsg + '输入数值'
                                var result_ = getDiscountWithTop('#discount_goods_direct_main',
                                    /^(0\.[1-9]|[1-9](\.|\.[0-9])?)$/, '打多少折只支持一位小数，在0.1~9.9之间，8.5折即为原价的85%',
                                    /\d/, '请输入正确的金额格式',
                                    msgArr)
                                if (!result_) return

                                rule.direct_discount = result_.discount
                                rule.max_reduce = result_.top * 1000 / 10
                                /* -- 立折多少 结束 -- */

                            } else if (rule_type == 5) {
                                /* -- 第二件打折 开始 by ztq -- */
                                goodsRule.rule_type = 5
                                goodsRule.is_post = 0

                                locationMsg = '第二件打折中'
                                msgArr[0] = locationMsg + '折扣额度不能为空'
                                msgArr[1] = locationMsg + '封顶件数不能为空'
                                msgArr[2] = locationMsg + '输入数值'
                                var result_ = getDiscountWithTop('#discount_goods_num_per',
                                    /^(0\.[1-9]|[1-9](\.|\.[0-9])?)$/, '打多少折只支持一位小数，在0.1~9.9之间，8.5折即为原价的85%',
                                    /\d/, '请按正确的封顶0数量格式输入',
                                    msgArr)
                                if (!result_) return

                                rule.discount = result_.discount
                                rule.how_piece = 2
                                rule.max_buy_num = Number(result_.top)
                                /* -- 第二件打折 结束 by ztq -- */

                            } else {
                                layer.msg('订单优惠类型不能为空')
                                return
                            }

                            goodsRule.type = type
                            goodsRule.rule = rule
                            params.goodsRule = goodsRule
                        }
                    }

                    if (!params.hasOwnProperty('orderRule') && !params.hasOwnProperty('goodsRule')) {
                        layer.msg('请选择一种优惠类型')
                        return
                    }

                    if (params.hasOwnProperty('orderRule')) {
                        if (!params.orderRule.hasOwnProperty('rule_type')) {
                            layer.msg('订单优惠类型不能为空')
                            return
                        }

                    } else if (params.hasOwnProperty('goodsRule')) {
                        if (!params.goodsRule.hasOwnProperty('rule_type')) {
                            layer.msg('商品优惠类型不能为空')
                            return
                        }
                    }
                } else {
                    layer.msg('请创建优惠规则')
                    return
                }
            }

            else if (params.couponType == 300) {  //限价券
                var rule = {}
                var goodsRule = {}
                rule.each_goods_price = parseFloat($('input[name="each_goods_price"]').val()) * 1000/10
                rule.buy_num_max = $('input[name="buy_num_max"]').val()
                rule.each_goods_max_buy_num = $('input[name="each_goods_max_buy_num"]').val()
                if (Number(rule.each_goods_max_buy_num) < Number(rule.buy_num_max)) {
                    layer.msg('每件商品总计必须大于每次最多购买的件数')
                    return
                }
                if (rule.each_goods_price == '') {
                    layer.msg('请填写每个商品限价')
                    return
                }
                if (rule.buy_num_max == '') {
                    layer.msg('请填写每个商品件数')
                    return
                }
                if (rule.each_goods_max_buy_num == '') {
                    layer.msg('请填写每件商品总计购买')
                    return
                }
                if ($('input[name=much_select_goods_id]').val() == '') {
                    layer.msg('请选择商品')
                    return false
                }

                var goodsRule = {}
                goodsRule.promotion_goods = $('input[name="much_select_goods_id"]').val()
                goodsRule.type = $('#typeRule').find('option:selected').val()
                goodsRule.rule_type = 3
                goodsRule.rule = rule

                params.goodsRule = goodsRule
                params.aimAt = 1
            }

            else if (params.couponType == 400) { //包邮券
                var areaRule = {}
                var post_meet_money = $('#free-shipping-coupon').find('[name="post_meet_money"]:checked').val()

                if (typeof post_meet_money == 'undefined' || post_meet_money == '') {
                    layer.msg('请先选择包邮条件')
                    return
                }

                var rule = {}
                var orderRule = {}
                var order_rule = {}
                orderRule.rule_type = 4

                if (parseInt(post_meet_money) == 1) {  //money
                    order_full_money = $('input[name="order_full_money"]').val()
                    console.log(money_pattern.test(order_full_money))
                    if (order_full_money == '' || !patt.test(order_full_money)) {
                        layer.msg('包邮金额格式不正确')
                        return
                    }
                    order_rule.order_full_money = parseFloat(order_full_money) * 100

                    var full_monty_status = $('input[name="order_full_money_status"]:checked').val() // 是否封顶

                    if (typeof full_monty_status != 'undefined' && parseInt(full_monty_status) == 1) {
                        order_rule.order_full_money_post_max = $('input[name="order_full_money_status"]:checked').siblings('input[name="order_full_money"]').val() * 100
                    }

                } else if (parseInt(post_meet_money) == 2) {  //num
                    order_full_num = $('input[name="order_full_num"]').val()
                    if (order_full_num == '' || !patt.test(order_full_num)) {
                        layer.msg('包邮数量格式不正确')
                        return
                    }
                    order_rule.order_full_num = order_full_num
                    var full_num_status = $('input[name="order_full_num_post_max_status"]:checked').val()
                    if (typeof full_num_status != 'undefined' && parseInt(full_num_status) == 1) {
                        order_rule.order_full_num_post_max = $('input[name="order_full_num_post_max_status"]:checked').siblings('input[name="order_full_num_post_max"]').val()
                    }
                }

                areaRule.post_area = $('input[name="post_area"]:checked').val()  //0:包邮区域  1：不包邮区域

                if (typeof areaRule.post_area == 'undefined') {
                    layer.msg('请先确定是否包邮')
                    return false
                }

                if ($('input[name="post_area"]:checked').next('[name="free_city_area_id"]').val() == '') {
                    layer.msg('大区未选')
                    return
                }

                rule.province_ids = $('input[name="post_area"]:checked').next('[name="free_city_area_id"]').val()

                areaRule.rule = rule
                orderRule.rule = order_rule
                params.orderRule = orderRule
                params.areaRule = areaRule
                params.aimAt = 0
            }

            else if (params.couponType == 500) {
              var rule_ = {}
              var $parent = $("#gift-coupon");

              // 1、选择购买商品及组合方式：
              var calculateBase = $parent.find("input[name=calculateBase]:checked").val()
              if (!calculateBase) {
                layer.msg("请选择购买商品及组合方式")
                return
              }
              rule_.gift_calculate_base = parseInt(calculateBase)

              rule_.type = 2
              var goodsIds = $("input[name=much_select_goods_id]").val()
              if (!goodsIds) {
                layer.msg("请选择商品")
                return
              }
              rule_.promotion_goods = goodsIds

              // 2、设置赠送条件：
              var ruleType = $parent.find("input[name=ruleType]:checked").val()
              if (!ruleType) {
                layer.msg("请选择赠送条件")
                return
              }
              rule_.rule_type = ruleType

              var giftCondition = getGiftCondition(ruleType, $parent)
              if (typeof(giftCondition) === "string") {
                layer.msg(giftCondition)
                return
              }
              rule_.rule = giftCondition

              var sendType = $parent.find("input[name=sendType]").val()
              if (!sendType) {
                layer.msg("请选择赠送商品的方式")
                return
              }
              rule_.gift_send_type = sendType

              var giftIdAndNumArr = $("input[name=giftIdAndNumArr]").val()
              if (!giftIdAndNumArr) {
                layer.msg("请选择赠品")
                return
              }
              var giftIdAndNumArr_ = JSON.parse(giftIdAndNumArr)
              for (var i = 0; i < giftIdAndNumArr_.length; i++)
                giftIdAndNumArr_[i].total = giftIdAndNumArr_[i].sendNum

              rule_.gift_storage = giftIdAndNumArr_

              params.goodsRule = rule_
              params.aimAt = 1
            } else {
              layer.msg("不可能出现的错误")
              return
            }

            //-------数量规则
            var amount = $('input[name="amount"]:checked').val()

            if (typeof (amount) == 'undefined') {
                layer.msg('是否限量')
                return false
            }
            if (amount == -1) {
                params.amount = -1
            } else {
                var amount = $('input[name="amount"]:checked').siblings('input[name="amount_val"]').val()
                var pattern = new RegExp(/^[1-9]{1}[0-9]*$/)

                if (!pattern.test(amount)) {
                    layer.msg('数量为空或格式不正确')
                    return false
                }
                if (amount > 100000000) {
                    layer.msg('数量最多为一亿张')
                    return false
                }

                params.amount = parseInt(amount)
            }

            //-------有效时间规则
            var timeRule = {}
            var validity_type = $('input[name="validity_type"]:checked').val()

            if (typeof(validity_type) == 'undefined') {
                layer.msg('请选择有效期类型')
                return false
            }

            timeRule.validity_type = parseInt(validity_type)

            core.formatDate()
            if (timeRule.validity_type == 1) { //绝对时间
                timeRule.startTime = $('input[name="validity_type"]:checked').siblings('input[name="start_time"]').val()
                timeRule.endTime = $('input[name="validity_type"]:checked').siblings('input[name="end_time"]').val()

                if (timeRule.startTime == '' || timeRule.endTime == '') {
                    layer.msg('有效期不能为空')
                    return false
                }

                if (timeRule.startTime > timeRule.endTime) {
                    layer.msg('结束时间不能小于或等于开始时间')
                    return false
                }

                if (timeRule.endTime < new Date().format('yyyy-MM-dd')) {
                    layer.msg('结束时间不可早于当前时间')
                    return false
                }
            } else if (timeRule.validity_type == 2) {

                timeRule.draw_day = parseInt($('input[name="validity_type"]:checked').siblings('input[name="draw_day"]').val())
                timeRule.how_day = parseInt($('input[name="validity_type"]:checked').siblings('input[name="how_day"]').val())

                if (!new RegExp(/\d+/).test(timeRule.draw_day) || !new RegExp(/\d+/).test(timeRule.how_day)) {
                    layer.msg('相对时间必须是数字')
                    return false
                }

            } else if (timeRule.validity_type == 3) {

                var time_type = parseInt($('#select_member_day').find('#time_type').children('.active').find('input[name="assign_type"]').val())
                timeRule.assign_type = time_type
                var checked_date = $('#checked_date').html()
                timeRule.assign_rule = checked_date

                if (typeof(time_type) == 'undefined' || timeRule.assign_rule == '') {
                    layer.msg('有效期不能为空')
                    return false
                }
            } else if (timeRule.validity_type == 4) {
                var day = $('#m_date').val()
                var startHour = $('#m_start_time').val()
                var endHour = $('#m_end_time').val()
                var startSecond = ':00'
                var endSecond = ':59'
                timeRule.startTime = day + ' ' + startHour + startSecond
                timeRule.endTime = day + ' ' + endHour + endSecond
            }
            params.timeRule = timeRule

            //-----限制条件
            var limitRule = {}
            var is_first_order = $('input[name="is_first_order"]:checked').val()
            if (typeof (is_first_order) == 'undefined') {
                layer.msg('请判断是否为首单')
                return
            }

            if (is_first_order == 1) {
                limitRule.is_first_order = 0  //不限
            } else {
                limitRule.is_first_order = 1  //首单
            }

            var order_type = ''
            $('input[name=\'order_type[]\']:checked').each(function () {
                if (typeof $(this).val() != 'undefined') {
                    order_type += $(this).val() + ','
                }

            })
            if (typeof (order_type) == 'undefined' || order_type == '') {
                layer.msg('请选择订单类型')
                return
            }
            limitRule.order_type = order_type.substr(0, order_type.length - 1)

            var apply_channel = ''
            $('input[name=\'apply_channel[]\']:checked').each(function () {
                if (typeof $(this).val() != 'undefined') {
                    apply_channel += $(this).val() + ','
                }

            })
            if (typeof (apply_channel) == 'undefined' || apply_channel == '') {
                layer.msg('请选择渠道类型')
                return
            }
            limitRule.apply_channel = apply_channel.substr(0, apply_channel.length - 1)

            var apply_store = $('input[name="apply_store"]:checked').val()
            if (typeof (apply_store) == 'undefined') {
                layer.msg('适用门店类型不能为空')
                return
            }

            limitRule.apply_store = parseInt(apply_store)

            if (limitRule.apply_store == 1) {
                limitRule.use_stores = $('input[name="apply_store"]:checked').siblings('input[name="apply_store_val"]').val()
                if (limitRule.use_stores == '') {
                    layer.msg('适用门店不能为空')
                    return
                }
            }
            if(limitRule.apply_store==2){
              var use_stores=$('.now_area_name_store').html()
              if(use_stores == ''){
                layer.msg('区域门店不能为空')
              }
              limitRule.use_stores = clearSeparator(use_stores,",")
            }

            var is_share = $('input[name="is_share"]:checked').val()
            if (typeof is_share == 'undefined') {
                layer.msg('请选择是否可分享')
                return
            }

            limitRule.is_share = parseInt(is_share)
            if (limitRule.is_share == 1) {
                limitRule.can_get_num = -1
            } else {
              limitRule.can_get_num = 0
            }
            params.limitRule = limitRule
            params.limitState = $('textarea[name="limitState"]').val()
            params.limitRemark = $('textarea[name="limitRemark"]').val()

            console.log(params)
            layer.open({
                type: 3,
                content: '<div class="sui-loading loading-inline"><i class="sui-icon icon-pc-loading"></i></div>'
            })

            var url
            if (params.ruleId && params.status == 10) {
                url = core.getHost() + '/merchant/editCoupon'
            } else {
                url = core.getHost() + '/merchant/createCoupon'
            }

            var param = JSON.stringify(params)
            $("#coupon_submit").off("click")
            $.post(url, {'data': param}, function (e) {
                if (e.code == '000') {
                    layer.msg('添加成功')
                    location.href = core.getHost() + '/merchant/couponManager'
                } else {
                    layer.msg('创建失败，请刷新页面')
                }
            })
        } else {
            layer.msg('请选择优惠类型')
            return
        }

      /**
       * 获取阶梯型现金券或折扣券的打折规则数据<p/>
       *    数据必须满足:<p/>
       *      1. 必须存在一对参数<p/>
       *      2. 这对参数符合ruleAndMsg<p/>
       *      3. 其他校验规则<p/>
       *
       * @param _location
       *            函数取值依赖的坐标
       * @param ruleAndMsg
       *            数据个体使用的校验规则和错误信息（obj对象）
       * @param msgArr
       *            其他使用到的错误信息数组（相对于ruleAndMsg）
       * @param flag
       *            组级别的数据校验（递增递减之类的校验）
       * @returns {Array}
       */
      function getLadderRule (_location, ruleAndMsg, msgArr, flag) {
        var ruleArr = new Array()
        var ruleArrLength = 0
        var temp_div = $(_location)

        var ladder_msg = temp_div.children('div:last').children('div:first').html()
        var ladder_num = ladder_msg.replace(/\D/gi, '')
        var _param0_prev, _param1_prev

        var $temp_p = temp_div.children('p')

        // 每行数据必须填写完整
        for (var i = 0; i < $temp_p.size(); i++) {
          var $temp_ = $temp_p.eq(i).find('input[type=text]')

          if ($temp_.size() == 2) {
            var _param0 = $temp_.eq(0).val()
            var _param1 = $temp_.eq(1).val()
            if (!_param0) {
              layer.msg(msgArr[0])
              $temp_.eq(0).trigger('focus')
              return
            }
            if (!_param1) {
              layer.msg(msgArr[0])
              $temp_.eq(1).trigger('focus')
              return
            }
          }
        }

        // 其他校验
        for (var i = 0; i < $temp_p.size(); i++) {
          var $temp_ = $temp_p.eq(i).find('input[type=text]')

          if ($temp_.size() == 2) {
            var _param0 = $temp_.eq(0).val()
            var _param1 = $temp_.eq(1).val()

            if (_param0 && _param1) {
              // 数据非0校验
              var verifyResult = verifyOrElseMsg(_param0, /^((0+)|(0+\.0+))$/, msgArr[3] + '不能为0')
              if (!verifyResult) return

              verifyResult = verifyOrElseMsg(_param1, /^((0+)|(0+\.0+))$/, msgArr[3] + '不能为0')
              if (!verifyResult) return

              // 数据个体级别校验
              if (!ruleAndMsg.rule0.test(_param0)) {
                layer.msg(ruleAndMsg.msg0)
                return
              }
              if (!ruleAndMsg.rule1.test(_param1)) {
                layer.msg(ruleAndMsg.msg1)
                return
              }
              if (ruleArrLength > ladder_num) {
                layer.msg('最多可添加' + ladder_num + '级阶梯')
                return
              }

              // 数据组级别校验
              if (flag == 1) { // 全递增判断
                if (ruleArrLength) {
                  if (_param0 - _param0_prev <= 0) {
                    layer.msg(msgArr[1])
                    $temp_.eq(0).trigger('focus')
                    return
                  }

                  if (_param1 - _param1_prev <= 0) {
                    layer.msg(msgArr[2])
                    $temp_.eq(1).trigger('focus')
                    return
                  }
                }
              } else if (flag == 2) { // 打折券
                if (ruleArrLength) {
                  if (_param0 - _param0_prev <= 0) {
                    layer.msg(msgArr[1])
                    $temp_.eq(0).trigger('focus')
                    return
                  }

                  if (_param1 - _param1_prev >= 0) {
                    layer.msg(msgArr[2])
                    $temp_.eq(1).trigger('focus')
                    return
                  }
                }
              }

              ruleArr[ruleArrLength] = {}
              ruleArr[ruleArrLength].param0 = _param0
              ruleArr[ruleArrLength].param1 = _param1
              _param0_prev = _param0
              _param1_prev = _param1
              ruleArrLength++
            }
          }
        }

        return ruleArr
      }

      /**
       * 获取单一折扣以及封顶数据<br/>
       * html的格式严格定义为一个标签内含四个平等的input
       * 分别是ruleType(radio)，discount(text)，topSign(checkbox)，topValue(text)，
       * 其中，各个input的name属性不做硬性规定
       *
       */
      function getDiscountWithTop (_parentID, rule0, msg0, rule1, msg1, msgArr) {
        var inputs = $(_parentID).find('input')
        var result_ = {}

        var temp_i = 1
        var temp_value = inputs.eq(temp_i).val()
        if (temp_value) {
          var verifyResult = verifyOrElseMsg(temp_value, /^((0+)|(0+\.0+))$/, msgArr[2] + '不能为0')
          if (!verifyResult) return

          if (rule0.test(temp_value)) {
            result_.discount = temp_value * 10
          } else {
            layer.msg(msg0)
            inputs.eq(temp_i).trigger('focus')
            return
          }
        } else {
          layer.msg(msgArr[0])
          inputs.eq(temp_i).trigger('focus')
          return
        }

        temp_i++ // 2
        if (inputs.eq(temp_i).is(':checked')) { // 判断封顶checkbox选中与否
          temp_i++ // 3
          temp_value = inputs.eq(temp_i).val()
          if (temp_value) {
            var verifyResult = verifyOrElseMsg(temp_value, /^((0+)|(0+\.0+))$/, msgArr[2] + '不能为0')
            if (!verifyResult) return


            if (rule1.test(temp_value)) {
              result_.top = temp_value
            } else {
              layer.msg(msg1)
              inputs.eq(temp_i).trigger('focus')
              return
            }
          } else {
            layer.msg(msgArr[1])
            inputs.eq(temp_i).trigger('focus')
            return
          }
        } else {
          result_.top = 0
        }


        return result_
      }
    }

  function query_Gift_goods (core, goodsIds, gift_arr) {
    var url = core.getHost() + '/merchant/queryGoodsInfoByIds?goodsIds=' + goodsIds
    $.get(url, function (data) {
      if (data.code == '000') {
        var value = data.value
        for (var i = 0; i < gift_arr.length; i++) {
          var gift_id = gift_arr[i].giftId
          for (var n = 0; n < value.length; n++) {
            if (value[n].goods_id == gift_id) {
              value[n].sendNum = gift_arr[i].sendNum
            }
          }
        }
        $('#gift_goods').html('&nbsp;&nbsp;赠送商品(您已选择<span style="color: red">' + data.value.length + '</span>个赠品，<span data-toggle=\'modal\' data-target=\'#gift_goods_list_box\' id="show_gift_goods" data-value= "' + encodeURIComponent(JSON.stringify(data.value)) + '" style="color: #6BC5A4">点击查看</span>)')
      }
    })
  }

  $(document).delegate('#show_gift_goods', 'click', function (e) {
    console.log($(this).attr('data-value'))
    var goodsList = JSON.parse(decodeURIComponent($(this).attr('data-value')))
    var goodsStr = ''

    $('#selected_gift').html('您已选择 <span style=\'color: red\'>' + goodsList.length + '</span> 个赠品：')
    for (var item = 0; item < goodsList.length; item++) {
      var price = goodsList[item].shop_price == 0 ? 0 : goodsList[item].shop_price
      goodsStr += '<tr><td>' + goodsList[item].goods_title + '</td><td>' + price / 100 + '</td><td>' + goodsList[item].sendNum + '</td><tr>'
    }
    $('#gift_list').html(goodsStr)

  })
    /**
     * 获取优惠券详情，同时根据状态改变样式
     */
    coupon.get_detail_coupon = function () {

      var ruleId = $('#edit_id').val()

      $('input[name="rule_id"]').val(ruleId)
      var url = core.getHost() + '/merchant/getCouponDetail'
      var param = {}
      param.ruleId = ruleId

      //var meet_num = ['first', 'second', 'third', 'fourth', 'fifth']
      $.ajax({
        type: 'GET',
        url: url,
        data: param,
        complete: function (data) {
          if (data.code = '000') {
            var res = JSON.parse(data.responseText)
            if (res.value) {
              res = JSON.parse(res.value)
              console.log("coupon.get_detail_coupon")
              console.log(res)

              //---优惠券类型
              if (res.couponType == 100) {
                $('#coupon_type').html('现金券')
              } else if (res.couponType == 200) {
                $('#coupon_type').html('打折券')
              } else if (res.couponType == 300) {
                $('#coupon_type').html('限价券')
              } else if (res.couponType == 400) {
                $('#coupon_type').html('包邮券')
              } else if (res.couponType == 500) {
                $('#coupon_type').html('满赠券')
              } else {
                layer.msg("券种类型不明")
              }

              $('input[name=status]').val(res.status)
              //---状态 0正常(可发放) 1已过期 2手动停发 3已发完 4手动作废 10待发放
              if (res.status == 0) {
                $('#coupon_status').html('可发放')
              } else if (res.status == 1) {
                $('#coupon_status').html('已过期')
              } else if (res.status == 2) {
                $('#coupon_status').html('手动停发')
              } else if (res.status == 3) {
                $('#coupon_status').html('已发完')
              } else if (res.status == 4) {
                $('#coupon_status').html('手动作废')
              } else if (res.status == 10) {
                $('#coupon_status').html('待发放')
              }

              //---编码
              $('#coupon_code').html(res.ruleId)
              $('input[name="couponType"]').val(res.couponType)
              $('input[name="coupon_status"]').val(res.status)
              $('input[name="coupon_code"]').val(res.ruleId)

              //---名称
              $('#ruleName').html(res.ruleName)
              $('#markedWords').html(res.markedWords)
              /* $('input[name="ruleName"]').val(res.ruleName).attr('readonly', 'readonly')
               $('input[name="markedWords"]').val(res.markedWords).attr('readonly', 'readonly')*/
              var orderType=''
              $("#aim_at").html(res.aimAt)
              //------优惠类型
              var goodModifyButton
              if (res.status === 1 || res.status === 4) {
                goodModifyButton = ''
              } else {
                goodModifyButton = '<button data-toggle=\'modal\' data-target=\'#goodsModifyModal\' class=\'sui-btn btn-bordered btn-small btn-warning\'>修改商品</button>'
                if(res.aimAt=='0'){
                  goodModifyButton = ''
                }
              }

              if (goodModifyButton) {
                switch (res.couponType) {
                  case 100:
                  case 200:
                  case 400:
                  case 500:
                    break
                  case 300:
                    $('#goodsModifyModal').find('select[name=__goodsIdsType] option').eq(0).remove()
                    $('#much_select_goods_container').show()
                    break
                }
                if (parseInt((JSON.parse(res.goodsRule)).type) !== 0) $('#much_select_goods_container').show()
              }

              if(res.aimAt==1) {
                copyGoodsToDetail(JSON.parse(res.goodsRule))
              }

              if (res.couponView) {
                var couponView = res.couponView
                if (!couponView) {
                  layer.msg('优惠类型查询失败')
                } else {
                  if (res.aimAt == 0){
                    orderType = '<span>' + couponView.ruleDetail + '</span>'
                  }else {
                    orderType = '<span>' + couponView.ruleDetail + '</span>' + goodModifyButton
                  }
                }
              $("#order_rule").html(orderType)
              } else {
                layer.msg('优惠类型查询失败')
              }

              $('input[name=timeRule]').val(res.timeRule)
              var time_rule = JSON.parse(res.timeRule)

              if (res.total > -1) {  //-1表示不限量
                $('#amcount').html(res.total)
              } else {
                $('#amcount_no').html('不限量')
              }

              var addButtonHtml = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button data-toggle="modal" data-target="#AmcountModal" data-keyboard="false" class="sui-btn btn-primary btn-lg">增加数量';

              //增加数量按钮 可发放 已发完 已过期 0 1 3
              if (res.amount > -1) {
                if (res.status == 0 || res.status == 1 || res.status == 3) {
                  $("#AddButtonDiv").html(addButtonHtml);
                }
              }

              if (time_rule.validity_type == 1) {
                var temp_html = '' + time_rule.startTime + ' - ' + time_rule.endTime + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                if (res.status == 0 || res.status == 1 || res.status == 3) {
                  temp_html += '<button data-toggle="modal" data-target="#ValidityTimeModal" data-keyboard="false" class="sui-btn btn-primary btn-lg">延长有效期</button>';
                }
                $('#validity_type').html(temp_html)
              } else if (time_rule.validity_type == 2) {

                $('#validity_type').html('领取后&nbsp;' + time_rule.how_day + '&nbsp;天内使用')

              } else if (time_rule.validity_type == 3) {
                if (time_rule.assign_type == 1) {
                  $('#validity_type').html('指定时间：按日期设置，每月' + time_rule.assign_rule + '号')
                } else if (time_rule.assign_type == 2) {
                  $('#validity_type').html('指定时间：按星期设置，每周' + time_rule.assign_rule)
                }
              } else if (time_rule.validity_type == 4) {
                $('#validity_type').html(time_rule.startTime + '~' + time_rule.endTime)
              }

              //延长日期按钮 可发放 已发完 已过期  0 1 3
              if ((res.status == 0 && time_rule.validity_type == 1) || (res.status == 1 && time_rule.validity_type == 1) || (res.status == 3 && time_rule.validity_type == 1)) {
                var extendTime='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button data-toggle="modal" data-target="#ValidityTimeModal" data-keyboard="false" class="sui-btn btn-primary btn-lg">延长有效期</button>'
                if(res.aimAt=='0'){
                  extendTime=''
                }
                $('#validity_type').html('绝对时间：' + time_rule.startTime + ' - ' + time_rule.endTime +extendTime)
              }

              console.log(res.status)
              if (res.status == 0) {
                if (time_rule.validity_type != 1 && res.amount < 0) {  //去掉保存按钮
                  $('#coupon_detail_save').remove()
                }
              } else if (res.status == 2) {
                $('input[name="amount_append"]').attr('disabled', 'disabled')
                $('#validityId').attr('disabled', 'disabled')
                $('#coupon_cancel').attr('disabled', 'disabled')
                $('#coupon_detail_save').attr('disabled', 'disabled')
              }

              var limit_rule = JSON.parse(res.limitRule)

              if (limit_rule.is_first_order == 0) {
                $('#first_orde').html('所有订单')
              } else if (limit_rule.is_first_order == 1) {
                $('#first_orde').html('仅限首单')
              } else {
                $('#first_orde').html('--')
              }
              console.log(limit_rule.order_type)
              var order_type_arr = limit_rule.order_type.split(',')
              var order_type = ''
              var order_type_count = "";
              $.each(order_type_arr, function (k, v) {
                if (v == 100) {
                  // todo 100,300合并
                  // order_type += '自提订单，'
                  order_type += '门店自提（包括门店直购），'
                  order_type_count = order_type_count + v;
                }
                if (v == 200) {
                  order_type += '送货上门，'
                  order_type_count = order_type_count + v;
                }
                if (v == 300) {
                  //下期放开
                  /*order_type += '门店直购（app下单）&nbsp;&nbsp;&nbsp;'*/
                  order_type_count = order_type_count + v;
                }
                /*if (order_type_count == "100200300") {
                 order_type = "全类型"
                 }*/
              })

              order_type=order_type.substring(0,order_type.length-1)
              $('#order_type').html(order_type)
              console.log(limit_rule.apply_channel)
              if (limit_rule.apply_channel) {
                var apply_channel_arr = limit_rule.apply_channel.split(',')
                var apply_channel = ''
                /*$.each(apply_channel_arr, function (k, v) {
                 if (v == 100) {
                 apply_channel += '门店后台';
                 }
                 if (v == 101) {
                 apply_channel += '门店助手';
                 }
                 if (v == 102) {
                 apply_channel += 'PC站';
                 }
                 if (v == 103) {
                 apply_channel += '微信商城';
                 }
                 if (v == 105) {
                 apply_channel += '线下';
                 }
                 });*/
                if (limit_rule.apply_channel === '101,103,105') {
                  apply_channel = '线上线下均可使用'
                } else if (limit_rule.apply_channel === '101,103') {
                  apply_channel = '线上使用'
                } else if (limit_rule.apply_channel === '105') {
                  apply_channel = '线下使用'
                }
                $('#apply_channel').html(apply_channel)
              }

              if (limit_rule.apply_store == 1||limit_rule.apply_store == 2) {
                $('#apply_store').html('指定门店(您已选择 <span style="color:red">' + res.storeList.length + '</span> 家门店，' +
                  '<span data-toggle=\'modal\' data-target=\'#store_list_box\' id="show_store" data-value = "' + encodeURIComponent(JSON.stringify(res.storeList)) + '" style="color: #6BC5A4">点击查看</span>)')
              } else {
                $('#apply_store').html('全部门店')
              }

              if (limit_rule.is_share == 1) {
                $('#is_share').html('可分享')
              } else {
                $('#is_share').html('不可分享')
              }

              if (res.limitRemark != '') {
                $('#limit_remark').html(res.limitRemark)
              }

              if (res.limitState) {
                $('#limit_state').html(res.limitState)
                $('#limit_state').parent().parent().show()
              }

              core.formatDate()
              $('#create_time').html(new Date(res.createTime).format())

            }
            var goodsRule=JSON.parse(res.goodsRule)
            var goodsList=''
            if (goodsRule.type == 0) {
              $('#order_rule').html('全部商品参加<br/>' + orderType)
            } else {
              console.log('GoodsIDs' + JSON.parse(res.goodsRule).promotion_goods)
              var url = core.getHost() + '/goods/getGoodsInfoByIds'
              $.post(url, 'goodsIds=' + goodsRule.promotion_goods, function (goods) {
                if (goods.code == '000') {
                  goodsList = goods.data
                  if (goodsRule.type == 2) {
                    $('#order_rule').html('指定商品参加(您已选择<span style="color: red">' + goodsList.length + '' +
                      '</span>个商品，<span data-toggle=\'modal\' data-target=\'#goods_list_box\' id="show_goods" ' +
                      'data-value= "' + encodeURIComponent(JSON.stringify(goodsList)) + '" style="color: #6BC5A4">' +
                      '点击查看</span>)<span id="gift_goods"></span><br/>' + orderType)
                  } else if (goodsRule.type == 3) {
                    $('#order_rule').html('指定商品不参加(您已选择<span style="color: red">' + goodsList.length + '' +
                      '</span>个商品，<span data-toggle=\'modal\' data-target=\'#goods_list_box\' id="show_goods" ' +
                      'data-value= "' + encodeURIComponent(JSON.stringify(goodsList)) + '" style="color: #6BC5A4">' +
                      '点击查看</span>)<span id="gift_goods"></span><br/>' + orderType)
                  }
                  if (res.couponType == 500) {
                    //查询赠品
                    var goodsRules = JSON.parse(res.goodsRule)
                    if (res.goodsRule == null || goodsRules == null) {
                      layer.msg('查询失败')
                    }
                    var gift_arr = goodsRules.gift_storage
                    var gift_goods = ''
                    for (var i = 0; i < gift_arr.length; i++) {
                      gift_goods += gift_arr[i].giftId + ','
                    }
                    var gift_goods = gift_goods.substring(0, gift_goods.length - 1)
                    query_Gift_goods(core, gift_goods, gift_arr)
                  }
                }
              })
            }
          }
        },
        // 不要改动这里的false
        async: false
      })
    }
    $(document).delegate('#show_store', 'click', function (e) {
        console.log($(this).attr("data-value"));
        var storeList = JSON.parse(decodeURIComponent($(this).attr("data-value")));
        var storeStr = '';
        var support1='送货上门'
        var support2='门店自提'
        var support3='送货上门,门店自提'
        $("#selected_store").html("您已选择 <span style='color: red'>"+storeList.length+"</span> 家门店：");
        for (var item = 0; item < storeList.length; item++) {
            console.log(storeList[item].serviceSupport);
            if(!storeList[item].service_support_str){
              switch (storeList[item].serviceSupport){
                case '150':storeList[item].service_support_str=support1;break;
                case '160':storeList[item].service_support_str=support2;break;
                case '150,160':storeList[item].service_support_str=support3;break;
                case '160,150':storeList[item].service_support_str=support3;break;
                case '':storeList[item].service_support_str='---';break;
                case undefined:storeList[item].service_support_str='---';break;
              }
            }
            storeStr +='<tr><td>'+storeList[item].storesNumber+'</td><td>'+storeList[item].name+'</td><td>'
                +storeList[item].service_support_str+'</td></tr>';

        }
        $("#store_list").html(storeStr);

    });

  $(document).delegate('#show_goods', 'click', function (e) {
    console.log($(this).attr("data-value"));
    var goodsList = JSON.parse(decodeURIComponent($(this).attr("data-value")));
    var goodsStr = '';

    $("#selected_goods").html("您已选择 <span style='color: red'>"+goodsList.length+"</span> 个商品：");
    for (var item = 0; item < goodsList.length; item++) {
      var price=goodsList[item].product_price==0?0:goodsList[item].product_price;
      goodsStr +='<tr><td>'+goodsList[item].product_name+'</td><td>'+price/100+'</td><tr>';
    }
    $("#goods_list").html(goodsStr);

  });


    coupon.editCoupon = function () {
        var params = {}

        params.ruleId = $('input[name="rule_id"]').val()
        params.siteId = $('input[name="site_id"]').val()
        params.amount = $('input[name="amount_append"]').val() ? $('input[name="amount_append"]').val() : 0
        params.dayNum = $('input[name="validity_day_append"]').val() ? $('input[name="validity_day_append"]').val() : 0

        var g = new RegExp(/^[0-9]{1}[0-9]*$/)
        // var g =/[0-9]*[1-9][0-9]*/;
        // var g= /^\+?[1-9][0-9]*$/;
        if (!g.test(params.amount)) {
            layer.msg('优惠券数量追加错误，请输入有效数字')
            return
        }

        if (params.amount > 100000000) {

            layer.msg('优惠券数量最多追加一亿张，请重新输入')
            return
        }

        if (!g.test(params.dayNum)) {

            layer.msg('优惠券有效期追加错误，请输入有效天数')
            return
        }

        if (params.dayNum > 3600) {

            layer.msg('优惠券有效期追加最多为3600天，请重新输入')
            return
        }

        if (params.amount > 0 || params.dayNum > 0) {
            layer.open({
                type: 3,
                content: '<div class="sui-loading loading-inline"><i class="sui-icon icon-pc-loading"></i></div>'
            })
            var url = core.getHost() + '/merchant/updateCoupon'
            $.post(url, params, function (e) {
                if (e.code == '000') {
                    layer.msg('修改成功')
                    location.href = core.getHost() + '/merchant/couponManager'
                } else {
                    layer.msg('修改失败')
                }
            })
        }
    }

    coupon.editAmcountOrValidityTime = function () {
        var params = {}

        params.ruleId = $('input[name="rule_id"]').val()
        params.siteId = $('input[name="site_id"]').val()
        params.amount = $('input[name="amount_append"]').val() ? $('input[name="amount_append"]').val() : 0
        params.dayNum = $('input[name="validity_day_append"]').val() ? $('input[name="validity_day_append"]').val() : 0

        var g = new RegExp(/^[0-9]{1}[0-9]*$/)
        // var g =/[0-9]*[1-9][0-9]*/;
        // var g= /^\+?[1-9][0-9]*$/;
        if (!g.test(params.amount)) {

            layer.msg('优惠券数量追加错误，请输入有效数字')
            return
        }

        if (params.amount > 100000000) {

            layer.msg('优惠券数量最多追加一亿张，请重新输入')
            return
        }

        if (!g.test(params.dayNum)) {

            layer.msg('优惠券有效期追加错误，请输入有效天数')
            return
        }

        if (params.dayNum > 3600) {

            layer.msg('优惠券有效期追加最多为3600天，请重新输入')
            return
        }

        if (params.amount > 0 || params.dayNum > 0) {
            layer.open({
                type: 3,
                content: '<div class="sui-loading loading-inline"><i class="sui-icon icon-pc-loading"></i></div>'
            })
            var url = core.getHost() + '/merchant/updateCoupon'
            $.post(url, params, function (e) {
                if (e.code == '000') {
                    layer.msg('修改成功')
                    window.location.reload()
                } else {
                    layer.msg('修改失败')
                }
            })
        }
    }

    coupon.cancelCoupon = function () {
        var params = {}
        params.rule_id = $('[name=rule_id]').val()

        var url = core.getHost() + '/merchant/cancelCoupon'
        $.post(url, params, function (msg) {
            console.log(msg)
            if (msg.code == '000') {
                location.href = core.getHost() + '/merchant/couponManager'
            } else {
                layer.msg('手动停止优惠券失败')
            }
        })
    }

    //商品列表（多选）
    coupon.get_much_product_list = function () {
        //分类
        var cate_code = $('#cate_box').find('input').val()

        //标题
        var search_input = $('input[name=\'much_search_input\']').val()

        //商品编码
        var goods_code_disc = $('input[name=\'goods_code_disc\']').val()

        //现价
        var goods_price_s = $('input[name=\'goods_price_s\']').val() ? $('input[name=\'goods_price_s\']').val().trim() * 100 : 0
        var goods_price_b = $('input[name=\'goods_price_b\']').val() ? $('input[name=\'goods_price_b\']').val().trim() * 100 : 99999999
        var goods_price = goods_price_s + ',' + goods_price_b

        var url = core.getHost() + '/merchant/bgoodsList'

        var params = {}
        //params.currentPage = coupon.pageno;
        //params.pageNum = coupon.cur_per_page;
        params.startRow = coupon.pageno
        params.pageSize = coupon.cur_per_page

        params.goodsStatus = 1
        params.userCateid = cate_code > 0 ? cate_code : ''
        params.goodsTitle = search_input
        params.goodsCode = goods_code_disc
        params.shopPWrice = goods_price

        $.post(url, params, function (data) {
            var e = data.goodsPage
          console.log('coupon.get_much_product_list')
          console.log(e)

            var tmpl = document.getElementById('much_product_list_templete').innerHTML
            var doTtmpl = doT.template(tmpl)
            $('.goods_list').html(doTtmpl(e))
            $('.goods_total').html(e.total)
            var pages = Math.ceil(e.total / coupon.cur_per_page)

            $('#pageinfo').data('sui-pagination', '')
            $('#pageinfo').pagination({
                pages: e.pages,
                styleClass: ['pagination-large'],
                showCtrl: true,
                displayPage: 4,
                currentPage: coupon.pageno,
                onSelect: function (num) {
                    coupon.pageno = num
                    coupon.get_much_product_list()
                }
            })
            $('#pageinfo').find('span:contains(共)').html('共' + pages + '页(' + e.total + '条记录)')
            $('.page_size_select').find('option[value=' + coupon.cur_per_page + ']').prop('selected', true)
            $('#singleLeftCheckBoxFirst').attr('checked', false)

        })
    }

    /**
     * 类目列表
     */
    coupon.get_much_cate_list = function () {
        var url = core.getHost() + '/merchant/categories'

        $.post(url, {}, function (data) {

            var tmpMoveHtml = '<span class="spanWidth100"></span>'
            var tmpCheckBoxHtml = ''
            $('.goods_list_lee').empty()
            if (data.result.children) {
                for (var i = 0, len = data.result.children.length; i < len; i++) {
                    if (data.result.children[i].children) {
                        $('.goods_list_lee').append('<div class="first_classify"><p data="' + data.result.children[i].cateId + '">' + tmpCheckBoxHtml + '<span class="qs_classify_name"><input type="checkbox" name="cate_ids[]" value="' + data.result.children[i].cateId + '"/><i class="sui-icon icon-caret-right"></i><input type="text" name="cate_name" value="' + data.result.children[i].cateName + '" class="input-xlarge" maxlength="10"/></span>' + tmpMoveHtml + '<a class="product_manager_a" href="/merchant/productList?id=' + data.result.children[i].cateCode + '">商品管理</a></p></div>')

                        for (var j = 0, j_len = data.result.children[i].children.length; j < j_len; j++) {

                            if (data.result.children[i].children[j].children) {
                                $('.goods_list_lee .first_classify:eq(' + i + ')').append('<div class="second_classify hide"><p data="' + data.result.children[i].children[j].cateId + '">' + tmpCheckBoxHtml + '<span class="qs_classify_name"><input type="checkbox" name="cate_ids[]" value="' + data.result.children[i].children[j].cateId + '"/><span class="qingShanPic link_back"></span><i class="sui-icon icon-caret-right"></i><input type="text" name="cate_name" value="' + data.result.children[i].children[j].cateName + '" class="input-xlarge" maxlength="10" /></span>' + tmpMoveHtml + '<a class="product_manager_a" href="/merchant/productList?id=' + data.result.children[i].children[j].cateId + '">商品管理</a></p></div>')

                                for (var k = 0, k_len = data.result.children[i].children[j].children.length; k < k_len; k++) {
                                    $('.goods_list_lee .first_classify:eq(' + i + ') .second_classify:eq(' + j + ')').append('<div class="third_classify hide"></div>')
                                    $('.goods_list_lee .first_classify:eq(' + i + ') .second_classify:eq(' + j + ') .third_classify:eq(' + k + ')').append('<p data="' + data.result.children[i].children[j].children[k].cateId + '">' + tmpCheckBoxHtml + '<span class="qs_classify_name"><input type="checkbox" name="cate_ids[]" value="' + data.result.children[i].children[j].children[k].cateId + '"/><span class="qingShanPic link_back"></span><input name="cate_name" type="text" value="' + data.result.children[i].children[j].children[k].cateName + '" class="input-xlarge" maxlength="10" /></span>' + tmpMoveHtml + '<a class="product_manager_a" href="/merchant/productList?id=' + data.result.children[i].children[j].children[k].cateId + '">商品管理</a></p>')
                                }
                            } else {

                                $('.goods_list_lee .first_classify:eq(' + i + ')').append('<div class="second_classify hide"><p data="' + data.result.children[i].children[j].cateId + '">' + tmpCheckBoxHtml + '<span class="qs_classify_name"><input type="checkbox" name="cate_ids[]" value="' + data.result.children[i].children[j].cateId + '"/><span class="qingShanPic link_back"></span><input type="text" name="cate_name"  style="margin-left:21px;" value="' + data.result.children[i].children[j].cateName + '" class="input-xlarge" maxlength="10" /></span>' + tmpMoveHtml + '<a class="product_manager_a" href="/merchant/productList?id=' + data.result.children[i].children[j].cateId + '">商品管理</a></p></div>')
                            }
                        }
                    } else {
                        $('.goods_list_lee').append('<div class="first_classify"><p data="' + data.result.children[i].cateId + '">' + tmpCheckBoxHtml + '<span class="qs_classify_name"><input type="checkbox" name="cate_ids[]" value="' + data.result.children[i].cateId + '"/><i style="display: inline-block;margin-left: 13px;"></i><input type="text" name="cate_name" value="' + data.result.children[i].cateName + '" class="input-xlarge" maxlength="10"/></span>' + tmpMoveHtml + '<a class="product_manager_a" href="/merchant/productList?id=' + data.result.children[i].cateId + '">商品管理</a></p></div>')
                    }
                }
            }

        })
    }

    coupon.get_store_list = function () {
        var url = core.getHost() + '/common/storesby'

        var store_name = $('input[name=\'store_name\']').val()
        var store_id = $('input[name=\'store_id\']').val()

        var datas = {}
        datas.store_name = store_name
        datas.stores_number = store_id
        datas.storesStatus = 1

        console.log(datas)

        $('.stores_list').empty()
        $.post(url, datas, function (res) {
            console.log(res)
            if (res.storelist.length > 0) {
                var data = res.storelist
            }
            var tmpl = document.getElementById('store_list_templete').innerHTML
            var doTtmpl = doT.template(tmpl)
            $('.stores_list').html(doTtmpl(data))
            $('.stores_total').html(data ? data.length : 0)
            var selects = $('.select_stores_list').find('tr').length
            $('.select_stores_total').html(selects)
        })

    }

    /**
     * 类目相关
     */

    //一级展开/收缩
    coupon.classOneShowHide = function (obj) {
        if ($(obj).parents('.first_classify').find('.second_classify').hasClass('hide')) {
            $(obj).removeClass('icon-caret-right').addClass('icon-caret-down')
            $(obj).parents('.first_classify').find('.second_classify').removeClass('hide')
        } else {

            $(obj).removeClass('icon-caret-down').addClass('icon-caret-right')
            $(obj).parents('.first_classify').find('.second_classify').addClass('hide')
        }
    }

    //二级展开/收缩
    coupon.classTwoShowHide = function (obj) {
        if ($(obj).parents('.second_classify').find('.third_classify').hasClass('hide')) {
            $(obj).removeClass('icon-caret-right').addClass('icon-caret-down')
            $(obj).parents('.second_classify').find('.third_classify').removeClass('hide')
        } else {

            $(obj).removeClass('icon-caret-down').addClass('icon-caret-right')
            $(obj).parents('.second_classify').find('.third_classify').addClass('hide')
        }
    }
  /**
   * 导出优惠券
   * @param coupon
   */
  coupon.exportTable=function(coupon){
    $("#exportExcel").click(function(){
      var url="exportCouponDetailList?page="+coupon.pageno+"&pageSize="+2000
      var search_type = $('select[name="search_type"] :selected').val()

      if ($('input[name="coupon_input"]').val() != '') {
        if (search_type == 1) { //编号搜索

          var no = $('input[name="coupon_input"]').val()
          url+="&no="+no

        } else if (search_type == 2) { // 手机号搜索

          var mobile = $('input[name="coupon_input"]').val()
          url+="&mobile="+mobile
        }
      }

      if (parseInt($('#status :selected').val()) >= 0) {
        var status = parseInt($('#status :selected').val())
        url+="&status="+status
      }
      var startTime=$('#startTime').val()
      var endTime=$('#endTime').val()
      if(startTime!=''&&endTime!=''){
        if(startTime!=null&&endTime!=null){
          startTime=startTime+" 00:00:00"
          endTime=endTime+" 23:59:59"
          url+="&startTime="+startTime
          url+"&endTime="+endTime
        }
      }
      var ruleId=getUrlParam("id");
      url+="&ruleId="+ruleId;
      window.open(url)
    });
  }


  /**
   * 优惠券使用情况数量
   */
  coupon.getCouponUseUnuse=function (param,status) {
    var url=core.getHost() + "/merchant/coupon_use_unuse"
    if(status==-1){
      if(param.status==0){
        $.post(url,param,function(data){
          if(data.code="000"){
            if(param.status==0){
              $("#use").html(data.value)
              $("#unused").html("0")
            }else if(param.status==1){
              $("#unused").html(data.value)
              $("#use").html("0")
            }
          }
        })
      }else if(param.status==1) {
        $.post(url,param,function(data){
          if(data.code="000"){
            if(param.status==0){
              $("#use").html(data.value)
              $("#unused").html("0")
            }else if(param.status==1){
              $("#unused").html(data.value)
              $("#use").html("0")
            }
          }
        })
      }
    }else {
      param.status=status
      $.post(url,param,function(data){
        if(data.code="000"){
          if(status==0){
            $("#use").html(data.value)
          }else if(status==1){
            $("#unused").html(data.value)
          }
        }
      })

    }

  }



  /**
   * 优惠券使用情况
   */
  coupon.getCouponUseList = function () {
    // var up_page=getUrlParam("page");
    var search_type = $('select[name="search_type"] :selected').val()

    var params = {}
    if ($('input[name="coupon_input"]').val() != '') {
      if (search_type == 1) { //编号搜索

        params.no = $('input[name="coupon_input"]').val()

      } else if (search_type == 2) { // 手机号搜索

        params.mobile = $('input[name="coupon_input"]').val()
      }
    }
    params.page = coupon.pageno
    params.pageSize = coupon.cur_per_page

    if (parseInt($('#status :selected').val()) >= 0) {
      params.status = parseInt($('#status :selected').val())
    }
    params.use = 'use'
    var startTime=$('#startTime').val()
    var endTime=$('#endTime').val()
    if(startTime!=''&&endTime!=''){
      if(startTime!=null&&endTime!=null){
        params.startTime=startTime+" 00:00:00"
        params.endTime=endTime+" 23:59:59"
      }
    }
    params.ruleId=getUrlParam("id");
    params.type=getUrlParam("type")
    if(!params.type){
      params.type=$('div[name="save_type"]').prop("id")
    }
    // var url = core.getHost() + "/couponRule/query";
    var url = core.getHost() + '/merchant/export_by_coupon_table'
    console.log($('#status :selected').val())
    console.log($('select[name="coupon_type"] :selected').val())
    console.log(params)
    $.post(url, params, function (data) {

      if (data.code == '000') {
        // $("#unused").text(data.unused)
        // $("#use").text(data.use)
        /*                if (data.total > 0) {
         core.formatDate()
         $.each(data.value.items, function (i, v) {
         data.value.items[i].createTime = new Date(v.createTime).format()
         data.value.items[i].createTime = new Date(v.createTime).format()
         })
         }*/
        data.type=params.type
        $('#coupon_table').empty()
        var tmpl = document.getElementById('coupon_list_templete').innerHTML
        var doTtmpl = doT.template(tmpl)
        $('#coupon_table').html(doTtmpl(data))

        // var pages = Math.ceil(data.value.total / data.value.pageSize)
        $('#pageinfo').data('sui-pagination', '')
        $('#pageinfo').pagination({
          pages: data.pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 4,
          currentPage: coupon.pageno,
          onSelect: function (num) {
            coupon.pageno = num
            coupon.getCouponUseList()
          }
        })

        $('#pageinfo').find('span:contains(共)').append('(' + data.total + '条记录)')
        coupon.addPageExtd(coupon.cur_per_page)
        $('#singleLeftCheckBoxFirst').attr('checked', false)
        // $('#pageinfo').find('span:contains(共)').prepend("<select class='page_size_select' style='width: 40px!important;'><option value='15'>15</option><option value='30'>30</option><option value='50'>50</option><option value='100'>100</option></select>");
        // $('.page_size_select').find('option[value='+coupon.cur_per_page+']').attr("selected",true);
      }
      // $("#coupon_manage_back").prop("href","/merchant/couponManager?page="+up_page)
    })
    if(params.type==1){
      if(params.status==null){
        coupon.getCouponUseUnuse(params,0)
        coupon.getCouponUseUnuse(params,1)
      }else {
        coupon.getCouponUseUnuse(params,-1)
      }
    }else if(params.type==2){
      if(params.status==null){
        params.status=-1
      }
      coupon.getPromotionsStatusByConditions(params);
    }
  }
  coupon.getPromotionsStatusByConditions=function(params){
     var url=core.getHost() + "/merchant/coupon_use_unuse"
    if(params.status==-1){
      //查询全部
      url=core.getHost()+"/merchant/promotions_status"
      $.post(url,params,function(data){
        if(data.code=="000"){
          data.value.use?$("#use").html(data.value.use):$("#use").html("0")
          data.value.refund?$("#refund").html(data.value.refund):$("#refund").html("0")
          data.value.cancel?$("#cancel").html(data.value.cancel):$("#cancel").html("0")
        }
      })
    }else if(params.status==0){
      //已使用 refund cancel is 0
      $.post(url,params,function(data){
        if(data.code=="000"){
          $("#use").html(data.value)
          $("#refund").html("0")
          $("#cancel").html("0")
        }
      })
    }else if(params.status==1){
      //已退款 use cancel is 0
      $.post(url,params,function(data){
        $("#use").html("0")
        $("#refund").html(data.value)
        $("#cancel").html("0")
      })
    }else if(params.status==2){
      //订单取消 use refund is 0
      $.post(url,params,function(data){
        $("#use").html("0")
        $("#refund").html("0")
        $("#cancel").html(data.value)
      })
    }

  }
    //sui 翻页控件增加页码选择框
    coupon.addPageExtd = function (pageSize) {
        var pagearr = [10,15, 30, 50]

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

    //上传优惠券图标
    coupon.upLoadPic = function (evt, source) {
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
                        $('[name="share_icon"]').val(img_url)
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
     * 获取地区
     */
    coupon.getAreaList = function () {
        $('#free_ragion_list').empty()

        var url = core.getHost() + '/common/queryAreaAll'
        $.post(url, function (response) {

            $.each(response, function (k, v) {

                var tpl = '<div class="control-group"><input top="1" type="checkbox" ><b class="letter">' + v.name + '</b>'

                for (var vv in v.provinces) {
                    var _v = v.provinces[vv]
                    tpl += ' <label> <input group=' + v.name + ' name="perTag" top=2 id="' + _v.areaid + '"  type="checkbox" data-name="' + _v['name'] + '" value="' + _v['name'] + '"> <span >' + _v['name'] + '</span></label>'
                }

                tpl += '</div>'
                $('#free_ragion_list').append(tpl)
            })
        })
    }

    /**
     * 复制优惠券入口
     *
     * @param ruleId 优惠券规则id
     */
    coupon.copyCoupon = function (ruleId, status) {
      console.log('coupon.copyCoupon')
      console.log('ruleId:' + ruleId + ', status:' + status)
      var url = core.getHost() + '/merchant/getCouponDetail/'

      var params = {}
      params.ruleId = ruleId

      $.get(url, params, function (data) {
        if (data.code == '000') {
          if (data.value) {
            var couponRule = JSON.parse(data.value)
            couponRule.goodsRule = JSON.parse(couponRule.goodsRule)
            couponRule.limitRule = JSON.parse(couponRule.limitRule)
            couponRule.timeRule = JSON.parse(couponRule.timeRule)
            console.log(couponRule)

            var $couponForm = $('#coupon_form')

            // 名称
            $couponForm.find('input[name=ruleName]').val(couponRule.ruleName)
            // 前台提示语
            $couponForm.find('input[name=markedWords]').val(couponRule.markedWords)

            // 优惠类型（含商品信息）
            if (couponRule.goodsRule && couponRule.goodsRule != 'null') {
              copyCouponRule(couponRule)
            } else if (couponRule.orderRule && couponRule.orderRule != 'null') {
              layer.msg('不支持复制按订单规则的优惠券')
            }

            // 数量
            if (couponRule.total == -1) {
              $couponForm.find('input[name=\'amount\'][value=\'-1\']').attr('checked', true)
            } else {
              $couponForm.find('input[name=\'amount\'][value=\'1\']').attr('checked', true)
              $couponForm.find('input[name=amount_val]').val(couponRule.total)
            }

            // 有效期 不用复制
            if (status == 10) {
              copyTimeRule(couponRule.timeRule)
              $('input[name=status]').val(10)
              $('input[name=ruleId]').val(couponRule.ruleId)
              $('input[name=siteId]').val(couponRule.siteId)
            }

            // 是否首单
            $couponForm.find('input[name=\'is_first_order\'][value=\'' + (couponRule.limitRule.is_first_order + 1) + '\']').attr('checked', true)

            // 订单类型 暂时不用
            var order_types = couponRule.limitRule.order_type
            var order_type = order_types.split(',')
            console.log(order_types)
            $('input[name=\'order_type[]\']').attr('checked', false)
            $.each(order_type, function (k, v) {
              $couponForm.find('input[name=\'order_type[]\'][value=\'' + v + '\']').attr('checked', true)
            })
            // todo 100,300合并，
            if ($.inArray('100',order_type)>-1||$.inArray("300",order_type)>-1){
              $couponForm.find('input[name=\'order_type[]\'][value=\'100,300\']').attr('checked', true)
            }
            //指定门店时，送货上门不可选
            if (1 == couponRule.limitRule.apply_store) {
              $couponForm.find('input[name="order_type[]"][value="200"]').attr('disabled', true)
            }

            // 使用渠道
            $couponForm.find('input[name=\'apply_channel[]\'][value=\'' + couponRule.limitRule.apply_channel + '\']').attr('checked', true)

            // 适用门店
            $couponForm.find('input[name=\'apply_store\'][value=\'' + couponRule.limitRule.apply_store + '\']').attr('checked', true)
            if(couponRule.limitRule.apply_store==1){
              $('input[name=apply_store_val]').val(couponRule.limitRule.use_stores)
              if (couponRule.storeList) {
                copyCouponStore(couponRule.storeList)
              }
            }else if(couponRule.limitRule.apply_store==2){
              $('.now_area_name_store').html(couponRule.limitRule.use_stores)
              var url = 'ybArea/getProvinceIdByCityIds'
              var params = {}
              params.cityIds = couponRule.limitRule.use_stores
              doGetOrPost(url, params, 'get', false, function (data) {
                if (data.code === '000') {
                  var result_map = data.value
                  for (var i = 0; i < result_map.check.length; i++) {
                    $('#pointid_store_'+result_map.check[i] ).parent().prop('class','checkbox-pretty inline checked')
                  }
                  for (var i = 0; i < result_map.halfcheck.length; i++) {
                    $('#pointid_store_'+result_map.halfcheck[i] ).parent().prop('class','checkbox-pretty inline halfchecked')
                  }
                }
              })
            }



            //分享
            $('input[name=is_share]').each(function () {
              $(this).removeAttr('checked')
            })
            $('input[name=is_share][value=' + couponRule.limitRule.is_share + ']').prop('checked', true)

            // 说明和备注
            $couponForm.find('textarea[name=limitState]').val(couponRule.limitState)
            $couponForm.find('textarea[name=limitRemark]').val(couponRule.limitRemark)
          }
        }
      })
    }

    coupon.buildCoupon = function (callback) {
        var params = {}
        params.ruleId = $('input[name=coupon_id]').val()
        params.preStatus = $('input[name=status]').val()
        params.toUpdateStatus = 0

        var url = core.getHost() + '/merchant/updateCouponStatus'
        $.post(url, params, function (data) {
            if (data.code == '000') {
                callback()
            } else if (data.code == '101') {
                layer.msg(data.message)
            } else {
                layer.msg('发放优惠券失败')
            }
        })
    }

  coupon.selectGifts = function (data) {
    console.log('rule.selectGifts')

    if (!$('.select_gift_list [name=gift_id][value="' + data.gift_id + '"]').val()) {
      var oldGiftIds = $('input[name=giftIds]').val()
      $('input[name=giftIds]').val(oldGiftIds ? oldGiftIds + ',' + data.gift_id : data.gift_id)

      var template = document.getElementById('select_gift_list_template').innerHTML
      var doTT = doT.template(template)
      $('.select_gift_list').append(doTT(data))
      $('.select-gift-num').html($('.select_gift_list tr').length)
      $('#select_gift_num').html($('.select_gift_list tr').length)
    } else {
      layer.msg('该赠品已被选择！')
    }
  }

  // 赠品列表
  coupon.show_gifts_list = function () {
    console.log('rule.show_gifts_list')

    // 标题
    var giftTitle = $('input[name=giftTitle]').val()
    var url = core.getHost() + '/merchant/giftList'

    var params = {}
    params.pageNum = coupon.pageno
    params.pageSize = coupon.cur_per_page
    params.goodsTitle = giftTitle

    $.post(url, params, function (data) {
      var e = data.value
      console.log('赠品列表')
      console.log(e)

      var tmpl = document.getElementById('show_gift_list_template').innerHTML
      var doTtmpl = doT.template(tmpl)
      $('.gifts_list').html(doTtmpl(e))
      $('.show-gift-num').html(e.total)
      var pages = Math.ceil(e.total / coupon.cur_per_page)

      $('#select-gift-box-pageinfo').data('sui-pagination', '')
      $('#select-gift-box-pageinfo').pagination({
        pages: e.pages,
        styleClass: ['pagination-large'],
        showCtrl: true,
        displayPage: 4,
        currentPage: coupon.pageno,
        onSelect: function (num) {
          coupon.pageno = num
          coupon.show_gifts_list()
        }
      })
      $('#select-gift-box-pageinfo').find('span:contains(共)').html('共' + pages + '页(' + e.total + '条记录)')
      $('.page_size_select').find('option[value=' + coupon.cur_per_page + ']').prop('selected', true)
      $('#select_all_gift_btn').attr('checked', false)
    })
  }

  return coupon
})

function copyGoodsToDetail(goodsRule) {
  console.log("copyGoodsToDetail")
  console.log(goodsRule)
  if (goodsRule.type) $("#goodsModifyModal select[name=__goodsIdsType]").val(goodsRule.type)

  if (goodsRule.promotion_goods && goodsRule.promotion_goods !== 'all') {
    copySelectedGoodsToShow(goodsRule.promotion_goods)
  }
}

function copySelectedGoodsToShow(goodsIds) {
  var url = 'goods/getGoodInfoByIdsAndFields'
  var params = {}
  params.ids = goodsIds
  params.fields = 'goods_id,goods_title,shop_price'

  doGetOrPost(url, params, 'get', false, function (data) {
    if (data.code === '000') {
      require(['goods_box'], function (goods_box) {
        var data_value = data.value
        for (var i = 0; i < data_value.length; i++) {
          goods_box.selectGoods(data_value[i])
        }
      })
    }
  })
}

/**
 * 获取满赠券的赠送条件
 */
function getGiftCondition(ruleType, $parent) {
  var $div = $parent.find('input[name=ruleType]:checked').next()
  var $span = $div.find('span')

  var ladderDate = getLadderDate($span, true, true)
  if (typeof(ladderDate) === 'string') {
    switch (ladderDate) {
      case 'leftEmpty':
        return '满件或满元不能为空'
      case 'leftNotIncre':
        return '满件或满元必须递增'
      case 'rightEmpty':
        return '赠送的件数不能为空'
      case 'rightNotIncre':
        return '赠送的件数必须递增'
    }
  }

  var result = []
  ruleType = parseInt(ruleType)
  if (ruleType === 1) {
    for (var i = 0; i < ladderDate.length; i++) {
      var obj = {}
      obj.meetNum = ladderDate[i].leftValue
      obj.sendNum = ladderDate[i].rightValue
      obj.ladder = i + 1
      result.push(obj)
    }
  } else if (ruleType === 2) {
    for (var i = 0; i < ladderDate.length; i++) {
      var obj = {}
      obj.meetMoney = ladderDate[i].leftValue * 1000 / 10
      obj.sendNum = ladderDate[i].rightValue
      obj.ladder = i + 1
      result.push(obj)
    }
  } else {
    return '不可能出现的错误'
  }

  return result
}

/**
 *
 * @param $spans
 * @param leftIncre true 代表 左边递增, false 则是递减
 * @param rightIncre true 代表 右边递增， false 则是递减
 */
function getLadderDate ($spans, leftIncre, rightIncre) {
  var old1 = 0, old2 = 0, new1 = 0, new2 = 0, result = []
  if (!leftIncre) old1 = 999999999
  if (!rightIncre) old2 = 999999999
  for (var i = 0; i < $spans.size(); i++) {
    new1 = parseFloat($spans.eq(i).find('input').eq(0).val())
    new2 = parseFloat($spans.eq(i).find('input').eq(1).val())

    if (!new1) return 'leftEmpty'
    if ((new1 > old1) !== leftIncre) return 'leftNotIncre'

    if (!new2) return 'rightEmpty'
    if ((new2 > old2) !== rightIncre) return 'rightNotIncre'

    var obj = {}
    obj.leftValue = old1 = new1
    obj.rightValue = old2 = new2
    result.push(obj)
  }

  return result
}

/**
 * 复制优惠券中的计算规则部分
 *
 * @param couponRule 优惠券规则数据
 */
function copyCouponRule (couponRule) {
  switch (couponRule.couponType) {
    case 100:
      copyCashCoupon(couponRule.goodsRule)
      break
    case 200:
      copyDiscountCoupon(couponRule.goodsRule)
      break
    case 300:
      copyLimitPriceCoupon(couponRule.goodsRule)
      break
    case 500:
      copyGiftCoupon(couponRule.goodsRule)
      break
  }
}

function copyGiftCoupon (goodsRule) {
  console.log('copyGiftCoupon')
  console.log(goodsRule)
  var $parent = $('#gift-coupon')
  $('a[href=#gift-coupon]').trigger('click')

  // 1、选择购买商品及组合方式：
  $parent.find('input[name=calculateBase][value=\'' + goodsRule.gift_calculate_base + '\']').trigger('click')
  copyPromotionGoodsCanEdit(goodsRule.type, goodsRule.promotion_goods)

  // 2、设置赠送条件：
  var $temp = $('input[name=ruleType][value=\'' + goodsRule.rule_type + '\']')
  $temp.trigger('click')

  var ruleConditions = goodsRule.rule
  for (var i = 0; i < ruleConditions.length; i++) {
    var $span = $temp.next().find('span').eq(i)
    if (goodsRule.rule_type === 1) {
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

  // 3、选择赠送的商品：
  $parent.find('input[name=sendType][value=' + goodsRule.rule_type + ']').trigger('click')
  var giftIds = getValueFromListMap(goodsRule.gift_storage, 'giftId')

  var url = 'goods/getGoodInfoByIdsAndFields'
  var params = {}
  params.ids = giftIds
  params.fields = 'goods_id,goods_title'

  doGetOrPost(url, params, 'get', false, function (data) {
    if (data.code === '000') {
      require(['coupon'], function (coupon) {
        var data_value = data.value
        for (var i = 0; i < data_value.length; i++) {
          data_value[i].gift_id = data_value[i].goods_id
          data_value[i].gift_title = data_value[i].goods_title
          data_value[i].gift_num = goodsRule.gift_storage[i].sendNum
          coupon.selectGifts(data_value[i])
        }

        $('#select-gifts-box').trigger('okHide')
      })
    }
  })
}

/**
 * 复制创建优惠券的时间规则
 *
 * @param timeRule 数据源
 */
function copyTimeRule (timeRule) {
  console.log(timeRule)
  switch (timeRule.validity_type) {
    case 1:
      $('input[name=validity_type][value=\'1\']').prop('checked', true)
      $('input[name=start_time]').val(timeRule.startTime)
      $('input[name=end_time]').val(timeRule.endTime)
      break
    case 2:
      $('input[name=validity_type][value=\'2\']').prop('checked', true)
      $('input[name=how_day]').val(timeRule.how_day)
      break
    case 4:
      $('input[name=validity_type][value=\'4\']').prop('checked', true)
      var m_date = timeRule.startTime.slice(0, 10)
      var m_start_time = timeRule.startTime.slice(11, 16)
      var m_end_time = timeRule.endTime.slice(11, 16)
      $('input[name=m_date]').val(m_date)
      $('input[name=m_start_time]').val(m_start_time)
      $('input[name=m_end_time]').val(m_end_time)
      break
  }
}

function copyCouponStore(couponList){
    var tmpl = document.getElementById('store_list_templetes').innerHTML
    var doTtmpl = doT.template(tmpl)
    var temp_ = doTtmpl(couponList);
    $('.select_stores_list').html(temp_);
    $('.stores_total').html(couponList.length )
    var selects = $('.select_stores_list').find('tr').length
    $('.select_stores_total').html(couponList.length)
}

/**
 * 复制现金券规则
 *
 * @param goodsRule
 */
function copyCashCoupon(goodsRule) {
    copyPromotionGoodsCanEdit(goodsRule.type, goodsRule.promotion_goods)
    switch (goodsRule.rule_type) {
        // 2、每满多少元，减多少元(按比例)
        case 0:
            var $0 = $('#cash_goods_every_money')
            var _temp = goodsRule.rule
            $0.find('input[name=Rule_type]').attr('checked', true)
            $0.find('input[name=each_full_money]').val(_temp.each_full_money / 100)
            $0.find('input[name=reduce_price]').val(_temp.reduce_price / 100)

            // 封顶
            if (_temp.max_reduce) {
                $0.find('input[name=max_reduce_checkbox]').attr('checked', true)
                $0.find('input[name=max_reduce]').val(_temp.max_reduce / 100)
            }

            // 运费
            /*if (goodsRule.is_post) {
                $0.find('input[name=contains_postage_checkbox]').attr('checked', true)
            }*/
            break

        // 3、满多少元，减多少元(自定义)
        case 1:
            var $1 = $('#cash_goods_every_money_ladder')
            $1.find('input[name=Rule_type]').attr('checked', true)
            copyLadderData('#cash_goods_every_money_ladder', 'each_full_money', 'reduce_price', goodsRule.rule)
            break

        // 1、有就减多少元
        case 4:
            var $4 = $('#cash_goods_direct')
            $4.find('input[name=Rule_type]').attr('checked', true)
            $4.find('input[name=direct_money]').val(goodsRule.rule.direct_money / 100)
            break
    }
}

/**
 * 复制折扣券规则
 *
 * @param goodsRule
 */
function copyDiscountCoupon(goodsRule) {
    copyPromotionGoodsCanEdit(goodsRule.type, goodsRule.promotion_goods)

    var $discountCouponGoods = $('#discount-coupon-goods')

    /* -- 切换标签 -- */
    $('#cash-coupon').removeClass('active')
    $('#discount-coupon').addClass('active')
    $('#type').find('li').eq(0).removeClass('active')
    $('#type').find('li').eq(1).addClass('active')

    /* -- 抹零设置 -- */
    var $isMl = $discountCouponGoods.find('input[name=is_ml]')
    var $isRound = $discountCouponGoods.find('input[name=is_round]')

    if (goodsRule.is_ml == 1) {
        $isMl.val(1)
        if (goodsRule.is_round == 0) {
            $discountCouponGoods.find('input[name=\'ml-radio\'][value=\'' + 3 + '\']').attr('checked', true)
            $isRound.val(0)
        } else if (goodsRule.is_round == 1) {
            $discountCouponGoods.find('input[name=\'ml-radio\'][value=\'' + 1 + '\']').attr('checked', true)
            $isRound.val(1)
        }
    } else if (goodsRule.is_ml == 2) {
        $isMl.val(2)
        if (goodsRule.is_round == 0) {
            $discountCouponGoods.find('input[name=\'ml-radio\'][value=\'' + 4 + '\']').attr('checked', true)
            $isRound.val(0)
        } else if (goodsRule.is_round == 1) {
            $discountCouponGoods.find('input[name=\'ml-radio\'][value=\'' + 2 + '\']').attr('checked', true)
            $isRound.val(1)
        }
    }

    /* -- 优惠券计算规则主体复制 -- */
    switch (goodsRule.rule_type) {
        // 2、满多少元，打多少折
        case 1:
            var $1 = $('#discount_goods_money')
            $1.find('input[name=Rule_type]').attr('checked', true)
            copyLadderData('#discount_goods_money', 'meet_money', 'discount', goodsRule.rule)

            /*if (goodsRule.is_post) {
                $1.find('input[name=discount_goods_money_has_post]').attr('checked', true)
            }*/
            break

        // 3、满多少件，打多少折 阶梯
        case 2:
            var $1 = $('#discount_goods_num')
            $1.find('input[name=Rule_type]').attr('checked', true)
            copyLadderData('#discount_goods_num', 'meet_num', 'discount', goodsRule.rule)
            break

        // 1、设置打折比率
        case 4:
            var $4 = $('#discount_goods_direct')
            var _temp = goodsRule.rule
            $4.find('input[name=Rule_type]').attr('checked', true)
            $4.find('input[name=direct_discount]').val(_temp.direct_discount / 10)

            if (_temp.max_reduce) {
                $4.find('input[name=max_reduce_sign]').attr('checked', true)
                $4.find('input[name=max_reduce]').val(_temp.max_reduce / 100)
            }
            break

        // 3、满多少件，打多少折 第二件
        case 5:
            var $5 = $('#discount_goods_num_per')
            var _temp = goodsRule.rule
            $5.find('input[name=Rule_type]').attr('checked', true)
            $5.find('input[name=discount]').val(_temp.discount / 10)

            if (_temp.max_buy_num) {
                $5.find('input[name=max_reduce_sign]').attr('checked', true)
                $5.find('input[name=max_reduce]').val(_temp.max_buy_num)
            }
            break
    }
}

/**
 * 复制限价券规则
 *
 * @param goodsRule
 */
function copyLimitPriceCoupon(goodsRule) {
    copyPromotionGoodsCanEdit(goodsRule.type, goodsRule.promotion_goods)

    // 切换标签
    $('#cash-coupon').removeClass('active')
    $('#limit-price-coupon').addClass('active')
    $('#type').find('li').eq(0).removeClass('active')
    $('#type').find('li').eq(2).addClass('active')

    var $limitPriceCoupon = $('#limit-price-coupon')

    var _temp = goodsRule.rule
    $limitPriceCoupon.find('input[name=each_goods_price]').val(_temp.each_goods_price / 100)
    $limitPriceCoupon.find('input[name=buy_num_max]').val(_temp.buy_num_max)
    $limitPriceCoupon.find('input[name=each_goods_max_buy_num]').val(_temp.each_goods_max_buy_num)
}

/**
 * 复制阶梯数据，仅用于复制优惠券中
 *
 * @param _location 阶梯所在的位置
 * @param key1 阶梯左边的input的name属性
 * @param key2 阶梯右边的input的name属性
 * @param arr 阶梯数据数组
 */
function copyLadderData(_location, key1, key2, arr) {
    var $location = $(_location)
    for (var i = 0; i < arr.length; i++) {
        if (i != 0) {
            $location.find('input[name=_add]').eq(0).trigger('click')
        }

        var value1
        if (arr[i].meet_money) {
            value1 = arr[i].meet_money / 100
        } else {
            value1 = arr[i].meet_num
        }

        var value2
        if (arr[i].discount) {
            value2 = arr[i].discount / 10
        } else {
            value2 = arr[i].reduce_price / 100
        }

        $location.find('p').eq(i).find('input[name=' + key1 + ']').val(value1)
        $location.find('p').eq(i).find('input[name=' + key2 + ']').val(value2)
    }
}

/**
 * 复制选择商品部分，并且可修改
 *
 * @param type 0全部商品参加 2指定商品参加 3指定商品不参加
 * @param value 指定或指定不参加的商品id集合(用逗号隔开)
 */
function copyPromotionGoodsCanEdit (type, value) {
  if (type == '0') {
    $('select[name=type]').val(type)
  } else {
    $('input[name=much_select_goods_id]').val(value)

    // 在选中的商品列显示
    var url = '/merchant/queryGoodsInfoByIds'
    var params = {}
    params.goodsIds = value

    ajax_lucas(url, params, 'GET', true, function (data) {
      if (data.code == '000' && data.value.length > 0) {
        var template = document.getElementById('select_product_list_templete').innerHTML
        var doTTemplate = doT.template(template)

        $.each(data.value, function (_index, goods) {
          console.log(goods)
          $('.select_goods_list').append(doTTemplate(goods))
        })

        $('.select_goods_total').text(data.value.length)
        $('.select-goods-ok').trigger('click')
      }
    })

    $('select[name=type]').val(type)
    $('select[name=type]').trigger('change')
    $('select[name=typeRule]').val(type)
    $('select[name=typeRule]').trigger('change')
  }
}

$(document).ready(function () {
    if ($('#type').find('.active').text() == '现金券') {
        if ($('[name=type] option:selected').val() == 0) {
            $('.full_check').hide()
        }
    }
})

/**
 * 垂直滚动到带有id的位置（居中）
 *
 * @param id
 */
function scrollTop(id) {
    var scrollTop = $(id).position().top - ($(window).height() / 2)
    scrollTop = scrollTop < 0 ? 0 : scrollTop
    $(document).scrollTop(scrollTop)
}

/**
 * 触发 "select[name=typeRule]" 的change事件
 */
function tea() {
    $('select[name=typeRule]').next('p').show()

    var _type = $('select[name=typeRule]').val()

    $('select[name=type]').val(_type)
    $('.full_check').show()
    $('input[name=cash_coupon_limit_type][value=\'0\']').attr('checked', true)
    $('input[name=discount_coupon_limit_type][value=\'0\']').attr('checked', true)
}

/**
 * 获取优惠券规则列表页使用和未使用数量
 */
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

  doGetOrPostOrJson(url, obj, 'get', false, function (data) {
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
}

/* -- important 请把工具类的函数放在最下面方便查找使用 -- */
/* -- important 请把工具类的函数放在最下面方便查找使用 -- */
/* -- important 请把工具类的函数放在最下面方便查找使用 -- */
/* -- important 请把工具类的函数放在最下面方便查找使用 -- */
/* -- important 请把工具类的函数放在最下面方便查找使用 -- */
/* -- important 请把工具类的函数放在最下面方便查找使用 -- */
/**
 *
 * @param url
 * @param params
 * @param type 'post" or 'get"
 * @param async ajax同步还是异步
 * @param callback 回调函数
 */
function doGetOrPost (url, params, type, async, callback, failCallback) {
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
      failCallback()
    }
  })

  return result
}

function ajax_lucas(url, params, type, async, callback) {
  $.ajax({
    url: url,
    type: type,
    data: params,
    async: async,
    success: function (data) {
      callback(data)
    }
  })
}

/**
 * 从List<Map>的json串中取出map中的某个字段，用逗号拼接
 * @param arr
 * @param key
 */
function getValueFromListMap (arr, key) {
  var result = []
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key]) result.push(arr[i][key])
  }
  return result.join(',')
}

/**
 * 校验数据，如果出错则给出错误信息
 *
 * @param _val
 *          要校验的数据
 * @param wrongRule
 *          错误的校验规则
 * @param msg
 *          错误提示
 */
function verifyOrElseMsg(_val, wrongRule, msg) {
  if (wrongRule.test(_val)) {
    layer.msg(msg)
    return false
  }
  return true
}

function dataFormat(date, fmt) {
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  return fmt
}
