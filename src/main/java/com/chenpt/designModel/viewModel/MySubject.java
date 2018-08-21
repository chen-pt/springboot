package com.chenpt.designModel.viewModel;


/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/23
 * @Modified By:
 */
public class MySubject extends AbstractSubject {

    @Override
    public void operation() {
        System.out.println("update self!");
        notifyObservers();
    }

}
