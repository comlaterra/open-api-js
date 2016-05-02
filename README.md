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

## Goal

To create an agnostic Javascript client that autogenerates the mapping API in the local environment.

## TODO's

> This is the list of next steps to evolve this library.

### Structure/Compatibility

> Any of this points will generate a new major version of the module

* Move to ES6: usage of fetch, exports, etc.
* Simplify the operations generation
* Update to OPEN API 2.0

### Functionalities

* Fields validation: Add validation before performing a call towards the API validating the correct sending of parameters.
* Improve documentation: There is always a lot to improve. Please feel free of adding a proper usage documentation.
* Provide of new examples: If you use this component, please add your case as an example.

## Why

Looks like we are going to have a new starndard!

> -_-'

Hurray for the [Open API Specification](https://github.com/OAI/OpenAPI-Specification) !!

With a strong believe that this standard will be followed by most of the API providers, I would like to make easy the mapping and usage of any API.

Avoid stupid typo mistakes, increasing the accessibility to the API's, avoid to read awful documentations, there is many reasons to improve and push this project.

Why opensourcing? - I hope you meant, why not...? ;)
