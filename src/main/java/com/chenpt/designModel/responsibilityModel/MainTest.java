package com.chenpt.designModel.responsibilityModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] args){

        CommonManager commonManager = new CommonManager("景丽");
        MajorManager majorManager = new MajorManager("宗建");
        GeneralManager generalManager = new GeneralManager("宗景丽");
        //设置上级
        commonManager.setSuperManager(majorManager);
        majorManager.setSuperManager(generalManager);

        Request request = new Request();
        request.setRequestType("请假");
        request.setRequestContent("小菜请假");
        request.setNumbers(1);
        commonManager.requestApplication(request);//客户端的申请都由经理直接发起

        request.setNumbers(3);
        commonManager.requestApplication(request);

        request.setRequestType("加薪");
        request.setRequestContent("小菜要加薪");
        request.setNumbers(500);
        commonManager.requestApplication(request);

        request.setNumbers(1000);
        commonManager.requestApplication(request);


    }

}
