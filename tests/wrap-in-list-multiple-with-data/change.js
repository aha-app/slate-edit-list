export default function(plugin, change) {
    const data = { style: { listStyleType: 'disc' } };
    return change.command(plugin.changes.wrapInList, false, data);
}
