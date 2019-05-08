export default function(plugin, change) {
    return change.command(plugin.changes.wrapInList, 'ol_list');
}
