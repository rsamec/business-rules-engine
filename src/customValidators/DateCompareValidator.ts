///<reference path='../../typings/moment/moment.d.ts'/>
///<reference path='../validation/validators.ts'/>

import moment = require("moment");
import _ = require("underscore");

 /**
 * @ngdoc object
 * @name DateCompareValidator
 *
 * @requires moment
 * @requires underscore
 *
 * @description
 * DateCompareValidator enables to compare date to another date (CompareTo).
 *
 * @property {Date} CompareTo
 * The datetime against the compare is done.
 * If  property is not set, then comparison is done against actual datetime.
 *
 * @property {boolean} IgnoreDate
 * It forces to ignore time part of date by date compare.
 *
 *
 * @example
 * <pre>
 *
 *  //create validator
 *  var validator = new dateCompareValidator();
 *  validator.CompareTo = new Date(2000,2,2);
 *  validator.CompareOperator = Validation.CompareOperator.LessThanEqual;
 *
 *
 *  //less more than month -> return true
 *  var result = validator.isAcceptable(new Date(2000,1,1));
 *  //equal up to days -> return true
 *  var result = validator.isAcceptable(new Date(2000,2,2));
 *
 * </pre>
 *
 */

class DateCompareValidator implements Validation.IPropertyValidator{

    public isAcceptable(s:any){
        var isValid = false;

        //if date to compare is not specified - defaults to compare against now
        if (!_.isDate(s)) return false;

        if (this.CompareTo == undefined) Date.now();

        var now = moment(this.CompareTo);
        var then =  moment(s);

        var diffs:number = then.diff(now);
        if (this.IgnoreTime) diffs = moment.duration(diffs).days();

        if (diffs < 0) {
            isValid = this.CompareOperator == Validation.CompareOperator.LessThan
                || this.CompareOperator == Validation.CompareOperator.LessThanEqual
                || this.CompareOperator == Validation.CompareOperator.NotEqual;
        }
        else if (diffs > 0) {
            isValid = this.CompareOperator == Validation.CompareOperator.GreaterThan
                || this.CompareOperator == Validation.CompareOperator.GreaterThanEqual
                || this.CompareOperator == Validation.CompareOperator.NotEqual;
        }
        else {
            isValid = this.CompareOperator == Validation.CompareOperator.LessThanEqual
                || this.CompareOperator == Validation.CompareOperator.Equal
                || this.CompareOperator == Validation.CompareOperator.GreaterThanEqual;
        }
        return isValid;
    }

    /**
     * Set the time of compare between passed date and CompareTo date.
     */
    public CompareOperator:Validation.CompareOperator;

    /**
     * The datetime against the compare is done.
     * If CompareTo is not set, then comparison is done against actual datetime.
     */
    public CompareTo:Date;

    /**
     * It forces to ignore time part of date by date compare.
     * @type {boolean}
     */
    public IgnoreTime:boolean = false;

    tagName = 'dateCompare';

//    public getErrorMessage(localMessages:any) {
//        var msg = '';
//        var messages = localMessages[this.tagName];
//
//        var format:string = messages["Format"];
//        if (format != undefined) {
//            _.extend(this, {FormatedCompareTo: moment(this.CompareTo).format(format)})
//        }
//
//        switch (this.CompareOperator) {
//            case Validation.CompareOperator.LessThan:
//                msg = messages["LessThan"];
//                break;
//            case Validation.CompareOperator.LessThanEqual:
//                msg = messages["LessThanEqual"];
//                break;
//            case Validation.CompareOperator.Equal:
//                msg =  messages["Equal"];
//                break;
//            case Validation.CompareOperator.NotEqual:
//                msg =  messages["NotEqual"];
//                break;
//            case Validation.CompareOperator.GreaterThanEqual:
//                msg =  messages["GreaterThanEqual"];
//                break;
//            case Validation.CompareOperator.GreaterThan:
//                msg = messages["GreaterThan"];
//                break;
//        }
//        return DateCompareValidator.format(msg.replace('CompareTo','FormatedCompareTo'),this);
//    }
//    tagName = 'dateCompare';
//
//    static format(s: string, args: any): string {
//        var formatted = s;
//        for (var prop in args) {
//            var regexp = new RegExp('\\{' + prop + '\\}', 'gi');
//            formatted = formatted.replace(regexp, args[prop]);
//        }
//        return formatted;
//    }
}

export = DateCompareValidator;
