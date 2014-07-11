///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/q/q.d.ts'/>

var f = require('../../validation/validation.js')
var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');
//var Q = require('q');


/**
 * @description
 * Return true for valid identification number of CZE company (called ico), otherwise return false.
 *
 * To create a custom validator you have to implement IPropertyValidator interface.
 */
class ICOValidator {

    /**
     * It checks validity of identification number of CZE company (called ico)
     * @param input {string} value to check
     * @returns {boolean} return true for valid value, otherwise false
     */
    public isAcceptable(input: string) {

        if (input == undefined) return false;
        if (input.length == 0) return false;

        if (!/^\d+$/.test(input)) return false;

        var Sci = new Array();
        var Souc;
        var Del = input.length;
        var kon = parseInt(input.substring(Del, Del - 1), 10);// CLng(Right(strInput, 1));
        //var Numer = parseInt(input.substring(0,Del - 1),10);
        Del = Del - 1;
        Souc = 0;
        for (var a = 0; a < Del; a++) {
            Sci[a] = parseInt(input.substr((Del - a) - 1, 1), 10);
            Sci[a] = Sci[a] * (a + 2);
            Souc = Souc + Sci[a];
        }

        if (Souc > 0) {
            //var resul = 11 - (Souc % 11);
            var resul = Souc % 11;
            var mezi = Souc - resul;
            resul = mezi + 11;
            resul = resul - Souc;

            if ((resul == 10 && kon == 0) || (resul == 11 && kon == 1) || (resul == kon))
                return true;
        }
        return false;
    }

    tagName = "ico";
}

/**
 * @name Custom async property validator example
 * @description
 * Return true for valid BranchOfBusiness, otherwise return false.
 *
 * To create a async custom validator you have to implement IAsyncPropertyValidator interface.
 * Async custom validator must have property isAsync set to true;
 */
class BranchOfBusinessValidator {

    /**
     * It checks the list of all branches of business. Return true if passed branch of business exists.
     * @param input {string} value to check
     * @returns {boolean} return true for valid value, otherwise false
     */
    isAcceptable(s: string):Q.Promise<boolean> {
        var deferred = Q.defer<boolean>();

        setTimeout(function () {
            var items =
                [
                    { "value": 1, "text": "machinery" },
                    { "value": 2, "text": "agriculture" },
                    { "value": 3, "text": "academic" },
                    { "value": 4, "text": "goverment" }
                ];

            var hasSome = _.some(items, function(item){
                return item.text == s;
            })
            if (hasSome)
                {deferred.resolve(true);}
            else
                { deferred.resolve(false);}
        }, 1000);

        return deferred.promise;
    }

    isAsync = true;
    tagName = "branchOfBusiness";
}



interface ICompany{
    Name:string;
    ICO:string;
    BranchOfBusiness:string;
}


describe('custom validators', function () {

    var required =new f.Validation.RequiredValidator();
    var ico = new ICOValidator();
    var branchOfBusiness = new BranchOfBusinessValidator();

    var companyValidator = new f.Validation.AbstractValidator<ICompany>();
    companyValidator.RuleFor("ICO", required);
    companyValidator.RuleFor("ICO", ico);

    companyValidator.RuleFor("BranchOfBusiness", required);
    companyValidator.RuleFor("BranchOfBusiness", branchOfBusiness);


    beforeEach(function(){
        //setup
        this.Data = {};
        this.Validator = companyValidator.CreateRule("Company");

    });

    it('fill correct data - no errors', function (done) {

        //when
        this.Data.ICO = "12312312";
        this.Data.BranchOfBusiness = "machinery";

        //excercise
        var result = this.Validator.Validate(this.Data);
        var promiseResult = this.Validator.ValidateAsync(this.Data);

        var errorInfo = this.Validator.ErrorInfo;
        promiseResult.then(function (response) {

           //verify
           expect(errorInfo.HasErrors).to.equal(false);

           done();

        }).done(null,done);
    });

    it('fill incorrect data - some errors', function (done) {

        //when
        this.Data.ICO = "11111111";
        this.Data.BranchOfBusiness = "unknown";

        //excercise
        var result = this.Validator.Validate(this.Data);
        var promiseResult = this.Validator.ValidateAsync(this.Data);

        var selfValidator = this.Validator;
        promiseResult.then(function (response) {

            selfValidator.ErrorInfo.LogErrors();

            //verify
            expect(selfValidator.ErrorInfo.HasErrors).to.equal(true);
            expect(selfValidator.ErrorInfo.ErrorCount).to.equal(2);

            done();

        }).done(null,done);
    });
});

