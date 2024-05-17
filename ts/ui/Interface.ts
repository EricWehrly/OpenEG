import EventTypes from "../core/EventTypes";
import Events from "../core/Events";
import Character from "../gameObjects/Character";
import { Tile } from "../gameObjects/Tile";

const Interface = {
    selectedCharacter: null as Character | null
}

export default Interface;

Events.Subscribe(EventTypes.CharacterClicked, (character: Character) => {
    Interface.selectedCharacter = character;
    console.log(`Character selected:`, character);
});

Events.Subscribe(EventTypes.TileClicked, (tile: Tile) => {
    if(Interface.selectedCharacter) {
        Interface.selectedCharacter.position = tile.position;
    }
});
