///<reference path='../typings/underscore/underscore.d.ts'/>
///<reference path='../typings/q/q.d.ts'/>

///<reference path='abstract.ts'/>
///<reference path='util.ts'/>
///<reference path='error.ts'/>
///<reference path='errorInfo.ts'/>
///<reference path='common.ts'/>

module Validation {

    var lettersRegexp = /^[A-Za-z]+$/;
    export class LettersOnlyValidator implements IStringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
        metaTagName = "lettersonly";
    }

    var numberRegexp = /^[0-9]+$/;
    export class ZipCodeValidator implements IStringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
        metaTagName = "zipcode";
    }

    export class RequiredValidator implements IStringValidator {
        isAcceptable(s: string, param?:number) {
            return s != undefined && s != "";
        }
        metaTagName = "required";
    }

    export class MinLengthValidator implements IStringValidator {
        isAcceptable(s: string) {
            return s.length >= this.MinLength;
        }
        public MinLength:number = 0;

        metaTagName = "minlength";
    }
    export class MaxLengthValidator implements IStringValidator {
        isAcceptable(s: string) {
            return s.length <= this.MaxLength;
        }
        public MaxLength:number = 0

        metaTagName = "maxlength";
    }
    export class RangeLengthValidator implements IStringValidator {
        isAcceptable(s: string) {
            return s.length >= this.MinLength && s.length <= this.MaxLength;
        }
        public RangeLength:Array<number> = [0,0];

        public get MinLength():number { return this.RangeLength[0]; }
        public get MaxLength():number { return this.RangeLength[1]; }

        metaTagName = "rangelength";
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

        metaTagName = "param";
    }
    /**
     * Return true for valid identification number of CZE company,otherwise return false.
     */
    export class ICOValidator implements IStringValidator {
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

        metaTagName = "ico";
    }


    /**
     * It represents the collection of validators - it is grouped by validator groups.
     *
     * @class validators
     * @constructor
     **/
    /*export class Validators {

        static NO_GROUP_NAME: string = "NoGroup";
        static ALL_GROUP_NAME: string = "All";


        validators: Array<IValidator> = [];
        groupValidators: IDictionary<string, Array<IValidator>> = new Dictionary<string, Array<IValidator>>();

        public Add(item: IValidator, key: string) {
            //pridam validator do obecne skupiny vsech validatoru
            this.validators.push(item);

            if (key == undefined || !_.isString(key) || key == "") {
                this.AddGroup(item, Validators.NO_GROUP_NAME);
                return;
            }

            var groups = key.split(",");

            for (var i = 0; i != groups.length; i++) {
                this.AddGroup(item, groups[i]);
            }
        }
        private AddGroup(item: IValidator, key: string) {

            //vytvorim skupinu validatoru
            if (!this.groupValidators.ContainsKey(key)) {
                this.groupValidators.Add(key, new Array());
            }

            //pridam validator do skupiny
            this.groupValidators.GetValue(key).push(item);

        }
        public ValidateAll(){
            this.Validate(Validators.ALL_GROUP_NAME);
        }
        public Validate(key: string): void {
            if (key == undefined) return;
            if (key == "") {
                //volam vsechny nezařazené validatory
                this.ValidateGroup(Validators.NO_GROUP_NAME);

            }
            else if (key == Validators.ALL_GROUP_NAME) {
                //volam vsechny validatory
                var validators = this.validators;
                for (var i = 0; i != validators.length; i++) {
                    validators[i].Validate();
                }
            }
            else {
                //volam vsechny nezařazené validatory
                this.ValidateGroup(Validators.NO_GROUP_NAME);

                //volam pouze validatory pro predane skupiny
                var groups = key.split(",");
                for (var i = 0; i != groups.length; i++) {
                    this.ValidateGroup(groups[i]);
                }
            }
        }
        private ValidateGroup(key: string): void {
            if (key == undefined || !_.isString(key) || key == "") return;
            if (!this.groupValidators.ContainsKey(key)) return;
            var validators = this.groupValidators.GetValue(key)
            for (var i = 0; i != validators.length; i++) {
                validators[i].Validate();
            }
        }

    }*/


    /**
     *  It represents a validation rule.
     */
    export class Validator extends ErrorInfo implements IValidator  {
        public Error: IError = new Error();

        constructor (public Name:string,private ValidateFce: IValidate) {
            super(Name);
        }
        public Optional:IOptional;
        public Validate(context:any) {
            this.ValidateFce.bind(context)(this.Error);
            return this.HasError;
        }

        public get HasError():boolean{
            return this.HasErrors;
        }


        public get HasErrors(): boolean {
            if (this.Optional != undefined && _.isFunction(this.Optional) && this.Optional()) return false;
            return this.Error.HasError;
        }

        public get ErrorCount(): number {
            return this.HasErrors ? 1 : 0;
        }
        public get ErrorMessage(): string {
            if (!this.HasErrors) return "";
            return this.Error.ErrorMessage;
        }
    }
}