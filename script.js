// Globale Variablen
let titles = [];
let notes = [];
let trash = [];
let trashView = false;

// get variables from local storage and save thim in arrays above
load();

// HTML TEMPLATES

function trashNoteTemplate(i) {
    return /*html*/ `
        <div class="card">
            <h3>${trash[i][0]}</h3>
            <p>${trash[i][1]}</p>
            <div class="">
                <button class="delete-btn" onclick="deleteNote(${i})">Löschen</button>
                <button onclick="restoreNote(${i})">Wiederherstellen</button>
            </div>
        </div>
    `;
}

function noteTemplate(i) {
    return /*html*/ `
        <div class="card">
            <h3>${titles[i]}</h3>
            <p>${notes[i]}</p>
            <div class="">
                <button onclick="moveToTrash(${i})">Löschen</button>
                <button onclick="openEdit(${i})">Ändern</button>
            </div>
        </div>
    `;
}

function editNoteTemplate(i) {
    return /*html*/ `
        <div class="form-container" id="">
            <div class="card edit-card">
            <input onclick="" id="edit-title" type="text" value="${titles[i]}" placeholder="Neue Notiz..." />
            <textarea id="edit-text" class="" rows="" placeholder="Notiz...">${notes[i]}</textarea>
            <div id="buttons" class="form-buttons">
                <button onclick="saveEdit(${i})">Speichern</button>
                <button onclick="closeEdit()">Verwerfen</button>
            </div>
            </div>
        </div>
    `
}

// render

function renderTrashView(content, form, navLink) {
    navLink.innerHTML = 'Notes';
    // hide note form 
    form.classList.add('hidden');
    // generate HTML
    for (let i = 0; i < trash.length; i++) {
        content.innerHTML += trashNoteTemplate(i);
    }
}

function renderNotesView(content, form, navLink) {
    // generate HTML
    navLink.innerHTML = 'Trash';
    // display new-note form
    form.classList.remove('hidden');
    for (let i = 0; i < notes.length; i++) {
        content.innerHTML += noteTemplate(i);
    }
}

function renderEditForm(i) {
    let overlay = document.getElementById('overlay');
    overlay.innerHTML = editNoteTemplate(i);
}

function init() {
    
    let content = document.getElementById('content');
    let form = document.getElementById('add-note');
    let navLink = document.getElementById('link');
    
    // delete old HTML code
    content.innerHTML = '';
    
    if (trashView){
        renderTrashView(content, form, navLink);
    }
    else {
        renderNotesView(content, form, navLink);
    }
}


function saveNote () {
    let title = document.getElementById('title').value;
    let text = document.getElementById('text').value;

    // Checken ob Titel- und Textfeld values enthalten
    if (title && text){
        titles.push(title);
        notes.push(text);

        // input fields leeren 
        title = ''; // warum geht das nicht? (weder mit .value, .innerHTML oder sonstwie aber in Kontaktbuch fkt. es so?)
        text = '';
        clearInput(); // aber das geht?

        // HTML-Inhalt mit aktualisierten Daten neu laden
        init();
        // Aktualisierte Daten speichern
        save();
    }
    else{
        alert('Keine leeren Felder');
    }
}
// ENDE: Funktion saveNote()

function clearInput() {
    let title = document.getElementById('title');
    let text = document.getElementById('text');
    let inputField = document.getElementById('text');
    let formButtons = document.getElementById('buttons'); // wieviele form-buttons elemente?

    inputField.classList.add('hidden'); //genauso für die buttons & ev ändern der placeholder-texte ev ändern des textes für btn2? ...
    formButtons.classList.add('hidden');

    title.placeholder='Neue Notiz...';

    title.value = '';
    text.value = '';

    init();
}

function openEdit(i){
    // open edit form
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('hidden');
    // render form with values for specified note
    renderEditForm(i);
}

function closeEdit() {
    let overlay = document.getElementById('overlay');
    overlay.classList.add('hidden');
}

function saveEdit(i) {
    let title = document.getElementById('edit-title').value;
    let text = document.getElementById('edit-text').value;
    // Checken ob Titel- und Textfeld values enthalten
    if (title && text) {
        // save updated notes
        titles[i] = title;
        notes[i] = text;
        save();
        init();
        closeEdit();
    } else {
        // something
        alert('fill out both values');
        // fkt blink
    }
}

// Notizen in Ordner "Trash" verschieben
function moveToTrash(i) {
    // Titel und Text der Notiz in Array "trash" hinzufügen ( Array "trash" enthält je eine Notiz als Arrays ). Ev auch Notiz selber als mehrdimensionales Array speichern (später).
    trash.push( [titles[i], notes[i]] );
    // Titel und Text aus den Arrays "titles", "notes" entfernen
    titles.splice(i,1);
    notes.splice(i,1);
    // Notizen mit aktualisierten Daten neu laden
    init();
    // Aktualisierte Daten speichern
    save();
}

// Den Trash (Notes) Ordner anzeigen / Trash view wechseln
function showTrash() {
    if (trashView) {
        trashView = false;
    } else {
        trashView = true;
    }
    init();
}

// Notiz endgültig löschen
function deleteNote(i){
    trash.splice(i,1);
    init();
    save();
}


function restoreNote(i) {
    titles.push(trash[i][0]);
    notes.push(trash[i][1]);

    trash.splice(i, 1);

    init();
    save();
}

// Daten im Local Storage abspeichern
function save() {
    // Arrays in String umwandeln
    let titlesAsString = JSON.stringify(titles);
    let notesAsString = JSON.stringify(notes);
    let trashAsString = JSON.stringify(trash);

    // Strings im local storage speichern
    localStorage.setItem('titles', titlesAsString);
    localStorage.setItem('text', notesAsString);
    localStorage.setItem('trash', trashAsString);
}

// Daten aus Local Storage holen
function load() {
    // Strings aus Local Storage holen
    let titlesAsString = localStorage.getItem('titles');
    let notesAsString = localStorage.getItem('text');
    let trashAsString = localStorage.getItem('trash');

    // Strings parsen (umwandeln) und in Arrays "titles" & "notes" speichern
    if( titlesAsString && notesAsString) {
        titles = JSON.parse(titlesAsString);
        notes = JSON.parse(notesAsString);
    }
    // "trash"
    if( trashAsString ) {
        trash = JSON.parse(trashAsString);
    }

}

function openTextInput() {
    // textfeld für note-text eingabe öffnen
    document.getElementById('text').classList.remove('hidden');
    // document.getElementsByClassName('form-buttons').classList.remove('hidden'); // warum geht das nicht ?? (nur ein form-buttons-element vorhanden??)
    document.getElementById('buttons').classList.remove('hidden'); // aber das schon?
    document.getElementById('title').placeholder = 'Titel';
}