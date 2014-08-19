///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/q/q.d.ts'/>

var Validation = require('../../src/validation/Validation.js');
var Validators = require('../../src/validation/BasicValidators.js');
var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');
import Q = require('q');

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

describe('validation rules for shared validations', function () {

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

        var uniqContact = function(args){
            args.HasError = false;
            args.ErrorMessage = "";
            var fullNames =_.map(this.Contacts,function(contact:any){return contact.Email});
            var itemcounts = _.countBy(fullNames, function (n) { return n; });
            var dupes = _.reduce(itemcounts, function (memo:Array<string>, item, idx) {
                if (item > 1)
                    memo.push(idx);
                return memo;
            }, []);

            if (dupes.length != 0) {
                args.HasError = true;
                args.ErrorMessage =  _.reduce(dupes, function (memo:string, fullName:string) {
                    return memo + fullName + " ";
                },"Each contact must be unique. Not unique values: ");

                return;
            }
        };

        validator.Validation({Name:"UniqueContact",ValidationFce:uniqContact});

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

        var uniqPhoneNumber = function(args){
            args.HasError = false;
            args.ErrorMessage = "";
            if (this.Mobile.Number == this.FixedLine.Number) {
                args.HasError = true;
                args.ErrorMessage = "Each phone number must be unique.";
                return;
            }
        };

        validator.Validation({Name:"UniqPhoneNumber",ValidationFce:uniqPhoneNumber});

        //validator.GroupFor("MobileContact",namedUniqPhoneNumber);



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
            FirstName: "",
            LastName: "",
            Contacts: []
        }
    };


    var getItemDataTemplate = function(mail?:string) {
        if (mail == undefined) mail = 'mail@gmail.com';
        return  {
            Email: mail,
            Mobile: {
                CountryCode: 'CZE',
                Number: '736483690'
            },
            FixedLine: {
                CountryCode: 'USA',
                Number: '736483691'
            }
        }
    };

    describe("call specific validator",function() {
        beforeEach(function () {


            this.Data = getData();
            this.MainValidator = mainValidator.CreateRule("Main");

        });


        it('no errors', function () {

            //when
            this.Data.Contacts.push(getItemDataTemplate('mail1@gmail.com'));
            this.Data.Contacts.push(getItemDataTemplate('mail2@gmail.com'));
            this.Data.Contacts.push(getItemDataTemplate('mail3@gmail.com'));

            //find the validator by name
            var validator = this.MainValidator.Validators["UniqueContact"];
            //excercise
            var result = validator.Validate(this.Data);

            //verify by return value
            expect(result.HasError).to.equal(false);

            //verify by validator properties
            expect(validator.HasErrors).to.equal(false);

        });
        it('some errors', function () {

            //when
            this.Data.Contacts.push(getItemDataTemplate('mail1@gmail.com'));
            this.Data.Contacts.push(getItemDataTemplate('mail2@gmail.com'));
            this.Data.Contacts.push(getItemDataTemplate('mail2@gmail.com'));

            //find the validator by name
            var validator = this.MainValidator.Validators["UniqueContact"];
            //excercise
            var result = validator.Validate(this.Data);

            //verify by return value
            expect(result.HasError).to.equal(true);

            //verify by validator properties
            expect(validator.HasErrors).to.equal(true);

        });
    })
});

