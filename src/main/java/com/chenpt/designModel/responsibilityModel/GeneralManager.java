package com.chenpt.designModel.responsibilityModel;

/**
 * @Author: chen
 * @Description: 总经理
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class GeneralManager extends Manager {

    GeneralManager(String name){
        super(name);
    }

    @Override
    public void requestApplication(Request request) {
        if(request.getRequestType().equals("请假")){
            System.out.println("总经理回复:已批准"+request.getRequestContent());
        }else if(request.getRequestType().equals("加薪") && request.getNumbers()<=500){
            System.out.println("总经理回复:加薪已批准"+request.getRequestContent());
        }else if(request.getRequestType().equals("加薪") && request.getNumbers()>500){
            System.out.println("总经理回复:加薪 回头再说吧");
        }
    }
}
