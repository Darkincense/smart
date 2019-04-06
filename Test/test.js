import { addKey } from "../bulid/tools/array.js";
let arr = [
    {
        id: 1,
        name: '狄仁杰'
    },
    {
        id: 2,
        name: '亚瑟'
    }
]
addKey(arr, { 'type': '1' })
console.log(arr);