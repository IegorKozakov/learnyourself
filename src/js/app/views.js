;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Views');

    LY.Views.Course = Backbone.View.extend({
        tagName: 'article',
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
                $btn = $(e.currentTarget);

            if ( LY.Courses.Star.update($btn.val(), $btn.data('flag'), that) ) {
                 that.render();
            }
        }
    });

    LY.Views.Courses = Backbone.View.extend({
        tagName: 'div',
        className: 'courses_preview__list',
        render: function(){
            var that = this;

            that.$el.empty();

            that.collection.each(function(course, i, listCourses) {
                var item = new LY.Views.Course({model: course});

                that.$el.append( item.render().el );
            }, that);

            return that;
        }
    });

    LY.Views.Filters = Backbone.View.extend({
        className: 'ct-select_list',
        render: function() {
            var that = this;

            that.$el.html( that._createSelects() );
            return that;
        },
        _createSelects: function() {
            return LY.Helpers.Select.createList();
        }
    });

    LY.Views.IndexDirectory = Backbone.View.extend({
        className: 'index',
        maps: {
            courses: '#courses_preview',
            filters: '.j-filters'
        },
        tpl: LY.Helpers.getTpl('index'),
        events: {
            'change .j-filters': 'setFilter',
            'input  .j-search' : 'setSearchQuery'
        },
        initialize: function() {
            this.on('change:actualizeStateCollection', this.actualizeStateCollection, this);
            this.collection.on('reset', this.renderFilteredList, this);
        },
        render: function () {
            var lastSearchQuery = sessionStorage.getItem('searchQuery');

            this.$el.html( this.tpl() );

            /** render filters */
            this.$( this.maps.filters ).html( new LY.Views.Filters({ collection: this.collection.original }).render().el );

            /** render courses */
            this.$( this.maps.courses ).html( new LY.Views.Courses({ collection: this.collection.original }).render().el );

            if( lastSearchQuery ) {
                LY.Helpers.Search.setQuery(lastSearchQuery);
                this.$el.find('.j-search').val(lastSearchQuery);
            }

            this.actualizeStateCollection();

            return this;
        },
        setFilter: function(e) {
            var $select = $(e.currentTarget);

            if ( $select.attr('name') ) {
                LY.Helpers.Filters.setFilters( $select.attr('name'), $select.val() );
                
                this.trigger("change:actualizeStateCollection");
            }
        },
        setSearchQuery: function(e){
            var query = e ? $.trim(( e.currentTarget.value ).toLocaleLowerCase()) : sessionStorage.getItem('searchQuery');

            LY.Helpers.Search.setQuery( query );

            this.trigger("change:actualizeStateCollection");
        },
        actualizeStateCollection: function() {
            var collection = [];

            if( LY.Helpers.Filters.isEnableFilter() && LY.Helpers.Search.getQuery() === '' ){
                collection = LY.courses.original.toJSON();

            } else if ( !LY.Helpers.Filters.isEnableFilter() && LY.Helpers.Search.getQuery() === '' ) {
                collection = LY.Helpers.Filters.getFiltersCollection();

            } else if ( LY.Helpers.Filters.isEnableFilter() && LY.Helpers.Search.getQuery() !== '') {
                 collection = LY.Helpers.Search.getCollectionByQuery( );

            } else {
                collection = LY.Helpers.Search.getCollectionByQuery(false, LY.Helpers.Filters.getFiltersCollection());
            }

            this.collection.reset( collection );
        },
        renderFilteredList: function() {
            var coursesView = new LY.Views.Courses({ collection: this.collection }).render().el;

            this.$( this.maps.courses ).html(coursesView);
        }
    });

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

    LY.Views.Lesson = Backbone.View.extend({
        className: 'lesson',
        tpl: LY.Helpers.getTpl('lesson'),

        render: function() {
            this.$el.html( this.tpl( this.model.toJSON() ) );
            return this;
        }
    });

    LY.Views.aboutPage = Backbone.View.extend({
        className: 'about_page',
        tpl: 'about',
        render: function(){
            var that = this;
            LY.Helpers.getContent('http://github-raw-cors-proxy.herokuapp.com/dimaspirit/learnyourself/blob/gh-pages/README.md').then(function(data){$(that.el).html(data);});
            return this;
        }
    });
}(window, jQuery, _, Backbone));