import { MongoClient, ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";

const uri = "mongodb://localhost:27017/UberClone"; // replace this
const client = new MongoClient(uri);

async function seed() {
    try {
        await client.connect();
        const db = client.db("UberClone"); // your DB name
        const rides = db.collection("rides");

        const userId = new ObjectId("69bfaa696e913a423173cc8c");
        const captainId = new ObjectId("69bfadf89d1929a9d513c2c1");

        const data = [];

        for (let i = 0; i < 20; i++) {
            const pickupTime = faker.date.recent(5); // last 5 days
            const durationMinutes = faker.number.int({ min: 15, max: 180 });

            const dropTime = new Date(
                pickupTime.getTime() + durationMinutes * 60000
            );

            data.push({
                _id: new ObjectId(),
                userId,
                captainId,
                pickupLocation: faker.location.streetAddress(),
                dropLocation: faker.location.streetAddress(),
                distance: faker.number.float({ min: 5, max: 500 }),
                duration: durationMinutes,
                amount: faker.number.int({ min: 200, max: 7000 }),
                status: faker.helpers.arrayElement(["accepted", "arriving", "ongoing", "completed", "cancelled"]),
                paymentStatus: faker.helpers.arrayElement(["paid", "pending"]),
                pickupTime,
                dropTime,
                createdAt: pickupTime,
                updatedAt: dropTime,
            });
        }

        await rides.insertMany(data);

        console.log("✅ 20 rides inserted successfully");
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

seed();