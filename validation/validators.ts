///<reference path='../typings/underscore/underscore.d.ts'/>

///<reference path='util.ts'/>
///<reference path='error.ts'/>
///<reference path='common.ts'/>
///<reference path='rules.ts'/>

module Validation {


    export interface StringValidator {
        isAcceptable(s: string,param?:any): boolean;
    }

    var lettersRegexp = /^[A-Za-z]+$/;
    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }

    var numberRegexp = /^[0-9]+$/;
    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }

    export class RequiredValidator implements StringValidator {
        isAcceptable(s: string, param:number) {
            return s != undefined && s != "";
        }
    }

    export class MinLengthValidator implements StringValidator {
        isAcceptable(s: string, param:number) {
            return s.length >= param;
        }
    }
    export class MaxLengthValidator implements StringValidator {
        isAcceptable(s: string, param:number) {
            return s.length <= param;
        }
    }
    export class RangeLengthValidator implements StringValidator {
        isAcceptable(s: string, param:Array<number>) {
            return s.length >= param[0] && s.length <=param[1];
        }
    }
    /**
     * Return true for valid identification number of CZE company,otherwise return false.
     */
    export class ICOValidator implements StringValidator {
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
    }



    export class CommonValidators
    {
        static messages = {
            required: "Toto pole je povinné.",
            remote: "Please fix this field.",
            email: "Prosím, zadejte platnou emailovou adresu.",
            url: "Prosím, zadejte validní url adresu.",
            date: "Prosím, zadejte platné datum.",
            dateISO: "Prosím, zadejte platné datum. (ISO).",
            number: "Prosím, zadejte platné číslo.",
            digits: "Prosím, zadejte platné přirozené číslo.",
            signedDigits: "Prosím, zadejte platné celé číslo.",
            creditcard: "Prosím, zadejte platné číslo karty.",
            equalTo: "Prosím, zadejte stejnou hodnotu znovu.",
            maxlength: "Prosím, zadejte méně než {0} znak(ů).",
            minlength: "Prosím, zadejte více než {0} znak(ů).",
            minlengthRokDiagnozy: "Prosím, zadejte rok ve správném formátu.",
            rangelength: "Prosím, zadejte hodnotu s délkou mezi {0} a {1} znaků.",
            range: "Prosím, zadejte hodnotu mezi {0} a {1}.",
            max: "Prosím, zadejte hodnotu menší nebo rovno {0}.",
            min: "Prosím, zadejte hodnotu větší nebo rovno {0}{1}.",
            minCurrency: "Prosím, zadejte hodnotu větší nebo rovno {0}{1}.",
            maxCurrency: "Prosím, zadejte hodnotu menší nebo rovno {0}{1}.",
            step: "Prosím, zadejte hodnotu dělitelnou {0}.",
            stepCurrency: "Prosím, zadejte hodnotu dělitelnou {0}{1}.",
            param: "Prosím, zadejte hodnotu z číselníku {0}.",
            mask: "Prosím, zadejte hodnotu ve tvaru {0}.",
            dateCompare: "{0}",
            dateCompareConst: "{0}",
            customFce: "{0}"
        };

        public Validators:{ [s: string]: StringValidator; } = {};
        constructor() {
            this.Validators["required"] = new RequiredValidator();
            this.Validators["minlength"] = new MinLengthValidator();
            this.Validators['maxlength'] = new MaxLengthValidator();
            this.Validators['zipCode'] = new ZipCodeValidator();
            this.Validators['lettersOnly'] = new LettersOnlyValidator();
            this.Validators['ico'] = new ICOValidator();
        }

        public CheckRule(rule:IRule):IError{
            var validator = this.Validators[rule.Method];
            var hasError = false;
            var errMsg = "";
            if (validator == undefined) {
                hasError = true;
                errMsg = "Validator for '"  + rule.Method +  "' not found.";
            }
            hasError = !validator.isAcceptable(rule.Context.Value, rule.Parameters);
            errMsg =  StringFce.format(CommonValidators.messages[rule.Method],_.isArray(rule.Parameters)? rule.Parameters: [rule.Parameters]);
            return { HasError: hasError, ErrorMessage: hasError ? errMsg: ""};
        }
    }

    /**
     * This class represents validator.
     */
    export interface IValidator extends IError {
        Validate(): boolean;
        Error: IError;
    }

    /**
     * It represents the collection of validators - it is grouped by validator groups.
     *
     * @class validators
     * @constructor
     **/
    export class Validators {

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

    }


    /**
     *  It represents a validation rule.
     */
    export class Validator implements IValidator {
        public Error: IError = new Error();

        constructor(private ValidateFce: IValidate) {

        }

        public Validate() {

            this.ValidateFce(this.Error);
            return this.HasError;
        }

        get HasErrors(): boolean {
            return this.Error.HasError;
        }

        get HasError(): boolean {
            return this.Error.HasError;
        }
        get ErrorMessage(): string {
            return this.Error.ErrorMessage;
        }
    }
}