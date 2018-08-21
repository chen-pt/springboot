//package com.chenpt.mq.consumer;
//
//import com.alibaba.rocketmq.common.message.MessageExt;
//import com.chenpt.mq.MsgConsumeException;
//
//import java.util.List;
//
///**
// * 文件名:com.jk51.mq.consumer.Consumer
// * 描述: 消息消费接口
// * 作者: wangzhengfei
// * 创建日期: 2017-02-10
// * 修改记录:
// */
//public interface Consumer {
//
//    /**
//     * 待消费的消息列表
//     * @param msgs 消息列表
//     * @throws MsgConsumeException 消费消息时可能引发的异常
//     */
//    void consume(List<MessageExt> msgs) throws MsgConsumeException;
//}
