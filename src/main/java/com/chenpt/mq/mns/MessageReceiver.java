//package com.chenpt.mq.mns;
//
//import com.aliyun.mns.client.CloudQueue;
//import com.aliyun.mns.client.MNSClient;
//import com.aliyun.mns.model.Message;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//public class MessageReceiver {
//    private static final Logger logger = LoggerFactory.getLogger(MessageReceiver.class);
//
//    public static final int WAIT_SECONDS = 30;
//
//    // if there are too many queues, a clear method could be involved after deleting the queue
//    protected static final Map<String, Object> sLockObjMap = new HashMap<>();
//    protected static Map<String, Boolean> sPollingMap = new ConcurrentHashMap<>();
//
//    protected Object lockObj;
//    protected String queueName;
//    protected CloudQueue cloudQueue;
//    protected int workerId;
//
//    public MessageReceiver(int id, MNSClient mnsClient, String queue) {
//        cloudQueue = mnsClient.getQueueRef(queue);
//        queueName = queue;
//        workerId = id;
//
//        synchronized (sLockObjMap) {
//            lockObj = sLockObjMap.get(queueName);
//            if (lockObj == null) {
//                lockObj = new Object();
//                sLockObjMap.put(queueName, lockObj);
//            }
//        }
//    }
//
//    public boolean setPolling()
//    {
//        synchronized (lockObj) {
//            Boolean ret = sPollingMap.get(queueName);
//            if (ret == null || !ret) {
//                sPollingMap.put(queueName, true);
//                return true;
//            }
//            return false;
//        }
//    }
//
//    public void clearPolling()
//    {
//        synchronized (lockObj) {
//            sPollingMap.put(queueName, false);
//            lockObj.notifyAll();
//            logger.info("Everyone WakeUp and Work!");
//        }
//    }
//
//    public Message
//    receiveMessage()
//    {
//        boolean polling = false;
//        while (true) {
//            synchronized (lockObj) {
//                Boolean p = sPollingMap.get(queueName);
//                if (p != null && p) {
//                    try {
//                        logger.info("Thread" + workerId + " Have a nice sleep!");
//                        polling = false;
//                        lockObj.wait();
//                    } catch (InterruptedException e) {
//                        logger.info("MessageReceiver Interrupted! QueueName is " + queueName);
//                        return null;
//                    }
//                }
//            }
//
//            try {
//                Message message = null;
//                if (!polling) {
//                    message = cloudQueue.popMessage();
//                    if (message == null) {
//                        polling = true;
//                        continue;
//                    }
//                } else {
//                    if (setPolling()) {
//                        logger.info("Thread" + workerId + " Polling!");
//                    } else {
//                        continue;
//                    }
//                    do {
////                        logger.info("Thread" + workerId + " KEEP Polling!");
//                        try {
//                            message = cloudQueue.popMessage(WAIT_SECONDS);
//                            //logger.info("正常等等 popMessage:"+message );
//                        } catch(Exception e)
//                        {
//                            logger.info("Exception Happened when polling popMessage: " + e);
//                        }
//                    } while (message == null);
//                    clearPolling();
//                }
//                return message;
//            } catch (Exception e) {
//                // it could be network exception
//                //logger.info("Exception Happened when popMessage: " + e);
//            }
//        }
//    }
//}
