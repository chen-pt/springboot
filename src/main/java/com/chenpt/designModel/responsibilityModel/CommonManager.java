package com.chenpt.designModel.responsibilityModel;

/**
 * @Author: chen
 * @Description: 经理
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class CommonManager extends Manager{

    CommonManager(String name){
        super(name);
    }

    @Override
    public void requestApplication(Request request) {

        if(request.getRequestType().equals("请假") && request.getNumbers()<=2){
            System.out.println("经理回复:已批准"+request.getRequestContent());
        }else {
            if(superManager!=null){
                superManager.requestApplication(request);
            }
        }

    }


}
