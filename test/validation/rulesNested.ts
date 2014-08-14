///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>

var Validation = require('../../dist/node-form.js');
var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');
var Q = require('q');

interface IData{
    Person1:IPerson
    Person2:IPerson
}
interface IPerson{
    Checked:boolean;
    FirstName:string;
    LastName:string;
    Contact:IContact;
}
interface IContact{
    Email:string;
    Mobile:IPhone;
    FixedLine:IPhone;
}
interface IPhone{
    CountryCode:string
    Number:string
}

describe('nested validation rules', function () {

    var required = new Validation.RequiredValidator();

    var createMainValidator = function(){
        var validator = new Validation.AbstractValidator<IData>();

        var personValidator = createPersonValidator();
        validator.ValidatorFor("Person1",personValidator);
        validator.ValidatorFor("Person2",personValidator);

        return validator;
    };

    var createPersonValidator = function() {

        var maxLength = new Validation.MaxLengthValidator(15);

        var validator = new Validation.AbstractValidator<IPerson>();
        validator.RuleFor("FirstName", required);
        validator.RuleFor("FirstName", maxLength);

        validator.RuleFor("LastName", required);
        validator.RuleFor("LastName", maxLength);

        var contactValidator = createContactValidator();
        validator.ValidatorFor("Contact",contactValidator);

        return validator;
    };

    var createContactValidator = function() {

        var validator = new Validation.AbstractValidator<IContact>();
        validator.RuleFor("Email", required);
        validator.RuleFor("Email", new Validation.MaxLengthValidator(100));
        validator.RuleFor("Email", new Validation.EmailValidator());

        var phoneValidator = createPhoneValidator();
        validator.ValidatorFor("Mobile", phoneValidator);
        validator.ValidatorFor("FixedLine", phoneValidator);

        return validator;
    };

    var createPhoneValidator = function() {

        var validator = new Validation.AbstractValidator<IPhone>();
        validator.RuleFor("CountryCode", required);
        validator.RuleFor("CountryCode", new Validation.MaxLengthValidator(3));

        validator.RuleFor("Number", required);
        validator.RuleFor("Number", new Validation.MaxLengthValidator(9));

        var optionsFce = function() {
            var deferral = Q.defer();
            setTimeout(function () {
                deferral.resolve(["FRA","CZE","USA","GER"]);
            }, 500);
            return deferral.promise;
        };

        var param = new Validation.ContainsValidator();
        param.Options = optionsFce();

        validator.RuleFor("CountryCode", param);

        return validator;
    };

    var mainValidator = createMainValidator();

    beforeEach(function(){

        //setup
        var getData = function () {
            var contact = {
                Email:'mail@gmail.com',
                Mobile:{
                    CountryCode:'CZE',
                    Number:'736483690'
                },
                FixedLine:{
                    CountryCode:'USA',
                    Number:'736483690'
                }
            };
            return{
                Person1: {
                    Checked:true,
                    FirstName: "John",
                    LastName: "Smith",
                    Contact: contact
                },
                Person2: {
                    Checked:true,
                    FirstName: "Adam",
                    LastName: "Novak",
                    Contact: contact
                }
            }
        };

        this.Data = getData();
        this.MainValidator =  mainValidator.CreateRule("Main");

    });

    it('fill correct data - no errors', function (done) {

        //when

        //excercise
        var result = this.MainValidator.Validate(this.Data);
        var promiseResult = this.MainValidator.ValidateAsync(this.Data);

        //verify
        promiseResult.then(function (response) {

            response.LogErrors();

            //verify
            expect(response.HasErrors).to.equal(false);

            done();

        }).done(null,done);
    });


    it('fill incorrect data - some errors', function (done) {

        //when
        //nested property error
        this.Data.Person1.Contact.Email = "";

        //async nested property error
        this.Data.Person1.Contact.Mobile.CountryCode = "BLA";

        //excercise
        var result = this.MainValidator.Validate(this.Data);
        var promiseResult = this.MainValidator.ValidateAsync(this.Data);

        //verify
        promiseResult.then(function (response) {

            response.LogErrors();

            //verify
            expect(response.HasErrors).to.equal(true);

            done();

        }).done(null,done);
    });


    describe("fill incorrect data - rule optional", function() {

        beforeEach(function () {
            //setup

            //set rule optional when checked !=true;
            var optional = function () {
                return !this.Checked;
            }.bind(this.Data);


            this.MainValidator.SetOptional(optional);

            //nested error
            this.Data.Person1.Contact.Email = "";

            //async nested error
            this.Data.Person1.Contact.Mobile.CountryCode = "BLA";

        });

        it('is optional -> no errors', function (done) {

            //when
            this.Data.Person1.Checked = false;
            this.Data.Person2.Checked = false;

            //excercise
            var result = this.MainValidator.Validate(this.Data);
            var promiseResult = this.MainValidator.ValidateAsync(this.Data);

            //verify
            promiseResult.then(function (response) {

                response.LogErrors();

                //verify
                expect(response.HasErrors).to.equal(false);

                done();

            }).done(null, done);
        });


        it('is not optional - some errors', function (done) {

            //when
            this.Data.Person1.Checked = true;
            this.Data.Person2.Checked = true;

            //excercise
            var result = this.MainValidator.Validate(this.Data);
            var promiseResult = this.MainValidator.ValidateAsync(this.Data);

            //verify
            promiseResult.then(function (response) {

                response.LogErrors();

                //verify
                expect(response.HasErrors).to.equal(false);

                done();

            }).done(null, done);
        });
    });
});

