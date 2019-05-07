// @flow
import { type Editor } from 'slate';

import type Options from '../options';
import { unwrapList } from '../changes';
import { getCurrentItem } from '../utils';

/**
 * User pressed Delete in an editor
 */
function onBackspace(
    event: *,
    editor: Editor,
    next: *,
    opts: Options
): void | any {
    const { value } = editor;
    const { selection } = value;

    // Only unwrap...
    // ... with a collapsed selection
    if (selection.isExpanded) {
        return next();
    }

    // ... when at the beginning of nodes
    if (selection.start.offset > 0) {
        return next();
    }
    // ... in a list
    const currentItem = getCurrentItem(opts, value);
    if (!currentItem) {
        return next();
    }
    // ... more precisely at the beginning of the current item
    if (!selection.anchor.isAtStartOfNode(currentItem)) {
        return next();
    }

    event.preventDefault();
    return unwrapList(opts, editor);
}

export default onBackspace;
