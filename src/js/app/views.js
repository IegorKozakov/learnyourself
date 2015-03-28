;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Views');

    /**
     * Global View
     */
    LY.Views.App = Backbone.View.extend({
        initialize: function() {
            console.log(this.collection.toJSON());
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
            console.log(course);
            this.$el.append(coursePreview.render().el);
        }
    });

    /**
     * View of preview course
     */

    LY.Views.coursePreview = Backbone.View.extend({
        className: 'courses_preview',
        tpl: '',

        render: function() {
            this.$el.html();
        }
    });


}(window, jQuery, _, Backbone));