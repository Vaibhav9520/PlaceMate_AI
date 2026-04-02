const fs = require('fs');
const docx = require('docx');

try {
    const mdPath = 'C:\\Users\\Vaibhav Singh\\.gemini\\antigravity\\brain\\ce1ff3a3-a284-46cc-a195-a3c0cc859780\\Seminar_Report_PlaceMate_AI.md';
    const docxPath = 'C:\\Users\\Vaibhav Singh\\OneDrive\\Desktop\\FINAL PROJECTS\\PLACEMATE_REACT\\Seminar_Report_12Pages_PlaceMate_AI.docx';

    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip, TableOfContents } = docx;

    const md = fs.readFileSync(mdPath, 'utf8');
    let titleChildren = [];
    let chapterChildren = [];
    let currentChildren = titleChildren;

    let lines = md.split('\n');

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line || line === '---') continue;

        if (line.includes('Chapter-1: Introduction')) {
            currentChildren = chapterChildren;
            currentChildren.push(new Paragraph({
                text: 'Chapter-1: Introduction',
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.LEFT || "left",
                spacing: { before: 240, after: 120 }
            }));
            continue;
        }

        let isBullet = line.startsWith('- ') || line.startsWith('* ');
        let isNumbered = /^\d+\.\s/.test(line);
        let isH1 = line.startsWith('# ');
        let isH2 = line.startsWith('## ');
        let isH3 = line.startsWith('### ');

        let cleanLine = line;

        if (isBullet) cleanLine = line.substring(2).trim();
        if (isNumbered) cleanLine = line.replace(/^\d+\.\s/, '').trim();
        if (isH1) cleanLine = line.replace('# ', '').trim();
        if (isH2) cleanLine = line.replace('## ', '').trim();
        if (isH3) cleanLine = line.replace('### ', '').trim();

        let fontSize = 24; // 12pt
        if (isH1) fontSize = 36; // 18pt
        if (isH2) fontSize = 32; // 16pt
        if (isH3) fontSize = 28; // 14pt

        let runs = [];
        let parts = cleanLine.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        for (let p of parts) {
            if (!p) continue;
            if (p.startsWith('**') && p.endsWith('**')) {
                runs.push(new TextRun({ text: p.substring(2, p.length - 2), bold: true, font: "Times New Roman", size: fontSize }));
            } else if (p.startsWith('*') && p.endsWith('*')) {
                runs.push(new TextRun({ text: p.substring(1, p.length - 1), italics: true, font: "Times New Roman", size: fontSize }));
            } else {
                runs.push(new TextRun({ text: p, font: "Times New Roman", size: fontSize }));
            }
        }

        let paraOptions = {
            children: runs,
            spacing: { before: 120, after: 120, line: 360 },
            alignment: currentChildren === titleChildren ? (AlignmentType.CENTER || "center") : (AlignmentType.JUSTIFIED || "justified")
        };

        if (isH1) {
            paraOptions.heading = HeadingLevel.HEADING_1;
            paraOptions.alignment = AlignmentType.CENTER || "center";
        } else if (isH2) {
            paraOptions.heading = HeadingLevel.HEADING_2;
            paraOptions.alignment = AlignmentType.LEFT || "left";
        } else if (isH3) {
            paraOptions.heading = HeadingLevel.HEADING_3;
            paraOptions.alignment = AlignmentType.LEFT || "left";
        } else if (isBullet) {
            paraOptions.bullet = { level: 0 };
            paraOptions.alignment = AlignmentType.JUSTIFIED || "justified";
        } else if (isNumbered) {
            paraOptions.numbering = { reference: "my-numbering", level: 0 };
            paraOptions.alignment = AlignmentType.JUSTIFIED || "justified";
        }

        currentChildren.push(new Paragraph(paraOptions));
    }

    titleChildren.push(new Paragraph({
        text: 'TABLE OF CONTENTS',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER || "center",
        spacing: { before: 480, after: 240 }
    }));
    titleChildren.push(new TableOfContents("Index", {
        hyperlink: true,
        headingStyleRange: "1-3",
    }));

    const doc = new Document({
        features: { updateFields: true },
        numbering: {
            config: [{ reference: "my-numbering", levels: [{ level: 0, format: "decimal", text: "%1.", alignment: AlignmentType.LEFT || "left" }] }]
        },
        sections: [
            {
                properties: {
                    page: { margin: { top: convertInchesToTwip(1), right: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1) } }
                },
                children: titleChildren.length ? titleChildren : [new Paragraph({ text: "Empty Title Section" })]
            },
            {
                properties: {
                    type: "nextPage",
                    page: { margin: { top: convertInchesToTwip(1), right: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1) } }
                },
                children: chapterChildren.length ? chapterChildren : [new Paragraph({ text: "Empty Chapter Section" })]
            }
        ]
    });

    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(docxPath, buffer);
        fs.writeFileSync('success_log.txt', 'Successfully created: ' + docxPath);
    }).catch(err => {
        fs.writeFileSync('error_log_packer.txt', String(err.stack || err));
    });

} catch (e) {
    fs.writeFileSync('error_log_sync.txt', String(e.stack || e));
}
