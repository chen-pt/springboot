package com.chenpt.designModel.mementoModel;

/**
 * @Author: chen
 * @Description: 发起人
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class Originator {
    private String state;//需要保存的属性

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    /**
     * 创建备忘录，将当前需要保存的数据导入并实例化一个memento对象
     * @return
     */
    public Memento setStateToMemento(){
        return new Memento(state);
    }

    /**
     * 恢复备忘录，将memento导入并将相关数据恢复
     * @param memento
     */
    public void getStateFromMemento(Memento memento){
        state = memento.getState();
    }

    /**
     * 数据展示
     */
    public void show(){
        System.out.println(state);
    }
}
