///<reference path='../../typings/q/Q.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/business-rules-engine/business-rules-engine.d.ts'/>

import _ = require('underscore');
import Q = require('q');

//var Validation = require("business-rules-engine");
//var Validators = require('business-rules-engine/commonjs/BasicValidators');

var Validation = require('../validation/Validation.js');
var Validators = require('../validation/BasicValidators.js');

module FormSchema {

    /**
     * It represents the JSON schema factory for creating validation rules based on JSON form schema.
     */
    export class JsonSchemaAbstractValidationRuleFactory  {

        /**
         * Default constructor
         * @param jsonSchema JSON schema for business rules.
         */
        constructor(private jsonSchema:any){
        }

        /**
         * Return concrete validation rule structured according to JSON schema.
         * @param name validation rule name
         * @returns {IAbstractValidationRule<any>} return validation rule
         */
        public CreateRule(name:string):Validation.IAbstractValidationRule<any>{
            return this.ParseAbstractRule(this.jsonSchema).CreateRule(name);
        }


        /**
         * Returns the abstract validation rules structured according to JSON schema.
         */
        ParseAbstractRule(formSchema:any):Validation.IAbstractValidator<any> {

            var rule = new Validation.AbstractValidator<any>();

            for (var key in formSchema) {
                var item = formSchema[key];
                var type = item[Util.TYPE_KEY];
                if (type === "object") {
                    rule.ValidatorFor(key, this.ParseAbstractRule(item[Util.PROPERTIES_KEY]));
                }
                else if (type === "array") {
                    _.each(this.ParseValidationAttribute(item),function(validator){ rule.RuleFor(key,validator)});
                    rule.ValidatorFor(key, this.ParseAbstractRule(item[Util.ARRAY_KEY][Util.PROPERTIES_KEY]), true);
                }
                else {
                    _.each(this.ParseValidationAttribute(item),function(validator){ rule.RuleFor(key,validator)});
                }
            }
            return rule;
        }
        /**
         * Return list of property validators that corresponds json items for JSON form validation tags.
         * See keywords specifications -> http://json-schema.org/latest/json-schema-validation.html
         */
        ParseValidationAttribute(item:any):Array<Validation.IPropertyValidator> {

            var validators = new Array<Validation.IPropertyValidator>();
            if (item === undefined) return validators;

            //5.  Validation keywords sorted by instance types
            //http://json-schema.org/latest/json-schema-validation.html

            //5.1. - Validation keywords for numeric instances (number and integer)
            // multipleOf validation
            validation = item["multipleOf"];
            if (validation !== undefined) {
                validators.push(new Validators.MultipleOfValidator(validation));
            }

            // maximum validation
            validation = item["maximum"];
            if (validation !== undefined) {
                validators.push(new Validators.MaxValidator(validation,item["exclusiveMaximum"]));
            }

            // minimum validation
            validation = item["minimum"];
            if (validation !== undefined) {
                validators.push(new Validators.MinValidator(validation,item["exclusiveMinimum"]));
            }

            //5.2. - Validation keywords for strings

            // maxLength validation
            validation = item["maxLength"];
            if (validation !== undefined) {
                validators.push(new Validators.MaxLengthValidator(validation));
            }

            // minLength validation
            validation = item["minLength"];
            if (validation !== undefined) {
                validators.push(new Validators.MinLengthValidator(validation));
            }
            // pattern validation
            validation = item["pattern"];
            if (validation !== undefined) {
                validators.push(new Validators.PatternValidator(validation));
            }


            //5.3.  Validation keywords for arrays
            //TODO: additionalItems and items

            // min items validation
            validation= item["minItems"];
            if (validation !== undefined) {
                validators.push( new Validators.MinItemsValidator(validation))
            }

            // max items validation
            validation = item["maxItems"];
            if (validation !== undefined) {
                validators.push( new Validators.MaxItemsValidator(validation))
            }

            // uniqueItems validation
            validation = item["uniqueItems"];
            if (validation !== undefined) {
                validators.push( new Validators.UniqItemsValidator(validation))
            }

            //5.4.  Validation keywords for objects
            //TODO: maxProperties, minProperties, additionalProperties, properties and patternProperties, dependencies

            // required validation
            var validation = item["required"];
            if (validation !== undefined && validation) {
                validators.push(new Validators.RequiredValidator());
            }

            //5.5.  Validation keywords for any instance type
            // enum validation
            validation = item["enum"];
            if (validation !== undefined) {
                validators.push(new Validators.EnumValidator(validation))
            }

            // type validation
            var validation = item["type"];
            if (validation !== undefined) {
                validators.push(new Validators.TypeValidator(validation));
            }

            //TODO: allOf,anyOf,oneOf,not,definitions

            return validators;
        }
    }

    /**
     * It represents the JSON schema factory for creating validation rules based on JSON form schema.
     */
    export class JQueryValidationAbstractValidationRuleFactory extends JsonSchemaAbstractValidationRuleFactory  {

        /**
         * Return list of property validators that corresponds json items for JQuery validation pluging tags.
         * See specification - http://jqueryvalidation.org/documentation/
         */
        ParseValidationAttribute(itemEl:any):Array<Validation.IPropertyValidator> {

//            http://jqueryvalidation.org/documentation/
//               required – Makes the element required.
//               remote – Requests a resource to check the element for validity.
//                minlength – Makes the element require a given minimum length.
//                maxlength – Makes the element require a given maxmimum length.
//                rangelength – Makes the element require a given value range.
//                min – Makes the element require a given minimum.
//                max – Makes the element require a given maximum.
//                range – Makes the element require a given value range.
//                email – Makes the element require a valid email
//                url – Makes the element require a valid url
//                date – Makes the element require a date.
//                dateISO – Makes the element require an ISO date.
//                number – Makes the element require a decimal number.
//                digits – Makes the element require digits only.
//                creditcard – Makes the element require a credit card number.
//                equalTo – Requires the element to be the same as another one


           var validators = new Array<Validation.IPropertyValidator>();
           if (itemEl === undefined) return validators;

           var item = itemEl.rules;

           if (item === undefined) return validators;

           var validation = item["required"];
           if (validation !== undefined && validation) {
               validators.push(new Validators.RequiredValidator());
           }

            var validation = item["remote"];
            if (validation !== undefined && validation) {
                validators.push(new Validators.RemoteValidator(validation));
            }

           // maxLength validation
           validation = item["maxlength"];
           if (validation !== undefined) {
               validators.push(new Validators.MaxLengthValidator(validation))
           }

           // minLength validation
           validation = item["minlength"];
           if (validation !== undefined) {
               validators.push(new Validators.MinLengthValidator(validation))
           }

            // rangelength validation
            validation = item["rangelength"];
            if (validation !== undefined) {
                validators.push(new Validators.RangeLengthValidator(validation))
            }

            // maximum validation
            validation = item["max"];
            if (validation !== undefined) {
                validators.push(new Validators.MaxValidator(validation));
            }

            // minimum validation
            validation = item["min"];
            if (validation !== undefined) {
                validators.push(new Validators.MinValidator(validation));
            }

            // range validation
            validation = item["range"];
            if (validation !== undefined) {
                validators.push(new Validators.RangeValidator(validation));
            }

           validation = item["email"];
           if (validation !== undefined) {
               validators.push(new Validators.EmailValidator())
           }

            validation = item["url"];
            if (validation !== undefined) {
                validators.push(new Validators.UrlValidator())
            }

            validation = item["date"];
            if (validation !== undefined) {
                validators.push(new Validators.DateValidator())
            }

            validation = item["dateISO"];
            if (validation !== undefined) {
                validators.push(new Validators.DateISOValidator())
            }

            validation = item["number"];
            if (validation !== undefined) {
                validators.push(new Validators.NumberValidator())
            }


            validation = item["digits"];
            if (validation !== undefined) {
                validators.push(new Validators.DigitValidator())
            }

            validation = item["creditcard"];
            if (validation !== undefined) {
                validators.push(new Validators.CreditCardValidator())
            }

            validation = item["equalTo"];
            if (validation !== undefined) {
                validators.push(new Validators.EqualToValidator(validation))
            }

//           // pattern validation
//           validation = item["pattern"];
//           if (validation !== undefined) {
//               validators.push(new Validators.PatternValidator(validation))
//           }

           return validators;
       }
    }
    /**
     * It represents utility for JSON schema form manipulation.
     */
    export class Util {

        static TYPE_KEY = "type";
        static PROPERTIES_KEY = "properties";
        static DEFAULT_KEY = "default";
        static ARRAY_KEY = "items";

        /**
         * Returns the initial JSON data structured according to JSON schema.
         * The data are initilizied with default values.
         */
        static InitValues(formSchema:any, data?:any) {
            var data = data || {};

            for (var key in formSchema) {
                var item = formSchema[key];
                var type = item[Util.TYPE_KEY];
                if (type === "object") {
                    data[key] = {};
                    Util.InitValues(item[Util.PROPERTIES_KEY], data[key]);
                }
                else if (type === "array") {
                    data[key] = [];
                }
                else {
                    var defaultValue = item[Util.DEFAULT_KEY];
                    if (defaultValue === undefined) continue;

                    // Type casting
                    if (type === 'boolean') {
                        if (defaultValue === '0') {
                            defaultValue = false;
                        } else {
                            defaultValue = !!defaultValue;
                        }
                    }
                    if ((type === 'number') ||
                        (type === 'integer')) {
                        if (_.isString(defaultValue)) {
                            if (!defaultValue.length) {
                                defaultValue = null;
                            } else if (!isNaN(Number(defaultValue))) {
                                defaultValue = Number(defaultValue);
                            }
                        }
                    }
                    if ((type === 'string') &&
                        (defaultValue === '')) {
                        defaultValue = null;
                    }

                    //TODO: default value
                    data[key] = defaultValue;

                }
            }
            return data;
        }
    }
}
export = FormSchema
