# open-api-js

Javascript client to connect to any API that follows the [Open API](https://github.com/OAI/OpenAPI-Specification) Specification.

Providing of the basePath of an Open API this javascript connector will generate a full mapping accessible trhough functions.

## Usage:

The simplest example is the following:

```
var API;
function{
  var openAPIOptions = {
    "serverInfo":{
      "basePath": 'https://beta.calendar42.com/api'
    }
  };
  API = new openAPIJS(openAPIOptions);
}();
```

## Why

Based on [Swagger Spec](https://github.com/swagger-api/swagger-spec) building a basic connector for the awesome [Calendar42](http://calendar42.com) [REST API](https://calendar42.com/api/docs/).

## Goal

To create an agnostic js (ES5) client that will be able to manage all changes in the REST side without change.
