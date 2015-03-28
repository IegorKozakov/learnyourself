;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Router');

    LY.Router = Backbone.Router.extend({
        routes: {
            '' : 'index'
            // ,
            // 'about(/)' : 'about',
            // 'course:idCourse(/)' : 'course',
            // 'course:idCourse/lesson:idLesson(/)': 'lesson',
            // '*query' : 'default'
        },

        index: function() {
            console.log('index page');
        }
        // ,
        // about: function() {
        //     console.log('about page');
        // },
        // course: function(idCourse) {
        //     console.log('page of course #' + idCourse );
        // },
        // lesson: function(idCourse, idLesson) {
        //     console.log('page of course #' + idCourse + ' - lesson #' + idLesson);
        // },
        // default: function(query) {
        //     console.log('WTF? We don\'t know anythings about ' + query);
        // }
  });

}(window, jQuery, _, Backbone));