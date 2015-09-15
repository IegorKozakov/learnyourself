;
(function($, _){
    'use strict';

    LY.namespace('Helpers.Filters');

    LY.Helpers.Filters = (function() {
        function _getFilters() {
            var filters = {};

             _.each( LY.courses.filters, function(filter, i){
                if( !(filter.value === 'all') ) {
                    filters[filter.name] = filter.value;
                }
            });

            return filters;
        }

        function _getFiltersCollection() {
            var filters = _getFilters();

            return _.where( LY.courses.original.toJSON(), filters);
        }

        function _setFilters(filterName, filterVal) {
            _.each( LY.courses.filters, function(filter){
                if(filter.name === filterName) {
                    filter.value = filterVal; 
                    return;
                }
            });

            sessionStorage.setItem('filter_' + filterName, filterVal);
        }

        return {
            setFilters: _setFilters,
            getFiltersCollection: _getFiltersCollection
        };
    })();
})(jQuery, _);