import { firestore, logger } from 'firebase-functions';
export const test = firestore.document('/test/default').onWrite(() => {
    logger.log('test function triggered');
});
