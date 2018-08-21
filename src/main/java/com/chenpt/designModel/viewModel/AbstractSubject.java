package com.chenpt.designModel.viewModel;

import java.util.Enumeration;
import java.util.Vector;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/23
 * @Modified By:
 */
public abstract class AbstractSubject implements Subject {

    private Vector<Observer> vector = new Vector<Observer>();

    @Override
    public void add(Observer observer) {
        vector.add(observer);
    }

    @Override
    public void del(Observer observer) {
        vector.remove(observer);
    }

    @Override
    public void notifyObservers() {
        Enumeration<Observer> enumo = vector.elements();
        while(enumo.hasMoreElements()){
            enumo.nextElement().update();
        }
    }

}
