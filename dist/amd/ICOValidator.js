define(["require", "exports"], function(require, exports) {
    var ICOValidator = (function () {
        function ICOValidator() {
            this.tagName = "ico";
        }
        ICOValidator.prototype.isAcceptable = function (input) {
            if (input === undefined)
                return false;
            if (input.length === 0)
                return false;

            if (!/^\d+$/.test(input))
                return false;

            var Sci = [];
            var Souc;
            var Del = input.length;
            var kon = parseInt(input.substring(Del, Del - 1), 10);

            Del = Del - 1;
            Souc = 0;
            for (var a = 0; a < Del; a++) {
                Sci[a] = parseInt(input.substr((Del - a) - 1, 1), 10);
                Sci[a] = Sci[a] * (a + 2);
                Souc = Souc + Sci[a];
            }

            if (Souc > 0) {
                var resul = Souc % 11;
                var mezi = Souc - resul;
                resul = mezi + 11;
                resul = resul - Souc;

                if ((resul === 10 && kon === 0) || (resul === 11 && kon === 1) || (resul === kon))
                    return true;
            }
            return false;
        };
        return ICOValidator;
    })();

    
    return ICOValidator;
});
