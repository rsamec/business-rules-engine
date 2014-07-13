/**
 * Created by rsamec on 9.7.2014.
 */
///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/expect.js/expect.js.d.ts'/>


var expect = require('expect.js');
import dateCompareValidator = require('../../validation/customValidators/DateCompareValidator');
import moment = require('moment')

describe('DateCompareValidator', function () {

    describe("isAcceptable", function () {
        var params = [
            //less more than month
            { input: new Date(2000, 1, 1), result: true},
            //less more than day
            { input: new Date(2000, 2, 1), result: true},
            //equal up to days
            { input: new Date(2000, 2, 2), result: true },
            //equal up to miliseconds
            { input: new Date(2000, 2, 2, 0, 0, 0, 0), result: true  },
            //greater about 1 milisecond
            { input: new Date(2000, 2, 2, 0, 0, 0, 1), result: false },
            //equal up to miliseconds
            { input: new Date(2000, 2, 2, 0, 0, 0, 0), result: true, ignoreTime: true },
            //greater about 1 milisecond
            { input: new Date(2000, 2, 2, 0, 0, 0, 1), result: true, ignoreTime: true },
            //greater about max hours
            { input: new Date(2000, 2, 2, 23, 59, 59, 99), result: true, ignoreTime: true },
            //greater about one day
            { input: new Date(2000, 2, 3, 0, 0, 0, 0), result: false, ignoreTime: true },
            //bad date
            { input: "", result: false },
            //bad date
            { input: undefined, result: false },
            //bad date
            { input: "{}", result: false },
            //bad date
            { input: "fasdfa", result: false }
        ];

        var validator = new dateCompareValidator();
        validator.CompareTo = new Date(2000, 2, 2);
        validator.CompareOperator = Validation.CompareOperator.LessThanEqual;

        for (var op in params) {
            (function (item) {
                it('should check date ' + item.input + ' is less then or equal -> ' + item.result, function () {
                    if (item.ignoreTime != undefined) validator.IgnoreTime = item.ignoreTime;
                    expect(item.result).to.equal(validator.isAcceptable(item.input));
                });
            })(params[op]);
        }

    });

    describe("error messsages", function () {

        var czMesseges = {
            dateCompare: {
                Format: "DD.MM.YYYY",
                LessThan: "Prosím, zadejte datum menší než {CompareTo}.",
                LessThanEqual: "Prosím, zadejte datum menší nebo rovné {CompareTo}.",
                Equal: "Prosím, zadejte {CompareTo}.",
                NotEqual: "Prosím, zadejte datum různé od {CompareTo}.",
                GreaterThanEqual: "Prosím, zadejte datum větší nebo rovné {CompareTo}.",
                GreaterThan: "Prosím, zadejte datum větší než {CompareTo}."
            }
        };

        var enMesseges = {
            dateCompare: {
                Format: "MM/DD/YYYY",
                LessThan: "Please enter date less than {CompareTo}.",
                LessThanEqual: "Please enter date less than or equal {CompareTo}.",
                Equal: "Please enter date equal {CompareTo}.",
                NotEqual: "Please enter date different than {CompareTo}.",
                GreaterThanEqual: "Please enter date greater than or equal {CompareTo}.",
                GreaterThan: "Please enter date greter than {CompareTo}."
            }
        };

        var validator = new dateCompareValidator();
        validator.CompareTo = new Date(2000, 2, 2);
        validator.CompareOperator = Validation.CompareOperator.LessThan;

        it('should show czMessage', function () {
            expect("Prosím, zadejte datum menší než 02.03.2000.").to.equal(validator.getErrorMessage(czMesseges))
        });
        it('should show enMessage', function () {
            expect("Please enter date less than 03/02/2000.").to.equal(validator.getErrorMessage(enMesseges));
        });

    });

});
