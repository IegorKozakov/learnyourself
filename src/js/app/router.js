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

            LY.API.Youtube.loadCourses().done(function(courses) {
                var indexDirectory = new LY.Views.IndexDirectory({
                    collection: courses
                });

                that.updateView(indexDirectory);
            });
        },
        course: function (idCourse) {
            var that = this,
                model;

            LY.API.Youtube.loadCourses().then(function(courses) {
                model = courses.get(idCourse);

                return $.when(
                    LY.API.Youtube.loadChannel(model, model.get('channelId')),
                    LY.API.Youtube.loadPlaylistItems(model, model.get('id'))
                );
            }).then(function() {
                that.updateView(new LY.Views.CourseDetail({ model: model }));
            });
        },
        lesson: function(courseId, videoId) {
            var that = this,
                course;

            LY.API.Youtube.loadCourses().then(function(courses) {
                course = courses.get(courseId);

                return $.when(
                    LY.API.Youtube.loadChannel(course, course.get('channelId')),
                    LY.API.Youtube.loadPlaylistItems(course, course.get('id'))
                );
            }).then(function() {
                var lesson = _.find(course.get('lessons'), function(item) { return item.videoId === videoId });

                if( lesson.position > 0 ) {
                    var lessonPrev = _.find(course.get('lessons'), function(item) { return item.position === lesson.position - 1 });
                    lesson.lessonPrev =  lessonPrev;
                } 

                if ( lesson.position < course.get('lessons').length - 1 ) {
                    var lessonNext = _.find(course.get('lessons'), function(item) { return item.position === lesson.position + 1 });
                    lesson.lessonNext = lessonNext;
                }

                /* add course id to lesson */
                lesson.courseId = courseId;

                console.log( lesson );


                that.updateView(new LY.Views.Lesson({model: new LY.Models.Lesson( lesson )}))
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