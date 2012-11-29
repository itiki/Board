define(function (require, exports) {
    return function ($) {
        $.validator.addMethod('dayrange', function (value, element, param) {
            if (!/^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/.test(value))
                return false;
            var dateValue = new Date(value.replace(/-/gi, '/'));
            var minDate = new Date(),
                maxDate = new Date();
            minDate.setDate(minDate.getDate() - parseInt(param[0]) - 1);
            maxDate.setDate(maxDate.getDate() + parseInt(param[1]));
            return dateValue >= minDate && dateValue <= maxDate;
        });
        $.validator.unobtrusive.adapters.addMinMax('dayrange', '', '', 'dayrange');
    }
});