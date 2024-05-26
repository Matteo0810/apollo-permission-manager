const BaseService = require("./BaseService");
const {Schema} = require("mongoose");
const {GraphQLError} = require("graphql/error");

module.exports = class Mongoose extends BaseService {

    constructor() {
        super();
    }

    initModel() {
        if(this.MODEL)
            return;
        this.MODEL = this.INSTANCE.model(this.MODEL_NAME, new Schema({
            id: {type: Object, required: true},
            ressource: {
                name: {type: String, required: true},
                id: {type: String, required: true}
            },
            roles: [{type: String, required: true}]
        }));
    }

    async save(props) {
        await super.save(props);
        const role = await this.MODEL.findOne({ id: props.id, ressource: props.ressource })
            .then(r => r ?? new this.MODEL());
        role.set(props);
        try {
            role.save();
            return true;
        } catch(e) {
            throw new GraphQLError("Unexpected error: " + e, {
                extensions: { code: "INTERNAL_SERVER_ERROR", error: e }
            });
        }
    }

    async find(id, ressource) {
        await super.find(id, ressource);
        return this.MODEL.find({
            id,
            "ressource.name": ressource.name,
            $or: [
                { "ressource.id": ressource.id },
                { "ressource.id": { $regex: ".*" } }
            ]
        }).lean();
    }

}