/*===============================================
一、target

1.生产消费者模式 vs 发布订阅模式
2.帮助理解钩子
3.tapable的基础用法
4.hooks的封装
5.webpack plugin的写法
6.源码分析
7.如何把tapable改的前端适用


二、基础概念

const {
    //同步钩子
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
    SyncLoopHook,
    
    //异步并行钩子
	AsyncParallelHook,
    AsyncParallelBailHook,
    

    //异步串行钩子
	AsyncSeriesHook,
	AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
    

 } = require("tapable");

（1）hook类型解析


    a.基本的钩子：也就是没有waterfall、Bail、或者Loop的
这个钩子只会简单的调用每个tap传进去的函数
    b.Waterfall: 也会调用每个tap传进来的函数，不同的是
它会从每一个函数传一个返回的值给下一个函数
    c.Bail: Bail钩子允许更早的退出，当某个tap进去的函数
返回任何值，bail类会停止其它的函数执行
    d.Loop：todo 如果某个tap事件有返回值.则会循环之前执行的事件



（2）三种注册方式

    支持三种方式注册插件,包含名称和对应回调
    a.tap ：使用同步钩子
    b.tapAsync ：使用带callback回调的异步钩子
    c.tapPromise : 使用带promise回调的异步钩子


（3）与注册相对应的三种调用方式

    与上边三种注册方式一一对应
    a.call ：调用注册的同步钩子
    b.callAsync ： 调用注册的有callback回调的异步钩子
    c.promise ： 调用注册的有promise回调的异步钩子




==============================================*/


console.log('======请先阅读并运行 1-sync.js 学习同步钩子=====')
console.log('千里之行，始于足下');


console.log('=====然后阅读并运行 2-async_paralle.js 学习异步并行钩子=====')
console.log('离成功又近了一大步');

console.log('=====再然后阅读并运行 3-async_series.js 学习异步串行钩子=====')
console.log('终点近在眼前');




console.log('=====最后我们看下钩子的封装吧=====')
const {
	AsyncParallelHook,
	AsyncParallelBailHook,
 } = require("tapable");

/*=============================================
最终：钩子的封装
封装之后可以在需要的地方用
==============================================*/



class Model{

    constructor(){
        //初始化hooks
        this.hooks = {
            //初始化asyncHooks，定义参数为name
            asyncHook: new AsyncParallelHook(['name']),

            //初始化promiseHooks ， 定义参数为age
            promiseHook: new AsyncParallelBailHook(['age'])


        }
    }


    //对触发进行封装，因为注册事件可能是在任意地方

    //对asyncHook的触发进行一下封装
    callAsyncHook(name,callback){

        //第二个参数是将注册的时候，第二个参数的回调展开
        //展开之后又封装在callAsyncHook使用
        this.hooks.asyncHook.callAsync(name,(res)=>{
            if(res) return callback(res)
            callback(null)
        });
    }

    //对promiseHook的触发进行一下封装
    callPromiseHook(age){
        //这里进行了promise的展开
        return this.hooks.promiseHook.promise(age).then(res=>{
        
            console.timeEnd('cost');
            return res;//这个步骤类似于resolve(res);

        });
    }

    
}


console.time('cost');
const model = new Model();

//asyncHook事件注册，注册的时候除了参数，还多了回调
model.hooks.asyncHook.tapAsync('AsyncPluginName',(name,done)=>{
    const pluginName = "AsyncPluginName";
    setTimeout(()=>{
        console.log(pluginName,name);
        done();
    },2000);

});


//promiseHook事件注册
model.hooks.promiseHook.tapPromise('1',(age)=>{
    let pluginName = "1";
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            //只是触发执行，并不带值
            // console.log(pluginName,age);
            resolve(pluginName);
        },3000);
    });

});





//这是自封装触发事件的回调展开
model.callAsyncHook('zack',(res)=>{
    console.log('cb call end');
});


//promiseHook触发
model.callPromiseHook(28).then(res=>{
    console.log('promise call',res);
});






/*

编写一个plugin
webpack的plugin有一套固有模式，这里以Async event hooks举例

*/

