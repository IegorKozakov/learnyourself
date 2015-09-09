;
(function($){
    'use strict';

    LY.namespace('Helpers.Select');

    LY.Helpers.Select = (function() {
        var defaults = {
            defaultValue: '<option value="all">All</option>'
        };

        function _getOthersOptions(filterName) {
            return _.uniq(LY.courses.pluck(filterName));
        }

        function _createOptions(args) {
            var $options = '';

            _.each( _getOthersOptions(args.name), function (i) {
                $options += '<option value="' + i + '">' + i + '</option>'
            });

            return $options;
        }

        function _selectedOption($select,sumOfOptions, name, settings) {
            if (sumOfOptions < 2) {
                $select.prop( "disabled", true ).
                    find('option:nth-child(1)')
                    .prop('selected', true);
            } else {
                $select.prepend(settings.defaultValue);

                if (sessionStorage.getItem('filter_' + name)) {
                    $select.find('option[value="' + sessionStorage.getItem('filter_' + name) + '"]').prop('selected', true);
                }
            }
            
        }
        
        /**
         * @param  {[object]} name: "", title: "", value: ""
         * @return {[type]} jquery-wrap of select
         */
        function _createSelect(args, opts) {
            var settings = _.extend(defaults, opts),
                $select = $('<select/>', {
                    'name': args.name,
                    'id': 'filterBy' + args.name,
                    'class': 'ct-select ct-select-label j-filters'
                }),
                optionsHTML = '';

            optionsHTML = _createOptions(args);

            $select.append( optionsHTML );

            _selectedOption($select, $(optionsHTML).length, args.name, settings);

            return $('<div/>', {
                'class': 'ct-select_wrap',
                'title': args.title
            }).append( $select );
        }

        function _createListOfSelects() {
            var $selectsWrap = $('<div/>', {
                    class: 'filters__wrap',
                    title: 'filters'
                });

            _.each(LY.courses.filters, function(filter, i, filters) {
                $selectsWrap.append( _createSelect(filter) );
            });

            return $selectsWrap;
        }

        return {
            create: _createSelect,
            createList: _createListOfSelects
        }

        console.log(settings);
    })();
})(jQuery);
