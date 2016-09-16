/**
 * Created by cesar on 23/2/16.
 */



Meteor.methods({
    "SimpleChat.messageReceived": function (id, username) {
        this.unblock()
        if (!SimpleChat.options.showReceived) return false
        console.log('received')
        //todo remove
        check(id, String);
        check(username, String);
        Meteor._sleepForMs(800 * Meteor.isDevelopment)
        const message = SimpleChat.Chats.findOne(id, {fields: {roomId: 1, receivedBy: 1}})
        if (!message)
            throw Meteor.Error(403, "Message do not exist")
        const room = SimpleChat.Rooms.findOne(message.roomId)
        if (!_.contains(message.receivedBy, username)) {
            return SimpleChat.Chats.update(id, {
                $addToSet: {receivedBy: username},
                $set: {receivedAll: room.usernames.length - 2 <= message.receivedBy.length}
            })
        }
        SimpleChat.options.onReceiveMessage(id, message, room)
        return false
    },
    "SimpleChat.join": function (roomId, username, avatar, name) {
        this.unblock()
        if (!SimpleChat.options.showViewed) return false
        //todo remove
        Meteor._sleepForMs(800 * Meteor.isDevelopment)
        check(roomId, String);
        check(username, String);
        const date=new Date()
        if (SimpleChat.options.showJoined) {
            SimpleChat.Chats.insert({
                roomId,
                username,
                name,
                avatar,
                date,
                join: true
            })
        }
        SimpleChat.Rooms.upsert(roomId, {$addToSet: {usernames: username}})
        this.connection.onClose(function () {
            SimpleChat.Chats.insert({
                roomId,
                username,
                name,
                avatar,
                date: new Date(),
                join: false
            })
            SimpleChat.Rooms.update(roomId, {$pull: {usernames: username}})
            SimpleChat.options.onLeft(roomId, username, name,date)
        })
        SimpleChat.options.onJoin(roomId, username, name,date)
    },
    "SimpleChat.messageViewed": function (id, username) {
        this.unblock()
        if (!SimpleChat.options.showViewed) return false
        //todo remove
        Meteor._sleepForMs(800 * Meteor.isDevelopment)
        check(id, String);
        check(username, String);
        const message = SimpleChat.Chats.findOne(id, {fields: {roomId: 1, viewedBy: 1}})
        if (!message)
            throw Meteor.Error(403, "Message do not exist")
        const room = SimpleChat.Rooms.findOne(message.roomId)
        if (!_.contains(message.viewedBy, username)) {
            return SimpleChat.Chats.update(id, {
                $addToSet: {viewedBy: username},
                $set: {viewedAll: room.usernames.length - 2 <= message.viewedBy.length}
            })
        }
        return false
    },
})