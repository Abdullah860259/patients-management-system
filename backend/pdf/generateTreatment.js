const puppeteer = require("puppeteer");
const fs = require("fs");

async function generatePDF(data) {

    console.log("Generating PDF...");
    let html = fs.readFileSync(
        "./pdf/treatment/index.html",
        "utf8"
    );
    console.log("Template loaded");
    const date = new Date();
    html = html
        .replace("{{patientName}}", data.patientName)
        .replace("{{patientEmail}}", data.patientEmail)
        .replace("{{treatmentName}}", data.treatmentName)
        .replace("{{date}}", date.toLocaleString())
        .replace("{{paidAmount}}", data.paidAmount)
        .replace("{{remainingAmount}}", data.remainingAmount)
        .replace("{{adminName}}", data.adminName)
        .replace("{{adminEmail}}", data.adminEmail);

    const browser = await puppeteer.launch();
    console.log("Browser launched");
    const page = await browser.newPage();
    await page.setContent(html);
    console.log("Content set");

    const pdfBuffer = await page.pdf({
        path: "prescription.pdf",
        format: "A4",
        printBackground: true,
        margin: {
            top: "0",
            bottom: "0",
            left: "0",
            right: "0"
        }
    });

    await browser.close();
    console.log("Browser closed");
    return pdfBuffer;

}

module.exports = generatePDF;