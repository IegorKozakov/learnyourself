;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Router');

    LY.Router = Backbone.Router.extend({
        $main: $('.j-main'),
        initialize: function() {
            var PATH_TO_DATA = '/data/courses_v1.json',
                PATH_TO_COURSES_DATA = (LY.Helpers.getNameOfServer() === 'github') ? LY.Helpers.getUrlOrigin() + '/learnyourself' + PATH_TO_DATA : LY.Helpers.getUrlOrigin() + PATH_TO_DATA,
                coursesList,
                pathToPlaylists = LY.Youtube.api.url + LY.Youtube.api.getPlaylist + '?' + 'part=snippet,contentDetails&' + 'key=' + LY.Youtube.api.key + '&id=',
                modelsProto;


            $.ajax({
                type: 'GET',
                dataType: "json",
                async: false,
                url: PATH_TO_COURSES_DATA,
                success: function(data) {
                    data.forEach(function(el, i){
                        pathToPlaylists += el.playlistId;

                        if(i !== (data.length - 1)) { pathToPlaylists += ','}
                    });
                }
            });

            $.ajax({
                type: 'GET',
                dataType: "json",
                async: false,
                url: pathToPlaylists,
                success: function(data) {
                    modelsProto = data.items;

                    modelsProto.forEach(function(el, i){
                        el.id = i;
                    });

                    LY.courses = new LY.Collections.Courses(modelsProto);
                }
            });

            //$.getJSON(PATH_TO_COURSES_DATA)
                // .done(function(data) {
                //     data.forEach(function(el, i){
                //         pathToPlaylists += el.playlistId;

                //         if(i !== (data.length - 1)) { pathToPlaylists += ','}
                //     });

                //     $.get(pathToPlaylists)
                //     .done(function(d) {
                //         modelsProto = d.items;

                //         modelsProto.forEach(function(el, i){
                //             el.id = i;
                //         });

                //         LY.courses = new LY.Collections.Courses(modelsProto);
                //     })
                // });

            // console.log(modelsProto);
            // LY.courses = new LY.Collections.Courses();

            /* setup set of defaults models */
            //LY.courses.fetch({ async: false });
            //LY.courses.original = LY.courses.clone();
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