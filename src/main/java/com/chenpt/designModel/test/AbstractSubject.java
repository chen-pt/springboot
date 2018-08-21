package com.chenpt.designModel.test;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Vector;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/24
 * @Modified By:
 */
public abstract class AbstractSubject implements ISubject {
    Vector<Observer> observerList = new Vector<>();

    public void add(Observer observer) {
        observerList.add(observer);
    }

    public void del(Observer observer) {
        observerList.remove(observer);
    }

    @Override
    public void notifyAllObj() {
        Enumeration<Observer> enumeration = observerList.elements();
        while (enumeration.hasMoreElements()){
            enumeration.nextElement().upd();
        }
    }
}
