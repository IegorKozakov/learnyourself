;
(function(window, $, _, Backbone){
  'use strict';

  LY.namespace('App.Models');
  LY.namespace('App.Views');
  LY.namespace('App.Collections');
  LY.namespace('App.Router');

  var coursesList = {
  "courses": [
    {
      "id": 1,
      "name": "Start work with Backbone.js",
      "description": "In this course your understand how to work SPA app and we will create clone of Gmail.",
      "tags": "Backbone, SPA app, JavaScript",
      "lang": "ru",
      "authors": [
        {
          "name": "LoftBlog",
          "site": "http://loftblog.ru/",
          "email": "loftblog@lb.ru",
          "socialHubs": [
            {
              "twitter": "loftblog",
              "facebook": "loftblog"
            }
          ]
        }
      ],
      "lessons": [
        {
          "name": "What is Backbone?",
          "description": "In this lesson we understand what is it backbobe.js",
          "url": "O7gp4VL0otA"
        }
      ]
    },
    {
      "id": 2,
      "name": "Start work with asdasdasd.js",
      "description": "In this course your undersasdasdasdasdtand how to work SPA app and we will create clone of Gmail.",
      "tags": "Backbone, SPA app, JavaScript",
      "lang": "ru",
      "authors": [
        {
          "name": "LoftBlog",
          "site": "http://loasdasdftblog.ru/",
          "email": "loftbasdasdlog@lb.ru",
          "socialHubs": [
            {
              "twitter": "loftblog",
            }
          ]
        }
      ],
      "lessons": [
        {
          "name": "What is Backbone?",
          "description": "In this lesson we asdasd what is it backbobe.js",
          "url": "O7gp4VL0otA"
        }
      ]
    }
  ]
};

  // Model of Course
  LY.App.Models.Course = Backbone.Model.extend({
    defaults: {
      'lang': 'en',
      'edu': {
        'finishLessons': []
      }
    }
  });

  // Collection of Courses
  LY.App.Collections.Courses = Backbone.Collection.extend({
    model: LY.App.Models.Course
  });

  // View of Course
  LY.App.Views.Course = Backbone.View.extend({
    tagName: 'div',
    className: 'course',
    tpl: 'course_view',

    initialize: function(){
      this.render();
    },
    render: function(){
      var tpl = LY.Helpers.getTpl(this.tpl);
      this.$el.html( tpl(this.model.toJSON()) );
    }
  });

  // View of courses
  LY.App.Views.Courses = Backbone.View.extend({
    el: '#courses',

    initialize: function(){
      this.render();
    },
    render: function(){
      this.$el.empty();

      this.collection.each(function(course){
        var courseView = new LY.App.Views.Course({model: course});

        this.$el.append(courseView.$el);
      }, this);
      return this;
    }
  });

  // Routers
  LY.App.Router = Backbone.Router.extend({
      routes: {
        ''      : 'index',
        'about(/)' : 'about',
        'course:idCourse(/)' : 'course',
        'course:idCourse/lesson:idLesson(/)': 'lesson',
        '*query' : 'default'
      },

      index: function() {
        console.log('index page');
      },
      about: function() {
        console.log('about page');
      },
      course: function(idCourse) {
        console.log('page of course #' + idCourse );
      },
      lesson: function(idCourse, idLesson) {
        console.log('page of course #' + idCourse + ' - lesson #' + idLesson);
      },
      default: function(query) {
        console.log('WTF? We don\'t know anythings about ' + query);
      }
  });

  new LY.App.Router();
  Backbone.history.start();

  // init
  var coursesCollection = new LY.App.Collections.Courses(coursesList.courses);
  var coursesView = new LY.App.Views.Courses({collection: coursesCollection});
}(window, jQuery, _, Backbone));




