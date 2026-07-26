const generateTreatmentPDF = require("./pdf/generateTreatment");

generateTreatmentPDF({
    patientName: "John Doe",
    patientEmail: "clinic@gmail.com",
    treatmentName: "aasdf;kj",
    paidAmount: "3000",
    remainingAmount: "0",
    adminName: "Dr. Abdullah",
    adminEmail: "admin@gmail.com"
}).then(buffer => {
    console.log("PDF generated successfully");
}).catch(err => {
    console.error("Error generating PDF:", err);
});