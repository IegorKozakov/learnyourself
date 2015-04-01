;
(function(window, $, _, Backbone){
	'use strict';

    LY.namespace('Collections');

    LY.Collections.CoursesPreview = Backbone.Collection.extend({
        model: LY.Models.CoursePreview,
        url: '/data/courses.json'
    });

}(window, jQuery, _, Backbone));