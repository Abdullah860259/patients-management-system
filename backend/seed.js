const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Treatment = require('./models/Treatment');
const Payment = require('./models/Payment');
const Feedback = require('./models/Feedback');

const firstNames = ['James','Mary','Robert','Patricia','John','Jennifer','Michael','Linda','David','Barbara','William','Elizabeth','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Christopher','Karen','Charles','Lisa','Daniel','Nancy','Matthew','Betty','Anthony','Margaret','Mark','Sandra','Donald','Ashley','Steven','Kimberly','Andrew','Emily','Paul','Donna','Joshua','Michelle','Kenneth','Carol','Kevin','Amanda','Brian','Dorothy','George','Melissa','Timothy','Deborah','Ronald','Stephanie','Edward','Rebecca','Jason','Sharon','Jeffrey','Laura','Ryan','Cynthia','Jacob','Kathleen','Gary','Amy','Nicholas','Angela','Eric','Shirley','Jonathan','Anna','Stephen','Brenda','Larry','Pamela','Justin','Emma','Scott','Nicole','Brandon','Helen','Benjamin','Samantha','Samuel','Katherine','Raymond','Christine','Gregory','Debra','Frank','Rachel','Alexander','Carolyn','Patrick','Janet','Jack','Catherine','Henry','Maria','Walter','Heather'];
const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts','Turner','Phillips','Evans','Collins','Edwards','Stewart','Morris','Murphy','Cook','Rogers','Morgan','Cooper','Peterson','Bailey','Reed','Kelly','Howard','Ramos','Kim','Cox','Ward','Richardson','Watson','Brooks','Chavez','Wood','James','Bennett','Gray','Mendoza','Ruiz','Hughes','Price','Alvarez','Castillo','Sanders','Patel','Myers','Long','Ross','Foster','Jimenez','Powell','Jenkins','Perry','Russell','Sullivan','Bell','Coleman','Butler'];
const cities = ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville','Fort Worth','Columbus','Charlotte','Indianapolis','San Francisco','Seattle','Denver','Nashville','Portland','Memphis','Louisville','Baltimore','Milwaukee','Albuquerque','Tucson','Fresno','Sacramento','Mesa','Atlanta','Kansas City','Omaha','Colorado Springs','Raleigh','Long Beach','Virginia Beach','Miami','Oakland','Minneapolis','Tampa','Tulsa','Arlington','New Orleans','Wichita','Cleveland','Bakersfield','Aurora','Anaheim','Honolulu'];
const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
const streets = ['Main St','Oak Ave','Elm St','Pine Rd','Maple Dr','Cedar Ln','Birch Ct','Walnut St','Cherry Blvd','Park Ave','Lake Dr','River Rd','Hill St','Spring St','Church St','Broadway','Highland Ave','Sunset Blvd','Forest Dr','Meadow Ln'];
const feedbackMsgs = [
  { cat: 'Service Quality', subj: 'Excellent cleaning service', msg: 'The dental cleaning was thorough and the hygienist was very gentle.', rating: 5 },
  { cat: 'Service Quality', subj: 'Great experience overall', msg: 'Very professional staff and modern equipment. Highly recommend.', rating: 5 },
  { cat: 'Staff Behavior', subj: 'Very friendly reception staff', msg: 'The front desk team is always welcoming and helpful.', rating: 5 },
  { cat: 'Wait Time', subj: 'Long wait times on weekends', msg: 'Had to wait over 45 minutes past my appointment time.', rating: 3 },
  { cat: 'Wait Time', subj: 'Quick check-in process', msg: 'Was seen right at my appointment time. Efficient process.', rating: 4 },
  { cat: 'Facilities', subj: 'Modern and clean clinic', msg: 'The clinic is spotless with state-of-the-art equipment.', rating: 5 },
  { cat: 'Pricing', subj: 'Transparent pricing structure', msg: 'Clear breakdown of costs before each treatment. No surprise charges.', rating: 4 },
  { cat: 'Pricing', subj: 'A bit expensive', msg: 'Quality is good but some treatments feel overpriced compared to other clinics.', rating: 3 },
  { cat: 'Suggestion', subj: 'Add online booking for all services', msg: 'Would be great to book all types of appointments online.', rating: 4 },
  { cat: 'Complaint', subj: 'Parking is difficult', msg: 'The parking lot is too small and fills up quickly.', rating: 2 },
  { cat: 'Treatment Experience', subj: 'Root canal was painless', msg: 'Completely painless experience. Doctor explained every step.', rating: 5 },
  { cat: 'Treatment Experience', subj: 'Great follow-up care', msg: 'They called the next day to check on me after my extraction.', rating: 5 },
  { cat: 'Staff Behavior', subj: 'Rude front desk experience', msg: 'Front desk staff was not very friendly during check-in.', rating: 2 },
  { cat: 'Facilities', subj: 'Comfortable waiting area', msg: 'Nice waiting room with comfortable seating and good music.', rating: 4 },
  { cat: 'Service Quality', subj: 'Braces adjustment was quick', msg: 'In and out in 20 minutes for my monthly adjustment.', rating: 4 }
];
const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Online Payment'];
const feedbackStatuses = ['Submitted', 'Under Review', 'Acknowledged', 'Resolved'];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[rand(0, arr.length - 1)]; }
function randomDate(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d;
}
function formatPhone() {
  return `+1 ${rand(200, 999)} ${rand(100, 999)} ${String(rand(0, 9999)).padStart(4, '0')}`;
}

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    await User.deleteMany({});
    await Treatment.deleteMany({});
    await Payment.deleteMany({});
    await Feedback.deleteMany({});

    const ceo = await User.create({
      firstName: 'Admin', lastName: 'CEO',
      email: 'ceo@clinic.com', password: 'password123',
      phone: '+1 555 000 0000', dateOfBirth: '1975-01-01', gender: 'male',
      role: 'ceo'
    });

    const admins = [];
    for (let i = 1; i <= 2; i++) {
      const a = await User.create({
        firstName: pick(firstNames), lastName: pick(lastNames),
        email: `admin${i}@clinic.com`, password: 'password123',
        phone: formatPhone(), dateOfBirth: `${rand(1970, 1995)}-${String(rand(1,12)).padStart(2,'0')}-${String(rand(1,28)).padStart(2,'0')}`, gender: pick(['male','female','other']),
        role: 'admin', createdBy: ceo._id
      });
      admins.push(a);
    }

    const treatmentData = [
      { name: 'Comprehensive Exam', description: 'Full oral examination including X-rays, oral cancer screening, and treatment planning', cost: 150, durationDays: 1, minimumAdvanceAmount: 50 },
      { name: 'Teeth Cleaning', description: 'Professional prophylaxis — scaling, polishing, and fluoride application', cost: 200, durationDays: 1, minimumAdvanceAmount: 50 },
      { name: 'Composite Filling', description: 'Tooth-colored resin filling for cavities on any tooth surface', cost: 300, durationDays: 1, minimumAdvanceAmount: 100 },
      { name: 'Root Canal Therapy', description: 'Endodontic treatment on anterior or posterior teeth with crown recommendation', cost: 1500, durationDays: 2, minimumAdvanceAmount: 500 },
      { name: 'Porcelain Crown', description: 'Custom-fabricated ceramic crown for damaged or root-canal-treated teeth', cost: 1200, durationDays: 14, minimumAdvanceAmount: 400 },
      { name: 'Teeth Whitening', description: 'In-office professional whitening with LED light activation', cost: 500, durationDays: 1, minimumAdvanceAmount: 200 },
      { name: 'Tooth Extraction', description: 'Simple or surgical extraction including local anesthesia and post-op care', cost: 800, durationDays: 1, minimumAdvanceAmount: 300 },
      { name: 'Dental Implant', description: 'Single-tooth implant placement with titanium post and ceramic crown', cost: 3000, durationDays: 90, minimumAdvanceAmount: 1000 },
      { name: 'Orthodontic Braces', description: 'Full-mouth metal or ceramic braces with monthly adjustment visits', cost: 5000, durationDays: 730, minimumAdvanceAmount: 1500 },
      { name: 'Porcelain Veneer', description: 'Custom laminate veneer for smile makeover on anterior teeth', cost: 1000, durationDays: 14, minimumAdvanceAmount: 400 },
      { name: 'Dental Bonding', description: 'Composite bonding for chipped, cracked, or misshapen teeth', cost: 350, durationDays: 1, minimumAdvanceAmount: 100 },
      { name: 'Sealant Application', description: 'Preventive resin sealant on molars for children and adults', cost: 80, durationDays: 1, minimumAdvanceAmount: 30 },
      { name: 'Gum Disease Treatment', description: 'Scaling and root planing (deep cleaning) for periodontitis patients', cost: 600, durationDays: 2, minimumAdvanceAmount: 200 },
      { name: 'Denture — Full Set', description: 'Complete upper and lower acrylic denture with fitting and adjustments', cost: 2500, durationDays: 30, minimumAdvanceAmount: 800 },
      { name: 'Night Guard', description: 'Custom-fabricated occlusal guard for bruxism relief', cost: 400, durationDays: 7, minimumAdvanceAmount: 150 },
      { name: 'Emergency Exam', description: 'Same-day emergency evaluation for pain, swelling, or trauma', cost: 100, durationDays: 1, minimumAdvanceAmount: 0 },
      { name: 'Orthodontic Retainer', description: 'Custom vacuum-formed or Hawley retainer post-braces', cost: 250, durationDays: 7, minimumAdvanceAmount: 100 },
      { name: 'Pediatric Checkup', description: 'Child-friendly exam with cleaning, fluoride, and age-appropriate education', cost: 120, durationDays: 1, minimumAdvanceAmount: 40 }
    ];
    const createdTreatments = await Treatment.insertMany(treatmentData);

    console.log('Creating 100 patients...');
    const usedEmails = new Set();
    const patientDocs = [];
    for (let i = 0; i < 100; i++) {
      let email;
      do {
        const fn = pick(firstNames).toLowerCase();
        const ln = pick(lastNames).toLowerCase();
        email = `${fn}.${ln}${rand(1, 999)}@email.com`;
      } while (usedEmails.has(email));
      usedEmails.add(email);

      const idNumber = Math.floor(1000000000 + Math.random() * 9000000000);
      const password = await bcrypt.hash('password123', 10);
      const dob = `${rand(1960, 2005)}-${String(rand(1,12)).padStart(2,'0')}-${String(rand(1,28)).padStart(2,'0')}`;
      const createdBy = pick(admins)._id;

      patientDocs.push({
        idNumber,
        firstName: pick(firstNames),
        lastName: pick(lastNames),
        email,
        password,
        phone: formatPhone(),
        dateOfBirth: new Date(dob),
        gender: pick(['male', 'female', 'other']),
        address: {
          street: `${rand(100, 9999)} ${pick(streets)}`,
          city: pick(cities),
          state: pick(states),
          zipCode: String(rand(10000, 99999))
        },
        role: 'patient',
        createdBy,
        isActive: true,
        treatments: []
      });
    }
    const patients = await User.insertMany(patientDocs);
    console.log(`  Created ${patients.length} patients`);

    console.log('Assigning treatments and creating payments...');
    const allPayments = [];
    let receiptCounter = 0;
    const startDate = new Date('2024-01-01');
    const endDate = new Date();

    for (const patient of patients) {
      const numTreatments = rand(3, 8);
      const assignedTreatmentIds = new Set();
      const treatmentEntries = [];

      for (let j = 0; j < numTreatments; j++) {
        const treatment = createdTreatments[rand(0, createdTreatments.length - 1)];
        if (assignedTreatmentIds.has(treatment._id.toString())) continue;
        assignedTreatmentIds.add(treatment._id.toString());

        const numPayments = rand(1, 4);
        const totalPaidSoFar = 0;
        const paymentIds = [];

        for (let p = 0; p < numPayments; p++) {
          receiptCounter++;
          const paymentDate = randomDate(startDate, endDate);
          const ts = paymentDate.getFullYear().toString().slice(-2) +
            String(paymentDate.getMonth() + 1).padStart(2, '0') +
            String(paymentDate.getDate()).padStart(2, '0');

          const remaining = treatment.cost - totalPaidSoFar;
          const isLast = p === numPayments - 1;
          const paidAmount = isLast ? remaining : rand(1, Math.max(1, Math.floor(remaining / (numPayments - p))));

          allPayments.push({
            patient: patient._id,
            treatment: treatment._id,
            processedBy: pick(admins)._id,
            paidAmount,
            paymentMethod: pick(paymentMethods),
            paymentDate,
            receiptNumber: `RCPT-${ts}-${String(receiptCounter).padStart(5, '0')}`
          });
        }
      }
    }

    const insertedPayments = await Payment.insertMany(allPayments);
    console.log(`  Created ${insertedPayments.length} payments`);

    console.log('Building patient treatment records...');
    const paymentMap = {};
    for (const p of insertedPayments) {
      const key = `${p.patient.toString()}-${p.treatment.toString()}`;
      if (!paymentMap[key]) paymentMap[key] = [];
      paymentMap[key].push(p);
    }

    const bulkUpdates = [];
    for (const patient of patients) {
      const treatmentMap = {};
      for (const p of insertedPayments) {
        if (p.patient.toString() !== patient._id.toString()) continue;
        const tId = p.treatment.toString();
        if (!treatmentMap[tId]) {
          const treatment = createdTreatments.find(t => t._id.toString() === tId);
          treatmentMap[tId] = { payments: [], totalPaid: 0, totalCost: treatment ? treatment.cost : 0, name: treatment ? treatment.name : 'Unknown' };
        }
        treatmentMap[tId].payments.push(p._id);
        treatmentMap[tId].totalPaid += p.paidAmount;
      }

      const entries = Object.entries(treatmentMap).map(([tId, data]) => ({
        treatment: tId,
        name: data.name,
        status: data.totalPaid >= data.totalCost ? 'completed' : 'ongoing',
        totalCost: data.totalCost,
        totalPaid: data.totalPaid,
        payments: data.payments
      }));

      bulkUpdates.push({
        updateOne: {
          filter: { _id: patient._id },
          update: { $set: { treatments: entries } }
        }
      });
    }
    await User.bulkWrite(bulkUpdates);
    console.log('  Treatment records updated');

    console.log('Creating feedback...');
    const feedbackDocs = [];
    for (const patient of patients) {
      const numFeedback = rand(0, 3);
      for (let j = 0; j < numFeedback; j++) {
        const tmpl = pick(feedbackMsgs);
        feedbackDocs.push({
          patient: patient._id,
          category: tmpl.cat,
          subject: tmpl.subj,
          message: tmpl.msg,
          rating: Math.max(1, Math.min(5, tmpl.rating + (Math.random() > 0.7 ? rand(-1, 1) : 0))),
          status: pick(feedbackStatuses),
          isAnonymous: Math.random() > 0.85,
          ceoResponse: Math.random() > 0.65 ? {
            message: 'Thank you for your valuable feedback! We take every comment seriously and are working on improvements.',
            respondedAt: randomDate(new Date('2024-06-01'), new Date()),
            respondedBy: ceo._id
          } : undefined
        });
      }
    }
    const insertedFeedbacks = await Feedback.insertMany(feedbackDocs);
    console.log(`  Created ${insertedFeedbacks.length} feedbacks`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('   CEO: ceo@clinic.com / password123');
    console.log('   Admin 1: admin1@clinic.com / password123');
    console.log('   Admin 2: admin2@clinic.com / password123');
    console.log('   Patients use password123 (random emails)');
    console.log(`\n📊 Created ${patients.length} patients, ${createdTreatments.length} treatments, ${insertedPayments.length} payments, ${insertedFeedbacks.length} feedbacks`);
    console.log(`   Total revenue: $${(insertedPayments.reduce((s, p) => s + p.paidAmount, 0)).toLocaleString()}`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
