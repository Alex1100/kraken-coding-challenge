const dissolveExponentialNotation = (number) => {
    if(!Number.isFinite(number)){
      return undefined;
    }

    let text = number.toString();
    let items = text.split('e');

    if(items.length == 1) {
      return text;
    }

    let significandText = items[0];
    let exponent = parseInt(items[1]);

    let characters = Array.from(significandText);
    let minus = characters[0] == '-';

    if (minus) {
      characters.splice(0, 1);
    }

    let indexDot = characters
                    .reduce((accumulator, character, index) => {
        if (!accumulator.found) {
          if(character == '.') {
            accumulator.found = true;
          } else {
            accumulator.index++;
          }
        }
        return accumulator;
    }, { index: 0, found: false }).index;

    characters.splice(indexDot, 1);

    indexDot += exponent;

    if (indexDot >= 0 && indexDot < characters.length - 1) {
      characters.splice(indexDot, 0, '.');
    } else if(indexDot < 0) {
      characters.unshift("0.", "0".repeat(-indexDot));
    } else {
      characters.push("0".repeat(indexDot - characters.length));
    }

    return (minus ? "-" : "") + characters.join("");
};


module.exports = dissolveExponentialNotation;
