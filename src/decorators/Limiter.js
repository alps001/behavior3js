this.b3 = this.b3 || {};

(function() {
  "use strict";

  /**
   * This decorator limit the number of times its child can be called. After a
   * certain number of times, the Limiter decorator returns `FAILURE` without 
   * executing the child.
   *
   * @class Limiter
   * @extends Decorator
  **/
  var Limiter = b3.Class(b3.Decorator);
  
  var p = Limiter.prototype;

  /**
   * Node name. Default to `Limiter`.
   *
   * @property name
   * @type {String}
   * @readonly
  **/
  p.name = 'Limiter';

  /**
   * Node title. Default to `Limit X Activations`. Used in Editor.
   *
   * @property title
   * @type {String}
   * @readonly
  **/
  p.title = 'Limit <maxLoop> Activations';

  /**
   * Node parameters.
   *
   * @property parameters
   * @type {String}
   * @readonly
  **/
  p.parameters = {'maxLoop': 1};
  
  p.__Decorator_initialize = p.initialize;
  /**
   * Initialization method. 
   *
   * Settings parameters:
   *
   * - **maxLoop** (*Integer*) Maximum number of repetitions.
   * - **child** (*BaseNode*) The child node.
   *
   * @method initialize
   * @param {Object} settings Object with parameters.
   * @constructor
  **/
  p.initialize = function(settings) {
    settings = settings || {};

    this.__Decorator_initialize(settings);

    if (!settings.maxLoop) {
      throw "maxLoop parameter in Limiter decorator is an obligatory " +
            "parameter";
    }

    this.maxLoop = settings.maxLoop;
  };

  /**
   * Open method.
   *
   * @method open
   * @param {Tick} tick A tick instance.
  **/
  p.open = function(tick) {
    tick.blackboard.set('i', 0, tick.tree.id, this.id);
  };

  /**
   * Tick method.
   *
   * @method tick
   * @param {Tick} tick A tick instance.
   * @returns {Constant} A state constant.
  **/
  p.tick = function(tick) {
    if (!this.child) {
      return b3.ERROR;
    }

    var i = tick.blackboard.get('i', tick.tree.id, this.id);

    if (i < this.maxLoop) {
      var status = this.child._execute(tick);

      if (status == b3.SUCCESS || status == b3.FAILURE)
          tick.blackboard.set('i', i+1, tick.tree.id, this.id);
        
      return status;
    }

    return b3.FAILURE;        
  };

  b3.Limiter = Limiter;

})();