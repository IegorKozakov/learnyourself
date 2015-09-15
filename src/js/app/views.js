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
                $btn = $(e.currentTarget),
                courseId = $btn.val(),
                action = $btn.data('flag');

            if ( LY.Courses.Star.update(courseId, action, that) ) {
                 that.render();
            }
        }
    });

    LY.Views.Courses = Backbone.View.extend({
        tagName: 'div',
        className: 'courses_preview__list',
        render: function(){
            this.$el.empty();

            this.collection.each(function(course, i, listCourses) {
                var item = new LY.Views.Course({model: course});
                this.$el.append(item.render().el);
            }, this);

            return this;
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
            'input .j-search': 'searchByQuery',
            'change .j-filters': 'setFilter'
        },
        initialize: function() {
            this.on("change:filterType", this.filterByType, this);
            this.collection.on("reset", this.renderFilteredList, this);
        },
        render: function () {
            this.$el.html( this.tpl() );

            /* render courses */
            this.$( this.maps.courses ).html( new LY.Views.Courses({collection: this.collection}) );

            /* filters */
            this.$( this.maps.filters ).html( new LY.Views.Filters({ collection: this.collection.original }).render().el );
            this.filterByType();

            /* init search */
            if ( sessionStorage.getItem('searchQuery') ) {
                this.$('.j-search').val( sessionStorage.getItem('searchQuery') );
                this.searchByQuery();
            }

            return this;
        },
        setFilter: function(e) {
            var $select = $(e.currentTarget);

            LY.Helpers.Filters.setFilters( $select.attr('name'), $select.val() );

            this.trigger("change:filterType");
        },
        filterByType: function() {
            this.collection.reset( LY.Helpers.Filters.getFiltersCollection() );
        },
        renderFilteredList: function() {
            var coursesView = new LY.Views.Courses({ collection: this.collection }).render().el;

            this.$( this.maps.courses ).html(coursesView);
        },
        _compareWithQuery: function (course, query) {
            var title = course.get('title').toLocaleLowerCase(),
                description = course.get('description').toLocaleLowerCase(),
                channelTitle = course.get('channelTitle').toLocaleLowerCase();

            return title.indexOf(query) !== -1 || channelTitle.indexOf(query) !== -1;
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
            that.collection.searchQuery = query;
            sessionStorage.setItem('searchQuery', query);

            if(query === '') {
                that.filterByType();
                that._getFilteredCollectionByQuery(query,true);
            } else {
                filteredCollection = that._getFilteredCollectionByQuery(query);

                if(!filteredCollection.length){
                    filteredCollection = that._getFilteredCollectionByQuery(query);
                }

                that.collection.reset(filteredCollection);
            }
        }
    });

    /**
     * View of CourseDetail page
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
     * View of Lesson page
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
        className: 'about_page',
        tpl: 'about',
        render: function(){
            var content = LY.Helpers.getStaticPage('about');
            $(this.el).html(content);

            return this;
        }
    });
}(window, jQuery, _, Backbone));