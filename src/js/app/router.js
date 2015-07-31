;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Router');

    LY.API.Youtube = {
        loadPlaylists: function() {
            return $.ajax({
                type: 'GET',
                dataType: "json",
                url: LY.Helpers.getPathToData()
            });
        },
        loadPlaylistDetails: function(parts) {
            var defer = $.Deferred();

            function _getRequestForPlaylistYA (array) {
                var request = LY.YoutubeAPI.urls.MAIN + LY.YoutubeAPI.urls.PLAYLISTS + '?' + 'part=snippet,contentDetails&' + 'key=' + LY.YoutubeAPI.KEY + '&id=';

                _.each(array, function(el, i){
                    request += el.playlistId;

                    if(i !== (array.length - 1)) { request += ','}
                });
                return request;
            }

            LY.API.Youtube.loadPlaylists().done(function(response){
                $.ajax({
                        type: 'GET',
                        dataType: "json",
                        async: false,
                        url: _getRequestForPlaylistYA(response),
                        success: function(data) {
                           defer.resolve(data);
                        }
                    });
            });

            return defer.promise();
        },

        loadCourses: function() {
            var defer = $.Deferred();

                if(LY.courses === undefined){
                    LY.API.Youtube.loadPlaylistDetails(['snippet']).done(function(data){
    
                        var modelsProto = data.items;

                        modelsProto.forEach(function(el, i){
                            el.id = i;
                        });


                        LY.courses = new LY.Collections.Courses(modelsProto);
                        LY.courses.original = LY.courses.clone();
                        defer.resolve(LY.courses);
                    });
                }else{
                    defer.resolve(LY.courses);
                }
                
                return defer.promise();
        }
    };

    LY.Router = Backbone.Router.extend({
        $main: $('.j-main'),
        initialize: function() {


            var that = this,
                coursesList,
                modelsProto;
        },
        _getRequestForPlaylistYA: function(array) {
            var request = LY.YoutubeAPI.urls.MAIN + LY.YoutubeAPI.urls.PLAYLISTS + '?' + 'part=snippet,contentDetails&' + 'key=' + LY.YoutubeAPI.KEY + '&id=';

            _.each(array, function(el, i){
                request += el.playlistId;

                if(i !== (array.length - 1)) { request += ','}
            });
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
            var that =  this;

            LY.API.Youtube.loadCourses().done(function(courses){
                var indexDirectory = new LY.Views.IndexDirectory({
                    collection: courses
                });
                that.updateView(indexDirectory);
            });
            
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