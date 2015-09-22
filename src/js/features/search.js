;
(function($){
    'use strict';

    LY.namespace('Helpers.Search');

    LY.Helpers.Search = (function() {
        var name = 'searchQuery';

        function _getQuery() {
            return LY.courses[name];
        }

        function _setSearchQuery(query) {
            LY.courses[name] = query;
            sessionStorage.setItem( name, query);
        }

        function _compareItemWithQuery(i, query) {
            var title = i.title.toLocaleLowerCase();

            return title.indexOf(query) !== -1;
        }

        function _getCollectionByQuery(q, collectionUnfiltered) {
            var that = this,
                query = q || _getQuery(),
                collection = ( collectionUnfiltered ) ? collectionUnfiltered : LY.courses.original.toJSON();
          
            return _.filter(collection, function (item) { return _compareItemWithQuery(item, query) });
        }

        return {
            getQuery: _getQuery,
            setQuery: _setSearchQuery,
            getCollectionByQuery: _getCollectionByQuery
        };
    })();
})(jQuery);