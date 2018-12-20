// @flow
import { type Change } from 'slate';

import type Options from '../options';
import { getCurrentItem } from '../utils';

/**
 * Split a list item at the start of the current range.
 */
function splitListItem(opts: Options, change: Change): Change {
    const { value } = change;
    const currentItem = getCurrentItem(opts, value);
    if (!currentItem) {
        return change;
    }

    const splitOffset = value.selection.start.offset;

    change = change.splitDescendantsByKey(
        currentItem.key,
        value.selection.start.key,
        splitOffset
    );
    value.activeMarks.forEach((mark) => {
        change = change.addMark(mark);
    });
    return change;
}

export default splitListItem;
