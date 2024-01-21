const app = require('../app');
const request = require('supertest');
const Bill = require('../models/bill');
const verifyJWTToken = require('../verifyJWTToken');

describe("Bill API", () => {

    verifyToken = jest.spyOn(verifyJWTToken, "verifyToken");
    verifyToken.mockImplementation(async () => Promise.resolve(true));
    const testJWT = "thisTokenWorks";    

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


    describe("GET /bills", () => {               
        
        var dbFind;

        beforeEach(() => {
            dbFind = jest.spyOn(Bill, "find");
        });

        it("Should return all bills", () => {
            dbFind.mockImplementation(async () => Promise.resolve(bills));

  
            return request(app).get("/api/v1/bills")
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(3);
                expect(dbFind).toBeCalled();
            });

        });

        it("Should return 500 if there is a problem when retrieving all bills", () => {
            dbFind.mockImplementation(async () => Promise.reject("Connection failed"));      

            return request(app).get("/api/v1/bills")
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbFind).toBeCalled();
            });

        });
    });

    describe("POST /bills", () => {        

        const bill = new Bill({  "name": "test23",  "total":"50.5",
                        "description":"description bill 4 from postman", 
                        "services":"services from postman",
                        "issueDate":"12/12/2023","patient":"usuario 2", "appointment":"12/12/2023"
                    });
        var dbSave;

        beforeEach(() => {
            dbSave = jest.spyOn(Bill.prototype, "save");
        });

        it("Should add a new bill if everything is fine", () => {
            dbSave.mockImplementation(async () => Promise.resolve(true));

            return request(app).post("/api/v1/bills")
            .set("x-auth-token", testJWT)
            .send(bill)
            .then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbSave).toBeCalled();
            });
            
        });

        it("Should return 500 if there is a problem with the connection", () => {
            dbSave.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).post("/api/v1/bills")
            .set("x-auth-token", testJWT)
            .send(bill)
            .then((response) => {
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
        var dbFind;

        beforeEach(() => {
            dbDeleteOne = jest.spyOn(Bill, "deleteOne");
        });

        it("Should delete bill given its id", () => {
            dbDeleteOne.mockImplementation(async () => Promise.resolve({ message: 'Bill successfully deleted', deletedCount: 1}));

            dbFind = jest.spyOn(Bill, "find");
            dbFind.mockImplementation(async () => Promise.resolve(bills));

            return request(app).delete("/api/v1/bills/"+bill._id)
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.message).toEqual("Bill successfully deleted");                
                expect(dbDeleteOne).toBeCalled();
            });

        });

        it("Should return 404 if the bill does not exist", () => {
            dbDeleteOne.mockImplementation(async () => Promise.resolve({ message: 'Bill not found', deletedCount: 0}));

            return request(app).delete("/api/v1/bills/"+(bill._id+1))
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body.error).toEqual("Bill not found");
                expect(dbDeleteOne).toBeCalled();
            });

        });

        it("Should return 500 if there is a problem when deleting an bill ", () => {
            dbDeleteOne.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).delete("/api/v1/bills/"+bill._id)
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbDeleteOne).toBeCalled();
            });

        });
    });
 

    describe("PUT /bills/:id", () => {
        const bill = new Bill({  "name": "test1",  "total":"50.5",
                                "description":"description bill 4 from postman", 
                                "services":"services from postman",
                                "issueDate":"12/12/2023","patient":"usuario 2", "appointment":"12/12/2023"
        })

        const updatedBody = ({ "_id": bill._id, "name": "testXX",  "total":"50.5",
        "description":"description bill 4 from postman", 
        "services":"services from postman",
        "issueDate":"12/12/2023","patient":"usuario 2", "appointment":"12/12/2023"
        })

        const updatedBill = new Bill (updatedBody);

        var dbUpdateOne;
        var dbFind;

        beforeEach(() => {
            dbUpdateOne = jest.spyOn(Bill, "findByIdAndUpdate");
        });

        it("Should UPDATE bill given its id", () => {
            dbUpdateOne.mockImplementation(async () => Promise.resolve(updatedBill));

            dbFind = jest.spyOn(Bill, "find");
            dbFind.mockImplementation(async () => Promise.resolve(bills));

            return request(app).put("/api/v1/bills/").set("x-auth-token", testJWT).send(updatedBody).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.message).toEqual("Bill successfully updated");
                expect(dbUpdateOne).toBeCalled();
            });
            
        });
        
        it("Should return 404 if the bill does not exist", () => {
            dbUpdateOne.mockImplementation(async () => Promise.resolve());     
            
            return request(app).put("/api/v1/bills/").set("x-auth-token", testJWT).send(updatedBody).then((response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body.error).toEqual("Bill not found");
                expect(dbUpdateOne).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when deleting an bill ", () => {
            dbUpdateOne.mockImplementation(async () => Promise.reject("Connection failed"));            

            return request(app).put("/api/v1/bills/").set("x-auth-token", testJWT).send(updatedBody).then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbUpdateOne).toBeCalled();
            });
        });

        
    });

});