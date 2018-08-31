package com.chenpt.designModel.templateModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class BasketballGame extends Game {
    @Override
    void initGame() {
        System.out.println("篮球运动准备中···");
    }

    @Override
    void startGame() {
        System.out.println("开始比赛···");
    }

    @Override
    void endGame() {
        System.out.println("比赛结束");
    }
}
