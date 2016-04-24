# open-api-js

Javascript client to connect to any API that follows the [Open API](https://github.com/OAI/OpenAPI-Specification) Specification.

Providing of the basePath of an Open API this javascript connector will generate a full mapping accessible trhough functions.

## Install ( WIP )

> As a WIP to create an npm and bower package to be able to install it from a proper repository

## Usage:

This component allows to map an API into a Javascript object containing the entities - opertaions that the API contains.

The object will have as a `entities` the different endpoints of the API.
The object `entities` will have as a `operations` the operations defined in every API endpoint.

To set up the component is only required to provide of the basePath of the server where it is trying to connect.

**Example**

To set up it, the minimal configuration required is the following.

```javascript
function{
  var API = new openAPIJS({
    "serverInfo":{
      "basePath": 'https://path.toAPI.com/api'
    }
  });
}();
```

Once the api is ready we will have access tot the full API specification through our component.

For an API that manages `events` and allows to `GET` the information of an `event`.

Will be possible to perform the following call:

```javascript
API.events.getEvents({
  params:{
    id: "123456789"
  },
  callback: function(ret){
    console.log("The success answer from getting the events is", ret);
  }
})
```

## Why

Based on [Open API Specification](https://github.com/OAI/OpenAPI-Specification), this component generates a Javascript abstraction of any API that uses the Open API specification.

 specification building a basic connector for the awesome [Calendar42](http://calendar42.com) [REST API](https://calendar42.com/api/docs/).

## Goal

To create an agnostic js (ES5) client that will be able to manage all changes in the REST side without change.
