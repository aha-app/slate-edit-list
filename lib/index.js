// @flow
import Options, { type OptionsFormat } from './options';
import { onEnter, onTab, onBackspace } from './handlers';
import core from './core';

const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';
const KEY_BACKSPACE = 'Backspace';

/**
 * A Slate plugin to handle keyboard events in lists.
 */
function EditList(
    // Options for the plugin
    opts: OptionsFormat = {}
): Object {
    opts = new Options(opts);
    const corePlugin = core(opts);

    return {
        ...corePlugin,

        onKeyDown: onKeyDown.bind(null, opts)
    };
}

/**
 * User is pressing a key in the editor
 */
function onKeyDown(opts: Options, event, editor, next: *): void | any {
    const args = [event, editor, next, opts];

    switch (event.key) {
        case KEY_ENTER:
            return onEnter(...args);
        case KEY_TAB:
            return onTab(...args);
        case KEY_BACKSPACE:
            return onBackspace(...args);
        default:
            return next();
    }
}

export default EditList;
