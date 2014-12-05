///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/q/q.d.ts'/>

//require["config"](
//    { baseUrl: '../../src/validation' }
//);


import Validation = require('../../src/validation/Validation');
import Validators = require('../../src/validation/BasicValidators');

var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');
import Q = require('q');

describe('basic validators', function () {

    describe('Range validator', function () {
        var rangeValidator = new Validators.RemoteValidator();
        it('should return false when value is not in range',function(){
                var range = [5,11]
                var rangeValidator = new Validators.RangeValidator(range);
                expect(rangeValidator.isAcceptable(4)).to.equal(false);
                expect(rangeValidator.isAcceptable(12)).to.equal(false);
            }
        )
        it('should return true when value is in range',function(){
                var range = [5,11]
                var rangeValidator = new Validators.RangeValidator(range);
                expect(rangeValidator.isAcceptable(5)).to.equal(true);
                expect(rangeValidator.isAcceptable(7)).to.equal(true);
                expect(rangeValidator.isAcceptable(11)).to.equal(true);
            }
        )
    });

    describe('remote validator', function () {
        var remote = new Validators.RemoteValidator();
        remote.Options = {
            url:"http://api.automeme.net/text.json"
        }


        it('non-existing country code should return false', function (done) {

            var promiseResult =remote.isAcceptable('abc@gmail.com');

            promiseResult.then(function (response) {
                expect(response).to.equal(false);

                done();
            }).done(null, done);
        });

//        it('existing country code return true', function (done) {
//
//            var promiseResult =remote.isAcceptable('abc@gmail.com')
//
//            promiseResult.then(function (response) {
//                expect(response).to.equal(true);
//
//                done();
//            }).done(null, done);
//        });
    });
});