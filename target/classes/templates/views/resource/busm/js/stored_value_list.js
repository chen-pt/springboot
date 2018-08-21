/**
 * Created by Administrator on 2016/8/31.
 */
require(['common', 'core/pagin', 'vue', 'sui'], function(YBZF, pagin, Vue) {

    Vue.config.delimiters=["<%=", "%>"];
    // Vue.config.silent = true;
    var vm = new Vue({
        el:"#test-list",
        replace: false,
        template: '#test-list-temp',
        data:function(){
            return { result:'',status:'',pay_style:{"1":"微信","2":"支付宝","3":"现金"},orders_status:{"110":"未支付","120":"失败","200":"支付成功","0":"其他"}}
        },
        ready: function () {
            var _self=this;
            _self.getstoredvalueList();

        },
        methods:{
            getstoredvalueList:function () {
                getList(this,1);
            }
        }
    });
    function getList(_self,pageno){
        $(function(){
            var url=YBZF.hostname + '/distribut/get_stored_value_list';
            var datas = {};
            datas.current_page= pageno || 1;
            datas.per_page=$('.page-size-sel').val() || 15;
            pagesize = $('.page-size-sel').val() || 15;
            YBZF.services({
                url:url,
                type:'post',
                data:datas,
            }).done(function(data) {
                _self.result = data.result;
                _self.status = data.status;
                if (data.status) {
                    var $pagin = $('#pagination');
                    pagin($pagin, pageno, data.result.total_pages, pagesize, data.result.total_items, getList.bind(self,vm));
                    $pagin.show();
                }else {
                    $pagin.hide();
                }
            });
        });
    }
});