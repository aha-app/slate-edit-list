// @flow
import { type Editor } from 'slate';

import type Options from '../options';
import { decreaseItemDepth, increaseItemDepth } from '../changes';
import { getCurrentItem } from '../utils';

/**
 * User pressed Tab in an editor.
 * Tab       -> Increase item depth if inside a list item
 * Shift+Tab -> Decrease item depth if inside a list item
 */
function onTab(event: *, editor: Editor, next: *, opts: Options): void | any {
    const { value } = editor;
    const { isCollapsed } = value.selection;

    if (!isCollapsed || !getCurrentItem(opts, value)) {
        return next();
    }

    // Shift+tab reduce depth
    if (event.shiftKey) {
        event.preventDefault();

        return decreaseItemDepth(opts, editor);
    }

    if (change.value.startOffset == 0) {
        // Tab increases depth
        event.preventDefault();

        return increaseItemDepth(opts, editor);
    }

    return next();
}

export default onTab;
