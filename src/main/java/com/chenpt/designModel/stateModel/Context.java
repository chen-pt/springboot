package com.chenpt.designModel.stateModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/31
 * @Modified By:
 */
public class Context {
    private State state;

    Context(){
        this.state=null;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }
}
