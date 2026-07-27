require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
require("dotenv").config();
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const User = require("./models/User");
const Treatment = require("./models/Treatment");
const Payment = require("./models/Payment");
const Feedback = require("./models/Feedback");

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {

    console.log("MongoDB Connected");

    // Clear existing data
    await User.deleteMany({});
    await Treatment.deleteMany({});
    await Payment.deleteMany({});
    await Feedback.deleteMany({});


    // =========================
    // CREATE USERS (10,000)
    // =========================

    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [];

    for(let i = 0; i < 10000; i++){

        users.push({
            idNumber: 1000000000 + i,

            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),

            email: `patient${i}@example.com`,

            password: hashedPassword,

            phone: faker.phone.number().slice(0, 19),

            dateOfBirth: faker.date.birthdate({
                min:18,
                max:80,
                mode:"age"
            }),

            gender: faker.helpers.arrayElement([
                "male",
                "female",
                "other"
            ]),

            address:{
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                zipCode: faker.location.zipCode()
            },

            dentalHistory: faker.lorem.sentence(),

            allergies: faker.lorem.sentence(),

            role:"patient",

            isActive:true
        });

    }


    const patients = await User.insertMany(users);

    console.log("10,000 Patients created");



    // =========================
    // CREATE TREATMENTS (50,000)
    // =========================

    const treatments=[];

    for(let i=0;i<50000;i++){

        treatments.push({

            name: faker.helpers.arrayElement([
                "Root Canal",
                "Dental Cleaning",
                "Tooth Extraction",
                "Dental Filling",
                "Braces",
                "Whitening"
            ]),

            description: faker.lorem.sentence(),

            cost: faker.number.int({
                min:500,
                max:100000
            }),

            durationDays: faker.number.int({
                min:1,
                max:60
            }),

            minimumAdvanceAmount: faker.number.int({
                min:100,
                max:10000
            })

        });

    }


    const savedTreatments = await Treatment.insertMany(treatments);

    console.log("50,000 Treatments created");



    // =========================
    // CREATE PAYMENTS (100,000)
    // =========================

    const payments=[];

    for(let i=0;i<100000;i++){

        const patient =
        patients[
            Math.floor(Math.random()*patients.length)
        ];

        const treatment =
        savedTreatments[
            Math.floor(Math.random()*savedTreatments.length)
        ];


        payments.push({

            patient: patient._id,

            treatment:treatment._id,
            receiptNumber: `REC-${Date.now()}-${i}`,
            paidAmount: faker.number.int({
                min:500,
                max:50000
            }),

            paymentMethod:
            faker.helpers.arrayElement([
                "Cash",
                "Credit Card",
                "Debit Card",
                "Bank Transfer",
                "Online Payment"
            ]),

            paymentDate: faker.date.past(),

            notes:"Generated test payment"

        });

    }


    await Payment.insertMany(payments);

    console.log("100,000 Payments created");



    // =========================
    // CREATE FEEDBACKS (50,000)
    // =========================

    const feedbacks=[];


    for(let i=0;i<50000;i++){

        const patient =
        patients[
            Math.floor(Math.random()*patients.length)
        ];


        feedbacks.push({

            patient:patient._id,


            category:
            faker.helpers.arrayElement([
                "General",
                "Service Quality",
                "Staff Behavior",
                "Cleanliness",
                "Wait Time",
                "Pricing",
                "Facilities",
                "Treatment Experience",
                "Recommendation",
                "Complaint",
                "Suggestion"
            ]),


            subject:faker.lorem.words(3),

            message:faker.lorem.sentence(),

            rating:faker.number.int({
                min:1,
                max:5
            }),

            isAnonymous:false,

            status:"Submitted",

            isPublic:false

        });

    }


    await Feedback.insertMany(feedbacks);


    console.log("50,000 Feedbacks created");


    console.log("🔥 Large dataset generation completed");

    process.exit();


})
.catch(err=>{
    console.error(err);
    process.exit(1);
});