# Simple Chat window: the starter point to build your own chat, in seconds

## Features

- Very simple api chat window
- Multiple chat in the same view
- auto scroll on new message
- load more button
- optional beep on new message

## Demo 

### Working demo
[http://simpleschat.herokuapp.com/]()

### Demo source

[https://github.com/cesarve77/demo-simple-chat]()

## Installing

`$ meteor add cesarve:simple-chat`

## Usage

Just paste the template 

```
{{>SimpleChatWindow roomId=<roomId> username=<username> name=<name> avatar=<avatar> limit=<limit> showViewed=<showViewed>  showJoined=<showJoined> publishChats=<publishChats> allow=<allow> custom=<custom>}}
```
   
      
Where

- `<roomId>`: required, plain string or function return a unique id for each room
- `<username>`: required, plain string or function return a string with unique user id or user name or any unique identifier
- `<name>`: optional, plain string or function return a string with display name *[default: the `username` value]*
- `<avatar>`: optional, plain string or function return a string avatar image source 
- `<limit>`: optional number for limiting the last *n* messages for subscription, *[default: 50]*
- `<beep>`: optional boolean emit sound on new message *[default: false]*
- `<showViewed>`: optional boolean for showing or not when the messages are viewed (like WhatsApp) *[default: false (this feature can use a lot of server resource)]*
- `<showReceived>`: optional boolean for showing or not when the messages are received (like whatsapp) *[default: false (this feature can use a lot of server resource)]*
- `<showJoined>`: optional boolean for showing message when some user join to a room *[default: false]*
- `<publishChats>`: optional function return true for allow publish message, or false to deny this function receive as arguments (`roomId`, `limit`) and context is publish context *[default: return true]*
- `<allow>`: optional function return true for allow insert new message or false to deny, this function receive as arguments (`message`, `roomId`, `username`, `avatar`, `name`) and context is methods context *[default: return true]*
- `<custom>`: optional any custom value
- `<loadMore>`: text for load more button *[default: 'Load More']*
- `<placeholder>`: text for input placeholder *[default: 'Type message...']*
- `<button>`: text for button submit *[default: 'Send']*
- `<join>`: text for message Join *[default: 'joined the']*
- `<left>`: text for message left *[default: 'left']*
- `<room>`: text for message Room *[default: 'room']*
- `<height>`: css height for the message Room *[default: '300px']*
- `<inpuTemplate>`: a custom template for the input *[default: 'SimpleChatInput']*
- `<loadMoreTemplate>`:  a custom template for *'Load More'* section *[default: 'LoadMore']*


Note: this values can be a literal a helper or template data

Example:

```
{{>SimpleChatWindow roomId="free room" username=this.username limit=limit}}
    // roomIn is a literal
    // username is data template
    // limit is a helper
```

## Configure Globally 

```javascript
//somewhere in both (client and  server) 
import {SimpleChat} from 'meteor/cesarve:simple-chat/config'

SimpleChat.configure ({
    texts:{
        loadMore: 'Load More',
        placeholder: 'Type message ...',
        button: 'send',
        join: 'joined the',
        left: 'left',
        room: 'room at'

    },
    limit: 5,
    beep: true, 
    showViewed: true,
    showReceived: true,
    showJoined: true,
    publishChats: function(roomId, limi){ //server
       //here the context is the same for a Publications, that mean you have access to this.userId who are asking for subscribe.
       // for example
       return isLoggedAndHasAccessToSeeMessage(this.userId)
    },
    allow: function(message, roomId, username, avatar, name){
       //here the context is the same for a Methods, thats mean you hace access to this.userId also
       // for example
       return isLoggedAndHasAccessSendMessages(this.userId)
        return true
    },
    onNewMessage:function(msg){  //both
    },
    onReceiveMessage:function(id, message, room){ //server
        
    },
    onJoin:function(roomId, username, name,date){  //server
    },
    onLeft:function(roomId, username, name,date) { //server
    },
    height: '300px', // Configure the height of the chat
    inputTemplate: 'SimpleChatInput', // In case you want to overwrite the template
    loadMoreTemplate: 'LoadMore', // In case you want to overwrite the template
})

})
```

These options can be overwrite individually on: 

```
{{>SimpleChatWindow roomId=<roomId> username=<username> avatar=<avatar> limit=<limit> showViewed=true  showJoined= true publishChats=publishChats allow=allow}}
```

# Styling

Chat html was taken from [https://almsaeedstudio.com/themes/AdminLTE/documentation/index.html]() with direct chat widget.

Icons: 
[http://simpleschat.herokuapp.com/icons.html](http://simpleschat.meteor.com/icons.html)

# Specials 

To [Jetbrains.com](Jetbrains.com) for give us a free licences of their amazing softwares

# Contributing 

1. Please help me with my english
2. Open an issue
3. Pull request are very welcome:
	1. Fork the repo
	2. Make changes
	3. Commit
	4. make a pull request
