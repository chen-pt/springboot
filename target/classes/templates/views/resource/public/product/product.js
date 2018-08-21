/*eslint-disable camelcase*/
/*eslint-disable space-return-throw-case*/
/*eslint-disable space-after-keywords*/
define([], function () {
    function getTplData (detailTpl, fieldName) {
        detailTpl = detailTpl || 20;
        var fieldMap = {
            goodsProperty: goodsPropertyItem,
            drugCategory: drugCategoryItem,
            goodsUse: goodsUseItem,
            goodsForts: goodsFortsItem,
            goodsForpeople: goodsForpeopleItem,
            goodsIsMedicare: goodsIsMedicareItem,
            goodsStatus: goodsStatusItem,
            updateStatus: updateStatusItem,
            controlNum: controlNumItem,
        };

        // 模板字段
        var tplFieldConfig = {
            goodsProperty: {
                'default': [110, 120, 130, 140, 150, 160, 170],
                '10': [110, 120, 130, 140, 150, 160, 170, 9999],
                '20': [],
                '30': [],
                '40': [],
                '60': [],
                '70': [180, 190, 200, 210, 220, 230, 240, 250, 260, 9999],
                '80': [],
            },
            drugCategory: {
                'default': [110, 120, 130, 140],
                '30': [170, 180, 190],
                '70': [150, 160],
            },
            goodsUse: {
                'default': [110, 120, 130, 140, 9999],
            },
        };

        if (tplFieldConfig[fieldName]) {
          /*eslint-disable*/
            var fieldTplKey = tplFieldConfig[fieldName][detailTpl] || tplFieldConfig[fieldName]['default'];
            return _.filter(fieldMap[fieldName], function (v) {
                return fieldTplKey.indexOf(+v.value) !== -1;
            });
        }

        return fieldMap[fieldName] || {};
    }

    function getRequireFields (detailTpl) {
        // 必填的
        var publicRequired = [
          'goods_code', 'specif_cation', 'goods_company', 'goods_indications','com_name',
            'user_cateid', 'goods_title', 'goods_weight', 'shop_price', 'in_stock', 'purchase_way',
        ];
        if(detailTpl != 10){
            publicRequired.push('drug_name');
        }
        var requiredFields = {};
        requiredFields[10] = ['approval_number', 'drug_category', 'adverse_reactioins', 'goods_note', 'goods_contd', 'goods_use_method'];
        requiredFields[40] = ['approval_number', 'goods_use_method'];
        requiredFields[80] = ['approval_number'];
        requiredFields[60] = ['approval_number'];
        requiredFields[30] = ['approval_number'];
        requiredFields[50] = ['approval_number'];
        requiredFields[70] = [];
        requiredFields[20] = [];
        requiredFields[100] = [];

        return publicRequired.concat(requiredFields[+detailTpl || 20]);
    }

    function getAliasFields (detailTpl) {
        // 字段名不一样的
        var aliasFields = {};
        aliasFields[10] = { 'com_name': '通用名', 'drug_name': '商品名'};
        aliasFields[40] = {
          'goods_validity': '保质期',
          'goods_indications': '功能介绍',
          'drug_name': '产品名称',
          'goods_indications': '保健功能',
          'goods_use_method': '食用方法',
          'goods_deposit': '储藏方法'
        };
        aliasFields[80] = { 'goods_validity': '保质期', 'goods_indications': '功能介绍'};
        aliasFields[60] = { 'goods_validity': '保质期', 'goods_indications': '功能介绍'};
        aliasFields[30] = { 'drug_category': '类别', 'main_ingredient': '产品参数', 'goods_indications': '功能介绍', 'goods_action': '产品特色'};
        aliasFields[70] = {
            'com_name': '别名',
            'drug_name': '中药名',
            'goods_company': '产地分布',
            'drug_category': '是否方剂',
            'goods_property': '药用部位',
            'goods_use_method': '临床应用',
            'forpeople_desc': '药物性状',
            'goods_action': '药物形态',
            'adverse_reactioins': '不良反应',
        };
        aliasFields[20] = {
          'drug_name': '产品名称',
          'goods_validity': '保质期',
          'goods_indications': '功能介绍',
          'goods_action': '产品特色',
          'goods_deposit': '储存条件'
        };
        aliasFields[100] = {'drug_name': '医生','goods_indications':'预约信息','goods_desc':'医生详情'};

        return aliasFields[detailTpl || 20];
    }

    function getHideFields (detailTpl) {
        // 不显示的字段
        var hideFields = [];
        hideFields[10] = ['goods_usage', 'forpeople_desc'];
        hideFields[40] = ['com_name', 'drug_category', 'goods_property', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'goods_action'];
        hideFields[80] = hideFields[60] = hideFields[40];
        hideFields[30] = ['com_name', 'goods_property', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'goods_forts'];
        // brand_id 是一个hidden
        hideFields[70] = ['approval_number', 'brand_name', 'goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'bar_code'];
        hideFields[20] = ['com_name', 'drug_category', 'goods_property', 'goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code'];
        hideFields[100] = ['approval_number','specif_cation','goods_company','barnd_name','goods_code','goods_tagsid','qualification_default','goods_title','goods_description','goods_batch_no','goods_validity','bar_code','main_ingredient','goods_use_method','goods_usage','goods_action','adverse_reactioins','goods_note','goods_contd','goods_deposit','forpeople_desc','com_name', 'drug_category', 'goods_property', 'goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code','market_price','cost_price','in_stock','goods_weight','control_num','purchase_way'];

        return hideFields[detailTpl || 20];
    }

    function findFieldInputEle (v) {
        var $ele = $('#' + v);
        if (!$ele.length) {
            $ele = $('[name=' + v + ']');
            if (!$ele.length) {
                $ele = $('[name="' + v + '[]"]');
            }
        }

        return $ele;
    }

    function initFieldInfo(detailTpl) {
        // 隐藏字段
        getHideFields(detailTpl).forEach(function (v) {
            findFieldInputEle(v).parents('.control-group:eq(0)').remove();
        });

        // 改名
        var aliasField = getAliasFields(detailTpl);
        Object.keys(aliasField).forEach(function (v) {
            var $ele = findFieldInputEle(v);
            try {
                // var html = $ele.parents('.control-group:eq(0)').find('.control-label').html();
                var html = aliasField[v] + '：';
                $ele.parents('.control-group:eq(0)').find('.control-label').empty().append(html);
            } catch (e) {}
        });

        // 必填
        getRequireFields(+detailTpl).forEach(function (v) {
            var $ele = findFieldInputEle(v);

            var rules = $ele.data('delay') || $ele.data('rules');
            rules = rules ? 'required|' + rules : 'required';
            try {
                var html = $ele.parents('.control-group:eq(0)').find('.control-label').html();
                html = html.replace(/(.*?)(<.*?>\*<\/.*?>)*：/, '$1<strong class="red">*</strong>：');
                $ele.parents('.control-group:eq(0)').find('.control-label').html(html);
            } catch (e) {}
            $ele.attr('data-rules', rules);
        });
    };

    // region 药品属性
    var goodsPropertyItem = [{
        key: '请选择',
        value: 0,
    }, {
        key: '化学药制剂',
        value: 110,
    }, {
        key: '中成药',
        value: 120,
    }, {
        key: '生物制品',
        value: 130,
    }, {
        key: '抗生素',
        value: 140,
    }, {
        key: '中药材',
        value: 150,
    }, {
        key: '中药饮片',
        value: 160,
    }, {
        key: '复方制剂',
        value: 170,
    }, {
        key: '根茎类',
        value: 180,
    }, {
        key: '茎木类',
        value: 190,
    }, {
        key: '皮类',
        value: 200,
    }, {
        key: '叶类',
        value: 210,
    }, {
        key: '花类',
        value: 220,
    }, {
        key: '全草类',
        value: 230,
    }, {
        key: '果实种子类',
        value: 240,
    }, {
        key: '矿物类',
        value: 250,
    }, {
        key: '动物类',
        value: 260,
    }, {
        key: '其它',
        value: 9999,
    }];
    // endregion

    // region 药品类别
    var drugCategoryItem = [{
        key: '甲类非处方药',
        value: 110,
    }, {
        key: '乙类非处方药',
        value: 120,
    }, {
        key: '处方药',
        value: 130,
    }, {
        key: '双轨药',
        value: 140,
    }, {
        key: '非方剂',
        value: 150,
    }, {
        key: '方剂',
        value: 160,
    }, {
        key: '一类',
        value: 170,
    }, {
        key: '二类',
        value: 180,
    }, {
        key: '三类',
        value: 190,
    }];
    // endregion

    // region 使用方法
    var goodsUseItem = [{
        key: '口服',
        value: 110,
    }, {
        key: '外用',
        value: 120,
    }, {
        key: '注射',
        value: 130,
    }, {
        key: '含服',
        value: 140,
    }, {
        key: '其它',
        value: 9999,
    }];
    // endregion

    // region 剂型
    var goodsFortsItem = [{key: '片剂', value: 110}, {key: '胶囊', value: 120}, {key: '丸剂', value: 130},
        {key: '颗粒', value: 140}, {key: '液体', value: 150}, {key: '软膏剂', value: 160},
        {key: '贴剂', value: 170}, {key: '糖浆', value: 180}, {key: '散剂', value: 190},
        {key: '栓剂', value: 200}, {key: '喷雾', value: 210}, {key: '溶液剂', value: 220}, {key: '乳剂', value: 230},
        {key: '混悬剂', value: 240}, {key: '气雾剂', value: 250}, {key: '粉雾剂', value: 260}, {key: '洗剂', value: 270},
        {key: '搽剂', value: 280}, {key: '糊剂', value: 290}, {key: '凝胶剂', value: 300}, {key: '滴眼剂', value: 310},
        {key: '滴鼻剂', value: 320}, {key: '滴耳剂', value: 330}, {key: '眼膏剂', value: 340}, {key: '含漱剂', value: 350},
        {key: '舌下片剂', value: 360}, {key: '粘贴片', value: 370}, {key: '贴膜剂', value: 380}, {key: '滴剂', value: 390},
        {key: '滴丸剂', value: 400}, {key: '芳香水剂', value: 410}, {key: '甘油剂', value: 420}, {key: '醑剂', value: 430},
        {key: '注射剂', value: 440}, {key: '涂膜剂', value: 450}, {key: '合剂', value: 460}, {key: '酊剂', value: 470},
        {key: '膜剂', value: 480}, {key: '其它', value: 9999}];
    // endregion

    // region 适用人群
    var goodsForpeopleItem = [{
        key: '不限',
        value: 110,
    }, {
        key: '成人',
        value: 120,
    }, {
        key: '婴幼儿',
        value: 130,
    }, {
        key: '儿童',
        value: 140,
    }, {
        key: '男性',
        value: 150,
    }, {
        key: '妇女',
        value: 160,
    }, {
        key: '中老年',
        value: 170,
    }];
    // endregion

    // region 是否医保
    var goodsIsMedicareItem = [{
        key: '非医保',
        value: '1',
    }, {
        key: '甲类医保',
        value: '2',
    }, {
        key: '乙类医保',
        value: '3',
    }];
    // endregion

    // region 限购
    var controlNumItem = [{
        key: '不限购',
        value: 0,
    }, {
        key: '限购',
        value: 1,
    }];
    // endregion

    // region yb商品状态
    var goodsStatusItem = [{
        key: '未审核（不允许商家使用）',
        value: '1',
    }, {
        key: '已审核（允许商家使用）',
        value: '2',
    }, {
        key: '初审（药师初审，不允许商家使用）',
        value: '10',
    }];
    // endregion

    // region yb更新状态
    var updateStatusItem = [{
        key: '锁定（不接受商家更新）',
        value: '0',
    }, {
        key: '可更新（接受商家更新）',
        value: '1',
    }];
    // endregion

    return {
        getTplData: getTplData,
        initFieldInfo: initFieldInfo,
    }
});
