///<reference path='../typings/underscore.string/underscore.string.d.ts'/>
///<reference path='../typings/moment/moment.d.ts'/>

///<reference path='../validation/validators.ts'/>

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

export = ICOValidator;