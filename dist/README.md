# Form validation module

![logo](https://github.com/rsamec/form/blob/master/form_logo.jpg)

Validation module is a lightweight JavaScript library for easy business rules definition of the product, the contract, the form etc.

[Tutorial] (https://github.com/rsamec/form/wiki)

## Key features
The main benefit is that validation engine is not tight to HTML DOM or any other UI framework.
This validation engine is **UI agnostic** and that is why it can be used as **an independent representation of business rules** of a product, contract, etc.
It can be easily reused by different types of applications, libraries.

+   It enables to decorate custom objects and its properties with validation rules.
+   It supports composition of validation rules, that enables to validate custom object with nested structures.
+   It is ease to create your own custom validators.
+   It supports asynchronous validation rules (uses promises).
+   It supports shared validation rules.
+   It supports assigning validation rules to collection-based structures - arrays and lists.
+   It supports localization of error messages with TranslateArgs.
+   It deploys as AMD, CommonJS or plain script module pattern.
+   It offers basic build-in constrains validators. Other custom validators can be find in extensible repository of custom validators (work in progress).

## Installation

This module is installed:

+   Node.js
   +    npm install node-form
   +    use require('node-form');
+   Bower
   +   bower install form
   +   Require.js - require(["form/amd/Validation"], ...
   +   Script tag -> add reference to dist/module/Validation.js file.

## Example Usage

To define business rules for some object, you have to create abstract validator.
``` js
          //create new validator for object with structure<IPerson>
          var personValidator = new Validation.AbstractValidator();

          //basic validators
          var required =new Validators.RequiredValidator();
          var maxLength = new Validators.MaxLengthValidator(15);

          //assigned validators to property
          personValidator.RuleFor("FirstName", required);
          personValidator.RuleFor("FirstName",maxLength);

          //assigned validators to property
          personValidator.RuleFor("LastName", required);
          personValidator.RuleFor("LastName",maxLength);

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

## Source code

All code is written in typescript.

``` bash
npm install -g typescript
```

To compile to javascript.

``` bash
tsc src/validation/Validation.ts --target ES5 --module:commonjs
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

+ Add validation groups to shared validation rules
+ Separate ValidationResult from execution of validation rules
+ Add depedency injection for managing dependencies among components


