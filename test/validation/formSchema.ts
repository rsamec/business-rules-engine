///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/q/q.d.ts'/>

var Validation = require('../../src/validation/Validation.js');
var Validators = require('../../src/validation/BasicValidators.js');
var FormSchema = require('../../src/validation/FormSchema.js');
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

describe('JSON Form Schema', function () {
    //setup
    var formSchema = {
        "Checked": { "type": "boolean", "title": "Checked", "default": true },
        "FirstName": { "type": "string", "title": "First name", "required": "true", "maxLength": "15" },
        "LastName": { "type": "string", "title": "Last name", "required": "true", "maxLength": "15"},
        "Contacts": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "Email": { "type": "string", "title": "Email", default: '', "required": "true", "maxLength": "100",
                        "pattern": "S*@S*",
                        "remote":{
                            url:"https://api.mongolab.com/api/1/databases/documents/collections/docs?c=true&apiKey=SX4PfDQhzWoek3EnS6FdYo-fWaxO7cQI"
                        }
                    },
                    "Mobile": {
                        "type": "object",
                        "properties": {
                            "CountryCode": { "type": "string", "title": "Country code", "required": "true", "maxLength": "3", "enum": ["FRA", "CZE", "USA", "GER"] },
                            "Number": { "type": "string", "title": "Phone number", "required": "true", "maxLength": "9" }
                        }
                    },
                    "FixedLine": {
                        "type": "object",
                        "properties": {
                            "CountryCode": { "type": "string", "title": "Country code", "required": "true", "maxLength": "3", "enum": ["FRA", "CZE", "USA", "GER"]},
                            "Number": { "type": "string", "title": "Phone number", "required": "true", "maxLength": "9" }
                        }
                    }
                }
            },
            "maxItems": "4",
            "minItems": "2"
        }
    }

    //
    var getItemDataTemplate = function () {
        var item = FormSchema.Util.InitValues(formSchema.Contacts.items.properties);

        item.Email = 'mail@gmail.com';
        item.Mobile.CountryCode = 'CZE';
        item.Mobile.Number = '736483690';
        item.FixedLine.CountryCode = 'USA';
        item.FixedLine.Number = '736483690';

        return item;
    }

    beforeEach(function () {

        this.FormSchema = formSchema;
        this.Data = FormSchema.Util.InitValues(this.FormSchema);

        this.Data.FirstName = "John";
        this.Data.LastName = "Smith";

        this.MainValidator = new FormSchema.JsonSchemaAbstractValidationRuleFactory(this.FormSchema).CreateRule("Main");


    });

//    it('form values - parsing', function () {
//
//        var personData = FormSchema.Util.GetFormValues(this.FormSchema);
//        console.log(JSON.stringify(personData));
//
//        var contactRow = FormSchema.Util.GetFormValues(this.FormSchema.Contacts.items.properties);
//        console.log(JSON.stringify(contactRow));
//    });
//
//    it('form rules', function () {
//
//        var personData = FormSchema.Util.GetAbstractRule(this.FormSchema);
//        console.log(JSON.stringify(personData));
//
//
////        var contactRow = FormSchema.Util.GetFormValues(this.FormSchema.Person.properties.Contacts.items.properties);
////        console.log(JSON.stringify(contactRow));
//    });

    it('fill undefined - some errors', function () {

        //when
        this.Data.Contacts = undefined;

        //excercise
        var result = this.MainValidator.Validate(this.Data);

        //verify
        expect(result.HasErrors).to.equal(true);

    });

    it('fill 1 item - minItems errors', function () {

        //when
        this.Data.Contacts.push(getItemDataTemplate());

        //excercise
        var result = this.MainValidator.Validate(this.Data);

        //verify
        expect(result.Errors["Contacts"].ValidationFailures["minItems"].HasError).to.equal(true);

    });

    it('fill 5 items - maxItems errors', function () {

        //when
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());


        //excercise
        var result = this.MainValidator.Validate(this.Data);

        //verify
        expect(result.Errors["Contacts"].ValidationFailures["maxItems"].HasError).to.equal(true);

    });
    it('fill correct data - no errors', function () {

        //when
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());

        //excercise
        var result = this.MainValidator.Validate(this.Data);
        //verify
        expect(result.HasErrors).to.equal(false);

    });


    it('fill incorrect data - some errors', function () {

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

        //verify
        expect(result.HasErrors).to.equal(true);
        expect(result.Errors["Contacts"].HasErrors).to.equal(true);
        expect(result.Errors["Contacts"].Children[0].HasErrors).to.equal(false);
        expect(result.Errors["Contacts"].Children[1].HasErrors).to.equal(true);
        expect(result.Errors["Contacts"].Children[2].HasErrors).to.equal(true);

    });

    it('delete error item, leave correct item - no errors', function () {

        //when
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());

        //item list property error
        this.Data.Contacts[2].Email = "";

        //item list async property error
        this.Data.Contacts[2].Mobile.CountryCode = "BLA";

        //delete last error item
        this.Data.Contacts.splice(2, 1)

        //excercise
        var result = this.MainValidator.Validate(this.Data);

        //verify
        expect(result.HasErrors).to.equal(false);
        expect(result.Errors["Contacts"].HasErrors).to.equal(false);
        expect(result.Errors["Contacts"].Children[0].HasErrors).to.equal(false);
        expect(result.Errors["Contacts"].Children[1].HasErrors).to.equal(false);


    });

    it('delete correct item, leave error item - some errors', function () {

        //when
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());
        this.Data.Contacts.push(getItemDataTemplate());

        //item list property error
        this.Data.Contacts[2].Email = "";

        //item list async property error
        this.Data.Contacts[2].Mobile.CountryCode = "BLA";

        //delete correct item
        this.Data.Contacts.splice(1, 1);

        //excercise
        var result = this.MainValidator.Validate(this.Data);

        //verify
        expect(result.HasErrors).to.equal(true);
        expect(result.Errors["Contacts"].HasErrors).to.equal(true);
        expect(result.Errors["Contacts"].Children[0].HasErrors).to.equal(false);
        expect(result.Errors["Contacts"].Children[1].HasErrors).to.equal(true);


    });
});

