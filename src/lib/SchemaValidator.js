const SUPPORTED_TYPES = [String, Number, Date];

class SchemaValidator {
  #schema;

  constructor(schema) {
    this.#schema = schema;
    this.#validateSchema();
  }

  validateProp(key, value) {
    const meta = this.#schema[key];
    const type = meta.type;

    // Validate type
    if (value !== null) {
      ({
        [String]: this.#typecheckString,
        [Number]: this.#typecheckNumber,
        [Date]: this.#typecheckDate,
      })[type](key, value);
    }

    // Validate required
    if (meta.required) {
      ({
        [String]: this.#requireString,
        [Number]: this.#requireNumber,
        [Date]: this.#requireDate,
      })[type](key, value);
    }

    this.#validateCustom(key, value);
  }

  validateCreate(props) {
    this.#validatePropsInput(props);

    // Validate every prop in the schema
    for (const key of Object.keys(this.#schema)) {
      this.validateProp(key, props[key]);
    }
  }

  validateUpdate(updatedProps) {
    this.#validatePropsInput(updatedProps);

    // Validate only updated props
    for (const [key, value] of Object.entries(updatedProps)) {
      this.validateProp(key, value);
    }
  }

  #validateSchema() {
    // Fail if we find an unsupported type
    for (const [key, meta] of Object.entries(this.#schema)) {
      if (!SUPPORTED_TYPES.includes(meta.type)) {
        throw new Error(`Unsupported type: ${key} is a ${type}, which is not supported.`);
      }
    }
  }

  #validatePropsInput(propsOrUpdates) {
    // Reject non-objects
    if (typeof propsOrUpdates !== 'object' || propsOrUpdates === null || Array.isArray(propsOrUpdates)) {
      throw new Error('Invalid input: props or updates must be a non-null object (not an array).');
    }
  }

  #typecheckString(key, value) {
    if (typeof value !== 'string' && !(value instanceof String)) {
      throw new Error(`Invalid type: ${key} must be a String.`);
    }
  }

  #typecheckNumber(key, value) {
    if (typeof value !== 'number' && !(value instanceof Number)) {
      throw new Error(`Invalid type: ${key} must be a Number.`);
    }
  }

  #typecheckDate(key, value) {
    if (!(value instanceof Date) ) {
      throw new Error(`Invalid type: ${key} must be a Date.`);
    }
  }

  #requireString(key, value) {
    if (!value || value.trim() === '') {
      throw new Error(`Required: ${key} must be a non-empty String.`);
    }
  }

  #requireNumber(key, value) {
    if (!Number.isFinite(value)) {
      throw new Error(`Required: ${key} must be a finite Number.`);
    }
  }

  #requireDate(key, value) {
    if (!value || isNaN(value)) {
      throw new Error(`Required: ${key} must be a valid Date.`);
    }
  }

  #validateCustom(key, value) {
    const { validate } = this.#schema[key];

    if (typeof validate?.validator === 'function' && !validate.validator(value)) {
      throw new Error(`Custom validation (${key}): ${validate.message}`);
    }
  }
}

module.exports = SchemaValidator;
