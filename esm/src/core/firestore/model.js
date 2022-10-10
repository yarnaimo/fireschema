export class DataModel {
    constructor({ schema, decoder, selectors = () => ({}), }) {
        this.schema = schema;
        this.decoder = decoder;
        this.selectors = selectors;
    }
}
export class FirestoreModel {
    constructor(schemaOptions) {
        this.schemaOptions = schemaOptions;
    }
}
