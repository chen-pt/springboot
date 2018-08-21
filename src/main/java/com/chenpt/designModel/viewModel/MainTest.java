package com.chenpt.designModel.viewModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/23
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] args) {
        Subject sub = new MySubject();
        sub.add(new Observer1());
        sub.add(new Observer2());

        sub.operation();
    }

}
