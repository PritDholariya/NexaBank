package com.nexabank.transactionservice.config;

import com.nexabank.transactionservice.dto.TransactionStatusEvent;
import com.nexabank.transactionservice.dto.FraudAlertEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id}")
    private String groupId;

    private Map<String, Object> baseConsumerConfigs() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        return props;
    }

    // --- TransactionStatusEvent Factory ---
    @Bean
    public ConsumerFactory<String, TransactionStatusEvent> transactionStatusConsumerFactory() {
        JsonDeserializer<TransactionStatusEvent> deserializer = new JsonDeserializer<>(TransactionStatusEvent.class);
        deserializer.setRemoveTypeHeaders(false);
        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeMapperForKey(true);

        return new DefaultKafkaConsumerFactory<>(baseConsumerConfigs(), new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, TransactionStatusEvent> transactionStatusListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, TransactionStatusEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(transactionStatusConsumerFactory());
        return factory;
    }

    // --- FraudAlertEvent Factory ---
    @Bean
    public ConsumerFactory<String, FraudAlertEvent> fraudAlertConsumerFactory() {
        JsonDeserializer<FraudAlertEvent> deserializer = new JsonDeserializer<>(FraudAlertEvent.class);
        deserializer.setRemoveTypeHeaders(false);
        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeMapperForKey(true);

        return new DefaultKafkaConsumerFactory<>(baseConsumerConfigs(), new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, FraudAlertEvent> fraudAlertListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, FraudAlertEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(fraudAlertConsumerFactory());
        return factory;
    }
}
