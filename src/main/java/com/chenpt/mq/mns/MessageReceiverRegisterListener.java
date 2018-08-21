//package com.chenpt.mq.mns;
//
//import com.aliyun.mns.client.CloudAccount;
//import com.aliyun.mns.client.CloudQueue;
//import com.aliyun.mns.client.MNSClient;
//import com.aliyun.mns.model.Message;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.BeansException;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.ApplicationContext;
//import org.springframework.context.ApplicationContextAware;
//import org.springframework.context.ApplicationListener;
//import org.springframework.context.event.ContextRefreshedEvent;
//import org.springframework.stereotype.Component;
//
//import javax.annotation.PreDestroy;
//import java.util.concurrent.ExecutorService;
//import java.util.concurrent.Executors;
//import java.util.concurrent.atomic.AtomicInteger;
//
//@Component
//public class MessageReceiverRegisterListener implements ApplicationContextAware,ApplicationListener<ContextRefreshedEvent> {
//    private ApplicationContext applicationContext;
//
//    private static Logger logger = LoggerFactory.getLogger(MessageReceiverRegisterListener.class);
//
//    @Autowired
//    CloudAccount account;
//
//    private static ExecutorService executorService = Executors.newCachedThreadPool();
//
////    CloudQueue queue;
//
//    /*@Autowired
//    public void initCloudQueue(CloudAccount account) {
//        String queueName = "TestQueue";
//        queue = account.getMNSClient().getQueueRef(queueName);
//    }*/
//
//    @Override
//    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
//        this.applicationContext = applicationContext;
//    }
//
//    @Override
//    public void onApplicationEvent(ContextRefreshedEvent event) {
//        String[] beanNames = applicationContext.getBeanNamesForType(MessageWorker.class);
//        register(beanNames);
//    }
//
//    void register(String[] beanNames) {
//        MNSClient client = account.getMNSClient();
//        AtomicInteger ai = new AtomicInteger();
//        for (String name : beanNames) {
//            MessageWorker action = applicationContext.getBean(name, MessageWorker.class);
//            // 获取类上面的注解
//            RunMsgWorker runMsgWorker = action.getClass().getDeclaredAnnotation(RunMsgWorker.class);
//            // 为任务启用num个线程
//            for (int i = 0; i < runMsgWorker.num(); i++) {
//                executorService.execute(() -> {
//                    int id = ai.incrementAndGet();
//                    String queueName = CloudQueueFactory.create(runMsgWorker.queueName()).getAttributes().getQueueName();
//                    Thread.currentThread().setName(queueName + "_" + id);
//                    // 从runMsgWorker.queueName队列中取消息
//                    MessageReceiver receiver = new MessageReceiver(id, client, queueName);
//                    CloudQueue queue = account.getMNSClient().getQueueRef(queueName);
//                    while (true) {
//                        // 接收消息
//                        Message message = receiver.receiveMessage();
//                        try {
//                            logger.info("{} 收到消息 {}", queueName, message.getMessageBodyAsString());
//
//                            // 消费消息
//                            action.consume(message);
//                            // 消费完成 删除消息
//                            queue.deleteMessage(message.getReceiptHandle());
//                        } catch (Exception e) {
//                            logger.warn("{} 处理消息 发送未捕捉的异常 {} {} {}", queueName, message.getMessageBodyAsString(), e.getMessage(), e);
//                            if (message.getDequeueCount() > 3) {
//                                /*
//                                 * 消费了3次以上 设置2小时后可见
//                                 * 放入死信队列
//                                 */
//                                try {
//                                    queue.changeMessageVisibility(message.getReceiptHandle(), 60 * 60 * 2);
//                                } catch (Exception e1){}
//                            }
//                            e.printStackTrace();
//                        }
//                    }
//                });
//            }
//        }
//        executorService.shutdown();
//    }
//
//    @PreDestroy
//    void shutdown() {
//        account.getMNSClient().close();
//    }
//}
