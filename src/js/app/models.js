;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Models');

    LY.Models.Course = Backbone.Model.extend({
        defaults: {
            'id': 0,
            'title': '',
            'lang': 'en',
            'starred': false
        },
        initialize: function() {
            var starredCourses = JSON.parse(localStorage.getItem('starred'));

            if(!starredCourses) { return false }

            if( starredCourses.indexOf(this.get('id')) !== -1) {
                this.set('starred', true);
            }
        }
    });

    LY.Models.Lesson = Backbone.Model.extend({});

}(window, jQuery, _, Backbone));