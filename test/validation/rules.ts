///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>

var Validation = require('../../dist/node-form.js');
var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');
var Q = require('q');

interface IPerson{
    Checked:boolean;
    FirstName:string;
    LastName:string;
    Job:string;
}

describe('basic validation rules', function () {

    describe('simple property validators', function() {

        beforeEach(function(){
            //setup
            this.Data = {};
            this.PersonValidator = personValidator.CreateRule("Person");

        });

        //create new validator for object with structure<IPerson>
        var personValidator = new Validation.AbstractValidator<IPerson>();

        //basic validators
        var required =new Validation.RequiredValidator();
        var maxLength = new Validation.MaxLengthValidator(15);

        //assigned validators to property
        personValidator.RuleFor("FirstName", required);
        personValidator.RuleFor("FirstName",maxLength);

        //assigned validators to property
        personValidator.RuleFor("LastName", required);
        personValidator.RuleFor("LastName",maxLength);


        it('fill correct data - no errors', function () {

            //when
            this.Data.FirstName = "John";
            this.Data.LastName = "Smith";

            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify by return result
            expect(result.HasErrors).to.equal(false);

            //verify by concrete validator properties
            expect(this.PersonValidator.ValidationResult.HasErrors).to.equal(false);

            //validator properties enables to check specific rule errors
            expect(result.Errors["FirstName"].ValidationFailures["required"].HasError).to.equal(false);
            expect(result.Errors["FirstName"].ValidationFailures["maxlength"].HasError).to.equal(false);
            expect(result.Errors["LastName"].ValidationFailures["required"].HasError).to.equal(false);
            expect(result.Errors["LastName"].ValidationFailures["maxlength"].HasError).to.equal(false);

        });

        it('fill incorrect data - some errors', function () {

            //when
            this.Data.FirstName = "";
            this.Data.LastName = "Smith toooooooooooooooooooooooooooooooo long";

            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify by return result
            expect(result.HasErrors).to.equal(true);

            //verify by concrete validator properties
            expect(this.PersonValidator.ValidationResult.HasErrors).to.equal(true);

            //validator properties enables to check specific rule errors
            expect(result.Errors["FirstName"].ValidationFailures["required"].HasError).to.equal(true);
            expect(result.Errors["FirstName"].ValidationFailures["maxlength"].HasError).to.equal(false);
            expect(result.Errors["LastName"].ValidationFailures["required"].HasError).to.equal(false);
            expect(result.Errors["LastName"].ValidationFailures["maxlength"].HasError).to.equal(true);

        });
    });

    describe('simple async validators', function() {

        beforeEach(function(){
            //setup
            this.Data = {};
            this.PersonValidator = personValidator.CreateRule("Person");

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
        var param = new Validation.ContainsValidator();
        param.Options = optionsFce();

        //assigned validator to property
        personValidator.RuleFor("Job",param);

        it('fill correct data - no errors', function (done) {

            //when
            this.Data.Job = "programmer";

            //excercise
            var promiseResult = this.PersonValidator.ValidateAsync(this.Data);

            var selfValidator = this.PersonValidator;
            promiseResult.then(function (response) {

                //verify by return result
                expect(response.HasErrors).to.equal(false);

                //verify by concrete validator properties
                expect(selfValidator.ValidationResult.HasErrors).to.equal(false);

                done();

            }).done(null,done);
        });

        it('fill incorrect data - some errors', function (done) {

            //when
            this.Data.Job ="unknow job";

            //excercise
            var promiseResult = this.PersonValidator.ValidateAsync(this.Data);

            var selfValidator = this.PersonValidator;
            promiseResult.then(function (response) {

                selfValidator.ValidationResult.LogErrors("Output - job error");

                //verify
                expect(selfValidator.ValidationResult.HasErrors).to.equal(true);

                done();

            }).done(null,done);
        });

    });

    describe('shared validators', function() {

        beforeEach(function(){
            //setup
            this.Data = {};
            this.PersonValidator = personValidator.CreateRule("Person");

        });

        //create new validator for object with structure<IPerson>
        var personValidator = new Validation.AbstractValidator<IPerson>();

        //shared validation function
        var oneSpaceFce = function (args:any) {
            args.HasError = false;
            if (!this.Checked) return;
            if (this.FirstName.indexOf(' ') != -1 || this.LastName.indexOf(' ') != -1) {
                args.HasError = true;
                args.ErrorMessage = "Full name can contain only one space.";
            }
        };

        //create named validation function
        var validatorFce = {Name: "OneSpaceForbidden", ValidationFce: oneSpaceFce};

        //assign validation function to properties
        personValidator.ValidationFor("FirstName", validatorFce);
        personValidator.ValidationFor("LastName", validatorFce);

        it('fill correct data - no errors', function () {

            //when
            this.Data.Checked = true;
            this.Data.FirstName = "John";
            this.Data.LastName = "Smith";

            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify
            expect(result.HasErrors).to.equal(false);

        });

        it('fill incorrect data - some errors', function () {

            //when
            this.Data.Checked = true;
            this.Data.FirstName = "John Junior";
            this.Data.LastName = "Smith";

            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify
            expect(result.HasErrors).to.equal(true);
        });
    });

    describe('shared validators - async', function() {

        beforeEach(function(){
            //setup
            this.Data = {};
            this.PersonValidator = personValidator.CreateRule("Person");

        });

        //create new validator for object with structure<IPerson>
        var personValidator = new Validation.AbstractValidator<IPerson>();

        //shared validation function
        var oneSpaceFce = function (args:any) {
            var deferred = Q.defer();

            var self = this;
            setTimeout(function () {
                args.HasError = false;
                args.ErrorMessage = "";

                if (!self.Checked) {
                    deferred.resolve();
                    return;
                }
                if (self.FirstName.indexOf(' ') != -1 || self.LastName.indexOf(' ') != -1) {
                    args.HasError = true;
                    args.ErrorMessage = "Full name can contain only one space.";
                    deferred.resolve();
                    return;
                }
                deferred.resolve();

            },100);

            return deferred.promise;
        };

        //create named validation function
        var validatorFce = {Name: "OneSpaceForbidden", AsyncValidationFce: oneSpaceFce};

        //assign validation function to properties
        personValidator.ValidationFor("FirstName", validatorFce);
        personValidator.ValidationFor("LastName", validatorFce);

        it('fill correct data - no errors', function (done) {

            //when
            this.Data.Checked = true;
            this.Data.FirstName = "John";
            this.Data.LastName = "Smith";

            //excercise
            var promiseResult = this.PersonValidator.ValidateAsync(this.Data);

            var selfValidator = this.PersonValidator;
            promiseResult.then(function (response) {

                //verify
                expect(selfValidator.ValidationResult.HasErrors).to.equal(false);

                done();

            }).done(null,done);

        });

        it('fill incorrect data - some errors', function (done) {

            //when
            this.Data.Checked = true;
            this.Data.FirstName = "John Junior";
            this.Data.LastName = "Smith";

            //excercise
            var promiseResult = this.PersonValidator.ValidateAsync(this.Data);

            var selfValidator = this.PersonValidator;
            promiseResult.then(function (response) {

                //verify
                expect(selfValidator.ValidationResult.HasErrors).to.equal(true);

                done();

            }).done(null,done);

        });
    });

    describe("fill incorrect data - rule optional", function() {

        beforeEach(function(){

            //setup
            this.Data = {};
            this.PersonValidator = personValidator.CreateRule("Person");

            //set rule optional when checked !=true;
            var optional = function () {
                return !this.Checked;
            }.bind(this.Data);

            this.PersonValidator.SetOptional(optional);

            this.Data.FirstName = "";
            this.Data.LastName = "Smith toooooooooooooooooooooooooooooooo long";

        });

        //create new validator for object with structure<IPerson>
        var personValidator = new Validation.AbstractValidator<IPerson>();

        //basic validators
        var required =new Validation.RequiredValidator();
        var maxLength = new Validation.MaxLengthValidator(15);

        //assigned validators to property
        personValidator.RuleFor("FirstName", required);
        personValidator.RuleFor("FirstName",maxLength);

        //assigned validators to property
        personValidator.RuleFor("LastName", required);
        personValidator.RuleFor("LastName",maxLength);


        it('is optional -> no errors', function () {

            //when
            this.Data.Checked = false;

            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify
            expect(result.HasErrors).to.equal(false);

        });

        it('is not optional - some errors', function () {

            //when
            this.Data.Checked = true;

            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify
            expect(result.HasErrors).to.equal(true);

        });
    });
});

