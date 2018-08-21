package com.chenpt.enumdemo;

/**
 * 版权所有(C) 2017 上海银路投资管理有限公司
 * 描述:
 * 作者: chen_pt
 * 创建日期: 2018/4/16
 * 修改记录:
 */
public enum EnumDemo1 {

    GREEN(1,"绿色"),RED(2,"红色"),WHITE(3,"白色"),BLACK(4,"黑色");


    EnumDemo1(int x ,String key) {
        this.key=key;
    }

    private String key;
    private Integer x;

    public String getKey() {
        return key;
    }


}
