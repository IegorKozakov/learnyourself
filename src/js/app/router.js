;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Router');

    LY.Router = Backbone.Router.extend({
        initialize: function() {
            LY.courses = new LY.Collections.Courses();
            /* setup set of defaults models */
            LY.courses.fetch({ async: false });
        },
        $main: $('.main'),
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
            'about(/)' : 'about',
            'course/:idCourse(/)' : 'course',
            'course/:idCourse/lesson/:idLesson' : 'lesson',
            '*query' : 'default'
        },

        index: function() {
            this.updateView(new LY.Views.CoursesPreview({collection: LY.courses}));
        },
        course: function (idCourse) {
            var that = this;

            $.getJSON('/data/courses.json', function(json, textStatus) {
                var lessonObj = _.find(json, function(i) { return i.id == idCourse });

                var courseDetail = new LY.Models.CourseDetail(lessonObj);
                var courseDetailView = new LY.Views.CourseDetail({model: courseDetail});

                that.updateView(courseDetailView);
            });
        },
        lesson: function(idCourse, idLesson) {
            var course = (LY.courses.get(idCourse)).toJSON(),
                lesson = course.lessons[idLesson - 1];


            this.updateView(new LY.Views.Lesson({model: new LY.Models.Lesson(lesson)}))
        },
        about: function() {
            this.updateView(new LY.Views.aboutPage());
        },
        default: function(query) {
            console.log('WTF? We don\'t know anythings about ' + query);
        }
    });
}(window, jQuery, _, Backbone));