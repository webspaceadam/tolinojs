const fs = require('fs');

class BookNotes {
    constructor(title, notes) {
        this.title = title;
        this.notes = notes;
    }
}

const notes = JSON.parse(fs.readFileSync('test-json.json', 'utf-8'));

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

const currentDate = new Date();
console.log("Done!");

// Save file
fs.writeFileSync(`${currentDate.getTime()}-books.json`, JSON.stringify(books));