/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./source/js/application.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./source/js/application.js":
/*!**********************************!*\
  !*** ./source/js/application.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nSyntaxError: /Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/source/js/application.js: Unexpected token (354:0)\\n\\n\\u001b[0m \\u001b[90m 352 | \\u001b[39m  sliderSetup()\\u001b[33m;\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 353 | \\u001b[39m  navigationSetup()\\u001b[33m;\\u001b[39m\\u001b[0m\\n\\u001b[0m\\u001b[31m\\u001b[1m>\\u001b[22m\\u001b[39m\\u001b[90m 354 | \\u001b[39m\\u001b[33m<<\\u001b[39m\\u001b[33m<<\\u001b[39m\\u001b[33m<<\\u001b[39m\\u001b[33m<\\u001b[39m \\u001b[33mHEAD\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m     | \\u001b[39m\\u001b[31m\\u001b[1m^\\u001b[22m\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 355 | \\u001b[39m  popupSetup(figureModal)\\u001b[33m;\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 356 | \\u001b[39m\\u001b[33m===\\u001b[39m\\u001b[33m===\\u001b[39m\\u001b[33m=\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 357 | \\u001b[39m  popupSetup(isPopup)\\u001b[33m;\\u001b[39m\\u001b[0m\\n    at Parser.raise (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:4051:15)\\n    at Parser.unexpected (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:5382:16)\\n    at Parser.parseExprAtom (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:6541:20)\\n    at Parser.parseExprSubscripts (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:6104:21)\\n    at Parser.parseMaybeUnary (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:6083:21)\\n    at Parser.parseExprOps (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:5968:21)\\n    at Parser.parseMaybeConditional (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:5940:21)\\n    at Parser.parseMaybeAssign (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:5887:21)\\n    at Parser.parseExpression (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:5840:21)\\n    at Parser.parseStatementContent (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:7619:21)\\n    at Parser.parseStatement (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:7505:17)\\n    at Parser.parseBlockOrModuleBlockBody (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:8073:23)\\n    at Parser.parseBlockBody (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:8060:10)\\n    at Parser.parseBlock (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:8049:10)\\n    at Parser.parseFunctionBody (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:7157:24)\\n    at Parser.parseFunctionBodyAndFinish (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:7139:10)\\n    at /Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:8225:14\\n    at Parser.withTopicForbiddingContext (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:7429:14)\\n    at Parser.parseFunction (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:8224:10)\\n    at Parser.parseFunctionStatement (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:7842:17)\\n    at Parser.parseStatementContent (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:7529:21)\\n    at Parser.parseStatement (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:7505:17)\\n    at Parser.parseBlockOrModuleBlockBody (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:8073:23)\\n    at Parser.parseBlockBody (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:8060:10)\\n    at Parser.parseTopLevel (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:7470:10)\\n    at Parser.parse (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:8915:17)\\n    at parse (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/parser/lib/index.js:10946:38)\\n    at parser (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/core/lib/transformation/normalize-file.js:170:34)\\n    at normalizeFile (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/core/lib/transformation/normalize-file.js:138:11)\\n    at runSync (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/core/lib/transformation/index.js:44:43)\\n    at runAsync (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/core/lib/transformation/index.js:35:14)\\n    at process.nextTick (/Applications/MAMP/htdocs/alpha-15/themes/quire-starter-theme/node_modules/@babel/core/lib/transform.js:34:34)\\n    at _combinedTickCallback (internal/process/next_tick.js:132:7)\\n    at process._tickCallback (internal/process/next_tick.js:181:9)\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zb3VyY2UvanMvYXBwbGljYXRpb24uanMuanMiLCJzb3VyY2VzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./source/js/application.js\n");

/***/ })

/******/ });