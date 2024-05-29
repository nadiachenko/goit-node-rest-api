export const handleError = (error, data, next) => {
    error.status = 400;
    next()
}

export const preUpdate = function (next) {
    this.getOptions.new = true;
    this.getOptions.runValidators = true;
    next()
}