/**
 * Created by Administrator on 2017/3/12.
 */

define(['core'], function (core) {
  var base_info = {
    checkSeller: function () {
      var beneficiary_party = $('#change_settlement').find('#beneficiary_party').val();  //公司名称
      var bank_name = $('#change_settlement').find('#bank_name').val();
      var bank_id = $('#change_settlement').find('#bank_id').val();
      var sellerName = $('#sellerName').html();

      if (sellerName == '') {
        $('.first_remind').removeClass('hide').html('请检查商家名称;');
        return false;
      } else {
        $('.first_remind').addClass('hide')
      }

      if (beneficiary_party == '') {
        $('.first_remind').removeClass('hide').html('公司名称不能为空;');
        return false;
      } else {
        $('.first_remind').addClass('hide')
      }

      if (bank_name == '') {
        $('.first_remind').removeClass('hide').html('开户行不能为空');

        return false;
      } else {
        $('.first_remind').addClass('hide')
      }

      if (bank_id == '') {
        $('.first_remind').removeClass('hide').html('该账号为结算打款账号，请认真填写');

        return false;
      } else {
        $('.first_remind').addClass('hide')
      }

      $('#change_settlement').modal('hide');
      $('#check_btn').modal('show');

    },

    saveSeller: function () {
      var beneficiary_party = $('#change_settlement').find('#beneficiary_party').val();  //公司名称
      var bank_name = $('#change_settlement').find('#bank_name').val();
      var bank_id = $('#change_settlement').find('#bank_id').val();
      var sellerName = $('#sellerName').html();

      var param = {};
      param.beneficiaryParty = beneficiary_party;
      param.bankId = bank_id;
      param.bankName = bank_name;
      param.sellerName = sellerName;
      $('#check_btn').modal('hide');
      
      var url = core.getHost() + '/merchant/editSeller';
      console.log(url);
      console.log(param);
      $.post(url, param, function (res) {
        console.log(res);
        if (res.status == 'success') {
          $('#seller_name_info').html(beneficiary_party);
          $('#bank_id_info').html(param.bankId);
          $('#bank_name_info').html(param.bankName);
          layer.msg('修改成功');
        } else {
          layer.msg('修改失败');
        }
      })
    }
  };


  return base_info;
});
