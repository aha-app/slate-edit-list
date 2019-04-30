// @flow
import { Data, type Value, type Change, type Block } from 'slate';
import { List } from 'immutable';

import type Options from '../options';
import { isList, getCurrentList, getCurrentItem } from '../utils';

/**
 * Wrap the blocks in the current selection in a new list. Selected
 * lists are merged together.
 */
function wrapInList(
    opts: Options,
    change: Change,
    type?: string,
    data?: Object | Data
): Change {
    const { value } = change;
    const { document, selection } = value;
    const selectedBlocks = getHighestSelectedBlocks(value);
    type = type || opts.types[0];

    // If we're wrapping a list inside another list, replace the type
    // of the list with the new list type. For example, if we call
    // wrapInList with 'ol_list', and we're inside a 'ul_list', replace
    // all the lists in the selection with 'ol_list'.
    const selectedLists = document
        .getBlocksAtRange(selection)
        .map(n => getCurrentList(opts, value, n))
        .filter(n => n);

    if (selectedLists.size !== 0) {
        selectedLists.forEach(list => change.setNodeByKey(list.key, type));
    }

    // Wrap in container
    if (!selectedBlocks.every(node => isPartOfList(opts, value, node))) {
        change.wrapBlock(
            {
                type,
                data: Data.create(data)
            },
            { normalize: false }
        );
    }

    // Wrap in list items
    selectedBlocks.forEach(node => {
        if (isList(opts, node)) {
            // Merge its items with the created list
            node.nodes.forEach(({ key }) =>
                change.unwrapNodeByKey(key, { normalize: false })
            );
        } else if (!isPartOfList(opts, value, node)) {
            change.wrapBlockByKey(node.key, opts.typeItem, {
                normalize: false
            });
        }
    });

    return change.normalize();
}

/**
 * Return true if node is a block inside a list item, a list item
 * itself, or a list. False otherwise.
 */
function isPartOfList(opts: Options, value: Value, block: Block) {
    return (
        block.type === opts.typeItem ||
        getCurrentItem(opts, value, block) ||
        getCurrentList(opts, value, block)
    );
}

/**
 * Returns the highest list of blocks that cover the current selection
 */
function getHighestSelectedBlocks(value: Value): List<Block> {
    const range = value.selection;
    const { document } = value;

    const startBlock = document.getClosestBlock(range.start.key);
    const endBlock = document.getClosestBlock(range.end.key);

    if (startBlock === endBlock) {
        return List([startBlock]);
    }
    const ancestor = document.getCommonAncestor(startBlock.key, endBlock.key);
    const startPath = ancestor.getPath(startBlock.key);
    const endPath = ancestor.getPath(endBlock.key);

    return ancestor.nodes.slice(startPath.get(0), endPath.get(0) + 1);
}

export default wrapInList;
