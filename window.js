import {Template} from 'meteor/templating'
import {Meteor} from 'meteor/meteor'
import {Chats} from './collections'
import {SimpleChat} from './config'
import moment from 'moment'
import './window.css'
import './window.html'
import './spinner.css'
import './spinner.html'


SimpleChat.scrollToEnd = function (template) {
    Template.SimpleChatWindow.endScroll = true;
    template.$(".direct-chat-messages").animate({scrollTop: template.$('.scroll-height').height()}, 300);
    template.$('.direct-chat-messages').trigger('scroll')

}

Template.SimpleChatWindow.onCreated(function () {

    this.initializing = true;
    this.limit = new ReactiveVar(this.limit || SimpleChat.options.limit)
    this.beep = this.data.beep != undefined ? this.data.beep : SimpleChat.options.beep
    this.showViewed = this.data.showViewed != undefined ? this.data.showViewed : SimpleChat.options.showViewed
    this.showJoined = this.data.showJoined != undefined ? this.data.showJoined : SimpleChat.options.showJoined
    this.showReceived = this.data.showReceived != undefined ? this.data.showReceived : SimpleChat.options.showReceived
    this.increment = this.limit.get()
    //accept function (for reactive data) or plain data
    if (typeof this.data.roomId != "function")
        this.getRoomId = ()=> {
            return this.data.roomId + ""
        }
    else
        this.getRoomId = this.data.roomId

    if (typeof this.data.username != "function")
        this.getUsername = ()=> {
            return this.data.username + ""
        }
    else
        this.getUsername = this.data.username

    if (typeof this.data.name != "function")
        this.getName = ()=> {
            return this.data.name || this.getUsername()
        }
    else
        this.getName = this.data.name
    if (typeof this.data.avatar != "function")
        this.getAvatar = ()=> {
            return this.data.avatar
        }
    else
        this.getAvatar = this.data.avatar


    this.autorun(() => {
        this.subscribe("simpleChats", this.getRoomId(), this.limit.get());
        this.subscribing = true;
    })
    Meteor.call("SimpleChat.join", this.getRoomId(), this.getUsername(), this.getAvatar(), this.getName())
});

Template.SimpleChatWindow.onRendered(function () {
    var self = this
    self.endScroll = true;
    this.$('.direct-chat-messages').scroll(function (event) {
        if (event.currentTarget.scrollHeight - event.currentTarget.scrollTop < 350) {
            self.endScroll = true;
        } else {
            self.endScroll = false;
        }
    })
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            this.subscribing = false;
            /**
             * the setTimeOut is to be sure that dom already update, and make the real calc of scroñ
             */
            this.$('.direct-chat-messages').scrollTop(this.$('.scroll-height')[0].scrollHeight - this.scroll)


        } else {
            this.subscribing = true;
            if (this.initializing)
                Meteor.setTimeout(()=> {
                    this.initializing = false
                    SimpleChat.scrollToEnd(this)
                },50)

        }


    })
    const username = this.getUsername()
    if (this.showViewed) {
        const checkViewed = ()=> {
            if (window.visivility == "visible") {
                $('.notViewed').filter(':onscreen').each(function (i, o) {
                    $(o).removeClass('notViewed')
                    Meteor.call("SimpleChat.messageViewed", $(o).attr('id'), username, function (err) {
                        if (err)
                            $(o).addClass('notViewed')
                    })
                })
            }
        }
        $(window).on('resize scroll focus', checkViewed)
        $('.direct-chat-messages').on('scroll', checkViewed)
    }
    $(window).on('SimpleChat.newMessage', (e, id, doc)=> {
        if (this.endScroll) {

            SimpleChat.scrollToEnd(this)
            if (this.beep && window.visivility == 'hidden') {
                new Audio('/packages/cesarve_simple-chat/assets/bell.mp3').play()
            }
        } else {
            if (this.beep && username != doc.username) {
                new Audio('/packages/cesarve_simple-chat/assets/bell.mp3').play()
            }
        }
    })
})


Template.SimpleChatWindow.helpers({
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
    }
    ,
    formatDate: function (date) {
        return moment(date).calendar(null, {
            sameDay: 'hh:mm a',
            lastDay: '[Yesterday at ]hh:mm a',
            lastWeek: '[Last] dddd[ at ]hh:mm a',
            sameElse: 'DD/MM/YYYY hh:mm a'
        });
    }
})
;


Template.SimpleChatWindow.events({
    'click #simple-chat-load-more': function () {
        let template = Template.instance()
        template.subscribing = true;
        template.limit.set(template.limit.get() + template.increment)
        template.scroll = template.$('.scroll-height')[0].scrollHeight
        template.$(".direct-chat-messages").animate({scrollTop: 0}, 0);
        template.$('.direct-chat-messages').trigger('scroll')

    },
    'keydown #simple-chat-message': function (event) {
        var $message = $(event.currentTarget)
        if (event.which == 13 && $message.val() != '') { // 13 is the enter key event
            event.preventDefault()
            Template.instance().$('button#message-send').click()
        }
    },
    'click button#message-send': function () {
        let template = Template.instance()
        var $message = template.$('#simple-chat-message')

        if ($message.val() != '') {
            var text = $message.val()
            $message.val('');
            SimpleChat.scrollToEnd(template)
            Meteor.call('SimpleChat.newMessage', text, template.getRoomId(), template.getUsername(), template.getAvatar(), template.getName(), this.custom, function (err) {
                if (err) {
                    console.error(err)
                    $message.val(text);
                }
            })
        }

    }
});



