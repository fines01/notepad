// Globale Variablen
let titles = [];
let notes = [];
let trash = [];
let trashView = false;

// Variablen aus Local Storage holen und in Arrays speichern;
load();

// Funktion render() beim Laden des Bodies ausführen, lädt Daten samt HTML Content der Notizen
function render() {
    // Div in welcher die Karten angezeigt werden sollen in Variable "content" speichern
    let content = document.getElementById('content');
    let form = document.getElementById('add-note');
    let navLink = document.getElementById('link');

    // Alten HTML Code löschen
    content.innerHTML = '';

    if (trashView){
        // Nav-Link Text anpassen
        navLink.innerHTML = 'Notes';
        // Notiz-Formular ausblenden
        form.classList.add('hidden');
        // HTML generieren
        for (let i = 0; i < trash.length; i++) {
            content.innerHTML += /*html*/ `
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
        // ENDE: For-Schleife
    }
    // ENDE: If-Block
    else {
        // HTML generieren
        navLink.innerHTML = 'Trash';
        // Formular einblenden
        form.classList.remove('hidden');
        for (let i = 0; i < notes.length; i++) {
            content.innerHTML += /*html*/ `
            <div class="card">
                <h3>${titles[i]}</h3>
                <p>${notes[i]}</p>
                <div class="">
                    <button onclick="moveToTrash(${i})">Löschen</button>
                    <button onclick="editNote(${i})">Ändern</button>
                </div>
            </div>
        `;
        }
        //ENDE: For-Schleife
    }
    //ENDE: Else-Block
    
}
// ENDE: Funktion render()

//
function saveNote() {
    let title = document.getElementById('title').value;
    let text = document.getElementById('text').value;

    // Checken ob Titel- und Textfeld values enthalten
    if (title && text){
        titles.push(title);
        notes.push(text);

        // input fields leeren AAAAAAAH
        title = ''; // warum geht das nicht? (weder mit .value, .innerHTML oder sonstwie aber in Kontaktbuch fkt. es so?)
        text = '';
        clearInput(); // aber das geht?

        // HTML-Inhalt mit aktualisierten Daten neu laden
        render();
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

    render();
}

function editNote(i){
    alert(`Sorry, you can't edit me (yet?)`);
    // 1. Formular ähnl add-note öffnen, mit values aus gespeichertem Array
    // 2. speichern --> Array-element an der jew Position mit neuem Wert ersetzen
}

// Notizen in Ordner "Trash" verschieben
function moveToTrash(i) {
    // Titel und Text der Notiz in Array "trash" hinzufügen ( Array "trash" enthält je eine Notiz als Arrays ). Ev auch Notiz selber als mehrdimensionales Array speichern (später).
    trash.push( [titles[i], notes[i]] );
    // Titel und Text aus den Arrays "titles", "notes" entfernen
    titles.splice(i,1);
    notes.splice(i,1);
    // Notizen mit aktualisierten Daten neu laden
    render();
    // Aktualisierte Daten speichern
    save();
}
// ENDE: Funktion trash()

// Den Trash (Notes) Ordner anzeigen / Trash view wechseln
function showTrash() {
    if (trashView) {
        trashView = false;
    } else {
        trashView = true;
    }
    render();
}
// ENDE Funktion showTrash()

// Notiz endgültig löschen
function deleteNote(i){
    trash.splice(i,1);
    render();
    save();
}
// ENDE Funktion deleteNote()

function restoreNote(i) {
    titles.push(trash[i][0]);
    notes.push(trash[i][1]);

    trash.splice(i, 1);

    render();
    save();
}
// ENDE Funftion restoreNote()

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
// ENDE: Funktion save()

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
// ENDE: funktion load()

function openTextInput() {
    // textfeld für note-text eingabe öffnen
    document.getElementById('text').classList.remove('hidden');
    // document.getElementsByClassName('form-buttons').classList.remove('hidden'); // warum geht das nicht ?? (nur ein form-buttons-element vorhanden??)
    document.getElementById('buttons').classList.remove('hidden'); // aber das schon?
    document.getElementById('title').placeholder = 'Titel';
}