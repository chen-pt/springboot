package com.chenpt.designModel.responsibilityModel;

/**
 * @Author: chen
 * @Description:  管理者
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public abstract class Manager {
    protected String name;
    protected Manager superManager;//管理者的上级

    Manager(String name){
        this.name=name;
    }

    public void setSuperManager(Manager superManager){
        this.superManager=superManager;
    }

    //申请请求
    public abstract void requestApplication(Request request);

}
