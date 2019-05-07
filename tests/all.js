/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import expect from 'expect';
import fs from 'fs';
import path from 'path';
import Slate from 'slate';

import EditList from '../lib';

// Provide the value with
function deserializeValue(plugin, value) {
    const editor = new Slate.Editor({
        value,
        plugins: [plugin]
    },
    { normalize: false });

    return editor.value;
}

describe('slate-edit-list', () => {
    const tests = fs.readdirSync(__dirname);

    tests.forEach((test, index) => {
        if (test[0] === '.' || path.extname(test).length > 0) return;
        it(test, () => {
            const dir = path.resolve(__dirname, test);
            const plugin = EditList();

            const input = require(path.resolve(dir, 'input.js')).default;

            const inputEditor = new Slate.Editor({
                value: Slate.Value.fromJSON(input),
                plugins: [plugin]
            }, { normalize: false });

            const expectedPath = path.resolve(dir, 'expected.js');
            const expected =
                fs.existsSync(expectedPath) &&
                  require(expectedPath).default;

            const expectedEditor = new Slate.Editor({
                value: Slate.Value.fromJSON(expected),
                plugins: [plugin]
            });

            const runChange = require(path.resolve(dir, 'change.js')).default;

            inputEditor.change(change => {
                runChange(plugin, change);
                // Some runChange methods don't perform changes, which
                // means the value won't get normalized at the
                // end. But the expected _is_ always normalized. So we
                // need to force a normalize here.
                change.normalize();
            });
            
            if (expected) {
                expect(JSON.stringify(inputEditor.value)).toEqual(
                  JSON.stringify(expectedEditor.value)
                );
            }
        });
    });
});
