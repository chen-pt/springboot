package com.chenpt.designModel.templateModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] args){
        Game bgame = new BasketballGame();
        bgame.play();
        System.out.println("=============无敌分割线===============");
        Game fgame = new FootballGame();
        fgame.play();
    }

}
