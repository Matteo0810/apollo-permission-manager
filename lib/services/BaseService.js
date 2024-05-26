module.exports = class BaseService {

    static INSTANCE;
    static MODEL;

    MODEL_NAME = "roles";

    constructor() {
        this.INSTANCE = null;
        this.MODEL = null;
    }

    initModel() {
        throw new Error("This method needs to be override.");
    }

    setInstance(instance) {
        this.INSTANCE = instance;
    }

    async save(props) {
        this.initModel();
        if(!props)
            throw new Error("Props not found.");
    }

    async find(id, ressource) {
        this.initModel();
        if(!id || !ressource)
            throw new Error("Id or ressource not found.")
        if(!this.MODEL)
            throw new Error("No model defined");
    }

}