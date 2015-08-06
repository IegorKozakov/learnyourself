;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Router');

    LY.Router = Backbone.Router.extend({
        $main: $('.j-main'),
        initialize: function() {
        },
        loadView : function(view) {
            this.view && this.view.remove();
            this.view = view;
            return this;
        },
        updateView: function(view) {
            this.loadView(view);
            this.$main.append(view.render().el);
        },
        routes: {
            '' : 'index',
            '!/about(/)' : 'about',
            '!/course/:idCourse(/)' : 'course',
            '!/course/:idCourse/lesson/:idLesson' : 'lesson',
            '*query' : 'default'
        },

        index: function() {
            var that =  this;

            LY.API.Youtube.setCoursesPreviewData().done(function(courses) {
                var indexDirectory = new LY.Views.IndexDirectory({
                    collection: courses
                });

                that.updateView(indexDirectory);
            });
        },
        course: function (idCourse) {
            var that = this,
                model;

            LY.API.Youtube.setCoursesPreviewData().then(function( coursesPreview ) {
                model = coursesPreview.get(idCourse);

                var channelId = model.get('channelId'),
                    playlistId = idCourse;

                return $.when( 
                    LY.API.Youtube.getChannel(channelId),
                    LY.API.Youtube.getPlaylistItems(playlistId)
                );
            })
            .then(function(channel, playlistItems) {
                var channelInfo = {
                    channelLogo: channel[0].items[0].snippet.thumbnails.high.url,
                    channelDescription: channel[0].items[0].snippet.description,
                    channelViewCount: channel[0].items[0].statistics.viewCount,
                    channelSubscriberCount: channel[0].items[0].statistics.subscriberCount
                },
                playlistItemsInfo = [];

                _.each(playlistItems[0].items, function(item, i, list) {
                    var lesson = {
                        title: item.snippet.title,
                        position: item.snippet.position,
                        videoId: item.contentDetails.videoId,
                        description: item.snippet.description,
                    }
                    playlistItemsInfo.push(lesson);
                });

                model.set(channelInfo);
                model.set('lessons', playlistItemsInfo);
                //console.log(model.toJSON());

                that.updateView(new LY.Views.CourseDetail({ model: model }));
            });
        },
        lesson: function(playlistId, lessonId) {
            var course = LY.courses.get(playlistId),
                lesson = _.find(course.get('lessons'), function(item) { return item.videoId === lessonId });
            
            this.updateView(new LY.Views.Lesson({model: new LY.Models.Lesson(lesson)}))
        },
        about: function() {
            this.updateView(new LY.Views.aboutPage());
        },
        default: function(query) {
            console.log('We don\'t know anythings about ' + query);
        }
    });
}(window, jQuery, _, Backbone));