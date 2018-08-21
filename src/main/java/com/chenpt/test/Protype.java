package com.chenpt.test;

/**
 * 版权所有(C) 2017 上海银路投资管理有限公司
 * 描述: 原型模式
 * 作者: chen_pt
 * 创建日期: 2018/6/7
 * 修改记录:
 */
public class Protype implements Cloneable {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    Protype(String name){
        this.name=name;
    }

    public Object getProtype(){
        try {
            return super.clone();
        } catch (CloneNotSupportedException e) {
            return null;
        }
    }


    public String toString(){
//        System.out.println(name);
        return name;
    }

}
