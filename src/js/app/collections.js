;
(function(window, $, _, Backbone){
    'use strict';

    var COURSES_DATA = LY.Helpers.getUrlOrigin() + '/data/courses.json';

    LY.namespace('Collections');

    LY.Collections.Courses = Backbone.Collection.extend({
        model: LY.Models.Course,
        url: COURSES_DATA
    });

}(window, jQuery, _, Backbone));