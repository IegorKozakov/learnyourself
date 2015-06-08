;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Models');

    LY.Models.Course = Backbone.Model.extend({
        default: {
            'id': 0,
            'title': '',
            'lang': 'en'
        }
    });

    LY.Models.Lesson = Backbone.Model.extend({});

}(window, jQuery, _, Backbone));