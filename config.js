/**
 * Created by cesar on 25/2/16.
 */
SimpleChat={}
SimpleChat.options = {
    limit: 50,
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
}
SimpleChat.configure = function (options) {
    this.options = this.options || {};
    _.extend(this.options, options);
    return this;
}