///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>

var f = require('../../validation/validation.js')
var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');
var Q = require('q');

interface IPerson{
    Checked:boolean;
    FirstName:string;
    LastName:string;
}

describe('basic validation rules', function () {


    var personValidator = new f.Validation.AbstractValidator<IPerson>();

    var required =new f.Validation.RequiredValidator();
    var maxLength = new f.Validation.MaxLengthValidator();
    maxLength.MaxLength = 15;

    var param = new f.Validation.ParamValidator();
    param.ParamId = "jobs";
    var optionsFce = function() {
        var deferral = Q.defer();
        setTimeout(function () {
            deferral.resolve([
                { "value": 1, "text": "aranžér" },
                { "value": 2, "text": "stavař" },
                { "value": 3, "text": "programátor" },
                { "value": 3, "text": "nezaměstnaný" }
            ]);
        }, 1000);
        return deferral.promise;
    };
    param.Options = optionsFce();


    personValidator.RuleFor("FirstName", required);
    personValidator.RuleFor("FirstName",maxLength);

    personValidator.RuleFor("LastName", required);
    personValidator.RuleFor("LastName",maxLength);

    personValidator.RuleFor("Job",param);

    var oneSpaceFce = function(args:any){
        args.HasError = false;
        if (!this.Checked) return;
        if (this.FirstName.indexOf(' ') != -1 || this.LastName.indexOf(' ') != -1)
        {
            args.HasError = true;
            args.ErrorMessage = "Full name can contain only one space.";
            return;
        }
    }
    var validatorFce = {Name:"OneSpaceForbidden", ValidationFce:oneSpaceFce};
    personValidator.ValidationFor("FirstName",validatorFce);
    personValidator.ValidationFor("LastName",validatorFce);




    var person:IPerson = {
        Checked:true,
        FirstName:"Roman",
        LastName:"Samec",
        Job:"stavař"
    };



    beforeEach(function(){
        //setup
        this.Data = person;
        this.PersonValidator = personValidator.CreateRule("Person");

    });

    it('fill correct data - no errors', function (done) {

        //when
        this.Data.FirstName = "Jonh";
        this.Data.LastName = "Smith";
        this.Data.Job = "stavař";

        //excercise
        var result = this.PersonValidator.Validate(this.Data);
        var promiseResult = this.PersonValidator.ValidateAsync(this.Data);

        var errorInfo = this.PersonValidator.ErrorInfo;
        promiseResult.then(function (response) {

           //verify
           expect(errorInfo.HasErrors).to.equal(false);

           done();

        }).done(null,done);
    });

    it('fill incorrect data - some errors', function (done) {

        //when
        this.Data.FirstName = "";
        this.Data.LastName = "Smith toooooooooooooooooooooooooooooooo long";
        this.Data.Job ="unknow job";

        //excercise
        var result = this.PersonValidator.Validate(this.Data);
        var promiseResult = this.PersonValidator.ValidateAsync(this.Data);

        var selfValidator = this.PersonValidator;
        promiseResult.then(function (response) {

            selfValidator.ErrorInfo.LogErrors();

            //verify
            expect(selfValidator.ErrorInfo.HasErrors).to.equal(true);

            done();

        }).done(null,done);
    });

    describe("fill incorrect data - rule optional", function() {

        beforeEach(function(){
            //setup

            //set rule optional when checked !=true;
            var optional = function () {
                return !this.Checked;
            }.bind(this.Data);

//            this.PersonValidator.Rules["FirstName"].Optional = optional;
//            this.PersonValidator.Rules["LastName"].Optional = optional;
//            this.PersonValidator.Rules["Job"].Optional = optional;

            this.PersonValidator.SetOptional(optional);

            this.Data.FirstName = "";
            this.Data.LastName = "Smith toooooooooooooooooooooooooooooooo long";
            this.Data.Job ="unknow job";


        });

        it('is optional -> no errors', function (done) {

            //when
            this.Data.Checked = false;

            //excercise
            var result = this.PersonValidator.Validate(this.Data);
            var promiseResult = this.PersonValidator.ValidateAsync(this.Data);

            var selfValidator = this.PersonValidator;
            promiseResult.then(function (response) {

                //verify
                selfValidator.ErrorInfo.LogErrors();
                expect(selfValidator.ErrorInfo.HasErrors).to.equal(false);

                done();

            }).done(null,done);
        });

        it('is not optional - some errors', function (done) {

            //when
            this.Data.Checked = true;

            //excercise
            var result = this.PersonValidator.Validate(this.Data);
            var promiseResult = this.PersonValidator.ValidateAsync(this.Data);

            //verify
            var selfValidator = this.PersonValidator;
            promiseResult.then(function (response) {

                //verify
                selfValidator.ErrorInfo.LogErrors();
                expect(selfValidator.ErrorInfo.HasErrors).to.equal(true);

                done();

            }).done(null,done);
        });
    });
});

