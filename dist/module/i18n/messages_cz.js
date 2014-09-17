var Localization = (function () {
    function Localization() {
    }
    Object.defineProperty(Localization, "ValidationMessages", {
        get: function () {
            return {
                required: "Tento údaj je povinný.",
                remote: "Prosím, opravte tento údaj.",
                email: "Prosím, zadejte platný e-mail.",
                url: "Prosím, zadejte platné URL.",
                date: "Prosím, zadejte platné datum.",
                dateISO: "Prosím, zadejte platné datum (ISO).",
                number: "Prosím, zadejte číslo.",
                digits: "Prosím, zadávejte pouze číslice.",
                creditcard: "Prosím, zadejte číslo kreditní karty.",
                equalTo: "Prosím, zadejte znovu stejnou hodnotu.",
                extension: "Prosím, zadejte soubor se správnou příponou.",
                maxlength: "Prosím, zadejte nejvíce {MaxLength} znaků.",
                minlength: "Prosím, zadejte nejméně {MinLength} znaků.",
                rangelength: "Prosím, zadejte od {MinLength} do {MaxLength} znaků.",
                range: "Prosím, zadejte hodnotu od {Min} do {Max}.",
                max: "Prosím, zadejte hodnotu menší nebo rovnu {Max}.",
                min: "Prosím, zadejte hodnotu větší nebo rovnu {Min}.",
                contains: "Prosím, zadejte hodnotu ze seznamu. Zadaná hodnota {AttemptedValue}.",
                dateCompare: {
                    Format: "DD.MM.YYYY",
                    LessThan: "Prosím, zadejte datum menší než {CompareTo}.",
                    LessThanEqual: "Prosím, zadejte datum menší nebo rovné {CompareTo}.",
                    Equal: "Prosím, zadejte {CompareTo}.",
                    NotEqual: "Prosím, zadejte datum různé od {CompareTo}.",
                    GreaterThanEqual: "Prosím, zadejte datum větší nebo rovné {CompareTo}.",
                    GreaterThan: "Prosím, zadejte datum větší než {CompareTo}."
                },
                minItems: "Prosím zadejte alespoň {Min} položek.",
                maxItems: "Prosím zadejte maximálně {Max} položek.",
                uniqItems: "Prosím zadejte pouze unikátní hodnoty.",
                enum: "Prosím zadajte povolenou hodnotu.",
                type: "Prosím zadejte hodnotu typu '{Type}'.",
                multipleOf: "Prosím zadejte hodnotu dělitelnou číslem '{Divider}'."
            };
        },
        enumerable: true,
        configurable: true
    });
    return Localization;
})();


