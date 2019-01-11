var arr = [{
        "id": "4",
        "title": "过，这条推文还是被网友“Marques Brownlee”截图发出。Marques Brownle",
        "stick": "2",
        "sort": "3"
    }, {
        "id": "9",
        "title": "阿斯蒂芬请按发布hi按时收费按时来饭了否",
        "stick": "1",
    }, {
        "id": "3",
        "stick": "1",
    },
    {
        "id": "4",
        "title": "过，这条推文还是被网友“Marques Brownlee”截图发出。Marques Brownle",
        "stick": "2",
        "sort": "4"
    }
]

function sortByStick(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        item.stick === "1" ? newArr.push(item) && arr.splice(i, 1) && i-- : "";
    }
    return newArr.concat(arr)
}
console.log(sortByStick(arr));