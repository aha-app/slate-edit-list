/** @jsx h */
import h from 'h';

export default (
    <value>
        <document>
            <ul_list>
                <list_item>
                    <paragraph>First item</paragraph>
                </list_item>
                <ul_list>
                    <list_item>
                        <paragraph>
                            Se
                            <cursor />
                            cond item
                        </paragraph>
                    </list_item>
                </ul_list>
            </ul_list>
        </document>
    </value>
);

// document:
//   nodes:
//     - object: block
//       type: ul_list
//       nodes:
//         - object: block
//           type: list_item
//           nodes:
//             - object: block
//               type: paragraph
//               nodes:
//                 - object: text
//                   leaves:
//                     - text: First item
//             - object: block
//               type: ul_list
//               nodes:
//                 - object: block
//                   type: list_item
//                   nodes:
//                     - object: block
//                       type: paragraph
//                       nodes:
//                         - object: text
//                           key: '_selection_key'
//                           leaves:
//                             - text: Second item
// selection:
//   anchorKey: '_selection_key'
//   anchorOffset: 2
//   focusKey: '_selection_key'
//   focusOffset: 2
//   isFocused: true
