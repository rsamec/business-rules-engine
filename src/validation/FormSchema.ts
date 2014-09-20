///<reference path='../../typings/q/Q.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/business-rules-engine/business-rules-engine.d.ts'/>

import _ = require('underscore');
import Q = require('q');

var Validation = require("business-rules-engine");
var Validators = require('business-rules-engine/commonjs/BasicValidators');

//var Validation = require('../validation/Validation.js');
//var Validators = require('../validation/BasicValidators.js');

module FormSchema {

    /**
     * It represents factory that creates an concrete validation rule.
     */
    export interface IValidationRuleFactory{
        /**
         * Create an abstract validation rule
         * @param name - the name of rule
         */
        CreateRule(name:string);
    }

    /**
     * It represents the JSON schema factory for creating validation rules based on JSON form schema.
     * It uses constraints keywords from JSON Schema Validation specification.
     */
    export class JsonSchemaRuleFactory implements IValidationRuleFactory{

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
         * Returns an concrete validation rules structured according to JSON schema.
         */
        private ParseAbstractRule(formSchema:any):Validation.IAbstractValidator<any> {

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
        private ParseValidationAttribute(item:any):Array<Validation.IPropertyValidator> {

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
            //7.3.2 email
            validation = item["email"];
            if (validation !== undefined) {
                validators.push(new Validators.EmailValidator())
            }

            //7.3.6 url
            validation = item["uri"];
            if (validation !== undefined) {
                validators.push(new Validators.UrlValidator())
            }

            //TODO: allOf,anyOf,oneOf,not,definitions

            return validators;
        }
    }

    /**
     * It represents the JSON schema factory for creating validation rules based on raw JSON data annotated by validation rules.
     * It uses constraints keywords from JQuery validation plugin.
     */
    export class JQueryValidationRuleFactory implements IValidationRuleFactory  {

       static RULES_KEY = "rules";
       static DEFAULT_KEY = "default";

        /**
         * Default constructor
         * @param metaData -  raw JSON data annotated by validation rules
         */
        constructor(private metaData:any){
        }

        /**
         * Return an concrete validation rule by traversing raw JSON data annotated by validation rules.
         * @param name validation rule name
         * @returns {IAbstractValidationRule<any>} return validation rule
         */
        public CreateRule(name:string):Validation.IAbstractValidationRule<any>{
            return this.ParseAbstractRule(this.metaData).CreateRule(name);
        }

        /**
         * Returns an concrete validation rule structured according to JSON schema.
         */
        private ParseAbstractRule(metaData:any):Validation.IAbstractValidator<any> {

            var rule = new Validation.AbstractValidator<any>();

            for (var key in metaData) {
                var item = metaData[key];
                var rules = item[JQueryValidationRuleFactory.RULES_KEY];

                if ( _.isArray(item)) {
                    if (item[1] !== undefined) {
                        _.each(this.ParseValidationAttribute(item[1]), function (validator) {
                            rule.RuleFor(key, validator)
                        });
                    }
                    rule.ValidatorFor(key, this.ParseAbstractRule(item[0]), true);
                }
                else if (rules !== undefined) {
                    _.each(this.ParseValidationAttribute(rules),function(validator){ rule.RuleFor(key,validator)})
                }
                else {
                    rule.ValidatorFor(key, this.ParseAbstractRule(item));
                }
            }
            return rule;
        }

        /**
         * Return list of property validators that corresponds json items for JQuery validation pluging tags.
         * See specification - http://jqueryvalidation.org/documentation/
         */
        private ParseValidationAttribute(item:any):Array<Validation.IPropertyValidator> {

           var validators = new Array<Validation.IPropertyValidator>();
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

            // enum validation
            validation = item["enum"];
            if (validation !== undefined) {
                validators.push(new Validators.EnumValidator(validation))
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
