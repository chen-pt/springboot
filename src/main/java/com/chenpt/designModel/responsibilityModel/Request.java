package com.chenpt.designModel.responsibilityModel;

/**
 * @Author: chen
 * @Description:待处理请求
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class Request {

    String requestType;
    String requestContent;
    int numbers;

    public String getRequestType() {
        return requestType;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    public String getRequestContent() {
        return requestContent;
    }

    public void setRequestContent(String requestContent) {
        this.requestContent = requestContent;
    }

    public int getNumbers() {
        return numbers;
    }

    public void setNumbers(int numbers) {
        this.numbers = numbers;
    }
}
