const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');

const FILE_ENCODING = 'utf8';

// Currently, we only support string, number, and date
function isEmpty(value) {
  const type = typeof value;

  if (value === null || value === undefined) {
    return true;
  }
  if (type === 'string') {
    return value.trim().length === 0;
  }
  
  return false;
}

class FileModel {
  // Meta
  #name;
  #schema;
  #filePath;

  // File content
  #nextId;
  #data;

  constructor(name, schema = {}) {
    this.#name = name;
    this.#schema = schema;
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

  get #defaultDocument() {
    const document = {};

    for (const [key, meta] of Object.entries(this.#schema)) {
      document[key] = typeof meta.default === 'function' ? meta.default() : meta.default;
    }
    
    return document;
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
    this.#data = data.map(this.#parseDocument.bind(this));
  }

  #parseDocument(unparsedDocument) {
    const document = {
      ...this.#defaultDocument,
      ...unparsedDocument,
    };

    // Convert each value to its proper type
    // E.g. date string converts back to Date object
    for (const [key, meta] of Object.entries(this.#schema)) {
      document[key] = meta.type(unparsedDocument[key]);
    }
    
    return document;
  }

  #validate(document) {
    // Validate each prop in the schema
    for (const [key, meta] of Object.entries(this.#schema)) {
      // Check if required
      if (meta.required && isEmpty(document[key])) {
        throw new Error(`${key} is required`);
      }
      // Check against custom validator
      if (meta.validate && !meta.validate.validator(document[key])) {
        throw new Error(meta.validate.message(document));
      }
    }
  }

  create(props) {
    // Create document
    const document = {
      ...this.#defaultDocument,
      ...props,
      id: this.#nextId,
    };
    
    // Validate
    this.#validate(document);

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
    
    // Apply changes and validate
    const updatedDocument = Object.assign(document, changes);
    this.#validate(updatedDocument);

    // Save to file
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
