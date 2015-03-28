;
(function(window, $, _, Backbone){
	'use strict';

    LY.namespace('Collections');

    LY.Collections.Courses = Backbone.Collection.extend({
        model: LY.Models.Course,
        url: '/data/courses.json'
    });

}(window, jQuery, _, Backbone));