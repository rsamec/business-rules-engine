///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/q/Q.d.ts'/>
///<reference path='../../typings/moment/moment.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/business-rules-engine/business-rules-engine.d.ts'/>

import Q = require("q");
import moment = require("moment");
import _ = require("underscore");


module Validators {
    class NumberFce {
        static GetNegDigits(value:string):number {
            if (value === undefined) return 0;
            var digits = value.toString().split('.');
            if (digits.length > 1) {
                return digits[1].length;
            }
            return 0;
        }
    }

    var lettersRegexp = /^[A-Za-z]+$/;
    export class LettersOnlyValidator implements Validation.IStringValidator {
        isAcceptable(s:string) {
            return lettersRegexp.test(s);
        }

        tagName = "lettersonly";
    }

    var numberRegexp = /^[0-9]+$/;
    export class ZipCodeValidator implements Validation.IStringValidator {
        isAcceptable(s:string) {
            return s.length === 5 && numberRegexp.test(s);
        }

        tagName = "zipcode";
    }

    // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
    var emailRegexp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    export class EmailValidator implements Validation.IStringValidator {
        isAcceptable(s:string) {
            return emailRegexp.test(s);
        }

        tagName = "email";
    }
    // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
    var urlRegexp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    export class UrlValidator implements Validation.IStringValidator {
        isAcceptable(s:string) {
            return urlRegexp.test(s);
        }

        tagName = "url";
    }

    export class RequiredValidator implements Validation.IStringValidator {
        isAcceptable(s:string) {
            return s !== undefined && s !== "";
        }

        tagName = "required";
    }
    export class DateValidator implements Validation.IStringValidator {
        isAcceptable(s:string) {
            return !/Invalid|NaN/.test(new Date(s).toString());
        }

        tagName = "date";
    }
    export class DateISOValidator implements Validation.IStringValidator {
        isAcceptable(s:string) {
            return  /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(s);
        }

        tagName = "dateISO";
    }
    export class NumberValidator implements Validation.IStringValidator {
        isAcceptable(s:string) {
            return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(s);
        }

        tagName = "number";
    }
    export class DigitValidator implements Validation.IStringValidator {
        isAcceptable(s:string) {
            return /^\d+$/.test(s);
        }

        tagName = "digit";
    }

    export class SignedDigitValidator implements Validation.IStringValidator {
        isAcceptable(s:string) {
            return /^-?\d+$/.test(s);
        }

        tagName = "signedDigit";
    }
    var MinimalDefaultValue = 0;
    export class MinLengthValidator implements Validation.IStringValidator {
        constructor(public MinLength?:number) {
            if (MinLength === undefined) this.MinLength = MinimalDefaultValue;
        }

        isAcceptable(s:string) {
            return s.length >= this.MinLength;
        }

        tagName = "minlength";
    }
    var MaximalDefaultValue = 0;
    export class MaxLengthValidator implements Validation.IStringValidator {
        constructor(public MaxLength?:number) {
            if (MaxLength === undefined) this.MaxLength = MaximalDefaultValue;
        }

        isAcceptable(s:string) {
                        return s.length <= this.MaxLength;
        }

        tagName = "maxlength";
    }

    export class RangeLengthValidator implements Validation.IStringValidator {
        constructor(public RangeLength?:Array<number>) {
            if (RangeLength === undefined) this.RangeLength = [MinimalDefaultValue, MaximalDefaultValue];
        }

        isAcceptable(s:string) {
            return s.length >= this.MinLength && s.length <= this.MaxLength;
        }

        public get MinLength():number {
            return this.RangeLength[0];
        }

        public get MaxLength():number {
            return this.RangeLength[1];
        }

        tagName = "rangelength";
    }
    export class MinValidator implements Validation.IPropertyValidator {
        constructor(public Min?:number) {
            if (Min === undefined) this.Min = MinimalDefaultValue;
        }

        isAcceptable(s:any) {
            if (!_.isNumber(s)) s = parseFloat(s);
            return s >= this.Min;
        }

        tagName = "min";
    }
    export class MaxValidator implements Validation.IPropertyValidator {
        constructor(public Max?:number) {
            if (Max === undefined) this.Max = MaximalDefaultValue;
        }

        isAcceptable(s:any) {
            if (!_.isNumber(s)) s = parseFloat(s);
            return s <= this.Max;
        }

        tagName = "max";
    }

    export class RangeValidator implements Validation.IPropertyValidator {
        constructor(public Range?:Array<number>) {
            if (Range === undefined) this.Range = [MinimalDefaultValue, MaximalDefaultValue];
        }

        isAcceptable(s:any) {
            if (!_.isNumber(s)) s = parseFloat(s);
            return s.length >= this.Min && s.length <= this.Max;
        }

        public get Min():number {
            return this.Range[0];
        }

        public get Max():number {
            return this.Range[1];
        }

        tagName = "range";
    }
    var StepDefaultValue = "1";
    export class StepValidator implements Validation.IPropertyValidator {
        constructor(public Step?:string) {
            if (Step === undefined) this.Step = StepDefaultValue;
        }

        isAcceptable(s:any) {

            var maxNegDigits = Math.max(NumberFce.GetNegDigits(s), NumberFce.GetNegDigits(this.Step));
            var multiplier = Math.pow(10, maxNegDigits);
            return (parseInt(s,10) * multiplier) % (parseInt(this.Step,10) * multiplier) === 0;
        }

        tagName = "step";
    }
    var PatternDefaultValue = "*";
    export class PatternValidator implements Validation.IStringValidator {
        constructor(public Pattern?:string) {
            if (Pattern === undefined) this.Pattern = PatternDefaultValue;
        }

        isAcceptable(s:string) {
            return new RegExp(this.Pattern).test(s);
        }

        tagName = "pattern";
    }
    export class ContainsValidator implements Validation.IAsyncPropertyValidator {

        constructor(public Options:Q.Promise<Array<any>>) {
            if (Options === undefined) this.Options = Q.when([]);
        }

        isAcceptable(s:string):Q.Promise<boolean> {
            var deferred:Q.Deferred<boolean> = Q.defer<boolean>();

            this.Options.then(function (result) {
                var hasSome = _.some(result, function (item) {
                    return item === s;
                });
                if (hasSome) deferred.resolve(true);
                deferred.resolve(false);
            });

            return deferred.promise;
        }

        isAsync = true;
        tagName = "contains";
    }
}
export = Validators;

