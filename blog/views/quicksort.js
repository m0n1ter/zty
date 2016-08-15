var _this = this;

/**
 * ��ͨ�����������
 *
 * @param arr Array ��������
 * @param dir asc����desc����
 *
 * @example:
 * sort([1,4,2,5])
 * sort([1,4,2,5],'asc')
 * sort([1,4,2,5],'desc')
 */
exports.sort=function(arr,dir){
    dir=dir||'asc';
    if (arr.length == 0) return [];

    var left = new Array();
    var right = new Array();
    var pivot = arr[0];

    if(dir==='asc'){//����
        for (var i = 1; i < arr.length; i++) {
            arr[i] < pivot ? left.push(arr[i]): right.push(arr[i]);
        }
    }else{//����
        for (var i = 1; i < arr.length; i++) {
            arr[i] > pivot ? left.push(arr[i]): right.push(arr[i]);
        }
    }
    return _this.sort(left,dir).concat(pivot, _this.sort(right,dir));
}
/**
 * ���������������
 *
 * @param arr Array ��������
 * @param key string �������������
 * @param dir asc����desc����
 *
 * @example:
 * sort([{name:'b',id:12},{name:'c',id:21},{name:'a',id:2}],'id')
 * sort([{name:'b',id:12},{name:'c',id:21},{name:'a',id:2}],'id','asc')
 * sort([{name:'b',id:12},{name:'c',id:21},{name:'a',id:2}],'id','desc')
 */
exports.sortObj=function(arr,key,dir){
    key=key||'id';
    dir=dir||'asc';
    if (arr.length == 0) return [];

    var left = new Array();
    var right = new Array();
    var pivot = arr[0][key];
    var pivotObj = arr[0];

    if(dir==='asc'){//����
        for (var i = 1; i < arr.length; i++) {
            arr[i][key] < pivot ? left.push(arr[i]): right.push(arr[i]);
        }
    }else{//����
        for (var i = 1; i < arr.length; i++) {
            arr[i][key] > pivot ? left.push(arr[i]): right.push(arr[i]);
        }
    }
    return _this.sortObj(left,key,dir).concat(pivotObj, _this.sortObj(right,key,dir));
}
