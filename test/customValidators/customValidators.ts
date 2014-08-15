///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/q/q.d.ts'/>

var Validation = require('../../dist/node-form.js');
var Validators = require('../../dist/customValidators/BasicValidators.js');

var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');
import Q = require('q');

var moment = require('moment');
import icoValidator = require('../../src/customValidators/ICOValidator');
import dateCompareValidator = require('../../src/customValidators/DateCompareValidator');

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
     * @param s {string} value to check
     * @returns {boolean} return true for valid value, otherwise false
     */
    isAcceptable(s:string):Q.Promise<boolean> {
        var deferred = Q.defer<boolean>();

        setTimeout(function () {
            var items =
                [
                    { "value": 1, "text": "machinery" },
                    { "value": 2, "text": "agriculture" },
                    { "value": 3, "text": "academic" },
                    { "value": 4, "text": "goverment" }
                ];

            var hasSome = _.some(items, function (item) {
                return item.text == s;
            });

            if (hasSome) {
                deferred.resolve(true);
            }
            else {
                deferred.resolve(false);
            }
        }, 1000);

        return deferred.promise;
    }

    isAsync = true;
    tagName = "branchOfBusiness";
}

interface ICompany {
    Name:string;
    ICO:string;
    BranchOfBusiness:string;
}

/**
 * @name Custom async property validator example
 * @description
 * Return true for valid BranchOfBusiness, otherwise return false.
 *
 * To create a async custom validator you have to implement IAsyncPropertyValidator interface.
 * Async custom validator must have property isAsync set to true;
 */
class DateCompareExtValidator extends dateCompareValidator {
    public isAcceptable(s:any) {
        //if date to compare is not specified - defaults to compare against now
        if (!_.isDate(s)) return false;

        var then = moment(s);

        if (this.CompareTo == undefined)  this.CompareTo = new Date();
        var now = moment(this.CompareTo);

        if (this.CompareTo2 == undefined)  this.CompareTo2 = new Date();
        var now2 = moment(this.CompareTo2);
        var isValid = this.isValid(now, then, this.CompareOperator) && this.isValid(now2, then, this.CompareOperator2);

        return isValid;
    }

    private isValid(now:any, then:any, compareOperator:Validation.CompareOperator) {
        var isValid = false;
        var diffs:number = then.diff(now);
        if (this.IgnoreTime) diffs = moment.duration(diffs).days();

        if (diffs < 0) {
            isValid = compareOperator == Validation.CompareOperator.LessThan
                || compareOperator == Validation.CompareOperator.LessThanEqual
                || compareOperator == Validation.CompareOperator.NotEqual;
        }
        else if (diffs > 0) {
            isValid = compareOperator == Validation.CompareOperator.GreaterThan
                || compareOperator == Validation.CompareOperator.GreaterThanEqual
                || compareOperator == Validation.CompareOperator.NotEqual;
        }
        else {
            isValid = compareOperator == Validation.CompareOperator.LessThanEqual
                || compareOperator == Validation.CompareOperator.Equal
                || compareOperator == Validation.CompareOperator.GreaterThanEqual;
        }
        return isValid;
    }

    tagName = "dataCompareExt";

    /**
     * Set the time of compare between passed date and CompareTo date.
     */
    public CompareOperator2:Validation.CompareOperator;

    /**
     * The datetime against the compare is done.
     * If CompareTo is not set, then comparison is done against actual datetime.
     */
    public CompareTo2:Date;
}

interface  IDuration {
    From:Date;
    To:Date;
}

describe('custom validators', function () {

    describe('create new custom validator', function () {

        var required = new Validators.RequiredValidator();
        var ico = new icoValidator();
        var branchOfBusiness = new BranchOfBusinessValidator();

        var companyValidator = new Validation.AbstractValidator<ICompany>();
        companyValidator.RuleFor("ICO", required);
        companyValidator.RuleFor("ICO", ico);

        companyValidator.RuleFor("BranchOfBusiness", required);
        companyValidator.RuleFor("BranchOfBusiness", branchOfBusiness);


        beforeEach(function () {
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

            promiseResult.then(function (response) {

                //verify
                expect(response.HasErrors).to.equal(false);

                done();

            }).done(null, done);
        });

        it('fill incorrect data - some errors', function (done) {

            //when
            this.Data.ICO = "11111111";
            this.Data.BranchOfBusiness = "unknown";

            //excercise
            var result = this.Validator.Validate(this.Data);
            var promiseResult = this.Validator.ValidateAsync(this.Data);

            promiseResult.then(function (response) {

                //verify
                expect(response.HasErrors).to.equal(true);
                expect(response.ErrorCount).to.equal(2);

                done();

            }).done(null, done);
        });
    });


    describe('extend existing validator with custom functionality', function () {

        var lowerThanOneYearAndGreaterThanToday = new DateCompareExtValidator();
        lowerThanOneYearAndGreaterThanToday.CompareOperator = Validation.CompareOperator.LessThan;
        lowerThanOneYearAndGreaterThanToday.CompareTo = moment(new Date()).add({year: 1}).toDate();
        lowerThanOneYearAndGreaterThanToday.CompareOperator2 = Validation.CompareOperator.GreaterThanEqual;
        lowerThanOneYearAndGreaterThanToday.CompareTo2 = new Date();


        var durationValidator = new Validation.AbstractValidator<IDuration>();
        durationValidator.RuleFor("From", lowerThanOneYearAndGreaterThanToday);
        durationValidator.RuleFor("To", lowerThanOneYearAndGreaterThanToday);


        beforeEach(function () {
            //setup
            this.Data = {};
            this.Validator = durationValidator.CreateRule("Duration");

        });

        it('fill correct data - no errors', function () {

            //when
            this.Data.From = moment(new Date()).add({days: 5}).toDate();
            this.Data.To = moment(new Date()).add({days: 360}).toDate();

            //excercise
            var result = this.Validator.Validate(this.Data);

            //verify
            expect(result.HasErrors).to.equal(false);

        });

        it('fill incorrect data - some errors', function () {

            //when
            this.Data.From = moment(new Date()).add({days: -1}).toDate();
            this.Data.To = moment(new Date()).add({days: 370}).toDate();

            //excercise
            var result = this.Validator.Validate(this.Data);

            //verify
            expect(result.HasErrors).to.equal(true);
            expect(result.ErrorCount).to.equal(2);

        });
    });
});