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
            <div class="buttons">
                <button class="delete-btn" onclick="deleteNote(${i})">Löschen</button>
                <button onclick="restoreNote(${i})">Wiederherstellen</button>
            </div>
        </div>
    `;
}

function noteTemplate(i) {
    return /*html*/ `
        <div class="card">
            <h3>${notes[i][0]}</h3>
            <p>${notes[i][1]}</p>
            <div class="buttons">
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
            <input onclick="" id="edit-title" type="text" value="${notes[i][0]}" placeholder="Neue Notiz..." />
            <textarea id="edit-text" class="" rows="" placeholder="Notiz...">${notes[i][1]}</textarea>
            <div id="buttons" class="buttons form-buttons">
                <button onclick="saveEdit(${i})">Speichern</button>
                <button onclick="closeEdit()">Verwerfen</button>
            </div>
            </div>
        </div>
    `
}

// render content

function init() {

    let content = document.getElementById('content');
    let form = document.getElementById('add-note');
    let navLink = document.getElementById('link');
    // delete old HTML code
    content.innerHTML = '';
    // Show respective folder
    if (trashView) {
        renderTrashView(content, form, navLink);
    } else {
        renderNotesView(content, form, navLink);
    }
}

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

function saveNote () {
    let title = document.getElementById('title');
    let text = document.getElementById('text');
    // validate if both title and text fields contain values
    if (title.value && text.value){
        notes.unshift([title.value, text.value]);
        // empty input fields
        clearInput(); // [title.value = ''; gn! aber das geht?]
        // render HTML with updated data
        init();
        // save updated values
        save();
    }
    else{
        outlineBlink([title,text]);
    }
}

function clearInput() {
    let titleField = document.getElementById('title');
    let inputField = document.getElementById('text');
    let formButtons = document.getElementById('buttons'); // ...

    inputField.classList.add('hidden');
    formButtons.classList.add('hidden');

    inputField.classList.remove('blink');
    titleField.classList.remove('blink');

    titleField.placeholder='Neue Notiz...';

    titleField.value = '';
    inputField.value = '';

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
    let title = document.getElementById('edit-title');
    let text = document.getElementById('edit-text');
    // validate if both title and text fields contain values
    if (title.value && text.value) {
        // save updated notes
        notes[i][0] = title.value;
        notes[i][1] = text.value;
        save();
        init();
        closeEdit();
    } else {
        outlineBlink([title,text]);
    }
}

// move notes to trash folder
function moveToTrash(i) {
    // add note to array "trash"
    trash.unshift( notes[i] );
    // remove note from notes array
    notes.splice(i,1);
    // load content with updated data & save updated data
    init();
    save();
}

// toggle between trash and notes view
function showTrash() {
    if (trashView) {
        trashView = false;
    } else {
        trashView = true;
    }
    init();
}

// delete note permanently
function deleteNote(i){
    trash.splice(i,1);
    init();
    save();
}

function restoreNote(i) {
    notes.unshift(trash[i]);
    trash.splice(i, 1);
    init();
    save();
}

// save data into local storage
function save() {
    // convert arrays to string
    let notesAsString = JSON.stringify(notes);
    let trashAsString = JSON.stringify(trash);
    // save strings in local storage
    localStorage.setItem('notes', notesAsString);
    localStorage.setItem('trash', trashAsString);
}

// load data from local storage
function load() {
    // get as strings
    let notesAsString = localStorage.getItem('notes');
    let trashAsString = localStorage.getItem('trash');
    // if data exists, parse strings and  save tem in arrays "titles" & "notes" speichern
    if( notesAsString) {
        notes = JSON.parse(notesAsString);
    }
    // save trash if data exists
    if( trashAsString ) {
        trash = JSON.parse(trashAsString);
    }
}

function openTextInput() {
    // open textfield 
    document.getElementById('text').classList.remove('hidden');
    document.getElementById('buttons').classList.remove('hidden');
    document.getElementById('title').placeholder = 'Titel';
}

// add and remove blink animation to given field if input field has an empty value
function outlineBlink(inputFields){
    // check for empty values in passed inputs
    for (i=0; i<inputFields.length; i++){
        if (!inputFields[i].value){
            let element = inputFields[i];
            // add and remove css class
            element.classList.add('blink');
            setTimeout(function () {
                element.classList.remove('blink');
            }, 900);
        }
    }
}

// TODO: err in small sizes: btn des formulars sichtbar auch im eingeklappten Zustand !!