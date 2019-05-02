// @flow
import { List } from 'immutable';
import { type Change, type Block } from 'slate';

import type Options from '../options';
import { getItemsAtRange, getCurrentItem } from '../utils';

/**
 * Unwrap items at range from their list.
 */
function unwrapList(opts: Options, change: Change, block: Block): Change {
    const currentItem = block && getCurrentItem(opts, change.value, block);
    const items = currentItem
        ? List([currentItem])
        : getItemsAtRange(opts, change.value);

    if (items.isEmpty()) {
        return change;
    }

    change.withoutNormalizing(change => {
        // Unwrap the items from their list
        items.forEach(item =>
            change.unwrapNodeByKey(item.key)
        );

        // Parent of the list of the items
        const firstItem = items.first();
        const parent = change.value.document.getParent(firstItem.key);

        let index = parent.nodes.findIndex(node => node.key === firstItem.key);

        // Unwrap the items' children
        items.forEach(item => {
            item.nodes.forEach(node => {
                change.moveNodeByKey(node.key, parent.key, index);
                index += 1;
            });
        });

        // Finally, remove the now empty items
        items.forEach(item =>
            change.removeNodeByKey(item.key)
        );
    });
    return change;
}

export default unwrapList;
