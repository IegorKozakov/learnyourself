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

    /**
     * [updateStarredInStorage update array of starred courses in localStorage]
     * @param  {[number]} courseId [id of course]
     * @param  {[string]} flag     [name of action]
     * @return {[boolean]}         [true if all is alright, false is error]
     */
    LY.Helpers.updateStarredInStorage = function(courseId, flag){
        var updateStarred = [],
            alreadyStarred = JSON.parse(localStorage.getItem('starred')) || [],
            flag = $.trim(flag);

        if( flag === 'add' ) {
            if ( alreadyStarred.indexOf(courseId) !== -1 ) {
                return false;
            } else {
                alreadyStarred.push(courseId);
                updateStarred = alreadyStarred;
            }
        } else if( flag === 'remove' ) {
             updateStarred = _.without(alreadyStarred, courseId);
        }

        updateStarred.sort(function(a,b){return a-b;})

        localStorage.setItem('starred', JSON.stringify(updateStarred));
        return true;
    };

    /**
     * HANDLEBARS HELPERS
     */

    /**
     * [Handlebars custom function helper - DECLARATION OF NUMBER]
     * @param  {[number]} val   [value]
     * @param  {[string]} t     [words separated by \]
     * @return {[string]}       [transformed word]
     */
    Handlebars.registerHelper('declOfNum', function(val, t) {
        var titles = t.split('\\');

        return (val === 1) ? titles[0] : titles[1];
    });
}(window, jQuery, Handlebars, _));
;
(function(window, $, _){
    LY.namespace('API.Youtube');

    LY.API.Youtube = (function() {
        var KEY = 'AIzaSyA3EWqvGw1-S-67J9kUwSYqK0ZZmY4beDo',
            collection = {};

        return {
            setCoursesPreviewData: function() {
                var defer = $.Deferred();

                if( LY.courses === undefined ) {
                    $.getJSON(LY.Helpers.getPathToData()).then(function(data) {
                        var params = {
                            key: KEY,
                            part: 'snippet, contentDetails',
                            id: _.pluck(data, 'id').join(',')
                        };

                        collection = data;

                        return $.ajax('https://www.googleapis.com/youtube/v3/playlists', { data: params });
                    }).then(function(data) {
                        _.each(data.items, function(item, i) {
                            _.each(collection, function(collectionItem) {
                                if( collectionItem.id === item.id ) {

                                    collectionItem.title = item.snippet.title;
                                    collectionItem.lessonsCount = item.contentDetails.itemCount;
                                    collectionItem.publishedAt = item.snippet.publishedAt;
                                    collectionItem.description = item.snippet.description;
                                    /* Channel Info */
                                    collectionItem.channelId = item.snippet.channelId;
                                    collectionItem.channelTitle = item.snippet.channelTitle;
                                }
                            })
                        });

                        LY.courses = new LY.Collections.Courses(collection);
                        LY.courses.original = LY.courses.clone();

                        defer.resolve(LY.courses);
                    })
                } else {
                    defer.resolve(LY.courses);
                }

                return defer.promise();
            },
            getChannel: function(channelId) {
                var params = {
                    key: KEY,
                    maxResults: 50,
                    part: 'statistics, snippet',
                    id: channelId
                };
                

                return $.ajax('https://www.googleapis.com/youtube/v3/channels', { data: params });
            },
            getPlaylistItems: function(playlistsId) {
                var params = {
                    key: KEY,
                    maxResults: 50,
                    part: 'contentDetails, snippet',
                    playlistId: playlistsId
                };

                return $.ajax('https://www.googleapis.com/youtube/v3/playlistItems', { data: params });
            }

        }
    }());
}(window, jQuery, _));
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
            var starredCourses = JSON.parse(localStorage.getItem('starred'));

            if(!starredCourses) { return false }

            if( starredCourses.indexOf(this.get('id')) !== -1) {
                this.set('starred', true);
            }
        }
    });

    LY.Models.Lesson = Backbone.Model.extend({});

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
        tpl: LY.Helpers.getTpl('course_preview'),
        render: function() {
            this.$el.html( this.tpl( this.model.toJSON() ) );
            return this;
        },
        events: {
            'click #starred': 'toggleStarred'
        },
        toggleStarred: function(e) {
            var $btn = $(e.currentTarget),
                courseId = $btn.val(),
                action = $btn.data('flag'),
                originalModel = LY.courses.original.get(courseId);

            if ( this.model.get('starred') ) {
                this.model.set('starred', false);
                originalModel.set('starred', false);
            } else {
                this.model.set('starred', true);
                originalModel.set('starred', true);
            }

            if ( LY.Helpers.updateStarredInStorage(courseId, action) ) {
                this.render();
            } else {
                /* TODO: make error for people */
                console.log('Something bad! Reload page');
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
        initialize: function() {

        },
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
        tpl: LY.Helpers.getTpl('index_directory'),
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
            this.$('#courses_preview').html(new LY.Views.Courses({collection: this.collection}).render().el);
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

            LY.API.Youtube.setCoursesPreviewData().done(function(courses) {
                var indexDirectory = new LY.Views.IndexDirectory({
                    collection: courses
                });

                that.updateView(indexDirectory);
            });
        },
        course: function (idCourse) {
            var that = this,
                model;

            LY.API.Youtube.setCoursesPreviewData().then(function( coursesPreview ) {
                model = coursesPreview.get(idCourse);

                var channelId = model.get('channelId'),
                    playlistId = idCourse;

                return $.when( 
                    LY.API.Youtube.getChannel(channelId),
                    LY.API.Youtube.getPlaylistItems(playlistId)
                );
            })
            .then(function(channel, playlistItems) {
                var channelInfo = {
                    channelLogo: channel[0].items[0].snippet.thumbnails.high.url,
                    channelDescription: channel[0].items[0].snippet.description,
                    channelViewCount: channel[0].items[0].statistics.viewCount,
                    channelSubscriberCount: channel[0].items[0].statistics.subscriberCount
                },
                playlistItemsInfo = [];

                _.each(playlistItems[0].items, function(item, i, list) {
                    var lesson = {
                        title: item.snippet.title,
                        position: item.snippet.position,
                        videoId: item.contentDetails.videoId,
                        description: item.snippet.description,
                    }
                    playlistItemsInfo.push(lesson);
                });

                model.set(channelInfo);
                model.set('lessons', playlistItemsInfo);
                //console.log(model.toJSON());

                that.updateView(new LY.Views.CourseDetail({ model: model }));
            });
        },
        lesson: function(playlistId, lessonId) {
            var course = LY.courses.get(playlistId),
                lesson = _.find(course.get('lessons'), function(item) { return item.videoId === lessonId });
            
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