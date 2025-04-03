const FileStorage = require('./FileStorage');
const SchemaValidator = require('./SchemaValidator');

const TYPE_DEFAULT = {
  [String]: '',
  [Number]: 0,
  [Date]: null,
};

class FileModel {
  #schema;
  #storage;
  #validator;

  constructor(name, schema) {
    this.#schema = schema;
    this.#storage = new FileStorage(name, schema);
    this.#validator = new SchemaValidator(schema);
  }

  create(props) {
    const propsWithDefaults = {...this.#defaultProps, ...props };
    this.#validator.validateCreate(propsWithDefaults);
    return this.#storage.createRecord(propsWithDefaults);
  }

  find() {
    return this.#storage.getAllRecords();
  }

  findById(id) {
    return this.#storage.getRecordById(id);
  }

  updateById(id, updatedProps) {
    this.#validator.validateUpdate(updatedProps);
    return this.#storage.updateRecordById(id, updatedProps);
  }

  deleteById(id) {
    return this.#storage.deleteRecordById(id);
  }

  get #defaultProps() {
    const defaultProps = {};

    for (const [key, meta] of Object.entries(this.#schema)) {
      const defaultValue = meta.default ?? TYPE_DEFAULT[meta.type];
      defaultProps[key] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }

    return defaultProps;
  }
}

module.exports = FileModel;
