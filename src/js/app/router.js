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
            'course:idCourse(/)' : 'course',
            // 'course:idCourse/lesson:idLesson(/)': 'lesson',
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
            console.log(idCourse);
        },
        about: function() {
            this.updateView(new LY.Views.aboutPage());
        },
        default: function(query) {
            console.log('WTF? We don\'t know anythings about ' + query);
        }
    });

}(window, jQuery, _, Backbone));