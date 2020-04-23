/*var a = [1, 2, 3];
var b = [2, 4, 5];

// 并集

var union = a.concat(b.filter(function (v) {
    return a.indexOf(v) === -1
})) // [1,2,3,4,5]


// 交集

var intersection = a.filter(function (v) { return b.indexOf(v) > -1 }) // [2]
var difference = data.code.photos.filter(function (v) { return data.temps.find(item=>item.ID==v.ID) === undefined })// [1,3]

// 差集

var difference = a.filter(function (v) { return b.indexOf(v) === -1 })// [1,3]*/



/*------------对象数组----
 * 
 * 并集
        let a = [{ id: '1' }, { id: '2' }];
        let b = [{ id: '2' }, { id: '1' }, { id: '4' }];
        var union = a.concat(b.filter(function (v) {
            let ret = false;
            a.some(item => {
                if (item["id"] == v["id"]) {
                    ret = true;
                }
            })
            return !ret
        })) // [1,2,3,4,5]
        console.log(union);
 * 
 * 交集
        let a = [{ id: '1' }, { id: '2' }, { id: '4' }];
        let b = [{ id: '2' }, { id: '11' }, { id: '4' }];
        var union = a.filter(item => {
            let ret = false;
            b.some(v => {
                if (item["id"] == v["id"]) {
                    ret = true;
                }
            })
            return ret;
        })
        console.log(union);
 * 
 * 
 * 差集
 *        let a = [{ id: '1' }, { id: '2' }, { id: '4' }];
        let b = [{ id: '2' }, { id: '11' }, { id: '4' }];
        var union = a.filter(item => {
            let ret = false;
            b.some(v => {
                if (item["id"] == v["id"]) {
                    ret = true;
                }
            })
            return !ret;
        }).concat(b.filter(item => {
            let ret = false;
            a.some(v => {
                if (item["id"] == v["id"]) {
                    ret = true;
                }
            })
            return !ret;
        }))
        console.log(union);
 * 
 * 排序
 *var arr = [
    {name:'zopp',age:0},
    {name:'gpp',age:18},
    {name:'yjj',age:8}
];

function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}
console.log(arr.sort(compare('age')))
 *
 * -------------------------*/