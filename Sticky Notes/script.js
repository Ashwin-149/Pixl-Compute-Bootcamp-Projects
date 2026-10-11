
// Heading
let heading = document.createElement('H1');
heading.textContent = 'Sticky Notes';
document.body.appendChild(heading);

//Textarea for input
let textarea = document.createElement('TEXTAREA');
textarea.id = 'noteInput';
textarea.placeholder = 'Type a new note...';

// Add button
let addButton = document.createElement('BUTTON');
addButton.textContent = '+';

// Container for input and button and panel (grey colored div)
let panel = document.createElement("div");
let inputContainer = document.createElement("div");
inputContainer.append(textarea, addButton);

panel.append(heading, inputContainer);
document.body.appendChild(panel);


const body = document.querySelector("body");

// Styling(body)
body.style.margin = "0";
body.style.padding = "0";
body.style.backgroundColor = "#ffffff";
body.style.fontFamily = "Arial, sans-serif";
body.style.minHeight = "100vh";

// Styling(panel and inputContainer)
inputContainer.style.width = "100%";
inputContainer.style.height = "140px";
inputContainer.style.boxSizing = "border-box";
inputContainer.style.gridColumn = "2";
inputContainer.style.justifySelf = "center";
inputContainer.style.width = "100%";
inputContainer.style.position = "relative";
inputContainer.style.backgroundColor = "#fefec0";
inputContainer.style.padding = "12px";
inputContainer.style.display = "flex";
inputContainer.style.flexDirection = "column";

panel.style.width = "96%";
panel.style.minHeight = "calc(100vh - 100px)";
panel.style.boxSizing = "border-box";
panel.style.margin = "16px auto";
panel.style.padding = "35px";
panel.style.backgroundColor = "#f1f1f1";
panel.style.borderRadius = "12px";
panel.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.12)";

panel.style.display = "flex";
panel.style.flexDirection = "column";
panel.style.alignItems = "center";
panel.style.gap = "16px";

// Styling(heading, textarea, addButton)
heading.style.fontFamily = "'DM Serif Display', cursive";
heading.style.fontSize = "32px";
heading.style.margin = "0 0 24px 0";
heading.style.textAlign = "center";

textarea.style.width = "100%";
textarea.style.height = "100%";
textarea.style.flex = "1";
textarea.style.padding = "4px";
textarea.style.boxSizing = "border-box";
textarea.style.backgroundColor = "transparent";
textarea.style.border = "none";
textarea.style.boxShadow = "none";
textarea.style.resize = "none";
textarea.style.fontSize = "20px";

addButton.style.position = "absolute";
addButton.style.bottom = "4px";
addButton.style.right = "4px";
addButton.style.backgroundColor = "#11ff00";
addButton.style.border = "none";
addButton.style.padding = "2px 5px";
addButton.style.fontSize = "10px";


// Creating and styling notesSection
const notesSection = document.createElement("div");
notesSection.id = "notes-section";

notesSection.style.width = "100%";
notesSection.style.display = "grid";
notesSection.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
notesSection.style.gap = "12px";
notesSection.style.justifyItems = "stretch";
notesSection.appendChild(inputContainer);
panel.appendChild(notesSection);


const noteColors = ["#d1e1ff", "#fefffe"]; // using two colors for notes to alternate between them
let noteCount = 0;
const notes = [];


addButton.addEventListener("click", () => {
    const text = textarea.value.trim();
    
    if (text === "") return;

    // Create a note element and styling it
    const note = document.createElement("div");
    note.classList.add("note");

    note.style.gridColumn = "auto";
    note.style.backgroundColor = noteColors[noteCount % 2];
    note.style.width = "100%";
    note.style.minHeight = "140px";
    note.style.padding = "16px";
    note.style.boxSizing = "border-box";
    note.style.position = "relative";
    note.style.borderRadius = "3px";
    note.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.12)";

    // Create a delete button for the note  and styling it
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";

    deleteButton.style.backgroundColor = "#e54b3a";
    deleteButton.style.color = "white";
    deleteButton.style.border = "none";
    deleteButton.style.borderRadius = "5px";
    deleteButton.style.padding = "3px 6px";
    deleteButton.style.fontSize = "11px";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.position = "absolute";
    deleteButton.style.top = "6px";
    deleteButton.style.right = "6px";

    deleteButton.addEventListener("click", () => {
    const index = notes.indexOf(note);


    // Remove the note from the notes array if it exists
    if (index !== -1) {
        notes.splice(index, 1);
    }

    note.remove();

    // Re-grid the remaining notes after deletion
    notes.forEach((n, i) => {
    n.style.gridColumn = "auto";
    n.style.gridRow = "auto";

    if (i === 0) {
        n.style.gridColumn = "2";
    } else if (i >= 3 && i % 3 === 0) {
        n.style.gridColumn = "2";
        n.style.gridRow = `${Math.floor(i / 3) + 1}`;
    }

    notesSection.insertBefore(n, inputContainer);
});
});

// Create a paragraph element for the note text and styling it
    const noteText = document.createElement("p");
    noteText.textContent = text;
    noteText.style.margin = "3px 12px 0 2px";
    noteText.style.textAlign = "left";
    noteText.style.fontSize = "20px";


notes.push(note);

// Grid allignment Logic
notes.forEach((n, i) => {
    n.style.gridColumn = "auto";
    n.style.gridRow = "auto";

    if (notes.length === 1) {
        n.style.gridColumn = "2";
    }
    
    else if (i >= 3 && i % 3 === 0 && i === notes.length - 1) {
        n.style.gridColumn = "2";
    }

    notesSection.insertBefore(n, inputContainer);
});


    note.append(deleteButton, noteText);
    notesSection.insertBefore(note, inputContainer);

    noteCount++;
    textarea.value = "";
});

addButton.addEventListener("mouseenter", () => {
    addButton.style.transform = "scale(1.1)";
});

addButton.addEventListener("mouseleave", () => {
    addButton.style.transform = "scale(1)";
});

textarea.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addButton.click();
    }
});