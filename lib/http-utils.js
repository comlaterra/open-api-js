var swaggerHttpUtils = function (utils) {
  this.utils = utils;
  /*******************PRIVATE METHODS*********************/
  var addAuthorization = function(request, options){
    if(options.Authorization !== undefined){
      // Since there is multiple ways to authenticate is better to keep a good abstraction level on this component
      if(options.Authorization.token !== undefined){
        request.setRequestHeader('Authorization', 'Token '+options.Authorization.token);
      }
    }
    return request;
  };
  /*****************END PRIVATE METHODS*******************/
  /**
   * Performs a call to the server using the funciton _constructUrl to get the url where to call
   * @method _call
   * @private
   * @param  {[type]}          callOptions [description]
   * @return {[type]}                      [description]
   */
  this.call = function (callOptions) {
    // if(!utils.validateCallParams(callOptions.requiredParams, callOptions.parameters)){
      // @TODO: make a proper error handler
      // return false;
    // }
    var callDefaultOptions = {
        method: 'GET',
        path : "/",
        async: true,
        callback: function () { return true; },
        callbackError: function () { return true; },
        callbackConnectionError: function(status_code){
          console.error("Connection error with the server. Status code:" + status_code);
        }
    };

    var options = utils.deepExtend({}, callDefaultOptions, callOptions);
    /*
        SETTING UP AND OPENING THE REQUEST
     */
    var request = new XMLHttpRequest();
    request.onload = function () {
      var resp;
      if (request.status >= 200 && request.status < 400) {
        // Success!
        resp = request.responseText;
        options.callback(resp,request.status);
      } else {
        // We reached our target server, but it returned an error
        resp = request.responseText;
        options.callbackError(resp, request.status);
      }
    };

    request.onerror = function () {
        options.callbackConnectionError(request.status);
    };

    /*
        END SETTING UP AND OPENING THE REQUEST
    */
    options.parameters = processParams(options)
    /* small changes if is a get or post request */
    if(options.method === 'GET'){
      /* We use the params as a url params and we remove it because it will be user as a header params in the call method */
      options.path = this.constructUrl(options, options.parameters);
      request.open(options.method, options.path, options.async);
      request = addAuthorization(request, options);
      options.parameters = {};
    }else{
      /* We construct the url without params. */
      options.path = this.constructUrl(options);
      request.open(options.method, options.path, options.async);
      request = addAuthorization(request, options);
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    }
    var encodedParams = this.encodeParamsToSend(options.parameters);
    request.send(encodedParams);
  };
  /**
   * Constructs a url based in the basePath, endpoint, apiVersion setted as a config, and the action received as a param.
   *   If it receives any url param, it will be setted in a GET mode.
   *   *** this coule be improved with multiple customized functionalities, like subdomains, friendly urls, etc
   * @method _constructUrl
   * @private
   * @param  {object}          options   The options that will be used to contruct the url. The required attributes are:
   *                                     basePath
   *                                     endpoint
   *                                     apiVersion
   *                                     action
   * @param  {object}          urlParams The object containing the relation between attr name and value that will be added as a get params
   * @return {string}                    A strinc with the url. The format will be:
   *                                       hotname/endPoint/api/apiVersion/action?param1=value1?paramN=valueN
   */
  this.constructUrl = function(options, urlParams){
    var basePath = options.basePath;
    var url = options.path ? options.path : "";

    if(!basePath){
      console.error("No basePath provided");
      return;
    }
    var endPoint = options.endPoint?"/"+options.endPoint:"";
    var apiVersion = options.apiVersion?"/"+options.apiVersion:"";
    url = basePath + url + endPoint + apiVersion;

    /* in the case that it have param for the url we add it in the most simple way */
    if (urlParams !== undefined){
      // urlParams = processParams(urlParams);
      if(Object.keys(urlParams).length !== 0){
        url += "?";
        url += this.encodeParamsToSend(urlParams);
      }

    }
    return url;
  };
  /**
   * Encharged of getting from the options the param definition (parameters) and
   * the user params (params), merge them, and return the actually list of params
   * An example of param definition:
      defaultValue:10,
      value: 5,
      description:""
      format:"int32"
      name:"limit"
      paramType:"query"
      required:false
      type:"integer"
   */
  var processParams = function(options){
    // @TODO: Here is where the param validation should go.
    // Problem: Are the "type" defined somewhere? Can we make a mapping between them?
    var param;
    var ret = {};
    // doesn't make sense to go through params that are not actually in the API,
    // So only ging through the param definition, and getting form both
    if(options.parameters){
      for (var i = 0; i < options.parameters.length; i++) {
        param = options.parameters[i];
        // if is not required and doesn't have any value , neither as a default or
        // as a user input, we do nothing
        if(param.required === false && param.value === undefined && options.params[param.name] === undefined){
          continue;
        }else{
          if(options.params[param.name] !== undefined){
            ret[param.name] = options.params[param.name];
          }else if(param.defaultValue !== undefined || param.value !== undefined ){
            ret[param.name] = (param.value!==undefined)?param.value:param.defaultValue;
          }
        }
      }
    }
    // Forcing the introduction of some user parameters even if they are not in the definition
    // Really unperformed operation due to wrong swagger endpoint serializers
    if(options.forceParams && options.params && options.params != {}){
      var param;
      var paramNames = Object.keys(options.params)
      var parameterDefinition;
      var found;
      for (var i = 0; i < paramNames.length; i++) {
        found = false;
        paramName = paramNames[i];
        paramValue = options.params[paramName];
        for (var y = 0; y < options.parameters.length; y++) {
          parameterDefinition = options.parameters[y];
          if(parameterDefinition.name === paramName){
            parameterDefinition.value = paramValue;
            found = true;
            break;
          }
        }
        if(found === true){
          continue;
        }else{
          ret[paramName] = paramValue;
        }
      }
    }
    return ret;
  }
  /************************************************
                COMMUNICATION BASED UTILS
  ************************************************/
  /**
   * Function that converts a simple object to a list of params to send to any call (get or post)
   * @method _encodeParamsToSend
   * @private
   * @param  {object}          params the simple (one level) object containing the key and the value of the param
   * @return {string}                 The params encoded for being sent (param1=value1&param2=value2 ... )
   */
  this.encodeParamsToSend = function(params){
    var encodedParams = "";
    for(var paramName in params){
      encodedParams += paramName + "=" + params[paramName]+ "&";
    }
    encodedParams = encodedParams.substring(0,encodedParams.length-1);
    return encodedParams;
  };

  /**
   * Validates the params
     * @TODO: Add more information about the required params and make more validations, like tipe, minval, etc.
   * @method _validateCallParams
   * @private
   * @param  {arary}     requiredParams The list of required params for this call
   * @param  {object}          params   The object containing key : value
   * @return {boolean}                    If params pass the validation or not
   */
  this.validateCallParams = function(requiredParams, params){
    /**
     * Validating that the call is properly done.
     */
     for (var i = requiredParams.length - 1; i >= 0; i--) {
       var requiredParam = requiredParams[i];
       if (params[requiredParam] === undefined){
        console.error("The param " + requiredParam + " is required");
        return false;
       }
     }
     return true;
  };
  return this;
};
