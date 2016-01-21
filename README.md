# Simple Chat window: is the start point for make your own chat

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
    {{>SimpleChatWindow roomId=\<roomId> username=\<username> avatar=\<avatar> title=\<title> limit=\<limit> minimize=\<minimize>}}  
      
Where
- \<roomId>: required, unique id for each room, 
- \<username>: required string with username, unique referred 
- \<avatar>: optional string with image url
- \<title>: optional string with window title
- \<minimize>: optional boolean to show or not a minimize button on window
- \<limit>: optional number fot limit the last "n" messages
- \<beep>: optional boolean emit sound on new message

Note: this values can be a literal a helper or template data

Example:

    {{>SimpleChatWindow roomId="free room" username=this.username limit=limit}}
    //roomIn is a literal
    //username is data template
    //limit is a helper


## Configure Globally

    SimpleChat.configure({
        title: "Chat", //"Chat" as default
        minimize: false, //false as default
        limit:  100, // 100 as default
        beep: false, //false as default
    })

this options will be overwrite individually on {{>SimpleChatWindow roomId=\<roomId> username=\<username> avatar=\<avatar> title=\<title> limit=\<limit> minimize=\<minimize>}}  
as you saw below

# Contributing 

1) Please help me with my english

2) Pull request are very welcome

3) fork the repo

5) make changes

6) commit

7) make a pull request


