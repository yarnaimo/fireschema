#!/bin/sh

FILE=node_modules/@firebase/rules-unit-testing/dist/index.cjs.js

sed -i.bak -e "s#var firebase = require('firebase');#var firebase = require('firebase/app');\nvar firebaseCompat = require('firebase/compat/app');\nrequire('firebase/compat/firestore');#" $FILE
sed -i.bak -e "s#^require('firebase/firestore');#var __firestore = require('firebase/firestore');#" $FILE
sed -i.bak -e "s#firebase__default\['default'\].initializeApp#firebaseCompat['default'].initializeApp#" $FILE
sed -i.bak -e "s#app._addOrOverwriteComponent(#firebase__default['default']._addOrOverwriteComponent(app, #" $FILE
sed -i.bak -e "s#app.firestore().useEmulator(#__firestore.connectFirestoreEmulator(__firestore.getFirestore(app), #" $FILE

rm $FILE.bak
