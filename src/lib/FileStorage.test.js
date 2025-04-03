const fs = require('fs');
const path = require('path');
const FileStorage = require('./FileStorage');

const FILE_ENCODING = 'utf8';

jest.mock('fs');

function encodeFileData(fileData) {
  return JSON.stringify(fileData, null, 2)
}

describe('FileStorage', () => {
  const mockName = 'test';
  const mockSchema = {
    description: {
      type: String,
    },
    amount: {
      type: Number,
    },
    date: {
      type: Date,
    },
  };
  const mockFilePath = path.resolve(__dirname, `../../data/tests.json`);
  const mockRecordData1 = {
    description: 'Lunch',
    amount: 15,
    date: new Date('2025-04-03T00:00:00.000Z')
  };
  const mockRecordData2 = {
    description: 'Dinner',
    amount: 30,
    date: new Date('2025-04-04T00:00:00.000Z')
  };
  const mockRecord1 = { ...mockRecordData1, id: 1 };
  const mockRecord2 = { ...mockRecordData2, id: 2 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#constructor', () => {
    it('creates the file if it does not exist', () => {
      fs.existsSync.mockReturnValue(false);
      const fileData = {
        lastId: 0,
        records: [],
      };

      new FileStorage(mockName, mockSchema);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        mockFilePath,
        encodeFileData(fileData),
        FILE_ENCODING
      );
    });

    it('does not create the file if it exists', () => {
      fs.existsSync.mockReturnValue(true);

      new FileStorage(mockName, mockSchema);

      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('#createRecord', () => {
    it('writes the first new record to the file, and returns the new record', () => {
      fs.readFileSync.mockReturnValue(
        encodeFileData({
          lastId: 0,
          records: [],
        })
      );

      const storage = new FileStorage(mockName, mockSchema);
      const record = storage.createRecord(mockRecordData1);

      const expectedFileData = {
        lastId: 1,
        records: [mockRecord1],
      };

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        mockFilePath,
        encodeFileData(expectedFileData),
        FILE_ENCODING
      );
      expect(record).toEqual(mockRecord1);
    });

    it('writes subsequent new record to the file, and returns the new record', () => {
      fs.readFileSync.mockReturnValue(
        encodeFileData({
          lastId: 1,
          records: [mockRecord1]
        })
      );

      const storage = new FileStorage(mockName, mockSchema);
      const record = storage.createRecord(mockRecordData2);

      const expextedFileData = {
        lastId: 2,
        records: [mockRecord1, mockRecord2],
      };

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        mockFilePath,
        encodeFileData(expextedFileData),
        FILE_ENCODING
      );
      expect(record).toEqual(mockRecord2);
    });
  });

  describe('#getAllRecords', () => {
    it('returns all records', () => {
      fs.readFileSync.mockReturnValue(
        encodeFileData({
          lastId: 2,
          records: [mockRecord1, mockRecord2]
        })
      );
  
      const storage = new FileStorage(mockName, mockSchema);
  
      expect(storage.getAllRecords()).toEqual([mockRecord1, mockRecord2]);
    });
  });

  describe('#getRecordById', () => {
    it('returns undefined if there is no record with the id', () => {
      fs.readFileSync.mockReturnValue(
        encodeFileData({
          lastId: 2,
          records: [mockRecord1, mockRecord2],
        })
      );

      const storage = new FileStorage(mockName, mockSchema);

      expect(storage.getRecordById(3)).toEqual(undefined);
    });

    it('returns the matching record if there is a record with the id', () => {
      fs.readFileSync.mockReturnValue(
        encodeFileData({
          lastId: 2,
          records: [mockRecord1, mockRecord2],
        })
      );

      const storage = new FileStorage(mockName, mockSchema);

      expect(storage.getRecordById(1)).toEqual(mockRecord1);
    });
  });

  describe('#updateRecordById', () => {
    it('throws an error if there is no record with the id', () => {
      fs.readFileSync.mockReturnValue(
        encodeFileData({
          lastId: 2,
          records: [mockRecord1, mockRecord2],
        })
      );

      const storage = new FileStorage(mockName);

      expect(() => storage.updateRecordById(3)).toThrow();
    });

    it('writes the update for the matching record to the file, and returns the record', () => {
      fs.readFileSync.mockReturnValue(
        encodeFileData({
          lastId: 2,
          records: [mockRecord1, mockRecord2],
        })
      );

      const updates = {
        name: 'changed-record1',
      };

      const storage = new FileStorage(mockName, mockSchema);
      const updatedRecord1 = storage.updateRecordById(1, updates);

      const expectedFileData = {
        lastId: 2,
        records: [updatedRecord1, mockRecord2],
      };

      expect(updatedRecord1).toEqual({
        ...mockRecord1,
        ...updates,
      });
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        mockFilePath,
        encodeFileData(expectedFileData),
        FILE_ENCODING
      );
    });
  });

  describe('#deleteRecordById', () => {
    it('throws an error if there is no record with the id', () => {
      fs.readFileSync.mockReturnValue(
        encodeFileData({
          lastId: 2,
          records: [mockRecord1, mockRecord2],
        })
      );

      const storage = new FileStorage(mockName, mockSchema);

      expect(() => storage.deleteRecordById(3)).toThrow();
    });

    it('deletes the matching record from the file, and returns the record', () => {
      fs.readFileSync.mockReturnValue(
        encodeFileData({
          lastId: 2,
          records: [mockRecord1, mockRecord2],
        })
      );

      const storage = new FileStorage(mockName, mockSchema);
      const deletedRecord = storage.deleteRecordById(1);

      const expectedFileData = {
        lastId: 2,
        records: [mockRecord2],
      };

      expect(deletedRecord).toEqual(mockRecord1);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        mockFilePath,
        encodeFileData(expectedFileData),
        FILE_ENCODING
      );
    });
  });
});
