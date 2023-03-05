let myDict = Object.create(null)

myDict[1] = 2
myDict[7] = 8
myDict[3] = 5
myDict[-1] = 4
console.log(Object.keys(myDict)[0])
let sorted_keys = Object.keys(myDict).sort(function (a,b){return myDict[a] - myDict[b]})
console.log(sorted_keys[0])