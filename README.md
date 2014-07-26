# Form validation module

![logo](https://github.com/rsamec/form/blob/master/form_logo.jpg)

Validation module is a lightweight JavaScript library for easy business rules definition of the product, the contract, the form etc.

[API + tutorial] (https://github.com/rsamec/form/wiki)

## Installation

This module is installed via bower:

+   Node.js - npm install form
+   Bower - bower install form


## Example Usage

Add reference to dist/form.min.js file.

To create abstract validator
``` js
          //create new validator for object with structure<IPerson>
          var personValidator = new Validation.AbstractValidator();

          //basic validators
          var required =new f.Validation.RequiredValidator();
          var maxLength = new f.Validation.MaxLengthValidator(15);

          //assigned validators to property
          personValidator.RuleFor("FirstName", required);
          personValidator.RuleFor("FirstName",maxLength);

          //assigned validators to property
          personValidator.RuleFor("LastName", required);
          personValidator.RuleFor("LastName",maxLength);

```

To create test data
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
tsc src/validation/rules.ts --target ES5 --out dist/validation.js
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

