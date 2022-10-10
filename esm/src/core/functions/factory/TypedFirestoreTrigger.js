import { firestorePathToLoc } from '../../utils/_firestore.js';
import { getSchemaOptionsByLoc } from '../../utils/_object.js';
export class TypedFirestoreTrigger {
    constructor(firestoreSchema, firestoreStatic, functions) {
        this.firestoreSchema = firestoreSchema;
        this.firestoreStatic = firestoreStatic;
        this.functions = functions;
    }
    buildDecoder(path) {
        const loc = firestorePathToLoc(path);
        const collectionOptions = getSchemaOptionsByLoc(this.firestoreSchema, loc);
        const { decoder } = collectionOptions.model;
        return (snap) => {
            const data = snap.data();
            return decoder ? decoder(data, snap) : data;
        };
    }
    buildSnapDecoder(path) {
        const decode = this.buildDecoder(path);
        return (documentSnap) => documentSnap instanceof this.firestoreStatic.QueryDocumentSnapshot
            ? decode(documentSnap)
            : undefined;
    }
    onCreate({ builder, path, handler, }) {
        const decode = this.buildDecoder(path);
        return builder.firestore.document(path).onCreate(async (snap, context) => {
            const decodedData = decode(snap);
            return handler(decodedData, snap, context);
        });
    }
    onDelete({ builder, path, handler, }) {
        const decode = this.buildDecoder(path);
        return builder.firestore.document(path).onDelete(async (snap, context) => {
            const decodedData = decode(snap);
            return handler(decodedData, snap, context);
        });
    }
    onUpdate({ builder, path, handler, }) {
        const decode = this.buildDecoder(path);
        return builder.firestore
            .document(path)
            .onUpdate(async (change, context) => {
            const decodedData = new this.functions.Change(decode(change.before), decode(change.after));
            return handler(decodedData, change, context);
        });
    }
    onWrite({ builder, path, handler, }) {
        const decode = this.buildSnapDecoder(path);
        return builder.firestore.document(path).onWrite(async (change, context) => {
            const decodedData = new this.functions.Change(decode(change.before), decode(change.after));
            return handler(decodedData, change, context);
        });
    }
}
