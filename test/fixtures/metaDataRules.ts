///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
var f = require('../../validation/validation.js')
var expect = require('expect.js');

describe('basic meta data validation rules', function () {
    var metaData = {
        Checked:{},
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
    };

    var form;

    beforeEach(function(){

        //setup
        form = new f.Validation.MetaForm(metaData);
    });

    it('fill correct data - no errors', function () {

        //excercise
        var data = form.Data;
        data.FirstName = "Jonh";
        data.LastName = "Smith";

        form.Validate();

        //verify
        expect(form.Errors.HasErrors).to.equal(false);
    });

    it('fill incorrect data - no errors', function () {

        //excercise
        var data = form.Data;
        data.FirstName = "";
        data.LastName = "Smith asdjflkasd fsajdfjlksajf sajfdsajdfj sadfjaslkjfdksajkfda";

        form.Validate();

        //verify
        expect(form.Errors.HasErrors).to.equal(true);
    });

    describe("fill incorrect data - rule optional", function() {

        beforeEach(function(){
            //setup
            form = new f.Validation.MetaForm(metaData);

            //set rule optional when checked !=true;
            var optional = function () {
                return !this.Checked;
            }.bind(form.Data);
            form.MetaRules.Rules["FirstName"].Error.Optional = optional;
            form.MetaRules.Rules["LastName"].Error.Optional = optional;

            form.Data.FirstName = "";
            form.Data.LastName = "Smith asdjflkasd fsajdfjlksajf sajfdsajdfj sadfjaslkjfdksajkfda";


        });

        it('is optional -> no errors', function () {

            //when
            form.Data.Checked = false;

            //excercise
            form.Validate();

            //verify
            form.Errors.LogErrors();
            expect(form.Errors.HasErrors).to.equal(false);
        });

        it('is not optional - some errors', function () {

            //when
            form.Data.Checked = true;

            //excercise
            form.Validate();

            //verify
            form.Errors.LogErrors();
            expect(form.Errors.HasErrors).to.equal(true);
        });
    });
});

