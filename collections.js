SimpleChat.Chats = new Meteor.Collection("simpleChats")
SimpleChat.Rooms = new Meteor.Collection("simpleRooms")

SimpleChat.Rooms.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    },
});
SimpleChat.Chats.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    },
});