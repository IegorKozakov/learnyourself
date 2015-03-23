var coursesList = {
  "courses" : [
    {
      "name": "Backbone.js",
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

// View of Course
var CourseView = Backbone.View.extend({
	tagName: 'li',
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

// Collection of Courses
var CoursesCollection = Backbone.Collection.extend({
	model: Course
});

// View of courses
var CoursesView = Backbone.View.extend({
	tagName: 'ul',

	initialize: function(){
		console.log(this.collection);
	},
	render: function(){
		this.collection.each(function(){
			var courseView = new CourseView({model: course});
		}, this);
	}
});

var course = new Course({'lang': 'er'});
var coursesCollection = new CoursesCollection(coursesList.courses);
var coursesView = new CoursesView({collection: coursesCollection});


// var courseView = new CourseView({model: course});



// $('body').append(courseView.el);


// Collection
// var PeopleCollection = Backbone.Collection.extend({
// 	model: Person
// });

// View of collection
// var PeopleCollectionView = Backbone.View.extend({
// 	tagName: 'ul',
// 	initialize: function(){
// 		console.log(this.collection);
// 	}
// });

// var people = [{name: 'Ivan'},{name: 'Sergey'},{name: 'Batman'}]

// var p = new Person();
// var pV = new PersonView({model: p});
// pV.render();

// var pC = new PeopleCollection(people)
// var peopleView = new PeopleCollectionView({collection: PeopleCollection});


// $('body').append(pV.el);
