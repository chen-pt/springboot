//package com.chenpt.mq;
//
//import com.alibaba.rocketmq.remoting.common.RemotingUtil;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.stereotype.Component;
//
///**
// * 文件名:com.jk51.mq.comsumer.MQProducerConfig
// * 描述:
// * 作者: wangzhengfei
// * 创建日期: 2017-02-10
// * 修改记录:
// */
//@Component
//@Configuration
//@ConfigurationProperties(prefix="mq")
//public class MQProducerConfig {
//
//    /**
//     * 生产组
//     */
//    private String producerGroup;
//
//    /**
//     * RocketMQ名称服务器地址
//     */
//    private String namesrvAddr;
//
//    /**
//     * 客户端地址，默认自动获取
//     */
//    private String clientIP = RemotingUtil.getLocalAddress();;
//
//    /**
//     * 消息发送默认超时时间
//     */
//    private int timeout = 3000;
//
//    /**
//     * 消息发送失败默认最大重试次数
//     */
//    private int retryTimes = 5;
//
//    public String getProducerGroup() {
//        return producerGroup;
//    }
//
//    public void setProducerGroup(String producerGroup) {
//        this.producerGroup = producerGroup;
//    }
//
//    public String getNamesrvAddr() {
//        return namesrvAddr;
//    }
//
//    public void setNamesrvAddr(String namesrvAddr) {
//        this.namesrvAddr = namesrvAddr;
//    }
//
//    public String getClientIP() {
//        return clientIP;
//    }
//
//    public void setClientIP(String clientIP) {
//        this.clientIP = clientIP;
//    }
//
//    public int getTimeout() {
//        return timeout;
//    }
//
//    public void setTimeout(int timeout) {
//        this.timeout = timeout;
//    }
//
//    public int getRetryTimes() {
//        return retryTimes;
//    }
//
//    public void setRetryTimes(int retryTimes) {
//        this.retryTimes = retryTimes;
//    }
//
//    @Override
//    public String toString() {
//        final StringBuffer sb = new StringBuffer("MQConfiguration{");
//        sb.append("producerGroup='").append(producerGroup).append('\'');
//        sb.append(", namesrvAddr='").append(namesrvAddr).append('\'');
//        sb.append(", clientIP='").append(clientIP).append('\'');
//        sb.append(", timeout=").append(timeout);
//        sb.append(", retryTimes=").append(retryTimes);
//        sb.append('}');
//        return sb.toString();
//    }
//}
