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
     * It represents utility for JSON schema form manipulation.
     */
    export class Util {

        static TYPE_KEY = "type";
        static PROPERTIES_KEY = "properties";
        static DEFAULT_KEY = "default";
        static ARRAY_KEY = "items";

        /**
         * Returns the initial JSON data structured according to JSON schema.
         */
        static GetFormValues(formSchema:any, data:any) {
            var data = data || {};


            for (var key in formSchema) {
                var item = formSchema[key];
                var type = item[Util.TYPE_KEY];
                if (type === "object") {
                    data[key] = {};
                    Util.GetFormValues(item[Util.PROPERTIES_KEY], data[key]);
                }
                else if (type === "array") {
                    data[key] = [];
                    continue;
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
                    continue;

                }
            }
            return data;
        }


        /**
         * Returns the abstract validation rules structured according to JSON schema.
         */
        static GetAbstractRule(formSchema:any,rule?:Validation.IAbstractValidator<any>){

            rule = rule || new Validation.AbstractValidator<any>();


            for (var key in formSchema) {
                var item = formSchema[key];
                var type = item[Util.TYPE_KEY];
                if (type === "object") {
                    rule.ValidatorFor(key,Util.GetAbstractRule(item[Util.PROPERTIES_KEY]));
                    continue;
                }
                else if (type === "array") {
                    // min items validation
                    var itemValidation = item["minItems"];
                    if (itemValidation !== undefined ) {
                        rule.RuleFor(key,new Validators.MinItemsValidator(itemValidation))
                    }

                    // max items validation
                    itemValidation = item["maxItems"];
                    if (itemValidation !== undefined ) {
                        rule.RuleFor(key,new Validators.MaxItemsValidator(itemValidation))
                    }

                    rule.ValidatorFor(key,Util.GetAbstractRule(item[Util.ARRAY_KEY][Util.PROPERTIES_KEY]),true);
                    continue;
                }
                else {
                    // required validation
                    var validation = item["required"];
                    if (validation !== undefined  && validation) {
                        rule.RuleFor(key,new Validators.RequiredValidator())
                    }
                    // maxLength validation
                    validation = item["maxLength"];
                    if (validation !== undefined) {
                        rule.RuleFor(key,new Validators.MaxLengthValidator(validation))
                    }
                    // enum validation
                    validation = item["enum"];
                    if (validation !== undefined) {
                        rule.RuleFor(key,new Validators.EnumValidator(validation))
                    }

                    // pattern validation
                    validation = item["pattern"];
                    if (validation !== undefined) {
                        rule.RuleFor(key,new Validators.PatternValidator(validation))
                    }

                    continue;
                }
            }
            return rule;
        }
    }
}
export = FormSchema
