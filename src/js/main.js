;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('vent');
    LY.vent = _.extend({}, Backbone.Events);

    new LY.Router();
    Backbone.history.start();

    LY.courses = new LY.Collections.Courses();

    LY.courses.fetch().then(function() {
        new LY.Views.App({ collection: LY.courses});
    });

  // // View of Course
  // LY.App.Views.Course = Backbone.View.extend({
  //   tagName: 'div',
  //   className: 'course',
  //   tpl: 'course_view',

  //   initialize: function(){
  //     this.render();
  //   },
  //   render: function(){
  //     var tpl = LY.Helpers.getTpl(this.tpl);
  //     this.$el.html( tpl(this.model.toJSON()) );
  //   }
  // });

}(window, jQuery, _, Backbone));




