const puppeteer = require("puppeteer");
const fs = require("fs");

async function generatePDF(data) {

    console.log("Generating PDF...");
    let html = fs.readFileSync(
        "./pdf/prescription/index.html",
        "utf8"
    );
    console.log("Template loaded");
    const date = new Date();
    html = html
        .replace("{{name}}", data.name)
        .replace("{{age}}", data.age)
        .replace("{{sex}}", data.sex)
        .replace("{{date}}", date.toLocaleDateString())
        .replace("{{adminName}}", data.adminName)
        .replace("{{adminEmail}}", data.adminEmail)
        .replace("{{patientEmail}}", data.patientEmail);

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