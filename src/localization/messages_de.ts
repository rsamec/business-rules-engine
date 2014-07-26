///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../validation/rules.ts'/>

/**
 * Created by rsamec on 9.7.2014.
 */
module Validation {

    /*
     * Translated default messages for the validation engine.
     * Locale: DE (German, Deutsch)
     */
    _.extend(MessageLocalization.ValidationMessages, {
        required: "Dieses Feld ist ein Pflichtfeld.",
        maxlength: "Geben Sie bitte maximal {MaxLength} Zeichen ein.",
        minlength: "Geben Sie bitte mindestens {MinLength} Zeichen ein.",
        rangelength: "Geben Sie bitte mindestens {MinLength} und maximal {MaxLength} Zeichen ein.",
        email: "Geben Sie bitte eine gültige E-Mail Adresse ein.",
        url: "Geben Sie bitte eine gültige URL ein.",
        date: "Bitte geben Sie ein gültiges Datum ein.",
        number: "Geben Sie bitte eine Nummer ein.",
        digits: "Geben Sie bitte nur Ziffern ein.",
        equalTo: "Bitte denselben Wert wiederholen.",
        range: "Geben Sie bitte einen Wert zwischen {Min} und {Max} ein.",
        max: "Geben Sie bitte einen Wert kleiner oder gleich {Max} ein.",
        min: "Geben Sie bitte einen Wert größer oder gleich {Min} ein.",
        creditcard: "Geben Sie bitte eine gültige Kreditkarten-Nummer ein.",
        dateCompare: {
            LessThan: "Geben Sie bitte ein datum menší než {CompareTo}.",
            LessThanEqual: "Geben Sie bitte ein datum menší nebo rovné {CompareTo}.",
            Equal: "Geben Sie bitte ein datum {CompareTo}.",
            NotEqual: "Geben Sie bitte ein datum různé od {CompareTo}.",
            GreaterThanEqual: "Geben Sie bitte ein datum větší nebo rovné {CompareTo}.",
            GreaterThan: "Geben Sie bitte ein datum větší než {CompareTo}."
        }
    });
}
