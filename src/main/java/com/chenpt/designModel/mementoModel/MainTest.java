package com.chenpt.designModel.mementoModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] a){
        Originator originator = new Originator();
        originator.setState("on");
        originator.show();

        CareTaker careTaker = new CareTaker();
        careTaker.setMemento(originator.setStateToMemento());

        originator.setState("off");
        originator.show();

        originator.getStateFromMemento(careTaker.getMemento());
        originator.show();
    }

}
