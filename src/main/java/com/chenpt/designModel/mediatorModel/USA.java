package com.chenpt.designModel.mediatorModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class USA extends Country {
    USA(UniteNations uniteNations) {
        super(uniteNations);
    }

    public void declare(String message){
        uniteNations.declare(message,this);
    }

    public void getMessage(String message){
        System.out.println("美国获得对方消息："+message);
    }
}
