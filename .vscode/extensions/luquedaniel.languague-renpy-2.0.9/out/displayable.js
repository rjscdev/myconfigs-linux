// Displayable Class
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Displayable = void 0;
class Displayable {
    constructor(name, image_type, definition, filename, location) {
        this.name = name;
        this.image_type = image_type;
        this.definition = definition;
        this.filename = filename;
        this.location = location;
        if (name.indexOf(' ') > 0) {
            this.tag = name.split(' ')[0];
        }
        else {
            this.tag = name;
        }
    }
}
exports.Displayable = Displayable;
//# sourceMappingURL=displayable.js.map