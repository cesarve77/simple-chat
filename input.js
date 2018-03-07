import {Template} from 'meteor/templating'
import {Meteor} from 'meteor/meteor'
import {Chats} from './collections'
import {SimpleChat} from './config'
import moment from 'moment'
import './window.css'
import './window.html'
import './spinner.css'
import './spinner.html'
import './input.html'


Template.SimpleChatInput.helpers({
    placeholder: function () {
        return Template.instance().data.placeholder || SimpleChat.options.texts.placeholder
    },
    button: function () {
        return Template.instance().data.button || SimpleChat.options.texts.button
    },
    join: function () {
        return Template.instance().data.join || SimpleChat.options.texts.join
    },
    left: function () {
        return Template.instance().data.left || SimpleChat.options.texts.left
    },
    room: function () {
        return Template.instance().data.room || SimpleChat.options.texts.room
    },
    showJoined: function () {
        return Template.instance().showJoined
    },
    showViewed: function () {
        return Template.instance().showViewed
    },
    showReceived: function () {
        return Template.instance().showReceived
    },
    simpleChats: function () {
        var template = Template.instance()
        var chats = Chats.find({roomId: template.getRoomId()}, {sort: {date: 1}})


        let handleChanges = chats.observeChanges({
            added: (id, doc) => {
                const username = template.getUsername()
                if (template.showReceived) {
                    if (!_.contains(doc.receivedBy, username) && doc.message) {
                        Meteor.call('SimpleChat.messageReceived', id, username)
                    }
                }
                if (!template.subscribing) {
                    $(window).trigger('SimpleChat.newMessage', [id, doc])
                }
            }
        });

        return chats;
    },
    viewedMe: function () {
        return Template.instance().getUsername() == this.username || _.contains(this.viewedBy, Template.instance().getUsername())
    },
    hasMore: function () {
        return Chats.find({roomId: Template.instance().getRoomId()}, {
                sort: {date: 1},
                limit: Template.instance().limit.get()
            }).count() === Template.instance().limit.get()
    },

    me: function () {
        return Template.instance().getUsername() == this.username
    },
    formatDate: function (date) {
        return moment(date).calendar(null, {
            sameDay: 'hh:mm a',
            lastDay: '[Yesterday at ]hh:mm a',
            lastWeek: '[Last] dddd[ at ]hh:mm a',
            sameElse: 'DD/MM/YYYY hh:mm a'
        });
    },
    template: function() {
        return Template.instance().data.template || SimpleChat.options.template
    }
});