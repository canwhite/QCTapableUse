
/*==========================================
一、使用同步钩子
    主要是下边这四个
	SyncHook,
	SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook
===========================================*/ 

/*
这部分看起来很清晰
*/


const {
	SyncHook,
	SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook

 } = require("tapable");



//(1)SyncHook**************************
console.log('------------------------------------------------')


//初始化Hook时，传入参数名称



const syncHk = new SyncHook(['name','age'])


//注册：名称和对应回调
syncHk.tap('plugin1',(name,age)=>{
    console.log('plugin1:',name,age);
});
syncHk.tap('plugin2',(name,age)=>{
    console.log('plugin2:',name,age);
})


//触发
syncHk.call('zack',28)


//(2)SyncBailHook**********************

//如果不写阻断，它的一开始是和SyncHook差不过的

console.log('------------------------------------------------')


let BailHook =  new SyncBailHook(['name','age']);
BailHook.tap('a',(name,age)=>{

    console.log('a:',name,age);

});
BailHook.tap('b',(name,age)=>{
    console.log('b:',name,age);
    //加一个阻断，让它不会往下走
    return null;

});

BailHook.tap('c',(name,age)=>{
    console.log('c:',name,age);

});

BailHook.call('zhangsan',26);


//(3)SyncWaterfallHook*****************

//上一级的值会返回到下一级

console.log('------------------------------------------------')

let waterfallHook = new SyncWaterfallHook(['name']);

waterfallHook.tap('a',(name)=>{

    console.log('a:',name);
    return 'a';
})

waterfallHook.tap('b',(data)=>{
    console.log('b:',data);
    return 'b'

});

waterfallHook.tap('c',(data)=>{
    console.log('c:',data);
    return 'c'

});


//触发
waterfallHook.call('lisi');


console.log('------------------------------------------------')
//(4)SyncLoopHook
const hook = new SyncLoopHook(['a']);
let count = 1;

hook.tap('start', () => console.log('start'));
hook.tap('sum', a => {
    if (count>=3) {
        console.log('end');
        return;
    }
    count++;
    console.log('count');
    return true;
});

hook.call(1);
console.log(count);



