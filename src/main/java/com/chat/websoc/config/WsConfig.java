package com.chat.websoc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

//the web socket configuration
@Configuration
@EnableWebSocketMessageBroker
public class WsConfig implements WebSocketMessageBrokerConfigurer
{
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry)
	{
		//connection will persist between client and server will continue even if either disconnects
		registry.addEndpoint("/sampleSocket").withSockJS();
	}
	
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry)
	{
		registry.enableSimpleBroker("/topicSample");
		registry.setApplicationDestinationPrefixes("/app");
	}
}
