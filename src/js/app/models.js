;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Models');

    LY.Models.Course = Backbone.Model.extend({});

    LY.Models.CoursePreview = Backbone.Model.extend({
        'lang': 'ru'
    });

    LY.Models.CourseDetail = Backbone.Model.extend({});

    LY.Models.Lesson = Backbone.Model.extend({});

}(window, jQuery, _, Backbone));