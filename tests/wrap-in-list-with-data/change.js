export default function(plugin, change) {
    const data = { style: { listStyleType: 'decimal' } };
    return change.command(plugin.changes.wrapInList, 'ol_list', data);
}
