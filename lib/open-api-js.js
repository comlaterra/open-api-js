/**
 * With this class you will be able to comunicate with boosterMedia servers.
 * @class swaggerAPI
 *
 */
var swaggerAPI = (function () {
    'use-strict';
    var utils = new swaggerUtils();
    var httpUtils = new swaggerHttpUtils(utils);

    function swaggerAPI(userOptions){
      var self = this;
      // setting all default config values
      var defaultOptions = {};
      this.defaultCallOptions = {
          // @TODO: search for a nice example to connect and have a something something. (C42 is okish)
          "basePath": (userOptions.serverInfo.basePath)?userOptions.serverInfo.basePath:'http://example.api',
          "Authorization": userOptions.Authorization
      };
      this.options = utils.deepExtend(defaultOptions, userOptions);
      // Validate of the required config params
      if(!this.options.serverInfo && !this.options.serverInfo.basePath){
        console.error("Server info.basePath is a mandatory field");
        return;
      }
      // In the future there is an option where the specs are taken from a different config
      var getSpecOptions = this.defaultCallOptions;

      // Callback on getting the full first spec
      this.registerSpec = function(resp /* ,status */){
        // currently we assume the answer will be always a valid JSON
        resp = JSON.parse(resp);
        var apis = resp.apis;
        this.restAPI = resp;
        // once we have the list of apis, we get all the information of the api in a parallel asynch calls.
        // This might be done right after setting the basic list of apis available
        getAPISSpec.call(this, _constructAPI.bind(this));
      };

      getSpecOptions.callback = this.registerSpec.bind(this);

      // setting the interface for the API to be able to reGET the API specs and redefine the object
      this.getSpec = getSpec.bind(this, getSpecOptions);
      // Setting up the specs of the API
      this.getSpec();
      // Only for debug porposes:
      this.setEnv = function(env){
        this.defaultCallOptions.endPoint = env;
      };
    }

    /**
    * Generator pattern
    * Construction of the all call methods
    *   The definition of the restAPIPoints wil be the next one:
    *     {
            "entity" : [string] Name of the entity, mainly to identify it,
            "endPoints" : [
              {
                "action" : "get",
                "method" : "get"
              },
              {
                "action" : "post",
                "method" : "post"
              }
            ]
          }

      Addind a representation of the model that is expetced, some functionalities to add to this pattern would be:
        Param validation
        Param format validation

    */
    var constructEndPoint = function (endPoint) {
        return function (callOptions) {
            // mergin the default call options with the
            // options comming from the call and depending
            // of the call that we are doing.
            // This could be done adding the endPoint in the deepExtend method,
            // but because some validations are required, I choose to do the mapping.
            var callDefaultOptions = {
                "method": endPoint.method.toUpperCase(),
                "action": endPoint.action,
                "requiredParams" : endPoint.requiredParams
            };
            var options = utils.deepExtend({}, this.options, callDefaultOptions, callOptions);

            console.log("Calling with options", options);

            // httpUtils.call(options);
        };
    };

    /**
     * Gets all the information about the available apis and overrides everything is on the current specs.
     * @method getAPISSpec
     */
    var getAPISSpec = function(callbackMethod){
      // painful but still required
      var self = this;
      // containing the list of restAPI endpoints that will be called
      var apis = this.restAPI.apis;
      // used as a counters. Y will be used to count the callbacksm and call the callbackMethod only when all calls are being answered
      var i, y = 0;
      // The auxiliar var used to iterate over the apis
      var api;
      // Auxiliar variable to create the path
      var path;
      // containing hte default Call opstions
      var getAPIInformationOptions = this.defaultCallOptions;
      // Used to create the options for the call
      var apiGetOptions = {};
      // Method called after every one of the apis are called
      var callbackSuccess = function(resp,status,path){
        var restAPIPoints = apis;
        // searching for the api endpoint where to add the rest of information
        var api = restAPIPoints.filter(function( obj, idx, list){
          if(obj.path === path){
            if(list[idx].apis && list[idx].apis.concat){
              list[idx].apis = list[idx].apis.concat(resp.apis);
            }else{
              list[idx].apis = resp.apis;
              list[idx].basePath = resp.basePath;
            }
          }
          return obj.path === path;
        });
        // in the case that all calls are being answered, means we have all the spec information.
        if(y === apis.length){
          callbackMethod();
          // This is the user callback for when the API is full loaded
          if(this.options.onReady && typeof this.options.onReady === "function"){
            this.options.onReady(this);
          }
        }
      };
      var errorCB = function(){
        // @TODO; make a proper error handler
      };
      // some basic validation never hurts
      if(apis && apis.length !== undefined){
        for (i = apis.length - 1; i >= 0; i--) {
          api = apis[i];
          // bit more of basic validation
          path = api.path ? api.path.slice() : "";
          // we call all in a asynch way passing as a param to the callback method which api is being requested
          apiGetOptions = {
              "path": "/docs/api-docs"+path,
              "callback": function(esp,status){
                y += 1;
                esp = JSON.parse(esp);
                callbackSuccess.bind(self,esp,status,this.endpoint)();
              },
              "callbackError": errorCB,
              "endpoint": path
          };
          apiGetOptions = utils.deepExtend({}, getAPIInformationOptions, apiGetOptions);
          // this call will return the definition of a certain endpoint
          httpUtils.call(apiGetOptions);
        }
      }
    };


    /**
     * Method encharget of getting the specs of the swagger API.
     * @return {object} definition of the swaggerAPI.
     */
    var getSpec = function(options){
      var self = this;
      // var registerSpec =
      var errorCB = function(resp, request){
        // @TODO: make a proper error handler
      };
      // the structure of the specs end  point is the following: .../api/docs/api-docs/
      var callDefaultOptions = {
          "action": "GET",
          "path": "/docs/api-docs/",
          // "callback": registerSpec.bind(this),
          "callbackError": errorCB
      };
      var callOptions = utils.deepExtend({}, callDefaultOptions, options);
      //this call will return the definition of the whole RESTAPI
      httpUtils.call(callOptions);
    };
    /**
     * Method encharged to take the APIEndpoints and build the protorype of the
     * Javascript API object.
     * It will be required to handle path params like: "/api/v2/services/{id}/public/"
     * The aprams that are paramType = path are the ones that
     */
    _constructAPI = function (APIEndpoints){

      // @TODO Build the whole format validation. If required...
      var self = this;
      var operation;
      var restAPIPoint;
      // used to generate the entityName
      var entityName = "";
      // Used to refer the prototype of the constructor, that will be modified and extended in this method.
      var __proto__ = this.constructor.prototype;
      var apis = this.restAPI.apis;
      var api;
      var apiOperation;
      var i, v, z;
      var operationName;
      // For every endpoint we chreate it in the prototype
      for (i = 0; i < apis.length; i++) {
        restAPIPoint = apis[i];
        entityName = _getEntityName.call(this,restAPIPoint);
        __proto__[entityName] = {};
        for(v = 0; v < restAPIPoint.apis.length; v++) {

          for (z = 0; z < restAPIPoint.apis[v].operations.length; z++) {

            apiOperation = restAPIPoint.apis[v].operations[z];
            operation = function(){
              var options = apiOperation;
              // A user option can have huge affect to the performance of the calls
              options.forceParams = (self.options.forceParams)?true:false;
              // complementing with the information coming from the API description
              options.path = restAPIPoint.apis[v].path;
              options.basePath = restAPIPoint.basePath;
              options.params = {};
              return function(userOptions){
                var operationOptions = {};
                if(userOptions){
                  operationOptions = utils.deepExtend({}, options, userOptions);
                }
                performOperation.call(self,operationOptions);
              };
            }();
            operationName = apiOperation.nickname;
            if(this.options.operations && this.options.operations[operationName]){
              operationName = this.options.operations[operationName];
            }
            // console.log(operationName);
            __proto__[entityName][operationName] = operation;
          }

        }

      }

    };

    var performOperation = function(options){

      options = utils.deepExtend({},this.defaultCallOptions, options);
      httpUtils.call(options);
    };

    /**
     * Encharged to get the name of the endpoint based on the
     * This method should be possible to be rewritted
     */
    var _getEntityName = function(restAPiPoint){
      var splittedPath;
      // Used to reach for the string v2 and use the next elements as an entity name
      var apiVersionString = "v" + this.restAPI.apiVersion;
      // Will contain an array with only what will be used to make the entity name
      var entityElements;
      // counter for going through the path
      var i;
      // the entityName that will be returned
      var entityName;
      // will contain the individual element to add as a suffix for the entity name
      var element;
      splittedPath = restAPiPoint.path.split(/\/|-/);
      // From the list elements we get what goes from the version to the end of the path.
      // That will be used to generate the entityName
      entityElements = splittedPath.slice(splittedPath.indexOf(apiVersionString)+1,splittedPath.length);
      entityName = utils.arrayToCamelCase(entityElements);
      return entityName;
    };
    /**
     * End generator pattern
     */
    return swaggerAPI;
})();
