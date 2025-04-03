const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');

const FILE_ENCODING = 'utf8';

class FileStorage {
  #name;
  #filePath;

  constructor(name) {
    this.#name = name;
    const pluralName = pluralize(name.toLowerCase());

    this.#filePath = path.resolve(__dirname, `../../data/${pluralName}.json`);
    this.#createFileIfMissing();
  }

  get #defaultFileData() {
    return {
      lastId: 0,
      records: [],
    };
  }

  #createFileIfMissing() {
    if (!fs.existsSync(this.#filePath)) {
      this.#write(this.#defaultFileData);
    }
  }

  #read() {
    const data = fs.readFileSync(this.#filePath, FILE_ENCODING);
    return JSON.parse(data);
  }

  #write(fileData) {
    fs.writeFileSync(this.#filePath, JSON.stringify(fileData, null, 2), FILE_ENCODING);
  }

  createRecord(recordData) {
    const fileData = this.#read();

    const record = {
      ...recordData,
      id: fileData.lastId + 1
    };
    fileData.lastId = record.id;
    fileData.records.push(record);

    this.#write(fileData);

    return record;
  }

  // TODO: There may be an inconsistency in what we return, since this data is from the file
  // but createRecord is the record date. Where should decoding happen?
  // Or, should I convert createRecord() to JSON?
  getAllRecords() {
    const fileData = this.#read();
    return fileData.records;
  }

  getRecordById(id) {
    return this.getAllRecords().find(record => record.id === id);
  }

  // TODO: Update record returns the non-decoded data, while create returns decoded data
  // since it was already decoded going in!
  updateRecordById(id, updatedRecordData) {
    const fileData = this.#read();

    const index = fileData.records.findIndex(record => record.id === id);
    if (index === -1) {
      throw new Error(`Unable to update ${this.#name} record with id = ${id}, because it could not be found.`);
    }

    fileData.records[index] = {
      ...fileData.records[index],
      ...updatedRecordData,
    };

    this.#write(fileData);

    return fileData.records[index];
  }

  deleteRecordById(id) {
    const fileData = this.#read();

    const index = fileData.records.findIndex(record => record.id === id);
    if (index === -1) {
      throw new Error(`Unable to delete ${this.#name} record with id = ${id}, because it could not be found.`);
    }

    const [deletedRecord] = fileData.records.splice(index, 1);
    this.#write(fileData);

    return deletedRecord;
  }
}

module.exports = FileStorage;
