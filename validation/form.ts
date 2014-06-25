///<reference path='errorInfo.ts'/>
///<reference path='validators.ts'/>
///<reference path='util.ts'/>

module Validation {

    export interface IForm {
        Errors:IErrorInfo;
        Validators:Validators;

        Validate():void;
    }

    /**
     * YUIDoc_comment
     *
     * @class form
     * @constructor
     **/
    export class MetaForm implements IForm{

        public CLASS_NAME:string = 'form';

        public Errors:IErrorInfo = new CompositeErrorInfo("Main form");
        public Validators:Validators = new Validators();

        public MetaRules:MetaDataRules;


        constructor(public MetaData:any) {
            this.Data = {};
            Util.generateDataEx(this.MetaData,this.Data);

            this.MetaRules = new MetaDataRules(this.Data,this.MetaData);

            _.each(this.MetaRules.Rules, function(rule:MetaDataRule) {
                this.Errors.Add(rule.Error);
            },this);
        }

        public Data:any;

        public Validate():void
        {
            this.MetaRules.ValidateAll();
            this.Validators.ValidateAll();
        }
    }
}
//var _ = require('underscore');
//exports.Validation = Validation