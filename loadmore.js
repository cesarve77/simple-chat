import {Template} from 'meteor/templating'
import {Meteor} from 'meteor/meteor'
import {Chats} from './collections'
import {SimpleChat} from './config'
import moment from 'moment'

Template.LoadMore.helpers({
    loadMore: function () {
        return Template.instance().data.loadMore || SimpleChat.options.texts.loadMore
    },
});