// This code adapted from Nic Bradley's R20 test framework from the WFRP4e official sheet.
import { vi } from 'vitest';
import { _ } from 'underscore';
import translation from './translation.json' assert {type:'json'}

/**
 * @namespace {object} mock20
 */
/**
 * @memberof mock20
 * @var
 * A mock environment variable for keeping track of triggers, other character information, and predefined query results.
 * @property {array} triggers - The triggers that have been registered by `on`
 * @property {object} queryResponses - Pre defined results you want the roll parser to use for a given roll query. Keys in the objects are roll query prompts. Values are what the user input should be for that query.
 */
const environment = {
  attributes:{"sheet_version":"0","devilry_tab":"nav-tabs-devilry--statistics","character_name":"","species":"","predator":"","fear":"","concept":"","bane":"","severity":"","nature-demeanor":"","xp":"","body":"1","underline-body":"0","mind":"1","underline-mind":"0","spirit":"1","underline-spirit":"0","speed":"1","underline-speed":"0","willpower":"1","underline-willpower":"0","athletics":"1","underline-athletics":"0","run":"","swim":"","throw":"","climb":"","combat":"1","underline-combat":"0","weapon":"","brawl":"","block":"","":"","acrobatics":"1","underline-acrobatics":"0","jump":"","dodge":"","stunt":"","dexterity":"1","underline-dexterity":"0","pilot":"","sneak":"","deft":"","reason":"1","underline-reason":"0","firearm":"","navigation":"","survival":"","know":"1","underline-know":"0","nature":"","history":"","occult":"","invest":"","tech":"1","underline-tech":"0","coding":"","security":"","repair":"","medicine":"1","underline-medicine":"0","surgery":"","first_aid":"","diagnosis":"","perception":"1","underline-perception":"0","notice":"","track":"","insight":"","resolve":"1","underline-resolve":"0","leadership":"","intimidate":"","endure":"","personal":"1","underline-personal":"0","etiquette":"","streetwise":"","politics":"","charm":"1","underline-charm":"0","perform":"","persuade":"","decieve":"","hp-max":"","hp-curr":"","hit-die-current)":"","hit-die-max)":"","regen":"","humanity":"1","underline-humanity":"0","homog-bonus":"","mortal-pen":"","hunger":"1","underline-hunger":"0","age":"","height":"","weight":"","eyes":"","skin":"","hair":"","convictions":"","touchstones":"","tenets":"","pride":"","pride-toggle":0,"item":"","allies":"","backstory":"","contracts":"","inventory":"","traits":"","fear-name":"","blood-max":"","blood-cur":"","Innate_Domain1name":"Innate Domain","Innate_Domain1level":"","Innate_Domain2name":"Innate Domain","Innate_Domain2level":"","Innate_Domain3name":"Innate Domain","Innate_Domain3level":"","Learned_Domain4name":"Learned Domain","Learned_Domain4level":"","Learned_Domain5name":"Learned Domain","Learned_Domain5level":"","Learned_Domain6name":"Learned Domain","Learned_Domain6level":"","True_Form":"","Homogenized":"","General":"","Apparel":"","Notable_Features":"","template_start":"@{whisper}&{template:Devilry_(V1)} {{character_name=@{character_name}}} {{character_id=@{character_id}}}"},
  triggers: [],
  translation,
  otherCharacters: {
    // Attribute information of other test characters indexed by character name
  },
  queryResponses:{
    // object defining which value to use for roll queries, indexed by prompt text
  }
};
global.environment = environment;

const on = vi.fn((trigger, func) => {
  environment.triggers.push({ trigger, func });
});
global.on = on;
const getAttrs = vi.fn((query, callback) => {
  let values = {};
  for (const attr of query) {
    if (attr in environment.attributes) values[attr] = environment.attributes[attr];
  }
  if (typeof callback === "function") callback(values);
});
global.getAttrs = getAttrs;
const setAttrs = vi.fn((submit, params, callback) => {
  if (!callback && typeof params === "function") callback = params;
  for (const attr in submit) {
    environment.attributes[attr] = submit[attr];
  }
  if (typeof callback === "function") callback();
});
global.setAttrs = setAttrs;
const getSectionIDs = vi.fn((section, callback) => {
  const ids = [];
  const sectionName = section.indexOf("repeating_") === 0 ? section : `repeating_${section}`;
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(sectionName) === 0) ids.push(attr.split("_")[2]);
  }
  const idMap = [...new Set(ids)];
  if (typeof callback === "function") callback(idMap);
});
global.getSectionIDs = getSectionIDs;
const getSectionIDsSync = vi.fn((section) => {
  const ids = [];
  const sectionName = section.indexOf("repeating_") === 0 ? section : `repeating_${section}`;
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(sectionName) === 0) ids.push(attr.split("_")[2]);
  }
  const idMap = [...new Set(ids)];
  return idMap;
});
global.getSectionIDsSync = getSectionIDsSync;
const removeRepeatingRow = vi.fn((id) => {
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(id) > -1) delete environment.attributes[attr];
  }
});
global.removeRepeatingRow = removeRepeatingRow;
const getCompendiumPage = vi.fn((request, callback) => {
  const pages = compendiumData;
  if (!pages)
    throw new Error(
      "Tried to use getCompendiumPage, but testing environment does not contain compendiumData."
    );
  if (typeof request === "string") {
    const [category, pageName] = request.split(":");
    const response = {
      Name: pageName,
      Category: category,
      data: {},
    };
    if (pages[request]) response.data = pages[request].data;
    if (typeof callback === "function") callback(response);
  } else if (Array.isArray(request)) {
    const pageArray = [];
    for (const page of request) {
      if (pages[request] && pages[request].Category === category) pageArray.push(pages[pageName]);
    }
    if (typeof callback === "function") callback(pageArray);
  }
});
global.getCompendiumPage = getCompendiumPage;
const generateUUID = vi.fn(() => {
  var a = 0,
    b = [];
  return (function () {
    var c = new Date().getTime() + 0,
      d = c === a;
    a = c;
    for (var e = Array(8), f = 7; 0 <= f; f--)
      (e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64)),
      (c = Math.floor(c / 64));
    c = e.join("");
    if (d) {
      for (f = 11; 0 <= f && 63 === b[f]; f--) b[f] = 0;
      b[f]++;
    } else for (f = 0; 12 > f; f++) b[f] = Math.floor(64 * Math.random());
    for (f = 0; 12 > f; f++)
      c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
    return c.replace(/_/g, "z");
  })();
});
global.generateUUID = generateUUID;
const generateRowID = vi.fn(() => {
  return generateUUID().replace(/_/g, "Z");
});
global.generateRowID = generateRowID;
const simulateEvent = vi.fn((event) => {
  environment.triggers.forEach((trigger) => {
    const splitTriggers = trigger.trigger.split(" ") || [trigger.trigger];
    splitTriggers.forEach((singleTrigger) => {
      if (event === singleTrigger) {
        trigger.func({
          sourceAttribute: "test",
        });
      }
    });
  });
});
global.simulateEvent = simulateEvent;
const getTranslationByKey = vi.fn((key) => environment.translation?.[key] || false);
global.getTranslationByKey = getTranslationByKey;
// Roll Handlingglobal.getTranslationByKey = getTranslationByKey;

const extractRollTemplate = (rollString) => {
  const rollTemplate = rollString.match(/&\{template:(.*?)\}/)?.[1];
  environment.attributes.__rolltemplate = rollTemplate;
};

const cleanRollElements = (value) => {
  const cleanText = value
    .replace(/\{\{|\}}(?=$|\s|\{)/g, "")
    .replace(/=/,'===SPLITHERE===');
  const splitText = cleanText.split("===SPLITHERE===");
  return splitText;
};

const extractRollElements = (rollString) => {
  const rollElements = rollString.match(/\{\{(.*?)\}{2,}(?=$|\s|\{)/g);
  if (!rollElements || rollElements.length < 1) return {}
  return  Object.fromEntries(rollElements.map(cleanRollElements));
};

const getExpression = (element) => element.replace(/(\[\[|\]\])/gi, "");

const getDiceOrHalf = (size) => {
  const diceStack = environment.diceStack;
  if (!diceStack?.[size] || diceStack[size].length < 0) return size / 2;
  return environment.diceStack[size].pop();
};

const getDiceRolls = (expression) => {
  const rolls = expression.match(/([0-9]+)?d([0-9]+)/gi);
  if (!rolls) return [];
  const allRolls = [];
  rolls.forEach((roll) => {
    const [number, size] = roll.split(/d/i);
    for (let i = 1; i <= number; i++) {
      const dice = getDiceOrHalf(size);
      allRolls.push(dice);
    }
  });
  return allRolls;
};

const calculateResult = (startExpression, dice) => {
  let expression = startExpression.replace(/\[.+?\]/g,'')

  const rolls = expression.match(/([0-9]+)?d([0-9]+)/gi);
  if (!rolls) return eval(expression);
  rolls.forEach((roll, index) => {
    const [number, size] = roll.split(/d/i);
    let total = 0;
    for (let i = 1; i <= number; i++) {
      total += +dice.shift();
    }
    expression = expression.replace(/([0-9]+d[0-9]+([+\-*/][0-9]+)?)(.*?)$/gi, "$1");
    const regex = new RegExp(roll, "gi");
    expression = expression.replace(regex, total);
  });

  return eval(expression);
};

const replaceAttributes = (element) => {
  const test = /@\{(.*?)\}/i;
  while (test.test(element)) {
    element = element.replace(/@\{(.*?)\}/gi, (sub, ...args) => {
      const attributeName = args[0];
      const attributeValue = environment.attributes[attributeName];
      const attributeExists = typeof attributeValue !== "undefined";
      const possibleAttributes = Object.keys(environment.attributes);
      if (attributeExists) return attributeValue;
      else
        throw new Error(
          `Roll called ${sub} but no corresponding attribute "${attributeName}" was found. Attributes are: ${possibleAttributes.join(
            ", "
          )}`
        );
    });
  }
  return element;
};

const replaceQueries = (element) => {
  return element.replace(/\?\{(.+?)[|}]([^}]+?\})?/g,(match,p,a) => {
    a = a?.split(/\s*\|\s*/) || [];
    return environment.queryResponses[p] || a[0] || '';
  });
};

const calculateRollResult = (rollElements) => {
  const results = {};
  for (const key in rollElements) {
    const element = rollElements[key];
    if (element.indexOf("[[") === -1) continue;
    const attributeFilled = replaceAttributes(element);
    const queryAnswered = replaceQueries(attributeFilled);
    const expression = getExpression(queryAnswered);
    const dice = getDiceRolls(expression);
    const result = calculateResult(expression, [...dice]);
    results[key] = {
      result,
      dice,
      expression,
    };
  }
  return results;
};

const startRoll = vi.fn(async (rollString) => {
  if (!rollString) throw new Error("startRoll expected a Roll String but none was provided.");
  const rollResult = { results: {} };
  extractRollTemplate(rollString);
  const rollElements = extractRollElements(rollString);
  rollResult.results = calculateRollResult(rollElements);
  rollResult.rollId = generateUUID();
  return rollResult;
});
global.startRoll = startRoll;
const finishRoll = vi.fn(() => {});
global.finishRoll = finishRoll;
//# sourceURL=Devilry_(V1).js
  
  const k = (function(){
  const kFuncs = {};
  
  const cascades = {"attr_character_name":{"name":"character_name","type":"text","defaultValue":"","affects":[],"triggeredFuncs":["setActionCalls"],"listenerFunc":"accessSheet","listener":"change:character_name"},"act_k-network-call":{"name":"k-network-call","type":"action","triggeredFuncs":["kReceive"],"affects":[],"addFuncs":[],"listener":"clicked:k-network-call","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_sheet_version":{"name":"sheet_version","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:sheet_version","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_devilry_tab":{"name":"devilry_tab","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:devilry_tab","listenerFunc":"accessSheet","defaultValue":"nav-tabs-devilry--statistics","calculation":"","initialFunc":"","formula":""},"act_nav-tabs-devilry--statistics":{"name":"nav-tabs-devilry--statistics","type":"action","triggeredFuncs":["kSwitchTab"],"affects":[],"addFuncs":[],"listener":"clicked:nav-tabs-devilry--statistics","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_nav-tabs-devilry--info":{"name":"nav-tabs-devilry--info","type":"action","triggeredFuncs":["kSwitchTab"],"affects":[],"addFuncs":[],"listener":"clicked:nav-tabs-devilry--info","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_nav-tabs-devilry--domains":{"name":"nav-tabs-devilry--domains","type":"action","triggeredFuncs":["kSwitchTab"],"affects":[],"addFuncs":[],"listener":"clicked:nav-tabs-devilry--domains","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_nav-tabs-devilry--appearance":{"name":"nav-tabs-devilry--appearance","type":"action","triggeredFuncs":["kSwitchTab"],"affects":[],"addFuncs":[],"listener":"clicked:nav-tabs-devilry--appearance","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_species":{"name":"species","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:species","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_predator":{"name":"predator","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:predator","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_fear":{"name":"fear","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:fear","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_concept":{"name":"concept","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:concept","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_bane":{"name":"bane","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:bane","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_severity":{"name":"severity","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:severity","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_nature-demeanor":{"name":"nature-demeanor","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:nature-demeanor","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_xp":{"name":"xp","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:xp","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_body":{"name":"body","type":"hidden","triggeredFuncs":[],"affects":["underline-speed"],"addFuncs":[],"listener":"change:body","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-body":{"name":"underline-body","type":"hidden","triggeredFuncs":[],"affects":["underline-speed"],"addFuncs":[],"listener":"change:underline-body","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_mind":{"name":"mind","type":"hidden","triggeredFuncs":[],"affects":["underline-speed","underline-willpower"],"addFuncs":[],"listener":"change:mind","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-mind":{"name":"underline-mind","type":"hidden","triggeredFuncs":[],"affects":["underline-speed","underline-willpower"],"addFuncs":[],"listener":"change:underline-mind","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_spirit":{"name":"spirit","type":"hidden","triggeredFuncs":[],"affects":["underline-willpower"],"addFuncs":[],"listener":"change:spirit","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-spirit":{"name":"underline-spirit","type":"hidden","triggeredFuncs":[],"affects":["underline-willpower"],"addFuncs":[],"listener":"change:underline-spirit","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_speed":{"name":"speed","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:speed","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":"body,mind"},"attr_underline-speed":{"name":"underline-speed","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-speed","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":"body,mind"},"attr_willpower":{"name":"willpower","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:willpower","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":"mind,spirit"},"attr_underline-willpower":{"name":"underline-willpower","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-willpower","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":"mind,spirit"},"attr_athletics":{"name":"athletics","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:athletics","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-athletics":{"name":"underline-athletics","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-athletics","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_run":{"name":"run","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:run","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_swim":{"name":"swim","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:swim","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_throw":{"name":"throw","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:throw","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_climb":{"name":"climb","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:climb","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_combat":{"name":"combat","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:combat","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-combat":{"name":"underline-combat","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-combat","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_weapon":{"name":"weapon","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:weapon","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_brawl":{"name":"brawl","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:brawl","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_block":{"name":"block","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:block","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_":{"name":"","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_acrobatics":{"name":"acrobatics","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:acrobatics","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-acrobatics":{"name":"underline-acrobatics","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-acrobatics","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_jump":{"name":"jump","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:jump","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_dodge":{"name":"dodge","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:dodge","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_stunt":{"name":"stunt","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:stunt","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_dexterity":{"name":"dexterity","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:dexterity","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-dexterity":{"name":"underline-dexterity","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-dexterity","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_pilot":{"name":"pilot","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:pilot","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_sneak":{"name":"sneak","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:sneak","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_deft":{"name":"deft","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:deft","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_reason":{"name":"reason","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:reason","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-reason":{"name":"underline-reason","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-reason","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_firearm":{"name":"firearm","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:firearm","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_navigation":{"name":"navigation","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:navigation","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_survival":{"name":"survival","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:survival","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_know":{"name":"know","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:know","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-know":{"name":"underline-know","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-know","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_nature":{"name":"nature","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:nature","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_history":{"name":"history","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:history","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_occult":{"name":"occult","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:occult","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_invest":{"name":"invest","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:invest","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_tech":{"name":"tech","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:tech","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-tech":{"name":"underline-tech","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-tech","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_coding":{"name":"coding","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:coding","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_security":{"name":"security","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:security","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_repair":{"name":"repair","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repair","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_medicine":{"name":"medicine","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:medicine","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-medicine":{"name":"underline-medicine","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-medicine","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_surgery":{"name":"surgery","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:surgery","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_first_aid":{"name":"first_aid","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:first_aid","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_diagnosis":{"name":"diagnosis","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:diagnosis","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_perception":{"name":"perception","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:perception","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-perception":{"name":"underline-perception","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-perception","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_notice":{"name":"notice","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:notice","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_track":{"name":"track","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:track","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_insight":{"name":"insight","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:insight","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_resolve":{"name":"resolve","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:resolve","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-resolve":{"name":"underline-resolve","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-resolve","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_leadership":{"name":"leadership","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:leadership","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_intimidate":{"name":"intimidate","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:intimidate","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_endure":{"name":"endure","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:endure","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_personal":{"name":"personal","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:personal","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-personal":{"name":"underline-personal","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-personal","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_etiquette":{"name":"etiquette","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:etiquette","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_streetwise":{"name":"streetwise","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:streetwise","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_politics":{"name":"politics","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:politics","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_charm":{"name":"charm","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:charm","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-charm":{"name":"underline-charm","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-charm","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_perform":{"name":"perform","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:perform","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_persuade":{"name":"persuade","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:persuade","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_decieve":{"name":"decieve","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:decieve","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_hp-max":{"name":"hp-max","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:hp-max","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_hp-curr":{"name":"hp-curr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:hp-curr","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_hit-die-current)":{"name":"hit-die-current)","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:hit-die-current)","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_hit-die-max)":{"name":"hit-die-max)","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:hit-die-max)","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_regen":{"name":"regen","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:regen","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_humanity":{"name":"humanity","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:humanity","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-humanity":{"name":"underline-humanity","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-humanity","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_homog-bonus":{"name":"homog-bonus","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:homog-bonus","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_mortal-pen":{"name":"mortal-pen","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:mortal-pen","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_hunger":{"name":"hunger","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:hunger","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_underline-hunger":{"name":"underline-hunger","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:underline-hunger","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcNewValue","initialFunc":"","formula":""},"attr_age":{"name":"age","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:age","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_height":{"name":"height","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:height","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_weight":{"name":"weight","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:weight","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_eyes":{"name":"eyes","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:eyes","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_skin":{"name":"skin","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:skin","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_hair":{"name":"hair","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:hair","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_convictions":{"name":"convictions","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:convictions","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_touchstones":{"name":"touchstones","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:touchstones","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_tenets":{"name":"tenets","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:tenets","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_pride":{"name":"pride","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:pride","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_pride-toggle":{"name":"pride-toggle","type":"checkbox","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:pride-toggle","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_item":{"name":"item","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:item","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_allies":{"name":"allies","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:allies","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_backstory":{"name":"backstory","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:backstory","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_contracts":{"name":"contracts","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:contracts","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_inventory":{"name":"inventory","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:inventory","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_traits":{"name":"traits","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:traits","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_fear-name":{"name":"fear-name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:fear-name","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_blood-max":{"name":"blood-max","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:blood-max","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_blood-cur":{"name":"blood-cur","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:blood-cur","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_innate_domain1name":{"name":"innate_domain1name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:innate_domain1name","listenerFunc":"accessSheet","defaultValue":"Innate Domain","calculation":"","initialFunc":"","formula":""},"attr_innate_domain1level":{"name":"innate_domain1level","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:innate_domain1level","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"act_add-innate-domain1":{"name":"add-innate-domain1","type":"action","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"clicked:add-innate-domain1","listenerFunc":"addItem","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain1_$x_collapse":{"name":"repeating_innate-domain1_$x_collapse","type":"checkbox","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain1:collapse","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain1_$x_name":{"name":"repeating_innate-domain1_$x_name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain1:name","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain1_$x_bp-cost":{"name":"repeating_innate-domain1_$x_bp-cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain1:bp-cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain1_$x_ap-cost":{"name":"repeating_innate-domain1_$x_ap-cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain1:ap-cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain1_$x_rouse-check":{"name":"repeating_innate-domain1_$x_rouse-check","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain1:rouse-check","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain1_$x_duration":{"name":"repeating_innate-domain1_$x_duration","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain1:duration","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain1_$x_pool":{"name":"repeating_innate-domain1_$x_pool","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain1:pool","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain1_$x_opp-pool":{"name":"repeating_innate-domain1_$x_opp-pool","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain1:opp-pool","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain1_$x_description":{"name":"repeating_innate-domain1_$x_description","type":"span","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain1:description","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_innate_domain2name":{"name":"innate_domain2name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:innate_domain2name","listenerFunc":"accessSheet","defaultValue":"Innate Domain","calculation":"","initialFunc":"","formula":""},"attr_innate_domain2level":{"name":"innate_domain2level","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:innate_domain2level","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"act_add-innate-domain2":{"name":"add-innate-domain2","type":"action","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"clicked:add-innate-domain2","listenerFunc":"addItem","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain2_$x_collapse":{"name":"repeating_innate-domain2_$x_collapse","type":"checkbox","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain2:collapse","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain2_$x_name":{"name":"repeating_innate-domain2_$x_name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain2:name","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain2_$x_bp-cost":{"name":"repeating_innate-domain2_$x_bp-cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain2:bp-cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain2_$x_ap-cost":{"name":"repeating_innate-domain2_$x_ap-cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain2:ap-cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain2_$x_rouse-check":{"name":"repeating_innate-domain2_$x_rouse-check","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain2:rouse-check","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain2_$x_duration":{"name":"repeating_innate-domain2_$x_duration","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain2:duration","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain2_$x_pool":{"name":"repeating_innate-domain2_$x_pool","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain2:pool","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain2_$x_opp-pool":{"name":"repeating_innate-domain2_$x_opp-pool","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain2:opp-pool","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain2_$x_description":{"name":"repeating_innate-domain2_$x_description","type":"span","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain2:description","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_innate_domain3name":{"name":"innate_domain3name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:innate_domain3name","listenerFunc":"accessSheet","defaultValue":"Innate Domain","calculation":"","initialFunc":"","formula":""},"attr_innate_domain3level":{"name":"innate_domain3level","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:innate_domain3level","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"act_add-innate-domain3":{"name":"add-innate-domain3","type":"action","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"clicked:add-innate-domain3","listenerFunc":"addItem","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain3_$x_collapse":{"name":"repeating_innate-domain3_$x_collapse","type":"checkbox","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain3:collapse","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain3_$x_name":{"name":"repeating_innate-domain3_$x_name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain3:name","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain3_$x_bp-cost":{"name":"repeating_innate-domain3_$x_bp-cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain3:bp-cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain3_$x_ap-cost":{"name":"repeating_innate-domain3_$x_ap-cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain3:ap-cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain3_$x_rouse-check":{"name":"repeating_innate-domain3_$x_rouse-check","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain3:rouse-check","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain3_$x_duration":{"name":"repeating_innate-domain3_$x_duration","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain3:duration","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain3_$x_pool":{"name":"repeating_innate-domain3_$x_pool","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain3:pool","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain3_$x_opp-pool":{"name":"repeating_innate-domain3_$x_opp-pool","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain3:opp-pool","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_innate-domain3_$x_description":{"name":"repeating_innate-domain3_$x_description","type":"span","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_innate-domain3:description","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_learned_domain4name":{"name":"learned_domain4name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:learned_domain4name","listenerFunc":"accessSheet","defaultValue":"Learned Domain","calculation":"","initialFunc":"","formula":""},"attr_learned_domain4level":{"name":"learned_domain4level","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:learned_domain4level","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"act_add-learned-domain4":{"name":"add-learned-domain4","type":"action","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"clicked:add-learned-domain4","listenerFunc":"addItem","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain4_$x_collapse":{"name":"repeating_learned-domain4_$x_collapse","type":"checkbox","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain4:collapse","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain4_$x_name":{"name":"repeating_learned-domain4_$x_name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain4:name","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain4_$x_bp-cost":{"name":"repeating_learned-domain4_$x_bp-cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain4:bp-cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain4_$x_ap-cost":{"name":"repeating_learned-domain4_$x_ap-cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain4:ap-cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain4_$x_rouse-check":{"name":"repeating_learned-domain4_$x_rouse-check","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain4:rouse-check","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain4_$x_duration":{"name":"repeating_learned-domain4_$x_duration","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain4:duration","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain4_$x_pool":{"name":"repeating_learned-domain4_$x_pool","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain4:pool","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain4_$x_opp-pool":{"name":"repeating_learned-domain4_$x_opp-pool","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain4:opp-pool","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain4_$x_description":{"name":"repeating_learned-domain4_$x_description","type":"span","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain4:description","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_learned_domain5name":{"name":"learned_domain5name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:learned_domain5name","listenerFunc":"accessSheet","defaultValue":"Learned Domain","calculation":"","initialFunc":"","formula":""},"attr_learned_domain5level":{"name":"learned_domain5level","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:learned_domain5level","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"act_add-learned-domain5":{"name":"add-learned-domain5","type":"action","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"clicked:add-learned-domain5","listenerFunc":"addItem","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain5_$x_collapse":{"name":"repeating_learned-domain5_$x_collapse","type":"checkbox","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain5:collapse","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain5_$x_name":{"name":"repeating_learned-domain5_$x_name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain5:name","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain5_$x_bp-cost":{"name":"repeating_learned-domain5_$x_bp-cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain5:bp-cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain5_$x_ap-cost":{"name":"repeating_learned-domain5_$x_ap-cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain5:ap-cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain5_$x_rouse-check":{"name":"repeating_learned-domain5_$x_rouse-check","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain5:rouse-check","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain5_$x_duration":{"name":"repeating_learned-domain5_$x_duration","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain5:duration","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain5_$x_pool":{"name":"repeating_learned-domain5_$x_pool","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain5:pool","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain5_$x_opp-pool":{"name":"repeating_learned-domain5_$x_opp-pool","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain5:opp-pool","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain5_$x_description":{"name":"repeating_learned-domain5_$x_description","type":"span","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain5:description","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_learned_domain6name":{"name":"learned_domain6name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:learned_domain6name","listenerFunc":"accessSheet","defaultValue":"Learned Domain","calculation":"","initialFunc":"","formula":""},"attr_learned_domain6level":{"name":"learned_domain6level","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:learned_domain6level","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"act_add-learned-domain6":{"name":"add-learned-domain6","type":"action","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"clicked:add-learned-domain6","listenerFunc":"addItem","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain6_$x_collapse":{"name":"repeating_learned-domain6_$x_collapse","type":"checkbox","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain6:collapse","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain6_$x_name":{"name":"repeating_learned-domain6_$x_name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain6:name","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain6_$x_bp-cost":{"name":"repeating_learned-domain6_$x_bp-cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain6:bp-cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain6_$x_ap-cost":{"name":"repeating_learned-domain6_$x_ap-cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain6:ap-cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain6_$x_rouse-check":{"name":"repeating_learned-domain6_$x_rouse-check","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain6:rouse-check","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain6_$x_duration":{"name":"repeating_learned-domain6_$x_duration","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain6:duration","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain6_$x_pool":{"name":"repeating_learned-domain6_$x_pool","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain6:pool","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain6_$x_opp-pool":{"name":"repeating_learned-domain6_$x_opp-pool","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain6:opp-pool","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_learned-domain6_$x_description":{"name":"repeating_learned-domain6_$x_description","type":"span","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_learned-domain6:description","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_true_form":{"name":"true_form","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:true_form","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_homogenized":{"name":"homogenized","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:homogenized","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_general":{"name":"general","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:general","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_apparel":{"name":"apparel","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:apparel","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_notable_features":{"name":"notable_features","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:notable_features","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_template_start":{"name":"template_start","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:template_start","listenerFunc":"accessSheet","defaultValue":"@{whisper}&{template:Devilry_(V1)} {{character_name=@{character_name}}} {{character_id=@{character_id}}}","calculation":"","initialFunc":"","formula":""}};
  
  kFuncs.cascades = cascades;
  
  const repeatingSectionDetails = [{"section":"repeating_Innate-Domain1","fields":["collapse","name","bp-cost","ap-cost","rouse-check","duration","pool","opp-pool","description"]},{"section":"repeating_Innate-Domain2","fields":["collapse","name","bp-cost","ap-cost","rouse-check","duration","pool","opp-pool","description"]},{"section":"repeating_Innate-Domain3","fields":["collapse","name","bp-cost","ap-cost","rouse-check","duration","pool","opp-pool","description"]},{"section":"repeating_Learned-Domain4","fields":["collapse","name","bp-cost","ap-cost","rouse-check","duration","pool","opp-pool","description"]},{"section":"repeating_Learned-Domain5","fields":["collapse","name","bp-cost","ap-cost","rouse-check","duration","pool","opp-pool","description"]},{"section":"repeating_Learned-Domain6","fields":["collapse","name","bp-cost","ap-cost","rouse-check","duration","pool","opp-pool","description"]}];
  
  kFuncs.repeatingSectionDetails = repeatingSectionDetails;
  
  const persistentTabs = ["devilry_tab"];
  
  kFuncs.persistentTabs = persistentTabs;
  /**
 * The K-scaffold provides several variables to allow your scripts to tap into its information flow.
 * @namespace Sheetworkers.Variables
 */
/**
 * This stores the name of your sheet for use in the logging functions {@link log} and {@link debug}. Accessible by `k.sheetName`
 * @memberof Variables
 * @var
 * @type {string}
 */
let sheetName = 'kScaffold Powered Sheet';
kFuncs.sheetName = sheetName;
/**
	* This stores the version of your sheet for use in the logging functions{@link log} and {@link debug}. It is also stored in the sheet_version attribute on your character sheet. Accessible via `k.version`
 * @memberof Variables
	* @var
	* @type {number}
	*/
let version = 0;
kFuncs.version = version;
/**
	* A boolean flag that tells the script whether to enable or disable {@link debug} calls. If the version of the sheet is `0`, or an attribute named `debug_mode` is found on opening this is set to true for your entire session. Otherwise, it remains false.
 * @memberof Variables
	* @var
	* @type {boolean}
	*/
let debugMode = false;
kFuncs.debugMode = debugMode;
const funcs = {};
kFuncs.funcs = funcs;
const updateHandlers = {};
const openHandlers = {};
const initialSetups = {};
const allHandlers = {};
const addFuncs = {};

const kscaffoldJSVersion = '1.0.0';
const kscaffoldPUGVersion = '1.0.0';
/**
 * Defines the rollstring that rolls made using k.startRoll begin with. Defaults to "&{template:default}".
 * @memberof Variables
 * @var
 * @type {string}
 */
let defaultRollStart = '&{template:default}';
kFuncs.defaultRollStart = defaultRollStart;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/**
 * These are utility functions that are not directly related to Roll20 systems. They provide easy methods for everything from processing text and numbers to querying the user for input.
 * @namespace Sheetworkers.Utilities
 * @alias Utilities
 */
/**
 * Replaces problem characters to use a string as a regex
 * @memberof Utilities
 * @param {string} text - The text to replace characters in
 * @returns {string}
 * @example
 * const textForRegex = k.sanitizeForRegex('.some thing[with characters]');
 * console.log(textForRegex);// => "\.some thing\[with characters\]"
 */
const sanitizeForRegex = function(text){
  return text.replace(/\.|\||\(|\)|\[|\]|\-|\+|\?|\/|\{|\}|\^|\$|\*/g,'\\$&');
};
kFuncs.sanitizeForRegex = sanitizeForRegex;

/**
 * Converts a value to a number, it\'s default value, or `0` if no default value passed.
 * @memberof Utilities
 * @param {string|number} val - Value to convert to a number
 * @param {number} def - The default value, uses 0 if not passed
 * @returns {number|undefined}
 * @example
 * const num = k.value('100');
 * console.log(num);// => 100
 */
const value = function(val,def){
  const convertVal = +val;
  if(def !== undefined && isNaN(def)){
    throw(`K-scaffold Error: invalid default for value(). Default: ${def}`);
  }
  return convertVal === 0 ?
    convertVal :
    (+val||def||0);
};
kFuncs.value = value;

/**
 * Extracts the section (e.g. `repeating_equipment`), rowID (e.g `-;lkj098J:LKj`), and field name (e.g. `bulk`) from a repeating attribute name.
 * @memberof Utilities
 * @param {string} string - The string to parse
 * @returns {array} - Array of matches. Index 0: the section name, e.g. repeating_equipment | Index 1:the row ID | index 2: The name of the attribute
 * @returns {string[]}
 * @example
 * //Extract info from a full repeating name
 * const [section,rowID,attrName] = k.parseRepeatName('repeating_equipment_-8908asdflkjZlkj23_name');
 * console.log(section);// => "repeating_equipment"
 * console.log(rowID);// => "-8908asdflkjZlkj23"
 * console.log(attrName);// => "name"
 * 
 * //Extract info from just a row name
 * const [section,rowID,attrName] = k.parseRepeatName('repeating_equipment_-8908asdflkjZlkj23');
 * console.log(section);// => "repeating_equipment"
 * console.log(rowID);// => "-8908asdflkjZlkj23"
 * console.log(attrName);// => undefined
 */
const parseRepeatName = function(string){
  let match = string.match(/(repeating_[^_]+)_([^_]+)(?:_(.+))?/);
  match.shift();
  return match;
};
kFuncs.parseRepeatName = parseRepeatName;

/**
 * Parses out the components of a trigger name similar to [parseRepeatName](#parserepeatname). Aliases: parseClickTrigger.
 * 
 * Aliases: `k.parseClickTrigger`
 * @memberof Utilities
 * @param {string} string The triggerName property of the
 * @returns {array} - For a repeating button named `repeating_equipment_-LKJhpoi98;lj_roll`, the array will be `['repeating_equipment','-LKJhpoi98;lj','roll']`. For a non repeating button named `roll`, the array will be `[undefined,undefined,'roll']`
 * @returns {string[]}
 * @example
 * //Parse a non repeating trigger
 * const [section,rowID,attrName] = k.parseTriggerName('clicked:some-button');
 * console.log(section);// => undefined
 * console.log(rowID);// => undefined
 * console.log(attrName);// => "some-button"
 * 
 * //Parse a repeating trigger
 * const [section,rowID,attrName] = k.parseTriggerName('clicked:repeating_attack_-234lkjpd8fu8usadf_some-button');
 * console.log(section);// => "repeating_attack"
 * console.log(rowID);// => "-234lkjpd8fu8usadf"
 * console.log(attrName);// => "some-button"
 * 
 * //Parse a repeating name
 * const [section,rowID,attrName] = k.parseTriggerName('repeating_attack_-234lkjpd8fu8usadf_some-button');
 * console.log(section);// => "repeating_attack"
 * console.log(rowID);// => "-234lkjpd8fu8usadf"
 * console.log(attrName);// => "some-button"
 */
const parseTriggerName = function(string){
  let match = string.replace(/^clicked:/,'').match(/(?:(repeating_[^_]+)_([^_]+)_)?(.+)/);
  match.shift();
  return match;
};
kFuncs.parseTriggerName = parseTriggerName;
const parseClickTrigger = parseTriggerName;
kFuncs.parseClickTrigger = parseClickTrigger;

/**
 * Parses out the attribute name from the htmlattribute name.
 * @memberof Utilities
 * @param {string} string - The triggerName property of the [event](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object).
 * @returns {string}
 * @example
 * //Parse a name
 * const attrName = k.parseHtmlName('attr_attribute_1');
 * console.log(attrName);// => "attribute_1"
 */
const parseHTMLName = function(string){
  let match = string.match(/(?:attr|act|roll)_(.+)/);
  match.shift();
  return match[0];
};
kFuncs.parseHTMLName = parseHTMLName;

/**
 * Capitalize each word in a string
 * @memberof Utilities
 * @param {string} string - The string to capitalize
 * @returns {string}
 * @example
 * const capitalized = k.capitalize('a word');
 * console.log(capitalized);// => "A Word"
 */
const capitalize = function(string){
  return string.replace(/(?:^|\s+|\/)[a-z]/ig,(letter)=>letter.toUpperCase());
};
kFuncs.capitalize = capitalize;

/**
 * Extracts a roll query result for use in later functions. Must be awaited as per [startRoll documentation](https://wiki.roll20.net/Sheet_Worker_Scripts#Roll_Parsing.28NEW.29). Stolen from [Oosh\'s Adventures with Startroll thread](https://app.roll20.net/forum/post/10346883/adventures-with-startroll).
 * @memberof Utilities
 * @param {string} query - The query should be just the text as the `?{` and `}` at the start/end of the query are added by the function.
 * @returns {Promise} - Resolves to the selected value from the roll query
 * @example
 * const rollFunction = async function(){
 *  //Get the result of a choose from list query
 *  const queryResult = await extractQueryResult('Prompt Text Here|Option 1|Option 2');
 *  console.log(queryResult);//=> "Option 1" or "Option 2" depending on what the user selects
 * 
 *  //Get free form input from the user
 *  const freeResult = await extractQueryResult('Prompt Text Here');
 *  consoel.log(freeResult);// => Whatever the user entered
 * }
 */
const extractQueryResult = async function(query){
	debug('entering extractQueryResult');
  const rollObj = {
    query:`[[0[response=?{${query}}]]]`
  };
	let {roll} = await _startRoll(rollObj,'!');
  roll.finish();
	return roll.results.query.expression.replace(/^.+?response=|\]$/g,'');
};
kFuncs.extractQueryResult = extractQueryResult;

/**
 * Simulates a query for ensuring that async/await works correctly in the sheetworker environment when doing conditional startRolls. E.g. if you have an if/else and only one of the conditions results in `startRoll` being called (and thus an `await`), the sheetworker environment would normally crash. Awaiting this in the condition that does not actually need to call `startRoll` will keep the environment in sync.
 * @memberof Utilities
 * @param {string|number} [value] - The value to return. Optional.
 * @returns {Promise} - Resolves to the value passed to the function
 * @example
 * const rollFunction = async function(){
 *  //Get the result of a choose from list query
 *  const queryResult = await pseudoQuery('a value');
 *  console.log(queryResult);//=> "a value"
 * }
 */
const pseudoQuery = async function(value){  
  const rollObj = {
    query:`[[0[response=${value}]]]`
  };
	let {roll} = await _startRoll(rollObj,'!');
  roll.finish();
	return roll.results.query.expression.replace(/^.+?response=|\]$/g,'');
};
kFuncs.pseudoQuery = pseudoQuery;

/**
 * An alias for console.log.
 * @memberof Utilities
 * @param {any} msg - The message can be a straight string, an object, or an array. If it is an object or array, the object will be broken down so that each key is used as a label to output followed by the value of that key. If the value of the key is an object or array, it will be output via `console.table`.
 */
const log = function(msg){
  if(typeof msg === 'string'){
    console.log(`%c${kFuncs.sheetName} log| ${msg}`,"background-color:#159ccf");
  }else if(typeof msg === 'object'){
    Object.keys(msg).forEach((m)=>{
      if(typeof msg[m] === 'string'){
        console.log(`%c${kFuncs.sheetName} log| ${m}: ${msg[m]}`,"background-color:#159ccf");
      }else{
        console.log(`%c${kFuncs.sheetName} log| ${typeof msg[m]} ${m}`,"background-color:#159ccf");
        console.table(msg[m]);
      }
    });
  }
};
kFuncs.log = log;

/**
 * Alias for console.log that only triggers when debug mode is enabled or when the sheet\'s version is `0`. Useful for entering test logs that will not pollute the console on the live sheet.
 * @memberof Utilities
 * @param {any} msg - 'See {@link k.log}
 * @param {boolean} force - Pass as a truthy value to force the debug output to be output to the console regardless of debug mode.
 * @returns {void}
 */
const debug = function(msg,force){
  if(!kFuncs.debugMode && !force && kFuncs.version > 0) return;
  if(typeof msg === 'string'){
    console.warn(`%c${kFuncs.sheetName} DEBUG| ${msg}`,"background-color:tan;color:red;");
  }else if(typeof msg === 'object'){
    Object.keys(msg).forEach((m)=>{
      if(typeof msg[m] === 'string'){
        console.warn(`%c${kFuncs.sheetName} DEBUG| ${m}: ${msg[m]}`,"background-color:tan;color:red;");
      }else{
        console.warn(`%c${kFuncs.sheetName} DEBUG| ${typeof msg[m]} ${m}`,"background-color:tan;color:red;font-weight:bold;");
        console.table(msg[m]);
      }
    });
  }
};
kFuncs.debug = debug;

/**
 * Orders the section id arrays for all sections in the `sections` object to match the repOrder attribute.
 * @memberof Utilities
 * @param {attributesProxy} attributes - The attributes object that must have a value for the reporder for each section.
 * @param {object[]} sections - Object containing the IDs for the repeating sections, indexed by repeating section name.
 */
const orderSections = function(attributes,sections){
  Object.keys(sections).forEach((section)=>{
    attributes.attributes[`_reporder_${section}`] = commaArray(attributes[`_reporder_${section}`]);
    sections[section] = orderSection(attributes.attributes[`_reporder_${section}`],sections[section]);
  });
};
kFuncs.orderSections = orderSections;

/**
 * Orders a single ID array.
 * @memberof Utilities
 * @param {string[]} repOrder - Array of IDs in the order they are in on the sheet.
 * @param {string[]} IDs - Array of IDs to be ordered. Aka the default ID Array passed to the getSectionIDs callback
 * @returns {string[]} - The ordered id array
 */
const orderSection = function(repOrder,IDs=[]){
  const idArr = [...repOrder.filter(v => v),...IDs.filter(id => !repOrder.includes(id.toLowerCase()))];
  return idArr;
};
kFuncs.orderSection = orderSection;

/**
 * Splits a comma delimited string into an array
 * @memberof Utilities
 * @param {string} string - The string to split.
 * @returns {array} - The string segments of the comma delimited list.
 */
const commaArray = function(string=''){
  return string.toLowerCase().split(/\s*,\s*/);
};
kFuncs.commaArray = commaArray;

// Roll escape functions for passing data in action button calls. Base64 encodes/decodes the data.
const RE = {
  chars: {
      '"': '%quot;',
      ',': '%comma;',
      ':': '%colon;',
      '}': '%rcub;',
      '{': '%lcub;',
  },
  escape(data) {
    return typeof data === 'object' ?
      `KDATA${btoa(JSON.stringify(data))}` :
      `KSTRING${btoa(data)}`;
  },
  unescape(string) {
    const isData = typeof string === 'string' &&
      (
        string.startsWith('KDATA') ||
        string.startsWith('KSTRING')
      );
    return isData ?
      (
        string.startsWith('KDATA') ?
          JSON.parse(atob(string.replace(/^KDATA/,''))) :
          atob(string.replace(/^KSTRING/,''))
      ) :
      string;
  }
};


/**
 * Encodes data in Base64. This is useful for passing roll information to action buttons called from roll buttons.
 * @function
 * @param {string|object|any[]} data - The data that you want to Base64 encode
 * @returns {string} - The encoded data
 * @memberof! Utilities
 */
const escape = RE.escape;
/**
 * Decodes Base64 encoded strings that were created by the K-scaffold
 * @function
 * @param {string|object|any[]} string - The string of encoded data to decode. If this is not a string, or is not a string that was encoded by the K-scaffold, it will be returned as is.
 * @returns {string|object|any[]}
 * @memberof! Utilities
 */
const unescape = RE.unescape;

Object.assign(kFuncs,{escape,unescape});

/**
 * Parses a macro so that it is reduced to the final values of all attributes contained in the macro. Will drill down up to 99 levels deep. If the string was not parseable, string will be returned with as much parsed as possible.
 * @memberof Utilities
 * @param {string} mutStr - The string macro to parse
 * @param {AttributesProxy} attributes - The K-scaffold Attributes Proxy
 * @param {Object} sections - The K-scaffold sections object
 * @returns {string} - The string with all attributes replaced by their values (if possible).
 */
const parseMacro = (str,attributes,sections) => {
  let iter = 0;
  let mutStr = str;
  while(mutStr.match(/@{.+?}/) && iter < 99){
    mutStr = mutStr.replace(/@{(.+?)}/g,(match,name) => {
      name = name.replace(/\|/,'_');
      return attributes[name] !== null && attributes[name] !== undefined ?
        attributes[name] :
        `@(${name})`;
    })
    iter++;
  }
  mutStr = mutStr.replace(/@\((.+?)\)/g,'@{$1}');
  return mutStr;
}
kFuncs.parseMacro = parseMacro;

/**
 * Sends data to another character sheet to cause a change on that sheet. WARNING, this function should not be used in response to an attribute change to avoid spamming the chat with api messages.
 * 
 * ![k.send.gif](/k-scaffold/k.send.gif)
 * @memberof Utilities
 * @param {string} characterName - The character to connect to
 * @param {string} funcName - Name of the function to call similar to function name used in {@link callFunc}.
 * @param  {...any} args - The arguments to pass to the function call no the other sheet. These are passed after the normal destructure object for a K-scaffold function call.
 * @example
 * //Function that is called by the source sheet
 * const dispatchPartner = async function({trigger,attributes,sections,casc}){
 *  const partnerName = await (
 *    attributes.partner_name ?
 *      k.pseudoQuery(attributes.partner_name) :
 *      k.extractQueryResult('Partner name')
 *  );
 *  attributes.partner_name = partnerName;
 *  //passing the attributes of the source sheet
 *  k.send(partnerName,'receivePartner',attributes);
 *  attributes.set();
 * };
 * k.registerFuncs({dispatchPartner});
 * 
 * //Function called on target sheet. Partner is the attributes from the source sheet
 * const receivePartner  = function({trigger,attributes,sections,casc},partner){
 *   attributes.from_partner = partner.for_partner;
 *   attributes.partner_name = partner.character_name;
 * };
 * k.registerFuncs({receivePartner });
 */
const send = async function(characterName,funcName,...args){
  const data = RE.escape({
    funcName,
    args
  });
  const roll = await startRoll(`!@{${characterName}|character_name}%{${characterName}|k-network-call||${data}}&{noerror}`);
  finishRoll(roll.rollId);
};
kFuncs.send = send;

const kReceive = function({trigger,attributes,sections,casc}) {
  const data = trigger.rollData;
  callFunc(data.funcName,{attributes,sections,casc},...data.args);
};
funcs.kReceive = kReceive;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/

//# Attribute Obj Proxy handler
const createAttrProxy = function(attrs,sections,casc){
  //creates a proxy for the attributes object so that values can be worked with more easily.
  const getCascObj = function(event){
    const eventName = event.triggerName || event.sourceAttribute;
    let typePrefix = eventName.startsWith('clicked:') ?
      'act_' :
      event.removedInfo ?
      'fieldset_' :
      'attr_';
    let cascName = `${typePrefix}${eventName.replace(/(?:removed?|clicked):/,'')}`;
    let cascObj = casc[cascName];
    k.debug({[cascName]:cascObj});
    if(event && cascObj){
      Object.assign(cascObj,event);
      if(event.originalRollId){
        cascObj.rollData = RE.unescape(event.originalRollId);
      }
    }
    return cascObj || {};
  };
  
  const triggerFunctions = function(obj){
    if(obj.triggeredFuncs && obj.triggeredFuncs.length){
      debug(`triggering functions for ${obj.name}`);
      obj.triggeredFuncs && obj.triggeredFuncs.forEach(func=>funcs[func] ? 
        funcs[func]({trigger:obj,attributes,sections,casc}) :
        debug(`!!!Warning!!! no function named ${func} found. Triggered function not called for ${obj.name}`,true));
    }
  };
  
  const initialFunction = function(obj){
    if(obj.initialFunc){
      debug(`initial functions for ${obj.name}`);
      funcs[obj.initialFunc] ?
        funcs[obj.initialFunc]({trigger:obj,attributes,sections}) :
        debug(`!!!Warning!!! no function named ${obj.initialFunc} found. Initial function not called for ${obj.name}`,true);
    }
  };
  const alwaysFunctions = function(trigger){
    Object.values(allHandlers).forEach((handler)=>{
      handler({trigger,attributes,sections,casc});
    });
  };
  const processChange = function({event,trigger}){
    if(event && !trigger){
      debug(`${event.sourceAttribute} change detected. No trigger found`);
      return;
    }
    if(!attributes || !sections || !casc){
      debug(`!!! Insufficient arguments || attributes > ${!!attributes} | sections > ${!!sections} | casc > ${!!casc} !!!`);
      return;
    }
    debug({trigger});
    if(event){
      debug('checking for initial & always functions');
      if(Array.isArray(trigger.affects)){
        attributes.queue.push(...trigger.affects);
      }
      alwaysFunctions(trigger,attributes,sections,casc);//Functions that should be run for all events.
      initialFunction(trigger,attributes,sections,casc);//functions that should only be run if the attribute was the thing changed by the user

    }
    if(trigger){
      debug(`processing ${trigger.name}`);
      triggerFunctions(trigger,attributes,sections,casc);
      if(!event){
        // Handle autocalc formula
        if(trigger.formula){
          attributes[trigger.name] = parseKFormula({trigger,attributes,sections,casc});
        }
        // handle calculation of element
        if(
          trigger.calculation &&
          funcs[trigger.calculation]
        ){
          attributes[trigger.name] = funcs[trigger.calculation]({trigger,attributes,sections,casc});
        }else if(trigger.calculation && !funcs[trigger.calculation]){
          debug(`K-Scaffold Error: No function named ${trigger.calculation} found`);
        }
      }
    }
    attributes.set();
  };
  const attrTarget = {
    updates:{},
    attributes:{...attrs},
    repOrders:{},
    queue: [],
    casc:{},
    alwaysFunctions,
    processChange,
    triggerFunctions,
    initialFunction,
    getCascObj
  };
  const attrHandler = {
    get:function(obj,prop){//gets the most value of the attribute.
      //If it is a repeating order, returns the array, otherwise returns the update value or the original value
      if(prop === 'toJSON'){
        return () => ({...obj.attributes,...obj.updates});
      } else if(prop === 'set'){
        return function(){
          let {callback,vocal} = arguments[0] ? arguments[0] : {};
          if(sections && casc && attributes.queue.length){
            const triggerName = attributes.queue.shift();
            const trigger = getCascObj({sourceAttribute:triggerName});
            processChange({trigger,attributes,sections,casc});
          }else{
            debug({updates:obj.updates});
            const trueCallback = Object.keys(obj.repOrders).length ?
              function(){
                Object.entries(obj.repOrders).forEach(([section,order])=>{
                  _setSectionOrder(section,order)
                });
                callback && callback();
              }:
              callback;
            Object.keys(obj.updates).forEach((key)=>obj.attributes[key] = obj.updates[key]);
            const update = obj.updates;
            obj.updates = {};
            set(update,vocal,trueCallback);
          }
        }
      }else if(Object.keys(obj).some(key=>key===prop)){ 
        return Reflect.get(...arguments)
      }else{
        let retValue;
        switch(true){
          case obj.repOrders.hasOwnProperty(prop):
            retValue = obj.repOrders[prop];
            break;
          case obj.updates.hasOwnProperty(prop):
            retValue = obj.updates[prop];
            break;
          default:
            retValue = obj.attributes[prop];
            break;
        }
        let cascRef = `attr_${prop.replace(/(repeating_[^_]+_)[^_]+/,'$1\$X')}`;
        let numRetVal = +retValue;
        if(!Number.isNaN(numRetVal) && retValue !== ''){
          retValue = numRetVal;
        }else if(cascades[cascRef] && (typeof cascades[cascRef].defaultValue === 'number' || cascades[cascRef].type === 'number')){
          retValue = cascades[cascRef].defaultValue;
        }
        return retValue;
      }
    },
    set:function(obj,prop,value){
      //Sets the value. Also verifies that the value is a valid attribute value
      //e.g. not undefined, null, or NaN
      if(value || value===0 || value===''){
        if(/reporder|^repeating_[^_]+$/.test(prop)){
          let section = prop.replace(/_reporder_/,'');
          obj.repOrders[section] = value;
        }else if(`${obj.attributes}` !== `${value}` || 
          (obj.updates[prop] && `${obj.updates}` !== `${value}`)
        ){
          if(sections && casc){
            const trigger = getCascObj({sourceAttribute:prop});
            if(Array.isArray(trigger.affects)){
              attributes.queue.push(...trigger.affects);
            }
          }
          obj.updates[prop] = value;
        }
      }else{
        debug(`!!!Warning: Attempted to set ${prop} to an invalid value:${value}; value not stored!!!`);
      }
      return true;
    },
    deleteProperty(obj,prop){
      //removes the property from the original attributes, updates, and the reporders
      Object.keys(obj).forEach((key)=>{
        delete obj[key][prop.toLowerCase()];
      });
    }
  };
  const attributes = new Proxy(attrTarget,attrHandler);
  return attributes;
};

/**
 * Function that registers a function for being called via the funcs object. Returns true if the function was successfully registered, and false if it could not be registered for any reason.
 * @memberof Utilities
 * @param {object} funcObj - Object with keys that are names to register functions under and values that are functions.
 * @param {object} optionsObj - Object that contains options to use for this registration.
 * @param {string[]} optionsObj.type - Array that contains the types of specialized functions that apply to the functions being registered. Valid types are `"opener"`, `"updater"`, and `"default"`. `"default"` is always used, and never needs to be passed.
 * @returns {boolean} - True if the registration succeeded, false if it failed.
 * @example
 * //Basic Registration
 * const myFunc = function({trigger,attributes,sections,casc}){};
 * k.registerFuncs({myFunc});
 * 
 * //Register a function to run on sheet open
 * const openFunc = function({trigger,attributes,sections,casc}){};
 * k.registerFuncs({openFunc},{type:['opener']})
 * 
 * //Register a function to run on all events
 * const allFunc = function({trigger,attributes,sections,casc}){};
 * k.registerFuncs({allFunc},{type:['all']})
 */
const registerFuncs = function(funcObj,optionsObj = {}){
  if(typeof funcObj !== 'object' || typeof optionsObj !== 'object'){
    debug(`!!!! K-scaffold error: Improper arguments to register functions !!!!`);
    return false;
  }
  const typeArr = optionsObj.type ? ['default',...optionsObj.type] : ['default'];
  const typeSwitch = {
    'opener':openHandlers,
    'updater':updateHandlers,
    'new':initialSetups,
    'all':allHandlers,
    'default':funcs
  };
  let setState;
  Object.entries(funcObj).map(([prop,value])=>{
    typeArr.forEach((type)=>{
      if(typeSwitch[type][prop]){
        debug(`!!! Duplicate function name for ${prop} as ${type}!!!`);
        setState = false;
      }else if(typeof value === 'function'){
        typeSwitch[type][prop] = value;
        setState = setState !== false ? true : false;
      }else{
        debug(`!!! K-scaffold error: Function registration requires a function. Invalid value to register as ${type} !!!`);
        setState = false;
      }
    });
  });
  return setState;
};
kFuncs.registerFuncs = registerFuncs;

/**
 * Function that sets up the action calls used in the roller mixin.
 * @memberof Sheetworkers
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 */
const setActionCalls = function({attributes,sections}){
  actionAttributes.forEach((base)=>{
    let [section,,field] = k.parseTriggerName(base);
    let fieldAction = field.replace(/_/g,'-');
    if(section){
      sections[section].forEach((id)=>{
        attributes[`${section}_${id}_${field}`] = `%{${attributes.character_name}|${section}_${id}_${fieldAction}}`;
      });
    }else{
      attributes[`${field}`] = `%{${attributes.character_name}|${fieldAction}}`;
    }
  });
};
funcs.setActionCalls = setActionCalls;
kFuncs.setActionCalls = setActionCalls;


/**
 * Function that reduces Roll20 macro syntax formulas down to their calculated value.
 * @memberof Sheetworkers
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 */
const parseKFormula = ({trigger,attributes,sections,casc}) => {
  const [baseSection,rowID,attrName] = parseTriggerName(trigger.name);
  const repeatBlockRx = baseSection ?
    /(@{repeating_.+?_\$X_.+?})/g :
    /={([^)]*repeating_[^_]+[^)]*)}=/g;
  let mutFormula = trigger.formula;
  mutFormula = mutFormula.replace(repeatBlockRx,(match,repeatMacro) => {
    const [section] = repeatMacro.match(/repeating_[^_]+/);
    const idArray = baseSection ?
      [rowID] :
      sections[section];
    return idArray.map(id => {
        return `(${repeatMacro.replace(/repeating_[^_]+?_[^_]+?_([^}]+)/g,`${section}_${id}_$1`)})`;
      }).join(
        trigger.type === 'number' ?
          ' + ' :
          ''
      );
  });
  mutFormula = parseMacro(mutFormula,attributes)
    .replace(/@{.+?}/g,'0');
  const mathKeys = ['floor','ceil','round','abs'];
  mathKeys.forEach(func => mutFormula = mutFormula.replace(new RegExp(`${func}\\(`,'g'),`Math.${func}(`));
  const mathRx = new RegExp(`Math\\.(?:${mathKeys.join('|')})`,'g');
  let noAlphaStr = mutFormula
    .replace(mathRx,'');
  return trigger.type !== 'text' ?
    (
      !noAlphaStr.match(/[a-z]/i) ?
        eval(mutFormula) :
        undefined
    ) :
    mutFormula;
};
funcs.parseKFormula = parseKFormula;
kFuncs.parseKFormula = parseKFormula;

/**
 * Function to call a function previously registered to the funcs object. May not be used that much in actual sheets, but very useful when writing unit tests for your sheet. Either returns the function or null if no function exists.
 * @memberof Sheetworkers
 * @param {string} funcName - The name of the function to invoke.
 * @param {...any} args - The arguments to call the function with.
 * @returns {function|null}
 * @example
 * //Call myFunc with two arguments
 * k.callFunc('myFunc','an argument','another argument');
 */
const callFunc = function(funcName,...args){
  if(funcs[funcName]){
    debug(`calling ${funcName}`);
    return funcs[funcName](...args);
  }else{
    debug(`Invalid function name: ${funcName}`);
    return null;
  }
};
kFuncs.callFunc = callFunc;/**@namespace Sheetworkers */
/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Sheet Updaters and styling functions
/**
 * Function that calls the K-scaffold's update and sheet initialization routines.
 */
const updateSheet = function(){
  log('updating sheet');
  getAllAttrs({props:['debug_mode',...baseGet],callback:(attributes,sections,casc)=>{
    kFuncs.debugMode = kFuncs.debugMode || !!attributes.debug_mode;
    debug({sheet_version:attributes.sheet_version});
    if(!attributes.sheet_version){
      Object.entries(initialSetups).forEach(([funcName,handler])=>{
        if(typeof funcs[funcName] === 'function'){
          debug(`running ${funcName}`);
          funcs[funcName]({attributes,sections,casc});
        }else{
          debug(`!!!Warning!!! no function named ${funcName} found. Initial sheet setup not performed.`);
        }
      });
    }else{
      Object.entries(updateHandlers).forEach(([ver,handler])=>{
        if(attributes.sheet_version < +ver){
          handler({attributes,sections,casc});
        }
      });
    }
    k.debug({openHandlers});
    Object.entries(openHandlers).forEach(([funcName,func])=>{
      if(typeof funcs[funcName] === 'function'){
        debug(`running ${funcName}`);
        funcs[funcName]({attributes,sections,casc});
      }else{
        debug(`!!!Warning!!! no function named ${funcName} found. Sheet open handling not performed.`);
      }
    });
    setActionCalls({attributes,sections});
    attributes.sheet_version = kFuncs.version;
    log(`Sheet Update applied. Current Sheet Version ${kFuncs.version}`);
    attributes.set();
    log('Sheet ready for use');
  }});
};
kFuncs.updateSheet = updateSheet;

const initialSetup = function(attributes,sections){
  debug('Initial sheet setup');
};

/**
 * This is the default listener function for attributes that the K-Scaffold uses. It utilizes the `triggerFuncs`, `listenerFunc`, `calculation`, and `affects` properties of the K-scaffold trigger object (see the Pug section of the scaffold for more details).
 * @memberof Sheetworkers
 * @param {Roll20Event} event - The Roll20 event object
 * @returns {void}
 * @example
 * //Call from an attribute change
 * on('change:an_attribute',k.accessSheet);
 */
const accessSheet = function(event){
  debug({funcs:Object.keys(funcs)});
  debug({event});
  getAllAttrs({callback:(attributes,sections,casc)=>{
    let trigger = attributes.getCascObj(event,casc);
    attributes.processChange({event,trigger,attributes,sections,casc});
  }});
};
funcs.accessSheet = accessSheet;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/*
Cascade Expansion functions
*/
//Expands the repeating section templates in cascades to reflect the rows actually available
const expandCascade = function(cascade,sections){
  return _.keys(cascade).reduce((memo,key)=>{//iterate through cascades and replace references to repeating attributes with correct row ids.
    if(/^(?:act|attr)_repeating_/.test(key)){//If the attribute is a repeating attribute, do special logic
      expandRepeating(memo,key,cascade,sections);
    }else if(key){//for non repeating attributes do this logic
      expandNormal(memo,key,cascade,sections);
    }
    return memo;
  },{});
};

const expandRepeating = function(memo,key,cascade,sections){
  key.replace(/((?:attr|act)_)(repeating_[^_]+)_[^_]+?_(.+)/,(match,type,section,field)=>{
    (sections[section]||[]).forEach((id)=>{
      memo[`${type}${section}_${id}_${field}`]=_.clone(cascade[key]);//clone the details so that each row's attributes have correct ids
      memo[`${type}${section}_${id}_${field}`].name = `${section}_${id}_${field}`;
      if(key.startsWith('attr_')){
        memo[`${type}${section}_${id}_${field}`].affects = memo[`${type}${section}_${id}_${field}`].affects.reduce((m,affected)=>{
          if(affected.startsWith(section)){//otherwise if the affected attribute is in the same section, simply set the affected attribute to have the same row id.
            m.push(applyID(affected,id));
          }else if(/repeating/.test(affected)){//If the affected attribute isn't in the same repeating section but is still a repeating attribute, add all the rows of that section
            addAllRows(affected,m,sections);
          }else{//otherwise the affected attribute is a non repeating attribute. Simply add it to the computed affected array
            m.push(affected);
          }
          return m;
        },[]);
      }
    });
  });
};

const applyID = function(affected,id){
  return affected.replace(/(repeating_[^_]+_)[^_]+(.+)/,`$1${id}$2`);
};

const expandNormal = function(memo,key,cascade,sections){
  memo[key] = _.clone(cascade[key]);
  if(key.startsWith('attr_')){
    memo[key].affects = memo[key].affects || [];
    memo[key].affects = memo[key].affects.reduce((m,a)=>{
      if(/^repeating/.test(a)){
        addAllRows(a,m,sections);
      }else{
        m.push(a);
      }
      return m;
    },[]);
  }
};

const addAllRows = function(affected,memo,sections){
  affected.replace(/(repeating_[^_]+?)_[^_]+?_(.+)/,(match,section,field)=>{
    sections[section].forEach(id=>memo.push(`${section}_${id}_${field}`));
  });
};/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/**
 * These are functions that provide K-scaffold aliases for the basic Roll20 sheetworker functions. These functions also provide many additional features on top of the standard Roll20 sheetworkers.
 * @namespace Sheetworkers.Sheetworker Aliases
 */
/**
 * Alias for [setSectionOrder()](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) that allows you to use the section name in either `repeating_section` or `section` formats. Note that the Roll20 sheetworker [setSectionOrder](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) currently causes some display issues on sheets.
 * @memberof Sheetworker Aliases
 * @name setSectionOrder
 * @param {string} section - The name of the section, with or without `repeating_`
 * @param {string[]} order - Array of ids describing the desired order of the section.
 * @returns {void}
 * @example
 * //Set the order of a repeating_weapon section
 * k.setSectionOrder('repeating_equipment',['id1','id2','id3']);
 * //Can also specify the section name without the repeating_ prefix
 * k.setSectionOrder('equipment',['id1','id2','id3']);
 */
const _setSectionOrder = function(section,order){
  let trueSection = section.replace(/repeating_/,'');
  setSectionOrder(trueSection,order);
};
kFuncs.setSectionOrder = _setSectionOrder;

/**
 * Alias for [removeRepeatingRow](https://wiki.roll20.net/Sheet_Worker_Scripts#removeRepeatingRow.28_RowID_.29) that also removes the row from the current object of attribute values and array of section IDs to ensure that erroneous updates are not issued.
 * @memberof Sheetworker Aliases
 * @name removeRepeatingRow
 * @param {string} row - The row id to be removed
 * @param {attributesProxy} attributes - The attribute values currently in memory
 * @param {object} sections - Object that contains arrays of all the IDs in sections on the sheet indexed by repeating name.
 * @returns {void}
 * @example
 * //Remove a repeating Row
 * k.getAllAttrs({
 *  callback:(attributes,sections)=>{
 *    const rowID = sections.repeating_equipment[0];
 *    k.removeRepeatingRow(`repeating_equipment_${rowID}`,attributes,sections);
 *    console.log(sections.repeating_equipment); // => rowID no longer exists in the array.
 *    console.log(attributes[`repeating_equipment_${rowID}_name`]); // => undefined
 *  }
 * })
 */
const _removeRepeatingRow = function(row,attributes,sections){
  debug(`removing ${row}`);
  Object.keys(attributes.attributes).forEach((key)=>{
    if(key.startsWith(row)){
      delete attributes[key];
    }
  });
  let [,section,rowID] = row.match(/(repeating_[^_]+)_(.+)/,'');
  sections[section] = sections[section].filter((id)=>id!==rowID);
  removeRepeatingRow(row);
};
kFuncs.removeRepeatingRow = _removeRepeatingRow;

/**
 * Alias for [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) that converts the default object of attribute values into an {@link attributesProxy} and passes that back to the callback function.
 * @memberof Sheetworker Aliases
 * @name getAttrs
 * @param {string[]} [props=baseGet] - Array of attribute names to get the value of. Defaults to {@link baseGet} if not passed.
 * @param {function(attributesProxy)} callback - The function to call after the attribute values have been gotten. An {@link attributesProxy} is passed to the callback.
 * @example
 * //Gets the attributes named in props.
 * k.getAttrs({
 *  props:['attribute_1','attribute_2'],
 *  callback:(attributes)=>{
 *    //Work with the attributes as you would in a normal getAttrs, or use the superpowers of the K-scaffold attributes object like so:
 *    attributes.attribute_1 = 'new value';
 *    attributes.set();
 *  }
 * })
 */
const _getAttrs = function({props=baseGet,callback}){
  getAttrs(props,(values)=>{
    const attributes = createAttrProxy(values);
    callback(attributes);
  });
};
kFuncs.getAttrs = _getAttrs;

/**
 * Alias for [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) and [getSectionIDs](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that combines the actions of both sheetworker functions and converts the default object of attribute values into an {@link attributesProxy}. Also gets the details on how to handle all attributes from the master {@link cascades} object and.
 * @memberof Sheetworker Aliases
 * @param {Object} args
 * @param {string[]} [args.props=baseGet] - Array of attribute names to get the value of. Defaults to {@link baseGet} if not passed.
 * @param {repeatingSectionDetails} sectionDetails - Array of details about a section to get the IDs for and attributes that need to be gotten. 
 * @param {function(attributesProxy,sectionObj,expandedCascade):void} args.callback - The function to call after the attribute values have been gotten. An {@link attributesProxy} is passed to the callback along with a {@link sectionObj} and {@link expandedCascade}.
 * @example
 * //Get every K-scaffold linked attribute on the sheet
 * k.getAllAttrs({
 *  callback:(attributes,sections,casc)=>{
 *    //Work with the attributes as you please.
 *    attributes.some_attribute = 'a value';
 *    attributes.set();//Apply our change
 *  }
 * })
 */
const getAllAttrs = function({props=baseGet,sectionDetails=repeatingSectionDetails,callback}){
  getSections(sectionDetails,(repeats,sections)=>{
    getAttrs([...props,...repeats],(values)=>{
      const casc = expandCascade(cascades,sections);
      const attributes = createAttrProxy(values,sections,casc);
      orderSections(attributes,sections);
      callback(attributes,sections,casc);
    })
  });
};
kFuncs.getAllAttrs = getAllAttrs;

/**
 * Alias for [getSectionIDs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that allows you to iterate through several functions at once. Also assembles an array of repeating attributes to get.
 * @memberof Sheetworker Aliases
 * @param {object[]} sectionDetails - Array of details about a section to get the IDs for and attributes that need to be gotten.
 * @param {string} sectionDetails.section - The full name of the repeating section including the `repeating_` prefix.
 * @param {string[]} sectionDetails.fields - Array of field names that need to be gotten from the repeating section
 * @param {function(string[],sectionObj)} callback - The function to call once all IDs have been gotten and the array of repating attributes to get has been assembled. The callback is passed the array of repating attributes to get and a {@link sectionObj}.
 * @example
 * // Get some section details
 * const sectionDetails = {
 *  {section:'repeating_equipment',fields:['name','weight','cost']},
 *  {section:'repeating_weapon',fields:['name','attack','damage']}
 * };
 * k.getSections(sectionDetails,(attributeNames,sections)=>{
 *  console.log(attributeNames);// => Array containing all row specific attribute names
 *  console.log(sections);// => Object with arrays containing the row ids. Indexed by section name (e.g. repeating_eqiupment)
 * })
 */
const getSections = function(sectionDetails,callback){
  let queueClone = _.clone(sectionDetails);
  const worker = (queue,repeatAttrs=[],sections={})=>{
    let detail = queue.shift();
    getSectionIDs(detail.section,(IDs)=>{
      sections[detail.section] = IDs;
      IDs.forEach((id)=>{
        detail.fields.forEach((f)=>{
          repeatAttrs.push(`${detail.section}_${id}_${f}`);
        });
      });
      repeatAttrs.push(`_reporder_${detail.section}`);
      if(queue.length){
        worker(queue,repeatAttrs,sections);
      }else{
        callback(repeatAttrs,sections);
      }
    });
  };
  if(!queueClone[0]){
    callback([],{});
  }else{
    worker(queueClone);
  }
};
kFuncs.getSections = getSections;

// Sets the attributes while always calling with {silent:true}
// Can be awaited to get the values returned from _setAttrs
/**
 * Alias for [setAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#setAttrs.28values.2Coptions.2Ccallback.29) that sets silently by default.
 * @memberof Sheetworker Aliases
 * @alias setAttrs
 * @param {object} obj - The object containting attributes to set
 * @param {boolean} [vocal=false] - Whether to set silently (default value) or not.
 * @param {function()} [callback] - The callback function to invoke after the setting has been completed. No arguments are passed to the callback function.
 * @example
 * //Set some attributes silently
 * k.setAttrs({attribute_1:'new value'})
 * //Set some attributes and triggers listeners
 * k.setAttrs({attribute_1:'new value',true})
 * //Set some attributes and call a callback function
 * k.setAttrs({attribute_1:'new value'},null,()=>{
 *  //Do something after the attribute is set
 * })
 */
const set = function(obj,vocal=false,callback){
  setAttrs(obj,{silent:!vocal},callback);
};
kFuncs.setAttrs = set;

const generateCustomID = function(string){
  if(!string.startsWith('-')){
    string = `-${string}`;
  }
  rowID = generateRowID();
  let re = new RegExp(`^.{${string.length}}`);
  return `${string}${rowID.replace(re,'')}`;
};


/**
 * Alias for generateRowID that adds the new id to the {@link sectionObj}. Also allows for creation of custom IDs that conform to the section ID requirements.
 * @memberof Sheetworker Aliases
 * @name generateRowID
 * @param {sectionObj} sections
 * @param {string} [customText] - Custom text to start the ID with. This text should not be longer than the standard repeating section ID format.
 * @returns {string} - The created ID
 * @example
 * k.getAllAttrs({
 *  callback:(attributes,sections,casc)=>{
 *    //Create a new row ID
 *    const rowID = k.generateRowID('repeating_equipment',sections);
 *    console.log(rowID);// => repeating_equipment_-p8rg908ug0suzz
 *    //Create a custom row ID
 *    const customID = k.generateRowID('repeating_equipment',sections,'custom');
 *    console.log(customID);// => repeating_equipment_-custom98uadj89kj
 *  }
 * });
 */
const _generateRowID = function(section,sections,customText){
  let rowID = customText ?
    generateCustomID(customText) :
    generateRowID();
  section = section.match(/^repeating_[^_]+$/) ?
    section :
    `repeating_${section}`;
  sections[section] = sections[section] || [];
  sections[section].push(rowID);
  return `${section}_${rowID}`;
};
kFuncs.generateRowID = _generateRowID;

/**
 * An alias for [Roll20's getTranslationByKey](https://wiki.roll20.net/Sheet_Worker_Scripts#getTranslationByKey.28.5Bkey.5D.29) that also supports data-i18n-vars syntax replacement and returns the translation key if no value is found instead of `false`.
 * @memberof Sheetworker Aliases
 * @name getTranslationByKey
 * @param {string} key - The translation key to look up.
 * @param {string[]} [variables = []] - An array of variable values to replace variable indexes with.
 * @returns {string}
 */
const _getTranslationByKey = (key,variables = []) => {
  let translate = getTranslationByKey(key) || key;
  console.warn('getTranslationByKey',getTranslationByKey(key));
  console.warn('translate:',translate);
  variables.forEach((v,i) => {
    translate = translate.replace(new RegExp(`\\{\\{${i}\\}\\}`,'g'),v);
  });
  return translate;
}
kFuncs.getTranslationByKey = _getTranslationByKey;

/**
 * Assembles the roll string from the roll object
 * @param {object} rollObj - object describing the roll
 * @param {string} [rollStart = '@{template_start}'] - The string to start the roll with.
 * @returns {string}
 */
const assembleRoll = (rollObj,rollStart = kFuncs.defaultRollStart) => {
  return Object.entries(rollObj).reduce((str,[field,content])=>{
    return str += content ?
      ` {{${field}=${content}}}` :
      '';
  },`${rollStart}`);
};


/**
 * @typedef {Object} kRoll
 * @property {Object} roll - The roll object returned by [Roll20's startRoll](https://wiki.roll20.net/Custom_Roll_Parsing#Sheetworker_Functions).
 * @property {Function} roll.finish - Finishes the associated roll passing it the computeObj and rollId.
 * @property {Object} computeObj - object for storing manipulations to the roll. Assign manipulations to this, DO NOT reassign it to a new object.
 */

/**
 * 
 * @param {object} rollObj - Object specifying the fields to pass to the rolltemplate. Object keys are field names. Object values are the field values.
 * @param {string} [startString = '@{template_start}'] - Text that should be prepended to the roll string that results from rollObj.
 * @returns {kRoll} 
 */
const _startRoll = async (rollObj,startString) => {
  const rollString = assembleRoll(rollObj,startString);
  const roll = await startRoll(rollString);
  const computeObj = {};
  roll.finish = () => {
    finishRoll(roll.rollId,computeObj);
  };
  return {roll, computeObj};
};
kFuncs.startRoll = _startRoll;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
const listeners = {};

/**
 * The array of attribute names that the k-scaffold gets by default. Does not incude repeating attributes.
 * @memberof Variables
 * @var
 * @type {array}
 */
const baseGet = Object.entries(cascades).reduce((memo,[attrName,detailObj])=>{
  if(!/repeating/.test(attrName) && detailObj.type !== 'action'){
    memo.push(detailObj.name);
  }
  if(detailObj.listener){
    listeners[detailObj.listener] = detailObj.listenerFunc;
  }
  return memo;
},[]);
kFuncs.baseGet = baseGet;

const registerEventHandlers = function(){
  on('sheet:opened',updateSheet);
  debug({funcKeys:Object.keys(funcs),funcs});
  //Roll20 change and click listeners
  Object.entries(listeners).forEach(([event,funcName])=>{
    if(funcs[funcName]){
      on(event,funcs[funcName]);
    }else{
      debug(`!!!Warning!!! no function named ${funcName} found. No listener created for ${event}`,true);
    }
  });
  log(`kScaffold Loaded`);
};
setTimeout(registerEventHandlers,0);//Delay the execution of event registration to ensure all event properties are present.

/**
 * Function to add a repeating section when the add button of a customControlFieldset or inlineFieldset is clicked.
 * @memberof Sheetworkers
 * @param {object} event - The R20 event object
 */
const addItem = function(event){
  let [,,section] = parseClickTrigger(event.triggerName);
  section = section.replace(/add-/,'');
  getAllAttrs({
    callback:(attributes,sections,casc) => {
      let row = _generateRowID(section,sections);
      debug({row});
      attributes[`${row}_name`] = '';
      setActionCalls({attributes,sections});
      const trigger = cascades[`fieldset_repeating_${section}`];
      if(trigger){
        if(trigger.addFuncs){
          trigger.addFuncs.forEach((funcName) => {
            if(funcs[funcName]){
              funcs[funcName]({attributes,sections,casc,trigger,newRow:row});
            }
          });
        }
        if(Array.isArray(trigger.affects)){
          attributes.queue.push(...trigger.affects);
        }
      }
      attributes.set({attributes,sections,casc});
    }
  });
};
funcs.addItem = addItem;/**
 * The default tab navigation function of the K-scaffold. Courtesy of Riernar. It will add `k-active-tab` to the active tab-container and `k-active-button` to the active button. You can either write your own CSS to control display of these, or use the default CSS included in `scaffold/_k.scss`. Note that `k-active-button` has no default CSS as it is assumed that you will want to style the active button to match your system.
 * @memberof Sheetworkers
 * @param {Object} trigger - The trigger object
 * @param {object} attributes - The attribute values of the character
 */
const kSwitchTab = function ({ trigger, attributes }) {
  const [container, tab] = (
    trigger.name.match(/nav-tabs-(.+)--(.+)/) ||
    []
  ).slice(1);
  $20(`[data-container-tab="${container}"]`).removeClass('k-active-tab');
  $20(`[data-container-tab="${container}"][data-tab="${tab}"]`).addClass('k-active-tab');
  $20(`[data-container-button="${container}"]`).removeClass('k-active-button');
  $20(`[data-container-button="${container}"][data-button="${tab}"]`).addClass('k-active-button');
  const tabInputName = `${container.replace(/\-/g,'_')}_tab`;
  if(persistentTabs.indexOf(tabInputName) > -1){
    attributes[tabInputName] = trigger.name;
  }
}

registerFuncs({ kSwitchTab });

/**
 * Sets persistent tabs to their last active state
 * @memberof Sheetworkers
 * @param {object} attributes - The attribute values of the character
 */
const kTabOnOpen = function({trigger,attributes,sections,casc}){
  if(typeof persistentTabs === 'undefined') return;
  persistentTabs.forEach((tabInput) => {
    const pseudoTrigger = {name:attributes[tabInput]};
    kSwitchTab({trigger:pseudoTrigger, attributes});
  });
};
registerFuncs({ kTabOnOpen },{type:['opener']});
  return kFuncs;
  }());
  const actionAttributes = [];
  const calcFromAdditive = function({trigger,attributes,additiveList}) {
    const base = trigger.name;
    let result = 0;
    for (let attr of additiveList) {
        let value = attributes[attr];
        if(value ==5) {
            value = 4;
        } else if(value ==0) {
            value = 5;
            
        } else {
            value = value-1;
        }
        k.debug("got " + attr + " with value " + value);
        result = result + value;
    }
    k.debug("now returning " + (result));
    return result;
  };

const calcNewValue = function({trigger,attributes}) {
    var additiveList = trigger.formula.split(",");
    if(additiveList.length == 0) {
        return null;
    } else {
        return calcFromAdditive({trigger,attributes,additiveList});
    }
};

const getAffectsList = function({name}) {


}
k.registerFuncs({calcFromAdditive, calcNewValue});/**
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

  

console.debug = vi.fn(a => null);
console.log = vi.fn(a => null);
console.table = vi.fn(a => null);
module.exports = {k,...global};