///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>

var f = require('../../validation/validation.js')
var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');

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

    personValidator.RuleFor("FirstName", required);
    personValidator.RuleFor("FirstName",maxLength);

    personValidator.RuleFor("LastName", required);
    personValidator.RuleFor("LastName",maxLength);



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


    var person:IPerson = {
        Checked:true,
        FirstName:"Roman",
        LastName:"Samec"
    };

    beforeEach(function(){
        //setup
        this.Data = person;
        this.PersonValidator = personValidator.CreateRule("Person");
        this.PersonValidator.AddValidation(new f.Validation.Validator(oneSpaceFce.bind(this.Data)),"FullNameOneSpace");

    });

    it('fill correct data - no errors', function () {

        //excercise
        this.Data.FirstName = "Jonh";
        this.Data.LastName = "Smith";

        var result = this.PersonValidator.Validate(this.Data);


        //verify
        expect(this.PersonValidator.ErrorInfo.HasErrors).to.equal(false);
    });

    it('fill incorrect data - no errors', function () {

        //when
        this.Data.FirstName = "";
        this.Data.LastName = "Smith toooooooooooooooooooooooooooooooo long";

        //excercise
        var result = this.PersonValidator.Validate(this.Data);

        //verify
        expect(this.PersonValidator.ErrorInfo.HasErrors).to.equal(true);
    });

    describe("fill incorrect data - rule optional", function() {

        beforeEach(function(){
            //setup

            //set rule optional when checked !=true;
            var optional = function () {
                return !this.Checked;
            }.bind(this.Data);

            this.PersonValidator.Rules["FirstName"].Optional = optional;
            this.PersonValidator.Rules["LastName"].Optional = optional;

            this.Data.FirstName = "";
            this.Data.LastName = "Smith toooooooooooooooooooooooooooooooo long";


        });

        it('is optional -> no errors', function () {

            //when
            this.Data.Checked = false;

            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify
            this.PersonValidator.ErrorInfo.LogErrors();
            expect(this.PersonValidator.ErrorInfo.HasErrors).to.equal(false);
        });

        it('is not optional - some errors', function () {

            //when
            this.Data.Checked = true;

            //excercise
            var result = this.PersonValidator.Validate(this.Data);

            //verify
            this.PersonValidator.ErrorInfo.LogErrors();
            expect(this.PersonValidator.ErrorInfo.HasErrors).to.equal(true);
        });
    });
});

