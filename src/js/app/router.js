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

            LY.API.Youtube.setCourses().done(function(courses) {
                var indexDirectory = new LY.Views.IndexDirectory({
                    collection: courses
                });

                that.updateView(indexDirectory);
            });
        },
        course: function (idCourse) {
            var that = this,
                model;

            LY.API.Youtube.setCourses().then(function(courses) {
                model = courses.get(idCourse);

                return $.when(
                    LY.API.Youtube.setChannel(model, model.get('channelId')),
                    LY.API.Youtube.setPlaylistItems(model, model.get('id'))
                );
            }).then(function() {
                that.updateView(new LY.Views.CourseDetail({ model: model }));
            });
        },
        lesson: function(playlistId, videoId) {
            var that = this,
                model,
                lesson;

            LY.API.Youtube.setCourses().then(function(courses) {
                model = courses.get(playlistId);

                return $.when(
                    LY.API.Youtube.setChannel(model, model.get('channelId')),
                    LY.API.Youtube.setPlaylistItems(model, model.get('id'))
                );
            }).then(function() {
                lesson = _.find(model.get('lessons'), function(item) { return item.videoId === videoId });

                that.updateView(new LY.Views.Lesson({model: new LY.Models.Lesson(lesson)}))
            });
        },
        about: function() {
            this.updateView(new LY.Views.aboutPage());
        },
        default: function(query) {
            console.log('We don\'t know anythings about ' + query);
        }
    });
}(window, jQuery, _, Backbone));