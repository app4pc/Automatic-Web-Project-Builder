# Build your project for production
## Build your project automatically for production just using few commands

**Services Provided**

* JS Minification(Traversing through HTML)
* JS Concatenation(Traversing through HTML)
* JS Minification(Traversing through JS)
* JS Concatenation(Traversing through JS)
* CSS Minification
* CSS Concatenation
* CSS asset dependency injection
* HTML Minification
* Image Optimisation
* Font File Optimisation


### JS Minification & Concatenation(Traversing through HTML)
It builds 4 files

* vendorHead (Vendor javaScript which should resolve before page load i.e. inside head tag)
* appHead (app javaScript which should resolve before page load i.e. inside head tag)
* vendorBody (Vendor javaScript which should resolve after page load i.e. inside body or after tag)
* appBody  (Vendor javaScript which should resolve after page load i.e. inside body or after tag)

_**Commands Options**_

node myTask.js 

--search= Path of your parent directory where your HTML are present(It can automatically find sub-directory)

--option= jsMin (For JS Minification & Concatenation Traversing through HTML)

--public= path of your public directory

--output= Output folder path //public will be treated as output if not provided

--vendor= Vendor folder name (default values will be node_modules, bower_components)

--vendor= multiple Vendor folder can be provided

--version= version of your project

--mangle= Boolean (default true)

 
  _Note:_ output, vendor, version are optional
  
 
 _Sample command_
 
 node myTask.js --search=E:\hdd\edge\dev\src\static\views --option=jsMin --public=E:\hdd\edge\dev\src --output=E:\hdd\edge\dev\src\tst  --vendor=node_modules --vendor=bower_components --version=jc561 --mangle=true

_output_

* appBodyindex_jc561.min.3.js //no. 3.. keep tracks order of script
* vendorBodyindex_jc561.min.3.js

### JS Minification & Concatenation(Traversing through JS)
It builds given output(default main.js)

_**Commands Options**_

node myTask.js 

--ent= absolute path of your entry file

--option= requireMin (For JS Minification & Concatenation Traversing through JS)

--out= absolute path of your output file

--mangle= Decide whether mangling should done or not (default is true)

--clean= Decide whether output dir should cleaned or not (default is false)

 
  _Note:_ mangle, clean are optional
  
 
 _Sample command_
 
node myTask.js --ent=E:\hdd\edge\reqireGlp\iwoScr\iwo\static\app.js --option=requireMin --out=E:\hdd\edge\reqireGlp\iwoScr\iwo\static\out.js --mangle=true --clean=false

_output_

* app.js 


### CSS Minification / Concatenation / CSS asset dependency injection

All the dependencies of css(e.g. Font files, Images etc.) will be copied with updated references in production css file

It builds 4 files

* vendorHead (Vendor style which should resolve before page load i.e. inside head tag)
* appHead (app style which should resolve before page load i.e. inside head tag)
* vendorBody (Vendor style which should resolve after page load i.e. inside body or after tag)
* appBody  (Vendor style which should resolve after page load i.e. inside body or after tag)

_**Commands Options**_

node myTask.js 

--search= Path of your parent directory where your HTML are present(It can automatically find sub-directories) //preferably put public dir so some assets inconsistencies can also be removed

--option= cssMin (For css Minification & Concatenation)

--public= path of your public directory

--output= Output folder path //public will be treated as output if not provided

--vendor= Vendor folder name

--vendor= multiple Vendor folder can be provided (default values will be node_modules, bower_components, Bootstrap)

--version= version of your project

--showCssDepErr=boolean //Show the error of css dependencies conflicts(When assets mentioned in css are not available)

 
 _Note:_ output, vendor, version, showCssDepErr are optional
 
 _Sample command_
 
node myTask.js --search=E:\hdd\edge\reqireGlp\iwoScr\iwo\static --option=cssMin --public=E:\hdd\edge\reqireGlp\iwoScr\iwo --output=E:\hdd\edge\reqireGlp\iwoScr\iwo\static --vendor=node_modules --vendor=bower_components --version=jc561

_output_

* appCSSindex_jc561.min.3.css //no. 3.. keep tracks order of style
* vendorCSSindex_jc561.min.3.css

### HTML Minification

It builds Optimised HTML file in output/public/same folder

_**Commands Options**_

node myTask.js 

--search= Path of your parent directory where your HTML are present(It can automatically find sub-directories)

--option= htmlMin (For HTML Minification)

--public= path of your public directory //Same file will be treated as output if none of public/output provided

--output= Output folder path //public will be treated as output if not provided

 
 _Note:_ public, output, are optional
 
 _Sample command_
 
 node myTask.js --search=E:\hdd\edge\reqireGlp\iwoScr\iwo\static\views --option=htmlMin

_output_

* appBodyindex_jc561.min.3.css //no. 3.. keep tracks order of style
* vendorBodyindex_jc561.min.3.css

### Image optimisation

It builds Optimised images in output/public folder

_**Commands Options**_

node myTask.js 

--search= Path of your parent directory where your images are present(It can automatically find sub-directories)

--option= imgMin (For Image optimisation)

--output= Output folder path //search will be treated as output if not provided and replace the destination

 
 _Note:_ public, output, are optional
 
 _Sample command_
 
node myTask.js --search=E:\hdd\edge\reqireGlp\iwoScr\iwo\static --option=imgMin --output=E:\hdd\edge\reqireGlp\iwoScr\iwo\static\kkp
_output_

Images will be created in respective Directory format after optimisation

### Font file optimisation

It builds Optimised Font file in output/public folder

_**Commands Options**_

node myTask.js 

--search= Path of your parent directory where your font file are present(It can automatically find sub-directories)

--option= fontMin (For font file optimisation)

--output= Output folder path //search will be treated as output if not provided and replace the destination

  
 _Sample command_
 
node myTask.js --search=E:\hdd\edge\reqireGlp\iwoScr\iwo\static --option=fontMin --output=E:\hdd\edge\reqireGlp\iwoScr\iwo\static\kkp

_output_

font file will be created in respective Directory format after optimisation


### Requirement

* node/npm

### How to run

* Go to directory
* run the command 'npm i'
* run corresponding command