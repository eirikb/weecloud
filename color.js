var colors = {
    '00': 'black',
    '01': 'red',
    '02': 'green',
    '03': 'brown',
    '04': 'blue',
    '05': 'magenta',
    '06': 'cyan',
    '07': 'gray',
    '08': 'darkgray',
    '09': 'lightred',
    10: 'lightgreen',
    11: 'yellow',
    12: 'lightblue',
    13: 'lightmagenta',
    14: 'lightcyan'
};

exports.parse = function(line) {
    var def = colors['00'],
    s = '\u0019',
    parts = line.split(s);

    if (parts.length > 1) {
        parts = parts.slice(1).map(function(part) {
            var color = colors[part.slice(0, 2)];
            if (!color) {
                color = def;
            }
            return {
                part: part.slice(2),
                color: color
            };
        });
    } else {
        parts = [{
            color: def,
            part: line
        }];
    }
    return parts;
};

