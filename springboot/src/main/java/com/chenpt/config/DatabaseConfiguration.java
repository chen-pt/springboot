package com.chenpt.config;

import com.alibaba.druid.pool.DruidDataSource;
import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.bind.RelaxedPropertyResolver;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.sql.SQLException;
import java.util.Arrays;

/**
 * 数据库链接配置
 * Created by chenpt on 2017/12/15.
 * <备注>
 * 凡是被Spring管理的类，实现接口 EnvironmentAware 重写方法 setEnvironment
 * 可以在工程启动时，获取到系统环境变量和application-dev配置文件中的变量
 */
@Configuration
@EnableTransactionManagement
@MapperScan(value = "com.chenpt")
public class DatabaseConfiguration implements EnvironmentAware {

    /**
     * 日志记录器
     */
    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfiguration.class);

    @Resource
    private Environment env;

    private RelaxedPropertyResolver resolver;


    @Override
    public void setEnvironment(Environment environment) {
        this.env = environment;
        this.resolver = new RelaxedPropertyResolver(environment,"spring.datasource.");
    }

    //注册dataSource
    @Bean(initMethod = "init", destroyMethod = "close")
    public DruidDataSource dataSource() throws SQLException {
        if (StringUtils.isEmpty(resolver.getProperty("url"))) {
            logger.error("Your database connection pool configuration is incorrect!"
                    + " Please check your Spring profile, current profiles are:"
                    + Arrays.toString(env.getActiveProfiles()));
            throw new ApplicationContextException(
                    "Database connection pool is not configured correctly");
        }
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setDriverClassName(resolver.getProperty("driver-class-name"));
        druidDataSource.setUrl(resolver.getProperty("url"));
        druidDataSource.setUsername(resolver.getProperty("username"));
        druidDataSource.setPassword(resolver.getProperty("password"));
        druidDataSource.setInitialSize(Integer.parseInt(resolver.getProperty("initialSize")));
        druidDataSource.setMinIdle(Integer.parseInt(resolver.getProperty("minIdle")));
        druidDataSource.setMaxActive(Integer.parseInt(resolver.getProperty("maxActive")));
        druidDataSource.setMaxWait(Integer.parseInt(resolver.getProperty("maxWait")));
        druidDataSource.setTimeBetweenEvictionRunsMillis(Long.parseLong(resolver.getProperty("timeBetweenEvictionRunsMillis")));
        druidDataSource.setMinEvictableIdleTimeMillis(Long.parseLong(resolver.getProperty("minEvictableIdleTimeMillis")));
        druidDataSource.setValidationQuery(resolver.getProperty("validationQuery"));
        druidDataSource.setTestWhileIdle(Boolean.parseBoolean(resolver.getProperty("testWhileIdle")));
        druidDataSource.setTestOnBorrow(Boolean.parseBoolean(resolver.getProperty("testOnBorrow")));
        druidDataSource.setTestOnReturn(Boolean.parseBoolean(resolver.getProperty("testOnReturn")));
        druidDataSource.setPoolPreparedStatements(Boolean.parseBoolean(resolver.getProperty("poolPreparedStatements")));
        druidDataSource.setMaxPoolPreparedStatementPerConnectionSize(Integer.parseInt(resolver.getProperty("maxPoolPreparedStatementPerConnectionSize")));
        druidDataSource.setFilters(resolver.getProperty("filters"));
        return druidDataSource;
    }


    @Bean
    public PlatformTransactionManager transactionManager() throws SQLException {
        return new DataSourceTransactionManager(dataSource());
    }
}
