//package com.chenpt.mq.producer;
//
//import com.alibaba.rocketmq.client.exception.MQClientException;
//import com.alibaba.rocketmq.client.producer.DefaultMQProducer;
//import com.chenpt.mq.MQProducerConfig;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.stereotype.Component;
//
///**
// * 文件名:com.jk51.mq.producer.ProducerFactory
// * 描述: 用于提供创建、开启、关闭非默认的Producer，需注意连接的关闭。
// * 作者: wangzhengfei
// * 创建日期: 2017-02-10
// * 修改记录:
// */
//@Component
//public class ProducerFactory {
//
//    private static Logger log = LoggerFactory.getLogger(ProducerFactory.class);
//
//
//    /**
//     * 创建MQProducer
//     * @param config
//     * @return
//     * @throws MQClientException
//     */
//    public DefaultMQProducer create(MQProducerConfig config) throws MQClientException {
//        DefaultMQProducer producer = new DefaultMQProducer(config.getProducerGroup());
//        producer.setNamesrvAddr(config.getNamesrvAddr());
//        producer.setClientIP(config.getClientIP());
//        producer.setSendMsgTimeout(config.getTimeout());
//        producer.setRetryTimesWhenSendFailed(config.getRetryTimes());
//        return producer;
//    }
//
//    /**
//     * 启动
//     * @param producer
//     * @throws MQClientException
//     */
//    public void start(DefaultMQProducer producer) throws MQClientException {
//        producer.start();
//    }
//
//    /**
//     * 关闭
//     * @param producer
//     */
//    public void shutdown(DefaultMQProducer producer){
//        producer.shutdown();
//    }
//
//
//}
