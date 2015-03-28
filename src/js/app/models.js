;
(function(window, $, _, Backbone){
	'use strict';

    LY.namespace('Models');

    LY.Models.Course = Backbone.Model.extend({
        defaults: {
            'lang': 'en',
            'edu': {
            'finishLessons': []
            }
        }
    });

}(window, jQuery, _, Backbone));