Meteor.methods({
    "SimpleChat.newMessage": function (message, roomId, username, avatar) {
        console.log(message, roomId, username)
        check(message, String);
        check(roomId, String);
        check(username, String);
            SimpleChat.Chats.insert({
            message,
            roomId,
            username,
            userId: this.userId,
            avatar,
            date: new Date()
        })
    }
});