export const firestorePathToLoc = (path) => path
    .split('/')
    .filter((_, i) => i % 2 === 0)
    .join('.');
export const createConverter = (decoder) => ({
    fromFirestore: (snap, options) => {
        const data = snap.data(options);
        const decodedData = decoder ? decoder(data, snap) : data;
        return {
            ...decodedData,
            id: snap.id,
        };
    },
    toFirestore: (data) => data,
});
