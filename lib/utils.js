var swaggerUtils = function () {
  /************************************************
                  BASIC JS UTIL
  ************************************************/
  /**
   * Extends into the target the provided objects
   * Source : http://youmightnotneedjquery.com/
   *
   * @method _deepExtend
   * @private
   * @param  {object}     out     The target of the merge
   * @param  {object}     arg1    An object containing additional properties to merge in.
   * @param  {object}     argN    Additional objects containing properties to merge in.
   * @return {object}             The object result of the merge
   */
  this.deepExtend = function (out) {
      for (var i = 1; i < arguments.length; i++) {
          var obj = arguments[i];
          if(Object.prototype.toString.call(obj) === '[object Array]'){
            out = out || [];
          }else{
            out = out || {};
          }

          if (!obj)
            continue;

          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              if (typeof obj[key] === 'object')
                 out[key] = this.deepExtend(out[key], obj[key]);
              else
                if(Object.prototype.toString.call(out) === '[object Array]'){
                  out.push(obj[key]);
                }else{
                  out[key] = obj[key];
                }
            }
          }
      }
      return out;
  };

  /************************************************
                    TYPE VALIDATIONS
  ************************************************/
  /**
   * Validates if the provided value if an string
   * @method isString
   * @param  {string}  value objecto to be evaluated
   * @return {Boolean}       True if the provided object is an string
   */
  this.isString = function(value){
    return typeof(value) === "string";
  };
  /**
   * converts an array of strings to one string in camelCase
   * @method arrayToCamelCase
   * @param  {array}  list the array to convert
   * @return {string}       the string converted
   */
  this.arrayToCamelCase = function(list){
    var toRet = "";
    for(var i = 0; i<list.length; i++){
      if(i===0){
        toRet=list[i].toString();
      }else{
        toRet += list[i].charAt(0).toUpperCase() + list[i].slice(1);
      }
    }
    return toRet;
  };

  return this;
};
