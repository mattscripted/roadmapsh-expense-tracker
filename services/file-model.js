const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');

const FILE_ENCODING = 'utf8';

class FileModel {
  // Meta
  #name;
  #defaultDocument;
  #filePath;

  // File content
  #nextId;
  #data;

  constructor(name, defaultDocument = {}) {
    this.#name = name;
    this.#defaultDocument  = defaultDocument;
    this.#filePath = path.join(global.ROOT_DIR, `${pluralize(this.#name.toLowerCase())}.json`);

    this.#readOrCreateJsonFile();
  }

  get #defaultFileContent() {
    return {
      nextId: 1,
      data: [],
    };
  }

  get #fileContent() {
    return {
      nextId: this.#nextId,
      data: this.#data,
    };
  }

  #writeJsonFile(fileContent = this.#fileContent) {
    fs.writeFileSync(this.#filePath, JSON.stringify(fileContent), FILE_ENCODING);
  }
  
  #readOrCreateJsonFile() {
    // Create file with default content, if the file does not yet exist
    if (!fs.existsSync(this.#filePath)) {
      this.#writeJsonFile(this.#defaultFileContent);
    }
  
    // Otherwise, read the file, and update content
    const content = fs.readFileSync(this.#filePath, FILE_ENCODING);
    const { nextId, data } = JSON.parse(content);
    this.#nextId = nextId;
    this.#data = data;
  }

  create(props) {
    // Create document
    const document = {
      ...this.#defaultDocument,
      ...props,
      id: this.#nextId,
    };

    // Push document, auto-increment id, and save
    this.#data.push(document);
    this.#nextId++;
    this.#writeJsonFile();

    return document;
  }

  find() {
    return this.#data;
  }

  findById(id) {
    // Find document, if it exists
    const document = this.#data.find(document => document.id == id);
    if (!document) {
      throw new Error(`${this.#name} document not found (id: ${id})`)
    }

    return document;
  }

  updateById(id, changes) {
    // Find document, if it exists
    const document = this.#data.find(document => document.id == id);
    if (!document) {
      throw new Error(`${this.#name} document not found (id: ${id})`)
    }

    // Apply changes
    const updatedDocument = Object.assign(document, changes);
    this.#writeJsonFile();

    return updatedDocument;
  }

  deleteById(id) {
     // Find document index, if it exists, so we know where to delete
     const dataIndex = this.#data.findIndex(document => document.id == id);
     if (dataIndex === -1) {
       throw new Error(`${this.#name} document not found (id: ${id})`)
     }

     // Remove document by index in data array
     this.#data.splice(dataIndex, 1);
     this.#writeJsonFile();
  }
}

module.exports = FileModel;
