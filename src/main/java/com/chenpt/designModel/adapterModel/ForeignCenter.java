package com.chenpt.designModel.adapterModel;

/**
 * @Author: chen
 * @Description: 外籍中锋
 * @Date: created in 2018/8/24
 * @Modified By:
 */
public class ForeignCenter {
    private String name;

    ForeignCenter(String name){
        this.name=name;
    }

    public void 进攻() {
        System.out.println("外籍中锋进攻："+name);
    }

    public void 防守() {
        System.out.println("外籍中锋防守："+name);
    }
}
