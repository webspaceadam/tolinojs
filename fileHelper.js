import fs from 'fs';

class BookNotes {
    constructor(title, notes) {
        this.title = title;
        this.notes = notes;
    }
}

/**
 * Creates a sorted json file with books
 * @param {string} filePath 
 * @returns path to temporary sorted books file
 */
export function createSortedJsonFile(filePath) {
    console.log("Sorting Books!");

    const notes = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    const allTitles = [];
    notes.forEach(note => {
        if(!allTitles.includes(note.title) && note.title != undefined) {
            allTitles.push(note.title)
        }
    });
    
    const books = allTitles.map(title => {
        const correlatingNotes = notes.filter(note => note.title == title);
        return new BookNotes(title, correlatingNotes);
    });
    

    console.log("Done with sorting Books!");

    
    // Save file
    const sortedFileName = 'tmp-books.json'
    fs.writeFileSync(sortedFileName, JSON.stringify(books));

    return sortedFileName;
}


/** LOGIC */