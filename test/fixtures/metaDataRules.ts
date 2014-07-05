///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>

var f = require('../../validation/validation.js')
var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');

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


    beforeEach(function(){
        //setup
        this.MetaData = metaData;
        this.Data = f.Validation.Util.generateData(this.MetaData);

        this.MetaRules = new f.Validation.MetaDataRules(this.Data, this.MetaData);
        this.Errors = new f.Validation.MetaRulesErrorInfo("Main", this.MetaRules);

    });

    it('fill correct data - no errors', function () {

        //excercise
        var data = this.Data;
        data.FirstName = "Jonh";
        data.LastName = "Smith";

        this.MetaRules.ValidateAll();

        //verify
        expect(this.Errors.HasErrors).to.equal(false);
    });

    it('fill incorrect data - no errors', function () {

        //when
        var data = this.Data;
        data.FirstName = "";
        data.LastName = "Smith toooooooooooooooooooooooooooooooo long";

        //excercise
        this.MetaRules.ValidateAll();

        //verify
        expect(this.Errors.HasErrors).to.equal(true);
    });

    describe("fill incorrect data - rule optional", function() {

        beforeEach(function(){
            //setup


            //set rule optional when checked !=true;
            var optional = function () {
                return !this.Checked;
            }.bind(this.Data);
            this.MetaRules.Rules["FirstName"].Error.Optional = optional;
            this.MetaRules.Rules["LastName"].Error.Optional = optional;

            this.Data.FirstName = "";
            this.Data.LastName = "Smith toooooooooooooooooooooooooooooooo long";


        });

        it('is optional -> no errors', function () {

            //when
            this.Data.Checked = false;

            //excercise
            this.MetaRules.ValidateAll();

            //verify
            this.Errors.LogErrors();
            expect(this.Errors.HasErrors).to.equal(false);
        });

        it('is not optional - some errors', function () {

            //when
            this.Data.Checked = true;

            //excercise
            this.MetaRules.ValidateAll();

            //verify
            this.Errors.LogErrors();
            expect(this.Errors.HasErrors).to.equal(true);
        });
    });
});

