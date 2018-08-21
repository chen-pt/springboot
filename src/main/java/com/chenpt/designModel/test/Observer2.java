package com.chenpt.designModel.test;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/24
 * @Modified By:
 */
public class Observer2 implements Observer {
    @Override
    public void upd() {
        System.out.println("客户2收到");
    }
}
