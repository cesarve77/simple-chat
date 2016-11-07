export const  Chats = new Meteor.Collection("simpleChats")
export const Rooms = new Meteor.Collection("simpleRooms")

Chats.deny({
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
Chats.allow({
    insert() {
        return false;
    },
    update() {
        return false;
    },
    remove() {
        return false;
    },
});

Rooms.deny({
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
Chats.allow({
    insert() {
        return false;
    },
    update() {
        return false;
    },
    remove() {
        return false;
    },
});