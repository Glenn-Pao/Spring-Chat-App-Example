'use strict';

//establish the pages
var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

//establish client and username
var stompClient = null;
var username = null;

//establish the colors to be used
var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

//attempt to connect client with server
function connect(event)
{
    username = document.querySelector('#name').value.trim();

    //if username is filled
    if(username) 
    {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/sampleSocket');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

//when connected successfully, go to public chat
function onConnected() 
{
    // Subscribe to the Public Topic
    stompClient.subscribe('/topicSample/public', onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/chat.register",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}


//what to show when error is encountered
function onError(error) 
{
    connectingElement.textContent = 'Could not connect to test server. Please refresh this page!';
    connectingElement.style.color = 'red';
}


//send the message - does not identify to
function send(event) 
{
    var messageContent = messageInput.value.trim();

    //if there is a message inside and the client is currently connected
    if(messageContent && stompClient) 
    {
    	//make the chat message
        var chatMessage = 
        {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };

        //send to the extension and use json to parse the variable
        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        
        //reset the message input box
        messageInput.value = '';
    }
    
    //do not let the event default
    event.preventDefault();
}

//what to do when the message is received
function onMessageReceived(payload) 
{
	
	var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    //find out the type of message
    if(message.type === 'JOIN') 
    {
    	//indicate that a user has joined the session
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } 
    else if (message.type === 'LEAVE') 
    {
    	//indicate that a user has left the session
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } 
    else 
    {
    	//send the message that was sent by a user
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    //append the content and adjust the scroll height if necessary
    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


//get the user's avatar color, generated at random
function getAvatarColor(messageSender) 
{
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) 
    {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }

    var index = Math.abs(hash % colors.length);
    return colors[index];
}

//listen for input on both username and message fields
usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', send, true)