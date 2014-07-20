///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
var Validation = require('../../validation/validation.js');
var expect = require('expect.js');

describe('common validators', function () {

   /* describe('MinValidator', function () {
        var params = [
            { input: "1", result: true},
            { input: 1, result: false },
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

        var icoValidator = new Validation.MinValidator();

        for (var op in params) {
            (function (item) {
                it('should check ico number ' + item.input + ' -> ' + item.result, function () {
                    expect(item.result).to.equal(icoValidator.isAcceptable(item.input));
                });
            })(params[op]);
        }
    });*/
});