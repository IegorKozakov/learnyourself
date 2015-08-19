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
        tagName: 'aside',
        className: 'filters',
        render: function() {
            this.$el.html( this.createSelect() );
            return this;
        },
        getLangs: function() {
            return _.uniq(this.collection.pluck('lang'));
        },
        createSelect: function() {
            var activeFilter = sessionStorage.getItem('filterLang') || 'all',
                $select = $('<select/>', {
                    'name': 'lang',
                    'id': 'filterBylang',
                    'class': 'ct-select',
                    'html': '<option value="all">All lang</option>'
                });

            _.each(this.getLangs(), function (item) {
                $('<option/>', {
                    'value': item,
                    'text': item
                }).appendTo($select);
            });

            $select.find('option[value=' + sessionStorage.getItem('filterLang') + ']')
                .prop('selected', true);

            return $select;
        }
    });

    /**
     * View of index page
     */
    LY.Views.IndexDirectory = Backbone.View.extend({
        className: 'index',
        tpl: LY.Helpers.getTpl('index'),
        events: {
            'change #filterBylang': 'setFilter',
            'input #search': 'searchByQuery'
        },
        initialize: function() {
            this.on("change:filterType", this.filterByType, this);
            this.collection.on("reset", this.renderFilteredList, this);
        },
        render: function () {
            this.$el.html(this.tpl());

            this.$('#filters').html( new LY.Views.Filters({collection: this.collection.original}).render().el );

            if( sessionStorage.getItem('filterLang') === 'all' || sessionStorage.getItem('filterLang') === null) {
                this.$('#courses_preview').html( new LY.Views.Courses({collection: this.collection}).render().el );
            } else {
                this.filter = sessionStorage.getItem('filterLang');
                this.filterByType();
            }

            return this;
        },
        setFilter: function(e) {
            this.filter = e.currentTarget.value;
            sessionStorage.setItem('filterLang', this.filter);

            this.trigger("change:filterType");
        },
        filterByType: function() {
            if(this.filter === 'all' || this.filter === undefined) {
                this.collection.reset( this.collection.original.toJSON() );
            } else {
                var filter = this.filter,
                    filtered = _.filter(this.collection.original.models, function (item) {
                        return item.get('lang') === filter;
                    });

                this.collection.reset(filtered);
            }
        },
        renderFilteredList: function() {
            var coursesView = new LY.Views.Courses({collection: this.collection}).render().el;

            this.$('#courses_preview').html(coursesView);
        },
        _compareWithQuery: function (course, query) {
            var title = course.get('title').toLocaleLowerCase(),
                description = course.get('description').toLocaleLowerCase(),
                channelTitle = course.get('channelTitle').toLocaleLowerCase();

            return title.indexOf(query) !== -1 || description.indexOf(query) !== -1 || channelTitle.indexOf(query) !== -1;
        },
        searchByQuery: function(e) {
            var that = this,
                query = ( e.currentTarget.value ).toLocaleLowerCase(),
                filteredCollection = [];

            /* set searchQuery in collection */
            that.searchQuery = query;

            if(that.searchQuery === '') {
                that.collection.reset( that.collection.original.models );
            } else {
                filteredCollection = _.filter(that.collection.models, function (item) {
                    return that._compareWithQuery(item, query) ;
                });

                if(filteredCollection.length === 0){
                    filteredCollection = _.filter(that.collection.original.models, function (item) {
                        return that._compareWithQuery(item, query);
                    });
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