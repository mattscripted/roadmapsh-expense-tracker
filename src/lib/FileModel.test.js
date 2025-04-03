const SchemaValidator = require('./SchemaValidator');
const FileStorage = require('./FileStorage');
const FileModel = require('./FileModel');

jest.mock('./FileStorage');
jest.mock('./SchemaValidator');

describe('FileModel', () => {
  describe('#create', () => {
    const mockValidateCreate = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();

      SchemaValidator.mockImplementation(() => ({
        validateCreate: mockValidateCreate,
      }));

      FileStorage.mockImplementation(() => ({
        createRecord: (recordData) => ({
          ...recordData,
          id: 1,
        }),
      }));
    });

    it('applies defaults for all missing fields, validates, and returns created records', () => {
      const Model = new FileModel('model', {
        name: {
          type: String,
        },
        amount: {
          type: Number,
        },
        date: {
          type: Date,
        },
      });

      const expectedPropsWithDefaults = {
        name: '',
        amount: 0,
        date: null,
      };
      const expectedRecord = {
        ...expectedPropsWithDefaults,
        id: 1,
      };

      expect(Model.create({})).toEqual(expectedRecord);
      expect(mockValidateCreate).toHaveBeenCalledWith(expectedPropsWithDefaults);
    });

    it('applies custom defaults values for all missing fields, validates, and returns created record', () => {
      const now = new Date();
      const Model = new FileModel('model', {
        name: {
          type: String,
          default: 'name',
        },
        amount: {
          type: Number,
          default: 1,
        },
        date: {
          type: Date,
          default: now,
        },
      });

      const expectedPropsWithDefaults = {
        name: 'name',
        amount: 1,
        date: now,
      };
      const expectedRecord = {
        ...expectedPropsWithDefaults,
        id: 1,
      };

      expect(Model.create({})).toEqual(expectedRecord);
      expect(mockValidateCreate).toHaveBeenCalledWith(expectedPropsWithDefaults);
    });

    it('applies custom defaults functions for all missing fields, validates, and returns created record', () => {
      const now = new Date();
      const Model = new FileModel('model', {
        name: {
          type: String,
          default: () => 'name',
        },
        amount: {
          type: Number,
          default: () => 1,
        },
        date: {
          type: Date,
          default: () => now,
        },
      });

      const expectedPropsWithDefaults = {
        name: 'name',
        amount: 1,
        date: now,
      };
      const expectedRecord = {
        ...expectedPropsWithDefaults,
        id: 1,
      };

      expect(Model.create({})).toEqual(expectedRecord);
      expect(mockValidateCreate).toHaveBeenCalledWith(expectedPropsWithDefaults);
    });

    it('does not overwrite existing values', () => {
      const Model = new FileModel('model', {
        name: {
          type: String,
        },
        amount: {
          type: Number,
        },
        date: {
          type: Date,
        },
      });

      const props = {
        name: 'name',
        amount: 1,
        date: new Date(),
      };
      const expectedPropsWithDefaults = { ...props };
      const expectedRecord = {
        ...expectedPropsWithDefaults,
        id: 1,
      };

      expect(Model.create(props)).toEqual(expectedRecord);
      expect(mockValidateCreate).toHaveBeenCalledWith(expectedPropsWithDefaults);
    });
  });
});
