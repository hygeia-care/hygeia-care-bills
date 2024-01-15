const app = require('../app');
const request = require('supertest');
const Bill = require('../models/bill');

describe("Bill API", () => {

    describe("GET /bills", () => {

        const bills = [
            new Bill({  "name": "test1", 
                        "total":"50.5",
                        "description":"description bill 4 from postman", 
                        "services":"services from postman",
                        "issueDate":"12/12/2023",
                        "patient":"usuario 2",
                        "appointment":"12/12/2023"
                    }),
            new Bill({  "name": "test2", 
                        "total":"50.5",
                        "description":"description bill 4 from postman", 
                        "services":"services from postman",
                        "issueDate":"12/12/2023",
                        "patient":"usuario 2",
                        "appointment":"12/12/2023"
            }),
            new Bill({  "name": "test3", 
                        "total":"50.5",
                        "description":"description bill 4 from postman", 
                        "services":"services from postman",
                        "issueDate":"12/12/2023",
                        "patient":"usuario 2",
                        "appointment":"12/12/2023"
            })
            
        ];       
                
        
        var dbFind;

        beforeEach(() => {
            dbFind = jest.spyOn(Bill, "find");
        });

        it("Should return all bills", () => {
            dbFind.mockImplementation(async () => Promise.resolve(bills));

            return request(app).get("/api/v1/bills").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(3);
                expect(dbFind).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when retrieving all bills", () => {
            dbFind.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).get("/api/v1/bills").then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbFind).toBeCalled();
            });
        });
    });

    describe("POST /bills", () => {
        

        const bill = new Bill({  "name": "test1",  "total":"50.5",
                        "description":"description bill 4 from postman", 
                        "services":"services from postman",
                        "issueDate":"12/12/2023","patient":"usuario 2", "appointment":"12/12/2023"
                    })
        var dbSave;

        beforeEach(() => {
            dbSave = jest.spyOn(Bill.prototype, "save");
        });

        it("Should add a new bill if everything is fine", () => {
            dbSave.mockImplementation(async () => Promise.resolve(true));

            return request(app).post("/api/v1/bills").send(bill).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbSave).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem with the connection", () => {
            dbSave.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).post("/api/v1/bills").send(bill).then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbSave).toBeCalled();
            });
        });
    });

    describe("DELETE /bills/:id", () => {
        const bill = new Bill({  "name": "test1",  "total":"50.5",
                                "description":"description bill 4 from postman", 
                                "services":"services from postman",
                                "issueDate":"12/12/2023","patient":"usuario 2", "appointment":"12/12/2023"
        })
        var dbDeleteOne;

        beforeEach(() => {
            dbDeleteOne = jest.spyOn(bill, "deleteOne");
        });

        it("Should delete bill given its id", () => {
            dbDeleteOne.mockImplementation(async () => Promise.resolve({ message: 'Bill successfully deleted', deletedCount: 1}));

            return request(app).delete("/api/v1/bills/"+bill._id).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.message).toEqual("Bill successfully deleted");
                expect(dbDeleteOne).toBeCalled();
            });
        });

        it("Should return 404 if the bill does not exist", () => {
            dbDeleteOne.mockImplementation(async () => Promise.resolve({ message: 'Bill not found', deletedCount: 0}));

            return request(app).delete("/api/v1/bills/"+(bill._id+1)).then((response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body.error).toEqual("Bill not found");
                expect(dbDeleteOne).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when deleting an bill ", () => {
            dbDeleteOne.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).delete("/api/v1/bills/"+bill._id).then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbDeleteOne).toBeCalled();
            });
        });
    });





/*
    describe("GET /assurance_carriers/:id", () => {
        const assuranceCarrier = new AssuranceCarrier({"name":"TestAssuranceCarrier", "email":"testassurancecarrier@testassurancecarrier.com", "url": "https://www.testassurancecarrier.com"});
        var dbFindById;

        beforeEach(() => {
            dbFindById = jest.spyOn(AssuranceCarrier, "findById");
        });

        it("Should return assurance carrier given its id", () => {
            dbFindById.mockImplementation(async () => Promise.resolve(assuranceCarrier));

            return request(app).get("/api/v1/assurance_carriers/1").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.name).toEqual("TestAssuranceCarrier");
                expect(dbFindById).toBeCalled();
            });
        });

        it("Should return 404 if the assurance carrier does not exist", () => {
            dbFindById.mockImplementation(async () => Promise.resolve(null));

            return request(app).get("/api/v1/assurance_carriers/1").then((response) => {
                expect(response.statusCode).toBe(404);
                expect(dbFindById).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when retrieving an assurance carrier", () => {
            dbFindById.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).get("/api/v1/assurance_carriers/1").then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbFindById).toBeCalled();
            });
        });
    });


*/    
});