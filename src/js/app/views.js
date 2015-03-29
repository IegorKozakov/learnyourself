;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Views');

    /**
     * Global View
     */
    LY.Views.App = Backbone.View.extend({
        initialize: function() {
            var courses = new LY.Views.Courses({collection: LY.courses}).render();
            $('.main').append(courses.render().el);
        }
    })

    /**
     * View of list of courses
     */
    LY.Views.Courses = Backbone.View.extend({
        className: 'courses',

        render: function(){
            this.$el.empty();
            this.collection.each( this.addOne, this);
            return this;
        },
        addOne: function(course) {
            var coursePreview = new LY.Views.coursePreview({ model: course});
            this.$el.append(coursePreview.render().el);
        }
    });

    /**
     * View of preview course
     */
    LY.Views.coursePreview = Backbone.View.extend({
        className: 'coursesPreview',
        tpl: LY.Helpers.getTpl('previewCourse'),

        render: function() {
            this.$el.html( this.tpl( this.model.toJSON() ) );
            return this;
        }
    });


}(window, jQuery, _, Backbone));