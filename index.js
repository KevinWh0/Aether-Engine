import { initAssetManager } from "./scripts/AssetPanel/FileUpload/uploadManager.js";
import { initCanvasSizer } from "./scripts/Canvas/canvasSizer.js";
import { addEmptyObject } from "./scripts/Objects/ObjectManager.js";
import {
  renderSidebarObjects,
  selectedObject,
} from "./scripts/Objects/ObjectsTab.js";
import {
  addInfoPopup,
  addPopup,
  getPopup,
  getPopupByName,
  popupTypes,
} from "./scripts/Popups/popupManager.js";
import { initRightClickMenuManager } from "./scripts/RightClickMenu/rightClickMenuManager.js";
import { setupSaveButtonHandlers } from "./scripts/SaveProject/saveProjectButtonManager.js";
import {
  getOpenTab,
  init as initTabManager,
  setActiveTab,
} from "./scripts/Tabs/tabManager.js";
import { runTabs } from "./scripts/Tabs/tabRunner.js";
import {
  download,
  game,
  readTextFile,
  setLoopFunc,
} from "./scripts/toolbox.js";
import {} from "./scripts/flatted.min.js";
import { compileCurrentProject } from "./scripts/Compiler/compilerManager.js";
import { loadProject } from "./scripts/SaveProject/saveManager.js";
import {
  listenForErrors,
  resetErrorManager,
} from "./scripts/Compiler/errorManager.js";
import { playTestGame } from "./scripts/Compiler/GameTesterWindowManager.js";
import { clearConsole } from "./scripts/Tabs/tabCode/consoleTab.js";

//Version: major.minor.patch
const version = "0.2.4";

console.info(`Aether Engine v${version}`);
console.info("Github: https://github.com/KevinWh0/Aether-Engine");

game.start();

initTabManager();
setLoopFunc(runTabs);
renderSidebarObjects();
initRightClickMenuManager();
initCanvasSizer();
initAssetManager();
setupSaveButtonHandlers();
document.getElementById("AddObject").addEventListener("click", () => {
  addEmptyObject(selectedObject);
});
document.getElementById("more").addEventListener("click", () => {
  document.getElementById("dropdownMenu").classList.toggle("hidden");
});

// window.onload = () => {
//   //automatically click the load button and click the top one
//   document.getElementById("welcomeLoad").click();
//   //loop though all the loadsaves
//   [...document.getElementsByClassName("loadSave")]
//     .filter((button) => {
//       try {
//         if (button.getAttribute("loadName") == "AetherEngineSave-Demo")
//           return true;
//       } catch (e) {}
//       return false;
//     })[0]
//     .click();
// };

document.getElementById("newProject").addEventListener("click", () => {
  //close the welcome tab and switch to the project tab
  getOpenTab().close();
  setActiveTab("EditorId");
});
let win;
document.getElementById("play").addEventListener("click", async () => {
  clearConsole();
  resetErrorManager();
  playTestGame();
  // //launch a new window and inject the game
  // if (win) win.close();
  // //console.log(win.closed);
  // win = window.open("", "", "width=1280,height=720");
  // let code = await compileCurrentProject(false);
  // //download(code, "AetherEngineSave-Demo.html");
  // win.document.open();
  // win.document.write(code);
  // win.document.close();

  // //make a loop checking that its still open
  // setInterval(() => {
  //   if (!win.closed) {
  //   } else {
  //     //cancel the interval
  //     clearInterval(this);
  //   }
  // }, 1000);
});

listenForErrors();

window.onload = async () => {
  let urlParts = window.location.href.split("/")[3].substring(1).split("#");
  urlParts.forEach(async (part) => {
    part = part.split("=");

    if (part[0] == "localProject") {
      //convert part[1] from url safe to unicode
      let decoded = decodeURIComponent(part[1]);
      //pull the decoded name from localstorage
      let project = localStorage.getItem("AetherEngineSave-" + decoded);
      //if the project doesnt exist, throw an error
      if (project == null) {
        addInfoPopup(
          "Error",
          `Error Loading Project In URL.<br/> Project "${decoded}" does not exist`,
          popupTypes.ERROR
        );

        return;
      }
      //load the project
      loadProject(Flatted.parse(project));

      //switch tabs to the editor
      document.getElementById("EditorId").click();
    }
    //load the demo projects
    else if (part[0] == "demo") {
      let project = await readTextFile("demoProjects/" + part[1] + ".json");
      //load the project
      loadProject(Flatted.parse(project));

      //switch tabs to the editor
      document.getElementById("EditorId").click();
    }
  });

  //await loadProject("AetherEngineSave-Demo");
};

/*
addInfoPopup(
  "Rick Roll!",
  `
  Never gonna give you up
  Never gonna let you down
  Never gonna run around and desert you
  Never gonna make you cry
  Never gonna say goodbye
  Never gonna tell a lie and hurt you
  
  Never gonna give you up
  Never gonna let you down
  Never gonna run around and desert you
  Never gonna make you cry
  Never gonna say goodbye
  Never gonna tell a lie and hurt you`
);
*/
