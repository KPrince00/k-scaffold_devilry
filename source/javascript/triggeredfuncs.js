/**
 * A function that toggles the `.active` class on elements based on which tab of the sheet is currently selected. Note that the display changes caused by this are client side only and are not sync'd across users except when the sheet is opened by a user.
 * @param {object} trigger - The trigger object as stored in the k-scaffold's cascades object.
 * @param {object} attributes - The attributes object as returned from `getAllAttrs` and used in the default K-scaffold event cascade.
 * @returns {void}
 */
const navigateSheet = function({trigger,attributes}){
    let name = trigger ?
      trigger.name :
      attributes.sheet_state;//The trigger property is not passed when this function is called on sheet:opened. So, we need to get the current sheet state out of memory in that case.
    let [,,page] = k.parseTriggerName(name);//Parse out the name of the navigation button that was clicked.
    page = page.replace(/^nav-|-action$/g,'');//Remove the navigation and action button specific pieces of the button name to leave us with just the name of the button, which ideally is the same as a CSS class that we want to apply `.active` to.
    navButtons.forEach((button)=>{//iterate through all the navigation buttons. navButtons is exported to our JS by the K-scaffold.
      let element = button.replace(/-action/,'');//sanitize the button name down until we get just the target class name.
      $20(`.${element}`).removeClass('active');//Remove the active class from all elements with the indicated class (e.g. .character)
    });
    $20(`.${page}`).addClass('active');//Add .active back to the elements that we are actually navigating to. We do this outside of the loop so that we can properly handle elements that may have more than one navigation class applied to them, although we don't have any of these in this sheet setup.
    attributes.sheet_state = page;//Store the new page selection in our sheet_state attribute so that it will be remembered when the sheet is opened again.
  };
  k.registerFuncs({navigateSheet},{type:['opener']});//Register the function. Note that we are using a new argument with registerFuncs. The second object here is the options object where we can define what type of function this is. See the K-scaffold documentation for more information on the available types.

  