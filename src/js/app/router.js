;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Router');

    LY.Router = Backbone.Router.extend({
        $main: $('.j-main'),
        initialize: function() {
            var that = this,
                coursesList,
                modelsProto;


            $.ajax({
                type: 'GET',
                dataType: "json",
                async: false,
                url: LY.Helpers.getPathToData(),
                success: function(data) {
                    console.log(that._getRequestForPlaylistYA(data));
                    $.ajax({
                        type: 'GET',
                        dataType: "json",
                        async: false,
                        url: that._getRequestForPlaylistYA(data),
                        success: function(data) {
                            modelsProto = data.items;

                            modelsProto.forEach(function(el, i){
                                el.id = i;
                            });

                            LY.courses = new LY.Collections.Courses(modelsProto);
                        }
                    });
                }
            });

            _.each(LY.courses.models, function(m, i, list) {
                console.log(m);
            });

            LY.courses.original = LY.courses.clone();
        },
        _getRequestForPlaylistYA: function(array) {
            var request = LY.YoutubeAPI.urls.MAIN + LY.YoutubeAPI.urls.PLAYLISTS + '?' + 'part=snippet,contentDetails&' + 'key=' + LY.YoutubeAPI.KEY + '&id=';

            _.each(array, function(el, i){
                request += el.playlistId;

                if(i !== (array.length - 1)) { request += ','}
            });
            console.log(request);
            return request;
        },
        loadView : function(view) {
            this.view && this.view.remove();
            this.view = view;
            return this;
        },
        updateView: function(view) {
            this.loadView(view);
            this.$main.append(view.render().el);
        },
        routes: {
            '' : 'index',
            '!/about(/)' : 'about',
            '!/course/:idCourse(/)' : 'course',
            '!/course/:idCourse/lesson/:idLesson' : 'lesson',
            '*query' : 'default'
        },

        index: function() {
            var indexDirectory = new LY.Views.IndexDirectory();
            this.updateView(indexDirectory);
        },
        course: function (idCourse) {
            this.updateView(new LY.Views.CourseDetail({ model: LY.courses.get(idCourse) }) );
        },
        lesson: function(idCourse, idLesson) {
            var course = LY.courses.get(idCourse),
                lesson = course.get('lessons')[idLesson];

            this.updateView(new LY.Views.Lesson({model: new LY.Models.Lesson(lesson)}))
        },
        about: function() {
            this.updateView(new LY.Views.aboutPage());
        },
        default: function(query) {
            console.log('We don\'t know anythings about ' + query);
        }
    });
}(window, jQuery, _, Backbone));