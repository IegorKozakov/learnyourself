;
(function(window, $, _, Backbone){
    'use strict';

    var PATH_TO_DATA = '/data/courses.json',
        COURSES_DATA = (LY.Helpers.getNameOfServer() === 'github') ? LY.Helpers.getUrlOrigin() + '/learnyourself' + PATH_TO_DATA : LY.Helpers.getUrlOrigin() + PATH_TO_DATA;

    LY.namespace('Collections');

    LY.Collections.Courses = Backbone.Collection.extend({
        model: LY.Models.Course,
        url: COURSES_DATA,
    });

}(window, jQuery, _, Backbone));