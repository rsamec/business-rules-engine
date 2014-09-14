///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>

import _ = require('underscore');

module Utils {

    /*
    It represents utility for string manipulation.
     */
    export class StringFce {
        static format(s:string, args:any):string {
            var formatted = s;
            for (var prop in args) {
                var regexp = new RegExp('\\{' + prop + '\\}', 'gi');
                formatted = formatted.replace(regexp, args[prop]);
            }
            return formatted;
        }
    }

    /*
    It represents utility for number manipulation.
     */
    export class NumberFce {
        static GetNegDigits(value:string):number {
            if (value === undefined) return 0;
            var digits = value.toString().split('.');
            if (digits.length > 1) {
                var negDigitsLength = digits[1].length;
                return negDigitsLength;
            }
            return 0;
        }
    }
}
export = Utils;