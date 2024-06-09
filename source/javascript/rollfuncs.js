/**
 * Function that extracts the information of which roll was clicked from the name of the button.
 * @param {string} string - The triggerName to be parsed
 * @returns {array} - Returns an array containing the repeating section name, the row id, and the field that is referenced.
 */
const extractRollInfo = function(string){
    //Get the information on which button was clicked.
    const [section,id,button] = k.parseTriggerName(string);
    //Convert the button name into the name of the relevant attribute (e.g. saving-throw => saving_throw). Also removes the `-action` suffix of the action button to get the raw field name.
    const field = button.replace(/\-?action/,'');
    return [section,id,field];
  };

const rollAttribute = async function(event){
    const[section,id,field] = extractRollInfo(event.triggerName);
    const attributeRef = attributeNames.indexOf(field);
    k.debug(attributeRef);
    //TODO: Utilize add pool from field
    const message = "/roll 1d20"
    const roll = await startRoll(message);

     //An object to aggregate the changes that need to be made to what is displayed in the roll output.
    const computeObj = {};
    //If the roll contained a result, target, and roll field with an inline roll in them, then we want to compare the roll and target values to determine if the result was a success or failure.
    k.debug({roll});
    if(roll.results.result && roll.results.target && roll.results.roll){
        computeObj.result = roll.results.roll.result >= roll.results.target ? 1 : 0;
    }
     //Now we finish our roll, which tells Roll20 to actually display it in chat.
    finishRoll(roll.rollId,computeObj);
}
k.registerFuncs(rollAttribute);