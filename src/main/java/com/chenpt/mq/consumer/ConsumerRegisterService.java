//package com.chenpt.mq.consumer;
//
//import com.alibaba.rocketmq.client.consumer.DefaultMQPushConsumer;
//import com.alibaba.rocketmq.client.consumer.listener.ConsumeConcurrentlyContext;
//import com.alibaba.rocketmq.client.consumer.listener.ConsumeConcurrentlyStatus;
//import com.alibaba.rocketmq.client.consumer.listener.ConsumeOrderlyContext;
//import com.alibaba.rocketmq.client.consumer.listener.ConsumeOrderlyStatus;
//import com.alibaba.rocketmq.client.exception.MQClientException;
//import com.alibaba.rocketmq.common.consumer.ConsumeFromWhere;
//import com.alibaba.rocketmq.common.message.MessageExt;
//import com.alibaba.rocketmq.common.protocol.heartbeat.SubscriptionData;
//import com.chenpt.annotation.MsgConsumer;
//import com.chenpt.mq.MQProducerConfig;
//import com.chenpt.mq.MsgConsumeException;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.ApplicationContext;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Component;
//import org.springframework.util.StringUtils;
//import org.apache.commons.lang.ArrayUtils;
//
//import javax.annotation.PreDestroy;
//import java.util.LinkedHashSet;
//import java.util.List;
//import java.util.Set;
//
//import static com.chenpt.annotation.MsgConsumer.ConsumeType;
//
//
///**
// * 文件名:com.jk51.mq.consumer.ConsumerServiceRegistry
// * 描述: ConsumerService注册
// * 作者: wangzhengfei
// * 创建日期: 2017-02-10
// * 修改记录:
// */
//@Component
//public class ConsumerRegisterService {
//
//    private static Logger logger = LoggerFactory.getLogger(ConsumerRegisterService.class);
//
//    /**
//     * 缓存
//     */
//    private Set<DefaultMQPushConsumer> consumers = new LinkedHashSet<>();
//
//    @Autowired
//    private MQProducerConfig config;
//
//    /**
//     * 注册消息消费实例
//     *
//     * @param context
//     * @param beanNames
//     * @throws MQClientException
//     */
//    @Async
//    public void register(ApplicationContext context, String[] beanNames) throws MQClientException {
//        logger.info("parse message consumer class set is {}", ArrayUtils.toString(beanNames));
//        for (String beanName : beanNames) {
//            Consumer consumer = context.getBean(beanName, Consumer.class);
//            MsgConsumer msgConsumer = consumer.getClass().getDeclaredAnnotation(MsgConsumer.class);
//            if(msgConsumer==null){
//                return;
//            }
//            createPushConsumer(msgConsumer.namesrvAddr(), msgConsumer.consumerGroup(),
//                    msgConsumer.topicName(), msgConsumer.tagName(), msgConsumer.retryTimes(),
//                    msgConsumer.consumeType(), consumer
//            );
//        }
//    }
//
//    /**
//     * 创建RocketMQ PushConsumer实例
//     *
//     * @param namesrvAddr   MQ名称服务地址
//     * @param consumerGroup 消费组名称
//     * @param topicName     topic名称
//     * @param tagName       tag名称
//     * @param retryTimes    重试次数
//     * @param consumeType   消费类型，顺序消费or并发消费
//     * @param instance      消息处理实例
//     * @throws MQClientException 消息处理异常
//     */
//    private void createPushConsumer(String namesrvAddr, String consumerGroup,
//                                    String topicName, String tagName, int retryTimes,
//                                    ConsumeType consumeType, Consumer instance) throws MQClientException {
//        DefaultMQPushConsumer consumer = new DefaultMQPushConsumer(consumerGroup);
//        consumer.setConsumeFromWhere(ConsumeFromWhere.CONSUME_FROM_FIRST_OFFSET);
//        consumer.setMaxReconsumeTimes(retryTimes);
//        consumer.setNamesrvAddr(StringUtils.isEmpty(namesrvAddr) ? config.getNamesrvAddr() : namesrvAddr);
//        consumer.subscribe(topicName, tagName);
//        if (consumeType == ConsumeType.Orderly) {
//            consumer.registerMessageListener((List<MessageExt> messages, ConsumeOrderlyContext context) -> {
//                try {
//                    instance.consume(messages);
//                    return ConsumeOrderlyStatus.SUCCESS;
//                } catch (MsgConsumeException ex) {
//                    logger.error("messages consume occur exception", ex);
//                    return ConsumeOrderlyStatus.SUSPEND_CURRENT_QUEUE_A_MOMENT;
//                }
//
//            });
//        } else {
//            consumer.registerMessageListener((List<MessageExt> messages, ConsumeConcurrentlyContext context) -> {
//                try {
//                    instance.consume(messages);
//                    return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
//                } catch (MsgConsumeException ex) {
//                    logger.error("messages consume occur exception", ex);
//                    return ConsumeConcurrentlyStatus.RECONSUME_LATER;
//                }
//            });
//        }
//        consumer.start();
//        consumers.add(consumer);
//    }
//
//    /**
//     * 关闭并清空缓存
//     */
//    @PreDestroy
//    public void shutdown() {
//        for (DefaultMQPushConsumer consumer : consumers) {
//            SubscriptionData subscriptionData =
//                    (SubscriptionData) consumer.getDefaultMQPushConsumerImpl().subscriptions().toArray()[0];
//            String topicName = subscriptionData.getTopic();
//            logger.info("Closing MQ Subscriber,NamesrvAddr[{}],ConsumeGroup[{}],topic[{}],tags{}",
//                    consumer.getNamesrvAddr(), consumer.getConsumerGroup(),
//                    topicName, subscriptionData.getTagsSet()
//            );
//            consumer.shutdown();
//        }
//        consumers.clear();
//    }
//
//}
