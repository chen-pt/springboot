//package com.chenpt.mq.mns;
//
//import com.aliyun.mns.model.Message;
//
//
///**
// * Created by Administrator on 2017/7/6.
// */
//public interface MessageWorker {
//    /**
//     * 方法抛出异常消息将不被消费 下一个消费者可以继续取出消费使用
//     * 消费者实现类应该具体考虑异常原因
//     * 实现类不应捕获所有异常,由于消息可能存在重复消费的问题,实现类应该考虑业务的幂等性 如果消费者运行线程大于1 消费者实现类应该是线程安全的
//     * 一个消息被一个消费者消费的时候默认{@link CloudQueueFactory#VISIBILITY_TIMEOUT}s内对其他消费者不可见
//     * 如果需要通过消息队列处理复杂的任务,考虑将业务拆分成多个顺序消息
//     * 顺序消息的实现请参考阿里云mns文档 https://help.aliyun.com/document_detail/34477.html?spm=5176.product27412.6.558.PZJ4Ds
//     *
//     * @param message
//     */
//    void consume(Message message) throws Exception;
//}
