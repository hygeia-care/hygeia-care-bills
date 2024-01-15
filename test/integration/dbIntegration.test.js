const Bill = require('../../models/bill');
const dbConnectTest = require('./envDBIntegrationTest');


jest.setTimeout(3000);

describe("Integration Tests", () => {

    beforeAll((done) => {
        if(dbConnectTest.readyState == 1){
            done();
        } else {
            dbConnectTest.on("connected", () => done());
        }
    });

    describe("Assurance DB connection", () => {        
        const bill = new Bill({  "name": "testIntegration_1",  "total":"50.5",
                        "description":"description bill 4 from integration test", 
                        "services":"services from integration test",
                        "issueDate":"12/12/2023","patient":"usuario 2", "appointment":"12/12/2023"
                    })
        var result;

        beforeAll(async () => {
            await Bill.deleteMany({});
        });

        it("Writes a bill in the DB", async () => {
            await bill.save();
            result = await Bill.find();
            expect(result).toBeArrayOfSize(1);
        });

        it("Reads bill from the DB", async () => {
            result = await Bill.findById(bill._id);
            expect(result.name).toEqual("testIntegration_1");
        });

        it("Deletes bill from the DB", async () => {
            await Bill.deleteOne(bill._id);
            result = await Bill.findById(bill._id);
            expect(result).toEqual(null);
        });

        afterAll(async () => {
            await Bill.deleteMany({});
        });
    });  

    afterAll(async () => {
        if(dbConnectTest.readyState == 1){
            await dbConnectTest.close();
        }
    });

});

