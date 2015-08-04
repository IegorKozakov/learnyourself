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

            LY.API.Youtube.setCoursesPreviewData().then(function( coursesPreview ) {
                var model = coursesPreview.get(idCourse),
                    channelId = model.get('channel').id,
                    playlistId = idCourse;

                return $.when( 
                    LY.API.Youtube.getChannel(channelId),
                    LY.API.Youtube.getPlaylistItems(playlistId)
                )
            })
            .then(function(channel, playlistItems) {

                console.log(channel[0]);
                console.log(playlistItems[0]);

            });

            //this.updateView(new LY.Views.CourseDetail({ model: LY.courses.get(idCourse) }) );
        },
        lesson: function(idCourse, idLesson) {
            var course = LY.courses.get(idCourse),
                lesson = course.get('lessons')[idLesson];

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