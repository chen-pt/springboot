/**
 * Created by wt on 2015/7/13.
 */

require.config({
    paths:{
        'core':'../lovejs/core',
        'tools':'../lovejs/tools',
        'clerk': 'service/clerk'

    }
});


/**
 * 初始化
 */
$(function () {

    require(['core'], function (core) {
        //doT
        core.doTinit();
        //重写console
        core.ReConsole();
    });

    /**
     * 路由
     * @type {string}
     */
    var url =  window.location.pathname;

    switch (url)
    {
        case '/clerk/index':initClerk();break;
        case '/clerk/edit':initeditClerk();break;
    }
    //调配店员
    $(document).on('click','.allocate-btn',function() {
        $("#ChangeStore-modal").modal("show");
        $(this).parents('html').find('body').css({'overflow-y': 'hidden'});
        searchSoreOninput();
    });
    $(document).on('focus','#autocomplete',function() {
        $(this).val('');
    });
    $(document).on('click','.hangeStore-close',function() {
        $(this).parents('html').find('body').css({'overflow-y': 'auto'});
    });
    
    //门店调配记录按钮
    $(document).on('click','#allocate_history-btn',function () {
        $("#allocateHistory-modal").modal("show");
        getAllocateHistory(1);
    })

    //门店调用记录搜索按钮
    $(document).on('click','#allocate_btn',function () {
        $("#allocateHistory-modal").modal("show");
        getAllocateHistory(1,'search');
    })
});


/*=============店员管理=============*/
//主页初始化
function initClerk()
{
    require(['clerk'], function (clerk){
        clerk.showClerks('default',1);
    });
}

//修改页面初始化
function initeditClerk() {
    require(['clerk'], function (clerk){
        clerk.setinfo();
    });
}

//添加店员
function addClerk()
{
    require(['clerk'], function (clerk){
        clerk.addClerks();
    });
}
//店员搜索
function searchclerk()
{
    require(['clerk'], function (clerk){
        clerk.showClerks('search',1);
    });
}
//修改店员
function editClerk()
{
    require(['clerk'], function (clerk){
        clerk.editClerks();
    });
}

//删除店员
function deleteclerk(clerk_id)
{
    require(['clerk'], function (clerk){
        clerk.deleteClerks(clerk_id);
    });
}
//调配店员
function searchSoreOninput() {
    require(['clerk'], function(clerk){
        clerk.showstorelist()
    })
}

function linead() {
    require(['clerk'], function(clerk){
        clerk.showChangeStore();
    })
}

//获取门店的调配记录
function getAllocateHistory(page,opt){
    require(['clerk'],function (clerk) {
        clerk.showAllocateHistory(page,opt);
    })
}
