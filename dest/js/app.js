/**
 * helpers.js
 *  - getTpl
 */
;
(function(window, $, Handlebars){
    'use strict';

    window.LY = window.LY || {};
    window.LY.version = '0.0.1';

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

    var PATH_TO_STATIC_PAGE = 'static_page/',
        PATH_TO_TPL = 'src/tpl/';

    LY.namespace('Helpers');

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

    /**
     * [Handlebars custom function helper - DECLARATION OF NUMBER]
     * @param  {[number]} n [value]
     * @param  {[string]} t [words separated by /]
     * @return {[string]}      [transformed word]
     */
    Handlebars.registerHelper('declOfNum', function(n, t) {
        var cases = [2, 0, 1, 1, 1, 2],
        titles = t.split('/');

        return titles[ (n%100>4 && n%100<20) ? 2 : cases[(n%10<5) ? n%10:5] ];
    });
}(window, jQuery, Handlebars));
;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Models');

    LY.Models.Course = Backbone.Model.extend({
        default: {
            'id': 0,
            'title': '',
            'lang': 'en'
        }
    });

    LY.Models.Lesson = Backbone.Model.extend({});

}(window, jQuery, _, Backbone));
;
(function(window, $, _, Backbone){
    'use strict';

    var PATH_TO_DATA = '/data/courses.json',
        COURSES_DATA = (LY.Helpers.getNameOfServer() === 'github') ? LY.Helpers.getUrlOrigin() + '/learnyourself' + PATH_TO_DATA : LY.Helpers.getUrlOrigin() + PATH_TO_DATA;

    LY.namespace('Collections');

    LY.Collections.Courses = Backbone.Collection.extend({
        model: LY.Models.Course,
        url: COURSES_DATA,
    });

}(window, jQuery, _, Backbone));
;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Views');

    LY.Views.Course = Backbone.View.extend({
        className: 'preview_course',
        tpl: LY.Helpers.getTpl('course_preview'),

        render: function() {
            this.$el.html( this.tpl( this.model.toJSON() ) );
            return this;
        }
    });

    LY.Views.Courses = Backbone.View.extend({
        className: 'courses',
        render: function(){
            this.$el.empty();

            this.collection.each(function(i) {
                var item = new LY.Views.Course({model: i});
                this.$el.append(item.render().el);
            }, this);

            return this;
        },
        renderCourse: function(course) {
            var coursePreview = new LY.Views.CoursePreview({ model: course});
            this.$el.append(coursePreview.render().el);
        },
    });

    /**
     * View of index page
     */
    LY.Views.IndexDirectoryView = Backbone.View.extend({
        className: 'index',
        tpl: LY.Helpers.getTpl('index_directory'),
        initialize: function() {

          //  this.coursesPreview.on('some_event', this.someMethod, this);
        },
        render: function () {
            this.$el.html(this.tpl());

            this.$('#courses').html(new LY.Views.Courses({collection: LY.courses}).render().el);

            return this;
        }
    });

    

    /**
     * View of list of courses
     */
    LY.Views.CoursesPreview = Backbone.View.extend({
        className: 'courses_preview',
        tpl: LY.Helpers.getTpl('courses_preview'),
        events: {
            'change #lang': 'selectList'
        },
        initialize: function() {
           this.collection.original = this.collection.clone();

           this.on('render', this.renderCourses);
           this.listenTo(this.collection , 'reset', this.renderCourses);
        },
        render: function(){
            this.$el.append(this.tpl());
            return this.trigger('render');
        },
        _getArticleContainer: function(){
            return this.$('.articles-container');
        },
        renderCourses: function() {
            this._getArticleContainer().empty();
            // this.$el.find('.preview_course').remove();

            this.collection.each( this.renderCourse, this);
            return this;
        },
        renderCourse: function(course) {
            var coursePreview = new LY.Views.CoursePreview({ model: course});
            this._getArticleContainer().append(coursePreview.render().el);
            // this.$el.append(coursePreview.render().el);
        },
        selectList: function(e) {
            var $currentEl = $(e.currentTarget),
                filterObj = {};

            /* filter params */
            filterObj[$currentEl.attr('name')] = $currentEl.val();
            var collectionFiltered = this.collection.original.where(filterObj)

            LY.courses.reset(collectionFiltered);
        }
    });

    /**
     * View of preview course
     */
    LY.Views.CoursePreview = Backbone.View.extend({
        className: 'preview_course',
        tpl: LY.Helpers.getTpl('course_preview'),

        render: function() {
            this.$el.html( this.tpl( this.model.toJSON() ) );
            return this;
        }
    });

    /**
     * View of CourseDetail details
     */
    // LY.Views.CourseDetail = Backbone.View.extend({
    //     className: 'course_details',
    //     tpl: LY.Helpers.getTpl('course_detail'),

    //     render: function() {
    //         this.$el.html( this.tpl( this.model.toJSON() ) );
    //         return this;
    //     }
    // });

    /**
     * View of Lesson details
     */
    // LY.Views.Lesson = Backbone.View.extend({
    //     className: 'lesson',
    //     tpl: LY.Helpers.getTpl('lesson'),

    //     render: function() {
    //         this.$el.html( this.tpl( this.model.toJSON() ) );
    //         return this;
    //     }
    // });

    /**
     * View of about page
     */
    // LY.Views.aboutPage = Backbone.View.extend({
    //     tpl: 'about',
    //     render: function(){
    //         var content = LY.Helpers.getStaticPage('about');
    //         $(this.el).html(content);

    //         return this;
    //     }
    // });
}(window, jQuery, _, Backbone));
;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Router');

    LY.Router = Backbone.Router.extend({
        $main: $('.j-main'),
        initialize: function() {
            LY.courses = new LY.Collections.Courses();
            LY.courses.original = LY.courses.clone();

            /* setup set of defaults models */
            LY.courses.fetch({ async: false });
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
            var indexDirectoryView = new LY.Views.IndexDirectoryView();
            this.updateView(indexDirectoryView);
            //var viewOfCoursesPreview = new LY.Views.CoursesPreview({collection: LY.courses})
            //this.updateView(viewOfCoursesPreview);
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