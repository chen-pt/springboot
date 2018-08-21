package com.chenpt.designModel.test;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/24
 * @Modified By:
 */
public class MySubject extends AbstractSubject {
    @Override
    public void operation() {
        System.out.println("发出通知");
        notifyAllObj();
    }
}
