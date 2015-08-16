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