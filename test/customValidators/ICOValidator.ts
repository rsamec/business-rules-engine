/**
 * Created by rsamec on 9.7.2014.
 */
///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/expect.js/expect.js.d.ts'/>


var expect = require('expect.js');
import icoValidator = require('../../validation/customValidators/ICOValidator');

describe('ICOValidator', function () {

    var params = [
        { input: "70577200", result: true},
        { input: "3457890", result: false },
        { input: "7057720", result: false },
        { input: "45244782", result: true },
        { input: "25578898", result: true },
        { input: "61490041", result: true },
        { input: "11111111", result: false },
        { input: "12312312", result: true },
        { input: "", result: false },
        { input: undefined, result: false },
        { input: "{}", result: false },
        { input: "fasdfa", result: false }
    ];
    var validator = new icoValidator();


    for (var op in params) {
        (function (item) {
            it('should check ico number ' + item.input + ' -> ' + item.result, function () {
                expect(item.result).to.equal(validator.isAcceptable(item.input));
            });
        })(params[op]);
    }
});
