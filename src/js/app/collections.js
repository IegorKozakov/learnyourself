;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Collections');

    LY.Collections.CoursesPreview = Backbone.Collection.extend({
        model: LY.Models.CoursePreview,
        url: 'learnyourself/data/courses.json'
    });

    LY.Collections.Courses = Backbone.Collection.extend({
        model: LY.Models.Course,
        url: 'learnyourself/data/courses.json'
    });

}(window, jQuery, _, Backbone));