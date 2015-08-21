;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Views');

    LY.Views.Course = Backbone.View.extend({
        tagName: 'li',
        className: 'courses_preview__item',
        tpl: LY.Helpers.getTpl('courses'),
        render: function() {
            this.$el.html( this.tpl( this.model.toJSON() ) );
            return this;
        },
        events: {
            'click .j-starred_course': 'toggleStarred'
        },
        toggleStarred: function(e) {
            var that = this,
                $btn = $(e.currentTarget),
                courseId = $btn.val(),
                action = $btn.data('flag');

            if ( LY.Courses.Star.update(courseId, action, that) ) {
                 that.render();
            }
        }
    });

    LY.Views.Courses = Backbone.View.extend({
        tagName: 'ul',
        className: 'courses_preview__list',
        render: function(){
            this.$el.empty();

            this.collection.each(function(i) {
                var item = new LY.Views.Course({model: i});
                this.$el.append(item.render().el);
            }, this);

            return this;
        }
    });

    LY.Views.Filters = Backbone.View.extend({
        className: 'index__filters',
        render: function() {
            var that = this;

            that.$el.html( that._createSelects() );
            return that;
        },
        _getUniqValue: function(attr) {
            return _.uniq(this.collection.pluck(attr));
        },
        _createSelect: function(filter, filters) {
            var that = this;
            /* create select */
            var $select = $('<select/>', {
                'name': filter,
                'id': 'filterBy' + filter,
                'class': 'ct-select j-filters',
                'html': '<option value="all">All</option>'
            });
            /* create options */
            _.each(that._getUniqValue(filter), function (i) {
                $('<option/>', {
                    'value': i,
                    'text': i
                }).appendTo($select);
            });
            /* made selected */
            $select.find('option[value=' + sessionStorage.getItem('filter_' + filter) + ']')
                .prop('selected', true);

            return $select;
        },
        _createSelects: function() {
            var that = this,
                $selects = $('<div/>', {
                    class: 'filters__wrap',
                    title: 'filters'
                });

            for (var filter in that.collection.filters) {
                $selects.append( that._createSelect(filter, that.collection.filters) );
            };

            return $selects;
        }
    });

    /**
     * View of index page
     */
    LY.Views.IndexDirectory = Backbone.View.extend({
        className: 'index',
        maps: {
            course: '#courses_preview'
        },
        tpl: LY.Helpers.getTpl('index'),
        events: {
            'input #search': 'searchByQuery',
            'change .j-filters': 'setFilter'
        },
        initialize: function() {
            this.on("change:filterType", this.filterByType, this);
            this.collection.on("reset", this.renderFilteredList, this);
        },
        render: function () {
            this.$el.html(this.tpl());

            /* render courses */
            this.$(this.maps.course).html( new LY.Views.Courses({collection: this.collection}).render().el );

            /* filters */
            this.$('#filters').html( new LY.Views.Filters({ collection: this.collection.original }).render().el );
            this.filterByType();

            /* init search */
            if ( sessionStorage.getItem('searchQuery') ) {
                this.$('#search').val(sessionStorage.getItem('searchQuery'))
                this.searchByQuery();
            }

            return this;
        },
        setFilter: function(e) {
            var $select = $(e.currentTarget),
                filterName = $select.attr('name'),
                filterVal = $select.val();

            this.collection.filters[filterName] =filterVal;
            sessionStorage.setItem('filter_' + filterName, filterVal)

            this.trigger("change:filterType");
        },
        filterByType: function() {
            var that = this,
                filters = that.collection.filters,
                collectionFiltered = [];

            /* delete empty query */
            for (var filter in filters) {
                if(filters[filter] === '' || filters[filter] === 'all') {
                    delete filters[filter];
                }
            }

            collectionFiltered = _.where(that.collection.original.toJSON() , filters);

            this.collection.reset(collectionFiltered);
        },
        renderFilteredList: function() {
            var coursesView = new LY.Views.Courses({ collection: this.collection }).render().el;

            this.$(this.maps.course).html(coursesView);
        },
        _compareWithQuery: function (course, query) {
            var title = course.get('title').toLocaleLowerCase(),
                description = course.get('description').toLocaleLowerCase(),
                channelTitle = course.get('channelTitle').toLocaleLowerCase();

            return title.indexOf(query) !== -1 || description.indexOf(query) !== -1 || channelTitle.indexOf(query) !== -1;
        },
        _getFilteredCollectionByQuery: function(query, isOriginalCollection) {
            var that = this,
                collection = (isOriginalCollection) ? that.collection.original.models : that.collection.models;

            return _.filter(collection, function (item) { return that._compareWithQuery(item, query) });
        },
        searchByQuery: function(e) {
            var that = this,
                query = e ? ( e.currentTarget.value ).toLocaleLowerCase() : sessionStorage.getItem('searchQuery'),
                filteredCollection = [];

            /* set searchQuery */
            that.searchQuery = query;
            sessionStorage.setItem('searchQuery', query);

            if(that.searchQuery === '') {
                that.filterByType();
            } else {
                filteredCollection = that._getFilteredCollectionByQuery(that.searchQuery);

                if(!filteredCollection.length){
                    filteredCollection = that._getFilteredCollectionByQuery(that.searchQuery, true);
                }

                that.collection.reset(filteredCollection);
            }
        }
    });

    /**
     * View of CourseDetail details
     */
    LY.Views.CourseDetail = Backbone.View.extend({
        className: 'course_details',
        tpl: LY.Helpers.getTpl('course_detail'),
        render: function() {
            this.$el.html( this.tpl( this.model.toJSON() ) );
            return this;
        },
        events: {
            'click .j-starred_course': 'toggleStarred'
        },
        toggleStarred: function(e) {
            var that = this,
                $btn = $(e.currentTarget),
                courseId = $btn.val(),
                action = $btn.data('flag');

            if ( LY.Courses.Star.update(courseId, action, that) ) {
                 that.render();
            }
        }
    });

    /**
     * View of Lesson details
     */
    LY.Views.Lesson = Backbone.View.extend({
        className: 'lesson',
        tpl: LY.Helpers.getTpl('lesson'),

        render: function() {
            this.$el.html( this.tpl( this.model.toJSON() ) );
            return this;
        }
    });

    /**
     * View of about page
     */
    LY.Views.aboutPage = Backbone.View.extend({
        tpl: 'about',
        render: function(){
            var content = LY.Helpers.getStaticPage('about');
            $(this.el).html(content);

            return this;
        }
    });
}(window, jQuery, _, Backbone));