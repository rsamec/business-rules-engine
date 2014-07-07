///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
var f = require('../../validation/validation.js')
var expect = require('expect.js');

describe('common validators', function () {

    describe('checkICO', function () {
        var params = [
            { input: "70577200", result: true},
            { input: "3457890", result: false },
            { input: "7057720", result: false },
            { input: "45244782", result: true },
            { input: "25578898", result: true },
            { input: "61490041", result: true },
            { input: "11111111", result: false },
            { input: "12312312", result: true },
            { input: "", result: false },
            { input: undefined, result: false },
            { input: "{}", result: false },
            { input: "fasdfa", result: false }
        ];
        var icoValidator = new f.Validation.ICOValidator();

        for (var op in params) {
            (function (item) {
                it('should check ico number ' + item.input + ' -> ' + item.result, function () {
                    expect(item.result).to.equal(icoValidator.isAcceptable(item.input));
                });
            })(params[op]);
        }
    });
});

describe('custom validators', function () {

    var metaData = {
        FirstName: {
            rules: {
                required: true,
                maxlength: 15
            }
        },
        LastName: {
            rules: {
                required: true,
                maxlength: 30
            }
        }
    }
    var form;
 /*   describe('the same names validator', function () {
        beforeEach(function () {

            //setup
            form = new f.Validation.MetaForm(metaData);

            var customValidation = function (args) {
                args.HasError = false;

                if (this.FirstName != this.LastName) {
                    args.HasError = true;
                    args.ErrorMessage = "First and last name must be the same value."
                    return;
                }
            }.bind(form.Data)

            //add validator programatically - typically done declarative in directive
            var sameNameValidator = new f.Validation.Validator(customValidation);
            form.Validators.Add(sameNameValidator);

            //add validator error
            var sameNameValidatorError = new f.Validation.ValidatorErrorInfo("SameNameValidator", sameNameValidator.Error);
            form.Errors.Add(sameNameValidatorError);
        });

        it('has the various names', function () {

            //excercise
            var data = form.Data;
            data.FirstName = "Jonh";
            data.LastName = "Smith";

            form.Validate();

            //verify
            form.Errors.LogErrors();
            expect(form.Errors.HasErrors).to.equal(true);

        });

        it('has the same names', function () {

            //excercise
            var data = form.Data;
            data.FirstName = "Smith";
            data.LastName = "Smith";

            form.Validate();

            //verify

            expect(form.Errors.HasErrors).to.equal(false);

        });
    });*/
});
