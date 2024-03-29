import { reloadDirectory, setDir } from "../../AssetPanel/fileManager.js";
import { calcSize } from "../../Canvas/canvasSizer.js";
import {
  globalOffsetX,
  globalOffsetY,
  setGlobalOffsetX,
  setGlobalOffsetY,
} from "../../Objects/Object.js";
import {
  convertToGameCoords,
  convertToScreenCoords,
  getObject,
  objects,
} from "../../Objects/ObjectManager.js";
import {
  reloadObjectSelection,
  selectedObject,
} from "../../Objects/ObjectsTab.js";
import {
  DragRect,
  fill,
  game,
  inArea,
  isKeyPressed,
  keyDown,
  keyPressed,
  mouseButton,
  mouseDown,
  mousePressed,
  mouseX,
  mouseY,
  pressedMouseStartX,
  pressedMouseStartY,
  rect,
  removeCanvasOffset,
  setCursor,
} from "../../toolbox.js";
const outlineWidth = 2;

//for helping you drag around the objects in the editor
let dragoffsetXSave = 0;
let dragoffsetYSave = 0;

let objectDragOffsetX = 0;
let objectDragOffsetY = 0;
//get a css variable
function getCssVariable(variable) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
}

let cornerTopLeftDragHandle = new DragRect(
  getCssVariable("--highlight1"),
  (x, y, parent) => {
    if(mouseDown){
      //set the selected objects x
      let gameCoords = convertToGameCoords(x - globalOffsetX, y - globalOffsetY);
      let parentOffsets = convertToGameCoords(getObject(selectedObject).getParentOffsetX(), getObject(selectedObject).getParentOffsetY());


      getObject(selectedObject).setX(gameCoords.x - parentOffsets.x);
      getObject(selectedObject).setY(gameCoords.y - parentOffsets.y);
      reloadObjectSelection();
    }
    //set the selected objects y
    //getObject(selectedObject).setY(y);

    //parent.x = 0;
    //parent.y = 0;
  }
);

export let gameVisualEditor = {
  init: () => {},
  loop: (tick) => {
    game.clear();

    //detect mouse drag
    if (mouseDown) {
      if (mouseButton == "MIDDLE") {
        if (mousePressed) {
          dragoffsetXSave = globalOffsetX;
          dragoffsetYSave = globalOffsetY;
          setCursor("grabbing");
        }

        //console.log(mouseX - pressedMouseStartX, mouseY - pressedMouseStartY);
        setGlobalOffsetX(dragoffsetXSave + (mouseX - pressedMouseStartX));
        setGlobalOffsetY(dragoffsetYSave + (mouseY - pressedMouseStartY));
      }
    }

    //detect key press
    if (keyDown) {
      //console.log(keyPressed);

      //The numpad 0 key OR ` key
      if (keyPressed == 73 || keyPressed == 96) {
        // reset the offset to 0,0
        setGlobalOffsetX(0);
        setGlobalOffsetY(0);
      }
      //if (isKeyPressed("")) {
      //delete the selected object
      //objects.delete(selectedObject);
      //reloadObjectSelection();
      //}
    }

    fill(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--background"
      )
    );

    rect(
      convertToScreenCoords(0, 0).x + globalOffsetX,
      convertToScreenCoords(0, 0).y + globalOffsetY,
      convertToScreenCoords(100, 0).x,
      convertToScreenCoords(0, 100).y
    );

    let selectedObj = getObject(selectedObject);
    //Selection outline
    if (selectedObj != undefined) {
      fill(getCssVariable("--highlight1"));

      /*rect(
        parseInt(selectedObj.getX()) - outlineWidth,
        parseInt(selectedObj.getY()) - outlineWidth,
        parseInt(selectedObj.getW()) + outlineWidth * 2,
        parseInt(selectedObj.getH()) + outlineWidth * 2
      );*/

      rect(
        parseInt(selectedObj.getGlobalOffsetX() - 4),
        parseInt(selectedObj.getGlobalOffsetY() - 4),
        parseInt(selectedObj.getW() + 8),
        parseInt(selectedObj.getH() + 8)
      );

      //for grabbing and dragging the object

      let relativeCoords = removeCanvasOffset(mouseX, mouseY);

      cornerTopLeftDragHandle.run(
        selectedObj.getGlobalOffsetX(),
        selectedObj.getGlobalOffsetY(),
        selectedObj.getW(),
        selectedObj.getH()
      );
    }

    //render the root, this will render all the children
    //getObject("root").render();

    objects.forEach((object) => {
      if (object.getParentObjectId() == "root") object.render();
    });
  },
  onChange: (tabId, tabName, extraData) => {
    document.getElementById("GameEditorPanel").style.display = "inline";
    setTimeout(() => {
      calcSize();
      reloadDirectory();
    }, 10);
  },
  onLeave: (tabId, tabName, extraData) => {
    document.getElementById("GameEditorPanel").style.display = "none";
  },
};
