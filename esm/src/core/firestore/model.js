export class DataModel {
    constructor({ schema, decoder, selectors = () => ({}), }) {
        Object.defineProperty(this, "schema", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "decoder", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "selectors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.schema = schema;
        this.decoder = decoder;
        this.selectors = selectors;
    }
}
export class FirestoreModel {
    constructor(schemaOptions) {
        Object.defineProperty(this, "schemaOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: schemaOptions
        });
    }
}
