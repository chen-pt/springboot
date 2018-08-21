//package com.chenpt.mq.consumer;
//
//import com.alibaba.rocketmq.client.exception.MQClientException;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.BeansException;
//import org.springframework.context.ApplicationContext;
//import org.springframework.context.ApplicationContextAware;
//import org.springframework.context.ApplicationListener;
//import org.springframework.context.event.ContextRefreshedEvent;
//import org.springframework.stereotype.Component;
//
///**
// * 文件名:com.jk51.mq.consumer.ConsumerListener
// * 描述:
// * 作者: wangzhengfei
// * 创建日期: 2017-02-10
// * 修改记录:
// */
//@Component
//public class ConsumerListener implements ApplicationContextAware,ApplicationListener<ContextRefreshedEvent> {
//
//    private ApplicationContext applicationContext;
//
//    private static Logger logger = LoggerFactory.getLogger(ConsumerRegisterService.class);
//
//    @Override
//    public void onApplicationEvent(ContextRefreshedEvent event) {
//        String[] beanNames = applicationContext.getBeanNamesForType(Consumer.class);
//        ConsumerRegisterService registry = applicationContext.getBean(ConsumerRegisterService.class);
//        try {
//            registry.shutdown();
//            registry.register(applicationContext,beanNames);
//        } catch (MQClientException e) {
//            logger.error("注册MQ Consumer实例失败...",e);
//        }
//    }
//
//    @Override
//    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
//        this.applicationContext = applicationContext;
//    }
//}
