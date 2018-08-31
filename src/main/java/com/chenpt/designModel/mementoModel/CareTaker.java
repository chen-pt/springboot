package com.chenpt.designModel.mementoModel;

/**
 * @Author: chen
 * @Description: 管理者
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class CareTaker {
    private Memento memento;//得到或设置备忘录

    public Memento getMemento() {
        return memento;
    }

    public void setMemento(Memento memento) {
        this.memento = memento;
    }
}
