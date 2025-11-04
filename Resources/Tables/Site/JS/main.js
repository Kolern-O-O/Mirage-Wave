let already_active = false;
let tables_folder;

let scene_info;
let text_info;
let characters_info;
let change_bg_info;
let change_music_info;
let change_sound_info;
let change_text_info;
let character_disappear_info;
let character_idle_info;
let character_movement_info;
let character_spawn_info;
let character_images = [];
let background_images = [];
let musics = [];
let sounds = [];
let characters = [];

let scene_change_object;

let current_scene;
let new_scene = false;

window.addEventListener("keydown", start);

document.getElementById("Background ID").addEventListener("change", background_refreash);

document.getElementById("Add_char").addEventListener("click", add_character);

document.getElementById("Delete_char").addEventListener("click", delete_character);

document.getElementById("Add_button").addEventListener("click", () => {
  let new_window = document.getElementById("New_scene_window");
  new_window.style.display = 'flex';
  new_window.style.pointerEvents = 'auto';
  new_window.style.visibility = 'visible';
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      let new_window = document.getElementById("New_scene_window");
      if (window.getComputedStyle(new_window).display === "flex") {
          new_window.style.display = "none";
          new_window.style.pointerEvents = "none";
          new_window.style.visibility = "hidden";
      }
    }
  });

document.getElementById("Delete_button").addEventListener("click", delete_scene);

document.getElementById("Confirm_button").addEventListener("click", add_new_scene);

document.getElementById("Next scene ID").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Background ID").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Change bg animation ID").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Change text animation").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Text animation priority").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Music ID").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Change music effect ID").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Sound ID").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Change sound effect ID").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Sound effect priority").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Character").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Ch image ID").addEventListener("change", () => { character_update(); });
document.getElementById("Ch image priority").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Ch coordinate x").addEventListener("input", () => { character_update();});
document.getElementById("Ch coordinate y").addEventListener("input", () => { character_update();});
document.getElementById("Ch spawn animation ID").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Ch spawn priority").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Ch idle animation ID").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Ch movement animation ID").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Ch movement priority").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Ch disappear animation ID").addEventListener("change", () => { saveAllToScene_info(); });
document.getElementById("Ch dissapear animation priority").addEventListener("change", () => { saveAllToScene_info(); });

document.getElementById("Text-panel").addEventListener("input", () => { saveAllToScene_info(); });

async function character_update(){
  saveAllToScene_info();

  character_start_load()
}

async function character_start_load(){
  let scene_id = document.getElementById("Scene ID").value;
  while (document.getElementById("Character-panel").firstChild) {
    document.getElementById("Character-panel").removeChild(document.getElementById("Character-panel").firstChild);
  }

  for (let char_num = 0; char_num < 4; char_num++){
    if (scene_info.get(scene_id)[12 + char_num * 12] != ""){
      let new_char = document.createElement("div");
      new_char.className = "character-block";     // присваиваем класс с CSS стилем

      let materials_dir = await tables_folder.getDirectoryHandle("Materials");
      let backgrounds_dir = await materials_dir.getDirectoryHandle("Character_images");
      let result = await backgrounds_dir.getFileHandle(scene_info.get(scene_id)[13 + char_num * 12] + ".png");
      let result_url = await result.getFile();
      new_char.style.backgroundImage = `url(${URL.createObjectURL(result_url)})`;
      new_char.style.zIndex = char_num + 1;
      let parent = document.getElementById("Character-panel");
      parent.appendChild(new_char);
      new_char.style.left = (parent.offsetWidth / 2 - new_char.offsetWidth / 2 + parseInt(scene_info.get(scene_id)[15 + char_num * 12]) + "px");
      new_char.style.top = (parent.offsetHeight / 2 - new_char.offsetHeight / 2 - parseInt(scene_info.get(scene_id)[16 + char_num * 12]) + "px");
      //new_char.style.left = scene_info.get(scene_id)[15 + char_num * 12] + "px";
      //new_char.style.top = scene_info.get(scene_id)[16 + char_num * 12] + "px";
    }
  }
}

async function delete_scene(){
  let allowed = await confirm("ВЫ собираетесь удалить сцену, это действие необратимо, вы уверены что хотите это сделать?")
  if (allowed){
    if (document.getElementById("Scene ID").children.length == 1){
      alert("Вы не можете удалить последнюю сцену!");
      return;
    }
    scene_info.delete(document.getElementById("Scene ID").value);
    text_info.delete(document.getElementById("Text ID").value);

    let scene_element = document.getElementById("Scene ID");
    let elements = scene_element.value.split("_");
    let id = elements[elements.length - 1]
    let id_int = parseInt(id) - 1;
    if (id_int <= 9)
      id = "0" + id_int.toString();
    else
      id = id_int.toString();
    let element_string = elements.slice(0, -1).join("_") + "_" + id;
    allowed = false;
    for (let child of scene_element.children){
      if (child.value == element_string){
        allowed = true
      }
    }
    if (allowed == true){
      AddOptions();
      scene_element.value = element_string;
      scene_Change(element_string);
      nextSceneAdd();
    }
    else{
      AddOptions();
      scene_element.value = scene_element.children[0].value;
      scene_Change(scene_element.children[0].value);
      nextSceneAdd();
    }
  }
}

async function add_new_scene(){
  let name_scene = document.getElementById("Name_input").value;
  if (name_scene.length > 20){
    alert("Введеная строка содержит более 20 символов.");
    return;
  }
  if (/[^a-zA-Z]/.test(name_scene)) {
    alert("Название сцены должно состоять только из букв на латинице, без других символов. Пример: MyFirstScene");
    return;
  }

  let new_window = document.getElementById("New_scene_window");
  new_window.style.display = 'none';
  new_window.style.pointerEvents = 'none';
  new_window.style.visibility = 'hidden';

  scene_ID = document.getElementById("Scene ID").value;

  let newArray = [...scene_info.get(scene_ID)];
  let maxNum = 0;
  for(let[key, value] of scene_info){
    if (value[0].includes("ID_" + name_scene)){
      let num_text = value[0].slice(("ID_" + name_scene + "_").length);
      let num = parseInt(num_text, 10);
      if(!isNaN(num) && num > maxNum)
        maxNum = num;
    }
  }
  let maxNum_string = null;
  if (maxNum >= 0 && maxNum <= 8){
    maxNum_string = "0" + (maxNum + 1).toString();
  }
  else{
    maxNum_string = (maxNum + 1).toString();
  }
  scene_info.set("ID_" + name_scene + "_" + maxNum_string, newArray);
  scene_info.get("ID_" + name_scene + "_" + maxNum_string, newArray)[0] = "ID_" + name_scene + "_" + maxNum_string;
  text_info.set("ID_" + name_scene + "_" + maxNum_string, ["ID_" + name_scene + "_" + maxNum_string, ""]);
  let text_id = document.getElementById("Text ID");
  AddOptions();
  document.getElementById(document.getElementById("Scene ID").value = "ID_" + name_scene + "_" + maxNum_string);
  scene_Change("ID_" + name_scene + "_" + maxNum_string);
  nextSceneAdd();
  document.getElementById("Text ID").value = "ID_" + name_scene + "_" + maxNum_string;
  document.getElementById("Text-panel").value = "";
  scene_info.get("ID_" + name_scene + "_" + maxNum_string)[4] = "ID_" + name_scene + "_" + maxNum_string;

  select = document.getElementById("Next scene ID");
  let elements = document.getElementById("Scene ID").value.split("_");
  let id = elements[elements.length - 1]
  let id_int = parseInt(id) + 1;
  if (id_int <= 9)
    id = "0" + id_int.toString();
  else
    id = id_int.toString();
  let element_string = elements.slice(0, -1).join("_") + "_" + id;
  select.value = element_string;
  //Остановился тут. Не могу установить Scene ID на значение, равное новому элементу, толи что-то мешает, толи что-то перезаписывает, думаю будет достаточно посмотреть на код свежим взглядом.
}

async function add_character(){
  if(document.getElementById("Current-characters").children.length == 4){
    alert("На сцене не может быть больше четырех персонажей!");
    return;
  }
  else{
    option = document.createElement("option");
    document.getElementById("Current-characters").appendChild(option)
    option.value = "New character" + document.getElementById("Current-characters").children.length;
    option.dataset.thisCharNum = document.getElementById("Current-characters").children.length - 1 ;
    option.textContent = "New character" + document.getElementById("Current-characters").children.length;
    option.classList.add("Option-text");
    document.getElementById("Current_char").dataset.currentCharId = option.dataset.thisCharNum;
    document.getElementById("Current-characters").value = option.value;
  }
  character_start_load();
}

async function delete_character(){
  let confirmAction = confirm("Вы собираетесь удалить текущего персонажа. До сохранения, это действие обратимо. Вы уверены что хотите это сделать?");
  if (confirmAction){
    for(let element of document.getElementById("Current-characters").children){
      if (element.dataset.thisCharNum == document.getElementById("Current_char").dataset.currentCharId) {
        scene_ID = document.getElementById("Scene ID").value;
        char_num = document.getElementById("Current_char").dataset.currentCharId;
        scene_info.get(scene_ID)[12 + char_num * 12] = "";
        scene_info.get(scene_ID)[13 + char_num * 12] = "";
        scene_info.get(scene_ID)[14 + char_num * 12] = "";
        scene_info.get(scene_ID)[15 + char_num * 12] = "";
        scene_info.get(scene_ID)[16 + char_num * 12] = "";
        scene_info.get(scene_ID)[17 + char_num * 12] = "";
        scene_info.get(scene_ID)[18 + char_num * 12] = "";
        scene_info.get(scene_ID)[19 + char_num * 12] = "";
        scene_info.get(scene_ID)[20 + char_num * 12] = "";
        scene_info.get(scene_ID)[21 + char_num * 12] = "";
        scene_info.get(scene_ID)[22 + char_num * 12] = "";
        scene_info.get(scene_ID)[23 + char_num * 12] = "";
        let has_character = false;
        if(element.dataset.thisCharNum){
          for (let child of document.getElementById("Current-characters").children){
            if (child.dataset.thisCharNum == (parseInt(element.dataset.thisCharNum) - 1).toString()){
              document.getElementById("Current_char").dataset.currentCharId = (parseInt(element.dataset.thisCharNum) - 1).toString();
              has_character = true
            }
          }
        }
        Character_change(scene_ID, document.getElementById("Current_char").dataset.currentCharId);
        document.getElementById("Current_char").value = document.getElementById("Character").value;
        element.remove();

        if (has_character == false){
          if (document.getElementById("Current-characters").length > 0) {
            document.getElementById("Current_char").dataset.currentCharId = document.getElementById("Current-characters").children[0].dataset.thisCharNum;
          }
          else{
            document.getElementById("Current_char").dataset.currentCharId = "0";
          }
        }
      }
    }
  }
  character_start_load();
}

async function start(event) {
  if (event.key === "Enter"){
    if(already_active == false){
      tables_folder = await window.showDirectoryPicker();
      if(tables_folder){
        already_active = true;
        await startOperations();
        await getCSVFiles();
      }
    }
  }
}

async function startOperations(){
  scene_change_object = document.getElementById("Scene ID");
  scene_change_object.addEventListener("change", () => {
    scene_Change(scene_change_object.value);
  });
  document.getElementById("Current-characters").addEventListener("change", () => {
    scene_change_object = document.getElementById("Scene ID");

    for (const option of document.getElementById("Current-characters").children) {
      if (option.value == document.getElementById("Current-characters").value){
            document.getElementById("Current_char").dataset.currentCharId = option.dataset.thisCharNum;
      }
    }
    Character_change(scene_change_object.value, parseInt(document.getElementById("Current_char").dataset.currentCharId, 10))
  });

  document.getElementById("Save_button").addEventListener("click", () => {
    let char_num = document.getElementById("Current-characters");
    for (let i = char_num.children.length - 1; i >= 0; i--) {
        if (document.getElementById("Character").value == char_num.children[i].value && document.getElementById("Character").value != char_num.value) {
            alert("Ошибка! Вы пытаетесь создать копию персонажа, который уже есть на сцене. Измените значение Character, что бы оно не пересекалось с другими, существующими на сцене персонажами")
            return;
        }
    }
    if (new_scene == true){
      let confirmAction = confirm("Сейчас вы работаете с новой сценой, вы уверены что хотите сохранить ее с текущими данными?");
      if (!confirmAction)
      return;
    }
    else {
      let confirmAction = confirm("После сохранения, процесс необратим. Вы уверены что хотите сохранить изменения?");
      if (!confirmAction)
      return;
      else
        EditScene()
    }
  });
}

async function saveAllToScene_info(){
  let scene_ID = document.getElementById("Scene ID").value;
  scene_info.get(scene_ID)[1] = document.getElementById("Next scene ID").value;
  scene_info.get(scene_ID)[2] = document.getElementById("Background ID").value;
  scene_info.get(scene_ID)[3] = document.getElementById("Change bg animation ID").value;
  //scene_info.get(scene_ID)[4] = document.getElementById("Text ID").value;
  scene_info.get(scene_ID)[5] = document.getElementById("Change text animation").value;
  scene_info.get(scene_ID)[6] = document.getElementById("Text animation priority").value;
  scene_info.get(scene_ID)[7] = document.getElementById("Music ID").value;
  scene_info.get(scene_ID)[8] = document.getElementById("Change music effect ID").value;
  scene_info.get(scene_ID)[9] = document.getElementById("Sound ID").value;
  scene_info.get(scene_ID)[10] = document.getElementById("Change sound effect ID").value;
  scene_info.get(scene_ID)[11] =  document.getElementById("Sound effect priority").value;

  let char_num = parseInt(document.getElementById("Current_char").dataset.currentCharId, 10)
  scene_info.get(scene_ID)[12 + char_num * 12] = document.getElementById("Character").value;
  scene_info.get(scene_ID)[13 + char_num * 12] = document.getElementById("Ch image ID").value;
  scene_info.get(scene_ID)[14 + char_num * 12] = document.getElementById("Ch image priority").value;
  scene_info.get(scene_ID)[15 + char_num * 12] = document.getElementById("Ch coordinate x").value;
  scene_info.get(scene_ID)[16 + char_num * 12] = document.getElementById("Ch coordinate y").value;
  scene_info.get(scene_ID)[17 + char_num * 12] = document.getElementById("Ch spawn animation ID").value;
  scene_info.get(scene_ID)[18 + char_num * 12] = document.getElementById("Ch spawn priority").value;
  scene_info.get(scene_ID)[19 + char_num * 12] = document.getElementById("Ch idle animation ID").value;
  scene_info.get(scene_ID)[20 + char_num * 12] = document.getElementById("Ch movement animation ID").value;
  scene_info.get(scene_ID)[21 + char_num * 12] = document.getElementById("Ch movement priority").value;
  scene_info.get(scene_ID)[22 + char_num * 12] = document.getElementById("Ch disappear animation ID").value;
  scene_info.get(scene_ID)[23 + char_num * 12] = document.getElementById("Ch dissapear animation priority").value;

  if(!text_info.has(scene_info.get(scene_ID)[4])){
    text_info.set(scene_info.get(scene_ID)[4], [scene_info.get(scene_ID)[4], ""]);
  }
  text_info.get(scene_info.get(scene_ID)[4])[1] = document.getElementById("Text-panel").value;
}

async function EditScene(){
  saveAllToScene_info();

  for (let [key, value] of scene_info) {
    for (let char_num = 0; char_num < 4; char_num++){
      let index1 = 15 + char_num * 12;
      let index2 = 16 + char_num * 12;

      if (value[12 + char_num * 12] != "") {
          value[index1] = Math.round(value[index1] * 2.7);
          value[index2] = Math.round(value[index2] * 2.7);
      }
    }
  }


  let scene_info_header = "Scene ID§Next scene ID§Background ID§Change bg animation ID§Text ID§Change text animation§Text animation priority§Music ID§Change music effect ID§Sound ID§Change sound effect ID §Sound effect priority§Character§Ch image ID§Ch image priority§Ch coordinate x§Ch coordinate y§Ch spawn animation ID §Ch spawn priority§Ch idle animation ID§Ch movement animation ID§Ch movement priority§Ch disappear animation ID§Ch dissapear animation priority§Character§Ch image ID§Ch image priority§Ch coordinate x§Ch coordinate y§Ch spawn animation ID §Ch spawn priority§Ch idle animation ID§Ch movement animation ID§Ch movement priority§Ch disappear animation ID§Ch dissapear animation priority§Character§Ch image ID§Ch image priority§Ch coordinate x§Ch coordinate y§Ch spawn animation ID §Ch spawn priority§Ch idle animation ID§Ch movement animation ID§Ch movement priority§Ch disappear animation ID§Ch dissapear animation priority§Character§Ch image ID§Ch image priority§Ch coordinate x§Ch coordinate y§Ch spawn animation ID §Ch spawn priority§Ch idle animation ID§Ch movement animation ID§Ch movement priority§Ch disappear animation ID§Ch dissapear animation priority"
  let lines = [scene_info_header];
  for (const [key, arr] of scene_info) {
    lines.push(arr.join("§").replaceAll("\r", ""));
  }

  let csv_text = lines.join("\n");
  tables_folder = await window.showDirectoryPicker();
  let csv_dir = await tables_folder.getDirectoryHandle("CSV");
  let csv_file = await csv_dir.getFileHandle("Scene_info.csv");


  let writable = await csv_file.createWritable();
  await writable.write(csv_text);
  await writable.close();

  let text_info_header = "ID§Text"
  lines = [text_info_header];
  for (const [key, arr] of text_info) {
    lines.push(arr.join("§"));
  }
  csv_text = lines.join("\n");
  csv_dir = await tables_folder.getDirectoryHandle("CSV");
  csv_file = await csv_dir.getFileHandle("Text_info.csv");
  writable = await csv_file.createWritable();
  await writable.write(csv_text);
  await writable.close();
}

async function getCSVFiles(){
  //Получение файла scene_info
  let csv_dir = await tables_folder.getDirectoryHandle("CSV");
  let csv_file = await csv_dir.getFileHandle("Scene_info.csv");
  let file = await csv_file.getFile();
  let text = await file.text();
  let lines = text.split("\n");
  scene_info = new Map();
  lines.slice(1).forEach(line =>{
    if (line != ""){
      let elements = line.split("§");
      scene_info.set(elements[0], elements);
    }
  });

  for (let [key, value] of scene_info) {
    for (let char_num = 0; char_num < 4; char_num++){
      let index1 = 15 + char_num * 12;
      let index2 = 16 + char_num * 12;
      if (key == "ID_TestScene_02")
        console.log(value[index1]);
      if (value[12 + char_num * 12] != "") {
          value[index1] = Math.round(value[index1] / 2.7);
          value[index2] = Math.round(value[index2] / 2.7);
      }
      if (key == "ID_TestScene_02")
        console.log(value[index1]);
    }
  }

  csv_file = await csv_dir.getFileHandle("Text_info.csv");
  file = await csv_file.getFile();
  text = await file.text();
  lines = text.split("\n");
  text_info = new Map();
  lines.slice(1).forEach(line =>{
    if (line != ""){
      elements = line.split("§");
      text_info.set(elements[0], elements);
    }
  });

  csv_file = await csv_dir.getFileHandle("Characters_info.csv");
  file = await csv_file.getFile();
  text = await file.text();
  lines = text.split("\n");
  characters_info = new Map();
  lines.slice(1).forEach(line =>{
    if (line != ""){
      elements = line.split("§");
      characters_info.set(elements[0], elements);
    }
  });


  csv_file = await csv_dir.getFileHandle("Change_bg_info.csv");
  file = await csv_file.getFile();
  text = await file.text();
  lines = text.split("\n");
  change_bg_info = new Map();
  lines.slice(1).forEach(line =>{
    if (line != ""){
      elements = line.split("§");
      change_bg_info.set(elements[0], elements);
    }
  });

  csv_file = await csv_dir.getFileHandle("Change_music_info.csv");
  file = await csv_file.getFile();
  text = await file.text();
  lines = text.split("\n");
  change_music_info = new Map();
  lines.slice(1).forEach(line =>{
    if (line != ""){
      elements = line.split("§");
      change_music_info.set(elements[0], elements);
    }
  });

  csv_file = await csv_dir.getFileHandle("Change_sound_info.csv");
  file = await csv_file.getFile();
  text = await file.text();
  lines = text.split("\n");
  change_sound_info = new Map();
  lines.slice(1).forEach(line =>{
    if (line != ""){
      elements = line.split("§");
      change_sound_info.set(elements[0], elements);
    }
  });

  csv_file = await csv_dir.getFileHandle("Change_text_info.csv");
  file = await csv_file.getFile();
  text = await file.text();
  lines = text.split("\n");
  change_text_info = new Map();
  lines.slice(1).forEach(line =>{
    if (line != ""){
      elements = line.split("§");
      change_text_info.set(elements[0], elements);
    }
  });

  csv_file = await csv_dir.getFileHandle("Character_disappear_info.csv");
  file = await csv_file.getFile();
  text = await file.text();
  lines = text.split("\n");
  character_disappear_info = new Map();
  lines.slice(1).forEach(line =>{
    if (line != ""){
      elements = line.split("§");
      character_disappear_info.set(elements[0], elements);
    }
  });

  csv_file = await csv_dir.getFileHandle("Character_idle_info.csv");
  file = await csv_file.getFile();
  text = await file.text();
  lines = text.split("\n");
  character_idle_info = new Map();
  lines.slice(1).forEach(line =>{
    if (line != ""){
      elements = line.split("§");
      character_idle_info.set(elements[0], elements);
    }
  });

  csv_file = await csv_dir.getFileHandle("Character_movement_info.csv");
  file = await csv_file.getFile();
  text = await file.text();
  lines = text.split("\n");
  character_movement_info = new Map();
  lines.slice(1).forEach(line =>{
    if (line != ""){
      elements = line.split("§");
      character_movement_info.set(elements[0], elements);
    }
  });

  csv_file = await csv_dir.getFileHandle("Character_spawn_info.csv");
  file = await csv_file.getFile();
  text = await file.text();
  lines = text.split("\n");
  character_spawn_info = new Map();
  lines.slice(1).forEach(line =>{
    if (line != ""){
      elements = line.split("§");
      character_spawn_info.set(elements[0], elements);
    }
  });

  let materials_dir = await tables_folder.getDirectoryHandle("Materials");
  let image_dir = await materials_dir.getDirectoryHandle("Character_images");
  for await (const image of image_dir.values()) {
    if (image.kind === "file" && image.name.endsWith(".png")) {
      character_images.push(await image.getFile());
    }
  }

  let backgrounds_dir = await materials_dir.getDirectoryHandle("Backgrounds");
  for await (const image of backgrounds_dir.values()) {
    if (image.kind === "file" && image.name.endsWith(".jpg")) {
      background_images.push(await image.getFile());
    }
  }

  let musics_dir = await materials_dir.getDirectoryHandle("Musics");
  for await (const music of musics_dir.values()) {
    if (music.kind === "file" && music.name.endsWith(".mp3")) {
      musics.push(await music.getFile());
    }
  }

  let sounds_dir = await materials_dir.getDirectoryHandle("Sounds");
  for await (const sound of sounds_dir.values()) {
    if (sound.kind === "file" && sound.name.endsWith(".mp3")) {
      sounds.push(await sound.getFile());
    }
  }

  scene_info.forEach((value, key) => {
    for (i = 0; i < 4; i++){
      const name = value[12 + 12 * i];
      if (name != "" && !characters.includes(name)) {
        characters.push(name);
      }
      }
  });

  await AddOptions();
  scene_element = document.getElementById("Scene ID");
  scene_element.value = scene_element.children[0].value
  await scene_Change(scene_element.value);
}

async function nextSceneAdd(){
  //Добавление следующей сцены
  select = document.getElementById("Next scene ID");
  let elements = document.getElementById("Scene ID").value.split("_");
  let id = elements[elements.length - 1]
  let id_int = parseInt(id) + 1;
  if (id_int <= 9)
    id = "0" + id_int.toString();
  else
    id = id_int.toString();
  let element_string = elements.slice(0, -1).join("_") + "_" + id;
  for (let child of select.children){
    if (child.value == element_string)
      return;
  }
  let option = document.createElement("option");
  option.value = element_string;
  option.textContent = element_string;
  option.classList.add("Option-text");
  select.appendChild(option);
  //*******************
}

async function AddOptions(){
  let select = document.getElementById("Scene ID");
  DeleteChildren(select);
  scene_info.forEach((value, key) => {
    if (key != ""){
      let option = document.createElement("option");
      option.value = key.trim();
      option.textContent = key;
      option.classList.add("Option-text");
      select.appendChild(option)
    }
  });

  select = document.getElementById("Next scene ID");
  DeleteChildren(select);
  scene_info.forEach((value, key) => {
    if (key != ""){
      option = document.createElement("option");
      option.value = key.trim();
      option.textContent = key;
      option.classList.add("Option-text");
      select.appendChild(option);
    }
  });

  nextSceneAdd();

  select = document.getElementById("Background ID");
  DeleteChildren(select);
  background_images.forEach(file => {
    option = document.createElement("option");
    option.value = file.name.replace(".jpg", "");
    option.textContent = file.name.replace(".jpg", "");
    option.classList.add("Option-text");
    select.appendChild(option)
  });

  select = document.getElementById("Change bg animation ID");
  DeleteChildren(select);
  change_bg_info.forEach((value, key) => {
    if (key != ""){
      option = document.createElement("option");
      option.value = key.trim();
      option.textContent = key;
      option.classList.add("Option-text");
      select.appendChild(option)
    }
  });

  select = document.getElementById("Text ID");
  DeleteChildren(select);
  text_info.forEach((value, key) => {
    option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    option.classList.add("Option-text");
    select.appendChild(option)
  });

  select = document.getElementById("Change text animation");
  DeleteChildren(select);
  change_text_info.forEach((value, key) => {
    if (key != ""){
      option = document.createElement("option");
      option.value = key.trim();
      option.textContent = key;
      option.classList.add("Option-text");
      select.appendChild(option)
    }
  });

  select = document.getElementById("Music ID");
  DeleteChildren(select);
  musics.forEach(file => {
    option = document.createElement("option");
    option.value = file.name.replace(".mp3", "");
    option.textContent = file.name.replace(".mp3", "");
    option.classList.add("Option-text");
    select.appendChild(option)
  });

  select = document.getElementById("Change music effect ID");
  DeleteChildren(select);
  change_music_info.forEach((value, key) => {
    if (key != ""){
      option = document.createElement("option");
      option.value = key.trim();
      option.textContent = key;
      option.classList.add("Option-text");
      select.appendChild(option)
    }
  });

  select = document.getElementById("Sound ID");
  DeleteChildren(select);
  sounds.forEach(file => {
    option = document.createElement("option");
    option.value = file.name.replace(".mp3", "");
    option.textContent = file.name.replace(".mp3", "");
    option.classList.add("Option-text");
    select.appendChild(option)
  });

  select = document.getElementById("Change sound effect ID");
  DeleteChildren(select);
  change_sound_info.forEach((value, key) => {
    if (key != ""){
      option = document.createElement("option");
      option.value = key.trim();
      option.textContent = key;
      option.classList.add("Option-text");
      select.appendChild(option)
    }
  });

  select = document.getElementById("Character");
  DeleteChildren(select);
  characters_info.forEach(str => {
    if (str != undefined){
      option = document.createElement("option");
      let this_string = str.toString();
      option.value = this_string.replaceAll("\r", "");
      option.textContent = this_string.replaceAll("\r", "");
      option.classList.add("Option-text");
      select.appendChild(option)
    }
  });

  select = document.getElementById("Ch image ID");
  DeleteChildren(select);
  character_images.forEach(file => {
    option = document.createElement("option");
    option.value = file.name.replace(".png", "");
    option.textContent = file.name.replace(".png", "");
    option.classList.add("Option-text");
    select.appendChild(option)
  });

  select = document.getElementById("Ch spawn animation ID");
  DeleteChildren(select);
  character_spawn_info.forEach((value, key) => {
    if (key != ""){
      option = document.createElement("option");
      option.value = key.trim();
      option.textContent = key;
      option.classList.add("Option-text");
      select.appendChild(option)
    }
  });

  select = document.getElementById("Ch idle animation ID");
  DeleteChildren(select);
  character_idle_info.forEach((value, key) => {
    if (key != ""){
      option = document.createElement("option");
      option.value = key.trim();
      option.textContent = key;
      option.classList.add("Option-text");
      select.appendChild(option)
    }
  });

  select = document.getElementById("Ch movement animation ID");
  DeleteChildren(select);
  character_movement_info.forEach((value, key) => {
    if (key != ""){
      option = document.createElement("option");
      option.value = key.trim();
      option.textContent = key;
      option.classList.add("Option-text");
      select.appendChild(option)
    }
  });

  select = document.getElementById("Ch disappear animation ID");
  DeleteChildren(select);
  character_disappear_info.forEach((value, key) => {
    if (key != ""){
      option = document.createElement("option");
      option.value = key.trim();
      option.textContent = key;
      option.classList.add("Option-text");
      select.appendChild(option)
    }
  });
}

async function scene_Change(scene_ID){
  if (scene_ID != current_scene){
    select = document.getElementById("Next scene ID");
    let next_scene = true;
    for (let child of select.children){
      if (child.value == scene_info.get(scene_ID)[1])
        next_scene = false
    }
    if (next_scene == false){
      select.value = scene_info.get(scene_ID)[1];
    }
    else{
      option = document.createElement("option");
      option.value = scene_info.get(scene_ID)[1].trim();
      option.textContent = scene_info.get(scene_ID)[1];
      option.classList.add("Option-text");
      select.appendChild(option);
      select.value = scene_info.get(scene_ID)[1];
    }
    select = document.getElementById("Background ID");
      select.value = scene_info.get(scene_ID)[2];
    select = document.getElementById("Change bg animation ID");

      select.value = scene_info.get(scene_ID)[3];
    select = document.getElementById("Text ID");
      select.value = scene_info.get(scene_ID)[4];
    select = document.getElementById("Change text animation");
      select.value = scene_info.get(scene_ID)[5];
      select = document.getElementById("Text animation priority");
        select.value = scene_info.get(scene_ID)[6];
    select = document.getElementById("Music ID");
      select.value = scene_info.get(scene_ID)[7];
    select = document.getElementById("Change music effect ID");
        select.value = scene_info.get(scene_ID)[8];
    select = document.getElementById("Sound ID");
        select.value = scene_info.get(scene_ID)[9];
    select = document.getElementById("Change sound effect ID");
      select.value = scene_info.get(scene_ID)[10];
      select = document.getElementById("Sound effect priority");
        select.value = scene_info.get(scene_ID)[11];

      document.getElementById("Current_char").dataset.currentCharId = "0";
      select = document.getElementById("Current-characters");
      DeleteChildren(select);
      for (let i = 12; i <= 48; i += 12){
        if (scene_info.get(scene_ID)[i] != ""){
          option = document.createElement("option");
          option.value = scene_info.get(scene_ID)[i];
          option.dataset.thisCharNum = i / 12 - 1;
          option.textContent = scene_info.get(scene_ID)[i];
          option.classList.add("Option-text");
          select.appendChild(option)
        }
      }
    VisualRefreash();
    Character_change(scene_ID, parseInt(document.getElementById("Current_char").dataset.currentCharId, 10));
    character_start_load();
  }
}

async function Character_change(scene_ID, char_num){
  select = document.getElementById("Character");


  select.value = scene_info.get(scene_ID)[12 + char_num * 12];

  select = document.getElementById("Ch image ID");
  select.value = scene_info.get(scene_ID)[13 + char_num * 12];
  select = document.getElementById("Ch image priority");
  select.value = scene_info.get(scene_ID)[14 + char_num * 12];

  select = document.getElementById("Ch coordinate x");
  select.value = scene_info.get(scene_ID)[15 + char_num * 12];

  select = document.getElementById("Ch coordinate y");
  select.value = scene_info.get(scene_ID)[16 + char_num * 12];

  select = document.getElementById("Ch spawn animation ID");
  select.value = scene_info.get(scene_ID)[17 + char_num * 12];

  select = document.getElementById("Ch spawn priority");
  select.value = scene_info.get(scene_ID)[18 + char_num * 12];

  select = document.getElementById("Ch idle animation ID");
  select.value = scene_info.get(scene_ID)[19 + char_num * 12];
  select = document.getElementById("Ch movement animation ID");
  select.value = scene_info.get(scene_ID)[20 + char_num * 12];
  select = document.getElementById("Ch movement priority");
  select.value = scene_info.get(scene_ID)[21 + char_num * 12];
  select = document.getElementById("Ch disappear animation ID");
  select.value = scene_info.get(scene_ID)[22 + char_num * 12];

  select = document.getElementById("Ch dissapear animation priority");
  select.value = scene_info.get(scene_ID)[23 + char_num * 12];

  character_start_load();
}

async function VisualRefreash(){
  let materials_dir = await tables_folder.getDirectoryHandle("Materials");

  let background = document.getElementById("Background-panel");
  let backgrounds_dir = await materials_dir.getDirectoryHandle("Backgrounds");
  let result = await backgrounds_dir.getFileHandle(document.getElementById("Background ID").value + ".jpg");
  let result_url = await result.getFile();
  background.style.backgroundImage = `url(${URL.createObjectURL(result_url)})`;

  let text = document.getElementById("Text-panel");
  let text_id = document.getElementById("Text ID");
  text.value = text_info.get(text_id.value)[1];
}

async function DeleteChildren(select){
  for (let i = select.children.length - 1; i >= 0; i--) {
      if (select.children[i].tagName === "OPTION") {
          select.removeChild(select.children[i]);
      }
  }
}

async function background_refreash(){
  let materials_dir = await tables_folder.getDirectoryHandle("Materials");

  let background = document.getElementById("Background-panel");
  let backgrounds_dir = await materials_dir.getDirectoryHandle("Backgrounds");
  let result = await backgrounds_dir.getFileHandle(document.getElementById("Background ID").value + ".jpg");
  let result_url = await result.getFile();
  background.style.backgroundImage = `url(${URL.createObjectURL(result_url)})`;
}
