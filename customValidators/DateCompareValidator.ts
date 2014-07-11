///<reference path='../typings/moment/moment.d.ts'/>
///<reference path='../validation/validators.ts'/>

import moment = require("moment");
import _ = require("underscore");

/**
 * @ngdoc object
 * @name DateCompareValidator
 *
 * @description
 * DateCompareValidator enables to compare date to another date.</br>
 * If CompareTo is not set, then comparison is done against actual datetime.
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
 **/
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

    static customMessage(operator: Validation.CompareOperator, datum:Date) {
        var msg = ""
        var isToday = datum == undefined;
        switch (operator) {
            case Validation.CompareOperator.LessThan:
                return isToday ? "Prosím, zadejte datum menší než aktuální datum." : "Prosím, zadejte datum menší než " + datum + ".";
                break;
            case Validation.CompareOperator.LessThanEqual:
                return isToday ? "Prosím, zadejte datum menší nebo rovné aktuálnímu datu." : "Prosím, zadejte datum menší nebo rovné " + datum + ".";
                //msg = "nesmí být větší než";
                break;
            case Validation.CompareOperator.Equal:
                return isToday ? "Prosím, zadejte aktuální datum." : "Prosím, zadejte " + datum + "."
                //msg = "musí být stejné jako";
                break;
            case Validation.CompareOperator.NotEqual:
                return isToday ? "Prosím, zadejte datum různé od aktuálního data" : "Prosím, zadejte datum různé od " + datum + "."
                break;
            case Validation.CompareOperator.GreaterThanEqual:
                return isToday ? "Prosím, zadejte datum větší nebo rovné aktuálnímu datu." : "Prosím, zadejte datum větší nebo rovné " + datum + ".";
                // msg = "nesmí být menší než";
                break;
            case Validation.CompareOperator.GreaterThan:
                return isToday ? "Prosím, zadejte datum větší než aktuální datum." : "Prosím, zadejte datum větší než  " + datum + ".";
                //msg = "musí být větší než";
                break;
            default:
                msg = "???";
                break;
        }
        return "Zadané datum " +  msg + " aktuální datum.";

    }
    tagName = 'dateCompare';
}


export = DateCompareValidator;
