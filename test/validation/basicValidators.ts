///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/q/q.d.ts'/>

var Validation = require('../../src/validation/Validation.js');
var Validators = require('../../src/validation/BasicValidators.js');
var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');
import Q = require('q');


describe('basic validators', function () {
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