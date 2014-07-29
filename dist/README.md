# Form validation module

![logo](https://github.com/rsamec/form/blob/master/form_logo.gif)

Validation module is a lightweight JavaScript library for easy business rules definition of the product, the contract or validation rules of the form.

## Installation

This module is installed via bower:

+   Node.js - npm install form
+   Require.js - require(["form"], ...
+   Bower - bower install form



## Example Usage

Add reference to dist/validation.js file.

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

          personValidator = personValidator.CreateRule("Person");

          var result = this.PersonValidator.Validate(this.Data);
          if (result.HasErrors){
              console.log(result.ErrorMessage);
          }
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

