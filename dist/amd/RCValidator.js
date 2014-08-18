define(["require", "exports", "moment", "underscore.string"], function(require, exports, moment, _s) {
    var RCValidator = (function () {
        function RCValidator() {
            this.tagName = 'rc';
        }
        RCValidator.prototype.isAcceptable = function (s) {
            var old = false;
            var month;
            var year;
            var day;
            var numrc;
            var dbg = false;
            if (s === undefined)
                return false;
            if (s.toString().length === 0) {
                return false;
            }

            if (!s.match(/^\d{6}\/?\d{3,4}$/))
                return false;

            if (s.indexOf('/') != -1)
                old = s.length === 10;
            else
                old = s.length === 9;

            if (s.indexOf('/') !== -1) {
                numrc = s.split("/");
                numrc = numrc.join("");
            } else {
                numrc = s;
            }

            day = parseInt(numrc.substring(4, 6), 10);
            month = parseInt(numrc.substring(2, 4), 10);
            year = parseInt(numrc.substring(0, 2), 10);

            if (s.match(/\/?(0000?|8888?|9999?)$/)) {
                dbg = true;
            }

            if (!old && !dbg) {
                if (numrc % 11 !== 0 && s.substr(s.length - 1) === "0") {
                    if (parseInt(numrc.substr(0, 9), 10) % 11 !== 10)
                        return false;
                } else if (numrc % 11 !== 0)
                    return false;
            }

            if (year > 54 && old && !dbg)
                return false;

            if (!old && year < 54)
                year = 2000 + year;
            else
                year = 1900 + year;

            if (month > 50 && month < 63)
                month = month - 50;
            if (!old && year >= 2004) {
                if (month > 20 && month < 33)
                    month = month - 20;
                if (month > 70 && month < 83)
                    month = month - 70;
            }

            var datum = moment(_s.lpad(day.toString(), 2, '0') + "." + _s.lpad(month.toString(), 2, '0') + "." + year, "DD.MM.YYYY");

            if (!datum.isValid())
                return false;
            return datum.toDate() <= moment(Date.now()).toDate();
        };
        return RCValidator;
    })();

    
    return RCValidator;
});
