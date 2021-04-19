const fs = require('fs');
const markdownpdf = require("markdown-pdf");

const testnotiz = {
    "title":"Crushing It! EPB (Vaynerchuk, Gary)",
    "author":"Vaynerchuk, Gary",
    "note":"Notiz auf Seite 6: testnotiz",
    "marked":"\"My eight-year old daughter, Misha, wants to be a YouTuber when she grows up. That probably comes as no surprise—many young",
    "bookmark":	"Lesezeichen auf Seite 22…tellers are observant\""
}


const title = createTitleString("Die Furcht vor der Freiheit (Fromm, Erich)");
const stats = createStatsString({note: 123, markings: 123, bookmarks: 2});
const noteString = createNoteString(testnotiz);
const markingString = createMarkingString(testnotiz);
const bookmarkString = createBookmarkString(testnotiz);

// Construct Full note
const fullNote = `
${title}

## Stats
${stats}

## Notes
${noteString}

## Markings
${markingString}

## Bookmarks
${bookmarkString}
`;

const currentDate = new Date();

// Create Markdown File
fs.writeFileSync(`${currentDate.getTime()}-fullnote.md`, fullNote);

// Convert File to PDF
markdownpdf({cssPath: "custom.css"}).from(`${currentDate.getTime()}-fullnote.md`)
             .to(`${currentDate.getTime()}-fullnote.pdf`, function () {
    console.log("Done")
})

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