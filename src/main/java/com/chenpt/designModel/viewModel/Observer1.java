package com.chenpt.designModel.viewModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/23
 * @Modified By:
 */
public class Observer1 extends Observer {
    @Override
    public void update() {
        System.out.println("observer1 has received!");
    }
}
