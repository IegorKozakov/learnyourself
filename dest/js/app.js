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

    /** XXX - don't know - main.js or helpers.js
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

    LY.Models.CoursePreview = Backbone.Model.extend({});

    LY.Models.Course = Backbone.Model.extend({});

    LY.Models.Lesson = Backbone.Model.extend({});

}(window, jQuery, _, Backbone));
;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Collections');

    LY.Collections.CoursesPreview = Backbone.Collection.extend({
        model: LY.Models.CoursePreview,
        url: 'learnyourself/data/courses.json'
    });

    LY.Collections.Courses = Backbone.Collection.extend({
        model: LY.Models.Course,
        url: 'learnyourself/data/courses.json'
    });

}(window, jQuery, _, Backbone));
;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Views');

    /**
     * View of list of courses
     */
    LY.Views.CoursesPreview = Backbone.View.extend({
        className: 'preview_courses',
        render: function(){
            this.collection.each( this.renderCourse, this);
            return this;
        },
        renderCourse: function(course) {
            var coursePreview = new LY.Views.CoursePreview({ model: course});
            this.$el.append(coursePreview.render().el);
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
    LY.Views.CourseDetail = Backbone.View.extend({
        className: 'course_details',
        tpl: LY.Helpers.getTpl('courseDetail'),

        render: function() {
            this.$el.html( this.tpl( this.model.toJSON() ) );
            return this;
        }
    });

    /**
     * View of CourseDetail details
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
    })


}(window, jQuery, _, Backbone));
;
(function(window, $, _, Backbone){
    'use strict';

    LY.namespace('Router');

    LY.Router = Backbone.Router.extend({
        initialize: function() {
            LY.courses = new LY.Collections.Courses();

            /* setup set of defaults models */
            LY.courses.fetch({ async: false });
        },
        $main: $('.j-main'),
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
            var viewOfCoursesPreview = new LY.Views.CoursesPreview({collection: LY.courses})
            this.updateView(viewOfCoursesPreview);
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