///<reference path='../typings/underscore/underscore.d.ts'/>
///<reference path='../typings/q/q.d.ts'/>
///<reference path='../typings/moment/moment.d.ts'/>

///<reference path='util.ts'/>

module Validation {

    /**
     * It represents a property validator for atomic object.
     */
    export interface IPropertyValidator{
        isAcceptable(s: any): boolean;
        tagName:string;
    }

    /**
     * It represents a property validator for simple string value.
     */
    export interface IStringValidator extends IPropertyValidator{
        isAcceptable(s: string): boolean;
    }

    /**
     * It represents an async property validator for atomic object.
     */
    export interface IAsyncPropertyValidator{
        isAcceptable(s: any): Q.Promise<boolean>;
        isAsync:boolean;
        tagName:string;
    }

    /**
     * It represents an async property validator for simple string value.
     */
    export interface IAsyncStringPropertyValidator extends  IAsyncPropertyValidator{
        isAcceptable(s: string): Q.Promise<boolean>;
    }

    /**
     * It defines compare operators.
     */
    export enum CompareOperator {
        //must be less than
        LessThan,

        //cannot be more than
        LessThanEqual,

        //must be the same as
        Equal,

        //must be different from
        NotEqual,

        //cannot be less than
        GreaterThanEqual,

        //must be more than
        GreaterThan
    }


    var lettersRegexp = /^[A-Za-z]+$/;
    export class LettersOnlyValidator implements IStringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
        tagName = "lettersonly";
    }

    var numberRegexp = /^[0-9]+$/;
    export class ZipCodeValidator implements IStringValidator {
        isAcceptable(s:string) {
            return s.length === 5 && numberRegexp.test(s);
        }

        tagName = "zipcode";
    }

    var emailRegexp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    export class EmailValidator implements IStringValidator {
        isAcceptable(s: string) {
            return emailRegexp.test(s);
        }
        tagName = "email";
    }

    export class RequiredValidator implements IStringValidator {
        isAcceptable(s: string, param?:number) {
            return s != undefined && s != "";
        }
        tagName = "required";
    }

    export class MinLengthValidator implements IStringValidator {
        isAcceptable(s: string) {
            return s.length >= this.MinLength;
        }
        public MinLength:number = 0;

        tagName = "minlength";
    }
    export class MaxLengthValidator implements IStringValidator {
        constructor (public MaxLength?:number){
            if (MaxLength == undefined) MaxLength = 0;
        }
        isAcceptable(s: string) {
            return s.length <= this.MaxLength;
        }
        tagName = "maxlength";
    }
    export class RangeLengthValidator implements IStringValidator {
        isAcceptable(s: string) {
            return s.length >= this.MinLength && s.length <= this.MaxLength;
        }
        public RangeLength:Array<number> = [0,0];

        public get MinLength():number { return this.RangeLength[0]; }
        public get MaxLength():number { return this.RangeLength[1]; }

        tagName = "rangelength";
    }

    export class ParamValidator implements IAsyncPropertyValidator {
        isAcceptable(s: string):Q.Promise<boolean> {
            var deferred = Q.defer<boolean>();

            this.Options.then(function(result){
                var hasSome = _.some(result, function(item){
                    return item.text == s;
                })
                if (hasSome) deferred.resolve(true);
                deferred.resolve(false);
            })

            return deferred.promise;
        }
        public ParamId:string;
        public Options:Q.Promise<Array<any>>;

        isAsync = true;
        tagName = "param";
    }

}