package com.chat.websoc.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.chat.websoc.model.ChatMessage;

@Controller
public class ChatController 
{
	//@MessageMapping("/chat.login")
	//public ChatMessage signIn(@Payload ChatMessage chatMessage, )
	
	
	//register the user
	@MessageMapping("/chat.register")
	@SendTo("/topicSample/public")
	public ChatMessage register(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor)
	{
		headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
		return chatMessage;
	}
	
	//send a message
	@MessageMapping("/chat.send")
	@SendTo("/topicSample/public")
	public ChatMessage sendMessage(@Payload ChatMessage chatMessage)
	{
		return chatMessage;
	}
}
