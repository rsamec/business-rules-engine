///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>

var Validation = require('../../dist/node-form.js');
var Validators = require('../../dist/customValidators/BasicValidators.js');
var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');
var Q = require('q');

interface IPerson{
    Checked:boolean;
    FirstName:string;
    LastName:string;
    Contacts:Array<IContact>;
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

describe('validation rules for lists', function () {

    var required = new Validators.RequiredValidator();


    var createPersonValidator = function() {

        var maxLength = new Validators.MaxLengthValidator(15);

        var validator = new Validation.AbstractValidator<IPerson>();
        validator.RuleFor("FirstName", required);
        validator.RuleFor("FirstName", maxLength);

        validator.RuleFor("LastName", required);
        validator.RuleFor("LastName", maxLength);

        var contactValidator = createContactValidator();
        validator.ValidatorFor("Contacts",contactValidator,true);

        return validator;
    };

    var createContactValidator = function() {

        var validator = new Validation.AbstractValidator<IContact>();
        validator.RuleFor("Email", required);
        validator.RuleFor("Email", new Validators.MaxLengthValidator(100));
        validator.RuleFor("Email", new Validators.EmailValidator());

        var phoneValidator = createPhoneValidator();
        validator.ValidatorFor("Mobile", phoneValidator);
        validator.ValidatorFor("FixedLine", phoneValidator);

        return validator;
    };

    var createPhoneValidator = function() {

        var validator = new Validation.AbstractValidator<IPhone>();
        validator.RuleFor("CountryCode", required);
        validator.RuleFor("CountryCode", new Validators.MaxLengthValidator(3));

        validator.RuleFor("Number", required);
        validator.RuleFor("Number", new Validators.MaxLengthValidator(9));

        var optionsFce = function() {
            var deferral = Q.defer();
            setTimeout(function () {
                deferral.resolve(["FRA","CZE","USA","GER"]);
            }, 500);
            return deferral.promise;
        };

        var param = new Validators.ContainsValidator();
        param.Options = optionsFce();

        validator.RuleFor("CountryCode", param);

        return validator;
    };

    var mainValidator = createPersonValidator();


    //setup
    var getData = function () {
        return {
            Checked: true,
            FirstName: "John",
            LastName: "Smith",
            Contacts: []
        }
    };


    var getItemDataTemplate = function() {
        return  {
            Email: 'mail@gmail.com',
            Mobile: {
                CountryCode: 'CZE',
                Number: '736483690'
            },
            FixedLine: {
                CountryCode: 'USA',
                Number: '736483690'
            }
        }
    };

    beforeEach(function(){


        this.Data = getData();
        this.MainValidator =  mainValidator.CreateRule("Main");

    });

    it('fill correct data - no errors', function (done) {

        //when
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());

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
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());

        //simulate error at second item in list
        this.Data.Contacts[1].Email = "";

        //simulate async error at third item in list
        this.Data.Contacts[2].Mobile.CountryCode = "BLA";

        //excercise
        var result = this.MainValidator.Validate(this.Data);
        var promiseResult = this.MainValidator.ValidateAsync(this.Data);

        //verify
        promiseResult.then(function (response) {

            response.LogErrors();

            //verify
            expect(response.HasErrors).to.equal(true);
            expect(response.Errors["Contacts"].HasErrors).to.equal(true);
            expect(response.Errors["Contacts"].Errors["Contacts0"].HasErrors).to.equal(false);
            expect(response.Errors["Contacts"].Errors["Contacts1"].HasErrors).to.equal(true);
            expect(response.Errors["Contacts"].Errors["Contacts2"].HasErrors).to.equal(true);

            done();

        }).done(null,done);
    });

    it('delete error item, leave correct item - no errors', function (done) {

        //when
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());

        //item list property error
        this.Data.Contacts[2].Email = "";

        //item list async property error
        this.Data.Contacts[2].Mobile.CountryCode = "BLA";

        //delete last error item
        this.Data.Contacts.splice(2,1)

        //excercise
        var result = this.MainValidator.Validate(this.Data);
        var promiseResult = this.MainValidator.ValidateAsync(this.Data);

        //verify
        promiseResult.then(function (response) {

            response.LogErrors();

            //verify
            expect(response.HasErrors).to.equal(false);
            expect(response.Errors["Contacts"].HasErrors).to.equal(false);
            expect(response.Errors["Contacts"].Errors["Contacts0"].HasErrors).to.equal(false);
            expect(response.Errors["Contacts"].Errors["Contacts1"].HasErrors).to.equal(false);

            done();

        }).done(null,done);
    });

    it('delete correct item, leave error item - some errors', function (done) {

        //when
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());

        //item list property error
        this.Data.Contacts[2].Email = "";

        //item list async property error
        this.Data.Contacts[2].Mobile.CountryCode = "BLA";

        //delete correct item
        this.Data.Contacts.splice(1,1);

        //excercise
        var result = this.MainValidator.Validate(this.Data);
        var promiseResult = this.MainValidator.ValidateAsync(this.Data);

        //verify
        promiseResult.then(function (response) {

            response.LogErrors();

            //verify
            expect(response.HasErrors).to.equal(true);
            expect(response.Errors["Contacts"].HasErrors).to.equal(true);
            expect(response.Errors["Contacts"].Errors["Contacts0"].HasErrors).to.equal(false);
            expect(response.Errors["Contacts"].Errors["Contacts1"].HasErrors).to.equal(true);

            done();

        }).done(null,done);
    });

});

