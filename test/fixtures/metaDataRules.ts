///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
var f = require('../../validation/validation.js')
var expect = require('expect.js');

describe('basic meta data validation rules', function() {
    var metaData = {
        FirstName:{
            rules:{
                required:true,
                maxlength:15
            }
        },
        LastName:{
            rules:{
                required:true,
                maxlength:30
            }
        }
    }

    it('fill correct data - no errors', function() {

        //setup
        var form = new f.Validation.MetaForm(metaData);

        //excercise
        var data = form.Data;
        data.FirstName = "Jonh";
        data.LastName = "Smith";

        form.Validate();

        //verify
        expect(form.Errors.HasErrors).to.equal(false);

    });


    it('fill incorrect data - no errors', function() {

        //setup
        var form = new f.Validation.MetaForm(metaData);

        //excercise
        var data = form.Data;
        data.FirstName = "";
        data.LastName = "Smith asdjflkasd fsajdfjlksajf sajfdsajdfj sadfjaslkjfdksajkfda";

        form.Validate();

        //verify
        expect(form.Errors.HasErrors).to.equal(true);

    });

});
