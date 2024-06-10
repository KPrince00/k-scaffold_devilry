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
    k.debug("now returning " + (result+1));
    return result+1;
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
k.registerFuncs({calcFromAdditive, calcNewValue});