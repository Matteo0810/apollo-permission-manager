module.exports = class Service {

    _instance;

    constructor(instance) {
        this._instance = instance;
    }

    async find(query) {
        throw new Error("This method needs to be override.");
    }

}