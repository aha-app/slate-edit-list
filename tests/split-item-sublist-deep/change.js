import expect from 'expect';

export default function(plugin, change) {
    plugin.changes.splitListItem(change);

    // check new selection
    const selectedNode = change.value.document.getTexts().get(2);

    expect(change.value.selection.toJS()).toMatch({
        anchor: {
            path: change.value.document.assertPath(selectedNode.key).toJS(),
            offset: 0
        },
        focus: {
            path: change.value.document.assertPath(selectedNode.key).toJS(),
            offset: 0
        }
    });

    return change;
}
