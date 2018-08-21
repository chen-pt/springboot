//package com.chenpt.mq.mns;
//
//import com.aliyun.mns.client.CloudAccount;
//import com.aliyun.mns.client.CloudQueue;
//import com.aliyun.mns.model.QueueMeta;
//import com.chenpt.common.SpringContextUtil;
//import com.chenpt.mq.MnsProperty;
//import org.apache.commons.lang.StringUtils;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.core.env.Environment;
//
//import java.util.Objects;
//
//public class CloudQueueFactory {
//    private static final Logger logger = LoggerFactory.getLogger(CloudQueueFactory.class);
//    public static final long VISIBILITY_TIMEOUT = 120L;
//    public static final long MAX_MESSAGE_SIZE = 65536L;
//
//    public static String getQueueName(String queueName){
//        MnsProperty property = SpringContextUtil.getApplicationContext().getBean(MnsProperty.class);
//        // 如果mnsendpoint的配置地址包含internal走的是内网 当前运行在阿里云服务器上
//        Environment env = SpringContextUtil.getApplicationContext().getBean(Environment.class);
//        String[] profiles = env.getActiveProfiles();
//        boolean isOnline = StringUtils.contains(property.getMNSEndpoint(), "-internal.aliyuncs.com")
//                            && Objects.equals(profiles[0], "dev");
//        if (isOnline) {
//            return queueName;
//        }
//
//        return queueName + "-test";
//    }
//
//    public static CloudQueue create(String queue) {
//
//        CloudAccount account = SpringContextUtil.getApplicationContext().getBean(CloudAccount.class);
//        String queueName = getQueueName(queue);
//        CloudQueue queueRef = account.getMNSClient().getQueueRef(queueName);
//        if (!queueRef.isQueueExist()) {
//            // 队列不存在
//            QueueMeta meta = new QueueMeta();
//            meta.setQueueName(queueName);
//            meta.setPollingWaitSeconds(MessageReceiver.WAIT_SECONDS);
//            meta.setMaxMessageSize(MAX_MESSAGE_SIZE);
//            meta.setVisibilityTimeout(VISIBILITY_TIMEOUT);
//            meta.setLoggingEnabled(true);
//            queueRef.create(meta);
//            logger.info("队列不存在,使用默认属性新建队列 {}", queueName);
//        }
//
//        return queueRef;
//    }
//
//    public static CloudQueue createDelayedMessageMQ(String queue, Long messageRetentionPeriod, Long delaySeconds) {
//        CloudAccount account = SpringContextUtil.getApplicationContext().getBean(CloudAccount.class);
//        String queueName = getQueueName(queue);
//        CloudQueue queueRef = account.getMNSClient().getQueueRef(queueName);
//        if (!queueRef.isQueueExist()) {
//            QueueMeta meta = new QueueMeta();// 队列不存在
//            meta.setQueueName(queueName);
//            meta.setPollingWaitSeconds(25);
//            meta.setMaxMessageSize(MAX_MESSAGE_SIZE);
//            meta.setVisibilityTimeout(VISIBILITY_TIMEOUT);
//            if(messageRetentionPeriod != null){
//                meta.setMessageRetentionPeriod(messageRetentionPeriod);//设置队列消息的最长存活时间，单位是秒
//            }
//            if(delaySeconds != null){
//                meta.setDelaySeconds(delaySeconds);//设置队列的延时消息的延时，单位是秒
//            }
//            queueRef.create(meta);
//        }
//        return queueRef;
//    }
//
//}
