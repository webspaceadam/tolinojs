import fs from 'fs';
import markdownpdf from "markdown-pdf";



export function createPDFs(notesPath) {
    console.log("Start creating paths");
    const notes = JSON.parse(fs.readFileSync(notesPath, 'utf-8'));
    notes.forEach(note => createPDF(note));
    console.log("Done creating PDFs");
}

/**
 * Create PDF based on the notes provided. 
 * @param {object} note 
 */
function createPDF(note) {
    let noteCount = 0;
    let markingCount = 0;
    let bookmarkCount = 0;

    const noteStringArray = [];
    const markingStringArray = [];
    const bookmarkStringArray = [];

    note.notes.forEach(note => {
        if(note.bookmark) {
            bookmarkStringArray.push(createBookmarkString(note))
            bookmarkCount += 1;
        } else if(note.note) {
            noteStringArray.push(createNoteString(note));
            noteCount += 1;
        } else {
            markingStringArray.push(createMarkingString(note))
            markingCount += 1;
        }
    })

    const title = createTitleString(note.title);
    const stats = createStatsString({note: noteCount, markings: markingCount, bookmarks: bookmarkCount});
  
// Construct Full note
const fullNote = `
${title}

## Stats
${stats}

## Notes
${noteStringArray.join("\n")}

## Markings
${markingStringArray.join("\n")}

## Bookmarks
${bookmarkStringArray.join("\n")}
`;

    const fileTitle = (note.title.replace(/\s/g, "_"));
    const __dirname = fs.realpathSync('.');;
    const markdownPath = __dirname + '/markdown';
    const pdfPath = __dirname + '/pdf';
    const abbrevation = "fullnote"

    if (fs.existsSync(markdownPath) && fs.existsSync(pdfPath)) {
        console.log('Directory exists!');

        // Create Markdown File
        fs.writeFileSync(markdownPath + `/${fileTitle}-${abbrevation}.md`, fullNote);

        // Convert File to PDF
        markdownpdf({cssPath: "custom.css"}).from(markdownPath + `/${fileTitle}-${abbrevation}.md`)
                    .to(pdfPath + `/${fileTitle}-${abbrevation}.pdf`, function () {
            console.log("Done creating PDF for: ", fileTitle);
        })
    } else {
        console.log("Could not find directory. Created /pdf and /markdown");
        fs.mkdirSync(markdownPath);
        fs.mkdirSync(pdfPath);

        // Create Markdown File
        fs.writeFileSync(markdownPath + `/${fileTitle}-${abbrevation}.md`, fullNote);

        // Convert File to PDF
        markdownpdf({cssPath: "custom.css"}).from(markdownPath + `/${fileTitle}-${abbrevation}.md`)
                    .to(pdfPath + `/${fileTitle}-${abbrevation}.pdf`, function () {
            console.log("Done creating PDF for: ", fileTitle);
        })
    }
}

/**** CREATE STRINGS */

/**
 * Create a title string for the markdown file
 * @param {String} title 
 * @returns 
 */
function createTitleString(title) {
    return `
# ${title}
    `;
}

/**
 * Get a string for stats in markdown
 * @param {{note, markings, booksmarks}} stats 
 * @returns 
 */
function createStatsString(stats) {
    return `
|Name |Count  |
| --- | --- |
|Notes|${stats.note}|
|Markings|${stats.markings}|
|Bookmarks|${stats.bookmarks}|
    `;
}

/**
 * Get a string for single note in markdown
 * @param {{title, author, note, marked}} note 
 * @returns 
 */
function createNoteString(note) {
    return `
---
${note.note}
> ${note.marked}
    `;
}

/**
 * Get a string for single bookmark in markdown
 * @param {{title, author, marked}} note 
 * @returns 
 */
 function createMarkingString(note) {
    return `
---
> ${note.marked}
    `;
}

/**
 * Get a string for single bookmark in markdown
 * @param {{title, author, marked}} note 
 * @returns 
 */
 function createBookmarkString(note) {
    return `
---
> ${note.bookmark}
    `;
}