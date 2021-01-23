const app = require('../server.js');
const Provider = require('../providers.js');
const request = require('supertest');
const { response, query } = require('express');





describe("Hello World test", () => {
    it("Should do an stupid test", () =>{
        const a = 5;
        const b = 3;
        const sum = a+b;
        

        expect(sum).toBe(8);
    });
});

describe("Providers API", () =>{
    describe("GET /", () => {
        it("Should return an HTML document", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("h1"));
            }) ;
        });
    });

    describe("GET /providers", () =>{
        beforeAll(() => {
            const providers = [
                new Provider (
                {"cif": "A58818501",
                "name": "Proveedor 1",
                "address": "Sevilla",
                "cp":"20011",
                "phone": "0976543234",
                "email":"provedor1@gmail.com",
                "code": "ABC123",
                "stock_sale": "200"}),
                new Provider ({"cif": "A56783245",
                "name": "Proveedor 2",
                "address": "Madrid",
                "cp":"21832",
                "phone": "0987635241",
                "email":"provedor2@gmail.com",
                "code": "CDE456",
                "stock_sale": "200"})
            ];

            dbFind = jest.spyOn(Provider, "find");
            dbFind.mockImplementation((query, callback) => {
                callback(null, providers);
            });
        });
    
        it('Should return all providers', () => {
            return  request(app).get('/api/v1/providers').then((response) =>{
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });
        });
    });

    ///////
    describe('DELETE /providers', () => {
        
        beforeEach(() => {
        dbRemove = jest.spyOn(Provider, "deleteMany");
        });

        it('Should delete all providers', () => {
            dbRemove.mockImplementation((query, c, callback) =>{
                callback(false);
            });

            return request(app).delete('/api/v1/providers')
            .then((response) =>{
                expect(response.statusCode).toBe(204);
                expect(response.body).toBeNaN();
                expect(dbRemove).toBeCalledWith({}, {multi: true}, expect.any(Function));
            });
        });

        it('Shoul return an error in DB',() => {
            dbRemove.mockImplementation((query, c, callback) => {
                callback(true);
            });
            return request(app).delete('/api/v1/providers')
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });
    });


    describe('PUT /provider', () => {
        let dbUpdate;

        const provider = {cif: "A65321782",
        name: "Proveedor 3",
        address: "Malaga",
        cp:"18945",
        phone: "0987690000",
        email: "provedor3@gmail.com",
        code: "FGH789",
        stock_sale: "200"}
        ;

        beforeEach(() => {
        dbUpdate = jest.spyOn(Provider, "updateOne");
        });

        it('Should update a  provider', () => {
            dbUpdate.mockImplementation((query, c, d, callback) =>{
                callback(false);
            });

            return request(app).put('/api/v1/provider/A65321782')
            .send(provider)
            .then((response) =>{
                expect(response.statusCode).toBe(200);
                expect(provider.name).toEqual("Proveedor 3");
                expect(response.text).toEqual(expect.stringContaining("Provider Updated"));
            });
        });

        it('Should return an error in DB', () => {
            dbUpdate.mockImplementation((query,c,d, callback) => {
                callback(true);
            });

            return request(app).put('/api/v1/provider/A65321782')
            .send(provider)
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });

        
    });

   
    ///////

    describe('POST /providers', () => {
            let dbInsert;
            const provider = {cif: "A65321234",
                            name: "Proveedor 3",
                            address: "Malaga",
                            cp:"18945",
                            phone: "0987690000",
                            email: "provedor3@gmail.com",
                            code: "FGH789",
                            stock_sale: "200"};

            beforeEach(() => {
            dbInsert = jest.spyOn(Provider, "create");
            });

            it('Should add a new provider if everything is fine', () => {
                dbInsert.mockImplementation((c, callback) =>{
                    callback(false);
                });

                return request(app).post('/api/v1/providers').send(provider).then((response) =>{
                    expect(response.statusCode).toBe(201);
                    expect(dbInsert).toBeCalledWith(provider, expect.any(Function));
                });
            });

            it('Should return 500 if there is a problem with de DB', () => {
                dbInsert.mockImplementation((c, callback) => {
                callback(true);
                });
                return request(app).post('/api/v1/providers').send(provider).then((response) =>{
                expect(response.statusCode).toBe(500);
            });
        });

    });

});