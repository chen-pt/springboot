package com.chenpt.designModel.responsibilityModel;

/**
 * @Author: chen
 * @Description: 总监
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class MajorManager extends Manager {

    MajorManager(String name){
        super(name);
    }

    @Override
    public void requestApplication(Request request) {
        if(request.getRequestType().equals("请假") && request.getNumbers()<=5){
            System.out.println("总监回复:已批准"+request.getRequestContent());
        }else {
            if(superManager!=null){
                superManager.requestApplication(request);
            }
        }
    }
}
