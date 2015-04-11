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
     * [Handlebars custom function helper]
     * @param  {[number]} val  [value]
     * @param  {[string]} word [word which transform]
     * @return {[string]}      [transformed word]
     */
    Handlebars.registerHelper('declOfNum', function(num, t) {
      var cases = [2, 0, 1, 1, 1, 2],
          titles = t.split('/');

      return titles[ (num%100>4 && num%100<20)? 2 : cases[(num%10<5)?num%10:5] ];
    });

}(window, jQuery, Handlebars));