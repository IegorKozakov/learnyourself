/**
 * helpers.js
 *  - getTpl
 */

;
(function(window, $){
  'use strict';

  LY.namespace('Helpers');

  /**
   * [getTpl get template by id]
   * @param  {[string]} id [id of tag]
   * @return {[html]}      [compiles html of template]
   */
  LY.Helpers.getTpl = function(id) {
    return _.template($('#' + id).html());
  };

}(window, jQuery));