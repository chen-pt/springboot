package com.chenpt.designModel.adapterModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/24
 * @Modified By:
 */
public class MainTest {


    public static void main(String[] args){
        Center center = new Center("大鲨鱼");
        center.attack();
        center.defense();
        Guard guard = new Guard("科比");
        guard.attack();
        guard.defense();

        ForeignCenter center2 = new ForeignCenter("姚明");//姚明哥哥表示不懂你在说什么

        Translator translator = new Translator(center2);
        translator.attack();
        translator.defense();


    }

}
