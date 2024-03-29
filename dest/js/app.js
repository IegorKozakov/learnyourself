;
(function(window, $, Handlebars, _){
    'use strict';

    window.LY = window.LY || {};
    window.LY.version = '0.0.1';
    window.LY.Helpers = {};

    var PATH_TO_STATIC_PAGE = 'static_page/',
        PATH_TO_TPL = 'src/tpl/';

    $(function(){
        new LY.Router();
        Backbone.history.start();
    });

    /**
    * [namespace - create new namespace]
    * @param  {[string]} newNamespace [name of new namespace]
    * @return {[object]}              [root namespace object]
    */
    LY.namespace = function (newNamespace) {
        var namespaces =  newNamespace.split('.'),
            parent = LY,
            i, j;

        if(namespaces[0] === 'LY') {
            namespaces = namespaces.slice(1);
        }

        for (i = 0, j = namespaces.length; i < j; i++) {
            if (typeof parent[namespaces[i]] === 'undefined' ) {
             parent[namespaces[i]] = {};
            }
            parent = parent[namespaces[i]];
        }

        return parent;
    };


    /**
    * [getTpl get template by id]
    * @param  {[string]} id [id of tag]
    * @return {[html]}      [compiles html of template]
    */
    LY.Helpers.getTpl = function(id) {
        var $tpl = $('#' + id),
            tplHTML = '';

        if(!$tpl.length) {
            $.ajax({
                url: PATH_TO_TPL + id + '.html',
                cache: false,
                async: false,
                dataType: "html",
                success: function(data){
                    tplHTML = data;
                }
            });
        } else {
            tplHTML = $tpl.html();
        }

        return Handlebars.compile( tplHTML );
    };

    /**
    * [getStaticPage return static html page]
    * @param  {[string]} name [name of html page (without .html)]
    * @return {[string]} contentHtml [all contents from static page]
    */
    LY.Helpers.getStaticPage = function(name) {
        var contentHtml = '';

        $.ajax({
            url: PATH_TO_STATIC_PAGE + name + '.html',
            cache: false,
            async: false,
            dataType: "html",
            success: function(data){
                contentHtml = data;
            }
        });

        return contentHtml;
    };

    /**
    * [getUrlOrigin return origin of URL]
    * @return {[string]} window.location.origin
    */
    LY.Helpers.getUrlOrigin = function() {
        var wl = window.location;

        if (!wl.origin) {
            wl.origin = wl.protocol + "//" + wl.hostname + (wl.port ? ':' + wl.port: '');
        }

        return wl.origin;
    }

    /**
    * [getNameOfServer return name fo server]
    * @return {[string]} 'github' / 'others'
    */
    LY.Helpers.getNameOfServer = function() {
        return ( window.location.host.indexOf('github') !== -1 ) ? 'github' : 'others';
    };

    LY.Helpers.getPathToData = function(){
        var helpers = this,
            pathIn = '/data/courses.json';

        return (helpers.getNameOfServer() === 'github') ? helpers.getUrlOrigin() + '/learnyourself' + pathIn : helpers.getUrlOrigin() + pathIn;
    };

    LY.Helpers.getNeighborsLessons = function(course, lessonId) {
        var lesson = _.find(course.get('lessons'), function(item) { return item.videoId === lessonId });

        if( lesson.position > 0 ) {
            var lessonPrev = _.find(course.get('lessons'), function(item) { return item.position === lesson.position - 1 });
            lesson.lessonPrev =  lessonPrev;
        }

        if ( lesson.position < course.get('lessons').length - 1 ) {
            var lessonNext = _.find(course.get('lessons'), function(item) { return item.position === lesson.position + 1 });
            lesson.lessonNext = lessonNext;
        }

        lesson.courseId = course.get('id');

        return lesson;
    }
}(window, jQuery, Handlebars, _));
;
(function(window, $, Handlebars, _){
    'use strict';

    /**
     * [DECLARATION OF NUMBER]
     * @param  {[number]} val   [value]
     * @param  {[string]} t     [words separated by \]
     * @return {[string]}       [transformed word]
     */
    Handlebars.registerHelper('declOfNum', function(val, t) {
        var titles = t.split('\\');

        return (val === 1) ? titles[0] : titles[1];
    });

    /**
     * [linkToNeighborLesson]
     * @param  {[string]} text       [title]
     * @param  {[string]} courseId   [course id]
     * @param  {[string]} lessonId   [lesson id]
     * @param  {[string]} className  [name of additional class]
     * @return {[string]}            [Tag a. Link to neighbor lesson]
     */
    Handlebars.registerHelper('linkToNeighborLesson', function(text, courseId, lessonId, className) {
        text = Handlebars.Utils.escapeExpression(text);

        var result = '<a href="#!/course/' + courseId + '/lesson/' + lessonId + '" class="lesson__neighbor_lesson ' + className + '" title="' + text + '"></a>';

        return new Handlebars.SafeString(result);
    });
}(window, jQuery, Handlebars, _));
;
(function(window, $, _){
    LY.namespace('API.Youtube');

    LY.API.Youtube = (function() {
        var KEY = 'AIzaSyA3EWqvGw1-S-67J9kUwSYqK0ZZmY4beDo',
            URI = {
                playlists: 'https://www.googleapis.com/youtube/v3/playlists',
                channels: 'https://www.googleapis.com/youtube/v3/channels',
                playlistItems: 'https://www.googleapis.com/youtube/v3/playlistItems'
            }

        function _parseCourses(data, initialCollection) {
            var collection = [],
                course = {};

            _.each(data.items, function(item) {
                var course = {
                    id: item.id,
                    lessonCount: item.contentDetails.itemCount,
                    title: item.snippet.title,
                    channelId: item.snippet.channelId,
                    description: item.snippet.description,
                    publishedAt: item.snippet.publishedAt,
                    channelTitle: item.snippet.channelTitle
                }

                _.each(initialCollection, function(initialCourse) {
                    if(item.id === initialCourse.id) {
                        course.lang = initialCourse.lang;
                    }
                });

                collection.push(course);
            });

            return collection;
        }

        function _parseChannelInfo(channel) {
            return {
                channelLogo: channel.items[0].snippet.thumbnails.high.url,
                channelDescription: channel.items[0].snippet.description,
                channelViewCount: channel.items[0].statistics.viewCount,
                channelSubscriberCount: channel.items[0].statistics.subscriberCount
            }
        }

        function _parseLessons(playlistItems) {
            var lessons = [];

            _.each(playlistItems.items, function(item) {
                var lesson = {
                    title: item.snippet.title,
                    position: item.snippet.position,
                    videoId: item.contentDetails.videoId,
                    description: item.snippet.description,
                };

                lessons.push(lesson);
            });

            return lessons;
        }

        return {
            loadCourses: function() {
                var defer = $.Deferred(),
                    initialCollection = [],
                    params = {
                        key: KEY,
                        part: 'snippet, contentDetails',

                    };

                if( LY.courses === undefined ) {
                    $.getJSON(LY.Helpers.getPathToData()).then(function(data) {
                        initialCollection = data;
                        params.id =  _.pluck(data, 'id').join(',');

                        return $.ajax(URI.playlists , { data: params });
                    }).then(function(data) {
                        var collection = _parseCourses(data, initialCollection);

                        LY.courses = new LY.Collections.Courses(collection);
                        LY.courses.original = LY.courses.clone();

                        defer.resolve(LY.courses);
                    })
                } else {
                    defer.resolve(LY.courses);
                }

                return defer.promise();
            },
            loadChannel: function(model, channelId) {
                var defer = $.Deferred(),
                    params = {
                        key: KEY,
                        maxResults: 50,
                        part: 'statistics, snippet',
                        id: channelId
                    };

                if(model.get('channelDescription') === undefined) {
                    $.ajax(URI.channels, { data: params }).then(function(channel) {
                        model.set(_parseChannelInfo(channel));
                        defer.resolve(LY.courses);
                    })
                } else {
                    defer.resolve(LY.courses);
                }

                return defer.promise();
            },
            loadPlaylistItems: function(model, playlistsId) {
                var defer = $.Deferred(),
                    params = {
                        key: KEY,
                        maxResults: 50,
                        part: 'contentDetails, snippet',
                        playlistId: playlistsId
                    };

                if(model.get('lessons') === undefined) {
                    $.ajax(URI.playlistItems, { data: params }).then(function(lessons) {
                        model.set('lessons', _parseLessons(lessons));
                        defer.resolve(LY.courses);
                    });
                } else {
                    defer.resolve(LY.courses);
                }

                return defer.promise();
            },
            fetchCourseChannelPlaylists: function(courseId) {
                var that = this,
                    defer = $.Deferred(),
                    course;

                that.loadCourses().then(function(courses) {
                    course = courses.get(courseId);

                    $.when(
                        LY.API.Youtube.loadChannel(course, course.get('channelId')),
                        LY.API.Youtube.loadPlaylistItems(course, course.get('id'))
                    ).then(function() {
                        defer.resolve(course);
                    })
                });

                return defer.promise();
            }
        }
    }());
}(window, jQuery, _));
;
(function(window, $, _, Backbone){
    LY.namespace('Courses.Star');

    LY.Courses.Star = (function() {
        var name = 'coursesStarred';

        function _getCoursesStarred() {
            var courses = localStorage.getItem(name),
                answ;

            if ( _.isString(courses) && !_.isEmpty(courses) ) {
                answ = JSON.parse(courses);
            } else {
                answ = false;
            }

            return answ;
        }

        function _updateStorage(courses) {
            localStorage.setItem(name, JSON.stringify(courses) );
        }

        function _setCourseStarred(id, action, view) {
            var originalModel = LY.courses.original.get(id);

            view.model.set('starred', action);
            originalModel.set('starred', action);
        }

        return {
            getCoursesStarred: _getCoursesStarred,
            isEmpty: function() {
                var courses = _getCoursesStarred();

                return ( courses === null ) ? true : false ;
            },
            isCourseStarredById: function(id) {
                var courses = _getCoursesStarred();

                if ( courses ) {
                    return ( courses.indexOf(id) !== -1 ) ? true : false;
                } else {
                    return false;
                }
            },
            update: function(id, action, view) {
                var courses = _getCoursesStarred() || [],
                    updatedCourses = [];

                if( action === 'add' ) {
                    updatedCourses = courses.push(id);
                    updatedCourses = courses;
                } else if ( action === 'remove' ) {
                    updatedCourses = _.without(courses, id);
                }
                _updateStorage(updatedCourses);

                if (view.model.get('starred')) {
                    _setCourseStarred(id, false, view)
                } else {
                    _setCourseStarred(id, true, view);
                }

                return true;
            }
        }
    })();
}(window, jQuery, _, Backbone));
;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Models');

    LY.Models.Course = Backbone.Model.extend({
        defaults: {
            'lang': 'en',
            'starred': false
        },
        initialize: function() {
            /* Check is this course is starred */
            if( LY.Courses.Star.isEmpty() ) { return false }

            if( LY.Courses.Star.isCourseStarredById( this.get('id') )) {
                this.set('starred', true);
            }
        }
    });

    LY.Models.Lesson = Backbone.Model.extend({
        default: {
            'lessonPrev': false,
            'lessonNext': false
        }
    });

}(window, jQuery, _, Backbone));
;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Collections');

    LY.Collections.Courses = Backbone.Collection.extend({
        model: LY.Models.Course
    });
}(window, jQuery, _, Backbone));
;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Views');

    LY.Views.Course = Backbone.View.extend({
        tagName: 'li',
        className: 'courses_preview__item',
        tpl: LY.Helpers.getTpl('courses'),
        render: function() {
            this.$el.html( this.tpl( this.model.toJSON() ) );
            return this;
        },
        events: {
            'click .j-starred_course': 'toggleStarred'
        },
        toggleStarred: function(e) {
            var that = this,
                $btn = $(e.currentTarget),
                courseId = $btn.val(),
                action = $btn.data('flag');

            if ( LY.Courses.Star.update(courseId, action, that) ) {
                 that.render();
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
            this.$el.html( $( this.tpl() ).append( this.createSelect()) );
            return this;
        },
        getLangs: function() {
            return _.uniq(this.collection.pluck('lang'));
        },
        createSelect: function() {
            var activeFilter = sessionStorage.getItem('filterLang') || 'all',
                $select = $('<select/>', {
                    'name': 'lang',
                    'id': 'filterBylang',
                    'class': 'ct-select',
                    'html': '<option value="all">All lang</option>'
                });

            _.each(this.getLangs(), function (item) {
                $('<option/>', {
                    'value': item,
                    'text': item
                }).appendTo($select);
            });

            $select.find('option[value=' + sessionStorage.getItem('filterLang') + ']').prop('selected', true);

            return $select;
        }
    });

    /**
     * View of index page
     */
    LY.Views.IndexDirectory = Backbone.View.extend({
        className: 'index',
        tpl: LY.Helpers.getTpl('index'),
        events: {
            'change #filterBylang': 'setFilter'
        },
        initialize: function() {
            this.on("change:filterType", this.filterByType, this);
            this.collection.on("reset", this.renderFilteredList, this);
        },
        render: function () {
            this.$el.html(this.tpl());

            this.$('#filters').html(new LY.Views.Filters({collection: this.collection.original}).render().el);

            if( sessionStorage.getItem('filterLang') === 'all' || sessionStorage.getItem('filterLang') === null) {
                this.$('#courses_preview').html(new LY.Views.Courses({collection: this.collection}).render().el);
            } else {
                this.filter = sessionStorage.getItem('filterLang');
                this.filterByType();
            }

            return this;
        },
        setFilter: function(e) {
            this.filter = e.currentTarget.value;
            sessionStorage.setItem('filterLang', this.filter);

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
        },
        renderFilteredList: function() {
            var coursesView = new LY.Views.Courses({collection: this.collection}).render().el;

            this.$('#courses_preview').html(coursesView);
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
        },
        events: {
            'click .j-starred_course': 'toggleStarred'
        },
        toggleStarred: function(e) {
            var that = this,
                $btn = $(e.currentTarget),
                courseId = $btn.val(),
                action = $btn.data('flag');

            if ( LY.Courses.Star.update(courseId, action, that) ) {
                 that.render();
            }
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
;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Router');

    LY.Router = Backbone.Router.extend({
        $main: $('.j-main'),
        initialize: function() {
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

            LY.API.Youtube.loadCourses().done(function(courses) {
                var indexDirectory = new LY.Views.IndexDirectory({
                    collection: courses
                });

                that.updateView(indexDirectory);
            });
        },
        course: function (courseId) {
            var that = this;

            LY.API.Youtube.fetchCourseChannelPlaylists(courseId).then(function(course) {
                that.updateView( new LY.Views.CourseDetail({ model: course }) );
            });
        },
        lesson: function(courseId, videoId) {
            var that = this;

            LY.API.Youtube.fetchCourseChannelPlaylists(courseId).then(function(course) {
                var lesson = LY.Helpers.getNeighborsLessons(course, videoId);

                that.updateView(new LY.Views.Lesson({model: new LY.Models.Lesson( lesson )}))
            });
        },
        about: function() {
            this.updateView(new LY.Views.aboutPage());
        },
        default: function(query) {
            console.log('We don\'t know anythings about ' + query);
        }
    });
}(window, jQuery, _, Backbone));