
const {
    //同步钩子
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,  
 } = require("tapable");

let h1 = new SyncHook(['options']);

h1.tap('A', function (arg) {
    console.log('------a');
    return 'b'; // 除非你在拦截器上的 register 上调用这个函数,不然这个返回值你拿不到.
})

h1.tap('B', function () {
    console.log('------b');
})
h1.tap('C', function () {
    console.log('------c');
})
h1.tap('D', function () {
    console.log('------d');
})

h1.intercept({
  //call在真正开始调用前执行一次
  call: (...args) => {
    console.log(...args, '-------------intercept call');
  },
  //在商品消费前都会先注册
  register: (tap) => {
  console.log(tap, '------------------intercept register');

    return tap;
  },
  loop: (...args) => {
    console.log(...args, '-------------intercept loop')
  },
  //tap会在每次调用前执行
  tap: (tap) => {
    if(tap.name == 'A'){
        return;
    }
    console.log(tap, '-------------------intercept tap')


  }
}) 
//触发还是统一触发的,触发之后先注册，在执行前再call,tap键值对对应着tap的拦截器
//其中call里边放的是参数
h1.call(6);
