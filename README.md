# Business rules engine

![logo](https://github.com/rsamec/form/blob/master/form_logo.jpg)

Business rules engine is a lightweight JavaScript library for easy business rules definition of the product, the contract, the form etc.

## Key features
The main benefit is that business rules engine is not tight to HTML DOM or any other UI framework.
This validation engine is **UI agnostic** and that is why it can be used as **an independent representation of business rules** of a product, contract, etc.
It can be easily reused by different types of applications, libraries.

+   It enables to decorate custom objects and its properties with validation rules.
+   It supports declarative and imperative validation rules definition
    +  declarative [JSON schema](http://json-schema.org/) with validation keywords [JSON Schema Validation](http://json-schema.org/latest/json-schema-validation.html)
    +  declarative raw JSON data  annotated with meta data - using keywords from [JQuery validation plugin](http://jqueryvalidation.org/)
    +  imperative - [validation API](http://rsamec.github.io/business-rules-engine/docs/modules/_validation_validation_.html)
+   It supports composition of validation rules, that enables to validate custom object with nested structures.
+   It is ease to create your own custom validators.
+   It supports asynchronous validation rules (uses promises).
+   It supports shared validation rules.
+   It supports assigning validation rules to collection-based structures - arrays and lists.
+   It supports notification of errors changed via ErrorChanged dispatch event.
+   It supports dot syntax to access to nested rules.
+   It supports localization of error messages with TranslateArgs.
+   It deploys as AMD, CommonJS or plain script module pattern.
+   It offers basic build-in constrains validators. See list [basic build-in constraints](http://rsamec.github.io/business-rules-engine/docs/modules/_validation_basicvalidators_.html)
+   Other custom validators can be find in extensible repository of custom validators (work in progress).

## Installation

This module is installed:

+   Node.js
   +    npm install business-rules-engine
   +    use require('business-rules-engine');
+   Bower
   +   bower install business-rules-engine
   +   Require.js - require(["business-rules-engine/amd/Validation"], ...
   +   Script tag -> add reference to business-rules-engine/module/Validation.js file.

## Example Usage

There are 3 ways how to define validation rules

+  declarative [JSON schema](http://json-schema.org/) with validation keywords [JSON Schema Validation](http://json-schema.org/latest/json-schema-validation.html)
+  declarative raw JSON data  annotated with meta data - using keywords from [JQuery validation plugin](http://jqueryvalidation.org/)
+  imperative - [validation API](http://rsamec.github.io/business-rules-engine/docs/modules/_validation_validation_.html)


### JSON Schema Validation

``` js
    {
        FirstName: {
            type: "string",
            title: "First name",
            required: "true",
            maxLength: 15
        },
        LastName: {
            type: "string",
            "title": "Last name",
            required: true,
            maxLength: 15
        },
        Contacts: {
            type: "array",
            maxItems: 4,
            minItems: 2,
            items: {
                type: "object",
                properties: {
                    Email: {
                        type: "string",
                        title: "Email",
                        default: '',
                        required: true,
                        maxLength: 100,
                        pattern: "S*@S*" },
                    Mobile: {
                        type: "object",
                        properties: {
                            CountryCode: {
                                type: "string",
                                title: "Country code",
                                required: true,
                                maxLength: 3,
                                enum: ["FRA", "CZE", "USA", "GER"]
                            },
                            Number: {
                                type: "string",
                                title: "Phone number",
                                required: true,
                                maxLength: 9
                            }
                        }
                    },
                    FixedLine: {
                        type: "object",
                        properties: {
                            CountryCode: {
                                type: "string",
                                title: "Country code",
                                required: true,
                                maxLength: 3,
                                enum: ["FRA", "CZE", "USA", "GER"]
                            },
                            Number: {
                                type: "string",
                                title: "Phone number",
                                required: true,
                                maxLength: 9
                            }
                        }
                    }
                }
            }
        }
    }
```

```js
var rules = new FormSchema.JsonSchemaRuleFactory(json).CreateRule("Main");
```

### JSON data annotated with meta data 

``` js
// define data structure + validation rules meta data
  {
        FirstName: {
            rules: {required: true, maxlength: 15}},
        LastName: {
            rules: {required: true, maxlength: 15}},
        Contacts: [
            {
                Email: {
                    rules: {
                        required: true,
                        maxlength: 100,
                        email: true
                    }
                },
                Mobile: {
                    CountryCode: {
                        rules: {required: true, maxlength: 3, enum: ["FRA", "CZE", "USA", "GER"] }
                    },
                    Number: {
                        rules: {required: true, maxlength: 9 }
                    }
                },
                FixedLine: {
                    CountryCode: {
                        rules: {required: true, maxlength: 3, enum: ["FRA", "CZE", "USA", "GER"] }
                    },
                    Number: {
                        rules: {required: true, maxlength: 9 }
                    }
                }
            },{maxItems: 4, minItems: 2}
        ]
    }
```

```js
var rules = new FormSchema.JQueryValidationRuleFactory(json).CreateRule("Main");
```
### Imperative definition - using API

To define business rules for some object, you have to create abstract validator.
``` js
          //create new validator for object with structure<IPerson>
          var personValidator = new Validation.AbstractValidator();

          //basic validators
          var required = new Validators.RequiredValidator();
          var maxLength = new Validators.MaxLengthValidator(15);

          //assigned validators to property
          personValidator.RuleFor("FirstName", required);
          personValidator.RuleFor("FirstName",maxLength);

          //assigned validators to property
          personValidator.RuleFor("LastName", required);
          personValidator.RuleFor("LastName",maxLength);
          
          ...

```

To use business rules and execute them on particular data
```js
          //create test data
          var data = {
                Person1:
                {
                    FirstName:'John',
                    LastName: 'Smith'
                },
                Person2:{}

          }

          //create concrete rule
          var person1Validator = personValidator.CreateRule("Person 1");

          //execute validation
          var result = person1Validator.Validate(this.Data.Person1);

          //verify results
          if (result.HasErrors){
              console.log(result.ErrorMessage);
          }
          //---------
          //--outputs
          //---------

          //create concrete rule
          var person2Validator = personValidator.CreateRule("Person 2");

          //execute validation
          var result = person2Validator.Validate(this.Data.Person1);

           //verify results
          if (result.HasErrors){
              console.log(result.ErrorMessage);
          }

          //---------
          //--outputs
          //---------
          // FirstName: Field is required.
          // LastName: Field is required.

```

## Additional information

+ Business rules engine
    + [Business rules engine - Tutorial] (https://github.com/rsamec/business-rules-engine/wiki)
    + [Business rules engine - API] (http://rsamec.github.io/business-rules-engine/docs/index.html)

+ Examples - rules
    + [Business rules repository - sources] (https://github.com/rsamec/business-rules)
    + [Business rules repository - API] (http://rsamec.github.io/business-rules/docs/index.html)

+ Examples - UI with rules
    + Polymer example
        + [demo](http://polymer-formvalidation.rhcloud.com/)
        + [sources](https://github.com/rsamec/clever-form-demo)
        + [tutorial] (http://rsamec.github.io/lessons/2014/10/19/the-fastest-way-to-create-clever-application)
    + NodeJS Example
        + [sources] (https://github.com/rsamec/node-form-app)
    + AngularJS Example
        + [sources] (https://github.com/rsamec/angular-form-app)
        + [demo -forms app] (http://nodejs-formvalidation.rhcloud.com/)
        + [demo - vacation Request form] (http://nodejs-formvalidation.rhcloud.com/#/vacationApproval/new)
        + [demo - hobbies form] (http://nodejs-formvalidation.rhcloud.com/#/hobbies/new)
        + [demo - hobbies form - try it in plunkr] (http://embed.plnkr.co/vbp9aFw7Lc2EyNyhUf5y/preview)

+ [author blog] (http://rsamec.github.io/)

## Source code

All code is written in typescript.

``` bash
npm install -g typescript
```

To compile to javascript.

``` bash
tsc src/validation/Validation.ts --target ES5 --module commonjs
```

## Tests

``` bash
npm install -g mocha
npm install -g expect.js
```

To run tests

``` bash
mocha test
```


## Grunt automatization

### Basic steps

+ git clone https://github.com/rsamec/business-rules-engine
+ npm install - get npm packages
+ tsd update - get external typings definition
+ grunt typings - create node-form typings definition - used by custom validators

To build all sources to dist folder (generates AMD, CommonJS and module pattern)
``` bash
$ grunt dist
```

To run code analyze - complexity + jshint.
``` bash
$ grunt ci
```

To generate api documentation.
``` bash
$ grunt document
```

To generate typings -> typescript definition files.
``` bash
$ grunt typings
```

To run tests
``` bash
$ grunt test
```

## Roadmap

Priority

+ Refactor validation API - simplify and better naming
+ Support for changes notification -> partially done, but consider to use framework like ObserveJs or similer notification frameworks
+ Refactor implemenation
    +   use depedency injection for managing dependencies among internal components
    +   remove depedencies or make them optional - Q, underscore, moment, axiom
    +   lazy loading + consider better data structure for composite 

Others

+ Add validation groups to shared validation rules
+ Separate ValidationResult from execution of validation rules
+ Improve documentation + more examples

## License

The MIT License (MIT)
