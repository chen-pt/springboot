package com.chenpt.designModel.mediatorModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] as){

        UniteNationsSecurity security = new UniteNationsSecurity();

        USA usa = new USA(security);
        Iraq iraq = new Iraq(security);

        security.setUSA(usa);
        security.setIraq(iraq);

        usa.declare("不准研制核武器，否则发动战争");
        iraq.declare("我们没有核武器，也不怕侵略");

    }


}
