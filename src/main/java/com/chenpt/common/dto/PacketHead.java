package com.chenpt.common.dto;

/**
 * Created by Administrator on 2017/6/13.
 */
public class PacketHead {

    public static final String STATUS_SUCCESS = "OK";//成功
    public static final String STATUS_ERROR = "ERROR";//成功

    private String status; //返回状态
    private String msg;    //返回信息

    public PacketHead() {
        status = STATUS_SUCCESS;
    }
    public PacketHead(String status, String result) {
        this.status = status;
        this.msg = msg;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
