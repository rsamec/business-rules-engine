/**
 * Created by rsamec on 9.7.2014.
 */
///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/expect.js/expect.js.d.ts'/>


var expect = require('expect.js');
import rcValidator = require('../../validation/customValidators/RCValidator');

describe('RCValidator', function () {

    var validParams = ["062413/2256",
        "042111/2956",
        "043111/2957",
        "043211/2956",
        "045111/4411",
        "045211/4410",
        "045311/4409",
        "047111/3709",
        "047130/3712",
        "047131/3711",
        "047211/3411",
        "047311/3311",
        "047330/3314",
        "047331/3313",
        "047430/3313",
        "047831/3011",
        "440229/234",
        "441129/342",
        "800122/8763",
        "048111/3413",
        "048130/1810",
        "048231/1610",
        "071111/145",
        "071111/1610",
        "073211/1611",
        "076211/1614",
        "077111/1616",
        "078111/1716",
        "083111/2216",
        "430228/134",
        "431122/155",
        "431128/231",
        "431129/178",
        "431222/141",
        "431231/172",
        "436122/931",
        "436222/165",
        "010101/222"];

    var validator = new rcValidator();

    for (var op in validParams) {
        (function (item) {
            it('should check rc number ' + item + ' -> OK', function () {
                expect(validator.isAcceptable(item)).to.equal(true);
            });
        })(validParams[op]);
    }

    var unvalidParams = [
        "062413/3333",
        "038111/3029",
        "038211/3028",
        "038311/2928",
        "042111/321",
        "043111/929",
        "043211/149",
        "043311/3428",
        "044111/3728",
        "046311/3728",
        "047132/3028",
        "047230/3029",
        "047332/3026",
        "047431/3026",
        "048131/2326",
        "048311/2025",
        "983211/231",
        "983211/2125",
        "983231/1720",
        "073111/192",
        "073211/182",
        "073911/182",
        "076311/162",
        "077111/122",
        "078111/122",
        "083111/789",
        "093111/972",
        "430229/231",
        "431122/1321",
        "432122/1421",
        "432122/8763",
        "437122/212",
        "438122/872",
        "438131/1121",
        "438231/1120",
        "800122/768",
        "802222/817",
        "802222/1119",
        "982111/1619",
        "982111/1618"];

    for (var op in unvalidParams) {
        (function (item) {
            it('should check rc number ' + item + ' -> unvalid', function () {
                expect(validator.isAcceptable(item)).to.equal(false);
            });
        })(unvalidParams[op]);
    }


});
