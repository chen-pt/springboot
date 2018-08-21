package com.chenpt.designModel.test;


/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/24
 * @Modified By:
 */
public interface ISubject {


    public void add(Observer observer);//添加观察者
    public void del(Observer observer);//删除观察者
    public void notifyAllObj();//通知所有观察者


    public void operation();//自身操作


}
