# Simple Chat window: the starter point to build your own chat, in seconds

## Features

- Very simple api chat window
- Multiple chat in the same view
- auto scroll on new message
- load more button
- optional beep on new message

## Demo 

### Working demo
[http://simpleschat.meteor.com]

### Demo source

[https://github.com/cesarve77/demo-simple-chat]

## Installing

    $ meteor add cesarve:simple-chat 

## Usage

just paste the template 

    {{>SimpleChatWindow roomId=<roomId> username=<username> avatar=<avatar> limit=<limit> showViewed=<showViewed>  showJoined=<showJoined> publishChats=<publishChats> allow=<allow>}}  
   
      
Where
- \<roomId>: required, plain string or function return a unique id for each room , 
- \<username>: required, plain string or function  return a string with unique user id or user name or any unique identifier  ,
- \<name>: optional, plain string or function  return a string with display name, default  username value
- \<avatar>: optional,plain string or function  return a string avatar image source 
- \<limit>: optional number fot limit the last "n" messages for subscription, default 50
- \<beep>: optional boolean emit sound on new message, default false
- \<showViewed>: optional boolean for showing or not when the messages are viewed (like whatsapp). Default false (this feature can use a lot of server resource), default false
- \<showReceived>: optional boolean for showing or not when the messages are received (like whatsapp) (this feature can use a lot of server resource), default false
- \<showJoined>: optional boolean for showing message when some user join to a room, default false
- \<publishChats>: optional function return true for allow publish message, or false to deny this function receive as arguments (roomId, limit) and context is publish context, default return true
- \<allow>: optional function return true for allow insert new message or false to deny, this function receive as argumetns (message, roomId, username, avatar, name) and context is methods context, default return true

Note: this values can be a literal a helper or template data

Example:

    {{>SimpleChatWindow roomId="free room" username=this.username limit=limit}}
    //roomIn is a literal
    //username is data template
    //limit is a helper


## Configure Globally 

```

//somewhere in both (client and  server) 

SimpleChat.configure ({
    limit: 5,
    beep: true, 
    showViewed: true,
    showReceived: true,
    showJoined: true,
    publishChats: function(roomId, limi){
        return true
    },
    allow: function(message, roomId, username, avatar, name){
        return true
    }
})

```

this options can be overwrite individually on   {{>SimpleChatWindow roomId=\<roomId> username=\<username> avatar=\<avatar> limit=\<limit> showViewed=true  showJoined= true publishChats=publishChats allow=allow}} cd simple-
as you saw below

# Styling

Chat html was taken from https://almsaeedstudio.com/themes/AdminLTE/documentation/index.html
with direct chat widget

Icons :

(http://simpleschat.meteor.com/icons.html)[http://simpleschat.meteor.com/icons.html]

# Contributing 

1) Please help me with my english

2) Pull request are very welcome

3) fork the repo

5) make changes

6) commit

7) make a pull request

#
