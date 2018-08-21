package com.chenpt.designModel.viewModel;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: chenpengtao
 * @Description: 观察者模式
 * @Date: created in 2018/7/23
 * @Modified By:
 */
public interface Subject {

    /*增加观察者*/
    public void add(Observer observer);

    /*删除观察者*/
    public void del(Observer observer);

    /*通知所有的观察者*/
    public void notifyObservers();

    /*自身的操作*/
    public void operation();

}
