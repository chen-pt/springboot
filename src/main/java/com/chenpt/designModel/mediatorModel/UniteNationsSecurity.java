package com.chenpt.designModel.mediatorModel;

/**
 * @Author: chen
 * @Description: 具体中介者
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class UniteNationsSecurity implements UniteNations {

    private USA usa;
    private Iraq iraq;

    public void setUSA(USA usa){
        this.usa=usa;
    }

    public void setIraq(Iraq iraq){
        this.iraq=iraq;
    }


    @Override
    public void declare(String message, Country country) {
        if(country==usa){
            iraq.getMessage(message);
        }else if(country==iraq){
            usa.getMessage(message);
        }
    }
}
