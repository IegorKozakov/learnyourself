;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Router');

    LY.Router = Backbone.Router.extend({
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
            var that = this,
                coursesPreview = new LY.Collections.CoursesPreview();

            coursesPreview.fetch()
                .then(function(){
                    that.updateView(new LY.Views.CoursesPreview({collection: coursesPreview}));
                });
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
            console.log(idCourse, idLesson);
        },
        about: function() {
            this.updateView(new LY.Views.aboutPage());
        },
        default: function(query) {
            console.log('WTF? We don\'t know anythings about ' + query);
        }
    });

}(window, jQuery, _, Backbone));