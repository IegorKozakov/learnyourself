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