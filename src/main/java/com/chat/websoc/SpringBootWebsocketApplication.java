package com.chat.websoc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//the main container that handles the spring application
@SpringBootApplication
public class SpringBootWebsocketApplication 
{
	public static void main(String[] args) 
	{
		SpringApplication.run(SpringBootWebsocketApplication.class, args);
	}

}
