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
    Handlebars.registerHelper('declOfNum', function(number, t) {
        var cases = [2, 0, 1, 1, 1, 2],
            titles = t.split('\\');

        return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ]; 
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

    Handlebars.registerHelper("inc", function(value, options) {
        return parseInt(value) + 1;
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
            /* found starred course by id and set status is starred */
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
        model: LY.Models.Course,
        comparator: function(i) {
            return !i.get('starred');
        },
        initialize: function() {
            /* set default searchQuery */
            this.searchQuery = sessionStorage.getItem('filter_lang') || '';
            /* set defaults filters */
            this.filters = [
                {
                    name: 'lang',
                    title: 'Языки',
                    value: sessionStorage.getItem('filter_lang') || 'all'
                },
                {
                    name: 'channelTitle',
                    title: 'Каналы',
                    value: sessionStorage.getItem('filter_channelTitle') || 'all'
                }
            ];
        }
    });
}(window, jQuery, _, Backbone));
;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Views');

    LY.Views.Course = Backbone.View.extend({
        tagName: 'article',
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
        tagName: 'div',
        className: 'courses_preview__list',
        render: function(){
            this.$el.empty();

            this.collection.each(function(course, i, listCourses) {
                var item = new LY.Views.Course({model: course});
                this.$el.append(item.render().el);
            }, this);

            return this;
        }
    });

    LY.Views.Filters = Backbone.View.extend({
        className: 'index__filters',
        render: function() {
            var that = this;

            that.$el.html( that._createSelects() );
            return that;
        },
        _createSelects: function() {
            return LY.Helpers.Select.createList();
        }
    });

    LY.Views.IndexDirectory = Backbone.View.extend({
        className: 'index',
        maps: {
            courses: '#courses_preview',
            filters: '.j-filters'
        },
        tpl: LY.Helpers.getTpl('index'),
        events: {
            'input .j-search': 'searchByQuery',
            'change .j-filters': 'setFilter'
        },
        initialize: function() {
            this.on("change:filterType", this.filterByType, this);
            this.collection.on("reset", this.renderFilteredList, this);
        },
        render: function () {
            this.$el.html( this.tpl() );

            /* render courses */
            this.$( this.maps.courses ).html( new LY.Views.Courses({collection: this.collection}) );

            /* filters */
            this.$( this.maps.filters ).html( new LY.Views.Filters({ collection: this.collection.original }).render().el );
            this.filterByType();

            /* init search */
            if ( sessionStorage.getItem('searchQuery') ) {
                this.$('.j-search').val( sessionStorage.getItem('searchQuery') );
                this.searchByQuery();
            }

            return this;
        },
        setFilter: function(e) {
            var $select = $(e.currentTarget);

            LY.Helpers.Filters.setFilters( $select.attr('name'), $select.val() );

            this.trigger("change:filterType");
        },
        filterByType: function() {
            this.collection.reset( LY.Helpers.Filters.getFiltersCollection() );
        },
        renderFilteredList: function() {
            var coursesView = new LY.Views.Courses({ collection: this.collection }).render().el;

            this.$( this.maps.courses ).html(coursesView);
        },
        _compareWithQuery: function (course, query) {
            var title = course.get('title').toLocaleLowerCase(),
                description = course.get('description').toLocaleLowerCase(),
                channelTitle = course.get('channelTitle').toLocaleLowerCase();

            return title.indexOf(query) !== -1 || channelTitle.indexOf(query) !== -1;
        },
        _getFilteredCollectionByQuery: function(query, isOriginalCollection) {
            var that = this,
                collection = (isOriginalCollection) ? that.collection.original.models : that.collection.models;
          
            return _.filter(collection, function (item) { return that._compareWithQuery(item, query) });
        },
        searchByQuery: function(e) {
            var that = this,
                query = e ? ( e.currentTarget.value ).toLocaleLowerCase() : sessionStorage.getItem('searchQuery'),
                filteredCollection = [];

            /* set searchQuery */
            that.collection.searchQuery = query;
            sessionStorage.setItem('searchQuery', query);

            if(query === '') {
                that.filterByType();
                that._getFilteredCollectionByQuery(query,true);
            } else {
                filteredCollection = that._getFilteredCollectionByQuery(query);

                if(!filteredCollection.length){
                    filteredCollection = that._getFilteredCollectionByQuery(query);
                }

                that.collection.reset(filteredCollection);
            }
        }
    });

    /**
     * View of CourseDetail page
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
     * View of Lesson page
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
        className: 'about_page',
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
        $mainContainer: $('.j-main'),
        loadView : function(view) {
            this.view && this.view.remove();
            this.view = view;
            return this;
        },
        updateView: function(view) {
            this.loadView(view);
            this.$mainContainer.append(view.render().el);
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
;
(function($, _){
    'use strict';

    LY.namespace('Helpers.Filters');

    LY.Helpers.Filters = (function() {
        function _getFilters() {
            var filters = {};

             _.each( LY.courses.filters, function(filter, i){
                if( !(filter.value === 'all') ) {
                    filters[filter.name] = filter.value;
                }
            });

            return filters;
        }

        function _getFiltersCollection() {
            var filters = _getFilters();

            return _.where( LY.courses.original.toJSON(), filters);
        }

        function _setFilters(filterName, filterVal) {
            _.each( LY.courses.filters, function(filter){
                if(filter.name === filterName) {
                    filter.value = filterVal; 
                    return;
                }
            });

            sessionStorage.setItem('filter_' + filterName, filterVal);
        }

        return {
            setFilters: _setFilters,
            getFiltersCollection: _getFiltersCollection
        };
    })();
})(jQuery, _);
;
(function($){
    'use strict';

    LY.namespace('Helpers.Search');

    LY.Helpers.Search = (function() {})();
})(jQuery);
;
(function($){
    'use strict';

    LY.namespace('Helpers.Select');

    LY.Helpers.Select = (function() {
        var defaults = {
            defaultValue: '<option value="all">Все</option>'
        };

        function _getOthersOptions( filterName ) {
            return _.uniq(LY.courses.pluck(filterName));
        }

        function _createOptions( args ) {
            var $options = '';

            _.each( _getOthersOptions(args.name), function (i) {
                $options += '<option value="' + i + '">' + i + '</option>'
            });

            return $options;
        }

        function _selectedOption( $select, sumOfOptions, name, settings ) {
            if (sumOfOptions < 2) {
                $select.prop( "disabled", true ).
                    find('option:nth-child(1)')
                    .prop('selected', true);
            } else {
                $select.prepend(settings.defaultValue);

                if (sessionStorage.getItem('filter_' + name)) {
                    $select.find('option[value="' + sessionStorage.getItem('filter_' + name) + '"]').prop('selected', true);
                }
            }
        }
        
        function _createSelect( args, opts ) {
            var settings = _.extend(defaults, opts),
                $select = $('<select/>', {
                    'name': args.name,
                    'id': 'filterBy' + args.name,
                    'class': 'ct-select ct-select-label j-filters'
                }),
                optionsHTML = '';

            optionsHTML = _createOptions(args);

            $select.append( optionsHTML );

            _selectedOption($select, $(optionsHTML).length, args.name, settings);

            return $('<div/>', {
                'class': 'ct-select_wrap',
                'title': args.title
            }).append( $select );
        }

        function _createListOfSelects() {
            var $selectsWrap = $('<div/>', {
                    class: 'filters__wrap',
                    title: 'filters'
                });

            _.each(LY.courses.filters, function(filter, i, filters) {
                $selectsWrap.append( _createSelect(filter) );
            });

            return $selectsWrap;
        }

        return {
            create: _createSelect,
            createList: _createListOfSelects
        };
    })();
})(jQuery);
