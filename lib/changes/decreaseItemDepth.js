// @flow
import { Block, type Change } from 'slate';

import type Options from '../options';
import { getItemDepth, getCurrentItem, isList } from '../utils';
import { unwrapList } from '../changes';

/**
 * Decreases the depth of the current item. The following items will
 * be moved as sublist of the decreased item.
 *
 * No-op for root items.
 */
function decreaseItemDepth(opts: Options, change: Change, block): Change {
    const { value } = change;
    const { document } = value;

    const currentItem = getCurrentItem(opts, value, block);
    if (!currentItem) {
        return change;
    }
    const currentList = document.getParent(currentItem.key);
    const parentItem = document.getParent(currentList.key);

    // If we're trying to decrease the depth of a root item, unwrap it
    // from the list instead.
    const depth = getItemDepth(opts, value, block);
    if (depth == 1 && !isList(opts, parentItem)) {
        return unwrapList(opts, change, block);
    }

    const parentList = isList(opts, parentItem)
        ? parentItem
        : document.getParent(parentItem.key);
    const insertionIndex =
        parentItem === parentList
            ? parentList.nodes.indexOf(currentList) + 1
            : parentList.nodes.indexOf(parentItem) + 1;

    // The items following the item will be moved to a sublist of currentItem
    const followingItems = currentList.nodes
        .skipUntil(i => i === currentItem)
        .rest();

    // True if the currentItem and the followingItems make the whole
    // currentList, and hence the currentList will be emptied
    const willEmptyCurrentList =
        currentList.nodes.size === followingItems.size + 1;

    if (!followingItems.isEmpty()) {
        change.withoutNormalizing(change => {

            // Add them as sublist of currentItem
            const sublist = Block.create({
                object: 'block',
                type: currentList.type,
                data: currentList.data
            });
            // Add the sublist
            change.insertNodeByKey(
                currentItem.key,
                currentItem.nodes.size,
                sublist
            );

            change.moveNodeByKey(currentItem.key, parentList.key, insertionIndex);

            // Move the followingItems to the sublist
            followingItems.forEach((item, index) =>
                change.moveNodeByKey(
                    item.key,
                    sublist.key,
                    sublist.nodes.size + index
                )
            );
        });
    } else {
        change.moveNodeByKey(currentItem.key, parentList.key, insertionIndex);
    }

    // Remove the currentList completely if needed
    if (willEmptyCurrentList) {
        change.removeNodeByKey(currentList.key);
    }

    return change;
}

export default decreaseItemDepth;
