;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Views');

    LY.Views.Course = Backbone.View.extend({
        tagName: 'li',
        className: 'courses_preview__item',
        tpl: LY.Helpers.getTpl('course_preview'),
        render: function() {
            this.$el.html( this.tpl( this.model.toJSON() ) );
            return this;
        },
        events: {
            'click #starred': 'toggleStarred'
        },
        toggleStarred: function(e) {
            var $btn = $(e.currentTarget),
                courseId = +$btn.val(),
                action = $btn.data('flag'),
                originalModel = LY.courses.original.get(courseId);

            if ( this.model.get('starred') ) {
                this.model.set('starred', false);
                originalModel.set('starred', false);
            } else {
                this.model.set('starred', true);
                originalModel.set('starred', true);
            }

            if ( LY.Helpers.updateStarredInStorage(courseId, action) ) {
                this.render();
            } else {
                /* TODO: make error for people */
                console.log('Something bad! Reload page');
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
        tpl : LY.Helpers.getTpl('filters'),
        render: function() {
            this.$el.html( this.tpl() );
            return this;
        }
    });

    /**
     * View of index page
     */
    LY.Views.IndexDirectory = Backbone.View.extend({
        className: 'index',
        tpl: LY.Helpers.getTpl('index_directory'),
        events: {
            'change #filterBylang': 'setFilter'
        },
        initialize: function() {
            this.on("change:filterType", this.filterByType, this);
            this.collection.on("reset", this.renderFilteredList, this);
        },
        render: function () {
            this.$el.html(this.tpl());

            this.$('#filters').html(new LY.Views.Filters().render().el);
            this.$('#courses_preview').html(new LY.Views.Courses({collection: this.collection}).render().el);

            return this;
        },
        setFilter: function(e) {
            this.filter = e.currentTarget.value;
            this.trigger("change:filterType");
        },
        filterByType: function() {
            if(this.filter === 'all') {
                this.collection.reset(this.collection.original.toJSON());
            } else {
                var filter = this.filter,
                    filtered = _.filter(this.collection.original.models, function (item) {
                        return item.get('lang') === filter;
                    });

                this.collection.reset(filtered);

            }
            console.log(this.collection.toJSON());
        },
        renderFilteredList: function() {
            this.$('#courses_preview').html(new LY.Views.Courses({collection: this.collection}).render().el);
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