import Dexie from 'dexie'
// import indexedDB from 'fake-indexeddb';
var indexedDB = require('fake-indexeddb')
// var IDBKeyRange = require("fake-indexeddb/lib/FDBKeyRange");

Dexie.dependencies.indexedDB = indexedDB
