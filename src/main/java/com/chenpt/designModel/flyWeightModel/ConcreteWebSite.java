package com.chenpt.designModel.flyWeightModel;

/**
 * @Author: chenpengtao
 * @Description: 具体网站实现
 * @Date: created in 2018/8/20
 * @Modified By:
 */
public class ConcreteWebSite implements WebSite {

    private String name;//网站名

    ConcreteWebSite(String name){
        this.name=name;
    }

    @Override
    public void use(User user) {
        System.out.println("网站分类："+name+"用户："+user.getName());
    }
}
