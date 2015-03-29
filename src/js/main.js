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
}(window, jQuery, _, Backbone));




