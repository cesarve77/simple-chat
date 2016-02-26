
Meteor.methods({
    "SimpleChat.newMessage": function (message, roomId, username, avatar, name) {
        if (!SimpleChat.options.allow.call(this,message, roomId, username, avatar, name))
            throw new Meteor.Error(403, "Access deny")
        check(message, String);
        check(roomId, String);
        check(avatar, Match.Optional(String));
        check(name,  Match.Optional(String));
        //todo borrar
        if (!this.isSimulation && process.env.ROOT_URL=="http://localhost:3000/"){
            Meteor._sleepForMs(800)
        }
        SimpleChat.Chats.insert({
            message,
            roomId,
            username,
            name,
            sent: !this.isSimulation,
            receivedBy: [],
            receivedAll: false,
            viewedBy: [],
            viewedAll: false,
            userId: this.userId,
            avatar,
            date: new Date()
        })
    }
});