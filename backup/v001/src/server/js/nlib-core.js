class nlib { };

nlib.NResult = class {
    constructor() {
        this.data = {};
        this.errors = {};
        this.errors.hasError = false;
        this.errors.exception = null;
        this.errors.errMsg = null;
    };

    error(errorNumber, errorMessage, exception) {
        this.errors.hasError = true;
        this.errors.errMsg = (errorNumber) ? errorNumber : -1;
        this.errors.errMsg = (errorMessage) ? errorMessage : '';
        this.errors.exception = (exception && exception.message) ? exception.message : exception;
    };

    result(data) {
        this.data = data;
        this.errors.hasError = false;
        this.errors.exception = null;
        this.errors.errNum = 0;
        this.errors.errMsg = '';
    };
};

exports.NResult = nlib.NResult;