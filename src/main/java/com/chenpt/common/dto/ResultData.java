package com.chenpt.common.dto;

/**
 * 返回结果封装
 * Created by Administrator on 2017/6/13.
 */
public class ResultData extends PacketHead{

    private Object data;

    public ResultData(){
        this.setStatus(STATUS_SUCCESS);
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

}
