var render = require('./lib/render');
var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var rf = require('fs');
var co = require('co');
var algo = require('ape-algorithm');
var readline = require('readline');
var app = koa();
var static = require('koa-static');
var linereader = require('line-reader');
var sscanf = require('scanf').sscanf;
var util = require('util');
var fs = require('fs');
app.use(static(__dirname));
app.use(logger());

app.use(route.get('/', login));
app.use(route.post('/login', login_end));

app.use(route.get('/1/dashboard1/:id', dashboard1));
app.use(route.post('/1/dashboard1/po', dashboard1_post));
app.use(route.get('/2/dashboard2/:id', dashboard2));
app.use(route.post('/2/dashboard2/po', dashboard2_post));
app.use(route.get('/3/dashboard3/:id', dashboard3));
app.use(route.post('/3/dashboard3/po', dashboard3_post));
app.use(route.get('/dashboard4/:id/:type', dashboard4));
app.use(route.post('/dashboard4/:id/:type', dashboard4));
app.use(route.post('/4/dashboard4/po', dashboard4_post));
app.use(route.get('/5/dashboard5/:id', dashboard5));
app.use(route.post('/5/dashboard5/po', dashboard5_post));

var data4 = [];
var data3 = [];
var data5_add = [], data5_dec = [];
var data_lastest, data_lastest2;
var datalist = [];
var flag_white = 0, flag_total = 0, flag_match = 0, flag_uniq = 0, flag_mt = 0, flag_um = 0;

function *dashboard1(id){
    var data_now = fs.readFileSync('./data1/'+id);
    data = data_now.toString().split('\n');
    var ans1 = [], ans2 = [], ans3 = [], ans4 = [], ans5 = [];
    for(i = 0; i < 6; i++){
        var x = sscanf(data[i], "%s");
        ans1.push(x);
    }
    var num = sscanf(data[6], "%d");
    for(var i = 7; i < 7+num; i++){
        var x = sscanf(data[i], "%s%s", 'type', 'num');
        ans2.push(x);
    }
    var xxx = sscanf(data[7+num], "%s");
    ans1.push(xxx);
    var num2 = sscanf(data[8+num], "%d");
    for(var i = 9+num; i < 9+num+num2; i++){
        var x = sscanf(data[i], "%s%s%s", 'type1', 'type2', 'num');
        ans3.push(x);
    }
    var num3 = sscanf(data[9+num+num2], "%d");
    for(var i = 10+num+num2; i < 10+num+num2+num3; i++){
        var x = sscanf(data[i], "%s%s", 'type', 'num');
        ans4.push(x);
    }
    var num4 = sscanf(data[10+num+num2+num3], "%d");
    for(var i = 11+num+num2+num3; i < 11+num+num2+num3+num4; i++){
        var x = sscanf(data[i], "%s%s", 'type', 'num');
        ans5.push(x);
    }
    this.body = yield render('dashboard1', {data_now: id, ans1: ans1, ans2: ans2, datalist: datalist, data_lastest: data_lastest, data_lastest2: data_lastest2});
}
function *dashboard1_post(){
    var num = yield parse(this);
    this.redirect(`/1/dashboard1/${num.num}`);
}
function *dashboard2(id){
    var data_now = fs.readFileSync('./data1/'+id);
    data = data_now.toString().split('\n');
    var ans1 = [], ans2 = [], ans3 = [], ans4 = [], ans5 = [];
    for(i = 0; i < 6; i++){
        var x = sscanf(data[i], "%s");
        ans1.push(x);
    }
    var num = sscanf(data[6], "%d");
    for(var i = 7; i < 7+num; i++){
        var x = sscanf(data[i], "%s%s", 'type', 'num');
        ans2.push(x);
    }
    var xxx = sscanf(data[7+num], "%s");
    ans1.push(xxx);
    var num2 = sscanf(data[8+num], "%d");
    for(var i = 9+num; i < 9+num+num2; i++){
        var x = sscanf(data[i], "%s%s%s", 'type1', 'type2', 'num');
        ans3.push(x);
    }
    var num3 = sscanf(data[9+num+num2], "%d");
    for(var i = 10+num+num2; i < 10+num+num2+num3; i++){
        var x = sscanf(data[i], "%s%s", 'type', 'num');
        ans4.push(x);
    }
    var num4 = sscanf(data[10+num+num2+num3], "%d");
    for(var i = 11+num+num2+num3; i < 11+num+num2+num3+num4; i++){
        var x = sscanf(data[i], "%s%s", 'type', 'num');
        ans5.push(x);
    }
    this.body = yield render('dashboard2', {ans3: ans3, ans4: ans4, ans5: ans5, data_now: id, datalist: datalist, data_lastest2: data_lastest2, data_lastest: data_lastest});
}
function *dashboard2_post(){
    var num = yield parse(this);
    this.redirect(`/2/dashboard2/${num.num}`);
}
function *dashboard3(id){
    var now = [];
    var t = -1;
    for(var i = 0; t < 15 && i < data3.length; i++){
        if(data3[i].data == id){
            t = 0;
        }
        if(t >= 0){
            now.push(data3[i]);
            ++t;
        }
    }
    this.body = yield render('dashboard3', {data: now, data_1: data3, data_lastest: data_lastest, data_this: id, data_lastest2: data_lastest2});
}
function *dashboard3_post(){
    var num = yield parse(this);
//    this.redirect("/dashboard3/20160722");
    this.redirect(`/3/dashboard3/${num.num}`);
}
function make2(line){
    var x = sscanf(line, "%d%d%d%d%f%f%s%s%s%s", 'whiteid', 'total', 'match', 'uniq', 'mt', 'um', 'type', 'type2', 'type3', 'url');
    //        console.log(x);
    data4.push(x);
}
function make1(line){
    var x = sscanf(line, "%s%s%s%d%s%s%s%s%d%s%s%s%s%d%s%s%d%d%d", 'data', 'imei_total', 'imei_match', 'imei_uniq', 'imei_mt', 'imei_um'
        , 'imsi_total', 'imsi_match', 'imsi_uniq', 'imsi_mt', 'imsi_um'
        , 'mdn_total', 'mdn_match', 'mdn_uniq', 'mdn_mt', 'mdn_um', 'num_imei', 'num_imsi', 'num_mdn');
    //        console.log(x);
    data3.push(x);
}
function make5_add(line){
    var x = sscanf(line, "%s%s%s%s%s", 'type', 'source', 'key', 'host', 'url');
    data5_add.push(x);
}
function make5_dec(line){
    var x = sscanf(line, "%s%s%s%s%s", 'type', 'source', 'key', 'host', 'url');
    data5_dec.push(x);
}
function readfile(filename, id) {
    return new Promise((resolve, reject) => {

            var eachLine = function(filename, iteratee) {
                return new Promise(function(resolve, reject) {
                    linereader.eachLine(filename, iteratee, function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            }
            eachLine(filename, function(line) {
                if(id == 1) {make1(line);}
                else if(id == 2) {make2(line);}
                else if(id == 51) {make5_add(line);}
                else if(id == 52) {make5_dec(line);}
            }).then(function() {
                    resolve();
                }).catch(function(err) {
                    console.error(err);
                });
});
}
function *dashboard4(id, type){
    var data4_now = [];
    data4 = [];
    var str = 'data/' + id;
    yield readfile(str, 2);
    for (var i = 0; i < data4.length; i++) {
        if (data4[i].mt == -1) {
            data4[i].mt = 0 / 0;
        }
        if (data4[i].um == -1) {
            data4[i].um = 0 / 0;
        }
    }
    if (type == 'all') {
        data4_now = data4;
    }
    else {
        for (var i = 0; i < data4.length; i++) {
            if (data4[i].type == type) {
                data4_now.push(data4[i]);
            }
        }
    }
    if (this.method == 'POST') {
        var body = yield parse(this);
        switch(body.sortnum){
            case '0':
                if(flag_white == 0) data4_now = algo.quicksort.sortObj(data4_now, 'whiteid');
                else data4_now = algo.quicksort.sortObj(data4_now, 'whiteid', 'desc');
                flag_white ^= 1;
                break;
            case '1':
                if(flag_total == 0) data4_now = algo.quicksort.sortObj(data4_now, 'total');
                else data4_now = algo.quicksort.sortObj(data4_now, 'total', 'desc');
                flag_total ^= 1;
                break;
            case '2':
                if(flag_match == 0) data4_now = algo.quicksort.sortObj(data4_now, 'match');
                else data4_now = algo.quicksort.sortObj(data4_now, 'match', 'desc');
                flag_match ^= 1;
                break;
            case '3':
                if(flag_uniq == 0) data4_now = algo.quicksort.sortObj(data4_now, 'uniq');
                else data4_now = algo.quicksort.sortObj(data4_now, 'uniq', 'desc');
                flag_uniq ^= 1;
                break;
            case '4':
                if(flag_mt == 0) data4_now = algo.quicksort.sortObj(data4_now, 'mt');
                else data4_now = algo.quicksort.sortObj(data4_now, 'mt', 'desc');
                flag_mt ^= 1;
                break;
            case '5':
                if(flag_um == 0) data4_now = algo.quicksort.sortObj(data4_now, 'um');
                else data4_now = algo.quicksort.sortObj(data4_now, 'um', 'desc');
                flag_um ^= 1;
                break;
        }
    }
    else{
//        console.log(this.query);
    }
    var uniq;
    for (var i = 0; i < data3.length; i++) {
        if (data3[i].data == id) {
            uniq = data3[i];
        }
    }
    this.body = yield render('dashboard4', {data: data4_now, data_1: data3, data_this: id, data_type: type, data_lastest2: data_lastest2, data_lastest: data_lastest, num_rule: data4_now.length, uniq: uniq});
}
function *dashboard4_post(){
    var num = yield parse(this);
    this.redirect(`/dashboard4/${num.num}/${num.type}`);
}
function *dashboard5(id){
    var str = 'data5/' + id;
    data5_add = [];
    data5_dec = [];
    yield readfile(str+'_add', 51);
    yield readfile(str+'_dec', 52);
    var t = -1;
    var data_white = [];
    for(var i = 0; t < 15 && i < data3.length; i++){
        if(data3[i].data == id){
            t = 0;
        }
        if(t >= 0 && data3[i].num_imei > 0){
            data_white.unshift({value: data3[i].num_imei+data3[i].num_imsi+data3[i].num_mdn, data: data3[i].data});
            ++t;
        }
    }
    fs.unlinkSync('./resut');
    fs.appendFileSync('./resut',JSON.stringify(data_white));

//    console.log(data_white);
    this.body = yield render('dashboard5', {data: data3, data_this: id, data_add: data5_add, data_dec: data5_dec, data_lastest2: data_lastest2, data_lastest: data_lastest});
}
function *dashboard5_post(){
    var num = yield parse(this);
    this.redirect(`/5/dashboard5/${num.data}`);
}
function *login(){
    this.body = yield render('login');
}
function *login_end(){
    data3 = [];
    yield readfile('log', 1);
    data3 = algo.quicksort.sortObj(data3, 'data', 'desc');
    data_lastest = data3[0].data;
    var path = fs.readdirSync('./data1');
    for(var i = 0; i < path.length; i++){
            if(path[i].substr(0, 6) == 'string'){
            datalist.push(path[i]);
        }
    }
    data_lastest2 = datalist[datalist.length-1];
    this.redirect("1/dashboard1/" + datalist[datalist.length-1]);
//    this.redirect("3/dashboard3/" + data_lastest);
}
app.listen(3000);
function getIPAdress(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i = 0; i < iface.length; i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address.substring(0,10) == '192.168.0.' && !alias.internal){
                console.log("Server started successfully!");
                console.log("Please visit: " + alias.address + ":3000");
            }
        }
    }
}
getIPAdress();