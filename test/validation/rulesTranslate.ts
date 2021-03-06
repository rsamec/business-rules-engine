///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/Q/q.d.ts'/>


var Validation = require('../../src/validation/Validation.js');
var Validators = require('../../src/validation/BasicValidators.js');
var Util = require('../../src/validation/Utils.js');
var expect = require('expect.js');

var _:UnderscoreStatic = require('underscore');
import Q = require('q');

import dateCompareValidator = require('../../src/customValidators/DateCompareValidator');
import moment = require('moment')


interface IPerson{
    Checked:boolean;
    FirstName:string;
    LastName:string;
    BirthDate:Date;
    Job:string;
}

describe('localization of error messages', function () {

    var defaultMessages = {
        "required": "This field is required.",
        "maxlength": "Please enter no more than {MaxLength} characters.",
        "contains": "Please enter a value from list of values. Attempted value '{AttemptedValue}'.",
        "custom":"Please, fix the field."
    };
   describe('simple property validators', function () {

        beforeEach(function () {
            //setup
            this.Data = {};
            this.PersonValidator = personValidator.CreateRule("Person");
            this.Messages = defaultMessages;

        });

        //create new validator for object with structure<IPerson>
        var personValidator = new Validation.AbstractValidator<IPerson>();

        //basic validators
        var required = new Validators.RequiredValidator();
        var maxLength = new Validators.MaxLengthValidator(15);
        var lowerOrEqualThanToday = new dateCompareValidator();
        lowerOrEqualThanToday.CompareTo = new Date();
        lowerOrEqualThanToday.CompareOperator = Validation.CompareOperator.LessThanEqual;

        //assigned validators to property
        personValidator.RuleFor("FirstName", required);
        personValidator.RuleFor("FirstName", maxLength);

        //assigned validators to property
        personValidator.RuleFor("LastName", required);
        personValidator.RuleFor("LastName", maxLength);


        it('en errors - default', function () {

            //when
            this.Data.FirstName = "";
            this.Data.LastName = "Smith toooooooooooooooooooooooooooooooo long";

            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify
            expect(result.Errors["FirstName"].ValidationFailures["required"].ErrorMessage).to.equal(this.Messages["required"]);
            expect(result.Errors["LastName"].ValidationFailures["maxlength"].ErrorMessage).to.equal(Util.StringFce.format(this.Messages["maxlength"],{MaxLength:15}));
        });

        it('cz errors', function () {

            //when
            this.Data.FirstName = "";
            this.Data.LastName = "Smith toooooooooooooooooooooooooooooooo long";

            _.extend(this.Messages, {
                required: "Tento údaj je povinný.",
                maxlength: "Prosím, zadejte nejvíce {MaxLength} znaků."
            });

            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify
            expect(Util.StringFce.format(this.Messages["required"],result.Errors["FirstName"].ValidationFailures["required"].TranslateArgs.MessageArgs))
                .to.equal(this.Messages["required"]);
            expect(Util.StringFce.format(this.Messages["maxlength"],result.Errors["LastName"].ValidationFailures["maxlength"].TranslateArgs.MessageArgs))
                .to.equal(Util.StringFce.format(this.Messages["maxlength"],{MaxLength:15}));

        });

    });

    describe('simple async validators', function () {

        beforeEach(function () {
            //setup
            this.Data = {};
            this.PersonValidator = personValidator.CreateRule("Person");
            this.Messages = defaultMessages;

        });

        //create new validator for object with structure<IPerson>
        var personValidator = new Validation.AbstractValidator<IPerson>();

        //async functions return list of values
        var optionsFce = function () {
            var deferral = Q.defer();
            setTimeout(function () {
                deferral.resolve([
                    "business man",
                    "unemployed",
                    "construction worker",
                    "programmer",
                    "shop assistant"
                ]);
            }, 1000);
            return deferral.promise;
        };

        //async basic validators - return true if specified param contains any value
        var param = new Validators.ContainsValidator();
        param.Options = optionsFce();

        //assigned validator to property
        personValidator.RuleFor("Job", param);



        it('en errors - default', function (done) {

            //when
            this.Data.Job = "unknow job";


            //excercise
            var promiseResult = this.PersonValidator.ValidateAsync(this.Data);

            var expectedMsg = this.Messages["contains"];
            promiseResult.then(function (response) {

                //verify
                expect(response.Errors["Job"].ValidationFailures["contains"].ErrorMessage).to.equal(Util.StringFce.format(expectedMsg,{AttemptedValue:"unknow job"}));

                done();

            }).done(null, done);
        });

        it('cz errors', function (done) {

            //when
            this.Data.Job = "unknow job";

            _.extend(this.Messages, {
                contains: "Prosím, zadejte hodnotu ze seznamu. Zadaná hodnota {AttemptedValue}."
            });

            //excercise
            var promiseResult = this.PersonValidator.ValidateAsync(this.Data);

            var expectedMsg = this.Messages["contains"];

            promiseResult.then(function (response) {

                //verify
                expect(Util.StringFce.format(expectedMsg,response.Errors["Job"].ValidationFailures["contains"].TranslateArgs.MessageArgs))
                    .to.equal(Util.StringFce.format(expectedMsg,{AttemptedValue:"unknow job"}));

                done();

            }).done(null, done);
        });

    });

    describe('shared validators', function () {

        beforeEach(function () {
            //setup
            this.Data = {};
            this.PersonValidator = personValidator.CreateRule("Person");
            this.Messages = defaultMessages;

        });

        //create new validator for object with structure<IPerson>
        var personValidator = new Validation.AbstractValidator<IPerson>();

        //shared validation function
        var oneSpaceFce = function (args:any) {
            args.HasError = false;
            if (!this.Checked) return;
            if (this.FirstName.indexOf(' ') != -1 || this.LastName.indexOf(' ') != -1) {
                args.HasError = true;
                args.TranslateArgs = {TranslateId:'FullNameOneSpace',MessageArgs:{AttemptedValue: this.FirstName + " " + this.LastName}};
                args.ErrorMessage = Util.StringFce.format("Full name can contain only one space. Attempted full name:'{AttemptedValue}'.",args.TranslateArgs.MessageArgs);
            }
        };

        //create named validation function
        var validatorFce = {Name: "OneSpaceForbidden", ValidationFce: oneSpaceFce};

        //assign validation function to properties
        personValidator.ValidationFor("FirstName", validatorFce);
        personValidator.ValidationFor("LastName", validatorFce);


        it('en error - default', function () {

            //when
            this.Data.Checked = true;
            this.Data.FirstName = "John Junior";
            this.Data.LastName = "Smith";


            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify
            expect(this.PersonValidator.ValidationResult.ErrorMessage).
                to.equal(Util.StringFce.format("Full name can contain only one space. Attempted full name:'{AttemptedValue}'.", { AttemptedValue: "John Junior Smith" }));

        });
        it('cz error messsage', function () {

            //when
            this.Data.Checked = true;
            this.Data.FirstName = "John Junior";
            this.Data.LastName = "Smith";

            _.extend(this.Messages, {
                FullNameOneSpace: "Celé jméno může obsahovat pouze jednu mezeru. Zadané celé jméno: '{AttemptedValue}'."
            });

            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify
            expect(Util.StringFce.format(this.Messages["FullNameOneSpace"],this.PersonValidator.Validators["OneSpaceForbidden"].TranslateArgs[0].MessageArgs))
                .to.equal(Util.StringFce.format(this.Messages["FullNameOneSpace"], { AttemptedValue: "John Junior Smith" }));

        });
    });

    describe('custom property validators', function () {
        beforeEach(function () {
            //setup
            this.Data = {};
            this.PersonValidator = personValidator.CreateRule("Person");
            this.Messages = defaultMessages;
        });

        //create new validator for object with structure<IPerson>
        var personValidator = new Validation.AbstractValidator();

        //basic validators
        var required = new Validators.RequiredValidator();
        var lowerOrEqualThanToday = new dateCompareValidator();
        lowerOrEqualThanToday.CompareTo = new Date();
        lowerOrEqualThanToday.CompareOperator = Validation.CompareOperator.LessThanEqual;

        //assigned custom validators to property
        personValidator.RuleFor("BirthDate", required);
        personValidator.RuleFor("BirthDate", lowerOrEqualThanToday);

        //custom error message function
        var customErrorMessage = function (config, args) {
            var msg = '';
            var messages = config;

            var format = messages["Format"];
            if (format != undefined) {
                _.extend(args, {
                    FormatedCompareTo: moment(args.CompareTo).format(format),
                    FormatedAttemptedValue: moment(args.AttemptedValue).format(format)
                });
            }

            switch (args.CompareOperator) {
                case Validation.CompareOperator.LessThan:
                    msg = messages["LessThan"];
                    break;
                case Validation.CompareOperator.LessThanEqual:
                    msg = messages["LessThanEqual"];
                    break;
                case Validation.CompareOperator.Equal:
                    msg = messages["Equal"];
                    break;
                case Validation.CompareOperator.NotEqual:
                    msg = messages["NotEqual"];
                    break;
                case Validation.CompareOperator.GreaterThanEqual:
                    msg = messages["GreaterThanEqual"];
                    break;
                case Validation.CompareOperator.GreaterThan:
                    msg = messages["GreaterThan"];
                    break;
            }
            msg = msg.replace('CompareTo', 'FormatedCompareTo');
            msg = msg.replace('AttemptedValue', 'FormatedAttemptedValue');
            return Util.StringFce.format(msg, args);
        };

        it('en errors - default', function () {
            //when
            //future birth day is not possible
            this.Data.BirthDate = moment(new Date()).add({ days: 1 }).toDate();

            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify
            expect(result.Errors["BirthDate"].ValidationFailures["dateCompare"].ErrorMessage).to.equal(this.Messages["custom"]);
        });

        it('en errors - custom', function () {
            //when
            //future birth day is not possible
            this.Data.BirthDate = moment(new Date()).add({ days: 1 }).toDate();

            //add english messages
            _.extend(this.Messages, {
                "dateCompare": {
                    Format: "MM/DD/YYYY",
                    LessThan: "Please enter date less than {CompareTo}.",
                    LessThanEqual: "Please enter date less than or equal {CompareTo}.",
                    Equal: "Please enter date equal {CompareTo}.",
                    NotEqual: "Please enter date different than {CompareTo}.",
                    GreaterThanEqual: "Please enter date greater than or equal {CompareTo}.",
                    GreaterThan: "Please enter date greter than {CompareTo}."
                }
            });

            //excercise
            var result = this.PersonValidator.Validate(this.Data);



            //verify
            var expectedMsg = Util.StringFce.format(this.Messages["dateCompare"]["LessThanEqual"],
                {
                    CompareTo: moment(new Date()).format(this.Messages["dateCompare"]["Format"]),
                    AttemptedValue: moment(this.Data.BirthDate).format(this.Messages["dateCompare"]["Format"])
                });
            expect(customErrorMessage(this.Messages["dateCompare"],result.Errors["BirthDate"].ValidationFailures["dateCompare"].TranslateArgs.MessageArgs))
                .to.equal(expectedMsg);
        });

        it('cz errors', function () {
            //when
            //future birth day is not possible
            this.Data.BirthDate = moment(new Date()).add({ days: 1 }).toDate();

            _.extend(this.Messages, {
                required: "Tento údaj je povinný.",
                maxlength: "Prosím, zadejte nejvíce {MaxLength} znaků.",
                dateCompare: {
                    Format: "DD.MM.YYYY",
                    LessThan: "Prosím, zadejte datum menší než {CompareTo}.",
                    LessThanEqual: "Prosím, zadejte datum menší nebo rovné {CompareTo}.",
                    Equal: "Prosím, zadejte {CompareTo}.",
                    NotEqual: "Prosím, zadejte datum různé od {CompareTo}.",
                    GreaterThanEqual: "Prosím, zadejte datum větší nebo rovné {CompareTo}.",
                    GreaterThan: "Prosím, zadejte datum větší než {CompareTo}."
                }
            });

            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify
            var expectedMsg = Util.StringFce.format(this.Messages["dateCompare"]["LessThanEqual"],
                {
                    CompareTo: moment(new Date()).format(this.Messages["dateCompare"]["Format"]),
                    AttemptedValue: moment(this.Data.BirthDate).format(this.Messages["dateCompare"]["Format"])
                });

            expect(customErrorMessage(this.Messages["dateCompare"],result.Errors["BirthDate"].ValidationFailures["dateCompare"].TranslateArgs.MessageArgs))
                .to.equal(expectedMsg);
        });
    });
});

