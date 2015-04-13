/**
 * helpers.js
 *  - getTpl
 */

;
(function(window, $, Handlebars){
  'use strict';

  var PATH_TO_STATIC_PAGE = 'static_page/';

  LY.namespace('Helpers');

  /**
   * [getTpl get template by id]
   * @param  {[string]} id [id of tag]
   * @return {[html]}      [compiles html of template]
   */
    LY.Helpers.getTpl = function(id) {
        return Handlebars.compile( $('#' + id).html() );
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