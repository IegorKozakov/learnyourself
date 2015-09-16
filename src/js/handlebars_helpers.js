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