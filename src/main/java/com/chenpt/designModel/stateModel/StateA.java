package com.chenpt.designModel.stateModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/31
 * @Modified By:
 */
public class StateA implements State {
    @Override
    public void doAction(Context context) {
        context.setState(this);
    }

    public String toString(){
        return "this is stateA";
    }
}
