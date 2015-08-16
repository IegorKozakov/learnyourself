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
        course: function (courseId) {
            var that = this;

            LY.API.Youtube.fetchCourseChannelPlaylists(courseId).then(function(course) {
                that.updateView( new LY.Views.CourseDetail({ model: course }) );
            });
        },
        lesson: function(courseId, videoId) {
            var that = this;

            LY.API.Youtube.fetchCourseChannelPlaylists(courseId).then(function(course) {
                var lesson = LY.Helpers.getNeighborsLessons(course, videoId);

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