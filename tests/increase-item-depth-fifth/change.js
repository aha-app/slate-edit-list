export default function(plugin, change) {
    return change.command(plugin.changes.increaseItemDepth);
}
