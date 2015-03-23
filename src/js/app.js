var coursesList = {
  "courses" : [
    {
      "name": "Backbone.js",
      "description": "Cousrse about Backbone",
      "lang": "ru",
      "authors": {
        "company": "LoftBlog",
        "site": "http://loftblog.ru/"
      },
      "lessons": [
        {
          "name": "What is Backbone?",
          "description": "In this lesson we understand what is it backbobe.js",
          "url": "O7gp4VL0otA"
        }
      ]
    },
    {
      "name": "Sratr with React.js",
      "description": "Cousrse about React",
      "lang": "en",
      "authors": {
        "company": "LoftBlog",
        "site": "http://loftblog.ru/"
      },
      "lessons": [
        {
          "name": "What is Backbone?",
          "description": "In this lesson we understand what is it backbobe.js",
          "url": "O7gp4VL0otA"
        },
        {
          "name": "What is Backbone?",
          "description": "In this lesson we understand what is it backbobe.js",
          "url": "O7gp4VL0otA"
        }
      ]
    }
  ]
};

// Model of Course
var Course = Backbone.Model.extend({
	defaults: {
		'lang': 'en'
	}
});

// Collection of Courses
var CoursesCollection = Backbone.Collection.extend({
  model: Course
});

// View of Course
var CourseView = Backbone.View.extend({
	tagName: 'div',
	className: 'course',
	tpl: '#course_view',

	initialize: function(){
		this.render();
		//this.listenTo(this.model, "change", this.render);
	},
	render: function(){
		var tpl = _.template( $(this.tpl).html() );
		this.$el.html( tpl(this.model.toJSON()) );
	}
});

// View of courses
var CoursesView = Backbone.View.extend({
  el: '#courses',

	initialize: function(){
    this.render();

    this.render();
		console.log(this.collection);
	},
	render: function(){
    this.$el.empty();
		this.collection.each(function(course){
      console.log(course);
			var courseView = new CourseView({model: course});
      this.$el.append(courseView.$el);
		}, this);
    return this;
	}
});

var coursesCollection = new CoursesCollection(coursesList.courses);
var coursesView = new CoursesView({collection: coursesCollection});