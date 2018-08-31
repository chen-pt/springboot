package com.chenpt.designModel.mediatorModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class Iraq extends Country {
    Iraq(UniteNations uniteNations) {
        super(uniteNations);
    }

    public void declare(String message){
        uniteNations.declare(message,this);
    }

    public void getMessage(String message){
        System.out.println("伊拉克获得对方消息："+message);
    }
}
