let list1 = [5,4,3,2,1]
let list2 = [6,7,8,9,0]

function bubbleSort(arr, arr1){
    if (arr.length === arr1.length) {
        //Outer pass
        for (let i = 0; i < arr.length; i++) {

            //Inner pass
            for (let j = 0; j < arr.length - i - 1; j++) {

                //Value comparison using ascending order

                if (arr[j + 1] < arr[j]) {

                    //Swapping
                    [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
                    [arr1[j + 1], arr1[j]] = [arr1[j], arr1[j + 1]];

                }
            }
        }
        return [arr, arr1];
    }
}

console.log(bubbleSort(list1, list2))