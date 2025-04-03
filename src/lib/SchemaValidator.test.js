const SchemaValidator = require('./SchemaValidator');

describe('SchemaValidator', () => {
  describe('#constructor', () => {
    it('does not throw an error if all types are supported', () => {
      expect(() => new SchemaValidator({
        name: {
          type: String,
        },
      })).not.toThrow();
    });

    it('throws an error for unsupported types', () => {
      expect(() => new SchemaValidator({
        names: {
          type: Array,
        },
      })).toThrow();
    });
  });

  describe('#validateProp', () => {
    describe('typecheck String', () => {
      it('does not throw an error if a String type is a String', () => {
        const validator = new SchemaValidator({
          name: {
            type: String,
          },
        });
  
        // Null is just a missing value
        expect(() => validator.validateProp('name', null)).not.toThrow();
        expect(() => validator.validateProp('name', 'valid-name')).not.toThrow();
      });
  
      it('throws an error if a String type is not a String', () => {
        const validator = new SchemaValidator({
          name: {
            type: String,
          },
        });
  
        expect(() => validator.validateProp({
          name: 1,
        })).toThrow();
      });
    });

    describe('typecheck Number', () => {
      it('does not throw an error if a Number type is a Number', () => {
        const validator = new SchemaValidator({
          amount: {
            type: Number,
          },
        });
  
        expect(() => validator.validateProp('amount', null)).not.toThrow();
        expect(() => validator.validateProp('amount', -1)).not.toThrow();
        expect(() => validator.validateProp('amount', 0)).not.toThrow();
        expect(() => validator.validateProp('amount', 1)).not.toThrow();
      });
  
      it('throws an error if a Number type is not a Number', () => {
        const validator = new SchemaValidator({
          amount: {
            type: Number,
          },
        });
  
        expect(() => validator.validateProp('amount', '1')).toThrow();
        expect(() => validator.validateProp('amount', 'not-a-number')).toThrow();
      });
    });

    describe('typecheck Date', () => {
      it('does not throw an error if a Date type is a Date', () => {
        const validator = new SchemaValidator({
          date: {
            type: Date,
          },
        });

        expect(() => validator.validateProp('date', null)).not.toThrow();
        expect(() => validator.validateProp('date', new Date())).not.toThrow();
      });

      it('throws an error if a Date type is not a Date', () => {
        const validator = new SchemaValidator({
          date: {
            type: Date,
          },
        });

        expect(() => validator.validateProp('date', 'string')).toThrow();
        expect(() => validator.validateProp('date', 1)).toThrow();
      });
    });

    describe('require String', () => {
      it('does not throw an error if a non-required String is missing or empty', () => {
        const validator = new SchemaValidator({
          name: {
            type: String,
          },
        });
  
        expect(() => validator.validateProp('name', null)).not.toThrow();
        expect(() => validator.validateProp('name', '')).not.toThrow();
        expect(() => validator.validateProp('name', ' ')).not.toThrow();
      });
  
      it('throws an error if a required String is missing or empty', () => {
        const validator = new SchemaValidator({
          name: {
            type: String,
            required: true,
          }
        });
  
        expect(() => validator.validateProp('name', null)).toThrow();
        expect(() => validator.validateProp('name', '')).toThrow();
        expect(() => validator.validateProp('name', ' ')).toThrow();
      });
  
      it('does not throw an error if a required String is present and non-empty', () => {
        const validator = new SchemaValidator({
          name: {
            type: String,
            required: true,
          },
        });
  
        expect(() => validator.validateProp('name', 'non-empty')).not.toThrow();
      });
    });

    describe('require Number', () => {
      it('does not throw an error if a non-required Number is missing or invalid', () => {
        const validator = new SchemaValidator({
          amount: {
            type: Number,
          },
        });
  
        expect(() => validator.validateProp('amount', null)).not.toThrow();
        expect(() => validator.validateProp('amount', Infinity)).not.toThrow();
        expect(() => validator.validateProp('amount', -Infinity)).not.toThrow();
        expect(() => validator.validateProp('amount', NaN)).not.toThrow()
      });
  
      it('throws an error if a required Number is missing or invalid', () => {
        const validator = new SchemaValidator({
          amount: {
            type: Number,
            required: true,
          },
        });

        expect(() => validator.validateProp('amount', null)).toThrow();
        expect(() => validator.validateProp('amount', Infinity)).toThrow();
        expect(() => validator.validateProp('amount', -Infinity)).toThrow();
        expect(() => validator.validateProp('amount', NaN)).toThrow();
      });
  
      it('does not throw an error if a required Number is present and valid', () => {
        const validator = new SchemaValidator({
          amount: {
            type: Number,
            required: true,
          },
        });

        expect(() => validator.validateProp('amount', 0)).not.toThrow();
        expect(() => validator.validateProp('amount', -1)).not.toThrow();
        expect(() => validator.validateProp('amount', 1)).not.toThrow();
      });
    });

    describe('require Date', () => {
      it('does not throw an error if a non-required Date is missing or invalid', () => {
        const validator = new SchemaValidator({
          date: {
            type: Date,
          },
        });
  
        expect(() => validator.validateProp('date', null)).not.toThrow();
        expect(() => validator.validateProp('date', new Date('invalid'))).not.toThrow();
      });
  
      it('throws an error if a required Date is missing or invalid', () => {
        const validator = new SchemaValidator({
          date: {
            type: Date,
            required: true,
          },
        });
  
        expect(() => validator.validateProp('date', null)).toThrow();
        expect(() => validator.validateProp('date', new Date('invalid'))).toThrow();
      });
  
      it('does not throw an error if a required Date is present and valid', () => {
        const validator = new SchemaValidator({
          date: {
            type: Date,
            required: true,
          },
        });

        expect(() => validator.validateProp('date', new Date())).not.toThrow();
      });
    });

    describe('custom validator', () => {
      it('does not throw an error if a custom validator passes', () => {
        const validator = new SchemaValidator({
          amount: {
            type: Number,
            validate: {
              validator: value => value > 0,
              message: 'must be a positive number',
            },
          }
        });

        expect(() => validator.validateProp('amount', 1)).not.toThrow();
      });

      it('throws an error if a custom validator fails', () => {
        const validator = new SchemaValidator({
          amount: {
            type: Number,
            validate: {
              validator: value => value > 0,
              message: 'must be a positive number',
            },
          }
        });

        expect(() => validator.validateProp('amount', 0)).toThrow('must be a positive number');
      });
    });
  });

  describe('#validateCreate', () => {
    it('throws an error if props is not an object', () => {
      const validator = new SchemaValidator({});

      expect(() => validator.validateCreate('not-an-object')).toThrow();
      expect(() => validator.validateCreate([])).toThrow();
    });

    it('does not throw an error if all props are valid', () => {
      const validator = new SchemaValidator({
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        price: {
          type: Number,
          required: true,
        },
        likes: {
          type: Number,
        },
        date: {
          type: Date,
          required: true,
        },
        lastLiked: {
          type: Date,
        },
      });

      expect(() => validator.validateCreate({
        name: 'Item',
        description: 'Description',
        price: 27.50,
        likes: 1,
        date: new Date(),
        lastLiked: new Date(),
      })).not.toThrow();
    });

    it('throws an error if any props are invalid', () => {
      const validator = new SchemaValidator({
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        price: {
          type: Number,
          required: true,
        },
        likes: {
          type: Number,
        },
        date: {
          type: Date,
          required: true,
        },
        lastLiked: {
          type: Date,
        },
      });

      expect(() => validator.validateCreate({
        name: 1,
        description: 1,
        price: '27.50',
        likes: '1',
        date: 'string',
        lastLiked: 'string',
      })).toThrow();
    });
  })

  describe('#validateUpdate', () => {
    it('throws an error if updatedProps is not an object', () => {
      const validator = new SchemaValidator({});

      expect(() => validator.validateUpdate('not-an-object')).toThrow();
      expect(() => validator.validateUpdate([])).toThrow();
    });

    it('does not throw an error if all updated props are valid', () => {
      const validator = new SchemaValidator({
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        price: {
          type: Number,
          required: true,
        },
        likes: {
          type: Number,
        },
        date: {
          type: Date,
          required: true,
        },
        lastLiked: {
          type: Date,
        },
      });

      // We only check the props we pass instead of all props
      expect(() => validator.validateUpdate({})).not.toThrow();
      expect(() => validator.validateUpdate({
        description: null,
        price: 27.50,
        lastLiked: new Date()
      })).not.toThrow();
      expect(() => validator.validateUpdate({
        name: 'Item',
        description: 'Description',
        price: 27.50,
        likes: 1,
        date: new Date(),
        lastLiked: new Date(),
      })).not.toThrow();
    });

    it('throws an error if any updated props are invalid', () => {
      const validator = new SchemaValidator({
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        price: {
          type: Number,
          required: true,
        },
        likes: {
          type: Number,
        },
        date: {
          type: Date,
          required: true,
        },
        lastLiked: {
          type: Date,
        },
      });

      // We only check the props we pass instead of all props
      expect(() => validator.validateUpdate({
        name: null,
      })).toThrow();
      expect(() => validator.validateUpdate({
        name: '',
      })).toThrow();
      expect(() => validator.validateUpdate({
        description: new Date(),
      })).toThrow();
      expect(() => validator.validateUpdate({
        price: null,
      })).toThrow();
      expect(() => validator.validateUpdate({
        price: Infinity,
      })).toThrow();
      expect(() => validator.validateUpdate({
        likes: 'string',
      })).toThrow();
      expect(() => validator.validateUpdate({
        date: null,
      })).toThrow();
      expect(() => validator.validateUpdate({
        date: 'string',
      })).toThrow();
      expect(() => validator.validateUpdate({
        lastLiked: 'string',
      })).toThrow();
    });
  });
});
