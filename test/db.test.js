const Provider = require('../providers.js');
const mongoose = require('mongoose');
const dbConnect = require('../db');
jest.setTimeout(30000);

describe('DB connection', () => {
    beforeAll(() => {
        return dbConnect();
    })

    beforeEach((done) => {
        Provider.deleteMany({}, (err) => {
            done();
        });
    });

    it('writes a Provider in the MongoDB', (done) => {
        const provider = new Provider({cif: "A89385a222222",
        name: "Proveedor 4",
        address: "Barcelona",
        cp:"54324",
        phone: "0911111324",
        email:"provedor4@gmail.com",
        code: "IJK101",
        stock_sale: "200"});
        provider.save((err, provider) => {
            expect(err).toBeNull();
            Provider.find({}, (err, providers) => {
                expect(providers).toBeArrayOfSize(1);
                done();
            });
            
        });
    });

    afterAll((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });

})
