//package com.chenpt.mq.producer;
//
//import com.alibaba.rocketmq.client.QueryResult;
//import com.alibaba.rocketmq.client.exception.MQBrokerException;
//import com.alibaba.rocketmq.client.exception.MQClientException;
//import com.alibaba.rocketmq.client.producer.*;
//import com.alibaba.rocketmq.common.message.Message;
//import com.alibaba.rocketmq.common.message.MessageExt;
//import com.alibaba.rocketmq.common.message.MessageQueue;
//import com.alibaba.rocketmq.remoting.exception.RemotingException;
//import com.chenpt.mq.MQProducerConfig;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//import javax.annotation.PostConstruct;
//import javax.annotation.PreDestroy;
//import java.util.List;
//
///**
// * 文件名:com.jk51.mq.producer.DefaultProducer
// * 描述: 默认消息Producer
// * 作者: wangzhengfei
// * 创建日期: 2017-02-10
// * 修改记录:
// */
//@Component
//public class DefaultProducer implements MQProducer {
//
//    private static Logger logger = LoggerFactory.getLogger(DefaultProducer.class);
//
//    private DefaultMQProducer producer;
//
//    @Autowired
//    private MQProducerConfig config;
//
//    @PostConstruct
//    public DefaultMQProducer init() throws MQClientException {
//        logger.info("create and start default mq producer,configuration is {}",config);
//        producer = new DefaultMQProducer(config.getProducerGroup());
//        producer.setNamesrvAddr(config.getNamesrvAddr());
//        producer.setClientIP(config.getClientIP());
//        producer.setSendMsgTimeout(config.getTimeout());
//        producer.setRetryTimesWhenSendFailed(config.getRetryTimes());
//        producer.start();
//        return producer;
//    }
//
//    @Override
//    public void start() throws MQClientException {
//        producer.start();
//    }
//
//    @PreDestroy
//    @Override
//    public void shutdown() {
//        logger.info("default mq producer connection is closing.");
//        producer.shutdown();
//    }
//
//    @Override
//    public List<MessageQueue> fetchPublishMessageQueues(String topic) throws MQClientException {
//        return producer.fetchPublishMessageQueues(topic);
//    }
//
//    @Override
//    public SendResult send(Message msg) throws MQClientException, RemotingException, MQBrokerException, InterruptedException {
//        return producer.send(msg);
//    }
//
//    @Override
//    public SendResult send(Message msg, long timeout) throws MQClientException, RemotingException, MQBrokerException, InterruptedException {
//        return producer.send(msg, timeout);
//    }
//
//    @Override
//    public void send(Message msg, SendCallback sendCallback) throws MQClientException, RemotingException, InterruptedException {
//        producer.send(msg, sendCallback);
//    }
//
//    @Override
//    public void send(Message msg, SendCallback sendCallback, long timeout) throws MQClientException, RemotingException, InterruptedException {
//        producer.send(msg, sendCallback, timeout);
//    }
//
//    @Override
//    public void sendOneway(Message msg) throws MQClientException, RemotingException, InterruptedException {
//        producer.sendOneway(msg);
//    }
//
//    @Override
//    public SendResult send(Message msg, MessageQueue mq) throws MQClientException, RemotingException, MQBrokerException, InterruptedException {
//        return producer.send(msg,mq);
//    }
//
//    @Override
//    public SendResult send(Message msg, MessageQueue mq, long timeout) throws MQClientException, RemotingException, MQBrokerException, InterruptedException {
//        return producer.send(msg,mq,timeout);
//    }
//
//    @Override
//    public void send(Message msg, MessageQueue mq, SendCallback sendCallback) throws MQClientException, RemotingException, InterruptedException {
//        producer.send(msg,mq,sendCallback);
//    }
//
//    @Override
//    public void send(Message msg, MessageQueue mq, SendCallback sendCallback, long timeout) throws MQClientException, RemotingException, InterruptedException {
//        producer.send(msg,mq,sendCallback,timeout);
//    }
//
//    @Override
//    public void sendOneway(Message msg, MessageQueue mq) throws MQClientException, RemotingException, InterruptedException {
//        producer.sendOneway(msg,mq);
//    }
//
//    @Override
//    public SendResult send(Message msg, MessageQueueSelector selector, Object arg) throws MQClientException, RemotingException, MQBrokerException, InterruptedException {
//        return producer.send(msg,selector,arg);
//    }
//
//    @Override
//    public SendResult send(Message msg, MessageQueueSelector selector, Object arg, long timeout) throws MQClientException, RemotingException, MQBrokerException, InterruptedException {
//        return producer.send(msg, selector, arg, timeout);
//    }
//
//    @Override
//    public void send(Message msg, MessageQueueSelector selector, Object arg, SendCallback sendCallback) throws MQClientException, RemotingException, InterruptedException {
//        producer.send(msg, selector, arg, sendCallback);
//    }
//
//    @Override
//    public void send(Message msg, MessageQueueSelector selector, Object arg, SendCallback sendCallback, long timeout) throws MQClientException, RemotingException, InterruptedException {
//        producer.send(msg, selector, arg, sendCallback, timeout);
//    }
//
//    @Override
//    public void sendOneway(Message msg, MessageQueueSelector selector, Object arg) throws MQClientException, RemotingException, InterruptedException {
//        producer.sendOneway(msg, selector, arg);
//    }
//
//    @Override
//    public TransactionSendResult sendMessageInTransaction(Message msg, LocalTransactionExecuter tranExecuter, Object arg) throws MQClientException {
//        return producer.sendMessageInTransaction(msg, tranExecuter, arg);
//    }
//
//    @Override
//    public void createTopic(String key, String newTopic, int queueNum) throws MQClientException {
//        producer.createTopic(key, newTopic, queueNum);
//    }
//
//    @Override
//    public void createTopic(String key, String newTopic, int queueNum, int topicSysFlag) throws MQClientException {
//        producer.createTopic(key, newTopic, queueNum, topicSysFlag);
//    }
//
//    @Override
//    public long searchOffset(MessageQueue mq, long timestamp) throws MQClientException {
//        return producer.searchOffset(mq, timestamp);
//    }
//
//    @Override
//    public long maxOffset(MessageQueue mq) throws MQClientException {
//        return producer.maxOffset(mq);
//    }
//
//    @Override
//    public long minOffset(MessageQueue mq) throws MQClientException {
//        return producer.minOffset(mq);
//    }
//
//    @Override
//    public long earliestMsgStoreTime(MessageQueue mq) throws MQClientException {
//        return producer.earliestMsgStoreTime(mq);
//    }
//
//    @Override
//    public MessageExt viewMessage(String offsetMsgId) throws RemotingException, MQBrokerException, InterruptedException, MQClientException {
//        return producer.viewMessage(offsetMsgId);
//    }
//
//    @Override
//    public QueryResult queryMessage(String topic, String key, int maxNum, long begin, long end) throws MQClientException, InterruptedException {
//        return producer.queryMessage(topic, key, maxNum, begin, end);
//    }
//
//    @Override
//    public MessageExt viewMessage(String topic, String msgId) throws RemotingException, MQBrokerException, InterruptedException, MQClientException {
//        return producer.viewMessage(topic, msgId);
//    }
//
//    public DefaultMQProducer getProducer(){
//        return producer;
//    }
//}
