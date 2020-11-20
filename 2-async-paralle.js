/*========================================
二、使用异步并行钩子

	AsyncParallelHook,
    AsyncParallelBailHook,


==========================================*/

//pre:首先因为这是异步并行的学习，我们可以先尝试用串行注册的tap跑一下，看下效果


const {
	AsyncParallelHook,
	AsyncParallelBailHook,
 } = require("tapable");




//(1)AsyncParallelHook 
//主要是并行执行一些操作，并不牵涉到值得传递
//主要有tapAsync和tapPromise两种执行方法


//a.首先是tapAsync注册




let queue1 = new AsyncParallelHook(['name']);
console.time('cost1');
queue1.tapAsync('1', function (name, cb) {
    setTimeout(() => {
        console.log(name, 1);
        cb(null,'1');
    }, 2000);
});
queue1.tapAsync('2', function (name, cb) {
    setTimeout(() => {
        console.log(name, 2);
        cb(null,'2');
    }, 1000);
});

//输入一个name然后回调可以展开
queue1.callAsync('tapAsync', (err,res) => {
    console.log('over',res);
    console.log('err',err);
    console.timeEnd('cost1');
});




//result：
// tapAsync 2
// tapAsync 1
// over undefined
// cost1: 2.007s




//b.然后是tapPromise注册





let queue2 = new AsyncParallelHook(['name']);
console.time('cost2');
queue2.tapPromise('1', function (name, cb) {
   return new Promise(function (resolve, reject) {
       setTimeout(() => {
           console.log(name, 1);
           resolve('1');
       }, 1000);
   });
});

queue2.tapPromise('2', function (name, cb) {
   return new Promise(function (resolve, reject) {
       setTimeout(() => {
           console.log(name, 2);
           reject('error')
       }, 2000);
   });
});


queue2.promise('tapPromise')
.then((al) => {
    console.log('over'+al);
    console.timeEnd('cost2');
}, (err) => {
    console.log('error',err);
    console.timeEnd('cost2');
});






//result
// tapPromise 1
// tapPromise 2
// error error
// cost2: 2.023






//(2)AsyncParallelBailHook,


//带阻断的情况
//相对上一个没有阻断的情况，在触发的时候只有第一个事件有回调



//a.使用tapAsync注册



let queue3 = new AsyncParallelBailHook(['name']);
console.time('cost3');

queue3.tapAsync('1',(name,cb)=>{
    setTimeout(() => {
        console.log(name, 1);
        cb()
    }, 1000); 
})
queue3.tapAsync('2',(name,cb)=>{
    setTimeout(() => {
        console.log(name, 2);
        cb(null,'2');
    }, 2000); 
});

queue3.tapAsync('3',(name,cb)=>{
    setTimeout(() => {
        console.log(name, 3);
        cb();
    }, 3500); 
});


queue3.callAsync('bail tapAsync',(err,res)=>{
    console.log('over' + res);
    console.timeEnd('cost3');
})



//result
//只要有返回值，最终调用就会停止
//但因为是并发的，其它的注册事件还会执行


// bail tapAsync 1
// over1        
// cost3: 1.028s
// bail tapAsync 2
// bail tapAsync 3





//b.使用tapPromise注册

//带唯一参数name
let queue4 = new AsyncParallelBailHook(['name']);

console.time('cost4');
queue4.tapPromise('1', function (name) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log(name, 1);
            //done
            resolve();
        }, 1000);
    });
});


queue4.tapPromise('2', function (name) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log(name, 2);
            reject('error')
        }, 1000);
    });
});

queue4.tapPromise('3', function (name) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log(name, 3);
            resolve();
        }, 1000);
    });
});



//调用
queue4.promise('bail tapPromise')
.then((res) => {
    console.log('over',res);
    console.timeEnd('cost4');
}, (error) => {
    console.log('error',error);
    console.timeEnd('cost4');
});






//result：
//一单有返回值，最终调用就会停止
//但是注册事件是并发的，还会继续执行下去

// bail tapPromise 1
// bail tapPromise 2
// error error      
// cost4: 1.034s    
// bail tapPromise 3

