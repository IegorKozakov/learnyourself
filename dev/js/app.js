var Person = Backbone.Model.extend({
	defaults: {
		'name' : 'Dima',
		'age': 25,
		'job' : 'dev'
	}
});

var PersonView = Backbone.View.extend({
	initialize: function () {
		console.log(this.model);
	},
	tagName: 'li',
	className: 'person',
	render: function () {
		this.$el.html(this.model.get('name'));
	}
});

var p = new Person;
var pV = new PersonView({model: p});
