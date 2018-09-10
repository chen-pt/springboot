package com.chenpt.designModel.proxyFactory;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

/**
 * @Author: chen
 * @Description: jdk的动态代理
 * @Date: created in 2018/9/10
 * @Modified By:
 */
public class MyProxy implements InvocationHandler {

    public Object target;

    MyProxy(Object target){
        this.target = target;
    }

    /**
     * @param proxy  需要代理的真实类
     * @param method 真实类的方法
     * @param args   方法所需参数
     * @return
     * @throws Throwable
     */
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("++++++before " + method.getName() + "++++++");
        Object result = method.invoke(target,args);
        System.out.println("++++++after " + method.getName() + "++++++");
        return result;
    }
}
