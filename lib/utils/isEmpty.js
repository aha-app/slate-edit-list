/**
 * True if the node has no text and no void descendants
 */
function isEmpty(opts, value, node) {
    if (node.object === 'text') {
        return node.text == '';
    } else {
        return !value.schema.isVoid(node) &&
            !node.nodes.some(child => !isEmpty(opts, value, child));
    }
}

export default isEmpty;
