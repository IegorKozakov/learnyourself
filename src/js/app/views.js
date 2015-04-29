;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Views');

    /**
     * View of list of courses
     */
    LY.Views.CoursesPreview = Backbone.View.extend({
        className: 'preview_courses',
        render: function(){
            this.collection.each( this.addOne, this);
            return this;
        },
        addOne: function(course) {
            var coursePreview = new LY.Views.CoursePreview({ model: course});
            this.$el.append(coursePreview.render().el);
        }
    });

    /**
     * View of preview course
     */
    LY.Views.CoursePreview = Backbone.View.extend({
        className: 'preview_course',
        tpl: LY.Helpers.getTpl('previewCourse'),

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
        tpl: LY.Helpers.getTpl('courseDetail'),

        render: function() {
            this.$el.html( this.tpl( this.model.toJSON() ) );
            return this;
        }
    });

    /**
     * View of CourseDetail details
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
    })


}(window, jQuery, _, Backbone));