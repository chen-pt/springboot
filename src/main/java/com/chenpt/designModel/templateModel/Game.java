package com.chenpt.designModel.templateModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public abstract class Game {

    abstract void initGame();
    abstract void startGame();
    abstract void endGame();

    public void play(){
        initGame();//初始化游戏
        startGame();//开始游戏
        endGame();//游戏结束
    }

}
