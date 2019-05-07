/**
 * True if the node has no text and no void descendants
 */
function isEmpty(opts, editor, node) {
    if (node.object === 'text') {
        return node.text == '';
    } else {
        return !editor.isVoid(node) &&
            !node.nodes.some(child => !isEmpty(opts, editor, child));
    }
}

export default isEmpty;
