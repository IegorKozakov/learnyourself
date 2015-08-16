;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Models');

    LY.Models.Course = Backbone.Model.extend({
        defaults: {
            'lang': 'en',
            'starred': false
        },
        initialize: function() {
            /* Check is this course is starred */
            if( LY.Courses.Star.isEmpty() ) { return false }

            if( LY.Courses.Star.isCourseStarredById( this.get('id') )) {
                this.set('starred', true);
            }
        }
    });

    LY.Models.Lesson = Backbone.Model.extend({
        default: {
            'lessonPrev': false,
            'lessonNext': false
        }
    });

}(window, jQuery, _, Backbone));