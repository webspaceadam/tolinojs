#! /usr/bin/env node
import fs from 'fs';
import { createSortedJsonFile } from './fileHelper.js';
import { createPDFs } from './markdown.js';
import { program } from 'commander';

/*********************************************** EXECUTION CODE ******************************************* */

/**
 * Commandline Programmoptions.
 */
 program
 .storeOptionsAsProperties(false)
 .option("-f, --file <file>", "File")
 .usage("-f <file>");

program.on("--help", () => {
 console.log("\nExample calls:");
 console.log("  $ tolinojs");
 console.log("  $ tolinojs -f path-to-file + txt file");
});

program.parse(process.argv);
const options = program.opts();
const file = options.file;

console.log("Starting to collect notes for: ", file);


/******* LOGIC CODE */
try {
    const data = fs.readFileSync(file, 'utf-8');
    const cuttedData = data.split("-----------------------------------");
    // const nonEmptyStringData = cuttedData.filter(string => string.length);

    // console.log(nonEmptyStringData);

    const notes = cuttedData.map(singleNote => {
        const title = getBookTitle(singleNote);
        const author = getAuthor(title);
        const bookmark = getBookmark(singleNote);
        const notes = getNotes(singleNote);
        const marking = getMarking(singleNote);

        const fullNote = notes.note.length ? notes.note[0] : "false";
        const fullMarking = marking.length ? marking[0] : "false";

        const noteObj = {
            title: title,
            author: author,
            note: fullNote,
            marked: notes.marked
        }

        const markingObj = {
            title: title,
            author: author,
            marked: fullMarking
        }

        const bookmarkObj = {
            title: title,
            author: author,
            bookmark: bookmark[0]
        }

        let note;

        if(notes.note.length == 1) {
            note = noteObj;
        } else if (marking.length) {
            note = markingObj;
        } else {
            note = bookmarkObj;
        }

        return note;
    });

    console.log("Done!");

    const tmpNotes = "tmp-notes.json"
    fs.writeFileSync(tmpNotes, JSON.stringify(notes));
    const sortedFile = createSortedJsonFile(tmpNotes);
    createPDFs(sortedFile);

    console.log("Deleting temporary files");
    fs.unlinkSync("tmp-books.json");
    fs.unlinkSync("tmp-notes.json");

} catch (e) {
    console.log("Error: ", e.stack);
}

/**
 * Get information on single note
 * @param {string[]} note 
 * @returns 
 */
function getNotes(note) {
    const rawStringData = note.split("\n");
    const nonEmptyStrings = rawStringData.filter(string => string.length);
    const notes = nonEmptyStrings.filter(string => string.includes('Notiz'));

    const fullNoteObj = {
        note: notes,
        marked: nonEmptyStrings[2]
    }

    return fullNoteObj;
}

/**
 * TODO
 * @param {String[]} note 
 * @returns 
 */
function getMarking(note) {
    const rawStringData = note.split("\n");
    const nonEmptyStrings = rawStringData.filter(string => string.length);
    const markings = nonEmptyStrings.filter(string => string.includes('Markierung'));

    return markings;
}

/**
 * TODO
 * @param {String[]} note 
 * @returns 
 */
function getBookmark(note) {
    const rawStringData = note.split("\n");
    const nonEmptyStrings = rawStringData.filter(string => string.length);
    const bookmarks = nonEmptyStrings.filter(string => string.includes('Lesezeichen'));

    return bookmarks;
}

function getAuthor(title) {
    const regExp = /\(([^)]+)\)/;
    const author = regExp.exec(title);

    // console.log("FULL AUTHOR", author);

    if(author == null) {
        return
    }
    // console.log("AUTOR: ", author[1]);


    return author[1];
}

/**
 * Return Title 
 * @param {String[]} note 
 * @returns 
 */
function getBookTitle(note) {
    const rawStringData = note.split("\n");
    const nonEmptyStrings = rawStringData.filter(string => string.length);
    return nonEmptyStrings[0];
}