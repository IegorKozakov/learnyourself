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