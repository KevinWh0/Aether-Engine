import { readFile, uploadFile } from "../AssetPanel/FileUpload/uploadSaver.js";
import { addInfoPopup, popupTypes } from "../Popups/popupManager.js";
import { loadProject, saveProject } from "./saveManager.js";

export function setupSaveButtonHandlers() {
  let saveButtons = Array.from(document.getElementsByClassName("saveProject"));
  let loadButtons = Array.from(document.getElementsByClassName("loadProject"));
  let uploadButtons = Array.from(
    document.getElementsByClassName("uploadProject")
  );
  let downloadButtons = Array.from(
    document.getElementsByClassName("downloadProject")
  );
  saveButtons.forEach((e) => {
    e.addEventListener("click", (evnt) => {
      saveProject();
    });
  });

  loadButtons.forEach((e) => {
    e.addEventListener("click", (evnt) => {
      loadProject();
    });
  });

  uploadButtons.forEach((e) => {
    e.addEventListener("click", (evnt) => {
      uploadFile((files) => {
        if (files.length < 1) return;
        let file = files[0];
        readFile(file, (text) => {
          try {
            loadProject(Flatted.parse(text));
          } catch (err) {
            addInfoPopup(
              "Error",
              `Error When loading file\n ${err}`,
              popupTypes.ERROR
            );
          }
        });
      });
    });
  });

  downloadButtons.forEach((e) => {
    e.addEventListener("click", (evnt) => {
      saveProject("project", true);
    });
  });
}
