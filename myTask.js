/**
 * Created by akhilesh.kumar on 8/4/2016.
 */
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    concatCss = require('gulp-concat-css'),
    rename = require('gulp-rename'),
    ngAnnotate = require('gulp-ng-annotate'),
    path=require("path"),
    ncp = require('ncp').ncp,
    walk=require('walk'),
    cheerio =require('cheerio'),
    fs = require('fs'),
    fse=require('fs.extra'),
    chalk= require('chalk'),
    async=require('async'),
    mkdirp = require('mkdirp'),
    minify = require('html-minifier').minify,
    imagemin = require('gulp-imagemin'),
    fontmin = require('gulp-fontmin'),
    request = require('request'),
    speclChr = require('./specilChr.json'),
    jsPj= require('./keithGlp');

var argCmd =process.argv.slice(2),
    allTsks=[],
    arg={},
    strRegStr="",
    skipDir="",
    strReg,
    cssAssetsTyp=["png","gif","jpg","jpeg","svg","mp3","ogg","eot","woff2","woff","ttf","otf"],
    imgMinTyp=['jpg','png','jpeg','gif','svg'],
    fontMinTyp=['svg','eot','woff','ttf','woff2'],
    allCssAsts={};
var replacChr=(prm)=>{
    speclChr.forEach(o=>{
        let reg= new RegExp("/\&"+o["name"]+"\;/g");
        prm=prm.replace(reg,o["val"]);
    });
    return prm;
};
var createArg=()=>{
    console.log(chalk.cyan("       db         8b           d8  88888888ba\n      d88b        `8b         d8\'  88      \"8b\n     d8\'`8b        `8b       d8\'   88      ,8P\n    d8\'  `8b        `8b     d8\'    88aaaaaa8P\'\n   d8YaaaaY8b        `8b   d8\'     88\"\"\"\"88\'\n  d8\"\"\"\"\"\"\"\"8b        `8b d8\'      88    `8b\n d8\'        `8b        `888\'       88     `8b\nd8\'          `8b        `8\'        88      `8b\n	 			  \t\t  dddddddd\n		EEEEEEEEEEEEEEEEEEEEEE            d::::::d\n		E::::::::::::::::::::E            d::::::d\n		E::::::::::::::::::::E            d::::::d\n		EE::::::EEEEEEEEE::::E            d:::::d\n		E:::::E       EEEEEE      ddddddddd:::::d    ggggggggg   ggggg    eeeeeeeeeeee\n		E:::::E                 dd::::::::::::::d   g:::::::::ggg::::g  ee::::::::::::ee\n		E::::::EEEEEEEEEE      d::::::::::::::::d  g:::::::::::::::::g e::::::eeeee:::::ee\n		E:::::::::::::::E     d:::::::ddddd:::::d g::::::ggggg::::::gge::::::e     e:::::e\n		E:::::::::::::::E     d::::::d    d:::::d g:::::g     g:::::g e:::::::eeeee::::::e\n		E::::::EEEEEEEEEE     d:::::d     d:::::d g:::::g     g:::::g e:::::::::::::::::e\n		E:::::E               d:::::d     d:::::d g:::::g     g:::::g e::::::eeeeeeeeeee\n		E:::::E       EEEEEE  d:::::d     d:::::d g::::::g    g:::::g e:::::::e\n		EE::::::EEEEEEEE:::::Ed::::::ddddd::::::ddg:::::::ggggg:::::g e::::::::e\n		E::::::::::::::::::::E d:::::::::::::::::d g::::::::::::::::g  e::::::::eeeeeeee\n		E::::::::::::::::::::E  d:::::::::ddd::::d  gg::::::::::::::g   ee:::::::::::::e\n		EEEEEEEEEEEEEEEEEEEEEE   ddddddddd   ddddd    gggggggg::::::g     eeeeeeeeeeeeee\n _   _        _                           _             g:::::g      g:::::g\n| \\ | |      | |                         | |            g:::::g      g:::::g\n|  \\| |  ___ | |_ __      __  ___   _ __ | | __ ___     g:::::gg   gg:::::g\n| . ` | / _ \\| __|\\ \\ /\\ / / / _ \\ | \'__|| |/ // __|     g::::::ggg:::::::g\n| |\\  ||  __/| |_  \\ V  V / | (_) || |   |   < \\__ \\      gg:::::::::::::g\n\\_| \\_/ \\___| \\__|  \\_/\\_/   \\___/ |_|   |_|\\_\\|___/        ggg::::::ggg															 \t\t\t\t\t\tgggggg"));
    argCmd.forEach(o=>{
        let prm=o.split("=");
        if(prm[0].indexOf("--")==0){
            if(prm[0].indexOf("vendor")!=2){
                arg[prm[0].substring(2)]=prm[1]
            }else if(prm[0].indexOf("vendor")==2) {
                strRegStr+=prm[1]+"|";
            }else if(prm[0].indexOf("skipDir")==2) {
                skipDir+=prm[1]+"|";
            }
        }else {
            strRegStr+=prm[0]+"|";
        }
    });
    if(!strRegStr){
        strRegStr="node_modules|bower_components"
    }else {
        strRegStr=strRegStr.substring(0,strRegStr.length-1);
    }

    if(!skipDir){
        skipDir="node_modules|bower_components"
    }else {
        skipDir=strRegStr.substring(0,strRegStr.length-1);
    }
    strReg=new RegExp(strRegStr);
};
var addGlpTsk=(typ,tskNm,operArr,pr)=>{
    let myRand= tskNm+""+(Math.floor(Math.random()*1000));
    allTsks.push(myRand);
    if(typ==1){
        gulp.task(myRand, function() {
            let stream = gulp.src(operArr)
                .pipe(ngAnnotate()).on('error', function(e){console.log(chalk.red("ngAnnotate Params:",typ,tskNm,operArr,pr,"\nngAnnotate error:",e))})
                .pipe(concat(tskNm+'.min.'+pr+'.js')).on('error', function(e){console.log(chalk.red("Concat params",typ,tskNm,operArr,pr,"\nConcat error",e))})
                .pipe(uglify({mangle: (arg['mangle'] && arg['mangle'].toLowerCase()=='false')?false:true}))
                .on('error', function(e){console.log(chalk.red("uglify params",typ,tskNm,operArr,pr,"\nuglify error",e))})
                .pipe(gulp.dest((arg['output']?arg['output']:arg['public'])+"/jsVend/")
                    .on('error', function(e){console.log(chalk.red(typ,tskNm,operArr,pr,"dest error",e))}));
            stream.on('finish', ()=>{
                console.log(tskNm+' is finish',typ,'\t',tskNm,'\t',operArr,'\t',pr);
            });
        });
    }else if(typ==2){
        let stream= gulp.task(myRand, function() {
            //console.log(chalk.green('tskNm is Done',typ,'\t',tskNm,'\t',operArr));
            let dir=operArr.substring(0,operArr.lastIndexOf("\\"));
            fs.writeFile(operArr, pr, (err) => {
                if (err){
                    console.log(chalk.red(operArr,"\n\n\n\n\n Can not write to above file:\n\n",err));
                    //throw err;
                }else {
                    console.log(chalk.yellow('ScriptsWt is Done',operArr, operArr.indexOf(".html")!=-1?"Httttt":pr));
                }
            });
        });
        stream.on('finish', ()=>{
            console.log('tskNm is Done',typ,'\t',tskNm,'\t',operArr,'\t',pr);
        });
    }else if(typ==3){
        operArr.forEach((k,indx)=>{
            fs.readFile(k,'utf8', (err, data) => {
                if (err){
                    console.log("operation Arr-Read",err);
                    console.log(chalk.red(k,"\n\n\n\n\n Can not read to above file:\n\n",err));
                    //throw err;
                }else{
                    let strngWitUrl=data.split("url(");
                    strngWitUrl.splice(0,1);
                    strngWitUrl.filter(tt=>{
                        let itsUrl=o1.substring(0,o1.indexOf(")")).split("'").join("").split('"').join("");
                        if(!itsUrl || itsUrl.indexOf("data:")!=-1){
                            return false;
                        }else {
                            return true;
                        }
                    }).forEach(o1=>{
                        let itsUrl=o1.substring(0,o1.indexOf(")")).split("'").join("").split('"').join("");
                        let itsUrl1=itsUrl.indexOf("?")!=-1?itsUrl.split("?")[0]:(itsUrl.indexOf("#")!=-1?itsUrl.split("#")[0]:itsUrl);
                        let cssUrl=k.substring(0,k.lastIndexOf("\\"));
                        let urlPth=itsUrl.split("\\..\\").join("").split("..\\").join("").split(".\\").join("");
                        let urlPth1=urlPth.indexOf("?")!=-1?urlPth.split("?")[0]:(urlPth.indexOf("#")!=-1?urlPth.split("#")[0]:urlPth);
                        let destPth=path.join((arg['output']?arg['output']:arg['public'])+"/cssDep/",urlPth);
                        let destPth1=destPth.indexOf("?")!=-1?destPth.split("?")[0]:(destPth.indexOf("#")!=-1?destPth.split("#")[0]:destPth);
                        let dir=destPth.substring(0,destPth.lastIndexOf("\\"));
                        let cssitsUrl=path.join(cssUrl,itsUrl1);
                        try{
                            async.waterfall([
                                function(asnkCb){
                                    if (!fs.existsSync(dir)){
                                        mkdirp(dir, function (err) {
                                            if (err){
                                                console.log("mkdirp Error",err);
                                                asnkCb(null);
                                            }
                                            else {
                                                asnkCb(null);
                                            }
                                        });
                                    }else{
                                        asnkCb(null);
                                    }
                                },
                                function(asnkCb){
                                    let dir1=k.substring(0,destPth1.lastIndexOf("\\"));
                                    if (!fs.existsSync(dir1)){
                                        mkdirp(dir1, function (err) {
                                            if (err){
                                                console.log("mkdirp Error",err);
                                                asnkCb(true);
                                            }
                                            else {
                                                asnkCb(null);
                                            }
                                        });
                                    }else{
                                        asnkCb(null);
                                    }
                                },
                                function(asnkCb){
                                    data=data.split(itsUrl).join(urlPth);
                                    try{
                                        let dest =fs.createWriteStream(destPth1);
                                        dest.on('close', function() {
                                            console.log(chalk.cyan(destPth1," created: ",cssitsUrl));
                                            fs.writeFile(destPth1, data, (err) => {
                                                if (err){
                                                    //throw err;
                                                    console.log(chalk.red(destPth1,"\n\n\n\n\n Can not write to above file:\n\n",err));
                                                    asnkCb(null,err);
                                                }else {
                                                    console.log(chalk.yellow(itsUrl1,' replaced by ',urlPth1,' and written to file'));
                                                    asnkCb(null);
                                                }
                                            });
                                        });
                                        if(fs.statSync(cssitsUrl).isFile()){
                                            fs.createReadStream(cssitsUrl).pipe(dest);
                                        }else {
                                            console.log(chalk.red(cssitsUrl,"\n\n\n\n\n Can not read from above file:\n\n",err));
                                        }
                                    }
                                    catch (e){
                                        if(arg['showCssDepErr'] && arg['showCssDepErr'].toLowerCase()=='true'){
                                            console.log(chalk.red(cssitsUrl,"\nCss is using above assets that does not exists:\n",e));
                                        }
                                        asnkCb(null);
                                    }
                                }
                            ],function (err, result) {
                                if(indx==operArr.length-1){
                                    gulp.task(myRand, function(){
                                        let stream =gulp.src(operArr).on('error', function(e){console.log(chalk.red(typ,tskNm,operArr,pr,"src",e))})
                                            .pipe(minifyCSS()).on('error', function(e){console.log(chalk.red(typ,tskNm,operArr,pr,"minifyCSS",e))})
                                            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
                                            .on('error', function(e){console.log(chalk.red(typ,tskNm,operArr,pr,"autoprefixer",e))})
                                            .pipe(concat(tskNm+'.min.'+pr+'.css')).on('error', function(e){console.log(chalk.red(typ,tskNm,operArr,pr,"concat",e))})
                                            .pipe(gulp.dest((arg['output']?arg['output']:arg['public'])+"/cssVend/"))
                                            .on('error', function(e){console.log(chalk.red(typ,tskNm,operArr,pr,"dest",e))});
                                        stream.on('finish', ()=>{
                                            console.log('tskNm is Done',typ,'\t',tskNm,'\t',operArr,'\t',pr);
                                        });
                                    });
                                }
                            });
                        }
                        catch (e){
                            console.log(chalk.red("existsSync",e));
                        }
                    });
                }
            });
        });
    }else if(typ==4){
        gulp.task(myRand, function() {
            console.log(chalk.green('tskNm is Done',typ,'\t',tskNm,'\t',operArr));
            let dir=operArr.substring(0,operArr.lastIndexOf("\\"));
            async.waterfall([
                function(asnkCb){
                    if (!fs.existsSync(dir)){
                        mkdirp(dir, function (err) {
                            if (err){
                                console.log("mkdirp Error",err);
                                asnkCb(null);
                            }
                            else {
                                asnkCb(null);
                            }
                        });
                    }else{
                        asnkCb(null);
                    }
                },
                function(asnkCb){
                    fs.writeFile(operArr, pr, (err) => {
                        if (err){
                            //throw err;
                            console.log(chalk.red(operArr,"\n\n\n\n\n Can not write to above file:\n\n",err));
                            asnkCb(null);
                        }else {
                            console.log(chalk.yellow('ScriptsWt is Done'));
                            asnkCb(null);
                        }
                    });
                }],function (err, result) {

            });

        });
    }else if(typ==5){
        gulp.task(myRand, function() {
                gulp.src(operArr)
                    .pipe(imagemin({
                        progressive: true
                    })).on('error', function(e){console.log(chalk.red(typ,tskNm,operArr,pr,"imagemin error",e))})
                    .pipe(gulp.dest(pr)).on('error', function(e){console.log(chalk.red(typ,tskNm,operArr,pr,"dest error",e))})
        });
    }else if(typ==6){
        gulp.task(myRand, function(){
            let dstPt=(arg['output']?arg['output']:arg['public'])+"/cssVend/";
            let stream =gulp.src(operArr)
                .pipe(minifyCSS())
                .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
                .pipe(concatCss(tskNm+'.min.'+pr+'.css'))
                .pipe(gulp.dest(dstPt))
                .on("error",(e)=>{
                    console.log("CSS error: ",e)
                });
            stream.on('finish', ()=>{
                console.log('cssMin is Done for: ',typ,'\t',tskNm,'\t',operArr,'\t',pr);
                fs.readFile(dstPt+tskNm+'.min.'+pr+'.css','utf8',(err, data) => {
                    if(err){
                        console.log("error in reading assets: \n\t",err);
                    }else {
                        let strngWitUrl=data.split("url(");
                        strngWitUrl.splice(0,1);
                        strngWitUrl.forEach(o1=>{
                            let itsUrl=o1.substring(0,o1.indexOf(")")).split("'").join("").split('"').join("");
                            let itsUrl1=itsUrl.indexOf("?")!=-1?itsUrl.split("?")[0]:(itsUrl.indexOf("#")!=-1?itsUrl.split("#")[0]:itsUrl);
                            let assetPth=path.join(dstPt,itsUrl1);
                            if (!fs.existsSync(assetPth)){
                                console.log("asset in output does not exist\n\t",assetPth,"\nTrying to get it....");
                                let resolvdPth=assetPth.substring(assetPth.lastIndexOf("\\")+1).replace(/[^a-zA-Z0-9_-]/g, "");
                                let dir1=assetPth.substring(0,assetPth.lastIndexOf("\\"));
                                let pthInGObj=allCssAsts[resolvdPth]?allCssAsts[resolvdPth]["pth"]:"";
                                console.log(pthInGObj,"::::",resolvdPth);
                                if (!fs.existsSync(dir1)){
                                    mkdirp(dir1, function (err) {
                                        if (err){
                                            console.log("mkdirp Error",err);
                                        }
                                        else {
                                            if(pthInGObj){
                                                fs.createReadStream(pthInGObj).pipe(fs.createWriteStream(assetPth));
                                                console.log("Our effort worked...");
                                            }else{
                                                console.log("couldn't resolve the path",resolvdPth);
                                            }
                                        }
                                    });
                                }else {
                                    if(pthInGObj){
                                        fs.createReadStream(pthInGObj).pipe(fs.createWriteStream(assetPth));
                                        console.log("Our effort worked...");
                                    }else{
                                        console.log("couldn't resolve the path",resolvdPth);
                                    }
                                }
                            }
                        });
                    }
                });
            });
        });
    }else if(typ==7){
        gulp.task(myRand, function() {
            gulp.src(operArr)
                .pipe(fontmin({
                    hinting: false,
                    quiet:true
                })).on('error', function(e){console.log(chalk.red(typ,tskNm,operArr,pr,"fontmin error",e))})
                .pipe(gulp.dest(pr)).on('error', function(e){console.log(chalk.red(typ,tskNm,operArr,pr,"dest Error",e))})
        });
    }
};
var jsMin=()=>{
    let files   = [];
    let walker  = walk.walk(arg['search'], { followLinks: false });

    walker.on('file', (root, stat, next)=>{
        let typ=stat.name.split(".");
        if(typ[typ.length-1]=='html'){
            files.push(root + '\\' + stat.name);
        }
        next();
    });
    walker.on('end', function() {
        //console.log(files);
        files.forEach((o,i)=>{
            fs.readFile(o,'utf8', (err, data) => {
                if (err){
                    //throw err;
                    console.log(chalk.red(o,"\n\n\n\n\n Walker can not read to above file:\n\n",err));
                }else {
                    let $ = cheerio.load(data);
                    if($("script").length){
                        console.log(chalk.bgMagenta("----------------------------------------------------------------------------------------"));
                        console.log(chalk.bgMagenta("----------------------------------------------------------------------------------------"));
                        console.log(chalk.bgMagenta("No of script Found in head:",$("head script[src]").length," and body: ",$("script:not(head *)[src]").length,"\t\t\t\t\t\t\n",o));
                        console.log(chalk.bgMagenta("----------------------------------------------------------------------------------------"));
                        console.log(chalk.bgMagenta("----------------------------------------------------------------------------------------"));
                        let fiLnm=o.substring(o.lastIndexOf("\\")+1,o.lastIndexOf("."));
                        let pthTxt="";
                        let pthArr=o.split("\\");
                        pthArr.forEach(o1=>{
                            let ltr=o1.substring(0,2);
                            pthTxt+=ltr.charAt(0).toUpperCase()+ltr.slice(1)+"_";
                        });
                        pthTxt=pthTxt.replace(/[^a-zA-Z0-9._ ]/g, "");
                        let vendorHead=[],
                            appHead=[],
                            vendorBody=[],
                            appBody=[],
                            rand=arg['version']?pthTxt+fiLnm+"_"+arg['version']:pthTxt+fiLnm+"_"+Math.floor(Math.random()*1000);

                        $("head script[src]").each((i,p)=>{
                            let srcVl=$(p).attr("src");
                            if(srcVl.indexOf("http")==-1){
                                srcVl=srcVl.indexOf("?")!=-1?srcVl.split("?")[0]:(srcVl.indexOf("#")!=-1?srcVl.split("#")[0]:srcVl);
                                if(!strReg.test(srcVl)){
                                    srcVl.startsWith("/")?srcVl="."+srcVl:srcVl="./"+srcVl;
                                    console.log(chalk.bgGreen("*********  App Script found in Head   *********\t\t\t\t\t\t"));
                                    console.log(chalk.bgGreen("\thead:\t",i," : ",srcVl));
                                    appHead.push(path.join(arg['public'],srcVl));
                                }
                                else {
                                    srcVl.startsWith("/")?srcVl="."+srcVl:srcVl="./"+srcVl;
                                    console.log(chalk.bgGreen("*********  Vendor Script found in Head    *********\t\t\t\t\t\t"));
                                    console.log(chalk.bgGreen("\thead:\t",i," : ",srcVl));
                                    vendorHead.push(path.join(arg['public'],srcVl));
                                }
                            }else if(srcVl.indexOf("http:")!=-1 || srcVl.indexOf("https:")!=-1){
                                if(!strReg.test(srcVl)){
                                    console.log(chalk.bgGreen("*********  http App Script found in Head   *********\t\t\t\t\t\t"));
                                    console.log(chalk.bgGreen("\thead:\t",i," : ",srcVl));
                                    let strPt=srcVl.split(/[^a-zA-Z0-9._ ]/g).map(o=>{
                                        return o.charAt(0).toUpperCase() + o.slice(1);
                                    });
                                    strPt=strPt.join(" ");
                                    let itsTmpPth=path.join(__dirname,"./httpTemp/"+strPt+Math.floor(Math.random()*10000)+".js");
                                    request.get(srcVl).pipe(fs.createWriteStream(itsTmpPth));
                                    appHead.push(itsTmpPth);
                                }
                                else {
                                    console.log(chalk.bgGreen("*********  http Vendor Script found in Head    *********\t\t\t\t\t\t"));
                                    console.log(chalk.bgGreen("\thead:\t",i," : ",srcVl));
                                    let strPt=srcVl.split(/[^a-zA-Z0-9._ ]/g).map(o=>{
                                        return o.charAt(0).toUpperCase() + o.slice(1);
                                    });
                                    strPt=strPt.join(" ");
                                    let itsTmpPth=path.join(__dirname,"./httpTemp/"+strPt+Math.floor(Math.random()*10000)+".js");
                                    request.get(srcVl).pipe(fs.createWriteStream(itsTmpPth));
                                    vendorHead.push(itsTmpPth);
                                }
                            }
                        });
                        $("script:not(head *)[src]").each((i,p)=>{
                            let srcVl=$(p).attr("src");
                            if(srcVl.indexOf("http")==-1){
                                srcVl=srcVl.indexOf("?")!=-1?srcVl.split("?")[0]:(srcVl.indexOf("#")!=-1?srcVl.split("#")[0]:srcVl);
                                if(!strReg.test(srcVl)){
                                    srcVl.startsWith("/")?srcVl="."+srcVl:srcVl="./"+srcVl;
                                    console.log(chalk.bgGreen("*********  App Script found in Body   *********\t\t\t\t\t\t"));
                                    console.log(chalk.bgGreen("\tbody:\t",i," : ",srcVl));
                                    appBody.push(path.join(arg['public'],srcVl));
                                }else {
                                    srcVl.startsWith("/")?srcVl="."+srcVl:srcVl="./"+srcVl;
                                    console.log(chalk.bgGreen("*********  Vendor Script found in Body   *********\t\t\t\t\t\t"));
                                    console.log(chalk.bgGreen("\tbody:\t",i," : ",srcVl));
                                    vendorBody.push(path.join(arg['public'],srcVl));
                                }
                            }else if(srcVl.indexOf("http:")!=-1 || srcVl.indexOf("https:")!=-1){
                                if(!strReg.test(srcVl)){
                                    console.log(chalk.bgGreen("*********  http App Script found in Body   *********\t\t\t\t\t\t"));
                                    console.log(chalk.bgGreen("\thead:\t",i," : ",srcVl));
                                    let strPt=srcVl.split(/[^a-zA-Z0-9._ ]/g).map(o=>{
                                        return o.charAt(0).toUpperCase() + o.slice(1);
                                    });
                                    strPt=strPt.join(" ");
                                    let itsTmpPth=path.join(__dirname,"./httpTemp/"+strPt+Math.floor(Math.random()*10000)+".js");
                                    request.get(srcVl).pipe(fs.createWriteStream(itsTmpPth));
                                    appBody.push(itsTmpPth);
                                }
                                else {
                                    console.log(chalk.bgGreen("*********  http Vendor Script found in Body    *********\t\t\t\t\t\t"));
                                    console.log(chalk.bgGreen("\thead:\t",i," : ",srcVl));
                                    let strPt=srcVl.split(/[^a-zA-Z0-9._ ]/g).map(o=>{
                                        return o.charAt(0).toUpperCase() + o.slice(1);
                                    });
                                    strPt=strPt.join(" ");
                                    let itsTmpPth=path.join(__dirname,"./httpTemp/"+strPt+Math.floor(Math.random()*10000)+".js");
                                    request.get(srcVl).pipe(fs.createWriteStream(itsTmpPth));
                                    vendorBody.push(itsTmpPth);
                                }
                            }
                        });
                        $("script[src]").remove();
                        if(vendorHead.length){
                            if(arg['output'] && arg['output'].length>arg['public'].length){
                                let t1=arg['output'].substring(arg['public'].length).replace(/\\/g,"/");
                                $( "head" ).append( '<script src="'+t1+'/jsVend/vendorHead'+rand+'.min.'+i+'.js" type="text/javascript"></script>' );
                                addGlpTsk(1,'vendorHead'+rand,vendorHead,i);
                            }else {
                                $( "head" ).append( '<script src="/jsVend/vendorHead'+rand+'.min.'+i+'.js" type="text/javascript"></script>' );
                                addGlpTsk(1,'vendorHead'+rand,vendorHead,i);
                            }
                        }
                        if(appHead.length){
                            if(arg['output'] && arg['output'].length>arg['public'].length){
                                let t1=arg['output'].substring(arg['public'].length).replace(/\\/g,"/");
                                $( "head" ).append( '<script src="'+t1+'/jsVend/appHead'+rand+'.min.'+i+'.js" type="text/javascript"></script>' );
                                addGlpTsk(1,'appHead'+rand,appHead,i);
                            }else {
                                $( "head" ).append( '<script src="/jsVend/appHead'+rand+'.min.'+i+'.js" type="text/javascript"></script>' );
                                addGlpTsk(1,'appHead'+rand,appHead,i);
                            }
                        }
                        if(vendorBody.length){
                            if(arg['output'] && arg['output'].length>arg['public'].length){
                                let t1=arg['output'].substring(arg['public'].length).replace(/\\/g,"/");
                                $( "body" ).append( '<script src="'+t1+'/jsVend/vendorBody'+rand+'.min.'+i+'.js" type="text/javascript"></script>' );
                                addGlpTsk(1,'vendorBody'+rand,vendorBody,i);
                            }else {
                                $( "body" ).append( '<script src="/jsVend/vendorBody'+rand+'.min.'+i+'.js" type="text/javascript"></script>' );
                                addGlpTsk(1,'vendorBody'+rand,vendorBody,i);
                            }
                        }
                        if(appBody.length){
                            if(arg['output'] && arg['output'].length>arg['public'].length){
                                let t1=arg['output'].substring(arg['public'].length).replace(/\\/g,"/");
                                $( "body" ).append( '<script src="'+t1+'/jsVend/appBody'+rand+'.min.'+i+'.js" type="text/javascript"></script>' );
                                addGlpTsk(1,'appBody'+rand,appBody,i);
                            }else {
                                $( "body" ).append( '<script src="/jsVend/appBody'+rand+'.min.'+i+'.js" type="text/javascript"></script>' );
                                addGlpTsk(1,'appBody'+rand,appBody,i);
                            }
                        }
                        addGlpTsk(2,'scriptsWt'+rand,o,replacChr($.html()));
                    }else {
                        console.log(chalk.cyan("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"));
                        console.log(chalk.cyan("No Script Found in ",o));
                        console.log(chalk.cyan("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"));
                    }
                    if(i==files.length-1){
                        console.log(chalk.green("\n\n\n\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"));
                        console.log(chalk.green("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Task are going To Run xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"));
                        console.log(chalk.green("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n\n\n"));


                        console.log(chalk.yellow("allTsks: ",allTsks));
                        gulp.task('allJsTsksRn',allTsks ,function() {
                            console.log(chalk.green('allJsTsksRn is Done'));
                        });
                        if(arg['option']!='all'){
                            gulp.start('allJsTsksRn');
                        }
                    }
                }
            });
        });
    });
};
var cssMin=()=>{
    let files   = [];
    let walker  = walk.walk(arg['search'], { followLinks: false });

    walker.on('file', (root, stat, next)=>{
        let typ=stat.name.split(".");
        let itsTyp=typ[typ.length-1];
        if(!(new RegExp(skipDir).test(""+root))){
            if(itsTyp=='html'){
                files.push(root + '\\' + stat.name);
            }else if(cssAssetsTyp.indexOf(itsTyp.toLowerCase())!=-1){
                if(!allCssAsts[stat.name.replace(/[^a-zA-Z0-9_-]/g, "")] || allCssAsts[stat.name.replace(/[^a-zA-Z0-9_-]/g, "")]["size"]>stat.size){
                    allCssAsts[stat.name.replace(/[^a-zA-Z0-9_-]/g, "")]={"pth":root + '\\' + stat.name,"size":stat.size};
                }else {
                    console.log("size: ",stat.size,"size of file not compromised",allCssAsts[stat.name.replace(/[^a-zA-Z0-9_-]/g, "")]);
                }
            }
        }
        next();
    });
    walker.on('end', function() {
        console.log("allCssAsts::\n",JSON.stringify(allCssAsts,null,4));
        files.forEach((o,i)=>{
            fs.readFile(o,'utf8', (err, data) => {
                if (err){
                    //throw err;
                    console.log(chalk.red(o,"\n\n\n\n\n Walker can not read to above file:\n\n",err));
                }else {
                    let $ = cheerio.load(data);
                    if($("link").length){
                        console.log(chalk.bgMagenta("----------------------------------------------------------------------------------------"));
                        console.log(chalk.bgMagenta("----------------------------------------------------------------------------------------"));
                        console.log(chalk.bgMagenta("Style count Found in head:",$("head link[href]").length," and body: ",$("link:not(head *)[href]").length,"\t\t\t\t\t\t\n",o));
                        console.log(chalk.bgMagenta("----------------------------------------------------------------------------------------"));
                        console.log(chalk.bgMagenta("----------------------------------------------------------------------------------------"));
                        let fiLnm=o.substring(o.lastIndexOf("\\")+1,o.lastIndexOf("."));
                        let pthTxt="";
                        let pthArr=o.split("\\");
                        pthArr.forEach(o1=>{
                            let ltr=o1.substring(0,4);
                            if(ltr.length>3){
                                pthTxt+=ltr.charAt(0).toUpperCase()+ltr.slice(1)+"_";
                            }
                        });
                        pthTxt=pthTxt.replace(/[^a-zA-Z0-9._ ]/g, "");
                        let vendorCSS=[],
                            appCSS=[],
                            rand=arg['version']?pthTxt+fiLnm+"_"+arg['version']:pthTxt+fiLnm+"_"+Math.floor(Math.random()*1000);

                        $("link[href]").each((i,p)=>{
                            let srcVl=$(p).attr("href");
                            if(srcVl.indexOf("http")==-1 && !srcVl.startsWith("//fonts.")){
                                if(srcVl.substring(srcVl.lastIndexOf(".")+1,srcVl.length)=="css"){
                                    if(!strReg.test(srcVl)){
                                        console.log(chalk.bgGreen("*********  App Style found in Head   *********\t\t\t\t\t\t"));
                                        console.log(chalk.bgGreen("\tappCSS:\t",i," : ",srcVl));
                                        let totUrl=arg['public']+"/"+srcVl;
                                        appCSS.push(totUrl.replace("//","\\").split("/").join("\\"));
                                    }
                                    else {
                                        console.log(chalk.bgGreen("*********  Vendor Style found in Head    *********\t\t\t\t\t\t"));
                                        console.log(chalk.bgGreen("\tvendorCSS:\t",i," : ",srcVl));
                                        let totUrl=arg['public']+"/"+srcVl;
                                        vendorCSS.push(totUrl.replace("//","\\").split("/").join("\\"));
                                    }
                                }
                            }
                        });
                        $("link[href]").filter((p,o)=>{
                            let srcVl=$(o).attr('href');
                            if(srcVl.substring(srcVl.lastIndexOf(".")+1,srcVl.length)=="css" && srcVl.indexOf("http")==-1){
                                return true
                            }else {
                                return false
                            }
                        }).remove();
                        let t1="";
                        if(arg['output'] && arg['output'].length>arg['public'].length){
                            t1=arg['output'].substring(arg['public'].length).replace(/\\/g,"/");
                        }
                        if(vendorCSS.length){
                            $( "head" ).append( '<link href="'+t1+'/cssVend/'+'vendorCSS'+rand+'.min.'+i+'.css" rel="stylesheet" type="text/css">' );
                            addGlpTsk(6,'vendorCSS'+rand,vendorCSS,i);
                        }
                        if(appCSS.length){
                            $( "head" ).append( '<link href="'+t1+'/cssVend/'+'appCSS'+rand+'.min.'+i+'.css" rel="stylesheet" type="text/css">' );
                            addGlpTsk(6,'appCSS'+rand,appCSS,i);
                        }
                        addGlpTsk(4,'styleWt'+rand,o,replacChr($.html()));
                    }else {
                        console.log(chalk.cyan("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"));
                        console.log(chalk.cyan("No Style Found in ",o));
                        console.log(chalk.cyan("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"));
                    }
                    if(i==files.length-1){
                        console.log(chalk.green("\n\n\n\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"));
                        console.log(chalk.green("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Task are going To Run xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"));
                        console.log(chalk.green("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n\n\n"));


                        console.log(chalk.yellow("allTsks: ",allTsks));
                        gulp.task('allCssTsksRn',allTsks ,function() {
                            console.log(chalk.green('allCssTsksRn is Done'));
                        });
                        if(arg['option']!='all'){
                            gulp.start('allCssTsksRn');
                        }
                    }
                }
            });
        });
    });
};
var htmlMin=()=>{
    let files   = [];
    let walker  = walk.walk(arg['search'], { followLinks: false });

    walker.on('file', (root, stat, next)=>{
        let typ=stat.name.split(".");
        if(!(new RegExp(skipDir).test(""+root))){
            if(typ[typ.length-1]=='html'){
                files.push(root + '\\' + stat.name);
            }
        }
        next();
    });
    walker.on('end', function() {
        console.log("files",files);
        files.forEach((o,i)=>{
            fs.readFile(o,'utf8', (err, data) => {
                if (err){
                    //throw err;
                    console.log(chalk.red(o,"\n\n\n\n\n Walker can not read to above file:\n\n",err));
                }else {
                    let $ = cheerio.load(data,{
                        normalizeWhitespace: false
                    });
                    let preCnt=$("pre").length;
                    if(!arg['dontRemoveHtmlComment']){
                        $('*').contents().filter((index, node)=>{
                            return node.type === 'comment'
                        }).remove();
                    }
                    let nowHtml=minify($.html(),{
                        removeComments:false,
                        removeOptionalTags:true,
                        minifyCSS:true,
                        minifyJS:true,
                        html5:true
                    });
                    if(preCnt==0){
                        nowHtml=nowHtml.replace(/\n\s*\n/g, '\n');
                        nowHtml=nowHtml.replace(/\n\t*\n/g, '\n');
                        nowHtml=nowHtml.replace(/\n*\n/g, '\n');
                    }
                    nowHtml=replacChr(nowHtml);
                    let filNm= o.substring(o.lastIndexOf("\\"));
                    let destPth=arg['output']?arg['output']:arg['public'];
                    if(destPth){
                        if (!fs.existsSync(destPth)){
                            mkdirp(destPth, function (err) {
                                if (err){
                                    console.log("mkdirp Error",err);
                                }
                                fs.writeFile(destPth+filNm, nowHtml, (err) => {
                                    if (err){
                                        console.log(chalk.red(destPth+filNm,"\n\n\n\n\n Can not write to above file:\n\n",err));
                                    }else {
                                        console.log(chalk.green(destPth+filNm,' is Done'));
                                    }
                                });
                            });
                        }else{
                            fs.writeFile(destPth+filNm, nowHtml, (err) => {
                                if (err){
                                    console.log(chalk.red(destPth+filNm,"\n\n\n\n\n Can not write to above file:\n\n",err));
                                }else {
                                    console.log(chalk.green(destPth+filNm,' is Done'));
                                }
                            });
                        }
                    }else {
                        fs.writeFile(o, nowHtml, (err) => {
                            if (err){
                                console.log(chalk.red(o,"\n\n\n\n\n Can not write to above file:\n\n",err));
                            }else {
                                console.log(chalk.green(o,' is Done'));
                            }
                        });
                    }
                }
            });
        });
    });
};
var imgMin=()=>{
    let files   = [];
    let walker  = walk.walk(arg['search'], { followLinks: false });

    walker.on('file', (root, stat, next)=>{
        let typ=stat.name.split(".");
        if(imgMinTyp.indexOf(typ[typ.length-1].toLowerCase())!=-1){
            files.push(root + '\\' + stat.name);
        }
        next();
    });
    walker.on('end', function() {
        console.log(files);
        files.forEach((o,i)=>{
            let tskNm=(o.substring(o.lastIndexOf("\\")+1,o.lastIndexOf("."))+Math.floor(Math.random()*1000)).replace(/[^a-zA-Z0-9_]/g, "");
            let spltdImg=o.split(arg['search'])[1];
            let dstnm=arg['output']+spltdImg.substring(0,spltdImg.lastIndexOf("\\"));
            addGlpTsk(5,tskNm,o,dstnm);
        });
        gulp.task('imgMinG',allTsks ,() =>{
            console.log(chalk.green("imgMinG is done"))
        });
        console.log("allTsks:rfwer3ew  ",allTsks);
        gulp.start('imgMinG');
    });
};
var fontMin=()=>{
    let files   = [];
    let walker  = walk.walk(arg['search'], { followLinks: false });

    walker.on('file', (root, stat, next)=>{
        let typ=stat.name.split(".");
        if(fontMinTyp.indexOf(typ[typ.length-1].toLowerCase())!=-1){
            files.push(root + '\\' + stat.name);
        }
        next();
    });
    walker.on('end', function() {
        console.log(files);
        files.forEach((o,i)=>{
            let tskNm=(o.substring(o.lastIndexOf("\\")+1,o.lastIndexOf("."))+Math.floor(Math.random()*1000)).replace(/[^a-zA-Z0-9_]/g, "");
            let spltdFont=o.split(arg['search'])[1];
            let dstnm=arg['output']+spltdFont.substring(0,spltdFont.lastIndexOf("\\"));
            addGlpTsk(7,tskNm,o,dstnm);
        });
        gulp.task('fontMinG',allTsks ,() =>{
            console.log(chalk.green("fontMinG is done"))
        });
        gulp.start('fontMinG');
    });
};
var runScrpt=()=>{
    console.log(chalk.green("arg are: ",JSON.stringify(arg,null,4)));
    if(arg['option']=='jsMin'){
        let dstDyn=(arg['output']?arg['output']:arg['public'])+"/jsVend/";
        if (!fs.existsSync(dstDyn)){
            mkdirp(dstDyn);
        }
        jsMin()
    }else if(arg['option']=='requireMin'){
        jsPj.jsProjStruct(arg['ent'],arg['out'],arg['mangle'],arg['clean'])
    }else if(arg['option']=='cssMin'){
        let dstDyn=(arg['output']?arg['output']:arg['public'])+"/cssVend/";
        if (!fs.existsSync(dstDyn)){
            mkdirp(dstDyn);
        }
        cssMin();
    }else if(arg['option']=='htmlMin'){
        htmlMin()
    }else if(arg['option']=='imgMin'){
        arg['output']=arg['output']?arg['output']:arg['search'];
        imgMin()
    }else if(arg['option']=='fontMin'){
        arg['output']=arg['output']?arg['output']:arg['search'];
        fontMin()
    }else {
        console.log("arg['option']=",arg['option'])
    }
};
createArg();
runScrpt();
