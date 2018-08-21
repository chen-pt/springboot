package com.chenpt.exception;

/**
 * 描述: 数据访问/操作异常，通常用于数据库访问等
 * 创建日期: 2017-01-16
 * 修改记录:
 */
public class DataAccessException extends Exception{

    static final long serialVersionUID = -1256516991683579399L;

    public DataAccessException() {
        super();
    }

    public DataAccessException(String message) {
        super(message);
    }

    public DataAccessException(String message, Throwable cause) {
        super(message, cause);
    }

    public DataAccessException(Throwable cause) {
        super(cause);
    }

    protected DataAccessException(String message, Throwable cause,
                                     boolean enableSuppression,
                                     boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

}
