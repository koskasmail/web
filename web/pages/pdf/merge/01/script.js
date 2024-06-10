async function mergePDFs() {
    const pdf1 = document.getElementById('pdf1').files[0];
    const pdf2 = document.getElementById('pdf2').files[0];

    if (pdf1 && pdf2) {
        const pdfDoc = await PDFLib.PDFDocument.create();
        const pdf1Bytes = await pdf1.arrayBuffer();
        const pdf2Bytes = await pdf2.arrayBuffer();
        
        const pdf1Doc = await PDFLib.PDFDocument.load(pdf1Bytes);
        const pdf2Doc = await PDFLib.PDFDocument.load(pdf2Bytes);
        
        const pdf1Pages = await pdfDoc.copyPages(pdf1Doc, pdf1Doc.getPageIndices());
        const pdf2Pages = await pdfDoc.copyPages(pdf2Doc, pdf2Doc.getPageIndices());
        
        pdf1Pages.forEach((page) => {
            pdfDoc.addPage(page);
        });
        
        pdf2Pages.forEach((page) => {
            pdfDoc.addPage(page);
        });
        
        const mergedPdfBytes = await pdfDoc.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const downloadLink = document.getElementById('download');
        downloadLink.href = url;
        downloadLink.download = 'merged.pdf';
        downloadLink.style.display = 'block';
    } else {
        alert('Please select two PDF files to merge.');
    }
}
