/*========================================
三、使用异步串行钩子

	AsyncSeriesHook,
	AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook

AsyncSeries. An async-series hook can be tapped with synchronous, 
callback-based and promise-based functions (using myHook.tap(), myHook.tapAsync() and myHook.
tapPromise()). They call each async method in a row.



==========================================*/



const {
    //异步并行钩子
	AsyncSeriesHook,
	AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
 } = require("tapable");



//(1)AsyncSeriesHook

//a.tapAsync + callAsync


/*
let queue1 = new AsyncSeriesHook(['name']);
console.time('cost1');


queue1.tapAsync('1', function (name, cb) {
    setTimeout(() => {
        console.log(name, 1);
        cb(null,'1');
    }, 3000);
});
queue1.tapAsync('2', function (name, cb) {
    setTimeout(() => {
        console.log(name, 2);
        //cb("error",'2');
        cb();
    }, 2000);
}); 
queue1.tapAsync('3', function (name, cb) {
    setTimeout(() => {
        console.log(name, 3);
        cb();
    }, 1000);
});

queue1.callAsync('series cb', (res) => {
    console.log('over',res);
    console.timeEnd('cost1');
}); 
*/



//执行结果
//不论回调时间，就是按顺序执行
//一旦返回error就会停止执行


// series 1
// series 2
// series 3
// over undefined
// cost1: 6.031s 


//b.tapPromise + promise


/*
let queue2 = new AsyncSeriesHook(['name']);
console.time('cost2');
queue2.tapPromise('1',function(name){
   return new Promise(function(resolve,reject){
       setTimeout(function(){
           console.log(name, 1);
           resolve('1');
       },1000)
   });
});
queue2.tapPromise('2',function(name,callback){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log(name, 2);
            reject('error');
        },2000)
    });
});
queue2.tapPromise('3',function(name,callback){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log(name, 3);
            resolve();
        },3000)
    });
});
queue2.promise('series promise').then(res=>{
    console.log(res);
    console.timeEnd('cost2');
}).catch((err)=>{
    console.log('error',err);
    console.timeEnd('cost2');
});


*/


// 执行结果
//同样是按顺序执行,当然如果抛出错误，会在抛出错误的时候停止
/* 
series promise 1
series promise 2
error error
cost2: 3.032s
*/


//(2)AsyncSeriesBailHook

//a.stapAsync + callAsync

/*
let queue3 = new AsyncSeriesBailHook(['name']);
console.time('cost3');

queue3.tapAsync('1', function (name, cb) {
    setTimeout(() => {
        console.log(name, 1);
        cb();
    }, 3000);
});
queue3.tapAsync('2', function (name, cb) {
    setTimeout(() => {
        console.log(name, 2);
        cb(null,1);
    }, 2000);
});
queue3.tapAsync('3', function (name, cb) {
    setTimeout(() => {
        console.log(name, 3);
        cb();
    }, 1000);
});

queue3.callAsync('series bail', (res) => {
    console.log('over',res);
    console.timeEnd('cost3');
}); 
*/


//执行结果
//按顺序执行，一旦有返回值，无论是任何返回值都会停止

// series bail 1
// series bail 2
// over null
// cost3: 5.024s


// b .tapPromise + promise



/*
let queue4 = new AsyncSeriesBailHook(['name']);
console.time('cost4');
queue4.tapPromise('1',function(name){
   return new Promise(function(resolve,reject){
       setTimeout(function(){
           console.log(name, 1);
           resolve();
       },1000)
   });
});
queue4.tapPromise('2',function(name,callback){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log(name, 2);
            resolve('2')
        },2000)
    });
});
queue4.tapPromise('3',function(name,callback){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log(name, 3);
            resolve()
        },3000)
    });
});
queue4.promise('series promise').then(res=>{
    console.log(res);
    console.timeEnd('cost4');
}).catch((err)=>{
    console.log('error',err);
    console.timeEnd('cost4');
});


*/

//执行结果

// series promise 1
// series promise 2
// 2
// cost4: 3.032s





//(3) AsyncSeriesWaterfallHook

/*
let queue5 = new  AsyncSeriesWaterfallHook(['name']);
console.time('cost5');

queue5.tapAsync('1', function (name, cb) {
    setTimeout(() => {
        console.log(name);
        cb(null,1);
    }, 3000);
});
queue5.tapAsync('2', function (data, cb) {
    setTimeout(() => {
        console.log('this is 2 , get data from 1:',data);
        cb(null,2);
    }, 2000);
});
queue5.tapAsync('3', function (data, cb) {
    setTimeout(() => {
        console.log('this is 3, get data from 2:',data);
        cb(null,3)
    }, 1000);
});

queue5.callAsync('series bail', (res) => {
    console.log('over',res);
    console.timeEnd('cost5');
}); 

*/

//result
//按顺序执行，上一级的值可以往下一级传递

// series bail
// this is 2 , get data from 1: 1
// this is 3, get data from 2: 2
// over null
// cost5: 6.034s

let queue6 = new  AsyncSeriesWaterfallHook(['name']);
console.time('cost6');
queue6.tapPromise('1',function(name){
   return new Promise(function(resolve,reject){
       setTimeout(function(){
           console.log(name, 1);
           resolve('1');
 
       },1000)
   });
});
queue6.tapPromise('2',function(data){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log('this is 2 , get data form 1:', data);
            resolve('2')
        },2000)
    });
});
queue6.tapPromise('3',function(data){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log('this is 3 , get data from 2:',data);
            resolve()
        },3000)
    });
});
queue6.promise('series promise').then(res=>{
    console.log(res);
    console.timeEnd('cost6');
}).catch((err)=>{
    console.log('error',err);
    console.timeEnd('cost4');
});

//result
//按顺序执行，resolve会把上一级的值传递给下一级

// series promise 1
// this is 2 , get data form 1: 1
// this is 3 , get data from 2: 2
// 2
// cost6: 6.042s