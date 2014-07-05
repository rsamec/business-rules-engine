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

describe('nested validation rules', function () {


    var personValidator = new f.Validation.AbstractValidator<IPerson>();

    var required =new f.Validation.RequiredValidator();
    var maxLength = new f.Validation.MaxLengthValidator();
    maxLength.MaxLength = 15;

    personValidator.RuleFor("FirstName", required);
    personValidator.RuleFor("FirstName",maxLength);

    personValidator.RuleFor("LastName", required);
    personValidator.RuleFor("LastName",maxLength);


    var data = {
        Person1:{},
        Person2:{}
        };


    beforeEach(function(){

        //setup
        this.Data = data;
        this.PersonValidator1 =  personValidator.CreateRule("Person1");
        this.PersonValidator2 =  personValidator.CreateRule("Person2");

        this.PersonValidator =  this.PersonValidator1;

    });

    it('fill correct data - no errors', function () {

        //when
        this.Data.Person1.FirstName = "John"
        this.Data.Person1.LastName = "Smith"

        //when
        this.Data.Person2.FirstName = "Adam"
        this.Data.Person2.LastName = "Novak"

        //excercise
        var result = this.PersonValidator1.Validate(this.Data.Person1);
        var result = this.PersonValidator2.Validate(this.Data.Person2);

        //verify
        expect(this.PersonValidator1.ErrorInfo.HasErrors).to.equal(false);
        expect(this.PersonValidator2.ErrorInfo.HasErrors).to.equal(false);
    });

    it('fill incorrect data - some errors', function () {

        //when
        this.Data.Person1.FirstName = "";
        this.Data.Person1.LastName = "Smith toooooooooooooooooooooooooooooooo long";

        this.Data.Person2.FirstName = "";
        this.Data.Person2.LastName = "Novak toooooooooooooooooooooooooooooooo long";

        //excercise
        var result = this.PersonValidator1.Validate(this.Data.Person1);
        var result = this.PersonValidator2.Validate(this.Data.Person2);

        //verify
        expect(this.PersonValidator1.ErrorInfo.HasErrors).to.equal(true);
        expect(this.PersonValidator2.ErrorInfo.HasErrors).to.equal(true);
    });

    describe("fill incorrect data - rule optional", function() {

        beforeEach(function(){
            //setup

            //set rule optional when checked !=true;
            var optional = function () {
                return !this.Checked;
            }.bind(this.Data);

            this.PersonValidator1.Rules["FirstName"].Optional = optional;
            this.PersonValidator1.Rules["LastName"].Optional = optional;

            this.PersonValidator2.Rules["FirstName"].Optional = optional;
            this.PersonValidator2.Rules["LastName"].Optional = optional;

            this.Data.Person1.FirstName = "";
            this.Data.Person1.LastName = "Smith toooooooooooooooooooooooooooooooo long";

            this.Data.Person2.FirstName = "";
            this.Data.Person2.LastName = "Smith toooooooooooooooooooooooooooooooo long";


        });

        it('is optional -> no errors', function () {

            //when
            this.Data.Person1.Checked = false;
            this.Data.Person2.Checked = false;

            //excercise
            var result = this.PersonValidator1.Validate(this.Data.Person1);
            var result = this.PersonValidator2.Validate(this.Data.Person2);

            //verify
            this.PersonValidator1.ErrorInfo.LogErrors();
            this.PersonValidator2.ErrorInfo.LogErrors();

            expect(this.PersonValidator1.ErrorInfo.HasErrors).to.equal(false);
            expect(this.PersonValidator2.ErrorInfo.HasErrors).to.equal(false);
        });

        it('is not optional - some errors', function () {

            //when
            this.Data.Person1.Checked = true;
            this.Data.Person2.Checked = true;

            //excercise
            var result = this.PersonValidator1.Validate(this.Data.Person1);
            var result = this.PersonValidator2.Validate(this.Data.Person2);

            //verify
            this.PersonValidator1.ErrorInfo.LogErrors();
            this.PersonValidator2.ErrorInfo.LogErrors();

            expect(this.PersonValidator1.ErrorInfo.HasErrors).to.equal(false);
            expect(this.PersonValidator2.ErrorInfo.HasErrors).to.equal(false);
        });
    });
});

