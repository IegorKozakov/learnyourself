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
            this.filters = {
                lang: sessionStorage.getItem('filter_lang') || 'all',
                channelTitle: sessionStorage.getItem('filter_channelTitle') || 'all'
            };
        }
    });
}(window, jQuery, _, Backbone));