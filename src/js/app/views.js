;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Views');

    /**
     * View of list of courses
     */
    LY.Views.CoursesPreview = Backbone.View.extend({
        className: 'courses_preview',
        tpl: LY.Helpers.getTpl('courses_preview'),
        events: {
            'change #lang': 'selectList'
        },
        initialize: function() {
           this.collection.original = this.collection.clone();

           this.on('render', this.renderCourses);
           this.listenTo(this.collection , 'reset', this.renderCourses);
        },
        render: function(){
            this.$el.append(this.tpl());
            return this.trigger('render');
        },
        renderCourses: function() {
            this.$el.find('.preview_course').remove();
            this.collection.each( this.renderCourse, this);
            return this;
        },
        renderCourse: function(course) {
            var coursePreview = new LY.Views.CoursePreview({ model: course});
            this.$el.append(coursePreview.render().el);
        },
        selectList: function(e) {
            var $currentEl = $(e.currentTarget),
                filterObj = {};

            /* filter params */
            filterObj[$currentEl.attr('name')] = $currentEl.val();
            var collectionFiltered = this.collection.original.where(filterObj)

            LY.courses.reset(collectionFiltered);
        }
    });

    /**
     * View of preview course
     */
    LY.Views.CoursePreview = Backbone.View.extend({
        className: 'preview_course',
        tpl: LY.Helpers.getTpl('course_preview'),

        render: function() {
            this.$el.html( this.tpl( this.model.toJSON() ) );
            return this;
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