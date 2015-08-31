;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Collections');

    LY.Collections.Courses = Backbone.Collection.extend({
        model: LY.Models.Course,
        comparator: function(i) {
            return !i.get('starred');
        },
        initialize: function() {
            /* set default searchQuery */
            this.searchQuery = sessionStorage.getItem('filter_lang') || '';
            /* set defaults filters */
            this.filters = [
                {
                    name: 'lang',
                    title: 'Языки',
                    value: sessionStorage.getItem('filter_lang') || 'all'
                },
                {
                    name: 'channelTitle',
                    title: 'Каналы',
                    value: sessionStorage.getItem('filter_channelTitle') || 'all'
                }
            ];
        }
    });
}(window, jQuery, _, Backbone));