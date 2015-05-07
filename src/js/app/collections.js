;
(function(window, $, _, Backbone){
    'use strict';

    var COURSES_DATA = '/data/courses.json';

    LY.namespace('Collections');

    LY.Collections.CoursesPreview = Backbone.Collection.extend({
        model: LY.Models.CoursePreview,
        url: COURSES_DATA
    });

    LY.Collections.Courses = Backbone.Collection.extend({
        model: LY.Models.Course,
        url: COURSES_DATA
    });

}(window, jQuery, _, Backbone));