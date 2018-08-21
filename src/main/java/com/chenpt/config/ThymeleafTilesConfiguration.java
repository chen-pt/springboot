package com.chenpt.config;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.thymeleaf.dialect.IDialect;
import org.thymeleaf.extras.tiles2.dialect.TilesDialect;
import org.thymeleaf.extras.tiles2.spring4.web.configurer.ThymeleafTilesConfigurer;
import org.thymeleaf.extras.tiles2.spring4.web.view.ThymeleafTilesView;
import org.thymeleaf.spring4.SpringTemplateEngine;
import org.thymeleaf.spring4.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.spring4.view.ThymeleafViewResolver;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;


@Configuration
@EnableWebMvc
@AutoConfigureAfter(ThymeleafAutoConfiguration.class)
@EnableConfigurationProperties(ThymeleafProperties.class)
public class ThymeleafTilesConfiguration implements ApplicationContextAware {

    private ApplicationContext applicationContext = null;

    @Autowired
    private ThymeleafProperties props;

    @Value("#{'${spring.thymeleaf.tilesDefLocations}'.split(',')}")
    private String[] tilesDefLocations;

    @Value("${imageUrl.url}")
    private String imageUrl;

    public void setApplicationContext(final ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Bean
    public ViewResolver tilesViewResolver() {
        ThymeleafViewResolver vr = new ThymeleafViewResolver();
        vr.setTemplateEngine(templateEngine());
        vr.setViewClass(ThymeleafTilesView.class);
        vr.setCharacterEncoding(props.getEncoding().name());
        vr.setOrder(Ordered.LOWEST_PRECEDENCE);
        vr.setCache(false);

        Map<String, String> variables = new HashMap<>();
        variables.put("imageUrl", imageUrl);

        vr.setStaticVariables(variables);

        return vr;
    }

    @Bean
    public ViewResolver thymeleafViewResolver() {
        ThymeleafViewResolver vr = new ThymeleafViewResolver();
        vr.setTemplateEngine(templateEngine());
        vr.setCharacterEncoding(props.getEncoding().name());
        vr.setOrder(Ordered.HIGHEST_PRECEDENCE);
        vr.setExcludedViewNames(props.getExcludedViewNames());
        return vr;
    }


    @Bean
    public SpringTemplateEngine templateEngine() {
        final SpringTemplateEngine engine = new SpringTemplateEngine();
        engine.setTemplateResolver(templateResolver());
        engine.setAdditionalDialects(dialects());
        return engine;
    }

    @Bean
    public SpringResourceTemplateResolver templateResolver() {
        SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
        resolver.setPrefix(props.getPrefix());
        resolver.setSuffix(props.getSuffix());
        resolver.setTemplateMode(props.getMode());
        resolver.setCharacterEncoding(props.getEncoding().name());
        resolver.setCacheable(props.isCache());
        resolver.setApplicationContext(applicationContext);

        return resolver;
    }

    @Bean
    public ThymeleafTilesConfigurer tilesConfigurer() {
        ThymeleafTilesConfigurer ttc = new ThymeleafTilesConfigurer();
        ttc.setDefinitions(tilesDefLocations);
        return ttc;
    }

    private Set<IDialect> dialects() {
        final Set<IDialect> set = new HashSet<IDialect>();
        set.add(new TilesDialect());
        return set;
    }

}
