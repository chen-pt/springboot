package com.chenpt.designModel.flyWeightModel;

import java.util.HashMap;
import java.util.Hashtable;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/20
 * @Modified By:
 */
public class WebSiteFactory {
    private HashMap flyweights = new HashMap(16);

    //创建网站实例
    public WebSite getWebSite(String type){
        if(!flyweights.containsKey(type))
            flyweights.put(type,new ConcreteWebSite(type));

        return (WebSite)flyweights.get(type);
    }

    //统计网站个数
    public int getSiteCount(){
        return flyweights.size();
    }

}
