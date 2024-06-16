(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("JSZip"), require("localforage"));
	else if(typeof define === 'function' && define.amd)
		define(["JSZip", "localforage"], factory);
	else if(typeof exports === 'object')
		exports["ePub"] = factory(require("JSZip"), require("localforage"));
	else
		root["ePub"] = factory(root["JSZip"], root["localforage"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__6838__, __WEBPACK_EXTERNAL_MODULE__6361__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 4582:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Ponyfill for `Array.prototype.find` which is only available in ES6 runtimes.
 *
 * Works with anything that has a `length` property and index access properties, including NodeList.
 *
 * @template {unknown} T
 * @param {Array<T> | ({length:number, [number]: T})} list
 * @param {function (item: T, index: number, list:Array<T> | ({length:number, [number]: T})):boolean} predicate
 * @param {Partial<Pick<ArrayConstructor['prototype'], 'find'>>?} ac `Array.prototype` by default,
 * 				allows injecting a custom implementation in tests
 * @returns {T | undefined}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 * @see https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.find
 */
function find(list, predicate, ac) {
	if (ac === undefined) {
		ac = Array.prototype;
	}
	if (list && typeof ac.find === 'function') {
		return ac.find.call(list, predicate);
	}
	for (var i = 0; i < list.length; i++) {
		if (Object.prototype.hasOwnProperty.call(list, i)) {
			var item = list[i];
			if (predicate.call(undefined, item, i, list)) {
				return item;
			}
		}
	}
}

/**
 * "Shallow freezes" an object to render it immutable.
 * Uses `Object.freeze` if available,
 * otherwise the immutability is only in the type.
 *
 * Is used to create "enum like" objects.
 *
 * @template T
 * @param {T} object the object to freeze
 * @param {Pick<ObjectConstructor, 'freeze'> = Object} oc `Object` by default,
 * 				allows to inject custom object constructor for tests
 * @returns {Readonly<T>}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
function freeze(object, oc) {
	if (oc === undefined) {
		oc = Object
	}
	return oc && typeof oc.freeze === 'function' ? oc.freeze(object) : object
}

/**
 * Since we can not rely on `Object.assign` we provide a simplified version
 * that is sufficient for our needs.
 *
 * @param {Object} target
 * @param {Object | null | undefined} source
 *
 * @returns {Object} target
 * @throws TypeError if target is not an object
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * @see https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.assign
 */
function assign(target, source) {
	if (target === null || typeof target !== 'object') {
		throw new TypeError('target is not an object')
	}
	for (var key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			target[key] = source[key]
		}
	}
	return target
}

/**
 * All mime types that are allowed as input to `DOMParser.parseFromString`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#Argument02 MDN
 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#domparsersupportedtype WHATWG HTML Spec
 * @see DOMParser.prototype.parseFromString
 */
var MIME_TYPE = freeze({
	/**
	 * `text/html`, the only mime type that triggers treating an XML document as HTML.
	 *
	 * @see DOMParser.SupportedType.isHTML
	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring WHATWG HTML Spec
	 */
	HTML: 'text/html',

	/**
	 * Helper method to check a mime type if it indicates an HTML document
	 *
	 * @param {string} [value]
	 * @returns {boolean}
	 *
	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring 	 */
	isHTML: function (value) {
		return value === MIME_TYPE.HTML
	},

	/**
	 * `application/xml`, the standard mime type for XML documents.
	 *
	 * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType registration
	 * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
	 */
	XML_APPLICATION: 'application/xml',

	/**
	 * `text/html`, an alias for `application/xml`.
	 *
	 * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
	 * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
	 */
	XML_TEXT: 'text/xml',

	/**
	 * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
	 * but is parsed as an XML document.
	 *
	 * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType registration
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
	 * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
	 */
	XML_XHTML_APPLICATION: 'application/xhtml+xml',

	/**
	 * `image/svg+xml`,
	 *
	 * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
	 * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
	 * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
	 */
	XML_SVG_IMAGE: 'image/svg+xml',
})

/**
 * Namespaces that are used in this code base.
 *
 * @see http://www.w3.org/TR/REC-xml-names
 */
var NAMESPACE = freeze({
	/**
	 * The XHTML namespace.
	 *
	 * @see http://www.w3.org/1999/xhtml
	 */
	HTML: 'http://www.w3.org/1999/xhtml',

	/**
	 * Checks if `uri` equals `NAMESPACE.HTML`.
	 *
	 * @param {string} [uri]
	 *
	 * @see NAMESPACE.HTML
	 */
	isHTML: function (uri) {
		return uri === NAMESPACE.HTML
	},

	/**
	 * The SVG namespace.
	 *
	 * @see http://www.w3.org/2000/svg
	 */
	SVG: 'http://www.w3.org/2000/svg',

	/**
	 * The `xml:` namespace.
	 *
	 * @see http://www.w3.org/XML/1998/namespace
	 */
	XML: 'http://www.w3.org/XML/1998/namespace',

	/**
	 * The `xmlns:` namespace
	 *
	 * @see https://www.w3.org/2000/xmlns/
	 */
	XMLNS: 'http://www.w3.org/2000/xmlns/',
})

exports.assign = assign;
exports.find = find;
exports.freeze = freeze;
exports.MIME_TYPE = MIME_TYPE;
exports.NAMESPACE = NAMESPACE;


/***/ }),

/***/ 5752:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;
var conventions = __webpack_require__(4582);
var dom = __webpack_require__(4722)
var entities = __webpack_require__(6559);
var sax = __webpack_require__(4466);

var DOMImplementation = dom.DOMImplementation;

var NAMESPACE = conventions.NAMESPACE;

var ParseError = sax.ParseError;
var XMLReader = sax.XMLReader;

/**
 * Normalizes line ending according to https://www.w3.org/TR/xml11/#sec-line-ends:
 *
 * > XML parsed entities are often stored in computer files which,
 * > for editing convenience, are organized into lines.
 * > These lines are typically separated by some combination
 * > of the characters CARRIAGE RETURN (#xD) and LINE FEED (#xA).
 * >
 * > To simplify the tasks of applications, the XML processor must behave
 * > as if it normalized all line breaks in external parsed entities (including the document entity)
 * > on input, before parsing, by translating all of the following to a single #xA character:
 * >
 * > 1. the two-character sequence #xD #xA
 * > 2. the two-character sequence #xD #x85
 * > 3. the single character #x85
 * > 4. the single character #x2028
 * > 5. any #xD character that is not immediately followed by #xA or #x85.
 *
 * @param {string} input
 * @returns {string}
 */
function normalizeLineEndings(input) {
	return input
		.replace(/\r[\n\u0085]/g, '\n')
		.replace(/[\r\u0085\u2028]/g, '\n')
}

/**
 * @typedef Locator
 * @property {number} [columnNumber]
 * @property {number} [lineNumber]
 */

/**
 * @typedef DOMParserOptions
 * @property {DOMHandler} [domBuilder]
 * @property {Function} [errorHandler]
 * @property {(string) => string} [normalizeLineEndings] used to replace line endings before parsing
 * 						defaults to `normalizeLineEndings`
 * @property {Locator} [locator]
 * @property {Record<string, string>} [xmlns]
 *
 * @see normalizeLineEndings
 */

/**
 * The DOMParser interface provides the ability to parse XML or HTML source code
 * from a string into a DOM `Document`.
 *
 * _xmldom is different from the spec in that it allows an `options` parameter,
 * to override the default behavior._
 *
 * @param {DOMParserOptions} [options]
 * @constructor
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-parsing-and-serialization
 */
function DOMParser(options){
	this.options = options ||{locator:{}};
}

DOMParser.prototype.parseFromString = function(source,mimeType){
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var isHTML = /\/x?html?$/.test(mimeType);//mimeType.toLowerCase().indexOf('html') > -1;
  	var entityMap = isHTML ? entities.HTML_ENTITIES : entities.XML_ENTITIES;
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}

	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(isHTML){
		defaultNSMap[''] = NAMESPACE.HTML;
	}
	defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
	var normalize = options.normalizeLineEndings || normalizeLineEndings;
	if (source && typeof source === 'string') {
		sax.parse(
			normalize(source),
			defaultNSMap,
			entityMap
		)
	} else {
		sax.errorHandler.error('invalid doc source')
	}
	return domBuilder.doc;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn && isCallback){
			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
		}
		errorHandler[key] = fn && function(msg){
			fn('[xmldom '+key+']\t'+msg+_locator(locator));
		}||function(){};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler
 *
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */
DOMHandler.prototype = {
	startDocument : function() {
    	this.doc = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.doc.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;

		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator &&position(attrs.getLocator(i),attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
		var tagName = current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.doc.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(chars){
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if(this.currentElement){
				this.currentElement.appendChild(charNode);
			}else if(/^\s*$/.test(chars)){
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.doc.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.doc.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},

	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},

	startDTD:function(name, publicId, systemId) {
		var impl = this.doc.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
					this.doc.doctype = dt;
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
	},
	error:function(error) {
		console.error('[xmldom error]\t'+error,_locator(this.locator));
	},
	fatalError:function(error) {
		throw new ParseError(error, this.locator);
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.doc.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

__webpack_unused_export__ = DOMHandler;
__webpack_unused_export__ = normalizeLineEndings;
exports.DOMParser = DOMParser;


/***/ }),

/***/ 4722:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var conventions = __webpack_require__(4582);

var find = conventions.find;
var NAMESPACE = conventions.NAMESPACE;

/**
 * A prerequisite for `[].filter`, to drop elements that are empty
 * @param {string} input
 * @returns {boolean}
 */
function notEmptyString (input) {
	return input !== ''
}
/**
 * @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
 * @see https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * @param {string} input
 * @returns {string[]} (can be empty)
 */
function splitOnASCIIWhitespace(input) {
	// U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, U+0020 SPACE
	return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : []
}

/**
 * Adds element as a key to current if it is not already present.
 *
 * @param {Record<string, boolean | undefined>} current
 * @param {string} element
 * @returns {Record<string, boolean | undefined>}
 */
function orderedSetReducer (current, element) {
	if (!current.hasOwnProperty(element)) {
		current[element] = true;
	}
	return current;
}

/**
 * @see https://infra.spec.whatwg.org/#ordered-set
 * @param {string} input
 * @returns {string[]}
 */
function toOrderedSet(input) {
	if (!input) return [];
	var list = splitOnASCIIWhitespace(input);
	return Object.keys(list.reduce(orderedSetReducer, {}))
}

/**
 * Uses `list.indexOf` to implement something like `Array.prototype.includes`,
 * which we can not rely on being available.
 *
 * @param {any[]} list
 * @returns {function(any): boolean}
 */
function arrayIncludes (list) {
	return function(element) {
		return list && list.indexOf(element) !== -1;
	}
}

function copy(src,dest){
	for(var p in src){
		if (Object.prototype.hasOwnProperty.call(src, p)) {
			dest[p] = src[p];
		}
	}
}

/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknown Class:"+Class)
		}
		pt.constructor = Class
	}
}

// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);

/**
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 */
function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)

/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0,
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index.
	 */
	item: function(index) {
		return index >= 0 && index < this.length ? this[index] : null;
	},
	toString:function(isHTML,nodeFilter){
		for(var buf = [], i = 0;i<this.length;i++){
			serializeToString(this[i],buf,isHTML,nodeFilter);
		}
		return buf.join('');
	},
	/**
	 * @private
	 * @param {function (Node):boolean} predicate
	 * @returns {Node[]}
	 */
	filter: function (predicate) {
		return Array.prototype.filter.call(this, predicate);
	},
	/**
	 * @private
	 * @param {Node} item
	 * @returns {number}
	 */
	indexOf: function (item) {
		return Array.prototype.indexOf.call(this, item);
	},
};

function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if (list._inc !== inc) {
		var ls = list._refresh(list._node);
		__set__(list,'length',ls.length);
		if (!list.$$length || ls.length < list.$$length) {
			for (var i = ls.length; i in list; i++) {
				if (Object.prototype.hasOwnProperty.call(list, i)) {
					delete list[i];
				}
			}
		}
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i] || null;
}

_extends(LiveNodeList,NodeList);

/**
 * Objects implementing the NamedNodeMap interface are used
 * to represent collections of nodes that can be accessed by name.
 * Note that NamedNodeMap does not inherit from NodeList;
 * NamedNodeMaps are not maintained in any particular order.
 * Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index,
 * but this is simply to allow convenient enumeration of the contents of a NamedNodeMap,
 * and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw new DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		//console.log()
		var i = this.length;
		while(i--){
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;


	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR

	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};

/**
 * The DOMImplementation interface represents an object providing methods
 * which are not dependent on any particular document.
 * Such an object is returned by the `Document.implementation` property.
 *
 * __The individual methods describe the differences compared to the specs.__
 *
 * @constructor
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation MDN
 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490 DOM Level 1 Core (Initial)
 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-102161490 DOM Level 2 Core
 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-102161490 DOM Level 3 Core
 * @see https://dom.spec.whatwg.org/#domimplementation DOM Living Standard
 */
function DOMImplementation() {
}

DOMImplementation.prototype = {
	/**
	 * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given feature is supported.
	 * The different implementations fairly diverged in what kind of features were reported.
	 * The latest version of the spec settled to force this method to always return true, where the functionality was accurate and in use.
	 *
	 * @deprecated It is deprecated and modern browsers return true in all cases.
	 *
	 * @param {string} feature
	 * @param {string} [version]
	 * @returns {boolean} always true
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
	 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
	 */
	hasFeature: function(feature, version) {
			return true;
	},
	/**
	 * Creates an XML Document object of the specified type with its document element.
	 *
	 * __It behaves slightly different from the description in the living standard__:
	 * - There is no interface/class `XMLDocument`, it returns a `Document` instance.
	 * - `contentType`, `encoding`, `mode`, `origin`, `url` fields are currently not declared.
	 * - this implementation is not validating names or qualified names
	 *   (when parsing XML strings, the SAX parser takes care of that)
	 *
	 * @param {string|null} namespaceURI
	 * @param {string} qualifiedName
	 * @param {DocumentType=null} doctype
	 * @returns {Document}
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM Level 2 Core (initial)
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument  DOM Level 2 Core
	 *
	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
	 */
	createDocument: function(namespaceURI,  qualifiedName, doctype){
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype || null;
		if (doctype){
			doc.appendChild(doctype);
		}
		if (qualifiedName){
			var root = doc.createElementNS(namespaceURI, qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	/**
	 * Returns a doctype, with the given `qualifiedName`, `publicId`, and `systemId`.
	 *
	 * __This behavior is slightly different from the in the specs__:
	 * - this implementation is not validating names or qualified names
	 *   (when parsing XML strings, the SAX parser takes care of that)
	 *
	 * @param {string} qualifiedName
	 * @param {string} [publicId]
	 * @param {string} [systemId]
	 * @returns {DocumentType} which can either be used with `DOMImplementation.createDocument` upon document creation
	 * 				  or can be put into the document via methods like `Node.insertBefore()` or `Node.replaceChild()`
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType MDN
	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM Level 2 Core
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living Standard
	 *
	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
	 */
	createDocumentType: function(qualifiedName, publicId, systemId){
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId || '';
		node.systemId = systemId || '';

		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises
		_insertBefore(this, newChild,oldChild, assertPreReplacementValidityInDocument);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
	/**
	 * Look up the prefix associated to the given namespace URI, starting from this node.
	 * **The default namespace declarations are ignored by this method.**
	 * See Namespace Prefix Lookup for details on the algorithm used by this method.
	 *
	 * _Note: The implementation seems to be incomplete when compared to the algorithm described in the specs._
	 *
	 * @param {string | null} namespaceURI
	 * @returns {string | null}
	 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
	 * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
	 * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
	 * @see https://github.com/xmldom/xmldom/issues/322
	 */
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
						if (Object.prototype.hasOwnProperty.call(map, n) && map[n] === namespaceURI) {
							return n;
						}
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(Object.prototype.hasOwnProperty.call(map, prefix)){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
	this.ownerDocument = this;
}

function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns === NAMESPACE.XMLNS){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}

function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns === NAMESPACE.XMLNS){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}

/**
 * Updates `el.childNodes`, updating the indexed items and it's `length`.
 * Passing `newChild` means it will be appended.
 * Otherwise it's assumed that an item has been removed,
 * and `el.firstNode` and it's `.nextSibling` are used
 * to walk the current list of child nodes.
 *
 * @param {Document} doc
 * @param {Node} el
 * @param {Node} [newChild]
 * @private
 */
function _onUpdateChild (doc, el, newChild) {
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if (newChild) {
			cs[cs.length++] = newChild;
		} else {
			var child = el.firstChild;
			var i = 0;
			while (child) {
				cs[i++] = child;
				child = child.nextSibling;
			}
			cs.length = i;
			delete cs[cs.length];
		}
	}
}

/**
 * Removes the connections between `parentNode` and `child`
 * and any existing `child.previousSibling` or `child.nextSibling`.
 *
 * @see https://github.com/xmldom/xmldom/issues/135
 * @see https://github.com/xmldom/xmldom/issues/145
 *
 * @param {Node} parentNode
 * @param {Node} child
 * @returns {Node} the child that was removed.
 * @private
 */
function _removeChild (parentNode, child) {
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if (previous) {
		previous.nextSibling = next;
	} else {
		parentNode.firstChild = next;
	}
	if (next) {
		next.previousSibling = previous;
	} else {
		parentNode.lastChild = previous;
	}
	child.parentNode = null;
	child.previousSibling = null;
	child.nextSibling = null;
	_onUpdateChild(parentNode.ownerDocument, parentNode);
	return child;
}

/**
 * Returns `true` if `node` can be a parent for insertion.
 * @param {Node} node
 * @returns {boolean}
 */
function hasValidParentNodeType(node) {
	return (
		node &&
		(node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.ELEMENT_NODE)
	);
}

/**
 * Returns `true` if `node` can be inserted according to it's `nodeType`.
 * @param {Node} node
 * @returns {boolean}
 */
function hasInsertableNodeType(node) {
	return (
		node &&
		(isElementNode(node) ||
			isTextNode(node) ||
			isDocTypeNode(node) ||
			node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
			node.nodeType === Node.COMMENT_NODE ||
			node.nodeType === Node.PROCESSING_INSTRUCTION_NODE)
	);
}

/**
 * Returns true if `node` is a DOCTYPE node
 * @param {Node} node
 * @returns {boolean}
 */
function isDocTypeNode(node) {
	return node && node.nodeType === Node.DOCUMENT_TYPE_NODE;
}

/**
 * Returns true if the node is an element
 * @param {Node} node
 * @returns {boolean}
 */
function isElementNode(node) {
	return node && node.nodeType === Node.ELEMENT_NODE;
}
/**
 * Returns true if `node` is a text node
 * @param {Node} node
 * @returns {boolean}
 */
function isTextNode(node) {
	return node && node.nodeType === Node.TEXT_NODE;
}

/**
 * Check if en element node can be inserted before `child`, or at the end if child is falsy,
 * according to the presence and position of a doctype node on the same level.
 *
 * @param {Document} doc The document node
 * @param {Node} child the node that would become the nextSibling if the element would be inserted
 * @returns {boolean} `true` if an element can be inserted before child
 * @private
 * https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 */
function isElementInsertionPossible(doc, child) {
	var parentChildNodes = doc.childNodes || [];
	if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) {
		return false;
	}
	var docTypeNode = find(parentChildNodes, isDocTypeNode);
	return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
}

/**
 * Check if en element node can be inserted before `child`, or at the end if child is falsy,
 * according to the presence and position of a doctype node on the same level.
 *
 * @param {Node} doc The document node
 * @param {Node} child the node that would become the nextSibling if the element would be inserted
 * @returns {boolean} `true` if an element can be inserted before child
 * @private
 * https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 */
function isElementReplacementPossible(doc, child) {
	var parentChildNodes = doc.childNodes || [];

	function hasElementChildThatIsNotChild(node) {
		return isElementNode(node) && node !== child;
	}

	if (find(parentChildNodes, hasElementChildThatIsNotChild)) {
		return false;
	}
	var docTypeNode = find(parentChildNodes, isDocTypeNode);
	return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
}

/**
 * @private
 * Steps 1-5 of the checks before inserting and before replacing a child are the same.
 *
 * @param {Node} parent the parent node to insert `node` into
 * @param {Node} node the node to insert
 * @param {Node=} child the node that should become the `nextSibling` of `node`
 * @returns {Node}
 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
 * @throws DOMException if `child` is provided but is not a child of `parent`.
 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 * @see https://dom.spec.whatwg.org/#concept-node-replace
 */
function assertPreInsertionValidity1to5(parent, node, child) {
	// 1. If `parent` is not a Document, DocumentFragment, or Element node, then throw a "HierarchyRequestError" DOMException.
	if (!hasValidParentNodeType(parent)) {
		throw new DOMException(HIERARCHY_REQUEST_ERR, 'Unexpected parent node type ' + parent.nodeType);
	}
	// 2. If `node` is a host-including inclusive ancestor of `parent`, then throw a "HierarchyRequestError" DOMException.
	// not implemented!
	// 3. If `child` is non-null and its parent is not `parent`, then throw a "NotFoundError" DOMException.
	if (child && child.parentNode !== parent) {
		throw new DOMException(NOT_FOUND_ERR, 'child not in parent');
	}
	if (
		// 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
		!hasInsertableNodeType(node) ||
		// 5. If either `node` is a Text node and `parent` is a document,
		// the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
		// || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
		// or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
		(isDocTypeNode(node) && parent.nodeType !== Node.DOCUMENT_NODE)
	) {
		throw new DOMException(
			HIERARCHY_REQUEST_ERR,
			'Unexpected node type ' + node.nodeType + ' for parent node type ' + parent.nodeType
		);
	}
}

/**
 * @private
 * Step 6 of the checks before inserting and before replacing a child are different.
 *
 * @param {Document} parent the parent node to insert `node` into
 * @param {Node} node the node to insert
 * @param {Node | undefined} child the node that should become the `nextSibling` of `node`
 * @returns {Node}
 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
 * @throws DOMException if `child` is provided but is not a child of `parent`.
 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 * @see https://dom.spec.whatwg.org/#concept-node-replace
 */
function assertPreInsertionValidityInDocument(parent, node, child) {
	var parentChildNodes = parent.childNodes || [];
	var nodeChildNodes = node.childNodes || [];

	// DocumentFragment
	if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
		var nodeChildElements = nodeChildNodes.filter(isElementNode);
		// If node has more than one element child or has a Text node child.
		if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'More than one element or text in fragment');
		}
		// Otherwise, if `node` has one element child and either `parent` has an element child,
		// `child` is a doctype, or `child` is non-null and a doctype is following `child`.
		if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Element in fragment can not be inserted before doctype');
		}
	}
	// Element
	if (isElementNode(node)) {
		// `parent` has an element child, `child` is a doctype,
		// or `child` is non-null and a doctype is following `child`.
		if (!isElementInsertionPossible(parent, child)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one element can be added and only after doctype');
		}
	}
	// DocumentType
	if (isDocTypeNode(node)) {
		// `parent` has a doctype child,
		if (find(parentChildNodes, isDocTypeNode)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one doctype is allowed');
		}
		var parentElementChild = find(parentChildNodes, isElementNode);
		// `child` is non-null and an element is preceding `child`,
		if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can only be inserted before an element');
		}
		// or `child` is null and `parent` has an element child.
		if (!child && parentElementChild) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can not be appended since element is present');
		}
	}
}

/**
 * @private
 * Step 6 of the checks before inserting and before replacing a child are different.
 *
 * @param {Document} parent the parent node to insert `node` into
 * @param {Node} node the node to insert
 * @param {Node | undefined} child the node that should become the `nextSibling` of `node`
 * @returns {Node}
 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
 * @throws DOMException if `child` is provided but is not a child of `parent`.
 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 * @see https://dom.spec.whatwg.org/#concept-node-replace
 */
function assertPreReplacementValidityInDocument(parent, node, child) {
	var parentChildNodes = parent.childNodes || [];
	var nodeChildNodes = node.childNodes || [];

	// DocumentFragment
	if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
		var nodeChildElements = nodeChildNodes.filter(isElementNode);
		// If `node` has more than one element child or has a Text node child.
		if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'More than one element or text in fragment');
		}
		// Otherwise, if `node` has one element child and either `parent` has an element child that is not `child` or a doctype is following `child`.
		if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent, child)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Element in fragment can not be inserted before doctype');
		}
	}
	// Element
	if (isElementNode(node)) {
		// `parent` has an element child that is not `child` or a doctype is following `child`.
		if (!isElementReplacementPossible(parent, child)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one element can be added and only after doctype');
		}
	}
	// DocumentType
	if (isDocTypeNode(node)) {
		function hasDoctypeChildThatIsNotChild(node) {
			return isDocTypeNode(node) && node !== child;
		}

		// `parent` has a doctype child that is not `child`,
		if (find(parentChildNodes, hasDoctypeChildThatIsNotChild)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one doctype is allowed');
		}
		var parentElementChild = find(parentChildNodes, isElementNode);
		// or an element is preceding `child`.
		if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can only be inserted before an element');
		}
	}
}

/**
 * @private
 * @param {Node} parent the parent node to insert `node` into
 * @param {Node} node the node to insert
 * @param {Node=} child the node that should become the `nextSibling` of `node`
 * @returns {Node}
 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
 * @throws DOMException if `child` is provided but is not a child of `parent`.
 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 */
function _insertBefore(parent, node, child, _inDocumentAssertion) {
	// To ensure pre-insertion validity of a node into a parent before a child, run these steps:
	assertPreInsertionValidity1to5(parent, node, child);

	// If parent is a document, and any of the statements below, switched on the interface node implements,
	// are true, then throw a "HierarchyRequestError" DOMException.
	if (parent.nodeType === Node.DOCUMENT_NODE) {
		(_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent, node, child);
	}

	var cp = node.parentNode;
	if(cp){
		cp.removeChild(node);//remove and update
	}
	if(node.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = node.firstChild;
		if (newFirst == null) {
			return node;
		}
		var newLast = node.lastChild;
	}else{
		newFirst = newLast = node;
	}
	var pre = child ? child.previousSibling : parent.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = child;


	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parent.firstChild = newFirst;
	}
	if(child == null){
		parent.lastChild = newLast;
	}else{
		child.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parent;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parent.ownerDocument||parent, parent);
	//console.log(parent.lastChild.nextSibling == null)
	if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
		node.firstChild = node.lastChild = null;
	}
	return node;
}

/**
 * Appends `newChild` to `parentNode`.
 * If `newChild` is already connected to a `parentNode` it is first removed from it.
 *
 * @see https://github.com/xmldom/xmldom/issues/135
 * @see https://github.com/xmldom/xmldom/issues/145
 * @param {Node} parentNode
 * @param {Node} newChild
 * @returns {Node}
 * @private
 */
function _appendSingleChild (parentNode, newChild) {
	if (newChild.parentNode) {
		newChild.parentNode.removeChild(newChild);
	}
	newChild.parentNode = parentNode;
	newChild.previousSibling = parentNode.lastChild;
	newChild.nextSibling = null;
	if (newChild.previousSibling) {
		newChild.previousSibling.nextSibling = newChild;
	} else {
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
	return newChild;
}

Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	/**
	 * The DocumentType node of the document.
	 *
	 * @readonly
	 * @type DocumentType
	 */
	doctype :  null,
	documentElement :  null,
	_inc : 1,

	insertBefore :  function(newChild, refChild){//raises
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		_insertBefore(this, newChild, refChild);
		newChild.ownerDocument = this;
		if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
			this.documentElement = newChild;
		}

		return newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	replaceChild: function (newChild, oldChild) {
		//raises
		_insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
		newChild.ownerDocument = this;
		if (oldChild) {
			this.removeChild(oldChild);
		}
		if (isElementNode(newChild)) {
			this.documentElement = newChild;
		}
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == ELEMENT_NODE){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},

	/**
	 * The `getElementsByClassName` method of `Document` interface returns an array-like object
	 * of all child elements which have **all** of the given class name(s).
	 *
	 * Returns an empty list if `classeNames` is an empty string or only contains HTML white space characters.
	 *
	 *
	 * Warning: This is a live LiveNodeList.
	 * Changes in the DOM will reflect in the array as the changes occur.
	 * If an element selected by this array no longer qualifies for the selector,
	 * it will automatically be removed. Be aware of this for iteration purposes.
	 *
	 * @param {string} classNames is a string representing the class name(s) to match; multiple class names are separated by (ASCII-)whitespace
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
	 * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
	 */
	getElementsByClassName: function(classNames) {
		var classNamesSet = toOrderedSet(classNames)
		return new LiveNodeList(this, function(base) {
			var ls = [];
			if (classNamesSet.length > 0) {
				_visitNode(base.documentElement, function(node) {
					if(node !== base && node.nodeType === ELEMENT_NODE) {
						var nodeClassNames = node.getAttribute('class')
						// can be null if the attribute does not exist
						if (nodeClassNames) {
							// before splitting and iterating just compare them for the most common case
							var matches = classNames === nodeClassNames;
							if (!matches) {
								var nodeClassNamesSet = toOrderedSet(nodeClassNames)
								matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet))
							}
							if(matches) {
								ls.push(node);
							}
						}
					}
				});
			}
			return ls;
		});
	},

	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.localName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.nodeName = node.target = target;
		node.nodeValue = node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},

	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},

	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},

	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;

		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);

	},
	appendChild:function(newChild){
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
	return nodeSerializeToString.call(node,isHtml,nodeFilter);
}
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml,nodeFilter){
	var buf = [];
	var refNode = this.nodeType == 9 && this.documentElement || this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;

	if(uri && prefix == null){
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if(prefix == null){
			//isHTML = true;
			var visibleNamespaces=[
			{namespace:uri,prefix:null}
			//{namespace:uri,prefix:''}
			]
		}
	}
	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}

function needNamespaceDefine(node, isHTML, visibleNamespaces) {
	var prefix = node.prefix || '';
	var uri = node.namespaceURI;
	// According to [Namespaces in XML 1.0](https://www.w3.org/TR/REC-xml-names/#ns-using) ,
	// and more specifically https://www.w3.org/TR/REC-xml-names/#nsc-NoPrefixUndecl :
	// > In a namespace declaration for a prefix [...], the attribute value MUST NOT be empty.
	// in a similar manner [Namespaces in XML 1.1](https://www.w3.org/TR/xml-names11/#ns-using)
	// and more specifically https://www.w3.org/TR/xml-names11/#nsc-NSDeclared :
	// > [...] Furthermore, the attribute value [...] must not be an empty string.
	// so serializing empty namespace value like xmlns:ds="" would produce an invalid XML document.
	if (!uri) {
		return false;
	}
	if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
		return false;
	}

	var i = visibleNamespaces.length
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		if (ns.prefix === prefix) {
			return ns.namespace !== uri;
		}
	}
	return true;
}
/**
 * Well-formed constraint: No < in Attribute Values
 * > The replacement text of any entity referred to directly or indirectly
 * > in an attribute value must not contain a <.
 * @see https://www.w3.org/TR/xml11/#CleanAttrVals
 * @see https://www.w3.org/TR/xml11/#NT-AttValue
 *
 * Literal whitespace other than space that appear in attribute values
 * are serialized as their entity references, so they will be preserved.
 * (In contrast to whitespace literals in the input which are normalized to spaces)
 * @see https://www.w3.org/TR/xml11/#AVNormalize
 * @see https://w3c.github.io/DOM-Parsing/#serializing-an-element-s-attributes
 */
function addSerializedAttribute(buf, qualifiedName, value) {
	buf.push(' ', qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"')
}

function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if (!visibleNamespaces) {
		visibleNamespaces = [];
	}

	if(nodeFilter){
		node = nodeFilter(node);
		if(node){
			if(typeof node == 'string'){
				buf.push(node);
				return;
			}
		}else{
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}

	switch(node.nodeType){
	case ELEMENT_NODE:
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;

		isHTML = NAMESPACE.isHTML(node.namespaceURI) || isHTML

		var prefixedNodeName = nodeName
		if (!isHTML && !node.prefix && node.namespaceURI) {
			var defaultNS
			// lookup current default ns from `xmlns` attribute
			for (var ai = 0; ai < attrs.length; ai++) {
				if (attrs.item(ai).name === 'xmlns') {
					defaultNS = attrs.item(ai).value
					break
				}
			}
			if (!defaultNS) {
				// lookup current default ns in visibleNamespaces
				for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
					var namespace = visibleNamespaces[nsi]
					if (namespace.prefix === '' && namespace.namespace === node.namespaceURI) {
						defaultNS = namespace.namespace
						break
					}
				}
			}
			if (defaultNS !== node.namespaceURI) {
				for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
					var namespace = visibleNamespaces[nsi]
					if (namespace.namespace === node.namespaceURI) {
						if (namespace.prefix) {
							prefixedNodeName = namespace.prefix + ':' + nodeName
						}
						break
					}
				}
			}
		}

		buf.push('<', prefixedNodeName);

		for(var i=0;i<len;i++){
			// add namespaces for attributes
			var attr = attrs.item(i);
			if (attr.prefix == 'xmlns') {
				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
			}else if(attr.nodeName == 'xmlns'){
				visibleNamespaces.push({ prefix: '', namespace: attr.value });
			}
		}

		for(var i=0;i<len;i++){
			var attr = attrs.item(i);
			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
				var prefix = attr.prefix||'';
				var uri = attr.namespaceURI;
				addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}

		// add namespace for current node
		if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
			visibleNamespaces.push({ prefix: prefix, namespace:uri });
		}

		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				while(child){
					if(child.data){
						buf.push(child.data);
					}else{
						serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
					child = child.nextSibling;
				}
			}
			buf.push('</',prefixedNodeName,'>');
		}else{
			buf.push('/>');
		}
		// remove added visible namespaces
		//visibleNamespaces.length = startVisibleNamespaces;
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return addSerializedAttribute(buf, node.name, node.value);
	case TEXT_NODE:
		/**
		 * The ampersand character (&) and the left angle bracket (<) must not appear in their literal form,
		 * except when used as markup delimiters, or within a comment, a processing instruction, or a CDATA section.
		 * If they are needed elsewhere, they must be escaped using either numeric character references or the strings
		 * `&amp;` and `&lt;` respectively.
		 * The right angle bracket (>) may be represented using the string " &gt; ", and must, for compatibility,
		 * be escaped using either `&gt;` or a character reference when it appears in the string `]]>` in content,
		 * when that string is not marking the end of a CDATA section.
		 *
		 * In the content of elements, character data is any string of characters
		 * which does not contain the start-delimiter of any markup
		 * and does not include the CDATA-section-close delimiter, `]]>`.
		 *
		 * @see https://www.w3.org/TR/xml/#NT-CharData
		 * @see https://w3c.github.io/DOM-Parsing/#xml-serializing-a-text-node
		 */
		return buf.push(node.data
			.replace(/[<&>]/g,_xmlEncoder)
		);
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC ', pubid);
			if (sysid && sysid!='.') {
				buf.push(' ', sysid);
			}
			buf.push('>');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM ', sysid, '>');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for (var n in node) {
		if (Object.prototype.hasOwnProperty.call(node, n)) {
			var v = node[n];
			if (typeof v != "object") {
				if (v != node2[n]) {
					node2[n] = v;
				}
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});

		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},

			set:function(data){
				switch(this.nodeType){
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;

				default:
					this.data = data;
					this.value = data;
					this.nodeValue = data;
				}
			}
		})

		function getTextContent(node){
			switch(node.nodeType){
			case ELEMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}

		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

//if(typeof require == 'function'){
	exports.DocumentType = DocumentType;
	exports.DOMException = DOMException;
	exports.DOMImplementation = DOMImplementation;
	exports.Element = Element;
	exports.Node = Node;
	exports.NodeList = NodeList;
	exports.XMLSerializer = XMLSerializer;
//}


/***/ }),

/***/ 6559:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var freeze = (__webpack_require__(4582).freeze);

/**
 * The entities that are predefined in every XML document.
 *
 * @see https://www.w3.org/TR/2006/REC-xml11-20060816/#sec-predefined-ent W3C XML 1.1
 * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-predefined-ent W3C XML 1.0
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML Wikipedia
 */
exports.XML_ENTITIES = freeze({
	amp: '&',
	apos: "'",
	gt: '>',
	lt: '<',
	quot: '"',
});

/**
 * A map of all entities that are detected in an HTML document.
 * They contain all entries from `XML_ENTITIES`.
 *
 * @see XML_ENTITIES
 * @see DOMParser.parseFromString
 * @see DOMImplementation.prototype.createHTMLDocument
 * @see https://html.spec.whatwg.org/#named-character-references WHATWG HTML(5) Spec
 * @see https://html.spec.whatwg.org/entities.json JSON
 * @see https://www.w3.org/TR/xml-entity-names/ W3C XML Entity Names
 * @see https://www.w3.org/TR/html4/sgml/entities.html W3C HTML4/SGML
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Character_entity_references_in_HTML Wikipedia (HTML)
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Entities_representing_special_characters_in_XHTML Wikpedia (XHTML)
 */
exports.HTML_ENTITIES = freeze({
	Aacute: '\u00C1',
	aacute: '\u00E1',
	Abreve: '\u0102',
	abreve: '\u0103',
	ac: '\u223E',
	acd: '\u223F',
	acE: '\u223E\u0333',
	Acirc: '\u00C2',
	acirc: '\u00E2',
	acute: '\u00B4',
	Acy: '\u0410',
	acy: '\u0430',
	AElig: '\u00C6',
	aelig: '\u00E6',
	af: '\u2061',
	Afr: '\uD835\uDD04',
	afr: '\uD835\uDD1E',
	Agrave: '\u00C0',
	agrave: '\u00E0',
	alefsym: '\u2135',
	aleph: '\u2135',
	Alpha: '\u0391',
	alpha: '\u03B1',
	Amacr: '\u0100',
	amacr: '\u0101',
	amalg: '\u2A3F',
	AMP: '\u0026',
	amp: '\u0026',
	And: '\u2A53',
	and: '\u2227',
	andand: '\u2A55',
	andd: '\u2A5C',
	andslope: '\u2A58',
	andv: '\u2A5A',
	ang: '\u2220',
	ange: '\u29A4',
	angle: '\u2220',
	angmsd: '\u2221',
	angmsdaa: '\u29A8',
	angmsdab: '\u29A9',
	angmsdac: '\u29AA',
	angmsdad: '\u29AB',
	angmsdae: '\u29AC',
	angmsdaf: '\u29AD',
	angmsdag: '\u29AE',
	angmsdah: '\u29AF',
	angrt: '\u221F',
	angrtvb: '\u22BE',
	angrtvbd: '\u299D',
	angsph: '\u2222',
	angst: '\u00C5',
	angzarr: '\u237C',
	Aogon: '\u0104',
	aogon: '\u0105',
	Aopf: '\uD835\uDD38',
	aopf: '\uD835\uDD52',
	ap: '\u2248',
	apacir: '\u2A6F',
	apE: '\u2A70',
	ape: '\u224A',
	apid: '\u224B',
	apos: '\u0027',
	ApplyFunction: '\u2061',
	approx: '\u2248',
	approxeq: '\u224A',
	Aring: '\u00C5',
	aring: '\u00E5',
	Ascr: '\uD835\uDC9C',
	ascr: '\uD835\uDCB6',
	Assign: '\u2254',
	ast: '\u002A',
	asymp: '\u2248',
	asympeq: '\u224D',
	Atilde: '\u00C3',
	atilde: '\u00E3',
	Auml: '\u00C4',
	auml: '\u00E4',
	awconint: '\u2233',
	awint: '\u2A11',
	backcong: '\u224C',
	backepsilon: '\u03F6',
	backprime: '\u2035',
	backsim: '\u223D',
	backsimeq: '\u22CD',
	Backslash: '\u2216',
	Barv: '\u2AE7',
	barvee: '\u22BD',
	Barwed: '\u2306',
	barwed: '\u2305',
	barwedge: '\u2305',
	bbrk: '\u23B5',
	bbrktbrk: '\u23B6',
	bcong: '\u224C',
	Bcy: '\u0411',
	bcy: '\u0431',
	bdquo: '\u201E',
	becaus: '\u2235',
	Because: '\u2235',
	because: '\u2235',
	bemptyv: '\u29B0',
	bepsi: '\u03F6',
	bernou: '\u212C',
	Bernoullis: '\u212C',
	Beta: '\u0392',
	beta: '\u03B2',
	beth: '\u2136',
	between: '\u226C',
	Bfr: '\uD835\uDD05',
	bfr: '\uD835\uDD1F',
	bigcap: '\u22C2',
	bigcirc: '\u25EF',
	bigcup: '\u22C3',
	bigodot: '\u2A00',
	bigoplus: '\u2A01',
	bigotimes: '\u2A02',
	bigsqcup: '\u2A06',
	bigstar: '\u2605',
	bigtriangledown: '\u25BD',
	bigtriangleup: '\u25B3',
	biguplus: '\u2A04',
	bigvee: '\u22C1',
	bigwedge: '\u22C0',
	bkarow: '\u290D',
	blacklozenge: '\u29EB',
	blacksquare: '\u25AA',
	blacktriangle: '\u25B4',
	blacktriangledown: '\u25BE',
	blacktriangleleft: '\u25C2',
	blacktriangleright: '\u25B8',
	blank: '\u2423',
	blk12: '\u2592',
	blk14: '\u2591',
	blk34: '\u2593',
	block: '\u2588',
	bne: '\u003D\u20E5',
	bnequiv: '\u2261\u20E5',
	bNot: '\u2AED',
	bnot: '\u2310',
	Bopf: '\uD835\uDD39',
	bopf: '\uD835\uDD53',
	bot: '\u22A5',
	bottom: '\u22A5',
	bowtie: '\u22C8',
	boxbox: '\u29C9',
	boxDL: '\u2557',
	boxDl: '\u2556',
	boxdL: '\u2555',
	boxdl: '\u2510',
	boxDR: '\u2554',
	boxDr: '\u2553',
	boxdR: '\u2552',
	boxdr: '\u250C',
	boxH: '\u2550',
	boxh: '\u2500',
	boxHD: '\u2566',
	boxHd: '\u2564',
	boxhD: '\u2565',
	boxhd: '\u252C',
	boxHU: '\u2569',
	boxHu: '\u2567',
	boxhU: '\u2568',
	boxhu: '\u2534',
	boxminus: '\u229F',
	boxplus: '\u229E',
	boxtimes: '\u22A0',
	boxUL: '\u255D',
	boxUl: '\u255C',
	boxuL: '\u255B',
	boxul: '\u2518',
	boxUR: '\u255A',
	boxUr: '\u2559',
	boxuR: '\u2558',
	boxur: '\u2514',
	boxV: '\u2551',
	boxv: '\u2502',
	boxVH: '\u256C',
	boxVh: '\u256B',
	boxvH: '\u256A',
	boxvh: '\u253C',
	boxVL: '\u2563',
	boxVl: '\u2562',
	boxvL: '\u2561',
	boxvl: '\u2524',
	boxVR: '\u2560',
	boxVr: '\u255F',
	boxvR: '\u255E',
	boxvr: '\u251C',
	bprime: '\u2035',
	Breve: '\u02D8',
	breve: '\u02D8',
	brvbar: '\u00A6',
	Bscr: '\u212C',
	bscr: '\uD835\uDCB7',
	bsemi: '\u204F',
	bsim: '\u223D',
	bsime: '\u22CD',
	bsol: '\u005C',
	bsolb: '\u29C5',
	bsolhsub: '\u27C8',
	bull: '\u2022',
	bullet: '\u2022',
	bump: '\u224E',
	bumpE: '\u2AAE',
	bumpe: '\u224F',
	Bumpeq: '\u224E',
	bumpeq: '\u224F',
	Cacute: '\u0106',
	cacute: '\u0107',
	Cap: '\u22D2',
	cap: '\u2229',
	capand: '\u2A44',
	capbrcup: '\u2A49',
	capcap: '\u2A4B',
	capcup: '\u2A47',
	capdot: '\u2A40',
	CapitalDifferentialD: '\u2145',
	caps: '\u2229\uFE00',
	caret: '\u2041',
	caron: '\u02C7',
	Cayleys: '\u212D',
	ccaps: '\u2A4D',
	Ccaron: '\u010C',
	ccaron: '\u010D',
	Ccedil: '\u00C7',
	ccedil: '\u00E7',
	Ccirc: '\u0108',
	ccirc: '\u0109',
	Cconint: '\u2230',
	ccups: '\u2A4C',
	ccupssm: '\u2A50',
	Cdot: '\u010A',
	cdot: '\u010B',
	cedil: '\u00B8',
	Cedilla: '\u00B8',
	cemptyv: '\u29B2',
	cent: '\u00A2',
	CenterDot: '\u00B7',
	centerdot: '\u00B7',
	Cfr: '\u212D',
	cfr: '\uD835\uDD20',
	CHcy: '\u0427',
	chcy: '\u0447',
	check: '\u2713',
	checkmark: '\u2713',
	Chi: '\u03A7',
	chi: '\u03C7',
	cir: '\u25CB',
	circ: '\u02C6',
	circeq: '\u2257',
	circlearrowleft: '\u21BA',
	circlearrowright: '\u21BB',
	circledast: '\u229B',
	circledcirc: '\u229A',
	circleddash: '\u229D',
	CircleDot: '\u2299',
	circledR: '\u00AE',
	circledS: '\u24C8',
	CircleMinus: '\u2296',
	CirclePlus: '\u2295',
	CircleTimes: '\u2297',
	cirE: '\u29C3',
	cire: '\u2257',
	cirfnint: '\u2A10',
	cirmid: '\u2AEF',
	cirscir: '\u29C2',
	ClockwiseContourIntegral: '\u2232',
	CloseCurlyDoubleQuote: '\u201D',
	CloseCurlyQuote: '\u2019',
	clubs: '\u2663',
	clubsuit: '\u2663',
	Colon: '\u2237',
	colon: '\u003A',
	Colone: '\u2A74',
	colone: '\u2254',
	coloneq: '\u2254',
	comma: '\u002C',
	commat: '\u0040',
	comp: '\u2201',
	compfn: '\u2218',
	complement: '\u2201',
	complexes: '\u2102',
	cong: '\u2245',
	congdot: '\u2A6D',
	Congruent: '\u2261',
	Conint: '\u222F',
	conint: '\u222E',
	ContourIntegral: '\u222E',
	Copf: '\u2102',
	copf: '\uD835\uDD54',
	coprod: '\u2210',
	Coproduct: '\u2210',
	COPY: '\u00A9',
	copy: '\u00A9',
	copysr: '\u2117',
	CounterClockwiseContourIntegral: '\u2233',
	crarr: '\u21B5',
	Cross: '\u2A2F',
	cross: '\u2717',
	Cscr: '\uD835\uDC9E',
	cscr: '\uD835\uDCB8',
	csub: '\u2ACF',
	csube: '\u2AD1',
	csup: '\u2AD0',
	csupe: '\u2AD2',
	ctdot: '\u22EF',
	cudarrl: '\u2938',
	cudarrr: '\u2935',
	cuepr: '\u22DE',
	cuesc: '\u22DF',
	cularr: '\u21B6',
	cularrp: '\u293D',
	Cup: '\u22D3',
	cup: '\u222A',
	cupbrcap: '\u2A48',
	CupCap: '\u224D',
	cupcap: '\u2A46',
	cupcup: '\u2A4A',
	cupdot: '\u228D',
	cupor: '\u2A45',
	cups: '\u222A\uFE00',
	curarr: '\u21B7',
	curarrm: '\u293C',
	curlyeqprec: '\u22DE',
	curlyeqsucc: '\u22DF',
	curlyvee: '\u22CE',
	curlywedge: '\u22CF',
	curren: '\u00A4',
	curvearrowleft: '\u21B6',
	curvearrowright: '\u21B7',
	cuvee: '\u22CE',
	cuwed: '\u22CF',
	cwconint: '\u2232',
	cwint: '\u2231',
	cylcty: '\u232D',
	Dagger: '\u2021',
	dagger: '\u2020',
	daleth: '\u2138',
	Darr: '\u21A1',
	dArr: '\u21D3',
	darr: '\u2193',
	dash: '\u2010',
	Dashv: '\u2AE4',
	dashv: '\u22A3',
	dbkarow: '\u290F',
	dblac: '\u02DD',
	Dcaron: '\u010E',
	dcaron: '\u010F',
	Dcy: '\u0414',
	dcy: '\u0434',
	DD: '\u2145',
	dd: '\u2146',
	ddagger: '\u2021',
	ddarr: '\u21CA',
	DDotrahd: '\u2911',
	ddotseq: '\u2A77',
	deg: '\u00B0',
	Del: '\u2207',
	Delta: '\u0394',
	delta: '\u03B4',
	demptyv: '\u29B1',
	dfisht: '\u297F',
	Dfr: '\uD835\uDD07',
	dfr: '\uD835\uDD21',
	dHar: '\u2965',
	dharl: '\u21C3',
	dharr: '\u21C2',
	DiacriticalAcute: '\u00B4',
	DiacriticalDot: '\u02D9',
	DiacriticalDoubleAcute: '\u02DD',
	DiacriticalGrave: '\u0060',
	DiacriticalTilde: '\u02DC',
	diam: '\u22C4',
	Diamond: '\u22C4',
	diamond: '\u22C4',
	diamondsuit: '\u2666',
	diams: '\u2666',
	die: '\u00A8',
	DifferentialD: '\u2146',
	digamma: '\u03DD',
	disin: '\u22F2',
	div: '\u00F7',
	divide: '\u00F7',
	divideontimes: '\u22C7',
	divonx: '\u22C7',
	DJcy: '\u0402',
	djcy: '\u0452',
	dlcorn: '\u231E',
	dlcrop: '\u230D',
	dollar: '\u0024',
	Dopf: '\uD835\uDD3B',
	dopf: '\uD835\uDD55',
	Dot: '\u00A8',
	dot: '\u02D9',
	DotDot: '\u20DC',
	doteq: '\u2250',
	doteqdot: '\u2251',
	DotEqual: '\u2250',
	dotminus: '\u2238',
	dotplus: '\u2214',
	dotsquare: '\u22A1',
	doublebarwedge: '\u2306',
	DoubleContourIntegral: '\u222F',
	DoubleDot: '\u00A8',
	DoubleDownArrow: '\u21D3',
	DoubleLeftArrow: '\u21D0',
	DoubleLeftRightArrow: '\u21D4',
	DoubleLeftTee: '\u2AE4',
	DoubleLongLeftArrow: '\u27F8',
	DoubleLongLeftRightArrow: '\u27FA',
	DoubleLongRightArrow: '\u27F9',
	DoubleRightArrow: '\u21D2',
	DoubleRightTee: '\u22A8',
	DoubleUpArrow: '\u21D1',
	DoubleUpDownArrow: '\u21D5',
	DoubleVerticalBar: '\u2225',
	DownArrow: '\u2193',
	Downarrow: '\u21D3',
	downarrow: '\u2193',
	DownArrowBar: '\u2913',
	DownArrowUpArrow: '\u21F5',
	DownBreve: '\u0311',
	downdownarrows: '\u21CA',
	downharpoonleft: '\u21C3',
	downharpoonright: '\u21C2',
	DownLeftRightVector: '\u2950',
	DownLeftTeeVector: '\u295E',
	DownLeftVector: '\u21BD',
	DownLeftVectorBar: '\u2956',
	DownRightTeeVector: '\u295F',
	DownRightVector: '\u21C1',
	DownRightVectorBar: '\u2957',
	DownTee: '\u22A4',
	DownTeeArrow: '\u21A7',
	drbkarow: '\u2910',
	drcorn: '\u231F',
	drcrop: '\u230C',
	Dscr: '\uD835\uDC9F',
	dscr: '\uD835\uDCB9',
	DScy: '\u0405',
	dscy: '\u0455',
	dsol: '\u29F6',
	Dstrok: '\u0110',
	dstrok: '\u0111',
	dtdot: '\u22F1',
	dtri: '\u25BF',
	dtrif: '\u25BE',
	duarr: '\u21F5',
	duhar: '\u296F',
	dwangle: '\u29A6',
	DZcy: '\u040F',
	dzcy: '\u045F',
	dzigrarr: '\u27FF',
	Eacute: '\u00C9',
	eacute: '\u00E9',
	easter: '\u2A6E',
	Ecaron: '\u011A',
	ecaron: '\u011B',
	ecir: '\u2256',
	Ecirc: '\u00CA',
	ecirc: '\u00EA',
	ecolon: '\u2255',
	Ecy: '\u042D',
	ecy: '\u044D',
	eDDot: '\u2A77',
	Edot: '\u0116',
	eDot: '\u2251',
	edot: '\u0117',
	ee: '\u2147',
	efDot: '\u2252',
	Efr: '\uD835\uDD08',
	efr: '\uD835\uDD22',
	eg: '\u2A9A',
	Egrave: '\u00C8',
	egrave: '\u00E8',
	egs: '\u2A96',
	egsdot: '\u2A98',
	el: '\u2A99',
	Element: '\u2208',
	elinters: '\u23E7',
	ell: '\u2113',
	els: '\u2A95',
	elsdot: '\u2A97',
	Emacr: '\u0112',
	emacr: '\u0113',
	empty: '\u2205',
	emptyset: '\u2205',
	EmptySmallSquare: '\u25FB',
	emptyv: '\u2205',
	EmptyVerySmallSquare: '\u25AB',
	emsp: '\u2003',
	emsp13: '\u2004',
	emsp14: '\u2005',
	ENG: '\u014A',
	eng: '\u014B',
	ensp: '\u2002',
	Eogon: '\u0118',
	eogon: '\u0119',
	Eopf: '\uD835\uDD3C',
	eopf: '\uD835\uDD56',
	epar: '\u22D5',
	eparsl: '\u29E3',
	eplus: '\u2A71',
	epsi: '\u03B5',
	Epsilon: '\u0395',
	epsilon: '\u03B5',
	epsiv: '\u03F5',
	eqcirc: '\u2256',
	eqcolon: '\u2255',
	eqsim: '\u2242',
	eqslantgtr: '\u2A96',
	eqslantless: '\u2A95',
	Equal: '\u2A75',
	equals: '\u003D',
	EqualTilde: '\u2242',
	equest: '\u225F',
	Equilibrium: '\u21CC',
	equiv: '\u2261',
	equivDD: '\u2A78',
	eqvparsl: '\u29E5',
	erarr: '\u2971',
	erDot: '\u2253',
	Escr: '\u2130',
	escr: '\u212F',
	esdot: '\u2250',
	Esim: '\u2A73',
	esim: '\u2242',
	Eta: '\u0397',
	eta: '\u03B7',
	ETH: '\u00D0',
	eth: '\u00F0',
	Euml: '\u00CB',
	euml: '\u00EB',
	euro: '\u20AC',
	excl: '\u0021',
	exist: '\u2203',
	Exists: '\u2203',
	expectation: '\u2130',
	ExponentialE: '\u2147',
	exponentiale: '\u2147',
	fallingdotseq: '\u2252',
	Fcy: '\u0424',
	fcy: '\u0444',
	female: '\u2640',
	ffilig: '\uFB03',
	fflig: '\uFB00',
	ffllig: '\uFB04',
	Ffr: '\uD835\uDD09',
	ffr: '\uD835\uDD23',
	filig: '\uFB01',
	FilledSmallSquare: '\u25FC',
	FilledVerySmallSquare: '\u25AA',
	fjlig: '\u0066\u006A',
	flat: '\u266D',
	fllig: '\uFB02',
	fltns: '\u25B1',
	fnof: '\u0192',
	Fopf: '\uD835\uDD3D',
	fopf: '\uD835\uDD57',
	ForAll: '\u2200',
	forall: '\u2200',
	fork: '\u22D4',
	forkv: '\u2AD9',
	Fouriertrf: '\u2131',
	fpartint: '\u2A0D',
	frac12: '\u00BD',
	frac13: '\u2153',
	frac14: '\u00BC',
	frac15: '\u2155',
	frac16: '\u2159',
	frac18: '\u215B',
	frac23: '\u2154',
	frac25: '\u2156',
	frac34: '\u00BE',
	frac35: '\u2157',
	frac38: '\u215C',
	frac45: '\u2158',
	frac56: '\u215A',
	frac58: '\u215D',
	frac78: '\u215E',
	frasl: '\u2044',
	frown: '\u2322',
	Fscr: '\u2131',
	fscr: '\uD835\uDCBB',
	gacute: '\u01F5',
	Gamma: '\u0393',
	gamma: '\u03B3',
	Gammad: '\u03DC',
	gammad: '\u03DD',
	gap: '\u2A86',
	Gbreve: '\u011E',
	gbreve: '\u011F',
	Gcedil: '\u0122',
	Gcirc: '\u011C',
	gcirc: '\u011D',
	Gcy: '\u0413',
	gcy: '\u0433',
	Gdot: '\u0120',
	gdot: '\u0121',
	gE: '\u2267',
	ge: '\u2265',
	gEl: '\u2A8C',
	gel: '\u22DB',
	geq: '\u2265',
	geqq: '\u2267',
	geqslant: '\u2A7E',
	ges: '\u2A7E',
	gescc: '\u2AA9',
	gesdot: '\u2A80',
	gesdoto: '\u2A82',
	gesdotol: '\u2A84',
	gesl: '\u22DB\uFE00',
	gesles: '\u2A94',
	Gfr: '\uD835\uDD0A',
	gfr: '\uD835\uDD24',
	Gg: '\u22D9',
	gg: '\u226B',
	ggg: '\u22D9',
	gimel: '\u2137',
	GJcy: '\u0403',
	gjcy: '\u0453',
	gl: '\u2277',
	gla: '\u2AA5',
	glE: '\u2A92',
	glj: '\u2AA4',
	gnap: '\u2A8A',
	gnapprox: '\u2A8A',
	gnE: '\u2269',
	gne: '\u2A88',
	gneq: '\u2A88',
	gneqq: '\u2269',
	gnsim: '\u22E7',
	Gopf: '\uD835\uDD3E',
	gopf: '\uD835\uDD58',
	grave: '\u0060',
	GreaterEqual: '\u2265',
	GreaterEqualLess: '\u22DB',
	GreaterFullEqual: '\u2267',
	GreaterGreater: '\u2AA2',
	GreaterLess: '\u2277',
	GreaterSlantEqual: '\u2A7E',
	GreaterTilde: '\u2273',
	Gscr: '\uD835\uDCA2',
	gscr: '\u210A',
	gsim: '\u2273',
	gsime: '\u2A8E',
	gsiml: '\u2A90',
	Gt: '\u226B',
	GT: '\u003E',
	gt: '\u003E',
	gtcc: '\u2AA7',
	gtcir: '\u2A7A',
	gtdot: '\u22D7',
	gtlPar: '\u2995',
	gtquest: '\u2A7C',
	gtrapprox: '\u2A86',
	gtrarr: '\u2978',
	gtrdot: '\u22D7',
	gtreqless: '\u22DB',
	gtreqqless: '\u2A8C',
	gtrless: '\u2277',
	gtrsim: '\u2273',
	gvertneqq: '\u2269\uFE00',
	gvnE: '\u2269\uFE00',
	Hacek: '\u02C7',
	hairsp: '\u200A',
	half: '\u00BD',
	hamilt: '\u210B',
	HARDcy: '\u042A',
	hardcy: '\u044A',
	hArr: '\u21D4',
	harr: '\u2194',
	harrcir: '\u2948',
	harrw: '\u21AD',
	Hat: '\u005E',
	hbar: '\u210F',
	Hcirc: '\u0124',
	hcirc: '\u0125',
	hearts: '\u2665',
	heartsuit: '\u2665',
	hellip: '\u2026',
	hercon: '\u22B9',
	Hfr: '\u210C',
	hfr: '\uD835\uDD25',
	HilbertSpace: '\u210B',
	hksearow: '\u2925',
	hkswarow: '\u2926',
	hoarr: '\u21FF',
	homtht: '\u223B',
	hookleftarrow: '\u21A9',
	hookrightarrow: '\u21AA',
	Hopf: '\u210D',
	hopf: '\uD835\uDD59',
	horbar: '\u2015',
	HorizontalLine: '\u2500',
	Hscr: '\u210B',
	hscr: '\uD835\uDCBD',
	hslash: '\u210F',
	Hstrok: '\u0126',
	hstrok: '\u0127',
	HumpDownHump: '\u224E',
	HumpEqual: '\u224F',
	hybull: '\u2043',
	hyphen: '\u2010',
	Iacute: '\u00CD',
	iacute: '\u00ED',
	ic: '\u2063',
	Icirc: '\u00CE',
	icirc: '\u00EE',
	Icy: '\u0418',
	icy: '\u0438',
	Idot: '\u0130',
	IEcy: '\u0415',
	iecy: '\u0435',
	iexcl: '\u00A1',
	iff: '\u21D4',
	Ifr: '\u2111',
	ifr: '\uD835\uDD26',
	Igrave: '\u00CC',
	igrave: '\u00EC',
	ii: '\u2148',
	iiiint: '\u2A0C',
	iiint: '\u222D',
	iinfin: '\u29DC',
	iiota: '\u2129',
	IJlig: '\u0132',
	ijlig: '\u0133',
	Im: '\u2111',
	Imacr: '\u012A',
	imacr: '\u012B',
	image: '\u2111',
	ImaginaryI: '\u2148',
	imagline: '\u2110',
	imagpart: '\u2111',
	imath: '\u0131',
	imof: '\u22B7',
	imped: '\u01B5',
	Implies: '\u21D2',
	in: '\u2208',
	incare: '\u2105',
	infin: '\u221E',
	infintie: '\u29DD',
	inodot: '\u0131',
	Int: '\u222C',
	int: '\u222B',
	intcal: '\u22BA',
	integers: '\u2124',
	Integral: '\u222B',
	intercal: '\u22BA',
	Intersection: '\u22C2',
	intlarhk: '\u2A17',
	intprod: '\u2A3C',
	InvisibleComma: '\u2063',
	InvisibleTimes: '\u2062',
	IOcy: '\u0401',
	iocy: '\u0451',
	Iogon: '\u012E',
	iogon: '\u012F',
	Iopf: '\uD835\uDD40',
	iopf: '\uD835\uDD5A',
	Iota: '\u0399',
	iota: '\u03B9',
	iprod: '\u2A3C',
	iquest: '\u00BF',
	Iscr: '\u2110',
	iscr: '\uD835\uDCBE',
	isin: '\u2208',
	isindot: '\u22F5',
	isinE: '\u22F9',
	isins: '\u22F4',
	isinsv: '\u22F3',
	isinv: '\u2208',
	it: '\u2062',
	Itilde: '\u0128',
	itilde: '\u0129',
	Iukcy: '\u0406',
	iukcy: '\u0456',
	Iuml: '\u00CF',
	iuml: '\u00EF',
	Jcirc: '\u0134',
	jcirc: '\u0135',
	Jcy: '\u0419',
	jcy: '\u0439',
	Jfr: '\uD835\uDD0D',
	jfr: '\uD835\uDD27',
	jmath: '\u0237',
	Jopf: '\uD835\uDD41',
	jopf: '\uD835\uDD5B',
	Jscr: '\uD835\uDCA5',
	jscr: '\uD835\uDCBF',
	Jsercy: '\u0408',
	jsercy: '\u0458',
	Jukcy: '\u0404',
	jukcy: '\u0454',
	Kappa: '\u039A',
	kappa: '\u03BA',
	kappav: '\u03F0',
	Kcedil: '\u0136',
	kcedil: '\u0137',
	Kcy: '\u041A',
	kcy: '\u043A',
	Kfr: '\uD835\uDD0E',
	kfr: '\uD835\uDD28',
	kgreen: '\u0138',
	KHcy: '\u0425',
	khcy: '\u0445',
	KJcy: '\u040C',
	kjcy: '\u045C',
	Kopf: '\uD835\uDD42',
	kopf: '\uD835\uDD5C',
	Kscr: '\uD835\uDCA6',
	kscr: '\uD835\uDCC0',
	lAarr: '\u21DA',
	Lacute: '\u0139',
	lacute: '\u013A',
	laemptyv: '\u29B4',
	lagran: '\u2112',
	Lambda: '\u039B',
	lambda: '\u03BB',
	Lang: '\u27EA',
	lang: '\u27E8',
	langd: '\u2991',
	langle: '\u27E8',
	lap: '\u2A85',
	Laplacetrf: '\u2112',
	laquo: '\u00AB',
	Larr: '\u219E',
	lArr: '\u21D0',
	larr: '\u2190',
	larrb: '\u21E4',
	larrbfs: '\u291F',
	larrfs: '\u291D',
	larrhk: '\u21A9',
	larrlp: '\u21AB',
	larrpl: '\u2939',
	larrsim: '\u2973',
	larrtl: '\u21A2',
	lat: '\u2AAB',
	lAtail: '\u291B',
	latail: '\u2919',
	late: '\u2AAD',
	lates: '\u2AAD\uFE00',
	lBarr: '\u290E',
	lbarr: '\u290C',
	lbbrk: '\u2772',
	lbrace: '\u007B',
	lbrack: '\u005B',
	lbrke: '\u298B',
	lbrksld: '\u298F',
	lbrkslu: '\u298D',
	Lcaron: '\u013D',
	lcaron: '\u013E',
	Lcedil: '\u013B',
	lcedil: '\u013C',
	lceil: '\u2308',
	lcub: '\u007B',
	Lcy: '\u041B',
	lcy: '\u043B',
	ldca: '\u2936',
	ldquo: '\u201C',
	ldquor: '\u201E',
	ldrdhar: '\u2967',
	ldrushar: '\u294B',
	ldsh: '\u21B2',
	lE: '\u2266',
	le: '\u2264',
	LeftAngleBracket: '\u27E8',
	LeftArrow: '\u2190',
	Leftarrow: '\u21D0',
	leftarrow: '\u2190',
	LeftArrowBar: '\u21E4',
	LeftArrowRightArrow: '\u21C6',
	leftarrowtail: '\u21A2',
	LeftCeiling: '\u2308',
	LeftDoubleBracket: '\u27E6',
	LeftDownTeeVector: '\u2961',
	LeftDownVector: '\u21C3',
	LeftDownVectorBar: '\u2959',
	LeftFloor: '\u230A',
	leftharpoondown: '\u21BD',
	leftharpoonup: '\u21BC',
	leftleftarrows: '\u21C7',
	LeftRightArrow: '\u2194',
	Leftrightarrow: '\u21D4',
	leftrightarrow: '\u2194',
	leftrightarrows: '\u21C6',
	leftrightharpoons: '\u21CB',
	leftrightsquigarrow: '\u21AD',
	LeftRightVector: '\u294E',
	LeftTee: '\u22A3',
	LeftTeeArrow: '\u21A4',
	LeftTeeVector: '\u295A',
	leftthreetimes: '\u22CB',
	LeftTriangle: '\u22B2',
	LeftTriangleBar: '\u29CF',
	LeftTriangleEqual: '\u22B4',
	LeftUpDownVector: '\u2951',
	LeftUpTeeVector: '\u2960',
	LeftUpVector: '\u21BF',
	LeftUpVectorBar: '\u2958',
	LeftVector: '\u21BC',
	LeftVectorBar: '\u2952',
	lEg: '\u2A8B',
	leg: '\u22DA',
	leq: '\u2264',
	leqq: '\u2266',
	leqslant: '\u2A7D',
	les: '\u2A7D',
	lescc: '\u2AA8',
	lesdot: '\u2A7F',
	lesdoto: '\u2A81',
	lesdotor: '\u2A83',
	lesg: '\u22DA\uFE00',
	lesges: '\u2A93',
	lessapprox: '\u2A85',
	lessdot: '\u22D6',
	lesseqgtr: '\u22DA',
	lesseqqgtr: '\u2A8B',
	LessEqualGreater: '\u22DA',
	LessFullEqual: '\u2266',
	LessGreater: '\u2276',
	lessgtr: '\u2276',
	LessLess: '\u2AA1',
	lesssim: '\u2272',
	LessSlantEqual: '\u2A7D',
	LessTilde: '\u2272',
	lfisht: '\u297C',
	lfloor: '\u230A',
	Lfr: '\uD835\uDD0F',
	lfr: '\uD835\uDD29',
	lg: '\u2276',
	lgE: '\u2A91',
	lHar: '\u2962',
	lhard: '\u21BD',
	lharu: '\u21BC',
	lharul: '\u296A',
	lhblk: '\u2584',
	LJcy: '\u0409',
	ljcy: '\u0459',
	Ll: '\u22D8',
	ll: '\u226A',
	llarr: '\u21C7',
	llcorner: '\u231E',
	Lleftarrow: '\u21DA',
	llhard: '\u296B',
	lltri: '\u25FA',
	Lmidot: '\u013F',
	lmidot: '\u0140',
	lmoust: '\u23B0',
	lmoustache: '\u23B0',
	lnap: '\u2A89',
	lnapprox: '\u2A89',
	lnE: '\u2268',
	lne: '\u2A87',
	lneq: '\u2A87',
	lneqq: '\u2268',
	lnsim: '\u22E6',
	loang: '\u27EC',
	loarr: '\u21FD',
	lobrk: '\u27E6',
	LongLeftArrow: '\u27F5',
	Longleftarrow: '\u27F8',
	longleftarrow: '\u27F5',
	LongLeftRightArrow: '\u27F7',
	Longleftrightarrow: '\u27FA',
	longleftrightarrow: '\u27F7',
	longmapsto: '\u27FC',
	LongRightArrow: '\u27F6',
	Longrightarrow: '\u27F9',
	longrightarrow: '\u27F6',
	looparrowleft: '\u21AB',
	looparrowright: '\u21AC',
	lopar: '\u2985',
	Lopf: '\uD835\uDD43',
	lopf: '\uD835\uDD5D',
	loplus: '\u2A2D',
	lotimes: '\u2A34',
	lowast: '\u2217',
	lowbar: '\u005F',
	LowerLeftArrow: '\u2199',
	LowerRightArrow: '\u2198',
	loz: '\u25CA',
	lozenge: '\u25CA',
	lozf: '\u29EB',
	lpar: '\u0028',
	lparlt: '\u2993',
	lrarr: '\u21C6',
	lrcorner: '\u231F',
	lrhar: '\u21CB',
	lrhard: '\u296D',
	lrm: '\u200E',
	lrtri: '\u22BF',
	lsaquo: '\u2039',
	Lscr: '\u2112',
	lscr: '\uD835\uDCC1',
	Lsh: '\u21B0',
	lsh: '\u21B0',
	lsim: '\u2272',
	lsime: '\u2A8D',
	lsimg: '\u2A8F',
	lsqb: '\u005B',
	lsquo: '\u2018',
	lsquor: '\u201A',
	Lstrok: '\u0141',
	lstrok: '\u0142',
	Lt: '\u226A',
	LT: '\u003C',
	lt: '\u003C',
	ltcc: '\u2AA6',
	ltcir: '\u2A79',
	ltdot: '\u22D6',
	lthree: '\u22CB',
	ltimes: '\u22C9',
	ltlarr: '\u2976',
	ltquest: '\u2A7B',
	ltri: '\u25C3',
	ltrie: '\u22B4',
	ltrif: '\u25C2',
	ltrPar: '\u2996',
	lurdshar: '\u294A',
	luruhar: '\u2966',
	lvertneqq: '\u2268\uFE00',
	lvnE: '\u2268\uFE00',
	macr: '\u00AF',
	male: '\u2642',
	malt: '\u2720',
	maltese: '\u2720',
	Map: '\u2905',
	map: '\u21A6',
	mapsto: '\u21A6',
	mapstodown: '\u21A7',
	mapstoleft: '\u21A4',
	mapstoup: '\u21A5',
	marker: '\u25AE',
	mcomma: '\u2A29',
	Mcy: '\u041C',
	mcy: '\u043C',
	mdash: '\u2014',
	mDDot: '\u223A',
	measuredangle: '\u2221',
	MediumSpace: '\u205F',
	Mellintrf: '\u2133',
	Mfr: '\uD835\uDD10',
	mfr: '\uD835\uDD2A',
	mho: '\u2127',
	micro: '\u00B5',
	mid: '\u2223',
	midast: '\u002A',
	midcir: '\u2AF0',
	middot: '\u00B7',
	minus: '\u2212',
	minusb: '\u229F',
	minusd: '\u2238',
	minusdu: '\u2A2A',
	MinusPlus: '\u2213',
	mlcp: '\u2ADB',
	mldr: '\u2026',
	mnplus: '\u2213',
	models: '\u22A7',
	Mopf: '\uD835\uDD44',
	mopf: '\uD835\uDD5E',
	mp: '\u2213',
	Mscr: '\u2133',
	mscr: '\uD835\uDCC2',
	mstpos: '\u223E',
	Mu: '\u039C',
	mu: '\u03BC',
	multimap: '\u22B8',
	mumap: '\u22B8',
	nabla: '\u2207',
	Nacute: '\u0143',
	nacute: '\u0144',
	nang: '\u2220\u20D2',
	nap: '\u2249',
	napE: '\u2A70\u0338',
	napid: '\u224B\u0338',
	napos: '\u0149',
	napprox: '\u2249',
	natur: '\u266E',
	natural: '\u266E',
	naturals: '\u2115',
	nbsp: '\u00A0',
	nbump: '\u224E\u0338',
	nbumpe: '\u224F\u0338',
	ncap: '\u2A43',
	Ncaron: '\u0147',
	ncaron: '\u0148',
	Ncedil: '\u0145',
	ncedil: '\u0146',
	ncong: '\u2247',
	ncongdot: '\u2A6D\u0338',
	ncup: '\u2A42',
	Ncy: '\u041D',
	ncy: '\u043D',
	ndash: '\u2013',
	ne: '\u2260',
	nearhk: '\u2924',
	neArr: '\u21D7',
	nearr: '\u2197',
	nearrow: '\u2197',
	nedot: '\u2250\u0338',
	NegativeMediumSpace: '\u200B',
	NegativeThickSpace: '\u200B',
	NegativeThinSpace: '\u200B',
	NegativeVeryThinSpace: '\u200B',
	nequiv: '\u2262',
	nesear: '\u2928',
	nesim: '\u2242\u0338',
	NestedGreaterGreater: '\u226B',
	NestedLessLess: '\u226A',
	NewLine: '\u000A',
	nexist: '\u2204',
	nexists: '\u2204',
	Nfr: '\uD835\uDD11',
	nfr: '\uD835\uDD2B',
	ngE: '\u2267\u0338',
	nge: '\u2271',
	ngeq: '\u2271',
	ngeqq: '\u2267\u0338',
	ngeqslant: '\u2A7E\u0338',
	nges: '\u2A7E\u0338',
	nGg: '\u22D9\u0338',
	ngsim: '\u2275',
	nGt: '\u226B\u20D2',
	ngt: '\u226F',
	ngtr: '\u226F',
	nGtv: '\u226B\u0338',
	nhArr: '\u21CE',
	nharr: '\u21AE',
	nhpar: '\u2AF2',
	ni: '\u220B',
	nis: '\u22FC',
	nisd: '\u22FA',
	niv: '\u220B',
	NJcy: '\u040A',
	njcy: '\u045A',
	nlArr: '\u21CD',
	nlarr: '\u219A',
	nldr: '\u2025',
	nlE: '\u2266\u0338',
	nle: '\u2270',
	nLeftarrow: '\u21CD',
	nleftarrow: '\u219A',
	nLeftrightarrow: '\u21CE',
	nleftrightarrow: '\u21AE',
	nleq: '\u2270',
	nleqq: '\u2266\u0338',
	nleqslant: '\u2A7D\u0338',
	nles: '\u2A7D\u0338',
	nless: '\u226E',
	nLl: '\u22D8\u0338',
	nlsim: '\u2274',
	nLt: '\u226A\u20D2',
	nlt: '\u226E',
	nltri: '\u22EA',
	nltrie: '\u22EC',
	nLtv: '\u226A\u0338',
	nmid: '\u2224',
	NoBreak: '\u2060',
	NonBreakingSpace: '\u00A0',
	Nopf: '\u2115',
	nopf: '\uD835\uDD5F',
	Not: '\u2AEC',
	not: '\u00AC',
	NotCongruent: '\u2262',
	NotCupCap: '\u226D',
	NotDoubleVerticalBar: '\u2226',
	NotElement: '\u2209',
	NotEqual: '\u2260',
	NotEqualTilde: '\u2242\u0338',
	NotExists: '\u2204',
	NotGreater: '\u226F',
	NotGreaterEqual: '\u2271',
	NotGreaterFullEqual: '\u2267\u0338',
	NotGreaterGreater: '\u226B\u0338',
	NotGreaterLess: '\u2279',
	NotGreaterSlantEqual: '\u2A7E\u0338',
	NotGreaterTilde: '\u2275',
	NotHumpDownHump: '\u224E\u0338',
	NotHumpEqual: '\u224F\u0338',
	notin: '\u2209',
	notindot: '\u22F5\u0338',
	notinE: '\u22F9\u0338',
	notinva: '\u2209',
	notinvb: '\u22F7',
	notinvc: '\u22F6',
	NotLeftTriangle: '\u22EA',
	NotLeftTriangleBar: '\u29CF\u0338',
	NotLeftTriangleEqual: '\u22EC',
	NotLess: '\u226E',
	NotLessEqual: '\u2270',
	NotLessGreater: '\u2278',
	NotLessLess: '\u226A\u0338',
	NotLessSlantEqual: '\u2A7D\u0338',
	NotLessTilde: '\u2274',
	NotNestedGreaterGreater: '\u2AA2\u0338',
	NotNestedLessLess: '\u2AA1\u0338',
	notni: '\u220C',
	notniva: '\u220C',
	notnivb: '\u22FE',
	notnivc: '\u22FD',
	NotPrecedes: '\u2280',
	NotPrecedesEqual: '\u2AAF\u0338',
	NotPrecedesSlantEqual: '\u22E0',
	NotReverseElement: '\u220C',
	NotRightTriangle: '\u22EB',
	NotRightTriangleBar: '\u29D0\u0338',
	NotRightTriangleEqual: '\u22ED',
	NotSquareSubset: '\u228F\u0338',
	NotSquareSubsetEqual: '\u22E2',
	NotSquareSuperset: '\u2290\u0338',
	NotSquareSupersetEqual: '\u22E3',
	NotSubset: '\u2282\u20D2',
	NotSubsetEqual: '\u2288',
	NotSucceeds: '\u2281',
	NotSucceedsEqual: '\u2AB0\u0338',
	NotSucceedsSlantEqual: '\u22E1',
	NotSucceedsTilde: '\u227F\u0338',
	NotSuperset: '\u2283\u20D2',
	NotSupersetEqual: '\u2289',
	NotTilde: '\u2241',
	NotTildeEqual: '\u2244',
	NotTildeFullEqual: '\u2247',
	NotTildeTilde: '\u2249',
	NotVerticalBar: '\u2224',
	npar: '\u2226',
	nparallel: '\u2226',
	nparsl: '\u2AFD\u20E5',
	npart: '\u2202\u0338',
	npolint: '\u2A14',
	npr: '\u2280',
	nprcue: '\u22E0',
	npre: '\u2AAF\u0338',
	nprec: '\u2280',
	npreceq: '\u2AAF\u0338',
	nrArr: '\u21CF',
	nrarr: '\u219B',
	nrarrc: '\u2933\u0338',
	nrarrw: '\u219D\u0338',
	nRightarrow: '\u21CF',
	nrightarrow: '\u219B',
	nrtri: '\u22EB',
	nrtrie: '\u22ED',
	nsc: '\u2281',
	nsccue: '\u22E1',
	nsce: '\u2AB0\u0338',
	Nscr: '\uD835\uDCA9',
	nscr: '\uD835\uDCC3',
	nshortmid: '\u2224',
	nshortparallel: '\u2226',
	nsim: '\u2241',
	nsime: '\u2244',
	nsimeq: '\u2244',
	nsmid: '\u2224',
	nspar: '\u2226',
	nsqsube: '\u22E2',
	nsqsupe: '\u22E3',
	nsub: '\u2284',
	nsubE: '\u2AC5\u0338',
	nsube: '\u2288',
	nsubset: '\u2282\u20D2',
	nsubseteq: '\u2288',
	nsubseteqq: '\u2AC5\u0338',
	nsucc: '\u2281',
	nsucceq: '\u2AB0\u0338',
	nsup: '\u2285',
	nsupE: '\u2AC6\u0338',
	nsupe: '\u2289',
	nsupset: '\u2283\u20D2',
	nsupseteq: '\u2289',
	nsupseteqq: '\u2AC6\u0338',
	ntgl: '\u2279',
	Ntilde: '\u00D1',
	ntilde: '\u00F1',
	ntlg: '\u2278',
	ntriangleleft: '\u22EA',
	ntrianglelefteq: '\u22EC',
	ntriangleright: '\u22EB',
	ntrianglerighteq: '\u22ED',
	Nu: '\u039D',
	nu: '\u03BD',
	num: '\u0023',
	numero: '\u2116',
	numsp: '\u2007',
	nvap: '\u224D\u20D2',
	nVDash: '\u22AF',
	nVdash: '\u22AE',
	nvDash: '\u22AD',
	nvdash: '\u22AC',
	nvge: '\u2265\u20D2',
	nvgt: '\u003E\u20D2',
	nvHarr: '\u2904',
	nvinfin: '\u29DE',
	nvlArr: '\u2902',
	nvle: '\u2264\u20D2',
	nvlt: '\u003C\u20D2',
	nvltrie: '\u22B4\u20D2',
	nvrArr: '\u2903',
	nvrtrie: '\u22B5\u20D2',
	nvsim: '\u223C\u20D2',
	nwarhk: '\u2923',
	nwArr: '\u21D6',
	nwarr: '\u2196',
	nwarrow: '\u2196',
	nwnear: '\u2927',
	Oacute: '\u00D3',
	oacute: '\u00F3',
	oast: '\u229B',
	ocir: '\u229A',
	Ocirc: '\u00D4',
	ocirc: '\u00F4',
	Ocy: '\u041E',
	ocy: '\u043E',
	odash: '\u229D',
	Odblac: '\u0150',
	odblac: '\u0151',
	odiv: '\u2A38',
	odot: '\u2299',
	odsold: '\u29BC',
	OElig: '\u0152',
	oelig: '\u0153',
	ofcir: '\u29BF',
	Ofr: '\uD835\uDD12',
	ofr: '\uD835\uDD2C',
	ogon: '\u02DB',
	Ograve: '\u00D2',
	ograve: '\u00F2',
	ogt: '\u29C1',
	ohbar: '\u29B5',
	ohm: '\u03A9',
	oint: '\u222E',
	olarr: '\u21BA',
	olcir: '\u29BE',
	olcross: '\u29BB',
	oline: '\u203E',
	olt: '\u29C0',
	Omacr: '\u014C',
	omacr: '\u014D',
	Omega: '\u03A9',
	omega: '\u03C9',
	Omicron: '\u039F',
	omicron: '\u03BF',
	omid: '\u29B6',
	ominus: '\u2296',
	Oopf: '\uD835\uDD46',
	oopf: '\uD835\uDD60',
	opar: '\u29B7',
	OpenCurlyDoubleQuote: '\u201C',
	OpenCurlyQuote: '\u2018',
	operp: '\u29B9',
	oplus: '\u2295',
	Or: '\u2A54',
	or: '\u2228',
	orarr: '\u21BB',
	ord: '\u2A5D',
	order: '\u2134',
	orderof: '\u2134',
	ordf: '\u00AA',
	ordm: '\u00BA',
	origof: '\u22B6',
	oror: '\u2A56',
	orslope: '\u2A57',
	orv: '\u2A5B',
	oS: '\u24C8',
	Oscr: '\uD835\uDCAA',
	oscr: '\u2134',
	Oslash: '\u00D8',
	oslash: '\u00F8',
	osol: '\u2298',
	Otilde: '\u00D5',
	otilde: '\u00F5',
	Otimes: '\u2A37',
	otimes: '\u2297',
	otimesas: '\u2A36',
	Ouml: '\u00D6',
	ouml: '\u00F6',
	ovbar: '\u233D',
	OverBar: '\u203E',
	OverBrace: '\u23DE',
	OverBracket: '\u23B4',
	OverParenthesis: '\u23DC',
	par: '\u2225',
	para: '\u00B6',
	parallel: '\u2225',
	parsim: '\u2AF3',
	parsl: '\u2AFD',
	part: '\u2202',
	PartialD: '\u2202',
	Pcy: '\u041F',
	pcy: '\u043F',
	percnt: '\u0025',
	period: '\u002E',
	permil: '\u2030',
	perp: '\u22A5',
	pertenk: '\u2031',
	Pfr: '\uD835\uDD13',
	pfr: '\uD835\uDD2D',
	Phi: '\u03A6',
	phi: '\u03C6',
	phiv: '\u03D5',
	phmmat: '\u2133',
	phone: '\u260E',
	Pi: '\u03A0',
	pi: '\u03C0',
	pitchfork: '\u22D4',
	piv: '\u03D6',
	planck: '\u210F',
	planckh: '\u210E',
	plankv: '\u210F',
	plus: '\u002B',
	plusacir: '\u2A23',
	plusb: '\u229E',
	pluscir: '\u2A22',
	plusdo: '\u2214',
	plusdu: '\u2A25',
	pluse: '\u2A72',
	PlusMinus: '\u00B1',
	plusmn: '\u00B1',
	plussim: '\u2A26',
	plustwo: '\u2A27',
	pm: '\u00B1',
	Poincareplane: '\u210C',
	pointint: '\u2A15',
	Popf: '\u2119',
	popf: '\uD835\uDD61',
	pound: '\u00A3',
	Pr: '\u2ABB',
	pr: '\u227A',
	prap: '\u2AB7',
	prcue: '\u227C',
	prE: '\u2AB3',
	pre: '\u2AAF',
	prec: '\u227A',
	precapprox: '\u2AB7',
	preccurlyeq: '\u227C',
	Precedes: '\u227A',
	PrecedesEqual: '\u2AAF',
	PrecedesSlantEqual: '\u227C',
	PrecedesTilde: '\u227E',
	preceq: '\u2AAF',
	precnapprox: '\u2AB9',
	precneqq: '\u2AB5',
	precnsim: '\u22E8',
	precsim: '\u227E',
	Prime: '\u2033',
	prime: '\u2032',
	primes: '\u2119',
	prnap: '\u2AB9',
	prnE: '\u2AB5',
	prnsim: '\u22E8',
	prod: '\u220F',
	Product: '\u220F',
	profalar: '\u232E',
	profline: '\u2312',
	profsurf: '\u2313',
	prop: '\u221D',
	Proportion: '\u2237',
	Proportional: '\u221D',
	propto: '\u221D',
	prsim: '\u227E',
	prurel: '\u22B0',
	Pscr: '\uD835\uDCAB',
	pscr: '\uD835\uDCC5',
	Psi: '\u03A8',
	psi: '\u03C8',
	puncsp: '\u2008',
	Qfr: '\uD835\uDD14',
	qfr: '\uD835\uDD2E',
	qint: '\u2A0C',
	Qopf: '\u211A',
	qopf: '\uD835\uDD62',
	qprime: '\u2057',
	Qscr: '\uD835\uDCAC',
	qscr: '\uD835\uDCC6',
	quaternions: '\u210D',
	quatint: '\u2A16',
	quest: '\u003F',
	questeq: '\u225F',
	QUOT: '\u0022',
	quot: '\u0022',
	rAarr: '\u21DB',
	race: '\u223D\u0331',
	Racute: '\u0154',
	racute: '\u0155',
	radic: '\u221A',
	raemptyv: '\u29B3',
	Rang: '\u27EB',
	rang: '\u27E9',
	rangd: '\u2992',
	range: '\u29A5',
	rangle: '\u27E9',
	raquo: '\u00BB',
	Rarr: '\u21A0',
	rArr: '\u21D2',
	rarr: '\u2192',
	rarrap: '\u2975',
	rarrb: '\u21E5',
	rarrbfs: '\u2920',
	rarrc: '\u2933',
	rarrfs: '\u291E',
	rarrhk: '\u21AA',
	rarrlp: '\u21AC',
	rarrpl: '\u2945',
	rarrsim: '\u2974',
	Rarrtl: '\u2916',
	rarrtl: '\u21A3',
	rarrw: '\u219D',
	rAtail: '\u291C',
	ratail: '\u291A',
	ratio: '\u2236',
	rationals: '\u211A',
	RBarr: '\u2910',
	rBarr: '\u290F',
	rbarr: '\u290D',
	rbbrk: '\u2773',
	rbrace: '\u007D',
	rbrack: '\u005D',
	rbrke: '\u298C',
	rbrksld: '\u298E',
	rbrkslu: '\u2990',
	Rcaron: '\u0158',
	rcaron: '\u0159',
	Rcedil: '\u0156',
	rcedil: '\u0157',
	rceil: '\u2309',
	rcub: '\u007D',
	Rcy: '\u0420',
	rcy: '\u0440',
	rdca: '\u2937',
	rdldhar: '\u2969',
	rdquo: '\u201D',
	rdquor: '\u201D',
	rdsh: '\u21B3',
	Re: '\u211C',
	real: '\u211C',
	realine: '\u211B',
	realpart: '\u211C',
	reals: '\u211D',
	rect: '\u25AD',
	REG: '\u00AE',
	reg: '\u00AE',
	ReverseElement: '\u220B',
	ReverseEquilibrium: '\u21CB',
	ReverseUpEquilibrium: '\u296F',
	rfisht: '\u297D',
	rfloor: '\u230B',
	Rfr: '\u211C',
	rfr: '\uD835\uDD2F',
	rHar: '\u2964',
	rhard: '\u21C1',
	rharu: '\u21C0',
	rharul: '\u296C',
	Rho: '\u03A1',
	rho: '\u03C1',
	rhov: '\u03F1',
	RightAngleBracket: '\u27E9',
	RightArrow: '\u2192',
	Rightarrow: '\u21D2',
	rightarrow: '\u2192',
	RightArrowBar: '\u21E5',
	RightArrowLeftArrow: '\u21C4',
	rightarrowtail: '\u21A3',
	RightCeiling: '\u2309',
	RightDoubleBracket: '\u27E7',
	RightDownTeeVector: '\u295D',
	RightDownVector: '\u21C2',
	RightDownVectorBar: '\u2955',
	RightFloor: '\u230B',
	rightharpoondown: '\u21C1',
	rightharpoonup: '\u21C0',
	rightleftarrows: '\u21C4',
	rightleftharpoons: '\u21CC',
	rightrightarrows: '\u21C9',
	rightsquigarrow: '\u219D',
	RightTee: '\u22A2',
	RightTeeArrow: '\u21A6',
	RightTeeVector: '\u295B',
	rightthreetimes: '\u22CC',
	RightTriangle: '\u22B3',
	RightTriangleBar: '\u29D0',
	RightTriangleEqual: '\u22B5',
	RightUpDownVector: '\u294F',
	RightUpTeeVector: '\u295C',
	RightUpVector: '\u21BE',
	RightUpVectorBar: '\u2954',
	RightVector: '\u21C0',
	RightVectorBar: '\u2953',
	ring: '\u02DA',
	risingdotseq: '\u2253',
	rlarr: '\u21C4',
	rlhar: '\u21CC',
	rlm: '\u200F',
	rmoust: '\u23B1',
	rmoustache: '\u23B1',
	rnmid: '\u2AEE',
	roang: '\u27ED',
	roarr: '\u21FE',
	robrk: '\u27E7',
	ropar: '\u2986',
	Ropf: '\u211D',
	ropf: '\uD835\uDD63',
	roplus: '\u2A2E',
	rotimes: '\u2A35',
	RoundImplies: '\u2970',
	rpar: '\u0029',
	rpargt: '\u2994',
	rppolint: '\u2A12',
	rrarr: '\u21C9',
	Rrightarrow: '\u21DB',
	rsaquo: '\u203A',
	Rscr: '\u211B',
	rscr: '\uD835\uDCC7',
	Rsh: '\u21B1',
	rsh: '\u21B1',
	rsqb: '\u005D',
	rsquo: '\u2019',
	rsquor: '\u2019',
	rthree: '\u22CC',
	rtimes: '\u22CA',
	rtri: '\u25B9',
	rtrie: '\u22B5',
	rtrif: '\u25B8',
	rtriltri: '\u29CE',
	RuleDelayed: '\u29F4',
	ruluhar: '\u2968',
	rx: '\u211E',
	Sacute: '\u015A',
	sacute: '\u015B',
	sbquo: '\u201A',
	Sc: '\u2ABC',
	sc: '\u227B',
	scap: '\u2AB8',
	Scaron: '\u0160',
	scaron: '\u0161',
	sccue: '\u227D',
	scE: '\u2AB4',
	sce: '\u2AB0',
	Scedil: '\u015E',
	scedil: '\u015F',
	Scirc: '\u015C',
	scirc: '\u015D',
	scnap: '\u2ABA',
	scnE: '\u2AB6',
	scnsim: '\u22E9',
	scpolint: '\u2A13',
	scsim: '\u227F',
	Scy: '\u0421',
	scy: '\u0441',
	sdot: '\u22C5',
	sdotb: '\u22A1',
	sdote: '\u2A66',
	searhk: '\u2925',
	seArr: '\u21D8',
	searr: '\u2198',
	searrow: '\u2198',
	sect: '\u00A7',
	semi: '\u003B',
	seswar: '\u2929',
	setminus: '\u2216',
	setmn: '\u2216',
	sext: '\u2736',
	Sfr: '\uD835\uDD16',
	sfr: '\uD835\uDD30',
	sfrown: '\u2322',
	sharp: '\u266F',
	SHCHcy: '\u0429',
	shchcy: '\u0449',
	SHcy: '\u0428',
	shcy: '\u0448',
	ShortDownArrow: '\u2193',
	ShortLeftArrow: '\u2190',
	shortmid: '\u2223',
	shortparallel: '\u2225',
	ShortRightArrow: '\u2192',
	ShortUpArrow: '\u2191',
	shy: '\u00AD',
	Sigma: '\u03A3',
	sigma: '\u03C3',
	sigmaf: '\u03C2',
	sigmav: '\u03C2',
	sim: '\u223C',
	simdot: '\u2A6A',
	sime: '\u2243',
	simeq: '\u2243',
	simg: '\u2A9E',
	simgE: '\u2AA0',
	siml: '\u2A9D',
	simlE: '\u2A9F',
	simne: '\u2246',
	simplus: '\u2A24',
	simrarr: '\u2972',
	slarr: '\u2190',
	SmallCircle: '\u2218',
	smallsetminus: '\u2216',
	smashp: '\u2A33',
	smeparsl: '\u29E4',
	smid: '\u2223',
	smile: '\u2323',
	smt: '\u2AAA',
	smte: '\u2AAC',
	smtes: '\u2AAC\uFE00',
	SOFTcy: '\u042C',
	softcy: '\u044C',
	sol: '\u002F',
	solb: '\u29C4',
	solbar: '\u233F',
	Sopf: '\uD835\uDD4A',
	sopf: '\uD835\uDD64',
	spades: '\u2660',
	spadesuit: '\u2660',
	spar: '\u2225',
	sqcap: '\u2293',
	sqcaps: '\u2293\uFE00',
	sqcup: '\u2294',
	sqcups: '\u2294\uFE00',
	Sqrt: '\u221A',
	sqsub: '\u228F',
	sqsube: '\u2291',
	sqsubset: '\u228F',
	sqsubseteq: '\u2291',
	sqsup: '\u2290',
	sqsupe: '\u2292',
	sqsupset: '\u2290',
	sqsupseteq: '\u2292',
	squ: '\u25A1',
	Square: '\u25A1',
	square: '\u25A1',
	SquareIntersection: '\u2293',
	SquareSubset: '\u228F',
	SquareSubsetEqual: '\u2291',
	SquareSuperset: '\u2290',
	SquareSupersetEqual: '\u2292',
	SquareUnion: '\u2294',
	squarf: '\u25AA',
	squf: '\u25AA',
	srarr: '\u2192',
	Sscr: '\uD835\uDCAE',
	sscr: '\uD835\uDCC8',
	ssetmn: '\u2216',
	ssmile: '\u2323',
	sstarf: '\u22C6',
	Star: '\u22C6',
	star: '\u2606',
	starf: '\u2605',
	straightepsilon: '\u03F5',
	straightphi: '\u03D5',
	strns: '\u00AF',
	Sub: '\u22D0',
	sub: '\u2282',
	subdot: '\u2ABD',
	subE: '\u2AC5',
	sube: '\u2286',
	subedot: '\u2AC3',
	submult: '\u2AC1',
	subnE: '\u2ACB',
	subne: '\u228A',
	subplus: '\u2ABF',
	subrarr: '\u2979',
	Subset: '\u22D0',
	subset: '\u2282',
	subseteq: '\u2286',
	subseteqq: '\u2AC5',
	SubsetEqual: '\u2286',
	subsetneq: '\u228A',
	subsetneqq: '\u2ACB',
	subsim: '\u2AC7',
	subsub: '\u2AD5',
	subsup: '\u2AD3',
	succ: '\u227B',
	succapprox: '\u2AB8',
	succcurlyeq: '\u227D',
	Succeeds: '\u227B',
	SucceedsEqual: '\u2AB0',
	SucceedsSlantEqual: '\u227D',
	SucceedsTilde: '\u227F',
	succeq: '\u2AB0',
	succnapprox: '\u2ABA',
	succneqq: '\u2AB6',
	succnsim: '\u22E9',
	succsim: '\u227F',
	SuchThat: '\u220B',
	Sum: '\u2211',
	sum: '\u2211',
	sung: '\u266A',
	Sup: '\u22D1',
	sup: '\u2283',
	sup1: '\u00B9',
	sup2: '\u00B2',
	sup3: '\u00B3',
	supdot: '\u2ABE',
	supdsub: '\u2AD8',
	supE: '\u2AC6',
	supe: '\u2287',
	supedot: '\u2AC4',
	Superset: '\u2283',
	SupersetEqual: '\u2287',
	suphsol: '\u27C9',
	suphsub: '\u2AD7',
	suplarr: '\u297B',
	supmult: '\u2AC2',
	supnE: '\u2ACC',
	supne: '\u228B',
	supplus: '\u2AC0',
	Supset: '\u22D1',
	supset: '\u2283',
	supseteq: '\u2287',
	supseteqq: '\u2AC6',
	supsetneq: '\u228B',
	supsetneqq: '\u2ACC',
	supsim: '\u2AC8',
	supsub: '\u2AD4',
	supsup: '\u2AD6',
	swarhk: '\u2926',
	swArr: '\u21D9',
	swarr: '\u2199',
	swarrow: '\u2199',
	swnwar: '\u292A',
	szlig: '\u00DF',
	Tab: '\u0009',
	target: '\u2316',
	Tau: '\u03A4',
	tau: '\u03C4',
	tbrk: '\u23B4',
	Tcaron: '\u0164',
	tcaron: '\u0165',
	Tcedil: '\u0162',
	tcedil: '\u0163',
	Tcy: '\u0422',
	tcy: '\u0442',
	tdot: '\u20DB',
	telrec: '\u2315',
	Tfr: '\uD835\uDD17',
	tfr: '\uD835\uDD31',
	there4: '\u2234',
	Therefore: '\u2234',
	therefore: '\u2234',
	Theta: '\u0398',
	theta: '\u03B8',
	thetasym: '\u03D1',
	thetav: '\u03D1',
	thickapprox: '\u2248',
	thicksim: '\u223C',
	ThickSpace: '\u205F\u200A',
	thinsp: '\u2009',
	ThinSpace: '\u2009',
	thkap: '\u2248',
	thksim: '\u223C',
	THORN: '\u00DE',
	thorn: '\u00FE',
	Tilde: '\u223C',
	tilde: '\u02DC',
	TildeEqual: '\u2243',
	TildeFullEqual: '\u2245',
	TildeTilde: '\u2248',
	times: '\u00D7',
	timesb: '\u22A0',
	timesbar: '\u2A31',
	timesd: '\u2A30',
	tint: '\u222D',
	toea: '\u2928',
	top: '\u22A4',
	topbot: '\u2336',
	topcir: '\u2AF1',
	Topf: '\uD835\uDD4B',
	topf: '\uD835\uDD65',
	topfork: '\u2ADA',
	tosa: '\u2929',
	tprime: '\u2034',
	TRADE: '\u2122',
	trade: '\u2122',
	triangle: '\u25B5',
	triangledown: '\u25BF',
	triangleleft: '\u25C3',
	trianglelefteq: '\u22B4',
	triangleq: '\u225C',
	triangleright: '\u25B9',
	trianglerighteq: '\u22B5',
	tridot: '\u25EC',
	trie: '\u225C',
	triminus: '\u2A3A',
	TripleDot: '\u20DB',
	triplus: '\u2A39',
	trisb: '\u29CD',
	tritime: '\u2A3B',
	trpezium: '\u23E2',
	Tscr: '\uD835\uDCAF',
	tscr: '\uD835\uDCC9',
	TScy: '\u0426',
	tscy: '\u0446',
	TSHcy: '\u040B',
	tshcy: '\u045B',
	Tstrok: '\u0166',
	tstrok: '\u0167',
	twixt: '\u226C',
	twoheadleftarrow: '\u219E',
	twoheadrightarrow: '\u21A0',
	Uacute: '\u00DA',
	uacute: '\u00FA',
	Uarr: '\u219F',
	uArr: '\u21D1',
	uarr: '\u2191',
	Uarrocir: '\u2949',
	Ubrcy: '\u040E',
	ubrcy: '\u045E',
	Ubreve: '\u016C',
	ubreve: '\u016D',
	Ucirc: '\u00DB',
	ucirc: '\u00FB',
	Ucy: '\u0423',
	ucy: '\u0443',
	udarr: '\u21C5',
	Udblac: '\u0170',
	udblac: '\u0171',
	udhar: '\u296E',
	ufisht: '\u297E',
	Ufr: '\uD835\uDD18',
	ufr: '\uD835\uDD32',
	Ugrave: '\u00D9',
	ugrave: '\u00F9',
	uHar: '\u2963',
	uharl: '\u21BF',
	uharr: '\u21BE',
	uhblk: '\u2580',
	ulcorn: '\u231C',
	ulcorner: '\u231C',
	ulcrop: '\u230F',
	ultri: '\u25F8',
	Umacr: '\u016A',
	umacr: '\u016B',
	uml: '\u00A8',
	UnderBar: '\u005F',
	UnderBrace: '\u23DF',
	UnderBracket: '\u23B5',
	UnderParenthesis: '\u23DD',
	Union: '\u22C3',
	UnionPlus: '\u228E',
	Uogon: '\u0172',
	uogon: '\u0173',
	Uopf: '\uD835\uDD4C',
	uopf: '\uD835\uDD66',
	UpArrow: '\u2191',
	Uparrow: '\u21D1',
	uparrow: '\u2191',
	UpArrowBar: '\u2912',
	UpArrowDownArrow: '\u21C5',
	UpDownArrow: '\u2195',
	Updownarrow: '\u21D5',
	updownarrow: '\u2195',
	UpEquilibrium: '\u296E',
	upharpoonleft: '\u21BF',
	upharpoonright: '\u21BE',
	uplus: '\u228E',
	UpperLeftArrow: '\u2196',
	UpperRightArrow: '\u2197',
	Upsi: '\u03D2',
	upsi: '\u03C5',
	upsih: '\u03D2',
	Upsilon: '\u03A5',
	upsilon: '\u03C5',
	UpTee: '\u22A5',
	UpTeeArrow: '\u21A5',
	upuparrows: '\u21C8',
	urcorn: '\u231D',
	urcorner: '\u231D',
	urcrop: '\u230E',
	Uring: '\u016E',
	uring: '\u016F',
	urtri: '\u25F9',
	Uscr: '\uD835\uDCB0',
	uscr: '\uD835\uDCCA',
	utdot: '\u22F0',
	Utilde: '\u0168',
	utilde: '\u0169',
	utri: '\u25B5',
	utrif: '\u25B4',
	uuarr: '\u21C8',
	Uuml: '\u00DC',
	uuml: '\u00FC',
	uwangle: '\u29A7',
	vangrt: '\u299C',
	varepsilon: '\u03F5',
	varkappa: '\u03F0',
	varnothing: '\u2205',
	varphi: '\u03D5',
	varpi: '\u03D6',
	varpropto: '\u221D',
	vArr: '\u21D5',
	varr: '\u2195',
	varrho: '\u03F1',
	varsigma: '\u03C2',
	varsubsetneq: '\u228A\uFE00',
	varsubsetneqq: '\u2ACB\uFE00',
	varsupsetneq: '\u228B\uFE00',
	varsupsetneqq: '\u2ACC\uFE00',
	vartheta: '\u03D1',
	vartriangleleft: '\u22B2',
	vartriangleright: '\u22B3',
	Vbar: '\u2AEB',
	vBar: '\u2AE8',
	vBarv: '\u2AE9',
	Vcy: '\u0412',
	vcy: '\u0432',
	VDash: '\u22AB',
	Vdash: '\u22A9',
	vDash: '\u22A8',
	vdash: '\u22A2',
	Vdashl: '\u2AE6',
	Vee: '\u22C1',
	vee: '\u2228',
	veebar: '\u22BB',
	veeeq: '\u225A',
	vellip: '\u22EE',
	Verbar: '\u2016',
	verbar: '\u007C',
	Vert: '\u2016',
	vert: '\u007C',
	VerticalBar: '\u2223',
	VerticalLine: '\u007C',
	VerticalSeparator: '\u2758',
	VerticalTilde: '\u2240',
	VeryThinSpace: '\u200A',
	Vfr: '\uD835\uDD19',
	vfr: '\uD835\uDD33',
	vltri: '\u22B2',
	vnsub: '\u2282\u20D2',
	vnsup: '\u2283\u20D2',
	Vopf: '\uD835\uDD4D',
	vopf: '\uD835\uDD67',
	vprop: '\u221D',
	vrtri: '\u22B3',
	Vscr: '\uD835\uDCB1',
	vscr: '\uD835\uDCCB',
	vsubnE: '\u2ACB\uFE00',
	vsubne: '\u228A\uFE00',
	vsupnE: '\u2ACC\uFE00',
	vsupne: '\u228B\uFE00',
	Vvdash: '\u22AA',
	vzigzag: '\u299A',
	Wcirc: '\u0174',
	wcirc: '\u0175',
	wedbar: '\u2A5F',
	Wedge: '\u22C0',
	wedge: '\u2227',
	wedgeq: '\u2259',
	weierp: '\u2118',
	Wfr: '\uD835\uDD1A',
	wfr: '\uD835\uDD34',
	Wopf: '\uD835\uDD4E',
	wopf: '\uD835\uDD68',
	wp: '\u2118',
	wr: '\u2240',
	wreath: '\u2240',
	Wscr: '\uD835\uDCB2',
	wscr: '\uD835\uDCCC',
	xcap: '\u22C2',
	xcirc: '\u25EF',
	xcup: '\u22C3',
	xdtri: '\u25BD',
	Xfr: '\uD835\uDD1B',
	xfr: '\uD835\uDD35',
	xhArr: '\u27FA',
	xharr: '\u27F7',
	Xi: '\u039E',
	xi: '\u03BE',
	xlArr: '\u27F8',
	xlarr: '\u27F5',
	xmap: '\u27FC',
	xnis: '\u22FB',
	xodot: '\u2A00',
	Xopf: '\uD835\uDD4F',
	xopf: '\uD835\uDD69',
	xoplus: '\u2A01',
	xotime: '\u2A02',
	xrArr: '\u27F9',
	xrarr: '\u27F6',
	Xscr: '\uD835\uDCB3',
	xscr: '\uD835\uDCCD',
	xsqcup: '\u2A06',
	xuplus: '\u2A04',
	xutri: '\u25B3',
	xvee: '\u22C1',
	xwedge: '\u22C0',
	Yacute: '\u00DD',
	yacute: '\u00FD',
	YAcy: '\u042F',
	yacy: '\u044F',
	Ycirc: '\u0176',
	ycirc: '\u0177',
	Ycy: '\u042B',
	ycy: '\u044B',
	yen: '\u00A5',
	Yfr: '\uD835\uDD1C',
	yfr: '\uD835\uDD36',
	YIcy: '\u0407',
	yicy: '\u0457',
	Yopf: '\uD835\uDD50',
	yopf: '\uD835\uDD6A',
	Yscr: '\uD835\uDCB4',
	yscr: '\uD835\uDCCE',
	YUcy: '\u042E',
	yucy: '\u044E',
	Yuml: '\u0178',
	yuml: '\u00FF',
	Zacute: '\u0179',
	zacute: '\u017A',
	Zcaron: '\u017D',
	zcaron: '\u017E',
	Zcy: '\u0417',
	zcy: '\u0437',
	Zdot: '\u017B',
	zdot: '\u017C',
	zeetrf: '\u2128',
	ZeroWidthSpace: '\u200B',
	Zeta: '\u0396',
	zeta: '\u03B6',
	Zfr: '\u2128',
	zfr: '\uD835\uDD37',
	ZHcy: '\u0416',
	zhcy: '\u0436',
	zigrarr: '\u21DD',
	Zopf: '\u2124',
	zopf: '\uD835\uDD6B',
	Zscr: '\uD835\uDCB5',
	zscr: '\uD835\uDCCF',
	zwj: '\u200D',
	zwnj: '\u200C',
});

/**
 * @deprecated use `HTML_ENTITIES` instead
 * @see HTML_ENTITIES
 */
exports.entityMap = exports.HTML_ENTITIES;


/***/ }),

/***/ 8978:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;
var dom = __webpack_require__(4722)
__webpack_unused_export__ = dom.DOMImplementation
__webpack_unused_export__ = dom.XMLSerializer
exports.DOMParser = __webpack_require__(5752).DOMParser


/***/ }),

/***/ 4466:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var NAMESPACE = (__webpack_require__(4582).NAMESPACE);

//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring
var S_ATTR_SPACE=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
var S_ATTR_END = 5;//attr value end and no space(quot end)
var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7;//closed el<el />

/**
 * Creates an error that will not be caught by XMLReader aka the SAX parser.
 *
 * @param {string} message
 * @param {any?} locator Optional, can provide details about the location in the source
 * @constructor
 */
function ParseError(message, locator) {
	this.message = message
	this.locator = locator
	if(Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
}
ParseError.prototype = new Error();
ParseError.prototype.name = ParseError.name

function XMLReader(){

}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if (Object.hasOwnProperty.call(entityMap, k)) {
			return entityMap[k];
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		if(end>start){
			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
			locator&&position(start);
			domBuilder.characters(xt,0,end-start);
			start = end
		}
	}
	function position(p,m){
		while(p>=lineEnd && (m = linePattern.exec(source))){
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p-lineStart+1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;

	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		try{
			var tagStart = source.indexOf('<',start);
			if(tagStart<0){
				if(!source.substr(start).match(/^\s*$/)){
					var doc = domBuilder.doc;
	    			var text = doc.createTextNode(source.substr(start));
	    			doc.appendChild(text);
	    			domBuilder.currentElement = text;
				}
				return;
			}
			if(tagStart>start){
				appendText(tagStart);
			}
			switch(source.charAt(tagStart+1)){
			case '/':
				var end = source.indexOf('>',tagStart+3);
				var tagName = source.substring(tagStart + 2, end).replace(/[ \t\n\r]+$/g, '');
				var config = parseStack.pop();
				if(end<0){

	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase()
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for (var prefix in localNSMap) {
							if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
								domBuilder.endPrefixMapping(prefix);
							}
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName ); // No known test case
					}
		        }else{
		        	parseStack.push(config)
		        }

				end++;
				break;
				// end elment
			case '?':// <?...?>
				locator&&position(tagStart);
				end = parseInstruction(source,tagStart,domBuilder);
				break;
			case '!':// <!doctype,<![CDATA,<!--
				locator&&position(tagStart);
				end = parseDCC(source,tagStart,domBuilder,errorHandler);
				break;
			default:
				locator&&position(tagStart);
				var el = new ElementAttributes();
				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
				//elStartEnd
				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
				var len = el.length;


				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				if(locator && len){
					var locator2 = copyLocator(locator,{});
					//try{//attribute position fixed
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.locator = copyLocator(locator,{});
					}
					domBuilder.locator = locator2
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
					domBuilder.locator = locator;
				}else{
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
				}

				if (NAMESPACE.isHTML(el.uri) && !el.closed) {
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				} else {
					end++;
				}
			}
		}catch(e){
			if (e instanceof ParseError) {
				throw e;
			}
			errorHandler.error('element parse error: '+e)
			end = -1;
		}
		if(end>start){
			start = end;
		}else{
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart,start)+1);
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){

	/**
	 * @param {string} qname
	 * @param {string} value
	 * @param {number} startIndex
	 */
	function addAttribute(qname, value, startIndex) {
		if (el.attributeNames.hasOwnProperty(qname)) {
			errorHandler.fatalError('Attribute ' + qname + ' redefined')
		}
		el.addValue(
			qname,
			// @see https://www.w3.org/TR/xml/#AVNormalize
			// since the xmldom sax parser does not "interpret" DTD the following is not implemented:
			// - recursive replacement of (DTD) entity references
			// - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
			value.replace(/[\t\n\r]/g, ' ').replace(/&#?\w+;/g, entityReplacer),
			startIndex
		)
	}
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_SPACE){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName'); // No known test case
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				){//equal
				if(s === S_ATTR){
					errorHandler.warning('attribute value must after "="')
					attrName = source.slice(start,p)
				}
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start, p);
					addAttribute(attrName, value, start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start, p);
				addAttribute(attrName, value, start);
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="'); // No known test case
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				s =S_TAG_CLOSE;
				el.closed = true;
			case S_ATTR_NOQUOT_VALUE:
			case S_ATTR:
				break;
				case S_ATTR_SPACE:
					el.closed = true;
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')") // No known test case
			}
			break;
		case ''://end document
			errorHandler.error('unexpected end of input');
			if(s == S_TAG){
				el.setTagName(source.slice(start,p));
			}
			return p;
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				break;//normal
			case S_ATTR_NOQUOT_VALUE://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_SPACE:
				if(s === S_ATTR_SPACE){
					value = attrName;
				}
				if(s == S_ATTR_NOQUOT_VALUE){
					errorHandler.warning('attribute "'+value+'" missed quot(")!');
					addAttribute(attrName, value, start)
				}else{
					if(!NAMESPACE.isHTML(currentNSMap['']) || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					addAttribute(value, value, start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_TAG_SPACE;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_SPACE;
					break;
				case S_ATTR_NOQUOT_VALUE:
					var value = source.slice(start, p);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					addAttribute(attrName, value, start)
				case S_ATTR_END:
					s = S_TAG_SPACE;
					break;
				//case S_TAG_SPACE:
				//case S_EQ:
				//case S_ATTR_SPACE:
				//	void();break;
				//case S_TAG_CLOSE:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_ATTR_NOQUOT_VALUE:void();break;
				case S_ATTR_SPACE:
					var tagName =  el.tagName;
					if (!NAMESPACE.isHTML(currentNSMap['']) || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					addAttribute(attrName, attrName, start);
					start = p;
					s = S_ATTR;
					break;
				case S_ATTR_END:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_TAG_SPACE:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_ATTR_NOQUOT_VALUE;
					start = p;
					break;
				case S_TAG_CLOSE:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}//end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement(el,domBuilder,currentNSMap){
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = NAMESPACE.XMLNS
			domBuilder.startPrefixMapping(nsPrefix, value)
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = NAMESPACE.XML;
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix || '']

				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for (prefix in localNSMap) {
				if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
					domBuilder.endPrefixMapping(prefix);
				}
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}

		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos =  source.lastIndexOf('</'+tagName+'>')
		if(pos<elStartEnd){//忘记闭合
			pos = source.lastIndexOf('</'+tagName)
		}
		closeMap[tagName] =pos
	}
	return pos<elStartEnd;
	//}
}

function _copy (source, target) {
	for (var n in source) {
		if (Object.prototype.hasOwnProperty.call(source, n)) {
			target[n] = source[n];
		}
	}
}

function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA()
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId)
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = false;
			var sysid = false;
			if(len>3){
				if(/^public$/i.test(matchs[2][0])){
					pubid = matchs[3][0];
					sysid = len>4 && matchs[4][0];
				}else if(/^system$/i.test(matchs[2][0])){
					sysid = matchs[3][0];
				}
			}
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name, pubid, sysid);
			domBuilder.endDTD();

			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

function ElementAttributes(){
	this.attributeNames = {}
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	addValue:function(qName, value, offset) {
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this.attributeNames[qName] = this.length;
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getLocator:function(i){return this[i].locator},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}



function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

exports.XMLReader = XMLReader;
exports.ParseError = ParseError;


/***/ }),

/***/ 8263:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isValue         = __webpack_require__(8175)
  , isPlainFunction = __webpack_require__(6873)
  , assign          = __webpack_require__(6596)
  , normalizeOpts   = __webpack_require__(148)
  , contains        = __webpack_require__(214);

var d = (module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if (arguments.length < 2 || typeof dscr !== "string") {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (isValue(dscr)) {
		c = contains.call(dscr, "c");
		e = contains.call(dscr, "e");
		w = contains.call(dscr, "w");
	} else {
		c = w = true;
		e = false;
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
});

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== "string") {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (!isValue(get)) {
		get = undefined;
	} else if (!isPlainFunction(get)) {
		options = get;
		get = set = undefined;
	} else if (!isValue(set)) {
		set = undefined;
	} else if (!isPlainFunction(set)) {
		options = set;
		set = undefined;
	}
	if (isValue(dscr)) {
		c = contains.call(dscr, "c");
		e = contains.call(dscr, "e");
	} else {
		c = true;
		e = false;
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};


/***/ }),

/***/ 6011:
/***/ ((module) => {

"use strict";


// eslint-disable-next-line no-empty-function
module.exports = function () {};


/***/ }),

/***/ 6596:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(5339)() ? Object.assign : __webpack_require__(3595);


/***/ }),

/***/ 5339:
/***/ ((module) => {

"use strict";


module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return obj.foo + obj.bar + obj.trzy === "razdwatrzy";
};


/***/ }),

/***/ 3595:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var keys  = __webpack_require__(2093)
  , value = __webpack_require__(7134)
  , max   = Math.max;

module.exports = function (dest, src /*, …srcn*/) {
	var error, i, length = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < length; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};


/***/ }),

/***/ 9762:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _undefined = __webpack_require__(6011)(); // Support ES3 engines

module.exports = function (val) { return val !== _undefined && val !== null; };


/***/ }),

/***/ 2093:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(3380)() ? Object.keys : __webpack_require__(4232);


/***/ }),

/***/ 3380:
/***/ ((module) => {

"use strict";


module.exports = function () {
	try {
		Object.keys("primitive");
		return true;
	} catch (e) {
		return false;
	}
};


/***/ }),

/***/ 4232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isValue = __webpack_require__(9762);

var keys = Object.keys;

module.exports = function (object) { return keys(isValue(object) ? Object(object) : object); };


/***/ }),

/***/ 148:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isValue = __webpack_require__(9762);

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
module.exports = function (opts1 /*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) return;
		process(Object(options), result);
	});
	return result;
};


/***/ }),

/***/ 5499:
/***/ ((module) => {

"use strict";


module.exports = function (fn) {
	if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
	return fn;
};


/***/ }),

/***/ 7134:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isValue = __webpack_require__(9762);

module.exports = function (value) {
	if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
	return value;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(525)() ? String.prototype.contains : __webpack_require__(1521);


/***/ }),

/***/ 525:
/***/ ((module) => {

"use strict";


var str = "razdwatrzy";

module.exports = function () {
	if (typeof str.contains !== "function") return false;
	return str.contains("dwa") === true && str.contains("foo") === false;
};


/***/ }),

/***/ 1521:
/***/ ((module) => {

"use strict";


var indexOf = String.prototype.indexOf;

module.exports = function (searchString /*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};


/***/ }),

/***/ 3068:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


var d        = __webpack_require__(8263)
  , callable = __webpack_require__(5499)

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , descriptor = { configurable: true, enumerable: false, writable: true }

  , on, once, off, emit, methods, descriptors, base;

on = function (type, listener) {
	var data;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;
	else if (typeof data[type] === 'object') data[type].push(listener);
	else data[type] = [data[type], listener];

	return this;
};

once = function (type, listener) {
	var once, self;

	callable(listener);
	self = this;
	on.call(this, type, once = function () {
		off.call(self, type, once);
		apply.call(listener, this, arguments);
	});

	once.__eeOnceListener__ = listener;
	return this;
};

off = function (type, listener) {
	var data, listeners, candidate, i;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if (typeof listeners === 'object') {
		for (i = 0; (candidate = listeners[i]); ++i) {
			if ((candidate === listener) ||
					(candidate.__eeOnceListener__ === listener)) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
				else listeners.splice(i, 1);
			}
		}
	} else {
		if ((listeners === listener) ||
				(listeners.__eeOnceListener__ === listener)) {
			delete data[type];
		}
	}

	return this;
};

emit = function (type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if (typeof listeners === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

		listeners = listeners.slice();
		for (i = 0; (listener = listeners[i]); ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
		case 1:
			call.call(listeners, this);
			break;
		case 2:
			call.call(listeners, this, arguments[1]);
			break;
		case 3:
			call.call(listeners, this, arguments[1], arguments[2]);
			break;
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) {
				args[i - 1] = arguments[i];
			}
			apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;


/***/ }),

/***/ 1873:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(9325);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ 2552:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(1873),
    getRawTag = __webpack_require__(659),
    objectToString = __webpack_require__(9350);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ 4128:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var trimmedEndIndex = __webpack_require__(1800);

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

module.exports = baseTrim;


/***/ }),

/***/ 4840:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ 659:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(1873);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ 9350:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ 9325:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(4840);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ 1800:
/***/ ((module) => {

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

module.exports = trimmedEndIndex;


/***/ }),

/***/ 8221:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(3805),
    now = __webpack_require__(124),
    toNumber = __webpack_require__(9374);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ }),

/***/ 3805:
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ 346:
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ 4394:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(2552),
    isObjectLike = __webpack_require__(346);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ 124:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(9325);

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ }),

/***/ 7350:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var debounce = __webpack_require__(8221),
    isObject = __webpack_require__(3805);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;


/***/ }),

/***/ 9374:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTrim = __webpack_require__(4128),
    isObject = __webpack_require__(3805),
    isSymbol = __webpack_require__(4394);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),

/***/ 5606:
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ 4080:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isPrototype = __webpack_require__(9202);

module.exports = function (value) {
	if (typeof value !== "function") return false;

	if (!hasOwnProperty.call(value, "length")) return false;

	try {
		if (typeof value.length !== "number") return false;
		if (typeof value.call !== "function") return false;
		if (typeof value.apply !== "function") return false;
	} catch (error) {
		return false;
	}

	return !isPrototype(value);
};


/***/ }),

/***/ 181:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isValue = __webpack_require__(8175);

// prettier-ignore
var possibleTypes = { "object": true, "function": true, "undefined": true /* document.all */ };

module.exports = function (value) {
	if (!isValue(value)) return false;
	return hasOwnProperty.call(possibleTypes, typeof value);
};


/***/ }),

/***/ 6873:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isFunction = __webpack_require__(4080);

var classRe = /^\s*class[\s{/}]/, functionToString = Function.prototype.toString;

module.exports = function (value) {
	if (!isFunction(value)) return false;
	if (classRe.test(functionToString.call(value))) return false;
	return true;
};


/***/ }),

/***/ 9202:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isObject = __webpack_require__(181);

module.exports = function (value) {
	if (!isObject(value)) return false;
	try {
		if (!value.constructor) return false;
		return value.constructor.prototype === value;
	} catch (error) {
		return false;
	}
};


/***/ }),

/***/ 8175:
/***/ ((module) => {

"use strict";


// ES3 safe
var _undefined = void 0;

module.exports = function (value) { return value !== _undefined && value !== null; };


/***/ }),

/***/ 6838:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__6838__;

/***/ }),

/***/ 6361:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__6361__;

/***/ }),

/***/ 9306:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(4901);
var tryToString = __webpack_require__(6823);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 3506:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isPossiblePrototype = __webpack_require__(3925);

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ 679:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isPrototypeOf = __webpack_require__(1625);

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw new $TypeError('Incorrect invocation');
};


/***/ }),

/***/ 8551:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(34);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 7394:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThisAccessor = __webpack_require__(6706);
var classof = __webpack_require__(4576);

var $TypeError = TypeError;

// Includes
// - Perform ? RequireInternalSlot(O, [[ArrayBufferData]]).
// - If IsSharedArrayBuffer(O) is true, throw a TypeError exception.
module.exports = uncurryThisAccessor(ArrayBuffer.prototype, 'byteLength', 'get') || function (O) {
  if (classof(O) !== 'ArrayBuffer') throw new $TypeError('ArrayBuffer expected');
  return O.byteLength;
};


/***/ }),

/***/ 3238:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(9504);
var arrayBufferByteLength = __webpack_require__(7394);

var slice = uncurryThis(ArrayBuffer.prototype.slice);

module.exports = function (O) {
  if (arrayBufferByteLength(O) !== 0) return false;
  try {
    slice(O, 0, 0);
    return false;
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 5636:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(4475);
var uncurryThis = __webpack_require__(9504);
var uncurryThisAccessor = __webpack_require__(6706);
var toIndex = __webpack_require__(7696);
var isDetached = __webpack_require__(3238);
var arrayBufferByteLength = __webpack_require__(7394);
var detachTransferable = __webpack_require__(4483);
var PROPER_STRUCTURED_CLONE_TRANSFER = __webpack_require__(1548);

var structuredClone = global.structuredClone;
var ArrayBuffer = global.ArrayBuffer;
var DataView = global.DataView;
var TypeError = global.TypeError;
var min = Math.min;
var ArrayBufferPrototype = ArrayBuffer.prototype;
var DataViewPrototype = DataView.prototype;
var slice = uncurryThis(ArrayBufferPrototype.slice);
var isResizable = uncurryThisAccessor(ArrayBufferPrototype, 'resizable', 'get');
var maxByteLength = uncurryThisAccessor(ArrayBufferPrototype, 'maxByteLength', 'get');
var getInt8 = uncurryThis(DataViewPrototype.getInt8);
var setInt8 = uncurryThis(DataViewPrototype.setInt8);

module.exports = (PROPER_STRUCTURED_CLONE_TRANSFER || detachTransferable) && function (arrayBuffer, newLength, preserveResizability) {
  var byteLength = arrayBufferByteLength(arrayBuffer);
  var newByteLength = newLength === undefined ? byteLength : toIndex(newLength);
  var fixedLength = !isResizable || !isResizable(arrayBuffer);
  var newBuffer;
  if (isDetached(arrayBuffer)) throw new TypeError('ArrayBuffer is detached');
  if (PROPER_STRUCTURED_CLONE_TRANSFER) {
    arrayBuffer = structuredClone(arrayBuffer, { transfer: [arrayBuffer] });
    if (byteLength === newByteLength && (preserveResizability || fixedLength)) return arrayBuffer;
  }
  if (byteLength >= newByteLength && (!preserveResizability || fixedLength)) {
    newBuffer = slice(arrayBuffer, 0, newByteLength);
  } else {
    var options = preserveResizability && !fixedLength && maxByteLength ? { maxByteLength: maxByteLength(arrayBuffer) } : undefined;
    newBuffer = new ArrayBuffer(newByteLength, options);
    var a = new DataView(arrayBuffer);
    var b = new DataView(newBuffer);
    var copyLength = min(newByteLength, byteLength);
    for (var i = 0; i < copyLength; i++) setInt8(b, i, getInt8(a, i));
  }
  if (!PROPER_STRUCTURED_CLONE_TRANSFER) detachTransferable(arrayBuffer);
  return newBuffer;
};


/***/ }),

/***/ 9617:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIndexedObject = __webpack_require__(5397);
var toAbsoluteIndex = __webpack_require__(5610);
var lengthOfArrayLike = __webpack_require__(6198);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 4527:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(3724);
var isArray = __webpack_require__(4376);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw new $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ }),

/***/ 4576:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(9504);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 6955:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(2140);
var isCallable = __webpack_require__(4901);
var classofRaw = __webpack_require__(4576);
var wellKnownSymbol = __webpack_require__(8227);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ 7740:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var hasOwn = __webpack_require__(9297);
var ownKeys = __webpack_require__(5031);
var getOwnPropertyDescriptorModule = __webpack_require__(7347);
var definePropertyModule = __webpack_require__(4913);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 6699:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(3724);
var definePropertyModule = __webpack_require__(4913);
var createPropertyDescriptor = __webpack_require__(6980);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 6980:
/***/ ((module) => {

"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 2106:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var makeBuiltIn = __webpack_require__(283);
var defineProperty = __webpack_require__(4913);

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ 6840:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(4901);
var definePropertyModule = __webpack_require__(4913);
var makeBuiltIn = __webpack_require__(283);
var defineGlobalProperty = __webpack_require__(9433);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 9433:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(4475);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ 4606:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var tryToString = __webpack_require__(6823);

var $TypeError = TypeError;

module.exports = function (O, P) {
  if (!delete O[P]) throw new $TypeError('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
};


/***/ }),

/***/ 3724:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(9039);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ 4483:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(4475);
var tryNodeRequire = __webpack_require__(9714);
var PROPER_STRUCTURED_CLONE_TRANSFER = __webpack_require__(1548);

var structuredClone = global.structuredClone;
var $ArrayBuffer = global.ArrayBuffer;
var $MessageChannel = global.MessageChannel;
var detach = false;
var WorkerThreads, channel, buffer, $detach;

if (PROPER_STRUCTURED_CLONE_TRANSFER) {
  detach = function (transferable) {
    structuredClone(transferable, { transfer: [transferable] });
  };
} else if ($ArrayBuffer) try {
  if (!$MessageChannel) {
    WorkerThreads = tryNodeRequire('worker_threads');
    if (WorkerThreads) $MessageChannel = WorkerThreads.MessageChannel;
  }

  if ($MessageChannel) {
    channel = new $MessageChannel();
    buffer = new $ArrayBuffer(2);

    $detach = function (transferable) {
      channel.port1.postMessage(null, [transferable]);
    };

    if (buffer.byteLength === 2) {
      $detach(buffer);
      if (buffer.byteLength === 0) detach = $detach;
    }
  }
} catch (error) { /* empty */ }

module.exports = detach;


/***/ }),

/***/ 4055:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(4475);
var isObject = __webpack_require__(34);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 6837:
/***/ ((module) => {

"use strict";

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ 5002:
/***/ ((module) => {

"use strict";

module.exports = {
  IndexSizeError: { s: 'INDEX_SIZE_ERR', c: 1, m: 1 },
  DOMStringSizeError: { s: 'DOMSTRING_SIZE_ERR', c: 2, m: 0 },
  HierarchyRequestError: { s: 'HIERARCHY_REQUEST_ERR', c: 3, m: 1 },
  WrongDocumentError: { s: 'WRONG_DOCUMENT_ERR', c: 4, m: 1 },
  InvalidCharacterError: { s: 'INVALID_CHARACTER_ERR', c: 5, m: 1 },
  NoDataAllowedError: { s: 'NO_DATA_ALLOWED_ERR', c: 6, m: 0 },
  NoModificationAllowedError: { s: 'NO_MODIFICATION_ALLOWED_ERR', c: 7, m: 1 },
  NotFoundError: { s: 'NOT_FOUND_ERR', c: 8, m: 1 },
  NotSupportedError: { s: 'NOT_SUPPORTED_ERR', c: 9, m: 1 },
  InUseAttributeError: { s: 'INUSE_ATTRIBUTE_ERR', c: 10, m: 1 },
  InvalidStateError: { s: 'INVALID_STATE_ERR', c: 11, m: 1 },
  SyntaxError: { s: 'SYNTAX_ERR', c: 12, m: 1 },
  InvalidModificationError: { s: 'INVALID_MODIFICATION_ERR', c: 13, m: 1 },
  NamespaceError: { s: 'NAMESPACE_ERR', c: 14, m: 1 },
  InvalidAccessError: { s: 'INVALID_ACCESS_ERR', c: 15, m: 1 },
  ValidationError: { s: 'VALIDATION_ERR', c: 16, m: 0 },
  TypeMismatchError: { s: 'TYPE_MISMATCH_ERR', c: 17, m: 1 },
  SecurityError: { s: 'SECURITY_ERR', c: 18, m: 1 },
  NetworkError: { s: 'NETWORK_ERR', c: 19, m: 1 },
  AbortError: { s: 'ABORT_ERR', c: 20, m: 1 },
  URLMismatchError: { s: 'URL_MISMATCH_ERR', c: 21, m: 1 },
  QuotaExceededError: { s: 'QUOTA_EXCEEDED_ERR', c: 22, m: 1 },
  TimeoutError: { s: 'TIMEOUT_ERR', c: 23, m: 1 },
  InvalidNodeTypeError: { s: 'INVALID_NODE_TYPE_ERR', c: 24, m: 1 },
  DataCloneError: { s: 'DATA_CLONE_ERR', c: 25, m: 1 }
};


/***/ }),

/***/ 7290:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IS_DENO = __webpack_require__(516);
var IS_NODE = __webpack_require__(9088);

module.exports = !IS_DENO && !IS_NODE
  && typeof window == 'object'
  && typeof document == 'object';


/***/ }),

/***/ 516:
/***/ ((module) => {

"use strict";

/* global Deno -- Deno case */
module.exports = typeof Deno == 'object' && Deno && typeof Deno.version == 'object';


/***/ }),

/***/ 9088:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(4475);
var classof = __webpack_require__(4576);

module.exports = classof(global.process) === 'process';


/***/ }),

/***/ 9392:
/***/ ((module) => {

"use strict";

module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ 7388:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(4475);
var userAgent = __webpack_require__(9392);

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 8727:
/***/ ((module) => {

"use strict";

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 6193:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(9504);

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String(new $Error(arg).stack); })('zxcasd');
// eslint-disable-next-line redos/no-vulnerable -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


/***/ }),

/***/ 6518:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(4475);
var getOwnPropertyDescriptor = (__webpack_require__(7347).f);
var createNonEnumerableProperty = __webpack_require__(6699);
var defineBuiltIn = __webpack_require__(6840);
var defineGlobalProperty = __webpack_require__(9433);
var copyConstructorProperties = __webpack_require__(7740);
var isForced = __webpack_require__(2796);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = global[TARGET] && global[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 9039:
/***/ ((module) => {

"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 616:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(9039);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 9565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(616);

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 350:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(3724);
var hasOwn = __webpack_require__(9297);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 6706:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(9504);
var aCallable = __webpack_require__(9306);

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ 9504:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(616);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 7751:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(4475);
var isCallable = __webpack_require__(4901);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ 5966:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aCallable = __webpack_require__(9306);
var isNullOrUndefined = __webpack_require__(4117);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ 4475:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 9297:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(9504);
var toObject = __webpack_require__(8981);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 421:
/***/ ((module) => {

"use strict";

module.exports = {};


/***/ }),

/***/ 5917:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(3724);
var fails = __webpack_require__(9039);
var createElement = __webpack_require__(4055);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ 7055:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(9504);
var fails = __webpack_require__(9039);
var classof = __webpack_require__(4576);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 3167:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(4901);
var isObject = __webpack_require__(34);
var setPrototypeOf = __webpack_require__(2967);

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ 3706:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(9504);
var isCallable = __webpack_require__(4901);
var store = __webpack_require__(7629);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 1181:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_WEAK_MAP = __webpack_require__(8622);
var global = __webpack_require__(4475);
var isObject = __webpack_require__(34);
var createNonEnumerableProperty = __webpack_require__(6699);
var hasOwn = __webpack_require__(9297);
var shared = __webpack_require__(7629);
var sharedKey = __webpack_require__(6119);
var hiddenKeys = __webpack_require__(421);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 4376:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(4576);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};


/***/ }),

/***/ 4901:
/***/ ((module) => {

"use strict";

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 2796:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(9039);
var isCallable = __webpack_require__(4901);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 4117:
/***/ ((module) => {

"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 34:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(4901);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 3925:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(34);

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


/***/ }),

/***/ 6395:
/***/ ((module) => {

"use strict";

module.exports = false;


/***/ }),

/***/ 757:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(7751);
var isCallable = __webpack_require__(4901);
var isPrototypeOf = __webpack_require__(1625);
var USE_SYMBOL_AS_UID = __webpack_require__(7040);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 6198:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toLength = __webpack_require__(8014);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 283:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(9504);
var fails = __webpack_require__(9039);
var isCallable = __webpack_require__(4901);
var hasOwn = __webpack_require__(9297);
var DESCRIPTORS = __webpack_require__(3724);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(350).CONFIGURABLE);
var inspectSource = __webpack_require__(3706);
var InternalStateModule = __webpack_require__(1181);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 741:
/***/ ((module) => {

"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 2603:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toString = __webpack_require__(655);

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ 4913:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(3724);
var IE8_DOM_DEFINE = __webpack_require__(5917);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(8686);
var anObject = __webpack_require__(8551);
var toPropertyKey = __webpack_require__(6969);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 7347:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(3724);
var call = __webpack_require__(9565);
var propertyIsEnumerableModule = __webpack_require__(8773);
var createPropertyDescriptor = __webpack_require__(6980);
var toIndexedObject = __webpack_require__(5397);
var toPropertyKey = __webpack_require__(6969);
var hasOwn = __webpack_require__(9297);
var IE8_DOM_DEFINE = __webpack_require__(5917);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 8480:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var internalObjectKeys = __webpack_require__(1828);
var enumBugKeys = __webpack_require__(8727);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 3717:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 1625:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(9504);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 1828:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(9504);
var hasOwn = __webpack_require__(9297);
var toIndexedObject = __webpack_require__(5397);
var indexOf = (__webpack_require__(9617).indexOf);
var hiddenKeys = __webpack_require__(421);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 8773:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 2967:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(6706);
var isObject = __webpack_require__(34);
var requireObjectCoercible = __webpack_require__(7750);
var aPossiblePrototype = __webpack_require__(3506);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    requireObjectCoercible(O);
    aPossiblePrototype(proto);
    if (!isObject(O)) return O;
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ 4270:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(9565);
var isCallable = __webpack_require__(4901);
var isObject = __webpack_require__(34);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 5031:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(7751);
var uncurryThis = __webpack_require__(9504);
var getOwnPropertyNamesModule = __webpack_require__(8480);
var getOwnPropertySymbolsModule = __webpack_require__(3717);
var anObject = __webpack_require__(8551);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 7750:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isNullOrUndefined = __webpack_require__(4117);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 6119:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var shared = __webpack_require__(5745);
var uid = __webpack_require__(3392);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 7629:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IS_PURE = __webpack_require__(6395);
var globalThis = __webpack_require__(4475);
var defineGlobalProperty = __webpack_require__(9433);

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.37.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2024 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.37.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 5745:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var store = __webpack_require__(7629);

module.exports = function (key, value) {
  return store[key] || (store[key] = value || {});
};


/***/ }),

/***/ 1548:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(4475);
var fails = __webpack_require__(9039);
var V8 = __webpack_require__(7388);
var IS_BROWSER = __webpack_require__(7290);
var IS_DENO = __webpack_require__(516);
var IS_NODE = __webpack_require__(9088);

var structuredClone = global.structuredClone;

module.exports = !!structuredClone && !fails(function () {
  // prevent V8 ArrayBufferDetaching protector cell invalidation and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if ((IS_DENO && V8 > 92) || (IS_NODE && V8 > 94) || (IS_BROWSER && V8 > 97)) return false;
  var buffer = new ArrayBuffer(8);
  var clone = structuredClone(buffer, { transfer: [buffer] });
  return buffer.byteLength !== 0 || clone.byteLength !== 8;
});


/***/ }),

/***/ 4495:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(7388);
var fails = __webpack_require__(9039);
var global = __webpack_require__(4475);

var $String = global.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 5610:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(1291);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 7696:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(1291);
var toLength = __webpack_require__(8014);

var $RangeError = RangeError;

// `ToIndex` abstract operation
// https://tc39.es/ecma262/#sec-toindex
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toIntegerOrInfinity(it);
  var length = toLength(number);
  if (number !== length) throw new $RangeError('Wrong length or index');
  return length;
};


/***/ }),

/***/ 5397:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(7055);
var requireObjectCoercible = __webpack_require__(7750);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 1291:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var trunc = __webpack_require__(741);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 8014:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(1291);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 8981:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var requireObjectCoercible = __webpack_require__(7750);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 2777:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(9565);
var isObject = __webpack_require__(34);
var isSymbol = __webpack_require__(757);
var getMethod = __webpack_require__(5966);
var ordinaryToPrimitive = __webpack_require__(4270);
var wellKnownSymbol = __webpack_require__(8227);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 6969:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPrimitive = __webpack_require__(2777);
var isSymbol = __webpack_require__(757);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 2140:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(8227);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 655:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(6955);

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ 9714:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IS_NODE = __webpack_require__(9088);

module.exports = function (name) {
  try {
    // eslint-disable-next-line no-new-func -- safe
    if (IS_NODE) return Function('return require("' + name + '")')();
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ 6823:
/***/ ((module) => {

"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 3392:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(9504);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 7040:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(4495);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 8686:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(3724);
var fails = __webpack_require__(9039);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ 2812:
/***/ ((module) => {

"use strict";

var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw new $TypeError('Not enough arguments');
  return passed;
};


/***/ }),

/***/ 8622:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(4475);
var isCallable = __webpack_require__(4901);

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 8227:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(4475);
var shared = __webpack_require__(5745);
var hasOwn = __webpack_require__(9297);
var uid = __webpack_require__(3392);
var NATIVE_SYMBOL = __webpack_require__(4495);
var USE_SYMBOL_AS_UID = __webpack_require__(7040);

var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 6573:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(3724);
var defineBuiltInAccessor = __webpack_require__(2106);
var isDetached = __webpack_require__(3238);

var ArrayBufferPrototype = ArrayBuffer.prototype;

if (DESCRIPTORS && !('detached' in ArrayBufferPrototype)) {
  defineBuiltInAccessor(ArrayBufferPrototype, 'detached', {
    configurable: true,
    get: function detached() {
      return isDetached(this);
    }
  });
}


/***/ }),

/***/ 7936:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(6518);
var $transfer = __webpack_require__(5636);

// `ArrayBuffer.prototype.transferToFixedLength` method
// https://tc39.es/proposal-arraybuffer-transfer/#sec-arraybuffer.prototype.transfertofixedlength
if ($transfer) $({ target: 'ArrayBuffer', proto: true }, {
  transferToFixedLength: function transferToFixedLength() {
    return $transfer(this, arguments.length ? arguments[0] : undefined, false);
  }
});


/***/ }),

/***/ 8100:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(6518);
var $transfer = __webpack_require__(5636);

// `ArrayBuffer.prototype.transfer` method
// https://tc39.es/proposal-arraybuffer-transfer/#sec-arraybuffer.prototype.transfer
if ($transfer) $({ target: 'ArrayBuffer', proto: true }, {
  transfer: function transfer() {
    return $transfer(this, arguments.length ? arguments[0] : undefined, true);
  }
});


/***/ }),

/***/ 4114:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(6518);
var toObject = __webpack_require__(8981);
var lengthOfArrayLike = __webpack_require__(6198);
var setArrayLength = __webpack_require__(4527);
var doesNotExceedSafeInteger = __webpack_require__(6837);
var fails = __webpack_require__(9039);

var INCORRECT_TO_LENGTH = fails(function () {
  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
});

// V8 <= 121 and Safari <= 15.4; FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var properErrorOnNonWritableLength = function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
};

var FORCED = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  }
});


/***/ }),

/***/ 3609:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(6518);
var toObject = __webpack_require__(8981);
var lengthOfArrayLike = __webpack_require__(6198);
var setArrayLength = __webpack_require__(4527);
var deletePropertyOrThrow = __webpack_require__(4606);
var doesNotExceedSafeInteger = __webpack_require__(6837);

// IE8-
var INCORRECT_RESULT = [].unshift(0) !== 1;

// V8 ~ Chrome < 71 and Safari <= 15.4, FF < 23 throws InternalError
var properErrorOnNonWritableLength = function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).unshift();
  } catch (error) {
    return error instanceof TypeError;
  }
};

var FORCED = INCORRECT_RESULT || !properErrorOnNonWritableLength();

// `Array.prototype.unshift` method
// https://tc39.es/ecma262/#sec-array.prototype.unshift
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  unshift: function unshift(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    if (argCount) {
      doesNotExceedSafeInteger(len + argCount);
      var k = len;
      while (k--) {
        var to = k + argCount;
        if (k in O) O[to] = O[k];
        else deletePropertyOrThrow(O, to);
      }
      for (var j = 0; j < argCount; j++) {
        O[j] = arguments[j];
      }
    } return setArrayLength(O, len + argCount);
  }
});


/***/ }),

/***/ 4979:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(6518);
var global = __webpack_require__(4475);
var getBuiltIn = __webpack_require__(7751);
var createPropertyDescriptor = __webpack_require__(6980);
var defineProperty = (__webpack_require__(4913).f);
var hasOwn = __webpack_require__(9297);
var anInstance = __webpack_require__(679);
var inheritIfRequired = __webpack_require__(3167);
var normalizeStringArgument = __webpack_require__(2603);
var DOMExceptionConstants = __webpack_require__(5002);
var clearErrorStack = __webpack_require__(6193);
var DESCRIPTORS = __webpack_require__(3724);
var IS_PURE = __webpack_require__(6395);

var DOM_EXCEPTION = 'DOMException';
var Error = getBuiltIn('Error');
var NativeDOMException = getBuiltIn(DOM_EXCEPTION);

var $DOMException = function DOMException() {
  anInstance(this, DOMExceptionPrototype);
  var argumentsLength = arguments.length;
  var message = normalizeStringArgument(argumentsLength < 1 ? undefined : arguments[0]);
  var name = normalizeStringArgument(argumentsLength < 2 ? undefined : arguments[1], 'Error');
  var that = new NativeDOMException(message, name);
  var error = new Error(message);
  error.name = DOM_EXCEPTION;
  defineProperty(that, 'stack', createPropertyDescriptor(1, clearErrorStack(error.stack, 1)));
  inheritIfRequired(that, this, $DOMException);
  return that;
};

var DOMExceptionPrototype = $DOMException.prototype = NativeDOMException.prototype;

var ERROR_HAS_STACK = 'stack' in new Error(DOM_EXCEPTION);
var DOM_EXCEPTION_HAS_STACK = 'stack' in new NativeDOMException(1, 2);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var descriptor = NativeDOMException && DESCRIPTORS && Object.getOwnPropertyDescriptor(global, DOM_EXCEPTION);

// Bun ~ 0.1.1 DOMException have incorrect descriptor and we can't redefine it
// https://github.com/Jarred-Sumner/bun/issues/399
var BUGGY_DESCRIPTOR = !!descriptor && !(descriptor.writable && descriptor.configurable);

var FORCED_CONSTRUCTOR = ERROR_HAS_STACK && !BUGGY_DESCRIPTOR && !DOM_EXCEPTION_HAS_STACK;

// `DOMException` constructor patch for `.stack` where it's required
// https://webidl.spec.whatwg.org/#es-DOMException-specialness
$({ global: true, constructor: true, forced: IS_PURE || FORCED_CONSTRUCTOR }, { // TODO: fix export logic
  DOMException: FORCED_CONSTRUCTOR ? $DOMException : NativeDOMException
});

var PolyfilledDOMException = getBuiltIn(DOM_EXCEPTION);
var PolyfilledDOMExceptionPrototype = PolyfilledDOMException.prototype;

if (PolyfilledDOMExceptionPrototype.constructor !== PolyfilledDOMException) {
  if (!IS_PURE) {
    defineProperty(PolyfilledDOMExceptionPrototype, 'constructor', createPropertyDescriptor(1, PolyfilledDOMException));
  }

  for (var key in DOMExceptionConstants) if (hasOwn(DOMExceptionConstants, key)) {
    var constant = DOMExceptionConstants[key];
    var constantName = constant.s;
    if (!hasOwn(PolyfilledDOMException, constantName)) {
      defineProperty(PolyfilledDOMException, constantName, createPropertyDescriptor(6, constant.c));
    }
  }
}


/***/ }),

/***/ 4603:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var defineBuiltIn = __webpack_require__(6840);
var uncurryThis = __webpack_require__(9504);
var toString = __webpack_require__(655);
var validateArgumentsLength = __webpack_require__(2812);

var $URLSearchParams = URLSearchParams;
var URLSearchParamsPrototype = $URLSearchParams.prototype;
var append = uncurryThis(URLSearchParamsPrototype.append);
var $delete = uncurryThis(URLSearchParamsPrototype['delete']);
var forEach = uncurryThis(URLSearchParamsPrototype.forEach);
var push = uncurryThis([].push);
var params = new $URLSearchParams('a=1&a=2&b=3');

params['delete']('a', 1);
// `undefined` case is a Chromium 117 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=14222
params['delete']('b', undefined);

if (params + '' !== 'a=2') {
  defineBuiltIn(URLSearchParamsPrototype, 'delete', function (name /* , value */) {
    var length = arguments.length;
    var $value = length < 2 ? undefined : arguments[1];
    if (length && $value === undefined) return $delete(this, name);
    var entries = [];
    forEach(this, function (v, k) { // also validates `this`
      push(entries, { key: k, value: v });
    });
    validateArgumentsLength(length, 1);
    var key = toString(name);
    var value = toString($value);
    var index = 0;
    var dindex = 0;
    var found = false;
    var entriesLength = entries.length;
    var entry;
    while (index < entriesLength) {
      entry = entries[index++];
      if (found || entry.key === key) {
        found = true;
        $delete(this, entry.key);
      } else dindex++;
    }
    while (dindex < entriesLength) {
      entry = entries[dindex++];
      if (!(entry.key === key && entry.value === value)) append(this, entry.key, entry.value);
    }
  }, { enumerable: true, unsafe: true });
}


/***/ }),

/***/ 7566:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var defineBuiltIn = __webpack_require__(6840);
var uncurryThis = __webpack_require__(9504);
var toString = __webpack_require__(655);
var validateArgumentsLength = __webpack_require__(2812);

var $URLSearchParams = URLSearchParams;
var URLSearchParamsPrototype = $URLSearchParams.prototype;
var getAll = uncurryThis(URLSearchParamsPrototype.getAll);
var $has = uncurryThis(URLSearchParamsPrototype.has);
var params = new $URLSearchParams('a=1');

// `undefined` case is a Chromium 117 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=14222
if (params.has('a', 2) || !params.has('a', undefined)) {
  defineBuiltIn(URLSearchParamsPrototype, 'has', function has(name /* , value */) {
    var length = arguments.length;
    var $value = length < 2 ? undefined : arguments[1];
    if (length && $value === undefined) return $has(this, name);
    var values = getAll(this, name); // also validates `this`
    validateArgumentsLength(length, 1);
    var value = toString($value);
    var index = 0;
    while (index < values.length) {
      if (values[index++] === value) return true;
    } return false;
  }, { enumerable: true, unsafe: true });
}


/***/ }),

/***/ 8721:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(3724);
var uncurryThis = __webpack_require__(9504);
var defineBuiltInAccessor = __webpack_require__(2106);

var URLSearchParamsPrototype = URLSearchParams.prototype;
var forEach = uncurryThis(URLSearchParamsPrototype.forEach);

// `URLSearchParams.prototype.size` getter
// https://github.com/whatwg/url/pull/734
if (DESCRIPTORS && !('size' in URLSearchParamsPrototype)) {
  defineBuiltInAccessor(URLSearchParamsPrototype, 'size', {
    get: function size() {
      var count = 0;
      forEach(this, function () { count++; });
      return count;
    },
    configurable: true,
    enumerable: true
  });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ epub)
});

// NAMESPACE OBJECT: ./src/utils/core.js
var core_namespaceObject = {};
__webpack_require__.r(core_namespaceObject);
__webpack_require__.d(core_namespaceObject, {
  blob2base64: () => (blob2base64),
  borders: () => (borders),
  bounds: () => (bounds),
  createBase64Url: () => (createBase64Url),
  createBlob: () => (createBlob),
  createBlobUrl: () => (createBlobUrl),
  defaults: () => (defaults),
  documentHeight: () => (documentHeight),
  extend: () => (extend),
  filterChildren: () => (filterChildren),
  findChildren: () => (findChildren),
  getParentByTagName: () => (getParentByTagName),
  indexOfElementNode: () => (indexOfElementNode),
  indexOfNode: () => (indexOfNode),
  indexOfSorted: () => (indexOfSorted),
  indexOfTextNode: () => (indexOfTextNode),
  insert: () => (insert),
  isElement: () => (isElement),
  isFloat: () => (isFloat),
  isNumber: () => (isNumber),
  isXml: () => (isXml),
  locationOf: () => (locationOf),
  nodeBounds: () => (nodeBounds),
  parents: () => (parents),
  parse: () => (parse),
  prefixed: () => (prefixed),
  qs: () => (qs),
  qsa: () => (qsa),
  qsp: () => (qsp),
  querySelectorByType: () => (querySelectorByType),
  requestAnimationFrame: () => (core_requestAnimationFrame),
  revokeBlobUrl: () => (revokeBlobUrl),
  sprint: () => (sprint),
  treeWalker: () => (treeWalker),
  type: () => (type),
  uuid: () => (uuid),
  walk: () => (walk),
  windowBounds: () => (windowBounds)
});

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array-buffer.detached.js
var es_array_buffer_detached = __webpack_require__(6573);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array-buffer.transfer.js
var es_array_buffer_transfer = __webpack_require__(8100);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array-buffer.transfer-to-fixed-length.js
var es_array_buffer_transfer_to_fixed_length = __webpack_require__(7936);
// EXTERNAL MODULE: ./node_modules/event-emitter/index.js
var event_emitter = __webpack_require__(3068);
var event_emitter_default = /*#__PURE__*/__webpack_require__.n(event_emitter);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(4114);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.unshift.js
var es_array_unshift = __webpack_require__(3609);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-exception.stack.js
var web_dom_exception_stack = __webpack_require__(4979);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.delete.js
var web_url_search_params_delete = __webpack_require__(4603);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.has.js
var web_url_search_params_has = __webpack_require__(7566);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.size.js
var web_url_search_params_size = __webpack_require__(8721);
// EXTERNAL MODULE: ./node_modules/@xmldom/xmldom/lib/index.js
var lib = __webpack_require__(8978);
;// CONCATENATED MODULE: ./src/utils/core.js






/**
 * @module core
 */



/**
 * Vendor prefixed requestAnimationFrame
 * @returns {function} requestAnimationFrame
 */
const core_requestAnimationFrame = typeof window != "undefined" ? window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame : false;
const _URL = typeof URL != "undefined" ? URL : typeof window != "undefined" ? window.URL || window.webkitURL || window.mozURL : undefined;

/**
 * Generates a UUID
 * @link https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
 * @returns {string} uuid
 */
const uuid = () => {
  let d = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : r & 0x7 | 0x8).toString(16);
  });
  return uuid;
};

/**
 * Gets the height of a document
 * @returns {number} height
 */
const documentHeight = () => {
  return Math.max(document.documentElement.clientHeight, document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight);
};

/**
 * Checks if a node is an element
 * @param {object} obj
 * @returns {boolean}
 */
const isElement = obj => {
  return !!(obj && obj.nodeType == Node.ELEMENT_NODE);
};

/**
 * isNumber
 * @param {any} n
 * @returns {boolean}
 */
const isNumber = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

/**
 * isFloat
 * @param {any} n
 * @returns {boolean}
 */
const isFloat = n => {
  const f = parseFloat(n);
  if (isNumber(n) === false) {
    return false;
  }
  if (typeof n === "string" && n.indexOf(".") > -1) {
    return true;
  }
  return Math.floor(f) !== f;
};

/**
 * Get a prefixed css property
 * @param {string} unprefixed
 * @returns {string}
 */
const prefixed = unprefixed => {
  const vendors = ["Webkit", "webkit", "Moz", "O", "ms"];
  const prefixes = ["-webkit-", "-webkit-", "-moz-", "-o-", "-ms-"];
  const lower = unprefixed.toLowerCase();
  const length = vendors.length;
  if (typeof document === "undefined" || typeof document.body.style[lower] !== "undefined") {
    return unprefixed;
  }
  for (let i = 0; i < length; i++) {
    if (typeof document.body.style[prefixes[i] + lower] !== "undefined") {
      return prefixes[i] + lower;
    }
  }
  return unprefixed;
};

/**
 * Apply defaults to an object
 * @param {object} obj
 * @returns {object}
 */
const defaults = (obj, ...args) => {
  for (let i = 1, length = args.length; i < length; i++) {
    const source = args[i];
    for (const prop in source) {
      if (obj[prop] === void 0) obj[prop] = source[prop];
    }
  }
  return obj;
};

/**
 * Extend properties of an object
 * @param {object} target
 * @returns {object}
 */
const extend = (target, ...args) => {
  args.forEach(source => {
    if (!source) return;
    Object.getOwnPropertyNames(source).forEach(prop => {
      Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
    });
  });
  return target;
};

/**
 * Finds where something would fit into a sorted array
 * @param {any} item
 * @param {array} array
 * @param {function} [compareFunction]
 * @param {function} [start]
 * @param {function} [end]
 * @returns {number} location (in array)
 */
const locationOf = (item, array, compareFunction, start, end) => {
  const _start = start || 0;
  const _end = end || array.length;
  const pivot = parseInt(_start + (_end - _start) / 2);
  if (!compareFunction) {
    compareFunction = (a, b) => {
      if (a > b) return 1;
      if (a < b) return -1;
      if (a == b) return 0;
    };
  }
  if (_end - _start <= 0) {
    return pivot;
  }
  const compared = compareFunction(array[pivot], item);
  if (_end - _start === 1) {
    return compared >= 0 ? pivot : pivot + 1;
  }
  if (compared === 0) {
    return pivot;
  }
  if (compared === -1) {
    return locationOf(item, array, compareFunction, pivot, _end);
  } else {
    return locationOf(item, array, compareFunction, _start, pivot);
  }
};

/**
 * Fast quicksort insert for sorted array -- based on:
 * @link https://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
 * @param {any} item
 * @param {array} array
 * @param {function} [compareFunction]
 * @returns {number} location (in array)
 */
const insert = (item, array, compareFunction) => {
  const location = locationOf(item, array, compareFunction);
  array.splice(location, 0, item);
  return location;
};

/**
 * Finds index of something in a sorted array
 * Returns -1 if not found
 * @param {any} item
 * @param {array} array
 * @param {function} [compareFunction]
 * @param {function} [start]
 * @param {function} [end]
 * @returns {number} index (in array) or -1
 */
const indexOfSorted = (item, array, compareFunction, start, end) => {
  const _start = start || 0;
  const _end = end || array.length;
  const pivot = parseInt(_start + (_end - _start) / 2);
  if (!compareFunction) {
    compareFunction = (a, b) => {
      if (a > b) return 1;
      if (a < b) return -1;
      if (a == b) return 0;
    };
  }
  if (_end - _start <= 0) {
    return -1; // Not found
  }
  const compared = compareFunction(array[pivot], item);
  if (_end - _start === 1) {
    return compared === 0 ? pivot : -1;
  }
  if (compared === 0) {
    return pivot; // Found
  }
  if (compared === -1) {
    return indexOfSorted(item, array, compareFunction, pivot, _end);
  } else {
    return indexOfSorted(item, array, compareFunction, _start, pivot);
  }
};

/**
 * Find the bounds of an element
 * taking padding and margin into account
 * @param {Element} el
 * @returns {{ height: Number, width: Number }}
 */
const bounds = el => {
  const style = window.getComputedStyle(el);
  const widthProps = ["width", "paddingRight", "paddingLeft", "marginRight", "marginLeft", "borderRightWidth", "borderLeftWidth"];
  const heightProps = ["height", "paddingTop", "paddingBottom", "marginTop", "marginBottom", "borderTopWidth", "borderBottomWidth"];
  const ret = {
    height: 0,
    width: 0
  };
  widthProps.forEach(prop => {
    ret.width += parseFloat(style[prop]) || 0;
  });
  heightProps.forEach(prop => {
    ret.height += parseFloat(style[prop]) || 0;
  });
  return ret;
};

/**
 * Find the bounds of an element
 * taking padding, margin and borders into account
 * @param {Element} el
 * @returns {{ height: Number, width: Number }}
 */
const borders = el => {
  const style = window.getComputedStyle(el);
  const widthProps = ["paddingRight", "paddingLeft", "marginRight", "marginLeft", "borderRightWidth", "borderLeftWidth"];
  const heightProps = ["paddingTop", "paddingBottom", "marginTop", "marginBottom", "borderTopWidth", "borderBottomWidth"];
  const ret = {
    height: 0,
    width: 0
  };
  widthProps.forEach(prop => {
    ret.width += parseFloat(style[prop]) || 0;
  });
  heightProps.forEach(prop => {
    ret.height += parseFloat(style[prop]) || 0;
  });
  return ret;
};

/**
 * Find the bounds of any node
 * allows for getting bounds of text nodes by wrapping them in a range
 * @param {Node} node
 * @returns {DOMRect}
 */
const nodeBounds = node => {
  let rect;
  const doc = node.ownerDocument;
  if (node.nodeType == Node.TEXT_NODE) {
    const range = doc.createRange();
    range.selectNodeContents(node);
    rect = range.getBoundingClientRect();
  } else {
    rect = node.getBoundingClientRect();
  }
  return rect;
};

/**
 * Find the equivalent of getBoundingClientRect of a browser window
 * @returns {{ width: Number, height: Number, top: Number, left: Number, right: Number, bottom: Number }}
 */
const windowBounds = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return {
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width: width,
    height: height
  };
};

/**
 * Gets the index of a node in its parent
 * @param {Node} node
 * @param {string} typeId
 * @return {number} index
 */
const indexOfNode = (node, typeId) => {
  const parent = node.parentNode;
  const children = parent.childNodes;
  let index = -1;
  for (let i = 0; i < children.length; i++) {
    const sib = children[i];
    if (sib.nodeType === typeId) {
      index++;
    }
    if (sib == node) break;
  }
  return index;
};

/**
 * Gets the index of a text node in its parent
 * @param {Node} textNode
 * @returns {number} index
 */
const indexOfTextNode = textNode => {
  return indexOfNode(textNode, Node.TEXT_NODE);
};

/**
 * Gets the index of an element node in its parent
 * @param {Element} elementNode
 * @returns {number} index
 */
const indexOfElementNode = elementNode => {
  return indexOfNode(elementNode, Node.ELEMENT_NODE);
};

/**
 * Check if extension is xml
 * @param {string} ext
 * @returns {boolean}
 */
const isXml = ext => {
  return ["xml", "opf", "ncx"].indexOf(ext) > -1;
};

/**
 * Create a new blob
 * @param {any} content
 * @param {string} mime
 * @returns {Blob}
 */
const createBlob = (content, mime) => {
  return new Blob([content], {
    type: mime
  });
};

/**
 * Create a new blob url
 * @param {any} content
 * @param {string} mime
 * @returns {string} url
 */
const createBlobUrl = (content, mime) => {
  const blob = createBlob(content, mime);
  return _URL.createObjectURL(blob);
};

/**
 * Remove a blob url
 * @param {string} url
 */
const revokeBlobUrl = url => {
  return _URL.revokeObjectURL(url);
};

/**
 * Create a new base64 encoded url
 * @param {any} content
 * @param {string} mime
 * @returns {string} url
 */
const createBase64Url = (content, mime) => {
  if (typeof content !== "string") {
    // Only handles strings
    return;
  }
  const data = btoa(content);
  const datauri = "data:" + mime + ";base64," + data;
  return datauri;
};

/**
 * Get type of an object
 * @param {object} obj
 * @returns {string} type
 */
const type = obj => {
  return Object.prototype.toString.call(obj).slice(8, -1);
};

/**
 * Parse xml (or html) markup
 * @param {string} markup
 * @param {string} mime
 * @param {boolean} forceXMLDom force using xmlDom to parse instead of native parser
 * @returns {Document} document
 */
const parse = (markup, mime, forceXMLDom) => {
  let Parser;
  if (typeof DOMParser === "undefined" || forceXMLDom) {
    Parser = lib.DOMParser;
  } else {
    Parser = DOMParser;
  }

  // Remove byte order mark before parsing
  // https://www.w3.org/International/questions/qa-byte-order-mark
  if (markup.charCodeAt(0) === 0xFEFF) {
    markup = markup.slice(1);
  }
  return new Parser().parseFromString(markup, mime);
};

/**
 * querySelector polyfill
 * @param {Element} el
 * @param {string} sel selector string
 * @returns {Element} element
 */
const qs = (el, sel) => {
  if (!el) {
    throw new Error("No Element Provided");
  }
  if (typeof el.querySelector !== "undefined") {
    return el.querySelector(sel);
  } else {
    const elements = el.getElementsByTagName(sel);
    if (elements.length) {
      return elements[0];
    }
  }
};

/**
 * querySelectorAll polyfill
 * @param {Element} el
 * @param {string} sel selector string
 * @returns {Element[]} elements
 */
const qsa = (el, sel) => {
  if (typeof el.querySelector !== "undefined") {
    return el.querySelectorAll(sel);
  } else {
    return el.getElementsByTagName(sel);
  }
};

/**
 * querySelector by property
 * @param {Element} el
 * @param {string} sel selector string
 * @param {object[]} props
 * @returns {Element[]} elements
 */
const qsp = (el, sel, props) => {
  if (typeof el.querySelector !== "undefined") {
    sel += "[";
    for (const prop in props) {
      sel += prop + "~='" + props[prop] + "'";
    }
    sel += "]";
    return el.querySelector(sel);
  } else {
    const q = el.getElementsByTagName(sel);
    const filtered = Array.prototype.slice.call(q, 0).filter(el => {
      for (const prop in props) {
        if (el.getAttribute(prop) === props[prop]) {
          return true;
        }
      }
      return false;
    });
    if (filtered) {
      return filtered[0];
    }
  }
};

/**
 * Sprint through all text nodes in a document
 * @param {Element} root element to start with
 * @param {function} func function to run on each element
 */
const sprint = (root, func) => {
  const doc = root.ownerDocument || root;
  if (typeof doc.createTreeWalker !== "undefined") {
    treeWalker(root, func, NodeFilter.SHOW_TEXT);
  } else {
    walk(root, node => {
      if (node && node.nodeType === Node.TEXT_NODE) {
        func(node);
      }
    }, true);
  }
};

/**
 * Create a treeWalker
 * @param {Element} root element to start with
 * @param {function} func function to run on each element
 * @param {function|object} filter function or object to filter with
 */
const treeWalker = (root, func, filter) => {
  const treeWalker = document.createTreeWalker(root, filter, null, false);
  let node;
  while (node = treeWalker.nextNode()) {
    func(node);
  }
};

/**
 * @param {Node} node
 * @param {method} callback false for continue,true for break inside callback
 * @returns {boolean}
 */
const walk = (node, callback) => {
  if (callback(node)) {
    return true;
  }
  node = node.firstChild;
  if (node) {
    do {
      let walked = walk(node, callback); // recursive call
      if (walked) {
        return true;
      }
      node = node.nextSibling;
    } while (node);
  }
  return false;
};

/**
 * Convert a blob to a base64 encoded string
 * @param {Blog} blob
 * @returns {Promise}
 */
const blob2base64 = blob => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

/**
 * querySelector with filter by epub type
 * @param {Element} html
 * @param {string} element element type to find
 * @param {string} type epub type to find
 * @returns {Element[]} elements
 */
const querySelectorByType = (html, element, type) => {
  let query;
  if (typeof html.querySelector !== "undefined") {
    query = html.querySelector(`${element}[*|type="${type}"]`);
  }
  // Handle IE not supporting namespaced epub:type in querySelector
  if (!query || query.length === 0) {
    query = qsa(html, element);
    for (let i = 0; i < query.length; i++) {
      if (query[i].getAttributeNS("http://www.idpf.org/2007/ops", "type") === type || query[i].getAttribute("epub:type") === type) {
        return query[i];
      }
    }
  } else {
    return query;
  }
};

/**
 * Find direct descendents of an element
 * @param {Element} el
 * @returns {Element[]} children
 */
const findChildren = el => {
  const result = [];
  const childNodes = el.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    if (node.nodeType === Node.ELEMENT_NODE) {
      result.push(node);
    }
  }
  return result;
};

/**
 * Find all parents (ancestors) of an element
 * @param {Node} node
 * @returns {Node[]} parents
 */
const parents = node => {
  const nodes = [node];
  for (; node; node = node.parentNode) {
    nodes.unshift(node);
  }
  return nodes;
};

/**
 * Find all direct descendents of a specific type
 * @param {Element} el
 * @param {string} nodeName
 * @param {boolean} [single]
 * @returns {Element[]} children
 */
const filterChildren = (el, nodeName, single) => {
  const result = [];
  const childNodes = el.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === nodeName) {
      if (single) {
        return node;
      } else {
        result.push(node);
      }
    }
  }
  if (!single) {
    return result;
  }
};

/**
 * Filter all parents (ancestors) with tag name
 * @param {Node} node
 * @param {string} tagname
 * @returns {Node[]} parents
 */
const getParentByTagName = (node, tagname) => {
  if (node === null || tagname === "") return;
  let parent = node.parentNode;
  while (parent.nodeType === Node.ELEMENT_NODE) {
    if (parent.tagName.toLowerCase() === tagname) {
      return parent;
    }
    parent = parent.parentNode;
  }
};
;// CONCATENATED MODULE: ./src/utils/defer.js


/**
 * Creates a new pending promise and provides methods to resolve or reject it.
 */
class Defer {
  constructor() {
    /**
     * @member {string} id
     * @memberof Defer
     * @readonly
     */
    this.id = uuid();
    /**
     * A method to resolve the associated Promise with the value passed.
     * If the promise is already settled it does nothing.
     * @member {method} resolve
     * @param {anything} value : This value is used to resolve the promise
     * If the value is a Promise then the associated promise assumes the state
     * of Promise passed as value.
     * @memberof Defer
     * @readonly
     */
    this.resolve = null;
    /**
     * A method to reject the associated Promise with the value passed.
     * If the promise is already settled it does nothing.
     * @member {method} reject
     * @param {anything} reason: The reason for the rejection of the Promise.
     * Generally its an Error object. If however a Promise is passed, then the Promise
     * itself will be the reason for rejection no matter the state of the Promise.
     * @memberof Defer
     * @readonly
     */
    this.reject = null;
    /**
     * A newly created Pomise object.
     * Initially in pending state.
     * @member {Promise} promise
     * @memberof Defer
     * @readonly
     */
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
/* harmony default export */ const defer = (Defer);
;// CONCATENATED MODULE: ./src/utils/path.js
/* provided dependency */ var process = __webpack_require__(5606);




/**
 * Creates a Path object for parsing and manipulation of a path strings
 * @link https://nodejs.org/api/path.html
 */
class Path {
  /**
   * Constructor
   * @param {string} uri a url string (relative or absolute)
   */
  constructor(uri) {
    if (uri.indexOf("://") > -1) {
      uri = new URL(uri).pathname;
    }
    const parsed = this.parse(uri);
    /**
     * @member {string} directory
     * @memberof Path
     * @readonly
     */
    this.directory = parsed.dir + "/";
    /**
     * @member {string} filename
     * @memberof Path
     * @readonly
     */
    this.filename = parsed.base;
    /**
     * @member {string} extension
     * @memberof Path
     * @readonly
     */
    this.extension = parsed.ext.slice(1);
    /**
     * @member {string} path
     * @memberof Path
     * @readonly
     */
    this.path = uri;
  }

  /**
   * Parse the path
   * @link https://nodejs.org/api/path.html#path_path_parse_path
   * @param {string} path
   * @returns {object}
   */
  parse(path) {
    const ret = {
      root: "",
      dir: "",
      base: "",
      ext: "",
      name: ""
    };
    if (path.length === 0) {
      return ret;
    }
    const parts = this.splitPath(path);
    if (!parts || parts.length !== 4) {
      throw new Error(`Invalid path: ${path}`);
    }
    ret.root = parts[0];
    if (this.isDirectory(path)) {
      ret.dir = parts[0] + parts[1] + parts[2];
    } else {
      ret.dir = parts[0] + parts[1].slice(0, -1);
      ret.base = parts[2];
      ret.ext = parts[3];
      ret.name = parts[2].slice(0, parts[2].length - parts[3].length);
    }
    return ret;
  }

  /**
   * dirname
   * @link https://nodejs.org/api/path.html#pathdirnamepath
   * @param {string} path 
   * @returns {string}
   */
  dirname(path) {
    const result = this.splitPath(path);
    const root = result[0];
    const dir = result[1];
    if (!root && !dir) {
      return ".";
    }
    return root + dir;
  }

  /**
   * isAbsolute
   * @link https://nodejs.org/api/path.html#pathisabsolutepath
   * @param {string} path
   * @returns {boolean}
   */
  isAbsolute(path) {
    return path.charAt(0) === "/";
  }

  /**
   * Check if path ends with a directory
   * @param {string} path
   * @returns {boolean}
   */
  isDirectory(path) {
    return path.charAt(path.length - 1) === "/";
  }

  /**
   * Resolve path
   * @link https://nodejs.org/api/path.html#pathresolvepaths
   * @returns {string} resolved
   */
  resolve() {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for (let i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      let path;
      if (i >= 0) {
        path = arguments[i];
      } else {
        path = process ? process.cwd() : "/";
      }
      if (path.length === 0) {
        continue;
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = this.isAbsolute(path);
    }
    resolvedPath = this.normalizeArray(resolvedPath.split("/"), !resolvedAbsolute).join("/");
    return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
  }

  /**
   * Relative path resolve
   * @link https://nodejs.org/api/path.html#pathrelativefrom-to
   * @param {string} from
   * @param {string} to 
   * @returns {string} relative path
   */
  relative(from, to) {
    if (from === to) return "";
    from = this.resolve(from);
    to = this.resolve(to);
    if (from === to) return "";
    const fromParts = this.trimArray(from.split("/"));
    const toParts = this.trimArray(to.split("/"));
    const length = Math.min(fromParts.length, toParts.length);
    let samePartsLength = length;
    for (let i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    let outputParts = [];
    for (let i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  }

  /**
   * Normalize path
   * @link https://nodejs.org/api/path.html#pathnormalizepath
   * @param {string} path 
   * @returns {string}
   */
  normalize(path) {
    const isAbsolute = this.isAbsolute(path);
    const trailingSlash = path && path[path.length - 1] === "/";
    path = this.normalizeArray(path.split("/"), !isAbsolute).join("/");
    if (!path && !isAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isAbsolute ? "/" : "") + path;
  }

  /**
   * Return the path string
   * @returns {string} path
   */
  toString() {
    return this.path;
  }
  normalizeArray(parts, allowAboveRoot) {
    const res = [];
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (!p || p === ".") {
        continue;
      }
      if (p === "..") {
        if (res.length && res[res.length - 1] !== "..") {
          res.pop();
        } else if (allowAboveRoot) {
          res.push("..");
        }
      } else {
        res.push(p);
      }
    }
    return res;
  }
  splitPath(filename) {
    const pattern = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return pattern.exec(filename).slice(1);
  }
  trimArray(arr) {
    const lastIndex = arr.length - 1;
    let start = 0;
    for (; start <= lastIndex; start++) {
      if (arr[start]) {
        break;
      }
    }
    let end = lastIndex;
    for (; end >= 0; end--) {
      if (arr[end]) {
        break;
      }
    }
    if (start === 0 && end === lastIndex) {
      return arr;
    }
    if (start > end) {
      return [];
    }
    return arr.slice(start, end + 1);
  }
}
/* harmony default export */ const utils_path = (Path);
;// CONCATENATED MODULE: ./src/utils/url.js





/**
 * Creates a Url object for parsing and manipulation of a url string
 */
class Url {
  /**
   * 
   * @param {string} url a url string (relative or absolute)
   * @param {string} [base] optional base for the url, default to window.location.href
   */
  constructor(url, base) {
    this.Url = undefined;
    this.href = url;
    this.protocol = "";
    this.origin = "";
    this.hash = "";
    this.hash = "";
    this.search = "";
    this.base = base;
    const absolute = url.indexOf("://") > -1;
    if (!absolute && base !== false && typeof base !== "string" && window && window.location) {
      this.base = window.location.href;
    }
    let pathname = url;
    // URL Polyfill doesn't throw an error if base is empty
    if (absolute || this.base) {
      try {
        if (this.base) {
          // Safari doesn't like an undefined base
          this.Url = new URL(url, this.base);
        } else {
          this.Url = new URL(url);
        }
        this.href = this.Url.href;
        this.protocol = this.Url.protocol;
        this.origin = this.Url.origin;
        this.hash = this.Url.hash;
        this.search = this.Url.search;
        pathname = this.Url.pathname + (this.Url.search ? this.Url.search : "");
      } catch (e) {
        // Skip URL parsing
        this.Url = undefined;
        // resolve the pathname from the base
        if (this.base) {
          const basePath = new utils_path(this.base);
          pathname = basePath.resolve(pathname);
        }
        console.error(e);
      }
    }
    /**
     * @member {Path} path
     * @memberof Url
     * @readonly
     */
    this.path = new utils_path(pathname);
    this.directory = this.path.directory;
    this.filename = this.path.filename;
    this.extension = this.path.extension;
  }

  /**
   * Resolves a relative path to a absolute url
   * @param {string} path
   * @returns {string} url
   */
  resolve(path) {
    if (path.indexOf("://") > -1) {
      // is absolute
      return path;
    }
    const dir = this.path.directory;
    const fullpath = utils_path.prototype.resolve(dir, path);
    return this.origin + fullpath;
  }

  /**
   * Resolve a path relative to the url
   * @param {string} path
   * @returns {string} path
   */
  relative(path) {
    const dir = this.path.directory;
    return utils_path.prototype.relative(path, dir);
  }

  /**
   * toString
   * @returns {string}
   */
  toString() {
    return this.href;
  }
}
/* harmony default export */ const utils_url = (Url);
;// CONCATENATED MODULE: ./src/utils/queue.js




/**
 * Queue for handling tasks one at a time
 */
class Queue {
  /**
   * Constructor
   * @param {object} context what this will resolve to in the tasks
   */
  constructor(context) {
    this._q = [];
    this.context = context;
    this.tick = core_requestAnimationFrame;
    this.running = false;
    this.paused = false;
  }

  /**
   * Add an item to the queue
   * @return {Promise}
   */
  enqueue() {
    const task = [].shift.call(arguments);
    if (!task) {
      throw new Error("No Task Provided");
    }
    let queued;
    if (typeof task === "function") {
      const deferred = new defer();
      const promise = deferred.promise;
      queued = {
        task: task,
        args: arguments,
        //context: context,
        deferred: deferred,
        promise: promise
      };
    } else {
      // Task is a promise
      queued = {
        "promise": task
      };
    }
    this._q.push(queued);

    // Wait to start queue flush
    if (this.paused == false && !this.running) {
      // setTimeout(this.flush.bind(this), 0);
      // this.tick.call(window, this.run.bind(this));
      this.run();
    }
    return queued.promise;
  }

  /**
   * Run one item
   * @return {Promise}
   */
  dequeue() {
    let inwait;
    if (this._q.length && !this.paused) {
      inwait = this._q.shift();
      const task = inwait.task;
      if (task) {
        const result = task.apply(this.context, inwait.args);
        if (result && typeof result["then"] === "function") {
          // Task is a function that returns a promise
          return result.then(() => {
            inwait.deferred.resolve.apply(this.context, arguments);
          }, () => {
            inwait.deferred.reject.apply(this.context, arguments);
          });
        } else {
          // Task resolves immediately
          inwait.deferred.resolve.apply(this.context, result);
          return inwait.promise;
        }
      } else if (inwait.promise) {
        // Task is a promise
        return inwait.promise;
      }
    } else {
      inwait = new defer();
      inwait.deferred.resolve();
      return inwait.promise;
    }
  }

  /**
   * Run All Immediately
   */
  dump() {
    while (this._q.length) {
      this.dequeue();
    }
  }

  /**
   * Run all tasks sequentially, at convince
   * @return {Promise}
   */
  run() {
    if (!this.running) {
      this.running = true;
      this.defered = new defer();
    }
    this.tick.call(window, () => {
      if (this._q.length) {
        this.dequeue().then(() => {
          this.run();
        });
      } else {
        this.defered.resolve();
        this.running = undefined;
      }
    });

    // Unpause
    if (this.paused == true) {
      this.paused = false;
    }
    return this.defered.promise;
  }

  /**
   * Flush all, as quickly as possible
   * @return {Promise}
   */
  flush() {
    if (this.running) {
      return this.running;
    }
    if (this._q.length) {
      this.running = this.dequeue().then(() => {
        this.running = undefined;
        return this.flush();
      });
      return this.running;
    }
  }

  /**
   * Clear all items in wait
   */
  clear() {
    this._q = [];
  }

  /**
   * Get the number of tasks in the queue
   * @return {number} tasks
   */
  length() {
    return this._q.length;
  }

  /**
   * Pause a running queue
   */
  pause() {
    this.paused = true;
  }

  /**
   * End the queue
   */
  stop() {
    this._q = [];
    this.running = false;
    this.paused = true;
  }
}
/* harmony default export */ const queue = (Queue);
;// CONCATENATED MODULE: ./src/utils/rangeobject.js


/**
 * Lightweight Polyfill for DOM Range
 */
class RangeObject {
  constructor() {
    this.collapsed = false;
    this.commonAncestorContainer = undefined;
    this.endContainer = undefined;
    this.endOffset = undefined;
    this.startContainer = undefined;
    this.startOffset = undefined;
  }

  /**
   * Set start
   * @param {Node} startNode 
   * @param {Node} startOffset 
   */
  setStart(startNode, startOffset) {
    this.startContainer = startNode;
    this.startOffset = startOffset;
    if (!this.endContainer) {
      this.collapse(true);
    } else {
      this.commonAncestorContainer = this._commonAncestorContainer();
    }
    this._checkCollapsed();
  }

  /**
   * Set end
   * @param {Node} endNode 
   * @param {Node} endOffset 
   */
  setEnd(endNode, endOffset) {
    this.endContainer = endNode;
    this.endOffset = endOffset;
    if (!this.startContainer) {
      this.collapse(false);
    } else {
      this.collapsed = false;
      this.commonAncestorContainer = this._commonAncestorContainer();
    }
    this._checkCollapsed();
  }

  /**
   * collapse
   * @param {boolean} toStart 
   */
  collapse(toStart) {
    this.collapsed = true;
    if (toStart) {
      this.endContainer = this.startContainer;
      this.endOffset = this.startOffset;
      this.commonAncestorContainer = this.startContainer.parentNode;
    } else {
      this.startContainer = this.endContainer;
      this.startOffset = this.endOffset;
      this.commonAncestorContainer = this.endOffset.parentNode;
    }
  }

  /**
   * Select Node
   * @param {Node} referenceNode 
   */
  selectNode(referenceNode) {
    const parent = referenceNode.parentNode;
    const index = Array.prototype.indexOf.call(parent.childNodes, referenceNode);
    this.setStart(parent, index);
    this.setEnd(parent, index + 1);
  }

  /**
   * Select Node Contents
   * @param {Node} referenceNode 
   */
  selectNodeContents(referenceNode) {
    const endIndex = referenceNode.nodeType === Node.TEXT_NODE ? referenceNode.textContent.length : parent.childNodes.length;
    this.setStart(referenceNode, 0);
    this.setEnd(referenceNode, endIndex);
  }
  _commonAncestorContainer(startContainer, endContainer) {
    const startParents = parents(startContainer || this.startContainer);
    const endParents = parents(endContainer || this.endContainer);
    if (startParents[0] != endParents[0]) return undefined;
    for (let i = 0; i < startParents.length; i++) {
      if (startParents[i] != endParents[i]) {
        return startParents[i - 1];
      }
    }
  }
  _checkCollapsed() {
    if (this.startContainer === this.endContainer && this.startOffset === this.endOffset) {
      this.collapsed = true;
    } else {
      this.collapsed = false;
    }
  }
  toString() {
    // TODO: implement walking between start and end to find text
  }
}
/* harmony default export */ const rangeobject = (RangeObject);
;// CONCATENATED MODULE: ./src/epubcfi.js





/**
 * Parsing and creation of EpubCFIs: https://idpf.org/epub/linking/cfi/epub-cfi.html
 * 
 * Implements:
 * - Character Offset: `epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)`
 * - Simple Ranges: `epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)`
 * 
 * Does Not Implement:
 * - Temporal Offset `(~)`
 * - Spatial Offset `(@)`
 * - Temporal-Spatial Offset `(~ + @)`
 * - Text Location Assertion `([)`
 */
class EpubCFI {
  /**
   * Constructor
   * @param {string|Range|Node} [cfiFrom] 
   * @param {string|object} [base] 
   * @param {string} [ignoreClass] class to ignore when parsing DOM
   */
  constructor(cfiFrom, base, ignoreClass) {
    /**
     * @member {object} base
     * @memberof EpubCFI
     * @readonly
     */
    this.base = {};
    /**
     * @member {number} spinePos spine position
     * @memberof EpubCFI
     * @readonly
     */
    this.spinePos = 0; // For compatibility
    /**
     * @member {object} path
     * @memberof EpubCFI
     * @readonly
     */
    this.path = {};
    /**
     * @member {boolean} range
     * @memberof EpubCFI
     * @readonly
     */
    this.range = false;
    /**
     * @member {object} start
     * @memberof EpubCFI
     * @readonly
     */
    this.start = null;
    /**
     * @member {object} end
     * @memberof EpubCFI
     * @readonly
     */
    this.end = null;
    /**
     * @member {string} str EpubCFI string format
     * @memberof EpubCFI
     * @readonly
     */
    this.str = "";

    // Allow instantiation without the "new" keyword
    if (!(this instanceof EpubCFI)) {
      return new EpubCFI(cfiFrom, base, ignoreClass);
    }
    if (typeof base === "string") {
      this.base = this.parseComponent(base);
      this.spinePos = this.base.steps[1].index;
    } else if (typeof base === "object" && base.steps) {
      this.base = base;
    }
    const type = this.checkType(cfiFrom);
    if (type === "string") {
      return this.parse(cfiFrom);
    } else if (type === "range") {
      return this.fromRange(cfiFrom, this.base, ignoreClass);
    } else if (type === "node") {
      return this.fromNode(cfiFrom, this.base, ignoreClass);
    } else if (type === "EpubCFI" && cfiFrom.path) {
      return cfiFrom;
    } else if (cfiFrom === undefined) {
      return this;
    } else {
      throw new TypeError("not a valid argument for EpubCFI");
    }
  }

  /**
   * Check the type of constructor input
   * @param {string|Range|Node} cfi
   * @returns {string} argument type
   * @private
   */
  checkType(cfi) {
    if (typeof cfi === "undefined") {
      return undefined;
    } else if (this.isCfiString(cfi)) {
      return "string";
    } else if (typeof cfi === "object") {
      if (cfi instanceof Range || typeof cfi.startContainer !== "undefined") {
        return "range";
      } else if (cfi instanceof Node) {
        return "node";
      } else if (cfi instanceof EpubCFI) {
        return "EpubCFI";
      } else return undefined;
    } else return undefined;
  }

  /**
   * Collapse a CFI Range to a single CFI Position
   * @param {boolean} [toStart]
   */
  collapse(toStart) {
    if (this.range === false) return;
    if (toStart) {
      this.path.steps = this.path.steps.concat(this.start.steps);
      this.path.terminal = this.start.terminal;
    } else {
      this.path.steps = this.path.steps.concat(this.end.steps);
      this.path.terminal = this.end.terminal;
    }
    this.range = false;
  }

  /**
   * Compare which of two CFIs is earlier in the text
   * @param {string|EpubCFI} cfiOne 
   * @param {string|EpubCFI} cfiTwo 
   * @returns {number} First is earlier = -1, Second is earlier = 1, They are equal = 0 
   */
  compare(cfiOne, cfiTwo) {
    if (typeof cfiOne === "string") {
      cfiOne = new EpubCFI(cfiOne);
    }
    if (typeof cfiTwo === "string") {
      cfiTwo = new EpubCFI(cfiTwo);
    }
    // Compare Spine Positions
    if (cfiOne.spinePos > cfiTwo.spinePos) return 1;
    if (cfiOne.spinePos < cfiTwo.spinePos) return -1;
    let stepsA, terminalA;
    if (cfiOne.range) {
      stepsA = cfiOne.path.steps.concat(cfiOne.start.steps);
      terminalA = cfiOne.start.terminal;
    } else {
      stepsA = cfiOne.path.steps;
      terminalA = cfiOne.path.terminal;
    }
    let stepsB, terminalB;
    if (cfiTwo.range) {
      stepsB = cfiTwo.path.steps.concat(cfiTwo.start.steps);
      terminalB = cfiTwo.start.terminal;
    } else {
      stepsB = cfiTwo.path.steps;
      terminalB = cfiTwo.path.terminal;
    }
    // Compare Each Step in the First item
    for (let i = 0; i < stepsA.length; i++) {
      if (!stepsA[i]) return -1;
      if (!stepsB[i]) return 1;
      if (stepsA[i].index > stepsB[i].index) return 1;
      if (stepsA[i].index < stepsB[i].index) return -1;
    }
    // All steps in First equal to Second and First is Less Specific
    if (stepsA.length < stepsB.length) return -1;

    // Compare the character offset of the text node
    if (terminalA.offset > terminalB.offset) return 1;
    if (terminalA.offset < terminalB.offset) return -1;
    return 0; // CFI's are equal
  }

  /**
   * Generate chapter component
   * @param {number} spineNodeIndex
   * @param {number} position
   * @param {string} [id] 
   * @returns {string} EpubCFI string format
   */
  generateChapterComponent(spineNodeIndex, position, id) {
    const pos = parseInt(position);
    const index = (spineNodeIndex + 1) * 2;
    let cfi = "/" + index + "/";
    cfi += (pos + 1) * 2;
    if (id) cfi += "[" + id + "]";
    return cfi;
  }

  /**
   * Get chapter component
   * @param {string} cfiStr EpubCFI string format
   * @example in: /6/4!/4/1:0 out: /6/4
   * @returns {string} Base component
   * @private
   */
  getBaseComponent(cfiStr) {
    const indirection = cfiStr.split("!");
    return indirection[0];
  }

  /**
   * Get path component
   * @param {string} cfiStr EpubCFI string format
   * @example in: /6/4!/4/1:0 out: /4/1:0
   * @returns {string} Path component
   * @private
   */
  getPathComponent(cfiStr) {
    const indirection = cfiStr.split("!");
    if (indirection[1]) {
      const ranges = indirection[1].split(",");
      return ranges[0];
    }
  }

  /**
   * getRange
   * @param {string} cfiStr EubCFI string format
   * @example in: /6/4!/4/1:0
   * @returns {object[]} An array of ranges or null if the array length is not 3
   * @private
   */
  getRange(cfiStr) {
    const ranges = cfiStr.split(",");
    if (ranges.length === 3) {
      return [ranges[1], ranges[2]];
    }
    return null;
  }

  /**
   * getCharecterOffsetComponent (unused)
   * @param {string} cfiStr 
   * @returns {string}
   * @private
   */
  getCharecterOffsetComponent(cfiStr) {
    const arr = cfiStr.split(":");
    return arr[1] || "";
  }

  /**
   * joinSteps
   * @param {object[]} steps 
   * @returns {string} 
   * @private
   */
  joinSteps(steps) {
    if (!steps) return "";
    return steps.map(part => {
      let segment = "";
      if (part.type === "element") {
        segment += (part.index + 1) * 2;
      }
      if (part.type === "text") {
        segment += 1 + 2 * part.index; // TODO: double check that this is odd
      }
      if (part.id) {
        segment += "[" + part.id + "]";
      }
      return segment;
    }).join("/");
  }

  /**
   * pathTo
   * @param {Node} node 
   * @param {number} offset 
   * @param {string} [ignoreClass] 
   * @returns {object} segment object
   * @private
   */
  pathTo(node, offset, ignoreClass) {
    const segment = {
      steps: [],
      terminal: {
        offset: null,
        assertion: null
      }
    };
    let step,
      curNode = node;
    while (curNode && curNode.parentNode && curNode.parentNode.nodeType !== Node.DOCUMENT_NODE) {
      if (ignoreClass) {
        step = this.filteredStep(curNode, ignoreClass);
      } else {
        step = this.step(curNode);
      }
      if (step) segment.steps.unshift(step);
      curNode = curNode.parentNode;
    }
    if (offset !== null && offset >= 0) {
      segment.terminal.offset = offset;
      // Make sure we are getting to a textNode if there is an offset
      if (segment.steps[segment.steps.length - 1].type !== "text") {
        segment.steps.push({
          index: 0,
          type: "text"
        });
      }
    }
    return segment;
  }

  /**
   * equalStep
   * @param {object} stepA 
   * @param {object} stepB 
   * @returns {boolean}
   * @private
   */
  equalStep(stepA, stepB) {
    if (stepA && stepB && stepA.id === stepB.id && stepA.index === stepB.index && stepA.type === stepB.type) {
      return true;
    }
    return false;
  }

  /**
   * filter
   * @param {Node} node 
   * @param {string} [ignoreClass] 
   * @returns {Node} 
   * @private
   */
  filter(node, ignoreClass) {
    let parent;
    let isText;
    let needsIgnoring;
    if (node.nodeType === Node.TEXT_NODE) {
      isText = true;
      parent = node.parentNode;
      needsIgnoring = node.parentNode.classList.contains(ignoreClass);
    } else {
      isText = false;
      needsIgnoring = node.classList.contains(ignoreClass);
    }
    if (needsIgnoring && isText) {
      const prevSibling = parent.previousSibling;
      const nextSibling = parent.nextSibling;
      let sibling; // to join with

      // If the sibling is a text node, join the nodes
      if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
        sibling = prevSibling;
      } else if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
        sibling = nextSibling;
      }
      return sibling || node;
    } else if (needsIgnoring && !isText) {
      // Otherwise just skip the element node
      return null;
    } else {
      // No need to filter
      return node;
    }
  }

  /**
   * filteredPosition
   * @param {Node} node 
   * @param {string} [ignoreClass] 
   * @returns {number} index
   * @private
   */
  filteredPosition(node, ignoreClass) {
    let children, map;
    if (node.nodeType === Node.ELEMENT_NODE) {
      children = node.parentNode.children;
      map = this.normalizedMap(children, Node.ELEMENT_NODE, ignoreClass);
    } else {
      children = node.parentNode.childNodes;
      // Inside an ignored node
      if (node.parentNode.classList.contains(ignoreClass)) {
        node = node.parentNode;
        children = node.parentNode.childNodes;
      }
      map = this.normalizedMap(children, Node.TEXT_NODE, ignoreClass);
    }
    const index = Array.prototype.indexOf.call(children, node);
    return map[index];
  }

  /**
   * filteredStep
   * @param {Node} node 
   * @param {string} ignoreClass 
   * @returns {object} step
   * @private
   */
  filteredStep(node, ignoreClass) {
    const _node = this.filter(node, ignoreClass);

    // Node filtered, so ignore
    if (_node === null) return;
    return {
      id: _node.id,
      index: this.filteredPosition(_node, ignoreClass),
      tagName: _node.tagName,
      type: _node.nodeType === Node.TEXT_NODE ? "text" : "element"
    };
  }

  /**
   * findNode
   * @param {object[]} steps 
   * @param {Document} [doc] 
   * @param {string} [ignoreClass] 
   * @returns {Node}
   * @private
   */
  findNode(steps, doc, ignoreClass) {
    const _doc = doc || document;
    let container;
    if (ignoreClass) {
      container = this.walkToNode(steps, _doc, ignoreClass);
    } else if (typeof _doc.evaluate !== "undefined") {
      const xpath = this.stepsToXpath(steps);
      const xtype = XPathResult.FIRST_ORDERED_NODE_TYPE;
      container = _doc.evaluate(xpath, _doc, null, xtype, null).singleNodeValue;
    } else {
      container = this.walkToNode(steps, _doc);
    }
    return container;
  }

  /**
   * fixMiss
   * @param {object[]} steps 
   * @param {number} offset 
   * @param {Document} [doc] 
   * @param {string} [ignoreClass] 
   * @returns {object|void}
   * @private
   */
  fixMiss(steps, offset, doc, ignoreClass) {
    let container = this.findNode(steps.slice(0, -1), doc, ignoreClass);
    const children = container.childNodes;
    const lastStepIndex = steps[steps.length - 1].index;
    const map = this.normalizedMap(children, Node.TEXT_NODE, ignoreClass);
    for (const childIndex in map) {
      if (!map.hasOwnProperty(childIndex)) return;
      if (map[childIndex] === lastStepIndex) {
        const child = children[childIndex];
        const len = child.textContent.length;
        if (offset > len) {
          offset = offset - len;
        } else {
          if (child.nodeType === Node.ELEMENT_NODE) {
            container = child.childNodes[0];
          } else {
            container = child;
          }
          break;
        }
      }
    }
    return {
      container: container,
      offset: offset
    };
  }

  /**
   * Create a EpubCFI object from a Node
   * @param {Node} node
   * @param {string|object} base
   * @param {string} [ignoreClass]
   * @returns {EpubCFI}
   */
  fromNode(node, base, ignoreClass) {
    const cfi = new EpubCFI();
    if (typeof base === "string") {
      cfi.base = this.parseComponent(base);
      cfi.spinePos = cfi.base.steps[1].index;
    } else if (typeof base === "object") {
      cfi.base = base;
    }
    cfi.path = this.pathTo(node, null, ignoreClass);
    return cfi;
  }

  /**
   * Create a CFI object from a Range
   * @param {Range} range
   * @param {string|object} base
   * @param {string} [ignoreClass]
   * @returns {EpubCFI} 
   */
  fromRange(range, base, ignoreClass) {
    const cfi = new EpubCFI();
    const start = range.startContainer;
    const doc = start.ownerDocument;
    const end = range.endContainer;
    let startOffset = range.startOffset;
    let endOffset = range.endOffset;
    let needsIgnoring = false;
    if (ignoreClass) {
      // Tell pathTo if / what to ignore
      needsIgnoring = doc.querySelector("." + ignoreClass) !== null;
    }
    if (typeof base === "string") {
      cfi.base = this.parseComponent(base);
      cfi.spinePos = cfi.base.steps[1].index;
    } else if (typeof base === "object") {
      cfi.base = base;
    }
    if (range.collapsed) {
      if (needsIgnoring) {
        startOffset = this.patchOffset(start, startOffset, ignoreClass);
      }
      cfi.path = this.pathTo(start, startOffset, ignoreClass);
    } else {
      cfi.range = true;
      if (needsIgnoring) {
        startOffset = this.patchOffset(start, startOffset, ignoreClass);
      }
      cfi.start = this.pathTo(start, startOffset, ignoreClass);
      if (needsIgnoring) {
        endOffset = this.patchOffset(end, endOffset, ignoreClass);
      }
      cfi.end = this.pathTo(end, endOffset, ignoreClass);

      // Create a new empty path
      cfi.path = {
        steps: [],
        terminal: null
      };

      // Push steps that are shared between start and end to the common path
      for (let i = 0, len = cfi.start.steps.length; i < len; i++) {
        if (this.equalStep(cfi.start.steps[i], cfi.end.steps[i])) {
          if (i === len - 1) {
            // Last step is equal, check terminals
            if (cfi.start.terminal === cfi.end.terminal) {
              // CFI's are equal
              cfi.path.steps.push(cfi.start.steps[i]);
              // Not a range
              cfi.range = false;
            }
          } else {
            cfi.path.steps.push(cfi.start.steps[i]);
          }
        } else {
          break;
        }
      }
      cfi.start.steps = cfi.start.steps.slice(cfi.path.steps.length);
      cfi.end.steps = cfi.end.steps.slice(cfi.path.steps.length);

      // TODO: Add Sanity check to make sure that the end if greater than the start
    }
    return cfi;
  }

  /**
   * Check if a string is wrapped with "epubcfi()"
   * @param {string} str EpubCFI string format
   * @returns {boolean} `true` if the string is valid, `false` otherwise
   */
  isCfiString(str) {
    if (typeof str === "string" && str.indexOf("epubcfi(") === 0 && str[str.length - 1] === ")") {
      return true;
    }
    return false;
  }

  /**
   * normalizedMap
   * @param {Node[]} children 
   * @param {number} nodeType 
   * @param {string} [ignoreClass] 
   * @returns {object}
   * @private
   */
  normalizedMap(children, nodeType, ignoreClass) {
    const output = {};
    let prevIndex = -1;
    let currNodeType;
    let prevNodeType;
    for (let i = 0, len = children.length; i < len; i++) {
      currNodeType = children[i].nodeType;

      // Check if needs ignoring
      if (currNodeType === Node.ELEMENT_NODE && children[i].classList.contains(ignoreClass)) {
        currNodeType = Node.TEXT_NODE;
      }
      if (i > 0 && currNodeType === Node.TEXT_NODE && prevNodeType === Node.TEXT_NODE) {
        // join text nodes
        output[i] = prevIndex;
      } else if (nodeType === currNodeType) {
        prevIndex = prevIndex + 1;
        output[i] = prevIndex;
      }
      prevNodeType = currNodeType;
    }
    return output;
  }

  /**
   * Parse a cfi string to a EpubCFI object representation
   * @param {string} cfiStr EpubCFI string format
   * @returns {EpubCFI} EpubCFI object
   */
  parse(cfiStr) {
    const cfi = new EpubCFI();
    if (typeof cfiStr !== "string") {
      throw new TypeError("invalid argument type");
    }
    if (this.isCfiString(cfiStr)) {
      // Remove initial 'epubcfi(' and ending ')'
      cfi.str = cfiStr; // save EpubCFI string
      cfiStr = cfiStr.slice(8, cfiStr.length - 1);
    } else {
      throw new Error("invalid EpubCFI string format");
    }
    const baseComponent = this.getBaseComponent(cfiStr);

    // Make sure this is a valid cfi or return
    if (!baseComponent) {
      cfi.spinePos = -1;
      return cfi;
    }
    cfi.base = this.parseComponent(baseComponent);
    const pathComponent = this.getPathComponent(cfiStr);
    cfi.path = this.parseComponent(pathComponent);
    const range = this.getRange(cfiStr);
    if (range) {
      cfi.range = true;
      cfi.start = this.parseComponent(range[0]);
      cfi.end = this.parseComponent(range[1]);
    }

    // Get spine node position
    // cfi.spineSegment = cfi.base.steps[1];

    // Chapter segment is always the second step
    cfi.spinePos = cfi.base.steps[1].index;
    return cfi;
  }

  /**
   * Parsing the component string value
   * @param {string} value string value
   * @example in: /4/1:1 out: object
   * @returns {object} component object
   * @private
   */
  parseComponent(value) {
    const component = {
      steps: [],
      terminal: {
        offset: null,
        assertion: null
      }
    };
    const parts = value.split(":");
    const steps = parts[0].split("/");
    if (parts.length > 1) {
      component.terminal = this.parseTerminal(parts[1]);
    }
    if (steps[0] === "") {
      steps.shift(); // Ignore the first slash
    }
    component.steps = steps.map(step => this.parseStep(step));
    return component;
  }

  /**
   * Parsing the step string value
   * Check if step is a text node or element
   * @param {string} str string value
   * @returns {object} step object
   * @private
   */
  parseStep(str) {
    const num = parseInt(str);
    if (isNaN(num)) return;
    const isElement = num % 2 === 0;
    const hasBrackets = str.match(/\[(.*)\]/);
    return {
      id: hasBrackets && hasBrackets[1] ? hasBrackets[1] : null,
      index: isElement ? num / 2 - 1 : (num - 1) / 2,
      type: isElement ? "element" : "text"
    };
  }

  /**
   * Parsing the terminal string value
   * @param {string} str string value
   * @returns {object} terminal object
   * @private
   */
  parseTerminal(str) {
    const arr = str.match(/\[(.*)\]/);
    const cmp = arr && arr[1];
    const txt = cmp ? str.split("[")[0] : str;
    const num = parseInt(txt);
    return {
      assertion: cmp ? arr[1] : null,
      offset: isNumber(num) ? num : null
    };
  }

  /**
   * Get patch offset of text node
   * @param {Node} node 
   * @param {number} offset 
   * @param {string} [ignoreClass] 
   * @returns {number} Total offset
   * @private
   */
  patchOffset(node, offset, ignoreClass) {
    if (node.nodeType !== Node.TEXT_NODE) {
      throw new Error("Anchor must be a text node");
    }
    let curr = node;
    let totalOffset = offset;

    // If the parent is a ignored node, get offset from it's start
    if (node.parentNode.classList.contains(ignoreClass)) {
      curr = node.parentNode;
    }
    while (curr.previousSibling) {
      if (curr.previousSibling.nodeType === Node.ELEMENT_NODE) {
        // Originally a text node, so join
        if (curr.previousSibling.classList.contains(ignoreClass)) {
          totalOffset += curr.previousSibling.textContent.length;
        } else {
          break; // Normal node, dont join
        }
      } else {
        // If the previous sibling is a text node, join the nodes
        totalOffset += curr.previousSibling.textContent.length;
      }
      curr = curr.previousSibling;
    }
    return totalOffset;
  }

  /**
   * Get position index
   * @param {Node} node 
   * @returns {number} Position index
   * @private
   */
  position(node) {
    let children, index;
    if (node.nodeType === Node.ELEMENT_NODE) {
      children = node.parentNode.children;
      if (!children) {
        children = findChildren(node.parentNode);
      }
      index = Array.prototype.indexOf.call(children, node);
    } else {
      children = this.textNodes(node.parentNode);
      index = children.indexOf(node);
    }
    return index;
  }

  /**
   * segmentString
   * @param {object} segment 
   * @returns {string}
   * @private
   */
  segmentString(segment) {
    let str = "/";
    str += this.joinSteps(segment.steps);
    if (segment.terminal && segment.terminal.offset !== null) {
      str += ":" + segment.terminal.offset;
    }
    if (segment.terminal && segment.terminal.assertion !== null) {
      str += "[" + segment.terminal.assertion + "]";
    }
    return str;
  }

  /**
   * step
   * @param {Node} node 
   * @returns {object} step object
   * @private
   */
  step(node) {
    return {
      id: node.id,
      index: this.position(node),
      tagName: node.tagName,
      type: node.nodeType === Node.TEXT_NODE ? "text" : "element"
    };
  }

  /**
   * stepsToXpath
   * @param {object[]} steps 
   * @returns {string}
   * @private
   */
  stepsToXpath(steps) {
    const xpath = [".", "*"];
    steps.forEach(step => {
      const position = step.index + 1;
      if (step.id) {
        xpath.push("*[position()=" + position + " and @id='" + step.id + "']");
      } else if (step.type === "text") {
        xpath.push("text()[" + position + "]");
      } else {
        xpath.push("*[" + position + "]");
      }
    });
    return xpath.join("/");
  }

  /**
   * stepsToQuerySelector (unused)
   * @param {object[]} steps 
   * @returns {string}
   * @private
   */
  stepsToQuerySelector(steps) {
    const query = ["html"];
    steps.forEach(step => {
      const position = step.index + 1;
      if (step.id) {
        query.push("#" + step.id);
      } else if (step.type === "text") {
        // unsupported in querySelector
        // query.push("text()[" + position + "]");
      } else {
        query.push("*:nth-child(" + position + ")");
      }
    });
    return query.join(">");
  }

  /**
   * textNodes
   * @param {Node} container 
   * @param {string} [ignoreClass] 
   * @returns {object[]}
   * @private
   */
  textNodes(container, ignoreClass) {
    return Array.prototype.slice.call(container.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return true;
      } else if (node.classList.contains(ignoreClass)) {
        return true;
      }
      return false;
    });
  }

  /**
   * Creates a DOM range representing a CFI
   * @param {Document} [doc] document referenced in the base
   * @param {string} [ignoreClass]
   * @return {Range}
   */
  toRange(doc, ignoreClass) {
    const _doc = doc || document;
    let start, end, startContainer, endContainer;
    let startSteps, endSteps, hasOffset;
    const needsIgnoring = ignoreClass && _doc.querySelector("." + ignoreClass) !== null;
    const reqClass = needsIgnoring ? ignoreClass : undefined;
    let range, missed;
    if (typeof _doc.createRange !== "undefined") {
      range = _doc.createRange();
    } else {
      range = new rangeobject();
    }
    if (this.range) {
      start = this.start;
      startSteps = this.path.steps.concat(start.steps);
      startContainer = this.findNode(startSteps, _doc, reqClass);
      end = this.end;
      endSteps = this.path.steps.concat(end.steps);
      endContainer = this.findNode(endSteps, _doc, reqClass);
    } else {
      start = this.path;
      startSteps = this.path.steps;
      startContainer = this.findNode(startSteps, _doc, reqClass);
    }
    if (startContainer) {
      try {
        hasOffset = start.terminal.offset !== null;
        range.setStart(startContainer, hasOffset ? start.terminal.offset : 0);
      } catch (e) {
        missed = this.fixMiss(startSteps, start.terminal.offset, _doc, reqClass);
        range.setStart(missed.container, missed.offset);
        console.error(e);
      }
    } else {
      console.error("No startContainer found for", this.toString());
      return null; // No start found
    }
    if (endContainer) {
      try {
        hasOffset = end.terminal.offset !== null;
        range.setEnd(endContainer, hasOffset ? end.terminal.offset : 0);
      } catch (e) {
        missed = this.fixMiss(endSteps, this.end.terminal.offset, _doc, reqClass);
        range.setEnd(missed.container, missed.offset);
        console.error(e);
      }
    }
    return range;
  }

  /**
   * Convert CFI to a epubcfi(...) string
   * @returns {string} EpubCFI string format
   */
  toString() {
    let str = "epubcfi(";
    str += this.segmentString(this.base);
    str += "!";
    str += this.segmentString(this.path);
    // Add Range, if present
    if (this.range && this.start) {
      str += ",";
      str += this.segmentString(this.start);
    }
    if (this.range && this.end) {
      str += ",";
      str += this.segmentString(this.end);
    }
    str += ")";
    return str;
  }

  /**
   * walkToNode
   * @param {object[]} steps 
   * @param {Document} [doc] 
   * @param {string} [ignoreClass] 
   * @returns {Node}
   * @private
   */
  walkToNode(steps, doc, ignoreClass) {
    const _doc = doc || document;
    let container = _doc.documentElement;
    for (let i = 0, len = steps.length; i < len; i++) {
      const step = steps[i];
      if (step.type === "element") {
        //better to get a container using id as some times step.index may not be correct
        //For ex.https://github.com/futurepress/epub.js/issues/561
        if (step.id) {
          container = _doc.getElementById(step.id);
        } else {
          const children = container.children || findChildren(container);
          container = children[step.index];
        }
      } else if (step.type === "text") {
        container = this.textNodes(container, ignoreClass)[step.index];
      }
      if (!container) {
        //Break the for loop as due to incorrect index we can get error if
        //container is undefined so that other functionailties works fine
        //like navigation
        break;
      }
    }
    return container;
  }
}
/* harmony default export */ const src_epubcfi = (EpubCFI);
;// CONCATENATED MODULE: ./src/utils/constants.js
/**
 * @module constants
 */

const EPUBJS_VERSION = "0.3";

// Dom events to listen for
const DOM_EVENTS = ["keydown", "keyup", "keypressed", "mouseup", "mousedown", "mousemove", "click", "touchend", "touchstart", "touchmove"];
const EVENTS = {
  BOOK: {
    OPEN_FAILED: "openFailed"
  },
  CONTENTS: {
    EXPAND: "expand",
    RESIZE: "resize",
    SELECTED: "selected",
    SELECTED_RANGE: "selectedRange",
    LINK_CLICKED: "linkClicked"
  },
  LOCATIONS: {
    CHANGED: "changed"
  },
  MANAGERS: {
    RESIZE: "resize",
    RESIZED: "resized",
    ORIENTATION_CHANGE: "orientationchange",
    ADDED: "added",
    SCROLL: "scroll",
    SCROLLED: "scrolled",
    REMOVED: "removed"
  },
  VIEWS: {
    AXIS: "axis",
    WRITING_MODE: "writingMode",
    LOAD_ERROR: "loaderror",
    RENDERED: "rendered",
    RESIZED: "resized",
    DISPLAYED: "displayed",
    SHOWN: "shown",
    HIDDEN: "hidden",
    MARK_CLICKED: "markClicked"
  },
  RENDITION: {
    STARTED: "started",
    ATTACHED: "attached",
    DISPLAYED: "displayed",
    DISPLAY_ERROR: "displayerror",
    RENDERED: "rendered",
    REMOVED: "removed",
    RESIZED: "resized",
    ORIENTATION_CHANGE: "orientationchange",
    RELOCATED: "relocated",
    MARK_CLICKED: "markClicked",
    SELECTED: "selected",
    LAYOUT: "layout"
  },
  LAYOUT: {
    UPDATED: "updated"
  },
  ANNOTATION: {
    ATTACH: "attach",
    DETACH: "detach"
  },
  THEMES: {
    SELECTED: "selected"
  }
};
;// CONCATENATED MODULE: ./src/locations.js








/**
 * Find Locations for a Book
 */
class Locations extends Array {
  /**
   * Constructor
   * @param {Sections} [sections]
   * @param {method} [request]
   * @param {number} [pause=100]
   */
  constructor(sections, request, pause) {
    super();
    this.sections = sections;
    this.pause = pause || 100;
    this.break = 150;
    this.request = request;
    /**
     * @member {object} current Current Location
     * @property {string} current.cfi
     * @property {number} current.index
     * @property {number} current.percentage
     * @memberof Locations
     * @readonly
     */
    this.current = {
      cfi: null,
      index: -1,
      percentage: 0
    };
    this.processingTimeout = undefined;
    this.q = new queue(this);
  }

  /**
   * Load all of sections in the book to generate locations
   * @param {number} [chars] how many chars to split on (default:150)
   * @return {Promise} locations
   */
  async generate(chars) {
    if (Number.isInteger(chars)) {
      this.break = chars;
    } else {
      this.break = parseInt(chars);
      console.warn("The input value type is not an integer");
    }
    this.q.pause();
    this.sections.each(section => {
      if (section.linear) {
        this.q.enqueue(this.process.bind(this), section);
      }
    });
    return this.q.run().then(() => {
      if (this.length) {
        this.current.cfi = [0];
        this.current.index = 0;
        this.current.percentage = 0;
      }
      return this;
    });
  }

  /**
   * createRange
   * @returns {object}
   */
  createRange() {
    return {
      startContainer: undefined,
      startOffset: undefined,
      endContainer: undefined,
      endOffset: undefined
    };
  }

  /**
   * process
   * @param {Section} section 
   * @returns {Promise}
   */
  async process(section) {
    return section.load(this.request).then(contents => {
      const completed = new defer();
      const locations = this.parse(contents, section.cfiBase);
      locations.forEach(i => this.push(i));
      section.unload();
      this.processingTimeout = setTimeout(() => completed.resolve(locations), this.pause);
      return completed.promise;
    });
  }

  /**
   * parse
   * @param {Element} contents 
   * @param {string} cfiBase 
   * @param {number} [chars] 
   * @returns {Locations}
   */
  parse(contents, cfiBase, chars) {
    const locations = new Locations();
    locations.break = chars || this.break;
    let range;
    let counter = 0;
    let prev;
    const parser = node => {
      if (node.textContent.trim().length === 0) {
        return false; // continue
      }

      // Start range
      if (counter == 0) {
        range = this.createRange();
        range.startContainer = node;
        range.startOffset = 0;
      }
      const len = node.length;
      let dist = locations.break - counter;
      let pos = 0;

      // Node is smaller than a break,
      // skip over it
      if (dist > len) {
        counter += len;
        pos = len;
      }
      while (pos < len) {
        dist = locations.break - counter;
        if (counter === 0) {
          // Start new range
          pos += 1;
          range = this.createRange();
          range.startContainer = node;
          range.startOffset = pos;
        }

        // Gone over
        if (pos + dist >= len) {
          // Continue counter for next node
          counter += len - pos;
          // break
          pos = len;
          // At End
        } else {
          // Advance pos
          pos += dist;
          // End the previous range
          range.endContainer = node;
          range.endOffset = pos;
          const cfi = new src_epubcfi(range, cfiBase).toString();
          locations.push(cfi);
          counter = 0;
        }
      }
      prev = node;
    };
    const doc = contents.ownerDocument;
    const body = qs(doc, "body");
    sprint(body, parser.bind(this));

    // Close remaining
    if (range && range.startContainer && prev) {
      range.endContainer = prev;
      range.endOffset = prev.length;
      const cfi = new src_epubcfi(range, cfiBase).toString();
      locations.push(cfi);
      counter = 0;
    }
    return locations;
  }

  /**
   * Get a location from an EpubCFI
   * @param {string} value EpubCFI string format
   * @return {number} Location index
   */
  locationFromCfi(value) {
    if (this.length === 0) return -1;
    const cmp = src_epubcfi.prototype.compare;
    const cfi = new src_epubcfi(value);
    const loc = locationOf(cfi, this, cmp);
    const ind = this.length - 1;
    return loc > ind ? ind : loc;
  }

  /**
   * Get a percentage position in locations from an EpubCFI
   * @param {string} cfi EpubCFI string format
   * @return {number} Percentage
   */
  percentageFromCfi(cfi) {
    if (this.length === 0) {
      return 0;
    }
    // Find closest cfi
    const loc = this.locationFromCfi(cfi);
    // Get percentage in total
    return this.percentageFromLocation(loc);
  }

  /**
   * Get a percentage position from a location index
   * @param {number} loc Location index
   * @return {number} Percentage
   */
  percentageFromLocation(loc) {
    if (this.length === 0 || this.length >= loc && loc < 0) {
      return 0;
    }
    return loc / (this.length - 1);
  }

  /**
   * Get an EpubCFI from location index
   * @param {number} loc Location index
   * @return {string|null} EpubCFI string format
   */
  cfiFromLocation(loc) {
    if (this.length === 0 || this.length >= loc && loc < 0) {
      return null;
    }
    return this[loc];
  }

  /**
   * Get an EpubCFI from location percentage
   * @param {number} percentage
   * @return {string|null} EpubCFI string format
   */
  cfiFromPercentage(percentage) {
    if (percentage > 1) {
      console.warn("Normalize cfiFromPercentage value to between 0 - 1");
    }

    // Make sure 1 goes to very end
    if (percentage >= 1) {
      const cfi = new src_epubcfi(this[this.length - 1]);
      cfi.collapse();
      return cfi.toString();
    }
    const loc = Math.ceil((this.length - 1) * percentage);
    return this.cfiFromLocation(loc);
  }

  /**
   * Load locations from JSON
   * @param {string} locations
   */
  load(locations) {
    if (typeof locations === "string") {
      this.splice(0);
      const data = JSON.parse(locations);
      data.items.forEach(i => this.push(i));
      this.break = data.break;
      this.pause = data.pause;
      this.current.cfi = this[data.index];
      this.current.index = data.index;
      this.current.percentage = this.percentageFromLocation(data.index);
    } else {
      console.error("Invalid argument type");
    }
    return this;
  }

  /**
   * Save locations to JSON
   * @return {json}
   */
  save() {
    return JSON.stringify({
      items: this,
      index: this.current.index,
      break: this.break,
      pause: this.pause
    });
  }

  /**
   * Set current location
   * @param {object} options
   * @param {string} [options.cfi] EpubCFI string format
   * @param {number} [options.index] Location index
   * @param {number} [options.percentage] Percentage
   */
  set(options) {
    if (this.length === 0) return;
    const setup = (index, value) => {
      if (index >= 0 && index < this.length) {
        this.current.cfi = this[index];
        this.current.index = index;
        this.current.percentage = value || index / (this.length - 1);
      }
    };
    Object.keys(options).forEach(opt => {
      const value = options[opt];
      if (this.current[opt] === value || typeof value === "undefined") {
        delete options[opt];
      } else if (typeof value === "string") {
        if (opt === "cfi" && src_epubcfi.prototype.isCfiString(value)) {
          const index = this.locationFromCfi(value);
          setup(index);
        }
      } else if (typeof value === "number") {
        if (opt === "index") {
          setup(value);
        } else if (opt === "percentage") {
          if (value >= 0 && value <= 1) {
            const index = Math.ceil((this.length - 1) * value);
            setup(index, value);
          } else if (value > 1) {
            const cfi = new src_epubcfi(this[this.length - 1]);
            cfi.collapse();
            this.current.cfi = cfi.toString();
            this.current.index = this.locationFromCfi(this.current.cfi);
            this.current.percentage = value;
            console.warn("The input value must be normalized in the range 0-1");
          }
        }
      } else {
        console.error("Invalid value type to " + opt);
      }
    });
    if (Object.keys(options).length) {
      /**
       * Current location changed
       * @event changed
       * @param {object} current Current location
       * @param {object} changed Changed properties
       * @memberof Locations
       */
      this.emit(EVENTS.LOCATIONS.CHANGED, this.current, options);
    }
  }

  /**
   * destroy
   */
  destroy() {
    this.sections = undefined;
    this.pause = undefined;
    this.break = undefined;
    this.request = undefined;
    this.current.cfi = null;
    this.current.index = -1;
    this.current.percentage = 0;
    this.q.stop();
    this.q = undefined;
    this.splice(0);
    clearTimeout(this.processingTimeout);
  }
}
event_emitter_default()(Locations.prototype);
/* harmony default export */ const locations = (Locations);
;// CONCATENATED MODULE: ./src/container.js



/**
 * Parsing the Epub Container
 * @link https://www.w3.org/TR/epub/#sec-container-metainf
 */
class Container {
  /**
   * Constructor
   * @param {Document} [containerDocument] xml document
   */
  constructor(containerDocument) {
    /**
     * @member {string} directory Package directory
     * @memberof Container
     * @readonly
     */
    this.directory = "";
    /**
     * @member {string} fullPath Path to package file
     * @memberof Container
     * @readonly
     */
    this.fullPath = "";
    /**
     * @member {string} encoding Encoding
     * @memberof Container
     * @readonly
     */
    this.encoding = "";
    /**
     * @member {string} mediaType Media type
     * @memberof Container
     * @readonly
     */
    this.mediaType = "";
    if (containerDocument) {
      this.parse(containerDocument);
    }
  }

  /**
   * Parse the Container XML
   * @param {Document} containerDocument
   */
  parse(containerDocument) {
    if (!containerDocument) {
      throw new Error("Container File Not Found");
    }

    // <rootfile
    //   full-path="OPS/package.opf" 
    //   media-type="application/oebps-package+xml"/>
    const rootfile = qs(containerDocument, "rootfile");
    if (!rootfile) {
      throw new Error("No RootFile Found");
    }
    this.fullPath = rootfile.getAttribute("full-path");
    this.directory = utils_path.prototype.dirname(this.fullPath);
    this.encoding = containerDocument.xmlEncoding;
    this.mediaType = rootfile.getAttribute("media-type");
  }

  /**
   * destroy
   */
  destroy() {
    this.directory = undefined;
    this.fullPath = undefined;
    this.encoding = undefined;
    this.mediaType = undefined;
  }
}
/* harmony default export */ const container = (Container);
;// CONCATENATED MODULE: ./src/manifest.js


/**
 * Manifest class
 * @extends {Map}
 */
class Manifest extends Map {
  constructor() {
    super();
  }

  /**
   * Parse the manifest node
   * @param {Node} node 
   */
  parse(node) {
    //-- Turn items into an array
    const items = qsa(node, "item");
    //-- Create an object with the id as key
    items.forEach(item => {
      const id = item.getAttribute("id");
      const props = item.getAttribute("properties") || "";
      this.set(id, {
        href: item.getAttribute("href") || "",
        type: item.getAttribute("media-type") || "",
        overlay: item.getAttribute("media-overlay") || "",
        properties: props.length ? props.split(" ") : []
      });
    });
  }

  /**
   * destroy
   */
  destroy() {
    this.clear();
  }
}
/* harmony default export */ const manifest = (Manifest);
;// CONCATENATED MODULE: ./src/metadata.js
/**
 * Metadata class
 * @extends {Map}
 */
class Metadata extends Map {
  constructor() {
    super();
  }

  /**
   * Parse the metadata node
   * @param {Node} node 
   */
  parse(node) {
    for (const item of node.children) {
      if (item.nodeName === "meta") {
        this.parseMeta(item);
      } else if (/dc:/.test(item.nodeName)) {
        // dc:title
        // dc:creator
        // dc:description
        // dc:publisher
        // dc:identifier
        // dc:language
        // dc:subject
        // dc:rights
        // dc:date
        // dc:type
        const key = item.nodeName.substring(3);
        this.set(key, item.textContent);
      }
    }
  }

  /**
   * Parse the meta node
   * @param {Node} item 
   * @returns {void}
   * @private
   */
  parseMeta(item) {
    const prop = item.getAttribute("property");
    if (typeof prop === "undefined" || typeof prop !== "string") {
      return;
    } else if (/rendition:/.test(prop)) {
      // rendition:layout
      // rendition:spread
      // rendition:flow
      // rendition:viewport
      // rendition:orientation
      const key = prop.substring(10);
      this.set(key, item.textContent);
    } else if (/dcterms:/.test(prop)) {
      // dcterms:modified
      const key = prop.substring(8);
      this.set(key, item.textContent);
    } else if (/media:/.test(prop)) {
      // media:active-class
      // media:duration
      // media:narrator
      // media:playback-active-class
      this.set(prop, item.textContent);
    }
  }

  /**
   * destroy
   */
  destroy() {
    this.clear();
  }
}
/* harmony default export */ const metadata = (Metadata);
;// CONCATENATED MODULE: ./src/spine.js


/**
 * A collection of Spine Items
 * @extends {Map}
 */
class Spine extends Map {
  constructor() {
    super();
    /**
     * Node index from the package.opf
     * @member {number} nodeIndex
     * @memberof Spine
     * @readonly
     */
    this.nodeIndex = undefined;
  }

  /**
   * Parse element spine
   * @param {Node} node 
   */
  parse(node) {
    const items = qsa(node, "itemref");
    items.forEach((item, index) => {
      const props = item.getAttribute("properties") || "";
      const idref = item.getAttribute("idref");
      this.set(idref, {
        id: item.getAttribute("id"),
        idref: idref,
        index: index,
        linear: item.getAttribute("linear") || "yes",
        properties: props.length ? props.split(" ") : []
      });
    });
    this.nodeIndex = indexOfNode(node, Node.ELEMENT_NODE);
  }

  /**
   * destroy
   */
  destroy() {
    this.clear();
    this.nodeIndex = undefined;
  }
}
/* harmony default export */ const spine = (Spine);
;// CONCATENATED MODULE: ./src/packaging.js





/**
 * Open Packaging Format Parser
 */
class Packaging {
  /**
   * Constructor
   * @param {Document} [packageXml] OPF XML
   */
  constructor(packageXml) {
    /**
     * @member {Metadata} metadata
     * @memberof Packaging
     * @readonly
     */
    this.metadata = new metadata();
    /**
     * @member {Manifest} manifest
     * @memberof Packaging
     * @readonly
     */
    this.manifest = new manifest();
    /**
     * @member {string} navPath
     * @memberof Packaging
     * @readonly
     */
    this.navPath = "";
    /**
     * @member {string} ncxPath
     * @memberof Packaging
     * @readonly
     */
    this.ncxPath = "";
    /**
     * @member {string} coverPath
     * @memberof Packaging
     * @readonly
     */
    this.coverPath = "";
    /**
     * @member {Spine} spine
     * @memberof Packaging
     * @readonly
     */
    this.spine = new spine();
    /**
     * @member {string} version Package version
     * @memberof Packaging
     * @readonly
     */
    this.version = "";
    /**
     * @member {string} direction
     * @memberof Packaging
     * @readonly
     */
    this.direction = "";
    if (packageXml) {
      this.parse(packageXml);
    }
  }

  /**
   * Parse OPF XML
   * @param {Document} packageXml OPF XML
   * @return {object} parsed package parts
   */
  parse(packageXml) {
    if (!packageXml) {
      throw new Error("Package File Not Found");
    }
    const metadataNode = qs(packageXml, "metadata");
    if (!metadataNode) {
      throw new Error("No Metadata Found");
    }
    const manifestNode = qs(packageXml, "manifest");
    if (!manifestNode) {
      throw new Error("No Manifest Found");
    }
    const spineNode = qs(packageXml, "spine");
    if (!spineNode) {
      throw new Error("No Spine Found");
    }
    this.metadata.parse(metadataNode);
    this.manifest.parse(manifestNode);
    this.spine.parse(spineNode);
    this.navPath = this.findNavPath(manifestNode);
    this.ncxPath = this.findNcxPath(manifestNode, spineNode);
    this.coverPath = this.findCoverPath(packageXml);
    this.uniqueIdentifier = this.findUniqueIdentifier(packageXml);
    this.direction = this.parseDirection(packageXml, spineNode);
    this.version = this.parseVersion(packageXml);
    return {
      metadata: this.metadata,
      manifest: this.manifest,
      spine: this.spine,
      navPath: this.navPath,
      ncxPath: this.ncxPath,
      coverPath: this.coverPath,
      direction: this.direction,
      version: this.version
    };
  }

  /**
   * Parse direction flow
   * @param {Document} packageXml
   * @param {Node} node spine node 
   * @returns {string}
   * @private
   */
  parseDirection(packageXml, node) {
    const el = packageXml.documentElement;
    let dir = el.getAttribute("dir");
    if (dir === null) {
      dir = node.getAttribute("page-progression-direction");
    }
    return dir || "";
  }

  /**
   * Find Unique Identifier
   * @param {Document} packageXml
   * @return {string} Unique Identifier text
   * @private
   */
  findUniqueIdentifier(packageXml) {
    const el = packageXml.documentElement;
    const uniqueIdentifier = el.getAttribute("unique-identifier");
    if (!uniqueIdentifier) {
      return "";
    }
    const identifier = packageXml.getElementById(uniqueIdentifier);
    if (!identifier) {
      return "";
    }
    if (identifier.localName === "identifier" && identifier.namespaceURI === "http://purl.org/dc/elements/1.1/") {
      return identifier.childNodes.length > 0 ? identifier.childNodes[0].nodeValue.trim() : "";
    }
    return "";
  }

  /**
   * Find TOC NAV
   * @param {Node} manifestNode
   * @return {string}
   * @private
   */
  findNavPath(manifestNode) {
    // Find item with property "nav"
    // Should catch nav regardless of order
    const node = qsp(manifestNode, "item", {
      properties: "nav"
    });
    return node ? node.getAttribute("href") : false;
  }

  /**
   * Find TOC NCX
   * - `media-type="application/x-dtbncx+xml" href="toc.ncx"`
   * @param {Node} manifestNode
   * @param {Node} spineNode
   * @return {string}
   * @private
   */
  findNcxPath(manifestNode, spineNode) {
    let node = qsp(manifestNode, "item", {
      "media-type": "application/x-dtbncx+xml"
    });
    // If we can't find the toc by media-type then try to look for id of the item in the spine attributes as
    // according to http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.4.1.2,
    // "The item that describes the NCX must be referenced by the spine toc attribute."
    if (!node) {
      const tocId = spineNode.getAttribute("toc");
      if (tocId) {
        node = manifestNode.querySelector(`#${tocId}`);
      }
    }
    return node ? node.getAttribute("href") : false;
  }

  /**
   * Find the Cover Path
   * - `<item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml"/>`
   * 
   * Fallback for Epub 2.0
   * @param {Document} packageXml
   * @return {string} href
   * @private
   */
  findCoverPath(packageXml) {
    // Try parsing cover with epub 3.
    const node = qsp(packageXml, "item", {
      properties: "cover-image"
    });
    if (node) return node.getAttribute("href");

    // Fallback to epub 2.
    const metaCover = qsp(packageXml, "meta", {
      name: "cover"
    });
    if (metaCover) {
      const coverId = metaCover.getAttribute("content");
      const cover = packageXml.getElementById(coverId);
      return cover ? cover.getAttribute("href") : "";
    } else {
      return null;
    }
  }

  /**
   * Parse package version
   * @param {Document} packageXml 
   * @returns {string}
   * @private
   */
  parseVersion(packageXml) {
    const pkg = qs(packageXml, "package");
    return pkg.getAttribute("version") || "";
  }

  /**
   * Load JSON Manifest
   * @param {json} json 
   * @return {object} parsed package parts
   */
  load(json) {
    const metadata = json.metadata;
    Object.keys(metadata).forEach(prop => {
      this.metadata.set(prop, metadata[prop]);
    });
    const spine = json.readingOrder || json.spine;
    this.spine.items = spine.map((item, index) => {
      item.index = index;
      item.linear = item.linear || "yes";
      return item;
    });
    json.resources.forEach((item, index) => {
      this.manifest.set(index, item);
      if (item.rel && item.rel[0] === "cover") {
        this.coverPath = item.href;
      }
    });
    this.toc = json.toc.map((item, index) => {
      item.label = item.title;
      return item;
    });
    return {
      metadata: this.metadata,
      manifest: this.manifest,
      spine: this.spine,
      navPath: this.navPath,
      ncxPath: this.ncxPath,
      coverPath: this.coverPath,
      toc: this.toc
    };
  }

  /**
   * destroy
   */
  destroy() {
    this.metadata.destroy();
    this.manifest.destroy();
    this.spine.destroy();
    this.metadata = undefined;
    this.manifest = undefined;
    this.spine = undefined;
    this.navPath = undefined;
    this.ncxPath = undefined;
    this.coverPath = undefined;
    this.direction = undefined;
    this.version = undefined;
  }
}
/* harmony default export */ const packaging = (Packaging);
;// CONCATENATED MODULE: ./src/navigation.js



/**
 * Navigation Parser
 */
class Navigation {
  /**
   * Constructor
   * @param {Document} xml navigation html / xhtml / ncx
   */
  constructor(xml) {
    this.toc = [];
    this.tocByHref = {};
    this.tocById = {};
    this.landmarks = [];
    this.landmarksByType = {};
    this.length = 0;
    if (xml) {
      this.parse(xml);
    }
  }

  /**
   * Parse out the navigation items
   * @param {Document} xml navigation html / xhtml / ncx
   */
  parse(xml) {
    const isXml = xml.nodeType;
    let html;
    let ncx;
    if (isXml) {
      html = qs(xml, "html");
      ncx = qs(xml, "ncx");
    }
    if (!isXml) {
      this.toc = this.load(xml);
    } else if (html) {
      this.toc = this.parseNav(xml);
      this.landmarks = this.parseLandmarks(xml);
    } else if (ncx) {
      this.toc = this.parseNcx(xml);
    }
    this.length = 0;
    this.unpack(this.toc);
  }

  /**
   * Unpack navigation items
   * @param {Array} toc
   * @private
   */
  unpack(toc) {
    for (let i = 0; i < toc.length; i++) {
      const item = toc[i];
      if (item.href) {
        this.tocByHref[item.href] = i;
      }
      if (item.id) {
        this.tocById[item.id] = i;
      }
      this.length++;
      if (item.subitems.length) {
        this.unpack(item.subitems);
      }
    }
  }

  /**
   * Get an item from the navigation
   * @param {string} target
   * @return {object} navItem
   */
  get(target) {
    if (!target) {
      return this.toc;
    }
    let index;
    if (target.indexOf("#") === 0) {
      index = this.tocById[target.substring(1)];
    } else if (target in this.tocByHref) {
      index = this.tocByHref[target];
    }
    return this.getByIndex(target, index, this.toc);
  }

  /**
   * Get an item from navigation subitems recursively by index
   * @param {string} target
   * @param {number} index
   * @param {Array} navItems
   * @return {object} navItem
   */
  getByIndex(target, index, navItems) {
    if (navItems.length === 0) {
      return;
    }
    const item = navItems[index];
    if (item && (target === item.id || target === item.href)) {
      return item;
    } else {
      let result;
      for (let i = 0; i < navItems.length; ++i) {
        result = this.getByIndex(target, index, navItems[i].subitems);
        if (result) {
          break;
        }
      }
      return result;
    }
  }

  /**
   * Get a landmark by type
   * @link https://idpf.github.io/epub-vocabs/structure/
   * @param {string} type
   * @return {object} landmarkItem
   */
  landmark(type) {
    if (!type) {
      return this.landmarks;
    }
    const index = this.landmarksByType[type];
    return this.landmarks[index];
  }

  /**
   * Parse toc from a Epub > 3.0 Nav
   * @param {Document} navHtml
   * @return {Array} navigation list
   * @private
   */
  parseNav(navHtml) {
    const navElement = querySelectorByType(navHtml, "nav", "toc");
    const list = [];
    if (!navElement) return list;
    const navList = filterChildren(navElement, "ol", true);
    if (!navList) return list;
    return this.parseNavList(navList);
  }

  /**
   * Parses lists in the toc
   * @param {Document} navListHtml
   * @param {string} parent id
   * @return {Array} navigation list
   */
  parseNavList(navListHtml, parent) {
    const result = [];
    if (!navListHtml) return result;
    if (!navListHtml.children) return result;
    const len = navListHtml.children.length;
    for (let i = 0; i < len; i++) {
      const child = navListHtml.children[i];
      const item = this.navItem(child, parent);
      if (item) {
        result.push(item);
      }
    }
    return result;
  }

  /**
   * Create a navItem
   * @param {Element} item
   * @return {object} navItem
   * @private
   */
  navItem(item, parent) {
    const content = filterChildren(item, "a", true) || filterChildren(item, "span", true);
    if (!content) {
      return;
    }
    let src = content.getAttribute("href") || "";
    let id = item.getAttribute("id") || undefined;
    if (!id) id = src;
    let subitems;
    let nested = filterChildren(item, "ol", true);
    if (nested) {
      subitems = this.parseNavList(nested, id);
    }
    return {
      id: id,
      href: src,
      label: content.textContent || "",
      subitems: subitems || [],
      parent: parent
    };
  }

  /**
   * Parse landmarks from a Epub > 3.0 Nav
   * @param {Document} navHtml
   * @return {Array} landmarks list
   * @private
   */
  parseLandmarks(navHtml) {
    const navElement = querySelectorByType(navHtml, "nav", "landmarks");
    const navItems = navElement ? qsa(navElement, "li") : [];
    const length = navItems.length;
    const list = [];
    if (!navItems || length === 0) return list;
    for (let i = 0; i < length; ++i) {
      const item = this.landmarkItem(navItems[i]);
      if (item) {
        list.push(item);
        this.landmarksByType[item.type] = i;
      }
    }
    return list;
  }

  /**
   * Create a landmarkItem
   * @param {Element} item
   * @return {object|null} landmarkItem
   * @private
   */
  landmarkItem(item) {
    const content = filterChildren(item, "a", true);
    if (!content) return null;
    const type = content.getAttributeNS("http://www.idpf.org/2007/ops", "type") || undefined;
    const href = content.getAttribute("href") || "";
    const text = content.textContent || "";
    return {
      href: href,
      label: text,
      type: type
    };
  }

  /**
   * Parse from a Epub > 3.0 NC
   * @param {Document} navHtml
   * @return {Array} navigation list
   * @private
   */
  parseNcx(tocXml) {
    const navPoints = qsa(tocXml, "navPoint");
    const length = navPoints.length;
    const toc = {};
    const list = [];
    if (!navPoints || length === 0) return list;
    for (let i = 0; i < length; ++i) {
      const item = this.ncxItem(navPoints[i]);
      toc[item.id] = item;
      if (!item.parent) {
        list.push(item);
      } else {
        const parent = toc[item.parent];
        parent.subitems.push(item);
      }
    }
    return list;
  }

  /**
   * Create a ncxItem
   * @param  {Element} item
   * @return {object} ncxItem
   * @private
   */
  ncxItem(item) {
    const content = qs(item, "content");
    const navLabel = qs(item, "navLabel");
    const text = navLabel.textContent ? navLabel.textContent : "";
    const pn = item.parentNode;
    let parent;
    if (pn && (pn.nodeName === "navPoint" || pn.nodeName.split(":").slice(-1)[0] === "navPoint")) {
      parent = pn.getAttribute("id");
    }
    return {
      id: item.getAttribute("id") || false,
      href: content.getAttribute("src"),
      label: text,
      subitems: [],
      parent: parent
    };
  }

  /**
   * Load Spine Items
   * @param  {object} json the items to be loaded
   * @return {Array} navItems
   */
  load(json) {
    return json.map(item => {
      item.label = item.title;
      item.subitems = item.children ? this.load(item.children) : [];
      return item;
    });
  }

  /**
   * forEach pass through
   * @param {Function} fn function to run on each item
   * @return {method} forEach loop
   */
  forEach(fn) {
    return this.toc.forEach(fn);
  }
}
/* harmony default export */ const navigation = (Navigation);
;// CONCATENATED MODULE: ./src/utils/replacements.js
/**
 * @module replacements
 */




/**
 * replaceBase
 * @param {Document} doc 
 * @param {Section} section 
 */
const replaceBase = (doc, section) => {
  if (!doc) return;
  let head = qs(doc, "head");
  let base = qs(head, "base");
  if (!base) {
    base = doc.createElement("base");
    head.insertBefore(base, head.firstChild);
  }
  let url = section.url;
  const absolute = url.indexOf("://") > -1;
  if (!absolute) {
    url = doc.documentURI;
  }
  base.setAttribute("href", url);
};

/**
 * replaceCanonical
 * @param {Document} doc 
 * @param {Section} section 
 */
const replaceCanonical = (doc, section) => {
  if (!doc) return;
  let url = section.canonical;
  let head = qs(doc, "head");
  let link = qs(head, "link[rel='canonical']");
  if (link) {
    link.setAttribute("href", url);
  } else {
    link = doc.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", url);
    head.appendChild(link);
  }
};

/**
 * replaceMeta
 * @param {Document} doc 
 * @param {Section} section 
 */
const replaceMeta = (doc, section) => {
  if (!doc) return;
  let head = qs(doc, "head");
  let meta = qs(head, "link[property='dc.identifier']");
  if (meta) {
    meta.setAttribute("content", section.idref);
  } else {
    meta = doc.createElement("meta");
    meta.setAttribute("name", "dc.identifier");
    meta.setAttribute("content", section.idref);
    head.appendChild(meta);
  }
};

/**
 * replaceLinks
 * TODO: move me to Contents
 * @param {Element} contents 
 * @param {method} fn 
 */
const replaceLinks = (contents, fn) => {
  const links = contents.querySelectorAll("a[href]");
  if (!links.length) return;
  const base = qs(contents.ownerDocument, "base");
  const location = base ? base.getAttribute("href") : undefined;
  const replaceLink = link => {
    const href = link.getAttribute("href");
    if (href.indexOf("mailto:") === 0) {
      return;
    }
    if (href.indexOf("://") > -1) {
      // is absolute
      link.setAttribute("target", "_blank");
    } else {
      let linkUrl;
      try {
        linkUrl = new utils_url(href, location);
      } catch (err) {
        console.error(err);
      }
      link.onclick = e => {
        if (linkUrl && linkUrl.hash) {
          fn(linkUrl.path.path + linkUrl.hash);
        } else if (linkUrl) {
          fn(linkUrl.path.path);
        } else {
          fn(href);
        }
        return false;
      };
    }
  };
  for (let i = 0; i < links.length; i++) {
    replaceLink(links[i]);
  }
};

/**
 * substitute
 * @param {string} content 
 * @param {Array} urls 
 * @param {Array} replacements 
 */
const substitute = (content, urls, replacements) => {
  urls.forEach((url, i) => {
    if (url && replacements[i]) {
      // Account for special characters in the file name.
      // See https://stackoverflow.com/a/6318729.
      url = url.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      content = content.replace(new RegExp(url, "g"), replacements[i]);
    }
  });
  return content;
};
;// CONCATENATED MODULE: ./src/utils/mime.js
/**
 * @module mime
 */

/**
 * From Zip.js, by Gildas Lormeau edited down
 * @private
 */
const table = {
  "application": {
    "ecmascript": ["es", "ecma"],
    "javascript": "js",
    "ogg": "ogx",
    "pdf": "pdf",
    "postscript": ["ps", "ai", "eps", "epsi", "epsf", "eps2", "eps3"],
    "rdf+xml": "rdf",
    "smil": ["smi", "smil"],
    "xhtml+xml": ["xhtml", "xht"],
    "xml": ["xml", "xsl", "xsd", "opf", "ncx"],
    "zip": "zip",
    "x-httpd-eruby": "rhtml",
    "x-latex": "latex",
    "x-maker": ["frm", "maker", "frame", "fm", "fb", "book", "fbdoc"],
    "x-object": "o",
    "x-shockwave-flash": ["swf", "swfl"],
    "x-silverlight": "scr",
    "epub+zip": "epub",
    "font-tdpfr": "pfr",
    "inkml+xml": ["ink", "inkml"],
    "json": "json",
    "jsonml+json": "jsonml",
    "mathml+xml": "mathml",
    "metalink+xml": "metalink",
    "mp4": "mp4s",
    // "oebps-package+xml" : "opf",
    "omdoc+xml": "omdoc",
    "oxps": "oxps",
    "vnd.amazon.ebook": "azw",
    "widget": "wgt",
    // "x-dtbncx+xml" : "ncx",
    "x-dtbook+xml": "dtb",
    "x-dtbresource+xml": "res",
    "x-font-bdf": "bdf",
    "x-font-ghostscript": "gsf",
    "x-font-linux-psf": "psf",
    "x-font-otf": "otf",
    "x-font-pcf": "pcf",
    "x-font-snf": "snf",
    "x-font-ttf": ["ttf", "ttc"],
    "x-font-type1": ["pfa", "pfb", "pfm", "afm"],
    "x-font-woff": "woff",
    "x-mobipocket-ebook": ["prc", "mobi"],
    "x-mspublisher": "pub",
    "x-nzb": "nzb",
    "x-tgif": "obj",
    "xaml+xml": "xaml",
    "xml-dtd": "dtd",
    "xproc+xml": "xpl",
    "xslt+xml": "xslt",
    "internet-property-stream": "acx",
    "x-compress": "z",
    "x-compressed": "tgz",
    "x-gzip": "gz"
  },
  "audio": {
    "flac": "flac",
    "midi": ["mid", "midi", "kar", "rmi"],
    "mpeg": ["mpga", "mpega", "mp2", "mp3", "m4a", "mp2a", "m2a", "m3a"],
    "mpegurl": "m3u",
    "ogg": ["oga", "ogg", "spx"],
    "x-aiff": ["aif", "aiff", "aifc"],
    "x-ms-wma": "wma",
    "x-wav": "wav",
    "adpcm": "adp",
    "mp4": "mp4a",
    "webm": "weba",
    "x-aac": "aac",
    "x-caf": "caf",
    "x-matroska": "mka",
    "x-pn-realaudio-plugin": "rmp",
    "xm": "xm",
    "mid": ["mid", "rmi"]
  },
  "image": {
    "gif": "gif",
    "ief": "ief",
    "jpeg": ["jpeg", "jpg", "jpe"],
    "pcx": "pcx",
    "png": "png",
    "svg+xml": ["svg", "svgz"],
    "tiff": ["tiff", "tif"],
    "x-icon": "ico",
    "bmp": "bmp",
    "webp": "webp",
    "x-pict": ["pic", "pct"],
    "x-tga": "tga",
    "cis-cod": "cod"
  },
  "text": {
    "cache-manifest": ["manifest", "appcache"],
    "css": "css",
    "csv": "csv",
    "html": ["html", "htm", "shtml", "stm"],
    "mathml": "mml",
    "plain": ["txt", "text", "brf", "conf", "def", "list", "log", "in", "bas"],
    "richtext": "rtx",
    "tab-separated-values": "tsv",
    "x-bibtex": "bib"
  },
  "video": {
    "mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v", "mp2", "mpa", "mpv2"],
    "mp4": ["mp4", "mp4v", "mpg4"],
    "quicktime": ["qt", "mov"],
    "ogg": "ogv",
    "vnd.mpegurl": ["mxu", "m4u"],
    "x-flv": "flv",
    "x-la-asf": ["lsf", "lsx"],
    "x-mng": "mng",
    "x-ms-asf": ["asf", "asx", "asr"],
    "x-ms-wm": "wm",
    "x-ms-wmv": "wmv",
    "x-ms-wmx": "wmx",
    "x-ms-wvx": "wvx",
    "x-msvideo": "avi",
    "x-sgi-movie": "movie",
    "x-matroska": ["mpv", "mkv", "mk3d", "mks"],
    "3gpp2": "3g2",
    "h261": "h261",
    "h263": "h263",
    "h264": "h264",
    "jpeg": "jpgv",
    "jpm": ["jpm", "jpgm"],
    "mj2": ["mj2", "mjp2"],
    "vnd.ms-playready.media.pyv": "pyv",
    "vnd.uvvu.mp4": ["uvu", "uvvu"],
    "vnd.vivo": "viv",
    "webm": "webm",
    "x-f4v": "f4v",
    "x-m4v": "m4v",
    "x-ms-vob": "vob",
    "x-smv": "smv"
  }
};
const mime_mimeTypes = (() => {
  const types = {};
  for (const type in table) {
    if (table.hasOwnProperty(type)) {
      for (const subtype in table[type]) {
        if (table[type].hasOwnProperty(subtype)) {
          const val = table[type][subtype];
          if (typeof val === "string") {
            types[val] = type + "/" + subtype;
          } else {
            for (let i = 0; i < val.length; i++) {
              types[val[i]] = type + "/" + subtype;
            }
          }
        }
      }
    }
  }
  return types;
})();
const defaultValue = "text/plain";

/**
 * lookup
 * @param {string} filename 
 * @returns {string}
 */
const lookup = filename => {
  let value;
  if (filename) {
    const type = filename.split(".").pop().toLowerCase();
    value = mime_mimeTypes[type];
  }
  return value || defaultValue;
};
/* harmony default export */ const mime = ({
  lookup
});
;// CONCATENATED MODULE: ./src/resources.js







/**
 * Handle Package Resources
 */
class Resources {
  /**
   * Constructor
   * @param {Manifest} manifest
   * @param {object} [options]
   * @param {Archive} [options.archive]
   * @param {method} [options.request]
   * @param {method} [options.resolve]
   * @param {string} [options.replacements='base64']
   */
  constructor(manifest, {
    archive,
    request,
    resolve,
    replacements
  }) {
    this.settings = {
      replacements: replacements || "base64"
    };
    this.archive = archive;
    this.request = request;
    this.resolve = resolve;
    this.process(manifest);
  }

  /**
   * Process resources
   * @param {Manifest} manifest
   */
  process(manifest) {
    this.css = [];
    this.html = [];
    this.assets = [];
    this.urls = [];
    this.replacementUrls = [];
    manifest.forEach((item, key) => {
      if (item.type === "application/xhtml+xml" || item.type === "text/html") {
        this.html.push(item);
      } else {
        if (item.type === "text/css") {
          this.css.push(item);
        }
        this.assets.push(item);
        this.urls.push(item.href);
      }
    });
  }

  /**
   * Create a url to a resource
   * @param {string} url
   * @return {Promise<string>} Promise resolves with url string
   */
  async createUrl(url) {
    const parsedUrl = new utils_url(url);
    const mimeType = mime.lookup(parsedUrl.filename);
    const base64 = this.settings.replacements === "base64";
    if (this.archive) {
      return this.archive.createUrl(url, {
        base64: base64
      });
    } else if (base64) {
      return this.request(url, "blob").then(blob => {
        return blob2base64(blob);
      }).then(blob => {
        return createBase64Url(blob, mimeType);
      });
    } else {
      return this.request(url, "blob").then(blob => {
        return createBlobUrl(blob, mimeType);
      });
    }
  }

  /**
   * Create blob urls for all the assets
   * @return {Promise} returns replacement urls
   */
  async replacements() {
    if (this.settings.replacements === "none") {
      return new Promise(resolve => {
        resolve(this.urls);
      });
    }
    const replacements = this.replaceUrls();
    return Promise.all(replacements).then(urls => {
      this.replacementUrls = urls.filter(url => {
        return typeof url === "string";
      });
      return urls;
    });
  }

  /**
   * Replace URLs
   * @param {string} absoluteUri 
   * @returns {Promise[]} replacements
   * @private
   */
  replaceUrls() {
    return this.urls.map(async url => {
      const absolute = this.resolve(url);
      return this.createUrl(absolute).catch(err => {
        console.error(err);
        return null;
      });
    });
  }

  /**
   * Replace URLs in CSS resources
   * @param {Archive} [archive]
   * @param {method} [resolve]
   * @return {Promise}
   */
  replaceCss(archive, resolve) {
    const replaced = [];
    archive = archive || this.archive;
    resolve = resolve || this.resolve;
    this.css.forEach(item => {
      const replacement = this.createCssFile(item.href, archive, resolve).then(url => {
        // switch the url in the replacementUrls
        const index = this.urls.indexOf(item.href);
        if (index > -1) {
          this.replacementUrls[index] = url;
        }
      });
      replaced.push(replacement);
    });
    return Promise.all(replaced);
  }

  /**
   * Create a new CSS file with the replaced URLs
   * @param {string} href the original css file
   * @return {Promise} returns a BlobUrl to the new CSS file or a data url
   * @private
   */
  createCssFile(href) {
    let path = new utils_path(href);
    if (path.isAbsolute(path.toString())) {
      return new Promise(resolve => {
        resolve();
      });
    }
    const absoluteUri = this.resolve(href);

    // Get the text of the css file from the archive
    let textResponse;
    if (this.archive) {
      textResponse = this.archive.getText(absoluteUri);
    } else {
      textResponse = this.request(absoluteUri, "text");
    }
    if (!textResponse) {
      // file not found, don't replace
      return new Promise(resolve => {
        resolve();
      });
    }

    // Get asset links relative to css file
    const urls = this.relativeTo(absoluteUri);
    return textResponse.then(text => {
      // Replacements in the css text
      text = substitute(text, urls, this.replacementUrls);
      let newUrl;
      if (this.settings.replacements === "base64") {
        newUrl = createBase64Url(text, "text/css");
      } else {
        newUrl = createBlobUrl(text, "text/css");
      }
      return newUrl;
    }, err => {
      console.error(err);
      // handle response errors
      return new Promise(resolve => {
        resolve();
      });
    });
  }

  /**
   * Resolve all resources URLs relative to an absolute URL
   * @param {string} absoluteUri to be resolved to
   * @param {method} [resolve]
   * @return {string[]} array with relative Urls
   */
  relativeTo(absoluteUri, resolve) {
    resolve = resolve || this.resolve;

    // Get Urls relative to current sections
    return this.urls.map(href => {
      const resolved = resolve(href);
      const path = new utils_path(absoluteUri);
      return path.relative(path.directory, resolved);
    });
  }

  /**
   * Get a URL for a resource
   * @param {string} path
   * @return {string|null} url
   */
  get(path) {
    const index = this.urls.indexOf(path);
    if (index === -1) {
      return null;
    } else if (this.replacementUrls.length) {
      return new Promise((resolve, reject) => {
        resolve(this.replacementUrls[index]);
      });
    } else {
      return this.createUrl(path);
    }
  }

  /**
   * Substitute urls in content, with replacements,
   * relative to a url if provided
   * @param {string} content
   * @param {string} [url] url to resolve to
   * @return {string} content with urls substituted
   */
  substitute(content, url) {
    let relUrls;
    if (url) {
      relUrls = this.relativeTo(url);
    } else {
      relUrls = this.urls;
    }
    return substitute(content, relUrls, this.replacementUrls);
  }

  /**
   * destroy
   */
  destroy() {
    this.settings = undefined;
    this.replacementUrls = undefined;
    this.html = undefined;
    this.assets = undefined;
    this.css = undefined;
    this.urls = undefined;
  }
}
/* harmony default export */ const resources = (Resources);
;// CONCATENATED MODULE: ./src/pagelist.js




/**
 * Page List Parser
 */
class PageList {
  /**
   * Constructor
   * @param {Document} [xml] 
   */
  constructor(xml) {
    this.pages = [];
    this.locations = [];
    this.epubcfi = new src_epubcfi();
    this.firstPage = 0;
    this.lastPage = 0;
    this.totalPages = 0;
    this.toc = undefined;
    this.ncx = undefined;
    if (xml) {
      this.pageList = this.parse(xml);
    }
    if (this.pageList && this.pageList.length) {
      this.process(this.pageList);
    }
  }

  /**
   * Parse PageList Xml
   * @param {Document} xml
   * @returns {Array}
   */
  parse(xml) {
    const html = qs(xml, "html");
    const ncx = qs(xml, "ncx");
    if (html) {
      return this.parseNav(xml);
    } else if (ncx) {
      return this.parseNcx(xml);
    }
    return [];
  }

  /**
   * Parse a Nav PageList
   * @param {Node} navHtml
   * @return {PageList.item[]} list
   * @private
   */
  parseNav(navHtml) {
    const navElement = querySelectorByType(navHtml, "nav", "page-list");
    const navItems = navElement ? qsa(navElement, "li") : [];
    const length = navItems.length;
    const list = [];
    if (!navItems || length === 0) return list;
    for (let i = 0; i < length; ++i) {
      const item = this.item(navItems[i]);
      list.push(item);
    }
    return list;
  }

  /**
   * parseNcx
   * @param {Node} navXml 
   * @returns {Array}
   * @private
   */
  parseNcx(navXml) {
    const list = [];
    const pageList = qs(navXml, "pageList");
    if (!pageList) return list;
    const pageTargets = qsa(pageList, "pageTarget");
    const length = pageTargets.length;
    if (!pageTargets || pageTargets.length === 0) {
      return list;
    }
    for (let i = 0; i < length; ++i) {
      const item = this.ncxItem(pageTargets[i]);
      list.push(item);
    }
    return list;
  }

  /**
   * ncxItem
   * @param {Node} item 
   * @returns {object}
   * @private
   */
  ncxItem(item) {
    const navLabel = qs(item, "navLabel");
    const navLabelText = qs(navLabel, "text");
    const pageText = navLabelText.textContent;
    const content = qs(item, "content");
    return {
      href: content.getAttribute("src"),
      page: parseInt(pageText, 10)
    };
  }

  /**
   * Page List Item
   * @param {Node} item
   * @return {object} pageListItem
   * @private
   */
  item(item) {
    const content = qs(item, "a");
    const href = content.getAttribute("href") || "";
    const text = content.textContent || "";
    const page = parseInt(text);
    if (href.indexOf("epubcfi") !== -1) {
      const split = href.split("#");
      return {
        cfi: split.length > 1 ? split[1] : false,
        href: href,
        packageUrl: split[0],
        page: page
      };
    } else {
      return {
        href: href,
        page: page
      };
    }
  }

  /**
   * Process pageList items
   * @param {array} pageList
   * @private
   */
  process(pageList) {
    pageList.forEach(item => {
      this.pages.push(item.page);
      if (item.cfi) {
        this.locations.push(item.cfi);
      }
    }, this);
    this.firstPage = parseInt(this.pages[0]);
    this.lastPage = parseInt(this.pages[this.pages.length - 1]);
    this.totalPages = this.lastPage - this.firstPage;
  }

  /**
   * Get a PageList result from a EpubCFI
   * @param {string} cfi EpubCFI String
   * @return {number} page
   */
  pageFromCfi(cfi) {
    // Check if the pageList has not been set yet
    if (this.locations.length === 0) {
      return -1;
    }
    // TODO: check if CFI is valid?

    // check if the cfi is in the location list
    // var index = this.locations.indexOf(cfi);
    let pg,
      index = indexOfSorted(cfi, this.locations, this.epubcfi.compare);
    if (index != -1) {
      pg = this.pages[index];
    } else {
      // Otherwise add it to the list of locations
      // Insert it in the correct position in the locations page
      //index = EPUBJS.core.insert(cfi, this.locations, this.epubcfi.compare);
      index = locationOf(cfi, this.locations, this.epubcfi.compare);
      // Get the page at the location just before the new one, or return the first
      pg = index - 1 >= 0 ? this.pages[index - 1] : this.pages[0];
      if (pg !== undefined) {
        // Add the new page in so that the locations and page array match up
        //this.pages.splice(index, 0, pg);
      } else {
        pg = -1;
      }
    }
    return pg;
  }

  /**
   * Get an EpubCFI from a Page List Item
   * @param {string|number} pg
   * @return {string} cfi
   */
  cfiFromPage(pg) {
    // check that pg is an int
    if (typeof pg !== "number") {
      pg = parseInt(pg);
    }

    // check if the cfi is in the page list
    // Pages could be unsorted.
    const index = this.pages.indexOf(pg);
    let cfi = -1;
    if (index !== -1) {
      cfi = this.locations[index];
    }
    // TODO: handle pages not in the list
    return cfi;
  }

  /**
   * Get a Page from Book percentage
   * @param {number} percent
   * @return {number} page
   */
  pageFromPercentage(percent) {
    return Math.round(this.totalPages * percent);
  }

  /**
   * Returns a value between 0 - 1 corresponding to the location of a page
   * @param {number} pg the page
   * @return {number} percentage
   */
  percentageFromPage(pg) {
    const percentage = (pg - this.firstPage) / this.totalPages;
    return Math.round(percentage * 1000) / 1000;
  }

  /**
   * Returns a value between 0 - 1 corresponding to the location of a cfi
   * @param {string} cfi EpubCFI String
   * @return {number} percentage
   */
  percentageFromCfi(cfi) {
    const pg = this.pageFromCfi(cfi);
    const percentage = this.percentageFromPage(pg);
    return percentage;
  }

  /**
   * Destroy
   */
  destroy() {
    this.pages = undefined;
    this.locations = undefined;
    this.epubcfi = undefined;
    this.pageList = undefined;
    this.toc = undefined;
    this.ncx = undefined;
  }
}
/* harmony default export */ const pagelist = (PageList);
;// CONCATENATED MODULE: ./src/annotation.js




/**
 * Annotation class
 */
class Annotation {
  /**
   * Constructor
   * @param {string} type Type of annotation to add: `"highlight"` OR `"underline"`
   * @param {string} cfiRange EpubCFI range to attach annotation to
   * @param {object} [options]
   * @param {object} [options.data] Data to assign to annotation
   * @param {method} [options.cb] Callback after annotation is clicked
   * @param {string} [options.className] CSS class to assign to annotation
   * @param {object} [options.styles] CSS styles to assign to annotation
   */
  constructor(type, cfiRange, {
    data,
    cb,
    className,
    styles
  }) {
    /**
     * @member {string} type
     * @memberof Annotation
     * @readonly
     */
    this.type = type;
    this.cfiRange = cfiRange;
    /**
     * @member {number} sectionIndex
     * @memberof Annotation
     * @readonly
     */
    this.sectionIndex = new src_epubcfi(cfiRange).spinePos;
    this.data = data;
    this.cb = cb;
    this.className = className;
    this.styles = styles;
    /**
     * @member {Mark} mark
     * @memberof Annotation
     * @readonly
     */
    this.mark = undefined;
  }

  /**
   * Update stored data
   * @param {object} data
   */
  update(data) {
    this.data = data;
  }

  /**
   * Add to a view
   * @param {View} view
   * @returns {object|null}
   */
  attach(view) {
    let result;
    if (!view) {
      return null;
    } else if (this.type === "highlight") {
      result = view.highlight(this.cfiRange, this.data, this.cb, this.className, this.styles);
    } else if (this.type === "underline") {
      result = view.underline(this.cfiRange, this.data, this.cb, this.className, this.styles);
    }
    this.mark = result;
    /**
     * @event attach
     * @param {Mark} result
     * @memberof Annotation
     */
    this.emit(EVENTS.ANNOTATION.ATTACH, result);
    return result;
  }

  /**
   * Remove from a view
   * @param {View} view
   * @returns {boolean}
   */
  detach(view) {
    let result = false;
    if (!view) {
      return result;
    } else if (this.type === "highlight") {
      result = view.unhighlight(this.cfiRange);
    } else if (this.type === "underline") {
      result = view.ununderline(this.cfiRange);
    }
    this.mark = undefined;
    /**
     * @event detach
     * @param {boolean} result
     * @memberof Annotation
     */
    this.emit(EVENTS.ANNOTATION.DETACH, result);
    return result;
  }

  /**
   * [Not Implemented] Get text of an annotation
   * @TODO: needs implementation in contents
   */
  text() {}
}
event_emitter_default()(Annotation.prototype);
/* harmony default export */ const src_annotation = (Annotation);
;// CONCATENATED MODULE: ./src/annotations.js


/**
 * Handles managing adding & removing Annotations
 */
class Annotations extends Map {
  /**
   * Constructor
   * @param {Rendition} rendition
   */
  constructor(rendition) {
    super();
    this.rendition = rendition;
    this.rendition.hooks.render.register(this.inject.bind(this));
    this.rendition.hooks.unloaded.register(this.reject.bind(this));
  }

  /**
   * Append an annotation to store
   * @param {string} type Type of annotation to append: `"highlight"` OR `"underline"`
   * @param {string} cfiRange EpubCFI range to attach annotation to
   * @param {object} [options]
   * @param {object} [options.data] Data to assign to annotation
   * @param {method} [options.cb] Callback after annotation is added
   * @param {string} [options.className] CSS class to assign to annotation
   * @param {object} [options.styles] CSS styles to assign to annotation
   * @returns {Annotation} Annotation that was append
   */
  append(type, cfiRange, options) {
    const key = encodeURI(type + ":" + cfiRange);
    const annotation = new src_annotation(type, cfiRange, options);
    this.rendition.views().forEach(view => {
      const index = view.section.index;
      if (annotation.sectionIndex === index) {
        annotation.attach(view);
      }
    });
    this.set(key, annotation);
    return annotation;
  }

  /**
   * Remove an annotation from store
   * @param {string} type Type of annotation to remove: `"highlight"` OR `"underline"`
   * @param {string} cfiRange EpubCFI range to attach annotation to
   */
  remove(type, cfiRange) {
    const key = encodeURI(type + ":" + cfiRange);
    const annotation = this.get(key);
    if (annotation) {
      this.rendition.views().forEach(view => {
        const index = view.section.index;
        if (annotation.sectionIndex === index) {
          annotation.detach(view);
        }
      });
      this.delete(key);
    }
  }

  /**
   * Hook for injecting annotation into a view
   * @param {View} view
   * @private
   */
  inject(view) {
    const index = view.section.index;
    this.forEach((note, key) => {
      if (note.sectionIndex === index) {
        note.attach(view);
      }
    });
  }

  /**
   * Hook for removing annotation from a view
   * @param {View} view
   * @private
   */
  reject(view) {
    const index = view.section.index;
    this.forEach((note, key) => {
      if (note.sectionIndex === index) {
        note.detach(view);
      }
    });
  }

  /**
   * [Not Implemented] Show annotations
   * @TODO: needs implementation in View
   */
  show() {}

  /**
   * [Not Implemented] Hide annotations
   * @TODO: needs implementation in View
   */
  hide() {}
}
/* harmony default export */ const annotations = (Annotations);
;// CONCATENATED MODULE: ./src/layout.js



/**
 * Figures out the CSS values to apply for a layout
 */
class Layout {
  /**
   * Constructor
   * @param {object} options 
   * @param {string} [options.name='reflowable'] values: `"reflowable"` OR `"pre-paginated"`
   * @param {string} [options.flow='paginated'] values: `"paginated"` OR `"scrolled"` OR `"scrolled-doc"`
   * @param {string} [options.spread='auto'] values: `"auto"` OR `"none"`
   * @param {string} [options.direction='ltr'] values: `"ltr"` OR `"rtl"`
   * @param {string} [options.orientation='auto'] values: `"auto"` OR `"landscape"` OR `"portrait"`
   * @param {number} [options.minSpreadWidth=800]
   */
  constructor(options) {
    /**
     * @member {string} name Layout name
     * @memberof Layout
     * @protected
     */
    this.name = "reflowable";
    /**
     * @member {string} flow
     * @memberof Layout
     * @readonly
     */
    this.flow = "paginated";
    /**
     * @member {boolean} spread
     * @memberof Layout
     * @readonly
     */
    this.spread = "auto";
    /**
     * @member {string} direction
     * @memberof Layout
     * @readonly
     */
    this.direction = "ltr";
    /**
     * @member {string} orientation no implementation
     * @memberof Layout
     * @readonly
     */
    this.orientation = "auto";
    /**
     * @member {string} viewport no implementation
     * @memberof Layout
     * @readonly
     */
    this.viewport = "";
    /**
     * @member {number} minSpreadWidth
     * @memberof Layout
     * @readonly
     */
    this.minSpreadWidth = 800;
    /**
     * @member {number} width Layout width
     * @memberof Layout
     * @readonly
     */
    this.width = 0;
    /**
     * @member {number} height Layout height
     * @memberof Layout
     * @readonly
     */
    this.height = 0;
    /**
     * @member {number} spreadWidth Spread width
     * @memberof Layout
     * @readonly
     */
    this.spreadWidth = 0;
    /**
     * @member {number} delta
     * @memberof Layout
     * @readonly
     */
    this.delta = 0;
    /**
     * @member {number} columnWidth Column width
     * @memberof Layout
     * @readonly
     */
    this.columnWidth = 0;
    /**
     * @member {number} gap
     * @memberof Layout
     * @readonly
     */
    this.gap = 0;
    /**
     * @member {number} divisor
     * @memberof Layout
     * @readonly
     */
    this.divisor = 1;
    this.set({
      name: options && options.name,
      flow: options && options.flow,
      spread: options && options.spread,
      direction: options && options.direction,
      orientation: options && options.orientation,
      minSpreadWidth: options && options.minSpreadWidth
    });
  }

  /**
   * Set options
   * @param {object} options
   */
  set(options) {
    const error = name => console.error(`Invalid '${name}' property type`);
    Object.keys(options).forEach(opt => {
      const value = options[opt];
      if (this[opt] === value || typeof value === "undefined") {
        delete options[opt];
      } else if (opt === "name" || opt === "direction" || opt === "orientation") {
        if (typeof value === "string") {
          this[opt] = options[opt];
        } else error(opt);
      } else if (opt === "flow") {
        if (typeof value === "string") {
          switch (value) {
            case "scrolled":
            case "scrolled-continuous":
              this.flow = "scrolled";
              this.spread = "none"; // autocomplete
              break;
            case "scrolled-doc":
              this.flow = value;
              this.spread = "none"; // autocomplete
              break;
            default:
              this.flow = "paginated";
              break;
          }
        } else error(opt);
      } else if (opt === "spread") {
        if (typeof value === "string") {
          switch (value) {
            case "auto":
            case "both":
              this.spread = "auto";
              break;
            default:
              this.spread = "none";
              break;
          }
        } else error(opt);
      } else if (opt === "width" || opt === "height" || opt === "gap" || opt === "minSpreadWidth") {
        if (typeof value === "number") {
          if (value >= 0) {
            this[opt] = options[opt];
          }
        } else error(opt);
      }
    });
    this.calculate();
    if (Object.keys(options).length) {
      this.emit(EVENTS.LAYOUT.UPDATED, this, options);
    }
  }

  /**
   * Calculate the dimensions of the pagination
   * @param {number} [width] width of the rendering
   * @param {number} [height] height of the rendering
   * @param {number} [gap] width of the gap between columns
   */
  calculate(width, height, gap) {
    if (typeof width === "undefined") {
      width = this.width;
    }
    if (typeof height === "undefined") {
      height = this.height;
    }

    //-- Check the width and create even width columns

    let divisor;
    if (this.spread === "auto" && width >= this.minSpreadWidth) {
      divisor = 2;
    } else {
      divisor = 1;
    }
    const section = Math.floor(width / 12);
    if (this.name === "reflowable" && this.flow === "paginated" && !(gap >= 0)) {
      gap = section % 2 === 0 ? section : section - 1;
    }
    if (this.name === "pre-paginated") {
      gap = 0;
    }
    if (typeof gap === "undefined") {
      gap = 0;
    }
    let columnWidth;
    let pageWidth;
    //-- Double Page
    if (divisor > 1) {
      columnWidth = width / divisor - gap;
      pageWidth = columnWidth + gap;
    } else {
      columnWidth = width;
      pageWidth = width;
    }
    if (this.name === "pre-paginated" && divisor > 1) {
      width = columnWidth;
    }
    this.width = width;
    this.height = height;
    this.spreadWidth = columnWidth * divisor + gap;
    this.pageWidth = pageWidth;
    this.delta = width;
    this.columnWidth = columnWidth;
    this.gap = gap;
    this.divisor = divisor;
  }

  /**
   * Apply Css to a Document
   * @param {Contents} contents
   * @param {Section} [section] 
   * @param {string} [axis] 
   * @return {Promise}
   */
  format(contents, section, axis) {
    let formating;
    if (this.name === "pre-paginated") {
      formating = contents.fit(this.columnWidth, this.height, section);
    } else if (this.flow === "paginated") {
      formating = contents.columns(this.width, this.height, this.columnWidth, this.gap, this.direction);
    } else if (axis && axis === "horizontal") {
      formating = contents.size(null, this.height);
    } else {
      formating = contents.size(this.width, null);
    }
    return formating; // might be a promise in some View Managers
  }

  /**
   * Count number of pages
   * @param {number} totalLength
   * @param {number} [pageLength]
   * @return {{spreads: number, pages: number}}
   */
  count(totalLength, pageLength) {
    let spreads, pages;
    if (this.name === "pre-paginated") {
      spreads = 1;
      pages = 1;
    } else if (this.flow === "paginated") {
      pageLength = pageLength || this.delta;
      spreads = Math.ceil(totalLength / pageLength);
      pages = spreads * this.divisor;
    } else {
      // scrolled
      pageLength = pageLength || this.height;
      spreads = Math.ceil(totalLength / pageLength);
      pages = spreads;
    }
    return {
      spreads,
      pages
    };
  }
}
event_emitter_default()(Layout.prototype);
/* harmony default export */ const layout = (Layout);
;// CONCATENATED MODULE: ./src/themes.js




/**
 * Themes to apply to displayed content
 */
class Themes extends Map {
  /**
   * Constructor
   * @param {Rendition} rendition
   */
  constructor(rendition) {
    super();
    this.rendition = rendition;
    /**
     * @member {string} current
     * @memberof Themes
     * @readonly
     */
    this.current = undefined;
    /**
     * @member {object} overrides
     * @memberof Themes
     * @readonly
     */
    this.overrides = {};
    this.rendition.hooks.content.register(this.inject.bind(this));
    this.rendition.hooks.content.register(this.update.bind(this));
  }

  /**
   * Add themes to be used by a rendition
   * @param {object|Array<object>|string} args
   * @example themes.register("light", "http://example.com/light.css")
   * @example themes.register("light", { body: { color: "purple"}})
   * @example themes.register({ light: {...}, dark: {...}})
   */
  register() {
    if (arguments.length === 0) {
      return;
    }
    if (arguments.length === 1 && typeof arguments[0] === "object") {
      return this.registerThemes(arguments[0]);
    }
    if (arguments.length === 2 && typeof arguments[1] === "string") {
      return this.registerUrl(arguments[0], arguments[1]);
    }
    if (arguments.length === 2 && typeof arguments[1] === "object") {
      return this.registerRules(arguments[0], arguments[1]);
    }
  }

  /**
   * Register themes object
   * @param {object} themes
   */
  registerThemes(themes) {
    for (const theme in themes) {
      if (themes.hasOwnProperty(theme)) {
        if (typeof themes[theme] === "string") {
          this.registerUrl(theme, themes[theme]);
        } else {
          this.registerRules(theme, themes[theme]);
        }
      }
    }
  }

  /**
   * Register a url
   * @param {string} name Theme name
   * @param {string} input URL string
   * @example themes.registerUrl("light", "light.css")
   * @example themes.registerUrl("light", "http://example.com/light.css")
   */
  registerUrl(name, input) {
    const url = new utils_url(input);
    this.set(name, {
      injected: false,
      url: url.toString()
    });
  }

  /**
   * Register rule
   * @param {string} name
   * @param {object} rules
   * @example themes.registerRules("light", { body: { color: "purple"}})
   */
  registerRules(name, rules) {
    this.set(name, {
      injected: false,
      rules: rules
    });
  }

  /**
   * Select a theme
   * @param {string} name Theme name
   */
  select(name) {
    const theme = this.get(name);
    if (this.current === name || !theme) return;
    const prev = this.current;
    this.current = name;
    const contents = this.rendition.getContents();
    contents.forEach(content => {
      if (content) {
        content.removeClass(prev);
        content.addClass(name);
        this.add(name, theme, content);
      }
    });
    /**
     * Emit which occurs when theme is selected
     * @event selected
     * @param {string} name Theme key
     * @param {object} theme Theme value
     * @memberof Themes
     */
    this.emit(EVENTS.THEMES.SELECTED, name, theme);
  }

  /**
   * Add Theme to contents
   * @param {string} key
   * @param {object} value 
   * @param {Contents} contents
   * @private
   */
  add(key, value, contents) {
    if (value.url) {
      contents.addStylesheet(value.url);
      value.injected = true;
    }
    if (value.rules) {
      contents.addStylesheetRules(value.rules, key);
      value.injected = true;
    }
  }

  /**
   * Inject all themes into contents
   * @param {Contents} contents
   * @private
   */
  inject(contents) {
    this.forEach((value, key) => {
      if (this.current === key) {
        this.add(key, value, contents);
      }
    });
    contents.addClass(this.current);
  }

  /**
   * Update all themes into contents
   * @param {Contents} contents
   * @private
   */
  update(contents) {
    const rules = this.overrides;
    for (const rule in rules) {
      if (rules.hasOwnProperty(rule)) {
        contents.css(rule, rules[rule].value, rules[rule].priority);
      }
    }
  }

  /**
   * Append rule
   * @param {string} name
   * @param {string} value
   * @param {boolean} [priority=false]
   */
  appendRule(name, value, priority = false) {
    const rule = {
      value: value,
      priority: priority === true
    };
    const contents = this.rendition.getContents();
    contents.forEach(content => {
      if (content) {
        content.css(name, rule.value, rule.priority);
      }
    });
    this.overrides[name] = rule;
  }

  /**
   * Remove rule
   * @param {string} name
   */
  removeRule(name) {
    delete this.overrides[name];
    const contents = this.rendition.getContents();
    contents.forEach(content => {
      if (content) {
        content.css(name);
      }
    });
  }

  /**
   * Adjust the font size of a rendition
   * @param {number} size
   */
  fontSize(size) {
    this.appendRule("font-size", size);
  }

  /**
   * Adjust the font-family of a rendition
   * @param {string} f
   */
  font(f) {
    this.appendRule("font-family", f, true);
  }

  /**
   * destroy
   */
  destroy() {
    this.clear();
    this.current = undefined;
    this.overrides = {};
  }
}
event_emitter_default()(Themes.prototype);
/* harmony default export */ const themes = (Themes);
;// CONCATENATED MODULE: ./src/utils/hook.js

/**
 * Hooks allow for injecting functions that must all complete in order before finishing
 * They will execute in parallel but all must finish before continuing
 * Functions may return a promise if they are async.
 */
class Hook {
  /**
   * Constructor
   * @param {any} context scope of this
   * @example this.content = new Hook(this);
   */
  constructor(context) {
    this.context = context || this;
    this.hooks = [];
  }

  /**
   * Adds a function to be run before a hook completes
   * @example this.content.register(() => {...});
   */
  register() {
    for (let i = 0; i < arguments.length; ++i) {
      if (typeof arguments[i] === "function") {
        this.hooks.push(arguments[i]);
      } else if (arguments[i] instanceof Array) {
        // unpack array
        this.register(arguments[i]); // recursive call
      } else {
        throw new TypeError("Invalid argument type");
      }
    }
  }

  /**
   * Removes a function
   * @example this.content.deregister(() => {...});
   */
  deregister(func) {
    for (let i = 0; i < this.hooks.length; i++) {
      if (this.hooks[i] === func) {
        this.hooks.splice(i, 1);
        break;
      }
    }
  }

  /**
   * Triggers a hook to run all functions
   * @example this.content.trigger(args).then(() => {...});
   * @returns {Promise[]}
   */
  trigger() {
    const args = arguments;
    const context = this.context;
    const promises = [];
    let executing;
    this.hooks.forEach(task => {
      try {
        executing = task.apply(context, args);
      } catch (err) {
        console.error(err);
      }
      if (executing && typeof executing["then"] === "function") {
        // Task is a function that returns a promise
        promises.push(executing);
      }
    });
    return Promise.all(promises);
  }

  /**
   * list
   * @returns {Array}
   */
  list() {
    return this.hooks;
  }

  /**
   * clear
   */
  clear() {
    this.hooks = [];
  }
}
/* harmony default export */ const hook = (Hook);
;// CONCATENATED MODULE: ./src/mapping.js




/**
 * Map text locations to CFI ranges
 */
class Mapping {
  /**
   * Constructor
   * @param {Layout} layout Layout to apply
   * @param {string} [axis="horizontal"] values: `"horizontal"` OR `"vertical"`
   * @param {boolean} [dev=false] toggle developer highlighting
   */
  constructor(layout, axis, dev = false) {
    this.layout = layout;
    this.horizontal = axis === "horizontal";
    this.devMode = dev;
  }

  /**
   * Find CFI pairs for entire section at once
   * @param {*} view 
   * @returns {object[]}
   */
  section(view) {
    const ranges = this.findRanges(view);
    return this.rangeListToCfiList(view.section.cfiBase, ranges);
  }

  /**
   * Find CFI pairs for a page
   * @param {Contents} contents Contents from view
   * @param {string} cfiBase string of the base for a cfi
   * @param {number} start position to start at
   * @param {number} end position to end at
   * @returns {any}
   */
  page(contents, cfiBase, start, end) {
    const root = contents && contents.document ? contents.document.body : false;
    if (!root) return;
    const result = this.rangePairToCfiPair(cfiBase, {
      start: this.findStart(root, start, end),
      end: this.findEnd(root, start, end)
    });
    if (this.devMode === true) {
      const doc = contents.document;
      const startRange = new src_epubcfi(result.start).toRange(doc);
      const endRange = new src_epubcfi(result.end).toRange(doc);
      const selection = doc.defaultView.getSelection();
      const range = doc.createRange();
      selection.removeAllRanges();
      range.setStart(startRange.startContainer, startRange.startOffset);
      range.setEnd(endRange.endContainer, endRange.endOffset);
      selection.addRange(range);
    }
    return result;
  }

  /**
   * Walk a node, preforming a function on each node it finds
   * @param {Node} root Node to walkToNode
   * @param {function} func walk function
   * @return {*} returns the result of the walk function
   * @private
   */
  walk(root, func) {
    // IE11 has strange issue, if root is text node IE throws exception on
    // calling treeWalker.nextNode(), saying
    // Unexpected call to method or property access instead of returning null value
    if (root && root.nodeType === Node.TEXT_NODE) {
      return;
    }
    // safeFilter is required so that it can work in IE as filter is a function for IE
    // and for other browser filter is an object.
    const filter = {
      acceptNode: node => {
        if (node.data.trim().length > 0) {
          return NodeFilter.FILTER_ACCEPT;
        } else {
          return NodeFilter.FILTER_REJECT;
        }
      }
    };
    const safeFilter = filter.acceptNode;
    safeFilter.acceptNode = filter.acceptNode;
    const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, safeFilter, false);
    let node;
    let result;
    while (node = treeWalker.nextNode()) {
      result = func(node);
      if (result) break;
    }
    return result;
  }

  /**
   * findRanges
   * @param {*} view 
   * @returns {object[]} columns
   */
  findRanges(view) {
    const columns = [];
    const scrollWidth = view.contents.scrollWidth();
    const spreads = Math.ceil(scrollWidth / this.layout.spreadWidth);
    const countPages = spreads * this.layout.divisor;
    const columnWidth = this.layout.columnWidth;
    const gap = this.layout.gap;
    const body = view.document.body;
    for (let i = 0; i < countPages; i++) {
      const start = (columnWidth + gap) * i;
      const end = columnWidth * (i + 1) + gap * i;
      columns.push({
        start: this.findStart(body, start, end),
        end: this.findEnd(body, start, end)
      });
    }
    return columns;
  }

  /**
   * Find Start Range
   * @private
   * @param {Node} root root node
   * @param {number} start position to start at
   * @param {number} end position to end at
   * @return {Range}
   */
  findStart(root, start, end) {
    const stack = [root];
    let prev = root;
    while (stack.length) {
      const el = stack.shift();
      const found = this.walk(el, node => {
        let left, right, top, bottom;
        const elPos = nodeBounds(node);
        if (this.horizontal && this.layout.direction === "ltr") {
          left = this.horizontal ? elPos.left : elPos.top;
          right = this.horizontal ? elPos.right : elPos.bottom;
          if (left >= start && left <= end) {
            return node;
          } else if (right > start) {
            return node;
          } else {
            prev = node;
            stack.push(node);
          }
        } else if (this.horizontal && this.layout.direction === "rtl") {
          left = elPos.left;
          right = elPos.right;
          if (right <= end && right >= start) {
            return node;
          } else if (left < end) {
            return node;
          } else {
            prev = node;
            stack.push(node);
          }
        } else {
          top = elPos.top;
          bottom = elPos.bottom;
          if (top >= start && top <= end) {
            return node;
          } else if (bottom > start) {
            return node;
          } else {
            prev = node;
            stack.push(node);
          }
        }
      });
      if (found) {
        return this.findTextStartRange(found, start, end);
      }
    }

    // Return last element
    return this.findTextStartRange(prev, start, end);
  }

  /**
   * Find End Range
   * @private
   * @param {Node} root root node
   * @param {number} start position to start at
   * @param {number} end position to end at
   * @return {Range}
   */
  findEnd(root, start, end) {
    const stack = [root];
    let prev = root;
    while (stack.length) {
      const el = stack.shift();
      const found = this.walk(el, node => {
        let left, right, top, bottom;
        const elPos = nodeBounds(node);
        if (this.horizontal && this.layout.direction === "ltr") {
          left = Math.round(elPos.left);
          right = Math.round(elPos.right);
          if (left > end && prev) {
            return prev;
          } else if (right > end) {
            return node;
          } else {
            prev = node;
            stack.push(node);
          }
        } else if (this.horizontal && this.layout.direction === "rtl") {
          left = Math.round(this.horizontal ? elPos.left : elPos.top);
          right = Math.round(this.horizontal ? elPos.right : elPos.bottom);
          if (right < start && prev) {
            return prev;
          } else if (left < start) {
            return node;
          } else {
            prev = node;
            stack.push(node);
          }
        } else {
          top = Math.round(elPos.top);
          bottom = Math.round(elPos.bottom);
          if (top > end && prev) {
            return prev;
          } else if (bottom > end) {
            return node;
          } else {
            prev = node;
            stack.push(node);
          }
        }
      });
      if (found) {
        return this.findTextEndRange(found, start, end);
      }
    }

    // end of chapter
    return this.findTextEndRange(prev, start, end);
  }

  /**
   * Find Text Start Range
   * @private
   * @param {Node} root root node
   * @param {number} start position to start at
   * @param {number} end position to end at
   * @return {Range}
   */
  findTextStartRange(node, start, end) {
    const ranges = this.splitTextNodeIntoRanges(node);
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      const pos = range.getBoundingClientRect();
      if (this.horizontal && this.layout.direction === "ltr") {
        if (pos.left >= start) {
          return range;
        }
      } else if (this.horizontal && this.layout.direction === "rtl") {
        if (pos.right <= end) {
          return range;
        }
      } else {
        if (pos.top >= start) {
          return range;
        }
      }
    }
    return ranges[0];
  }

  /**
   * Find Text End Range
   * @private
   * @param {Node} root root node
   * @param {number} start position to start at
   * @param {number} end position to end at
   * @return {Range}
   */
  findTextEndRange(node, start, end) {
    const ranges = this.splitTextNodeIntoRanges(node);
    let prev;
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      const pos = range.getBoundingClientRect();
      if (this.horizontal && this.layout.direction === "ltr") {
        if (pos.left > end && prev) {
          return prev;
        } else if (pos.right > end) {
          return range;
        }
      } else if (this.horizontal && this.layout.direction === "rtl") {
        if (pos.right < start && prev) {
          return prev;
        } else if (pos.left < start) {
          return range;
        }
      } else {
        if (pos.top > end && prev) {
          return prev;
        } else if (pos.bottom > end) {
          return range;
        }
      }
      prev = range;
    }

    // Ends before limit
    return ranges[ranges.length - 1];
  }

  /**
   * Split up a text node into ranges for each word
   * @private
   * @param {Node} root root node
   * @param {string} [splitter=' '] what to split on
   * @return {Range[]}
   */
  splitTextNodeIntoRanges(node, splitter = " ") {
    const ranges = [];
    const textContent = node.textContent || "";
    const text = textContent.trim();
    const doc = node.ownerDocument;
    let range;
    let pos = text.indexOf(splitter);
    if (pos === -1 || node.nodeType != Node.TEXT_NODE) {
      range = doc.createRange();
      range.selectNodeContents(node);
      return [range];
    }
    range = doc.createRange();
    range.setStart(node, 0);
    range.setEnd(node, pos);
    ranges.push(range);
    range = false;
    while (pos !== -1) {
      pos = text.indexOf(splitter, pos + 1);
      if (pos > 0) {
        if (range) {
          range.setEnd(node, pos);
          ranges.push(range);
        }
        range = doc.createRange();
        range.setStart(node, pos + 1);
      }
    }
    if (range) {
      range.setEnd(node, text.length);
      ranges.push(range);
    }
    return ranges;
  }

  /**
   * Turn a pair of ranges into a pair of CFIs
   * @param {string} cfiBase base string for an EpubCFI
   * @param {{ start: Range, end: Range }} rangePair Range pair
   * @return {{ start: string, end: string }} EpubCFI string format pair
   * @private
   */
  rangePairToCfiPair(cfiBase, rangePair) {
    const startRange = rangePair.start;
    const endRange = rangePair.end;
    startRange.collapse(true);
    endRange.collapse(false);
    return {
      start: new src_epubcfi(startRange, cfiBase).toString(),
      end: new src_epubcfi(endRange, cfiBase).toString()
    };
  }

  /**
   * rangeListToCfiList
   * @param {*} cfiBase 
   * @param {*} columns 
   * @returns {object[]}
   */
  rangeListToCfiList(cfiBase, columns) {
    const map = [];
    for (let i = 0; i < columns.length; i++) {
      const cifPair = this.rangePairToCfiPair(cfiBase, columns[i]);
      map.push(cifPair);
    }
    return map;
  }

  /**
   * Set the axis for mapping
   * @param {string} value `"horizontal"` OR `"vertical"`
   * @return {boolean} is it horizontal?
   */
  axis(value) {
    this.horizontal = value === "horizontal";
    return this.horizontal;
  }
}
/* harmony default export */ const src_mapping = (Mapping);
// EXTERNAL MODULE: ./node_modules/lodash/throttle.js
var throttle = __webpack_require__(7350);
var throttle_default = /*#__PURE__*/__webpack_require__.n(throttle);
;// CONCATENATED MODULE: ./src/managers/helpers/stage.js




/**
 * Stage
 */
class Stage {
  /**
   * Constructor
   * @param {Layout} layout 
   * @param {object} options
   * @param {string} options.axis
   * @param {boolean} options.fullsize
   * @param {string|number} options.width
   * @param {string|number} options.height
   */
  constructor(layout, options) {
    /**
     * @member {object} settings
     * @memberof Stage
     * @readonly
     */
    this.settings = options || {};
    /**
     * @member {string} id
     * @memberof Stage
     * @readonly
     */
    this.id = "epubjs-container-" + uuid();
    /**
     * @member {Element} container
     * @memberof Stage
     * @readonly
     */
    this.container = this.create(this.settings);
    this.layout = layout;
    this.layout.on(EVENTS.LAYOUT.UPDATED, (props, changed) => {
      if (changed.flow) {
        this.updateFlow(changed.flow);
      } else if (changed.direction) {
        this.direction(changed.direction);
      }
    });
    this.updateFlow();
    this.direction();
    this.axis(options.axis || "vertical");
    if (this.settings.hidden) {
      this.wrapper = this.wrap(this.container);
    }
  }

  /**
   * Creates an element to render to.
   * Resizes to passed width and height or to the elements size
   * @param {object} options 
   * @returns {Element} container
   */
  create(options) {
    let width = options.width;
    let height = options.height;
    extend(this.settings, options);
    if (options.height && isNumber(options.height)) {
      height = options.height + "px";
    }
    if (options.width && isNumber(options.width)) {
      width = options.width + "px";
    }

    // Create new container element
    const container = document.createElement("div");
    container.id = this.id;
    container.classList.add("epub-container");

    // Style Element
    container.style.wordSpacing = "0";
    container.style.lineHeight = "0";
    container.style.verticalAlign = "top";
    container.style.position = "relative";
    container.style.display = "flex";
    container.style.flexWrap = "nowrap";
    if (width) {
      container.style.width = width;
    }
    if (height) {
      container.style.height = height;
    }
    return container;
  }

  /**
   * wrap
   * @param {Element} container 
   * @returns {Element} wrapper
   */
  wrap(container) {
    const wrapper = document.createElement("div");
    wrapper.style.visibility = "hidden";
    wrapper.style.overflow = "hidden";
    wrapper.style.width = "0";
    wrapper.style.height = "0";
    wrapper.appendChild(container);
    return wrapper;
  }

  /**
   * getElement
   * @param {Element|string} element 
   * @returns {Element}
   */
  getElement(element) {
    let elm;
    if (isElement(element)) {
      elm = element;
    } else if (typeof element === "string") {
      elm = document.getElementById(element);
    } else {
      throw new TypeError("not valid argument type");
    }
    return elm;
  }

  /**
   * attachTo
   * @param {Element|string} what 
   * @returns {Element}
   */
  attachTo(what) {
    const element = this.getElement(what);
    if (!element) return;
    let base;
    if (this.settings.hidden) {
      base = this.wrapper;
    } else {
      base = this.container;
    }
    element.appendChild(base);
    this.parentElement = element;
    return element;
  }

  /**
   * getContainer
   * @returns {Element} container
   */
  getContainer() {
    return this.container;
  }

  /**
   * onResize
   * @param {*} func 
   */
  onResize(func) {
    // Only listen to window for resize event if width and height are not fixed.
    // This applies if it is set to a percent or auto.
    if (!isNumber(this.settings.width) || !isNumber(this.settings.height)) {
      this.resizeFunc = throttle_default()(func, 50);
      window.addEventListener("resize", this.resizeFunc, false);
    }
  }

  /**
   * onOrientationChange
   * @param {*} func 
   */
  onOrientationChange(func) {
    this.orientationChangeFunc = func;
    window.addEventListener("orientationchange", this.orientationChangeFunc, false);
  }

  /**
   * size
   * @param {string|number} [width] 
   * @param {string|number} [height] 
   * @returns {object}
   */
  size(width, height) {
    let bounds;
    let _width = width || this.settings.width;
    let _height = height || this.settings.height;

    // If width or height are set to false, inherit them from containing element
    if (!width) {
      bounds = this.parentElement.getBoundingClientRect();
      if (bounds.width) {
        width = Math.floor(bounds.width);
        this.container.style.width = width + "px";
      }
    } else {
      if (isNumber(width)) {
        this.container.style.width = width + "px";
      } else {
        this.container.style.width = width;
      }
    }
    if (!height) {
      bounds = bounds || this.parentElement.getBoundingClientRect();
      if (bounds.height) {
        height = bounds.height;
        this.container.style.height = height + "px";
      }
    } else {
      if (isNumber(height)) {
        this.container.style.height = height + "px";
      } else {
        this.container.style.height = height;
      }
    }
    if (!isNumber(width)) {
      width = this.container.clientWidth;
    }
    if (!isNumber(height)) {
      height = this.container.clientHeight;
    }
    this.containerStyles = window.getComputedStyle(this.container);
    this.containerPadding = {
      left: parseFloat(this.containerStyles["padding-left"]) || 0,
      right: parseFloat(this.containerStyles["padding-right"]) || 0,
      top: parseFloat(this.containerStyles["padding-top"]) || 0,
      bottom: parseFloat(this.containerStyles["padding-bottom"]) || 0
    };

    // Bounds not set, get them from window
    let wndBounds = windowBounds();
    let bodyStyles = window.getComputedStyle(document.body);
    let bodyPadding = {
      left: parseFloat(bodyStyles["padding-left"]) || 0,
      right: parseFloat(bodyStyles["padding-right"]) || 0,
      top: parseFloat(bodyStyles["padding-top"]) || 0,
      bottom: parseFloat(bodyStyles["padding-bottom"]) || 0
    };
    if (!_width) {
      width = wndBounds.width - bodyPadding.left - bodyPadding.right;
    }
    if (this.settings.fullsize && !_height || !_height) {
      height = wndBounds.height - bodyPadding.top - bodyPadding.bottom;
    }
    return {
      width: width - this.containerPadding.left - this.containerPadding.right,
      height: height - this.containerPadding.top - this.containerPadding.bottom
    };
  }

  /**
   * Get bounding client rect
   * @returns {DOMRect|object}
   */
  bounds() {
    let box;
    if (this.container.style.overflow !== "visible") {
      box = this.container && this.container.getBoundingClientRect();
    }
    if (!box || !box.width || !box.height) {
      return windowBounds();
    } else {
      return box;
    }
  }

  /**
   * getSheet
   * @returns {CSSStyleSheet}
   */
  getSheet() {
    const style = document.createElement("style");
    // WebKit hack --> https://davidwalsh.name/add-rules-stylesheets
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return style.sheet;
  }

  /**
   * addStyleRules
   * @param {string} selector 
   * @param {object[]} rulesArray 
   */
  addStyleRules(selector, rulesArray) {
    let scope = "#" + this.id + " ";
    let rules = "";
    if (!this.sheet) {
      this.sheet = this.getSheet();
    }
    rulesArray.forEach(set => {
      for (const prop in set) {
        if (set.hasOwnProperty(prop)) {
          rules += prop + ":" + set[prop] + ";";
        }
      }
    });
    this.sheet.insertRule(scope + selector + " {" + rules + "}", 0);
  }

  /**
   * Set axis
   * @param {string} value values: `"horizontal"` OR `"vertical"`
   */
  axis(value) {
    if (value === "horizontal") {
      this.container.style.flexDirection = "row";
    } else {
      this.container.style.flexDirection = null;
    }
    this.settings.axis = value;
  }

  /**
   * Update direction
   * @param {string} [value] direction
   * @private
   */
  direction(value) {
    value = value || this.layout.direction;
    if (this.container) {
      this.container.dir = value;
    }
    if (this.settings.fullsize) {
      document.body.style["direction"] = value;
    }
  }

  /**
   * Update Flow
   * @param {string} [value] `layout.flow` value
   * @private
   */
  updateFlow(value) {
    value = value || this.layout.flow;
    switch (value) {
      case "paginated":
        this.container.style["overflow-y"] = "hidden";
        this.container.style["overflow-x"] = "hidden";
        this.container.style.flexWrap = "nowrap";
        break;
      case "scrolled":
        this.container.style["overflow-y"] = "auto";
        this.container.style["overflow-x"] = "hidden";
        this.container.style.flexWrap = "wrap";
        break;
      case "scrolled-doc":
        this.container.style["overflow-y"] = "hidden";
        this.container.style["overflow-x"] = "hidden";
        this.container.style.flexWrap = "wrap";
        break;
    }
  }

  /**
   * destroy
   */
  destroy() {
    if (this.parentElement) {
      let base;
      if (this.settings.hidden) {
        base = this.wrapper;
      } else {
        base = this.container;
      }
      if (this.parentElement.contains(base)) {
        this.parentElement.removeChild(base);
      }
      window.removeEventListener("resize", this.resizeFunc);
      window.removeEventListener("orientationChange", this.orientationChangeFunc);
    }
  }
}
/* harmony default export */ const stage = (Stage);
;// CONCATENATED MODULE: ./src/managers/helpers/views.js


/**
 * Views
 */
class Views extends Array {
  /**
   * Constructor
   * @param {Element} container 
   */
  constructor(container) {
    super();
    this.container = container;
    this.hidden = false;
  }
  first() {
    return this[0];
  }
  last() {
    return this[this.length - 1];
  }
  get(i) {
    return this[i];
  }
  append(view) {
    if (this.container) {
      this.container.appendChild(view.element);
    }
    this.push(view);
    return view;
  }
  prepend(view) {
    if (this.container) {
      this.container.insertBefore(view.element, this.container.firstChild);
    }
    this.unshift(view);
    return view;
  }
  insert(view, index) {
    if (this.container) {
      if (index < this.container.children.length) {
        this.container.insertBefore(view.element, this.container.children[index]);
      } else {
        this.container.appendChild(view.element);
      }
    }
    this.splice(index, 0, view);
    return view;
  }
  remove(view) {
    const index = this.indexOf(view);
    if (index > -1) {
      this.splice(index, 1);
    }
    this.destroy(view);
  }
  destroy(view) {
    if (view.displayed) {
      view.destroy();
    }
    if (this.container) {
      this.container.removeChild(view.element);
    }
  }
  clear() {
    if (this.length === 0) return;
    for (let i = 0; i < this.length; i++) {
      const view = this[i];
      this.destroy(view);
    }
    this.splice(0);
  }
  find(section) {
    for (let i = 0; i < this.length; i++) {
      const view = this[i];
      if (view.displayed && view.section.index == section.index) {
        return view;
      }
    }
  }
  displayed() {
    const displayed = [];
    for (let i = 0; i < this.length; i++) {
      const view = this[i];
      if (view.displayed) {
        displayed.push(view);
      }
    }
    return displayed;
  }
  show() {
    for (let i = 0; i < this.length; i++) {
      const view = this[i];
      if (view.displayed) {
        view.show();
      }
    }
    this.hidden = false;
  }
  hide() {
    for (let i = 0; i < this.length; i++) {
      const view = this[i];
      if (view.displayed) {
        view.hide();
      }
    }
    this.hidden = true;
  }
}
/* harmony default export */ const views = (Views);
;// CONCATENATED MODULE: ./src/contents.js







const hasNavigator = typeof navigator !== "undefined";
const isChrome = hasNavigator && /Chrome/.test(navigator.userAgent);
const isWebkit = hasNavigator && !isChrome && /AppleWebKit/.test(navigator.userAgent);

/**
 * Handles DOM manipulation, queries and events for View contents
 */
class Contents {
  /**
   * Constructor
   * @param {document} doc Document
   * @param {element} content Parent Element (typically Body)
   * @param {Section} section Section object reference
   */
  constructor(doc, content, section) {
    /**
     * @member {EpubCFI} epubcfi Blank Cfi for Parsing
     * @memberof Contents
     * @readonly
     */
    this.epubcfi = new src_epubcfi();
    this.document = doc;
    this.documentElement = this.document.documentElement;
    /**
     * @member {object} content document.body by current location
     * @memberof Contents
     * @readonly
     */
    this.content = content || this.document.body;
    /**
     * @member {object} contentRect
     * @memberof Contents
     * @readonly
     */
    this.contentRect = {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0
    };
    /**
     * @member {Section} section
     * @memberof Contents
     * @readonly
     */
    this.section = section;
    this.window = this.document.defaultView;
    this.active = true;
    this.epubReadingSystem("epub.js", EPUBJS_VERSION);
    this.listeners();
  }

  /**
   * Get DOM events that are listened for and passed along
   */
  static get listenedEvents() {
    return DOM_EVENTS;
  }

  /**
   * Get or Set width
   * @param {number} [w]
   * @returns {number} width
   */
  width(w) {
    const frame = this.content;
    if (w && isNumber(w)) {
      w = w + "px";
    }
    if (w) {
      frame.style.width = w;
    }
    return parseInt(this.window.getComputedStyle(frame)["width"]);
  }

  /**
   * Get or Set height
   * @param {number} [h]
   * @returns {number} height
   */
  height(h) {
    const frame = this.content;
    if (h && isNumber(h)) {
      h = h + "px";
    }
    if (h) {
      frame.style.height = h;
    }
    return parseInt(this.window.getComputedStyle(frame)["height"]);
  }

  /**
   * Get or Set width of the contents
   * @param {number} [w]
   * @returns {number} width
   */
  contentWidth(w) {
    const content = this.content || this.document.body;
    if (w && isNumber(w)) {
      w = w + "px";
    }
    if (w) {
      content.style.width = w;
    }
    return parseInt(this.window.getComputedStyle(content)["width"]);
  }

  /**
   * Get or Set height of the contents
   * @param {number} [h]
   * @returns {number} height
   */
  contentHeight(h) {
    const content = this.content;
    if (h && isNumber(h)) {
      h = h + "px";
    }
    if (h) {
      content.style.height = h;
    }
    return parseInt(this.window.getComputedStyle(content)["height"]);
  }

  /**
   * Get size of the text using Range
   * @returns {{ width: number, height: number }}
   */
  textSize() {
    const range = this.document.createRange();
    const content = this.content;
    // Select the contents of frame
    range.selectNodeContents(content);
    // get rect of the text content
    const rect = range.getBoundingClientRect();
    const border = borders(content);
    let width = rect.width;
    let height = rect.height;
    if (border) {
      if (border.width) {
        width += border.width;
      }
      if (border.height) {
        height += border.height;
      }
    }
    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  /**
   * Get documentElement scrollWidth
   * @returns {number} width
   */
  scrollWidth() {
    return this.documentElement.scrollWidth;
  }

  /**
   * Get documentElement scrollHeight
   * @returns {number} height
   */
  scrollHeight() {
    return this.documentElement.scrollHeight;
  }

  /**
   * Set overflow css style of the contents
   * @param {string} [overflow]
   */
  overflow(overflow) {
    if (overflow) {
      this.documentElement.style.overflow = overflow;
    }
    return this.window.getComputedStyle(this.documentElement)["overflow"];
  }

  /**
   * Set overflowX css style of the documentElement
   * @param {string} [overflow]
   */
  overflowX(overflow) {
    if (overflow) {
      this.documentElement.style.overflowX = overflow;
    }
    return this.window.getComputedStyle(this.documentElement)["overflowX"];
  }

  /**
   * Set overflowY css style of the documentElement
   * @param {string} [overflow]
   */
  overflowY(overflow) {
    if (overflow) {
      this.documentElement.style.overflowY = overflow;
    }
    return this.window.getComputedStyle(this.documentElement)["overflowY"];
  }

  /**
   * Set Css styles on the contents element (typically Body)
   * @param {string} property
   * @param {string} value
   * @param {boolean} [priority] set as "important"
   */
  css(property, value, priority) {
    const content = this.content;
    if (value) {
      content.style.setProperty(property, value, priority ? "important" : "");
    } else {
      content.style.removeProperty(property);
    }
    return this.window.getComputedStyle(content)[property];
  }

  /**
   * Get or Set the viewport element
   * @param {object} [options]
   * @param {string} [options.width]
   * @param {string} [options.height]
   * @param {string} [options.scale]
   * @param {string} [options.minimum]
   * @param {string} [options.maximum]
   * @param {string} [options.scalable]
   */
  viewport(options) {
    const parsed = {
      width: undefined,
      height: undefined,
      scale: undefined,
      minimum: undefined,
      maximum: undefined,
      scalable: undefined
    };
    let viewport = this.document.querySelector("meta[name='viewport']");

    /***
     * check for the viewport size
     * <meta name="viewport" content="width=1024,height=697" />
     */
    if (viewport && viewport.hasAttribute("content")) {
      const content = viewport.getAttribute("content");
      const width = content.match(/width\s*=\s*([^,]*)/);
      const height = content.match(/height\s*=\s*([^,]*)/);
      const scale = content.match(/initial-scale\s*=\s*([^,]*)/);
      const minimum = content.match(/minimum-scale\s*=\s*([^,]*)/);
      const maximum = content.match(/maximum-scale\s*=\s*([^,]*)/);
      const scalable = content.match(/user-scalable\s*=\s*([^,]*)/);
      if (width && width.length && typeof width[1] !== "undefined") {
        parsed.width = width[1];
      }
      if (height && height.length && typeof height[1] !== "undefined") {
        parsed.height = height[1];
      }
      if (scale && scale.length && typeof scale[1] !== "undefined") {
        parsed.scale = scale[1];
      }
      if (minimum && minimum.length && typeof minimum[1] !== "undefined") {
        parsed.minimum = minimum[1];
      }
      if (maximum && maximum.length && typeof maximum[1] !== "undefined") {
        parsed.maximum = maximum[1];
      }
      if (scalable && scalable.length && typeof scalable[1] !== "undefined") {
        parsed.scalable = scalable[1];
      }
    }
    const settings = defaults(options || {}, parsed);
    const newContent = [];
    if (options) {
      if (settings.width) {
        newContent.push("width=" + settings.width);
      }
      if (settings.height) {
        newContent.push("height=" + settings.height);
      }
      if (settings.scale) {
        newContent.push("initial-scale=" + settings.scale);
      }
      if (settings.scalable === "no") {
        newContent.push("minimum-scale=" + settings.scale);
        newContent.push("maximum-scale=" + settings.scale);
        newContent.push("user-scalable=" + settings.scalable);
      } else {
        if (settings.scalable) {
          newContent.push("user-scalable=" + settings.scalable);
        }
        if (settings.minimum) {
          newContent.push("minimum-scale=" + settings.minimum);
        }
        if (settings.maximum) {
          newContent.push("minimum-scale=" + settings.maximum);
        }
      }
      if (viewport === null) {
        viewport = this.document.createElement("meta");
        viewport.setAttribute("name", "viewport");
        this.document.querySelector("head").appendChild(viewport);
      }
      viewport.setAttribute("content", newContent.join(", "));
      this.window.scrollTo(0, 0);
    }
    return settings;
  }

  /**
   * Event emitter for when the contents has expanded
   * @private
   */
  expand() {
    this.emit(EVENTS.CONTENTS.EXPAND);
  }

  /**
   * content resize event handler
   * @param {object[]} entries
   * @private
   */
  resize(entries) {
    let changed = false;
    const cmp = rect => Object.keys(this.contentRect).forEach(p => {
      if (this.contentRect[p] !== rect[p] && rect[p] !== void 0) {
        this.contentRect[p] = rect[p];
        changed = true;
      }
    });
    entries.forEach(entry => entry.contentRect && cmp(entry.contentRect));
    changed && this.emit(EVENTS.CONTENTS.RESIZE, this.contentRect);
  }

  /**
   * Get the documentElement
   * @returns {element} documentElement
   */
  root() {
    if (!this.document) return null;
    return this.document.documentElement;
  }

  /**
   * Get the location offset of a EpubCFI or an #id
   * @param {string | EpubCFI} target
   * @param {string} [ignoreClass] for the cfi
   * @returns {object} target position left and top
   */
  locationOf(target, ignoreClass) {
    const targetPos = {
      "left": 0,
      "top": 0
    };
    if (!this.document) return targetPos;
    let position;
    if (this.epubcfi.isCfiString(target)) {
      const range = new src_epubcfi(target).toRange(this.document, ignoreClass);
      if (range) {
        try {
          if (!range.endContainer || range.startContainer == range.endContainer && range.startOffset == range.endOffset) {
            // If the end for the range is not set, it results in collapsed becoming
            // true. This in turn leads to inconsistent behaviour when calling
            // getBoundingRect. Wrong bounds lead to the wrong page being displayed.
            // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15684911/
            let pos = range.startContainer.textContent.indexOf(" ", range.startOffset);
            if (pos == -1) {
              pos = range.startContainer.textContent.length;
            }
            range.setEnd(range.startContainer, pos);
          }
        } catch (e) {
          console.error("setting end offset to start container length failed", e);
        }
        if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
          position = range.startContainer.getBoundingClientRect();
          targetPos.left = position.left;
          targetPos.top = position.top;
        } else {
          // Webkit does not handle collapsed range bounds correctly
          // https://bugs.webkit.org/show_bug.cgi?id=138949

          // Construct a new non-collapsed range
          if (isWebkit) {
            const container = range.startContainer;
            const newRange = new Range();
            try {
              if (container.nodeType === Node.ELEMENT_NODE) {
                position = container.getBoundingClientRect();
              } else if (range.startOffset + 2 < container.length) {
                newRange.setStart(container, range.startOffset);
                newRange.setEnd(container, range.startOffset + 2);
                position = newRange.getBoundingClientRect();
              } else if (range.startOffset - 2 > 0) {
                newRange.setStart(container, range.startOffset - 2);
                newRange.setEnd(container, range.startOffset);
                position = newRange.getBoundingClientRect();
              } else {
                // empty, return the parent element
                position = container.parentNode.getBoundingClientRect();
              }
            } catch (e) {
              console.error(e, e.stack);
            }
          } else {
            position = range.getBoundingClientRect();
          }
        }
      }
    } else if (typeof target === "string" && target.indexOf("#") > -1) {
      const id = target.substring(target.indexOf("#") + 1);
      const el = this.document.getElementById(id);
      if (el) {
        if (isWebkit) {
          // Webkit reports incorrect bounding rects in Columns
          const newRange = new Range();
          newRange.selectNode(el);
          position = newRange.getBoundingClientRect();
        } else {
          position = el.getBoundingClientRect();
        }
      }
    }
    if (position) {
      targetPos.left = position.left;
      targetPos.top = position.top;
    }
    return targetPos;
  }

  /**
   * Append a stylesheet link to the document head
   * @param {string} src url
   * @returns {Promise}
   */
  addStylesheet(src) {
    return new Promise((resolve, reject) => {
      let ready = false;
      if (!this.document) {
        resolve(false);
        return;
      }

      // Check if link already exists
      let stylesheet = this.document.querySelector("link[href='" + src + "']");
      if (stylesheet) {
        resolve(true);
        return; // already present
      }
      stylesheet = this.document.createElement("link");
      stylesheet.type = "text/css";
      stylesheet.rel = "stylesheet";
      stylesheet.href = src;
      stylesheet.onload = stylesheet.onreadystatechange = () => {
        if (!ready && (!this.readyState || this.readyState == "complete")) {
          ready = true;
          // Let apply
          setTimeout(() => {
            resolve(true);
          }, 1);
        }
      };
      this.document.head.appendChild(stylesheet);
    });
  }

  /**
   * _getStylesheetNode
   * @param {string} key 
   * @returns {Element}
   * @private
   */
  _getStylesheetNode(key) {
    if (!this.document) return null;
    key = "epubjs-inserted-css-" + (key || "");
    // Check if link already exists
    let styleEl = this.document.getElementById(key);
    if (!styleEl) {
      styleEl = this.document.createElement("style");
      styleEl.id = key;
      // Append style element to head
      this.document.head.appendChild(styleEl);
    }
    return styleEl;
  }

  /**
   * Append stylesheet css
   * @param {string} serializedCss
   * @param {string} key If the key is the same, the CSS will be replaced instead of inserted
   * @returns {boolean}
   */
  addStylesheetCss(serializedCss, key) {
    if (!this.document || !serializedCss) {
      return false;
    }
    const styleEl = this._getStylesheetNode(key);
    styleEl.innerHTML = serializedCss;
    return true;
  }

  /**
   * Append stylesheet rules to a generate stylesheet
   * Array: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule
   * Object: https://github.com/desirable-objects/json-to-css
   * @param {array | object} rules
   * @param {string} key If the key is the same, the CSS will be replaced instead of inserted
   */
  addStylesheetRules(rules, key) {
    if (!this.document || !rules || rules.length === 0) return;

    // Grab style sheet
    const styleSheet = this._getStylesheetNode(key).sheet;
    if (Object.prototype.toString.call(rules) === "[object Array]") {
      for (let i = 0, len = rules.length; i < len; i++) {
        let j = 1,
          rule = rules[i],
          propStr = "";
        const selector = rules[i][0];
        // If the second argument of a rule is an array of arrays, correct our variables.
        if (Object.prototype.toString.call(rule[1][0]) === "[object Array]") {
          rule = rule[1];
          j = 0;
        }
        for (let pl = rule.length; j < pl; j++) {
          const prop = rule[j];
          propStr += prop[0] + ":" + prop[1] + (prop[2] ? " !important" : "") + ";\n";
        }

        // Insert CSS Rule
        styleSheet.insertRule(selector + "{" + propStr + "}", styleSheet.cssRules.length);
      }
    } else {
      const selectors = Object.keys(rules);
      selectors.forEach(selector => {
        const definition = rules[selector];
        if (Array.isArray(definition)) {
          definition.forEach(item => {
            const _rules = Object.keys(item);
            const result = _rules.map(rule => {
              return `${rule}:${item[rule]}`;
            }).join(";");
            styleSheet.insertRule(`${selector}{${result}}`, styleSheet.cssRules.length);
          });
        } else {
          const _rules = Object.keys(definition);
          const result = _rules.map(rule => {
            return `${rule}:${definition[rule]}`;
          }).join(";");
          styleSheet.insertRule(`${selector}{${result}}`, styleSheet.cssRules.length);
        }
      });
    }
  }

  /**
   * Append a script tag to the document head
   * @param {string} src url
   * @returns {Promise} loaded
   */
  addScript(src) {
    return new Promise((resolve, reject) => {
      if (!this.document) {
        resolve(false);
        return;
      }
      let ready = false;
      const script = this.document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = src;
      script.onload = script.onreadystatechange = () => {
        if (!ready && (!this.readyState || this.readyState == "complete")) {
          ready = true;
          setTimeout(function () {
            resolve(true);
          }, 1);
        }
      };
      this.document.head.appendChild(script);
    });
  }

  /**
   * Add a class to the contents container
   * @param {string} className
   */
  addClass(className) {
    if (!this.document) return;
    const content = this.content;
    if (content) {
      content.classList.add(className);
    }
  }

  /**
   * Remove a class from the contents container
   * @param {string} removeClass
   */
  removeClass(className) {
    if (!this.document) return;
    const content = this.content;
    if (content) {
      content.classList.remove(className);
    }
  }

  /**
   * Get a Dom Range from EpubCFI
   * @param {EpubCFI} cfi
   * @param {string} [ignoreClass]
   * @returns {Range} range
   */
  range(cfi, ignoreClass) {
    const epubcfi = new src_epubcfi(cfi);
    return epubcfi.toRange(this.document, ignoreClass);
  }

  /**
   * Get an EpubCFI from a Dom Range
   * @param {Range} range
   * @param {string} [ignoreClass]
   * @returns {EpubCFI} cfi
   */
  cfiFromRange(range, ignoreClass) {
    return new src_epubcfi(range, this.section.cfiBase, ignoreClass).toString();
  }

  /**
   * Get an EpubCFI from a Dom node
   * @param {node} node
   * @param {string} [ignoreClass]
   * @returns {EpubCFI} cfi
   */
  cfiFromNode(node, ignoreClass) {
    return new src_epubcfi(node, this.section.cfiBase, ignoreClass).toString();
  }

  // TODO: find where this is used - remove?
  map(layout) {
    const map = new src_mapping(layout);
    return map.section();
  }

  /**
   * Size the contents to a given width and height
   * @param {number} [width]
   * @param {number} [height]
   */
  size(width, height) {
    const viewport = {
      scale: 1.0,
      scalable: "no"
    };
    this.setLayoutStyle("scrolling");
    if (width >= 0) {
      this.width(width);
      viewport.width = width;
      this.css("padding", "0 " + width / 12 + "px");
    }
    if (height >= 0) {
      this.height(height);
      viewport.height = height;
    }
    this.css("margin", "0");
    this.css("box-sizing", "border-box");
    this.viewport(viewport);
  }

  /**
   * Apply columns to the contents for pagination
   * @param {number} width
   * @param {number} height
   * @param {number} columnWidth
   * @param {number} gap
   */
  columns(width, height, columnWidth, gap, dir) {
    const COLUMN_AXIS = prefixed("column-axis");
    const COLUMN_GAP = prefixed("column-gap");
    const COLUMN_WIDTH = prefixed("column-width");
    const COLUMN_FILL = prefixed("column-fill");
    const AXIS_H = "horizontal";
    const AXIS_V = "vertical";
    const writingMode = this.writingMode();
    const axis = writingMode.indexOf(AXIS_V) === 0 ? AXIS_V : AXIS_H;
    this.setLayoutStyle("paginated");
    this.direction(dir);
    this.width(width);
    this.height(height);

    // Deal with Mobile trying to scale to viewport
    this.viewport({
      width: width,
      height: height,
      scale: 1.0,
      scalable: "no"
    });

    // TODO: inline-block needs more testing
    // Fixes Safari column cut offs, but causes RTL issues
    // this.css("display", "inline-block");

    this.css("overflow-y", "hidden");
    this.css("margin", "0", true);
    if (axis === AXIS_V) {
      this.css("padding-top", gap / 2 + "px", true);
      this.css("padding-bottom", gap / 2 + "px", true);
      this.css("padding-left", "20px");
      this.css("padding-right", "20px");
      this.css(COLUMN_AXIS, AXIS_V);
    } else {
      this.css("padding-top", "20px");
      this.css("padding-bottom", "20px");
      this.css("padding-left", gap / 2 + "px", true);
      this.css("padding-right", gap / 2 + "px", true);
      this.css(COLUMN_AXIS, AXIS_H);
    }
    this.css("box-sizing", "border-box");
    this.css("max-width", "inherit");
    this.css(COLUMN_FILL, "auto");
    this.css(COLUMN_GAP, gap + "px");
    this.css(COLUMN_WIDTH, columnWidth + "px");

    // Fix glyph clipping in WebKit
    // https://github.com/futurepress/epub.js/issues/983
    this.css("-webkit-line-box-contain", "block glyphs replaced");
  }

  /**
   * Scale contents from center
   * @param {number} scale
   * @param {number} offsetX
   * @param {number} offsetY
   */
  scaler(scale, offsetX, offsetY) {
    const scaleStr = "scale(" + scale + ")";
    let translateStr = "";
    // this.css("position", "absolute"));
    this.css("transform-origin", "top left");
    if (offsetX >= 0 || offsetY >= 0) {
      translateStr = " translate(" + (offsetX || 0) + "px, " + (offsetY || 0) + "px )";
    }
    this.css("transform", scaleStr + translateStr);
  }

  /**
   * Fit contents into a fixed width and height
   * @param {number} width
   * @param {number} height
   */
  fit(width, height, section) {
    const viewport = this.viewport();
    const viewportWidth = parseInt(viewport.width);
    const viewportHeight = parseInt(viewport.height);
    const widthScale = width / viewportWidth;
    const heightScale = height / viewportHeight;
    const scale = widthScale < heightScale ? widthScale : heightScale;

    // the translate does not work as intended, elements can end up unaligned
    // var offsetY = (height - (viewportHeight * scale)) / 2;
    // var offsetX = 0;
    // if (this.section.index % 2 === 1) {
    // 	offsetX = width - (viewportWidth * scale);
    // }

    this.setLayoutStyle("paginated");

    // scale needs width and height to be set
    this.width(viewportWidth);
    this.height(viewportHeight);
    this.overflow("hidden");

    // Scale to the correct size
    this.scaler(scale, 0, 0);
    // this.scaler(scale, offsetX > 0 ? offsetX : 0, offsetY);

    // background images are not scaled by transform
    this.css("background-size", viewportWidth * scale + "px " + viewportHeight * scale + "px");
    this.css("background-color", "transparent");
    if (section && section.properties.includes("page-spread-left")) {
      // set margin since scale is weird
      const marginLeft = width - viewportWidth * scale;
      this.css("margin-left", marginLeft + "px");
    }
  }

  /**
   * Set the direction of the text
   * @param {string} [dir='ltr'] values: `"ltr"` OR `"rtl"`
   */
  direction(dir = "ltr") {
    if (this.documentElement) {
      this.documentElement.dir = dir;
    }
  }

  /**
   * mapPage
   * @param {string} cfiBase 
   * @param {Layout} layout 
   * @param {number} start 
   * @param {number} end 
   * @param {boolean} dev 
   * @returns {any}
   */
  mapPage(cfiBase, layout, start, end, dev) {
    const mapping = new src_mapping(layout, dev);
    return mapping.page(this, cfiBase, start, end);
  }

  /**
   * Set the writingMode of the text
   * @param {string} [mode='horizontal-tb'] `"horizontal-tb"` OR `"vertical-rl"` OR `"vertical-lr"`
   */
  writingMode(mode = "horizontal-tb") {
    const WRITING_MODE = prefixed("writing-mode");
    if (this.documentElement) {
      this.documentElement.style[WRITING_MODE] = mode;
    }
    return this.window.getComputedStyle(this.documentElement)[WRITING_MODE] || "";
  }

  /**
   * Set the layoutStyle of the content
   * @param {string} [value='paginated'] values: `"paginated"` OR `"scrolling"`
   * @private
   */
  setLayoutStyle(value = "paginated") {
    this.layoutStyle = value;
    navigator.epubReadingSystem.layoutStyle = value;
    return value;
  }

  /**
   * Add the epubReadingSystem object to the navigator
   * @param {string} name
   * @param {string} version
   * @private
   */
  epubReadingSystem(name, version) {
    navigator.epubReadingSystem = {
      name: name,
      version: version,
      layoutStyle: "paginated",
      hasFeature: feature => {
        switch (feature) {
          case "dom-manipulation":
            return true;
          case "layout-changes":
            return true;
          case "touch-events":
            return true;
          case "mouse-events":
            return true;
          case "keyboard-events":
            return true;
          case "spine-scripting":
            return false;
          default:
            return false;
        }
      }
    };
    return navigator.epubReadingSystem;
  }

  //-- events --//

  /**
   * Add DOM listeners
   * @private
   */
  listeners() {
    this.appendListeners();
    // this.imageLoadListeners();
    // this.mediaQueryListeners();
    // this.fontLoadListeners();
    // this.transitionListeners();
    // this.mutationListener();
  }

  /**
   * Append listeners
   * @private
   */
  appendListeners() {
    if (!this.document) return;
    //-- DOM EVENTS
    DOM_EVENTS.forEach(eventName => {
      this.document.addEventListener(eventName, this.triggerEvent.bind(this), {
        passive: true
      });
    }, this);
    //-- SELECTION
    this.document.addEventListener("selectionchange", this.selectionHandler.bind(this), {
      passive: true
    });
    //-- RESIZE
    this.resizeObserver = new ResizeObserver(e => {
      requestAnimationFrame(() => this.resize(e));
    });
    this.resizeObserver.observe(this.document.documentElement);
    //-- LINK CLICKED
    replaceLinks(this.content, href => {
      this.emit(EVENTS.CONTENTS.LINK_CLICKED, href);
    });
  }

  /**
   * Remove listeners
   * @private
   */
  removeListeners() {
    if (!this.document) return;
    //-- DOM EVENTS
    DOM_EVENTS.forEach(eventName => {
      this.document.removeEventListener(eventName, this.triggerEvent.bind(this), {
        passive: true
      });
    }, this);
    //-- SELECTION
    this.document.removeEventListener("selectionchange", this.selectionHandler.bind(this), {
      passive: true
    });
    //-- RESIZE
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    //-- MUTATION
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  /**
   * Emit passed browser events
   * @private
   */
  triggerEvent(e) {
    this.emit(e.type, e);
  }

  /**
   * Handle getting text on selection
   * @private
   */
  selectionHandler(e) {
    if (this.selectionEndTimeout) {
      clearTimeout(this.selectionEndTimeout);
    }
    this.selectionEndTimeout = setTimeout(() => {
      const selection = this.window.getSelection();
      if (!(selection && selection.rangeCount > 0)) return;
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const cfirange = new src_epubcfi(range, this.section.cfiBase).toString();
        this.emit(EVENTS.CONTENTS.SELECTED, cfirange);
        this.emit(EVENTS.CONTENTS.SELECTED_RANGE, range);
      }
    }, 250);
  }

  /**
   * Test if images are loaded or add listener for when they load
   * @private
   */
  imageLoadListeners() {
    const images = this.document.querySelectorAll("img");
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
        img.onload = this.expand.bind(this);
      }
    }
  }

  /**
   * Listen for media query changes and emit 'expand' event
   * Adapted from: https://github.com/tylergaw/media-query-events/blob/master/js/mq-events.js
   * @private
   */
  mediaQueryListeners() {
    const sheets = this.document.styleSheets;
    const mediaChangeHandler = m => {
      if (m.matches) {
        setTimeout(this.expand.bind(this), 1);
      }
    };
    for (let i = 0; i < sheets.length; i += 1) {
      let rules;
      // Firefox errors if we access cssRules cross-domain
      try {
        rules = sheets[i].cssRules;
      } catch (e) {
        console.error(e);
        return;
      }
      if (!rules) return; // Stylesheets changed
      for (let j = 0; j < rules.length; j += 1) {
        if (rules[j].media) {
          const mql = this.window.matchMedia(rules[j].media.mediaText);
          mql.onchange = mediaChangeHandler;
        }
      }
    }
  }

  /**
   * Listen for font load and check for resize when loaded (unused)
   * @private
   */
  fontLoadListeners() {
    if (!this.document || !this.document.fonts) {
      return;
    }

    //this.document.fonts.ready.then(() => this.resize());
  }

  /**
   * Use css transitions to detect resize (unused)
   * @private
   */
  transitionListeners() {
    const body = this.content;
    body.style["transitionProperty"] = "font, font-size, font-size-adjust, font-stretch, font-variation-settings, font-weight, width, height";
    body.style["transitionDuration"] = "0.001ms";
    body.style["transitionTimingFunction"] = "linear";
    body.style["transitionDelay"] = "0";

    //this.document.addEventListener('transitionend', this.resize.bind(this));
  }

  /**
   * Use MutationObserver to listen for changes in 
   * the DOM and check for resize (unused)
   * @private
   */
  mutationListener() {
    const mutation = (mutations, observer) => {
      mutations.forEach(m => {
        //console.log(m)
      });
    };
    this.mutationObserver = new MutationObserver(mutation);
    this.mutationObserver.observe(this.document, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  /**
   * destroy
   */
  destroy() {
    this.removeListeners();
  }
}
event_emitter_default()(Contents.prototype);
/* harmony default export */ const contents = (Contents);
;// CONCATENATED MODULE: ./src/marks-pane/events.js
const rectContains = (rect, x, y, offset) => {
  const top = rect.top - offset.top;
  const left = rect.left - offset.left;
  const bottom = top + rect.height;
  const right = left + rect.width;
  return top <= y && left <= x && bottom > y && right > x;
};

/**
 * Check if the item contains the point denoted by the passed coordinates
 * @param {Mark} mark the mark object
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 * @private
 */
const contains = (mark, target, x, y) => {
  const rect = mark.getBoundingClientRect();
  const offset = target.getBoundingClientRect();

  // Check overall bounding box first
  if (!rectContains(rect, x, y, offset)) {
    return false;
  }

  // Then continue to check each child rect
  const rects = mark.getClientRects();
  for (let i = 0, len = rects.length; i < len; i++) {
    if (rectContains(rects[i], x, y, offset)) {
      return true;
    }
  }
  return false;
};

/**
 * Clone a mouse event object.
 * @param {MouseEvent} e A mouse event object to clone.
 * @returns {MouseEvent}
 * @private
 */
const clone = e => {
  const opts = Object.assign({}, e, {
    bubbles: false
  });
  return new MouseEvent(e.type, opts);
};
const dispatch = (e, target, marks) => {
  let x = e.clientX;
  let y = e.clientY;
  if (e.touches && e.touches.length) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }
  marks.forEach((mark, key) => {
    if (contains(mark, target, x, y)) {
      mark.dispatchEvent(clone(e));
    }
  });
};

/**
 * Start proxying all mouse events that occur on the target node to each node in
 * a set of tracked marks.
 *
 * The marks in tracked do not strictly have to be DOM Nodes, but they do have
 * to have dispatchEvent, getBoundingClientRect, and getClientRects methods.
 *
 * @param {Node} target The node on which to listen for mouse events.
 * @param {Mark[]} marks A (possibly mutable) array of marks to which to proxy events.
 */
const proxyMouse = (target, marks) => {
  let node;
  if (target.nodeName === "iframe" || target.nodeName === "IFRAME") {
    node = target.contentDocument;
  } else {
    node = target;
  }
  const events = ["mouseup", "mousedown", "click", "touchstart"];
  for (const event of events) {
    node.addEventListener(event, e => dispatch(e, target, marks), false);
  }
};
/* harmony default export */ const events = (proxyMouse);
;// CONCATENATED MODULE: ./src/marks-pane/marks.js

const NS_URI = "http://www.w3.org/2000/svg";

/**
 * Marks class
 */
class Marks extends Map {
  /**
   * Constructor
   * @param {Node} target view
   * @param {Node} [container=document.body] epub-view container
   */
  constructor(target, container = document.body) {
    super();
    this.target = target;
    /**
     * @member {Node} element the marks container
     * @memberof Marks
     * @readonly
     */
    this.element = document.createElementNS(NS_URI, "svg");
    this.element.style.position = "absolute";
    this.element.setAttribute("pointer-events", "none");
    // Set up mouse event proxying between the target element and the marks
    events(this.target, this);
    this.container = container;
    this.container.appendChild(this.element);
    this.render();
  }

  /**
   * Append mark
   * @param {string} key 
   * @param {Mark} mark 
   * @returns {Mark}
   */
  appendMark(key, mark) {
    const g = document.createElementNS(NS_URI, "g");
    this.element.appendChild(g);
    mark.bind(g, this.container);
    mark.render();
    this.set(key, mark);
    return mark;
  }

  /**
   * Remove mark
   * @param {string} key 
   * @returns {void}
   */
  removeMark(key) {
    const mark = this.get(key);
    if (mark) {
      const el = mark.unbind();
      this.element.removeChild(el);
      this.delete(key);
    }
  }

  /**
   * render
   */
  render() {
    this.updateStyle(this.element);
    this.forEach((mark, key) => mark.render());
  }

  /**
   * Update style
   * @param {Node} el the marks container
   * @private 
   */
  updateStyle(el) {
    const rect = this.target.getBoundingClientRect();
    const offset = this.container.getBoundingClientRect();
    const top = rect.top - offset.top;
    const left = rect.left - offset.left;
    const width = this.target.scrollWidth;
    const height = this.target.scrollHeight;
    el.style.setProperty("top", `${top}px`, "important");
    el.style.setProperty("left", `${left}px`, "important");
    el.style.setProperty("width", `${width}px`, "important");
    el.style.setProperty("height", `${height}px`, "important");
  }
}
/* harmony default export */ const marks = (Marks);
;// CONCATENATED MODULE: ./src/marks-pane/mark.js

/**
 * Mark class
 */
class Mark {
  constructor() {
    /**
     * @member {Node} element the mark container to rects
     * @memberof Mark
     * @readonly
     */
    this.element = null;
    this.range = null;
  }

  /**
   * bind
   * @param {Node} element the mark container to rects
   * @param {Node} container the epub-view container
   */
  bind(element, container) {
    this.element = element;
    this.container = container;
  }

  /**
   * unbind
   * @returns {Node}
   */
  unbind() {
    const el = this.element;
    this.element = null;
    return el;
  }

  /**
   * Clear the mark container
   */
  clear() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }

  /**
   * render
   * @abstract
   */
  render() {}

  /**
   * Dispatch event
   * @param {MouseEvent} e 
   */
  dispatchEvent(e) {
    if (this.element) {
      this.element.dispatchEvent(e);
    }
  }

  /**
   * Get bounding client rect
   * @returns {DOMRect}
   */
  getBoundingClientRect() {
    return this.element.getBoundingClientRect();
  }

  /**
   * Get client rects
   * @returns {object[]}
   */
  getClientRects() {
    const rects = [];
    let el = this.element.firstChild;
    while (el) {
      rects.push(el.getBoundingClientRect());
      el = el.nextSibling;
    }
    return rects;
  }
}
/* harmony default export */ const mark = (Mark);
;// CONCATENATED MODULE: ./src/marks-pane/highlight.js

const highlight_NS_URI = "http://www.w3.org/2000/svg";

/**
 * Highlight class
 * @extends Mark
 */
class Highlight extends mark {
  /**
   * Constructor
   * @param {Range} range 
   * @param {object} [options]
   * @param {string} [options.className] 
   * @param {object} [options.data={}] 
   * @param {object} [options.attributes={}] 
   * @param {object[]} [options.listeners=[]]
   */
  constructor(range, {
    className,
    data,
    attributes,
    listeners
  }) {
    super();
    this.range = range;
    this.className = className;
    this.data = data || {};
    this.attributes = attributes || {};
    this.listeners = listeners || [];
  }

  /**
   * bind
   * @param {Node} element 
   * @param {Node} container 
   * @override
   */
  bind(element, container) {
    super.bind(element, container);
    for (const p in this.data) {
      if (this.data.hasOwnProperty(p)) {
        this.element.dataset[p] = this.data[p];
      }
    }
    for (const p in this.attributes) {
      if (this.attributes.hasOwnProperty(p)) {
        this.element.setAttribute(p, this.attributes[p]);
      }
    }
    if (this.className) {
      this.element.classList.add(this.className);
    }
  }

  /**
   * render
   * @override
   */
  render() {
    this.clear();
    const rects = this.range.getClientRects();
    const offset = this.element.getBoundingClientRect();
    const container = this.container.getBoundingClientRect();
    for (let i = 0, len = rects.length; i < len; i++) {
      const r = rects[i];
      const rect = document.createElementNS(highlight_NS_URI, "rect");
      rect.setAttribute("x", r.left - offset.left + container.left);
      rect.setAttribute("y", r.top - offset.top + container.top);
      rect.setAttribute("height", r.height);
      rect.setAttribute("width", r.width);
      this.element.appendChild(rect);
    }
  }
}
/* harmony default export */ const highlight = (Highlight);
;// CONCATENATED MODULE: ./src/marks-pane/underline.js

const underline_NS_URI = "http://www.w3.org/2000/svg";

/**
 * Underline class
 * @extends Highlight
 */
class Underline extends highlight {
  /**
   * Constructor
   * @param {Range} range 
   * @param {object} [options]
   * @param {string} [options.className] 
   * @param {object} [options.data={}] 
   * @param {object} [options.attributes={}] 
   * @param {object[]} [options.listeners=[]]
   */
  constructor(range, options) {
    super(range, options);
  }

  /**
   * render
   * @override
   */
  render() {
    this.clear();
    const rects = this.range.getClientRects();
    const offset = this.element.getBoundingClientRect();
    const container = this.container.getBoundingClientRect();
    for (let i = 0, len = rects.length; i < len; i++) {
      const r = rects[i];
      const rect = document.createElementNS(underline_NS_URI, "rect");
      const line = document.createElementNS(underline_NS_URI, "line");
      rect.setAttribute("x", r.left - offset.left + container.left);
      rect.setAttribute("y", r.top - offset.top + container.top);
      rect.setAttribute("height", r.height);
      rect.setAttribute("width", r.width);
      rect.setAttribute("fill", "none");
      line.setAttribute("x1", r.left - offset.left + container.left);
      line.setAttribute("x2", r.left - offset.left + container.left + r.width);
      line.setAttribute("y1", r.top - offset.top + container.top + r.height - 1);
      line.setAttribute("y2", r.top - offset.top + container.top + r.height - 1);
      line.setAttribute("stroke-width", 1);
      line.setAttribute("stroke", "black"); //TODO: match text color?
      line.setAttribute("stroke-linecap", "square");
      this.element.appendChild(rect);
      this.element.appendChild(line);
    }
  }
}
/* harmony default export */ const underline = (Underline);
;// CONCATENATED MODULE: ./src/managers/views/iframe.js









const AXIS_H = "horizontal";
const AXIS_V = "vertical";

/**
 * IframeView class
 */
class IframeView {
  /**
   * Constructor
   * @param {Layout} layout
   * @param {Section} section
   * @param {object} [options]
   * @param {string} [options.axis] values: `"horizontal"` OR `"vertical"`
   * @param {string} [options.method] values: `"blobUrl"` OR `"srcdoc"` OR `"write"`
   * @param {string} [options.ignoreClass='']
   * @param {boolean} [options.allowPopups=false]
   * @param {boolean} [options.allowScriptedContent=false]
   * @param {boolean} [options.forceRight=false]
   */
  constructor(layout, section, options) {
    /**
     * @member {object} settings
     * @memberof IframeView
     * @readonly
     */
    this.settings = extend({
      axis: null,
      method: null,
      forceRight: false,
      forceEvenPages: false,
      ignoreClass: "",
      allowPopups: false,
      allowScriptedContent: false
    }, options || {});
    /**
     * @member {string} id
     * @memberof IframeView
     * @readonly
     */
    this.id = "epubjs-view-" + uuid();
    /**
     * @member {Section} section
     * @memberof IframeView
     * @readonly
     */
    this.section = section;
    this.element = this.container();
    this.added = false;
    this.displayed = false;
    this.rendered = false;
    this.fixedWidth = 0; // unused
    this.fixedHeight = 0; // unused
    /**
     * @member {EpubCFI} epubcfi Blank Cfi for Parsing
     * @memberof IframeView
     * @readonly
     */
    this.epubcfi = new src_epubcfi();
    /**
     * @member {Layout} layout
     * @memberof IframeView
     * @readonly
     */
    this.layout = layout;
    this.layout.on(EVENTS.LAYOUT.UPDATED, (props, changed) => {
      this.updateLayout();
    });
    /**
     * @member {Marks} marks
     * @memberof IframeView
     * @readonly
     */
    this.marks = null;
    this.setAxis(this.settings.axis);
  }

  /**
   * Create view container
   * @returns {Element} HTML element
   * @private
   */
  container() {
    const element = document.createElement("div");
    element.classList.add("epub-view");
    element.style.height = "0";
    element.style.width = "0";
    element.style.overflow = "hidden";
    element.style.position = "relative";
    return element;
  }

  /**
   * Create iframe element
   * @returns {Element} iframe
   */
  create() {
    this.iframe = document.createElement("iframe");
    this.iframe.id = this.id;
    this.iframe.seamless = "seamless";
    this.iframe.style.overflow = "hidden";
    this.iframe.style.border = "none";
    this.iframe.style.width = "0";
    this.iframe.style.height = "0";

    // sandbox
    this.iframe.sandbox = "allow-same-origin";
    if (this.settings.allowPopups) {
      this.iframe.sandbox += " allow-popups";
    }
    if (this.settings.allowScriptedContent) {
      this.iframe.sandbox += " allow-scripts";
    }
    this.iframe.setAttribute("enable-annotation", "true");
    this.element.setAttribute("ref", this.section.index);
    this.elementBounds = bounds(this.element);
    if (this.settings.method === null) {
      this.settings.method = "srcdoc" in this.iframe ? "srcdoc" : "write";
    }
    this.added = true;
    this.resizing = true;
    this.width = 0;
    this.height = 0;
    return this.iframe;
  }

  /**
   * render
   * @param {function} request 
   * @returns {object} section render object
   */
  render(request) {
    this.create();
    const sectionRender = this.section.render(request);
    return sectionRender.then(contents => {
      return this.load(contents);
    }).then(() => {
      // find and report the writingMode axis
      const writingMode = this.contents.writingMode();
      const hasVertical = writingMode.indexOf(AXIS_V) === 0;

      // Set the axis based on the flow and writing mode
      let axis;
      if (this.layout.flow === "scrolled" || this.layout.flow === "scrolled-doc") {
        axis = hasVertical ? AXIS_H : AXIS_V;
      } else {
        axis = hasVertical ? AXIS_V : AXIS_H;
      }
      if (hasVertical && this.layout.flow === "paginated") {
        this.layout.delta = this.layout.height;
      }
      this.setAxis(axis);
      this.emit(EVENTS.VIEWS.AXIS, axis);
      this.setWritingMode(writingMode);
      this.emit(EVENTS.VIEWS.WRITING_MODE, writingMode);

      // apply the layout function to the contents
      this.layout.format(this.contents, this.section, this.axis);

      // Listen for events that require an expansion of the iframe
      this.addListeners();
      return new Promise((resolve, reject) => {
        // Expand the iframe to the full size of the content
        this.expand();
        if (this.settings.forceRight) {
          this.element.style.marginLeft = this.width + "px";
        }
        resolve();
      });
    }, err => {
      /**
       * @event loaderror
       * @param {*} err
       * @memberof IframeView
       */
      this.emit(EVENTS.VIEWS.LOAD_ERROR, err);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }).then(() => {
      /**
       * @event rendered
       * @param {Section} section
       * @memberof IframeView
       */
      this.emit(EVENTS.VIEWS.RENDERED, this.section);
    });
  }

  /**
   * reset
   */
  reset() {
    if (this.iframe) {
      this.iframe.style.width = "0";
      this.iframe.style.height = "0";
      this.width = 0;
      this.height = 0;
      this.textWidth = undefined;
      this.textHeight = undefined;
      this.contentWidth = undefined; // unused
      this.contentHeight = undefined; // unused
    }
    this.needsReframe = true;
  }

  /**
   * size
   * Determine locks base on settings
   * @param {number} [width] 
   * @param {number} [height] 
   */
  size(width, height) {
    width = width || this.layout.width;
    height = height || this.layout.height;
    let what;
    if (this.layout.name === "pre-paginated") {
      what = "both";
    } else if (this.settings.axis === AXIS_H) {
      what = "height";
    } else {
      what = "width";
    }
    this.lock(what, width, height);
  }

  /**
   * lock
   * Lock an axis to element dimensions, taking borders into account
   * @param {string} what 
   * @param {number} width 
   * @param {number} height 
   */
  lock(what, width, height) {
    const elBorders = borders(this.element);
    let iframeBorders;
    if (this.iframe) {
      iframeBorders = borders(this.iframe);
    } else {
      iframeBorders = {
        width: 0,
        height: 0
      };
    }
    switch (what) {
      case "both":
        if (isNumber(width) && isNumber(height)) {
          this.lockedWidth = width - elBorders.width - iframeBorders.width;
          this.lockedHeight = height - elBorders.height - iframeBorders.height;
          // this.resize(this.lockedWidth, this.lockedHeight);
        }
        break;
      case "width":
        if (isNumber(width)) {
          this.lockedWidth = width - elBorders.width - iframeBorders.width;
          // this.resize(this.lockedWidth, width); // width keeps ratio correct
        }
        break;
      case "height":
        if (isNumber(height)) {
          this.lockedHeight = height - elBorders.height - iframeBorders.height;
          // this.resize(width, this.lockedHeight);
        }
        break;
    }
    if (this.displayed && this.iframe) {
      this.expand();
    }
  }

  /**
   * expand
   * Resize a single axis based on content dimensions
   */
  expand() {
    let width = this.lockedWidth;
    let height = this.lockedHeight;
    if (!this.iframe || this.expanding) return;
    this.expanding = true;
    if (this.layout.name === "pre-paginated") {
      width = this.layout.columnWidth;
      height = this.layout.height;
    } else if (this.settings.axis === AXIS_H) {
      // Get the width of the text
      width = this.contents.textSize().width;
      if (width % this.layout.pageWidth > 0) {
        width = Math.ceil(width / this.layout.pageWidth) * this.layout.pageWidth;
      }
      if (this.settings.forceEvenPages) {
        const columns = width / this.layout.pageWidth;
        if (this.layout.divisor > 1 && this.layout.name === "reflowable" && columns % 2 > 0) {
          // add a blank page
          width += this.layout.pageWidth;
        }
      }
    } else if (this.settings.axis === "vertical") {
      // Expand Vertically
      height = this.contents.textSize().height;
      if (this.layout.flow === "paginated" && height % this.layout.height > 0) {
        height = Math.ceil(height / this.layout.height) * this.layout.height;
      }
    }

    // Only Resize if dimensions have changed or
    // if Frame is still hidden, so needs reframing
    if (this.needsReframe || this.width !== width || this.height !== height) {
      this.reframe(width, height);
    }
    this.expanding = false;
  }

  /**
   * reframe
   * @param {number} width 
   * @param {number} height 
   */
  reframe(width, height) {
    this.element.style.width = width + "px";
    this.element.style.height = height + "px";
    this.iframe.style.width = width + "px";
    this.iframe.style.height = height + "px";
    this.width = width;
    this.height = height;
    const size = {
      width: width,
      height: height,
      widthDelta: this.prevBounds ? width - this.prevBounds.width : width,
      heightDelta: this.prevBounds ? height - this.prevBounds.height : height
    };
    this.marks && this.marks.render();
    /**
     * @event resized
     * @param {object} size
     * @memberof IframeView
     */
    this.emit(EVENTS.VIEWS.RESIZED, size);
    this.prevBounds = size;
    this.elementBounds = bounds(this.element);
  }

  /**
   * load
   * @param {string} contents 
   * @returns {Promise} loading promise
   */
  load(contents) {
    const loading = new defer();
    const loaded = loading.promise;
    if (!this.iframe) {
      loading.reject(new Error("No Iframe Available"));
      return loaded;
    }
    this.iframe.onload = e => this.onLoad(e, loading);
    if (this.settings.method === "blobUrl") {
      this.blobUrl = createBlobUrl(contents, "application/xhtml+xml");
      this.iframe.src = this.blobUrl;
      this.element.appendChild(this.iframe);
    } else if (this.settings.method === "srcdoc") {
      this.iframe.srcdoc = contents;
      this.element.appendChild(this.iframe);
    } else {
      this.element.appendChild(this.iframe);
      this.document = this.iframe.contentDocument;
      if (!this.document) {
        loading.reject(new Error("No Document Available"));
        return loaded;
      }
      this.iframe.contentDocument.open();
      if (window.MSApp && MSApp.execUnsafeLocalFunction) {
        // For Cordova windows platform
        MSApp.execUnsafeLocalFunction(() => {
          this.iframe.contentDocument.write(contents);
        });
      } else {
        this.iframe.contentDocument.write(contents);
      }
      this.iframe.contentDocument.close();
    }
    return loaded;
  }

  /**
   * onLoad
   * @param {Event} event 
   * @param {Defer} promise 
   */
  onLoad(event, promise) {
    this.window = this.iframe.contentWindow;
    this.document = this.iframe.contentDocument;
    this.document.body.style.overflow = "hidden";
    this.contents = new contents(this.document, this.document.body, this.section);
    this.rendering = false;
    let link = this.document.querySelector("link[rel='canonical']");
    if (link) {
      link.setAttribute("href", this.section.canonical);
    } else {
      link = this.document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", this.section.canonical);
      this.document.querySelector("head").appendChild(link);
    }
    this.contents.on(EVENTS.CONTENTS.EXPAND, () => {
      if (this.displayed && this.iframe) {
        this.expand();
        if (this.contents) {
          this.layout.format(this.contents);
        }
      }
    });
    this.contents.on(EVENTS.CONTENTS.RESIZE, rect => {
      if (this.displayed && this.iframe) {
        this.expand();
        if (this.contents) {
          this.layout.format(this.contents);
        }
      }
    });
    promise.resolve(this.contents);
  }

  /**
   * Update Layout
   * @private
   */
  updateLayout() {
    if (this.contents) {
      this.layout.format(this.contents);
      this.expand();
    }
  }

  /**
   * Set axis
   * @param {string} value 
   */
  setAxis(value) {
    if (value === null) {
      value = this.layout.flow === "paginated" ? AXIS_H : AXIS_V;
    }
    if (value == AXIS_H) {
      this.element.style.flex = "none";
    } else {
      this.element.style.flex = "initial";
    }
    this.settings.axis = value;
    this.size();
  }

  /**
   * Set writing mode
   * @param {string} mode 
   */
  setWritingMode(mode) {
    this.writingMode = mode;
  }
  addListeners() {
    //TODO: Add content listeners for expanding
  }
  removeListeners(layoutFunc) {
    //TODO: remove content listeners for expanding
  }

  /**
   * display
   * @param {method} request 
   * @returns {Promise} displayed promise
   */
  display(request) {
    const displayed = new defer();
    if (this.displayed === false) {
      this.render(request).then(() => {
        /**
         * @event displayed
         * @memberof IframeView
         */
        this.emit(EVENTS.VIEWS.DISPLAYED);
        this.displayed = true;
        displayed.resolve(this);
      }, err => {
        displayed.reject(err, this);
      });
    } else {
      displayed.resolve(this);
    }
    return displayed.promise;
  }

  /**
   * show
   */
  show() {
    this.element.style.visibility = "visible";
    if (this.iframe) {
      this.iframe.style.visibility = "visible";

      // Remind Safari to redraw the iframe
      this.iframe.style.transform = "translateZ(0)";
      this.iframe.offsetWidth;
      this.iframe.style.transform = null;
    }
    /**
     * @event shown
     * @param {IframeView} view
     * @memberof IframeView
     */
    this.emit(EVENTS.VIEWS.SHOWN, this);
  }

  /**
   * hide
   */
  hide() {
    this.element.style.visibility = "hidden";
    this.iframe.style.visibility = "hidden";
    this.stopExpanding = true;
    /**
     * @event hidden
     * @param {IframeView} view
     * @memberof IframeView
     */
    this.emit(EVENTS.VIEWS.HIDDEN, this);
  }

  /**
   * offset
   * @returns {object}
   */
  offset() {
    return {
      top: this.element.offsetTop,
      left: this.element.offsetLeft
    };
  }

  /**
   * position
   * @returns {DOMRect}
   */
  position() {
    return this.element.getBoundingClientRect();
  }

  /**
   * locationOf
   * @param {string|EpubCFI} target 
   * @returns {object}
   */
  locationOf(target) {
    const pos = this.contents.locationOf(target, this.settings.ignoreClass);
    return {
      left: pos.left,
      top: pos.top
    };
  }

  /**
   * bounds
   * @param {boolean} [force=false] 
   * @returns {Element}
   */
  bounds(force = false) {
    if (force || !this.elementBounds) {
      this.elementBounds = bounds(this.element);
    }
    return this.elementBounds;
  }

  /**
   * highlight
   * @param {string} cfiRange 
   * @param {object} [data={}] 
   * @param {method} [cb=null] callback function
   * @param {string} [className='epubjs-hl'] 
   * @param {object} [styles={}] 
   * @returns {object}
   */
  highlight(cfiRange, data = {}, cb = null, className = "epubjs-hl", styles = {}) {
    if (!this.contents) {
      return;
    }
    data["epubcfi"] = cfiRange;
    if (this.marks === null) {
      this.marks = new marks(this.iframe, this.element);
    }
    const attributes = Object.assign({
      "fill": "yellow",
      "fill-opacity": "0.3",
      "mix-blend-mode": "multiply"
    }, styles);
    const emitter = e => {
      /**
       * @event markClicked
       * @param {string} cfiRange
       * @param {object} data
       * @memberof IframeView
       */
      this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
    };
    const key = encodeURI("epubjs-hl:" + cfiRange);
    const range = this.contents.range(cfiRange);
    const m = new highlight(range, {
      className,
      data,
      attributes,
      listeners: [emitter, cb]
    });
    const h = this.marks.appendMark(key, m);
    h.element.setAttribute("ref", className);
    h.element.addEventListener("click", emitter);
    h.element.addEventListener("touchstart", emitter);
    if (cb) {
      h.element.addEventListener("click", cb);
      h.element.addEventListener("touchstart", cb);
    }
    return h;
  }

  /**
   * underline
   * @param {string} cfiRange 
   * @param {object} [data={}] 
   * @param {method} [cb=null]
   * @param {string} [className='epubjs-ul'] 
   * @param {object} [styles={}] 
   * @returns {object}
   */
  underline(cfiRange, data = {}, cb = null, className = "epubjs-ul", styles = {}) {
    if (!this.contents) {
      return;
    }
    data["epubcfi"] = cfiRange;
    if (this.marks === null) {
      this.marks = new marks(this.iframe, this.element);
    }
    const attributes = Object.assign({
      "stroke": "black",
      "stroke-opacity": "0.3",
      "mix-blend-mode": "multiply"
    }, styles);
    const emitter = e => {
      /**
       * @event markClicked
       * @param {string} cfiRange
       * @param {object} data
       * @memberof IframeView
       */
      this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
    };
    const key = encodeURI("epubjs-ul:" + cfiRange);
    const range = this.contents.range(cfiRange);
    const m = new underline(range, {
      className,
      data,
      attributes,
      listeners: [emitter, cb]
    });
    const h = this.marks.appendMark(key, m);
    h.element.setAttribute("ref", className);
    h.element.addEventListener("click", emitter);
    h.element.addEventListener("touchstart", emitter);
    if (cb) {
      h.element.addEventListener("click", cb);
      h.element.addEventListener("touchstart", cb);
    }
    return h;
  }

  /**
   * unhighlight
   * @param {string} cfiRange 
   * @returns {boolean}
   */
  unhighlight(cfiRange) {
    const key = encodeURI("epubjs-hl:" + cfiRange);
    const mark = this.marks.get(key);
    let result = false;
    if (mark) {
      mark.listeners.forEach(l => {
        if (l) {
          mark.element.removeEventListener("click", l);
          mark.element.removeEventListener("touchstart", l);
        }
        ;
      });
      this.marks.removeMark(key);
      result = true;
    }
    return result;
  }

  /**
   * ununderline
   * @param {string} cfiRange 
   * @returns {boolean}
   */
  ununderline(cfiRange) {
    const key = encodeURI("epubjs-ul:" + cfiRange);
    const mark = this.marks.get(key);
    let result = false;
    if (mark) {
      mark.listeners.forEach(l => {
        if (l) {
          mark.element.removeEventListener("click", l);
          mark.element.removeEventListener("touchstart", l);
        }
        ;
      });
      this.marks.removeMark(key);
      result = true;
    }
    return result;
  }

  /**
   * destroy
   */
  destroy() {
    if (this.marks) {
      this.marks.forEach((mark, key) => {
        if (mark instanceof highlight) {
          this.unhighlight(mark.data["epubcfi"]);
        } else {
          this.ununderline(mark.data["epubcfi"]);
        }
      });
    }
    if (this.blobUrl) {
      revokeBlobUrl(this.blobUrl);
    }
    if (this.displayed) {
      this.displayed = false;
      this.removeListeners();
      this.contents.destroy();
      this.stopExpanding = true;
      this.element.removeChild(this.iframe);
      if (this.marks) {
        this.marks.element.remove();
        this.marks.clear();
      }
      this.iframe = undefined;
      this.contents = undefined;
      this.textWidth = null;
      this.textHeight = null;
      this.width = null;
      this.height = null;
    }

    // this.element.style.height = "0px";
    // this.element.style.width = "0px";
  }
}
event_emitter_default()(IframeView.prototype);
/* harmony default export */ const iframe = (IframeView);
;// CONCATENATED MODULE: ./src/utils/scrolltype.js
/**
 * createDefiner
 * @returns {Element}
 */
const createDefiner = () => {
  const definer = document.createElement("div");
  definer.dir = "rtl";
  definer.style.position = "fixed";
  definer.style.width = "1px";
  definer.style.height = "1px";
  definer.style.top = "0px";
  definer.style.left = "0px";
  definer.style.overflow = "hidden";
  const innerDiv = document.createElement("div");
  innerDiv.style.width = "2px";
  const spanA = document.createElement("span");
  spanA.style.width = "1px";
  spanA.style.display = "inline-block";
  const spanB = document.createElement("span");
  spanB.style.width = "1px";
  spanB.style.display = "inline-block";
  innerDiv.appendChild(spanA);
  innerDiv.appendChild(spanB);
  definer.appendChild(innerDiv);
  return definer;
};

/**
 * Detect RTL scroll type
 * @link https://github.com/othree/jquery.rtl-scroll-type/blob/master/src/jquery.rtl-scroll.js
 * @returns {string} scroll type
 */
const scrollType = () => {
  let type = "reverse";
  const definer = createDefiner();
  document.body.appendChild(definer);
  if (definer.scrollLeft > 0) {
    type = "default";
  } else {
    if (typeof Element !== "undefined" && Element.prototype.scrollIntoView) {
      definer.children[0].children[1].scrollIntoView();
      if (definer.scrollLeft < 0) {
        type = "negative";
      }
    } else {
      definer.scrollLeft = 1;
      if (definer.scrollLeft === 0) {
        type = "negative";
      }
    }
  }
  document.body.removeChild(definer);
  return type;
};
/* harmony default export */ const scrolltype = (scrollType);
;// CONCATENATED MODULE: ./src/managers/default/index.js











const default_AXIS_H = "horizontal";
const default_AXIS_V = "vertical";

/**
 * Default View Manager
 */
class DefaultViewManager {
  /**
   * Constructor
   * @param {Book} book 
   * @param {Layout} layout 
   * @param {object} [options]
   * @param {string} [options.axis]
   * @param {string} [options.method] values: `"blobUrl"` OR `"srcdoc"` OR `"write"`
   * @param {string} [options.ignoreClass='']
   * @param {string|object} [options.view='iframe']
   */
  constructor(book, layout, options) {
    /**
     * @member {string} name Manager name
     * @memberof DefaultViewManager
     * @readonly
     */
    this.name = "default";
    this.request = book.load.bind(book);
    this.settings = extend({
      axis: null,
      view: "iframe",
      hidden: false,
      method: null,
      fullsize: null,
      ignoreClass: "",
      writingMode: undefined,
      allowPopups: false,
      allowScriptedContent: false,
      resizeOnOrientationChange: true,
      forceEvenPages: true
    }, options || {});
    /**
     * @member {Layout} layout
     * @memberof DefaultViewManager
     * @readonly
     */
    this.layout = layout;
    this.layout.on(EVENTS.LAYOUT.UPDATED, (props, changed) => {
      if (changed.flow) {
        this.paginated = changed.flow === "paginated";
        if (this.paginated) {
          this.updateAxis(default_AXIS_H);
        } else {
          this.updateAxis(default_AXIS_V);
        }
      }
      this.clear();
      this.updateLayout();
    });
    /**
     * @member {boolean} paginated
     * @memberof DefaultViewManager
     * @readonly
     */
    this.paginated = this.layout.flow === "paginated";
    /**
     * @member {object[]} location
     * @memberof DefaultViewManager
     * @readonly
     */
    this.location = [];
    /**
     * @member {boolean} rendered
     * @memberof DefaultViewManager
     * @readonly
     */
    this.rendered = false;
    this.q = new queue(this);
  }

  /**
   * render
   * @param {Element} element 
   * @param {object} size 
   * @param {number} size.width
   * @param {number} size.height
   */
  render(element, size) {
    let tag;
    if (element.tagName) {
      tag = element.tagName.toLowerCase();
      tag = tag === "body" || tag === "html";
    }
    if (this.settings.fullsize === null && tag) {
      this.settings.fullsize = true;
    }
    this.settings.rtlScrollType = scrolltype();
    /**
     * @member {Stage} stage
     * @memberof DefaultViewManager
     * @property {string} axis
     * @property {string|number} width
     * @property {string|number} height
     * @property {boolean} hidden
     * @property {boolean} fullsize
     * @readonly
     */
    this.stage = new stage(this.layout, {
      axis: this.settings.axis,
      width: size.width,
      height: size.height,
      hidden: this.settings.hidden,
      fullsize: this.settings.fullsize
    });
    this.stage.attachTo(element);
    /**
     * Stage container
     * @member {Element} container div element
     * @memberof DefaultViewManager
     * @readonly
     */
    this.container = this.stage.getContainer();
    /**
     * @member {Views} views 
     * @memberof DefaultViewManager
     * @readonly
     */
    this.views = new views(this.container);
    /**
     * @member {object} stageSize
     * @memberof DefaultViewManager
     * @readonly
     */
    this.stageSize = this.stage.size();

    // Function to handle a resize event.
    // Will only attach if width and height are both fixed.
    this.stage.onResize(this.onResized.bind(this));
    this.stage.onOrientationChange(this.onOrientationChange.bind(this));
    this.rendered = true;
    this.updateLayout();

    // Add Event Listeners
    this.addEventListeners();
  }

  /**
   * addEventListeners
   * @private
   */
  addEventListeners() {
    window.onpagehide = e => this.destroy();
    let container;
    if (this.settings.fullsize) {
      container = window;
    } else {
      container = this.container;
    }
    container.addEventListener("scroll", this.onScroll.bind(this));
  }

  /**
   * removeEventListeners
   * @private
   */
  removeEventListeners() {
    let container;
    if (this.settings.fullsize) {
      container = window;
    } else {
      container = this.container;
    }
    container.removeEventListener("scroll", this.onScroll.bind(this));
  }

  /**
   * destroy
   */
  destroy() {
    clearTimeout(this.orientationTimeout);
    clearTimeout(this.resizeTimeout);
    clearTimeout(this.afterScrolled);
    this.clear();
    this.removeEventListeners();
    this.stage.destroy();
    this.rendered = false;
  }

  /**
   * onOrientationChange
   * @param {Event} e 
   * @private
   */
  onOrientationChange(e) {
    let {
      orientation
    } = window.screen;
    if (this.settings.resizeOnOrientationChange) {
      this.resize();
    }

    // Per ampproject:
    // In IOS 10.3, the measured size of an element is incorrect if the
    // element size depends on window size directly and the measurement
    // happens in window.resize event. Adding a timeout for correct
    // measurement. See https://github.com/ampproject/amphtml/issues/8479
    clearTimeout(this.orientationTimeout);
    this.orientationTimeout = setTimeout(() => {
      this.orientationTimeout = undefined;
      if (this.settings.resizeOnOrientationChange) {
        this.resize();
      }
      this.emit(EVENTS.MANAGERS.ORIENTATION_CHANGE, orientation);
    }, 500);
  }

  /**
   * onResized
   * @param {Event} e 
   * @private
   */
  onResized(e) {
    this.resize();
  }

  /**
   * resize
   * @param {number} [width] 
   * @param {number} [height] 
   * @param {string} [epubcfi] 
   */
  resize(width, height, epubcfi) {
    const stageSize = this.stage.size(width, height);

    // For Safari, wait for orientation to catch up
    // if the window is a square
    this.winBounds = windowBounds();
    if (this.orientationTimeout && this.winBounds.width === this.winBounds.height) {
      // reset the stage size for next resize
      this.stageSize = undefined;
      return;
    }
    if (this.stageSize && this.stageSize.width === stageSize.width && this.stageSize.height === stageSize.height) {
      // Size is the same, no need to resize
      return;
    }
    this.stageSize = stageSize;
    this.clear(); // Clear current views
    this.updateLayout();
    this.emit(EVENTS.MANAGERS.RESIZED, {
      width: this.stageSize.width,
      height: this.stageSize.height
    }, epubcfi);
  }

  /**
   * Require the view from passed string, or as a class function
   * @param  {string|object} view
   * @return {any}
   * @private
   */
  requireView(view) {
    let ret;

    // If view is a string, try to load from imported views,
    if (typeof view == "string" && view === "iframe") {
      ret = iframe;
    } else {
      // otherwise, assume we were passed a class function
      ret = view;
    }
    return ret;
  }

  /**
   * createView
   * @param {Section} section 
   * @param {boolean} [forceRight]
   * @returns {object} View object (default: IframeView)
   * @private
   */
  createView(section, forceRight) {
    const view = this.requireView(this.settings.view);
    return new view(this.layout, section, {
      axis: this.settings.axis,
      snap: this.settings.snap,
      method: this.settings.method,
      allowPopups: this.settings.allowPopups,
      ignoreClass: this.settings.ignoreClass,
      allowScriptedContent: this.settings.allowScriptedContent,
      forceRight: forceRight,
      forceEvenPages: this.settings.forceEvenPages
    });
  }

  /**
   * handleNextPrePaginated
   * @param {boolean} forceRight 
   * @param {Section} section 
   * @param {function} action callback function
   * @returns {any}
   * @private
   */
  handleNextPrePaginated(forceRight, section, action) {
    if (this.layout.name === "pre-paginated" && this.layout.divisor > 1) {
      if (forceRight || section.index === 0) {
        // First page (cover) should stand alone for pre-paginated books
        return;
      }
      const next = section.next();
      if (next && !next.properties.includes("page-spread-left")) {
        return action.call(this, next);
      }
    }
  }

  /**
   * display
   * @param {Section} section 
   * @param {string|number} [target] 
   * @returns {Promise} displaying promise
   */
  display(section, target) {
    const displaying = new defer();
    const displayed = displaying.promise;

    // Check if moving to target is needed
    if (target === section.href || isNumber(target)) {
      target = undefined;
    }

    // Check to make sure the section we want isn't already shown
    const view = this.views.find(section);

    // View is already shown, just move to correct location in view
    if (view && this.layout.name !== "pre-paginated") {
      const offset = view.offset();
      let x,
        y = offset.top;
      if (this.layout.direction === "ltr") {
        x = offset.left;
        this.scrollTo(x, y, true);
      } else {
        x = offset.left + view.width;
        this.scrollTo(x, y, true);
      }
      if (target) {
        this.moveTo(view.locationOf(target), view.width);
      }
      displaying.resolve();
      return displayed;
    }
    this.clear(); // Hide all current views

    let forceRight = false;
    if (this.layout.name === "pre-paginated" && this.layout.divisor === 2 && section.properties.includes("page-spread-right")) {
      forceRight = true;
    }
    this.add(section, forceRight).then(view => {
      // Move to correct place within the section, if needed
      if (target) {
        const offset = view.locationOf(target);
        this.moveTo(offset, view.width);
      }
    }, err => {
      displaying.reject(err);
    }).then(() => {
      return this.handleNextPrePaginated(forceRight, section, this.add);
    }).then(() => {
      this.views.show();
      displaying.resolve();
    });
    return displayed;
  }

  /**
   * afterDisplayed
   * @param {*} view 
   * @private
   */
  afterDisplayed(view) {
    this.emit(EVENTS.MANAGERS.ADDED, view);
  }

  /**
   * afterResized
   * @param {*} view 
   * @private
   */
  afterResized(view) {
    this.emit(EVENTS.MANAGERS.RESIZE, view.section);
  }

  /**
   * moveTo
   * @param {object} offset
   * @param {number} offset.top
   * @param {number} offset.left
   * @param {number} width 
   * @private
   */
  moveTo(offset, width) {
    let distX = 0,
      distY;
    if (this.paginated) {
      distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;
      if (distX + this.layout.delta > this.container.scrollWidth) {
        distX = this.container.scrollWidth - this.layout.delta;
      }
      distY = Math.floor(offset.top / this.layout.delta) * this.layout.delta;
      if (distY + this.layout.delta > this.container.scrollHeight) {
        distY = this.container.scrollHeight - this.layout.delta;
      }
    } else {
      distY = offset.top;
    }
    if (this.layout.direction === "rtl") {
      /***
      	the `floor` function above (L343) is on positive values, so we should add one `layout.delta`
      	to distX or use `Math.ceil` function, or multiply offset.left by -1
      	before `Math.floor`
      */
      distX = distX + this.layout.delta;
      distX = distX - width;
    }
    this.scrollTo(distX, distY, true);
  }

  /**
   * append
   * @param {Section} section Section object
   * @param {boolean} forceRight 
   * @returns {Promise}
   */
  add(section, forceRight) {
    const view = this.createView(section, forceRight);
    view.on(EVENTS.VIEWS.DISPLAYED, () => {
      this.afterDisplayed(view);
    });
    view.on(EVENTS.VIEWS.RESIZED, bounds => {
      this.afterResized(view);
    });
    view.on(EVENTS.VIEWS.AXIS, axis => {
      this.updateAxis(axis);
    });
    view.on(EVENTS.VIEWS.WRITING_MODE, mode => {
      this.updateWritingMode(mode);
    });
    this.views.append(view);
    return view.display(this.request);
  }

  /**
   * append
   * @param {Section} section Section object
   * @param {boolean} forceRight 
   * @returns {Promise}
   * @private
   */
  append(section, forceRight) {
    return this.add(section, forceRight);
  }

  /**
   * prepend
   * @param {Section} section 
   * @param {boolean} forceRight 
   * @returns {Promise}
   * @private
   */
  prepend(section, forceRight) {
    const view = this.createView(section, forceRight);
    view.on(EVENTS.VIEWS.DISPLAYED, () => {
      this.afterDisplayed(view);
    });
    view.on(EVENTS.VIEWS.RESIZED, bounds => {
      this.counter(bounds);
      this.afterResized(view);
    });
    view.on(EVENTS.VIEWS.AXIS, axis => {
      this.updateAxis(axis);
    });
    view.on(EVENTS.VIEWS.WRITING_MODE, mode => {
      this.updateWritingMode(mode);
    });
    this.views.prepend(view);
    return view.display(this.request);
  }

  /**
   * counter
   * @param {object} bounds 
   * @private
   */
  counter(bounds) {
    if (this.settings.axis === default_AXIS_V) {
      this.scrollBy(0, bounds.heightDelta, true);
    } else {
      this.scrollBy(bounds.widthDelta, 0, true);
    }
  }

  /**
   * next
   * @returns {Promise}
   */
  next() {
    let left, section;
    const dir = this.layout.direction;
    if (this.views.length === 0) {
      return null;
    } else if (this.paginated && this.settings.axis === default_AXIS_H && dir === "ltr") {
      this.scrollLeft = this.container.scrollLeft;
      left = this.container.scrollLeft + this.container.offsetWidth + this.layout.delta;
      if (left <= this.container.scrollWidth) {
        this.scrollBy(this.layout.delta, 0, true);
      } else {
        section = this.views.last().section.next();
      }
    } else if (this.paginated && this.settings.axis === default_AXIS_H && dir === "rtl") {
      this.scrollLeft = this.container.scrollLeft;
      if (this.settings.rtlScrollType === "default") {
        left = this.container.scrollLeft;
        if (left > 0) {
          this.scrollBy(this.layout.delta, 0, true);
        } else {
          section = this.views.last().section.next();
        }
      } else {
        left = this.container.scrollLeft + this.layout.delta * -1;
        if (left > this.container.scrollWidth * -1) {
          this.scrollBy(this.layout.delta, 0, true);
        } else {
          section = this.views.last().section.next();
        }
      }
    } else if (this.paginated && this.settings.axis === default_AXIS_V) {
      this.scrollTop = this.container.scrollTop;
      const top = this.container.scrollTop + this.container.offsetHeight;
      if (top < this.container.scrollHeight) {
        this.scrollBy(0, this.layout.height, true);
      } else {
        section = this.views.last().section.next();
      }
    } else {
      section = this.views.last().section.next();
    }
    if (section) {
      this.clear();
      // The new section may have a different 
      // writing-mode from the old section. 
      // Thus, we need to update layout.
      this.updateLayout();
      let forceRight = false;
      if (this.layout.name === "pre-paginated" && this.layout.divisor === 2 && section.properties.includes("page-spread-right")) {
        forceRight = true;
      }
      return this.append(section, forceRight).then(() => {
        return this.handleNextPrePaginated(forceRight, section, this.append);
      }, err => {
        return err;
      }).then(() => {
        // Reset position to start for scrolled-doc vertical-rl in default mode
        if (!this.paginated && this.settings.axis === default_AXIS_H && this.layout.direction === "rtl" && this.settings.rtlScrollType === "default") {
          this.scrollTo(this.container.scrollWidth, 0, true);
        }
        this.views.show();
      });
    }
  }

  /**
   * prev
   * @returns {Promise}
   */
  prev() {
    let left, section;
    const dir = this.layout.direction;
    if (this.views.length === 0) {
      return null;
    } else if (this.paginated && this.settings.axis === default_AXIS_H && dir === "ltr") {
      this.scrollLeft = this.container.scrollLeft;
      left = this.container.scrollLeft;
      if (left > 0) {
        this.scrollBy(-this.layout.delta, 0, true);
      } else {
        section = this.views.first().section.prev();
      }
    } else if (this.paginated && this.settings.axis === default_AXIS_H && dir === "rtl") {
      this.scrollLeft = this.container.scrollLeft;
      if (this.settings.rtlScrollType === "default") {
        left = this.container.scrollLeft + this.container.offsetWidth;
        if (left < this.container.scrollWidth) {
          this.scrollBy(-this.layout.delta, 0, true);
        } else {
          section = this.views.first().section.prev();
        }
      } else {
        left = this.container.scrollLeft;
        if (left < 0) {
          this.scrollBy(-this.layout.delta, 0, true);
        } else {
          section = this.views.first().section.prev();
        }
      }
    } else if (this.paginated && this.settings.axis === default_AXIS_V) {
      this.scrollTop = this.container.scrollTop;
      const top = this.container.scrollTop;
      if (top > 0) {
        this.scrollBy(0, -this.layout.height, true);
      } else {
        section = this.views.first().section.prev();
      }
    } else {
      section = this.views.first().section.prev();
    }
    if (section) {
      this.clear();
      // The new section may have a different 
      // writing-mode from the old section. 
      // Thus, we need to update layout.
      this.updateLayout();
      let forceRight = false;
      if (this.layout.name === "pre-paginated" && this.layout.divisor === 2 && typeof section.prev() !== "object") {
        forceRight = true;
      }
      return this.prepend(section, forceRight).then(() => {
        if (this.layout.name === "pre-paginated" && this.layout.divisor > 1) {
          const left = section.prev();
          if (left) {
            return this.prepend(left);
          }
        }
      }, err => {
        return err;
      }).then(() => {
        if (this.paginated && this.settings.axis === default_AXIS_H) {
          if (this.layout.direction === "rtl") {
            if (this.settings.rtlScrollType === "default") {
              this.scrollTo(0, 0, true);
            } else {
              this.scrollTo(this.container.scrollWidth * -1 + this.layout.delta, 0, true);
            }
          } else {
            this.scrollTo(this.container.scrollWidth - this.layout.delta, 0, true);
          }
        }
        this.views.show();
      });
    }
  }

  /**
   * Get current visible view
   * @returns {*} view
   */
  current() {
    const views = this.visible();
    if (views.length) {
      // Current is the last visible view
      return views[views.length - 1];
    }
    return null;
  }

  /**
   * clear views
   */
  clear() {
    if (this.views) {
      this.views.hide();
      this.scrollTo(0, 0, true);
      this.views.clear();
    }
  }

  /**
   * currentLocation
   * @returns {object[]} Location sections
   */
  currentLocation() {
    this.updateLayout();
    if (this.paginated && this.settings.axis === default_AXIS_H) {
      this.location = this.paginatedLocation();
    } else {
      this.location = this.scrolledLocation();
    }
    return this.location;
  }

  /**
   * Get location from scrolled flow
   * @returns {object[]} Location sections
   * @private
   */
  scrolledLocation() {
    let offset = 0,
      used = 0;
    if (this.settings.fullsize) {
      offset = this.settings.axis === default_AXIS_V ? window.scrollY : window.scrollX;
    }
    const container = this.container.getBoundingClientRect();
    const pageHeight = container.height < window.innerHeight ? container.height : window.innerHeight;
    const pageWidth = container.width < window.innerWidth ? container.width : window.innerWidth;
    const views = this.visible();
    const sections = views.map(view => {
      const {
        index,
        href
      } = view.section;
      const position = view.position();
      let startPos;
      let endPos;
      let stopPos;
      let totalPages;
      if (this.settings.axis === default_AXIS_V) {
        startPos = offset + container.top - position.top + used;
        endPos = startPos + pageHeight - used;
        stopPos = pageHeight;
        totalPages = this.layout.count(view.height, pageHeight).pages;
      } else {
        startPos = offset + container.left - position.left + used;
        endPos = startPos + pageWidth - used;
        stopPos = pageWidth;
        totalPages = this.layout.count(view.width, pageWidth).pages;
      }
      let currPage = Math.ceil(startPos / stopPos);
      let endPage = Math.ceil(endPos / stopPos);

      // Reverse page counts for horizontal rtl
      if (this.settings.axis === default_AXIS_H && this.layout.direction === "rtl") {
        const tmp = currPage;
        currPage = totalPages - endPage;
        endPage = totalPages - tmp;
      }
      const pages = [];
      for (let i = currPage; i <= endPage; i++) {
        pages.push(i + 1);
      }
      const mapping = this.mapping.page(view.contents, view.section.cfiBase, startPos, endPos);
      return {
        axis: this.settings.axis,
        href,
        index,
        pages,
        totalPages,
        mapping
      };
    });
    return sections;
  }

  /**
   * Get location from paginated flow
   * @returns {object[]} sections
   * @private
   */
  paginatedLocation() {
    let left = 0,
      used = 0;
    if (this.settings.fullsize) {
      left = window.scrollX;
    }
    const container = this.container.getBoundingClientRect();
    const views = this.visible();
    const sections = views.map(view => {
      const {
        index,
        href
      } = view.section;
      const position = view.position();

      // Find mapping
      let offset;
      let startPos;
      let endPos;
      let pageWidth;
      if (this.layout.direction === "rtl") {
        offset = container.right - left;
        pageWidth = Math.min(Math.abs(offset - position.left), this.layout.width) - used;
        endPos = position.width - (position.right - offset) - used;
        startPos = endPos - pageWidth;
      } else {
        offset = container.left + left;
        pageWidth = Math.min(position.right - offset, this.layout.width) - used;
        startPos = offset - position.left + used;
        endPos = startPos + pageWidth;
      }
      used += pageWidth;
      let startPage = Math.floor(startPos / this.layout.pageWidth);
      let endPage = Math.floor(endPos / this.layout.pageWidth);

      // start page should not be negative
      if (startPage < 0) {
        startPage = 0;
        endPage = endPage + 1;
      }
      const totalPages = this.layout.count(view.width).pages;
      // Reverse page counts for rtl
      if (this.layout.direction === "rtl") {
        const tmp = startPage;
        startPage = totalPages - endPage;
        endPage = totalPages - tmp;
      }
      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i + 1);
      }
      const mapping = this.mapping.page(view.contents, view.section.cfiBase, startPos, endPos);
      return {
        axis: this.settings.axis,
        href,
        index,
        pages,
        totalPages,
        mapping
      };
    });
    return sections;
  }

  /**
   * isVisible
   * @param {*} view 
   * @param {number} offsetPrev 
   * @param {number} offsetNext 
   * @param {DOMRect} [rect] 
   * @returns {boolean}
   * @private
   */
  isVisible(view, offsetPrev, offsetNext, rect) {
    const position = view.position();
    const container = rect || this.bounds();
    if (this.settings.axis === default_AXIS_H && position.right > container.left - offsetPrev && position.left < container.right + offsetNext) {
      return true;
    } else if (this.settings.axis === default_AXIS_V && position.bottom > container.top - offsetPrev && position.top < container.bottom + offsetNext) {
      return true;
    }
    return false;
  }

  /**
   * Get array of visible views
   * @returns {object[]} array of visible views
   */
  visible() {
    const container = this.bounds();
    const views = this.views.displayed();
    const items = [];
    for (let i = 0, len = views.length; i < len; i++) {
      const view = views[i];
      if (this.isVisible(view, 0, 0, container)) {
        items.push(view);
      }
    }
    return items;
  }

  /**
   * scrollBy
   * @param {number} x 
   * @param {number} y 
   * @param {boolean} silent 
   * @private
   */
  scrollBy(x, y, silent) {
    const dir = this.layout.direction === "rtl" ? -1 : 1;
    if (silent) {
      this.ignore = true;
    }
    if (this.settings.fullsize) {
      window.scrollBy(x * dir, y * dir);
    } else {
      if (x) this.container.scrollLeft += x * dir;
      if (y) this.container.scrollTop += y;
    }
  }

  /**
   * scrollTo
   * @param {number} x 
   * @param {number} y 
   * @param {boolean} silent 
   * @private
   */
  scrollTo(x, y, silent) {
    if (silent) {
      this.ignore = true;
    }
    if (this.settings.fullsize) {
      window.scrollTo(x, y);
    } else {
      this.container.scrollLeft = x;
      this.container.scrollTop = y;
    }
  }

  /**
   * onScroll event handler
   * @private
   */
  onScroll() {
    let scrollTop;
    let scrollLeft;
    if (this.settings.fullsize) {
      scrollTop = window.scrollY;
      scrollLeft = window.scrollX;
    } else {
      scrollTop = this.container.scrollTop;
      scrollLeft = this.container.scrollLeft;
    }
    this.scrollTop = scrollTop;
    this.scrollLeft = scrollLeft;
    if (this.ignore) {
      this.ignore = false;
    } else {
      this.emit(EVENTS.MANAGERS.SCROLL, {
        top: scrollTop,
        left: scrollLeft
      });
      clearTimeout(this.afterScrolled);
      this.afterScrolled = setTimeout(() => {
        this.emit(EVENTS.MANAGERS.SCROLLED, {
          top: scrollTop,
          left: scrollLeft
        });
      }, 20);
    }
  }

  /**
   * Get bounds
   * @returns {DOMRect}
   */
  bounds() {
    return this.stage.bounds();
  }

  /**
   * Update Layout
   */
  updateLayout() {
    let height;
    if (this.layout.flow === "scrolled-doc") {
      const view = this.current();
      height = view && view.height;
    }
    this.stageSize = this.stage.size(null, height);
    if (this.paginated) {
      this.layout.calculate(this.stageSize.width, this.stageSize.height, this.settings.gap);
      // Set the look ahead offset for what is visible
      this.settings.offset = this.layout.delta / this.layout.divisor;
    } else {
      this.layout.calculate(this.stageSize.width, this.stageSize.height);
    }

    /**
     * @member {Mapping} mapping
     * @memberof DefaultViewManager
     * @readonly
     */
    this.mapping = new src_mapping(this.layout, this.settings.axis);
    if (this.views.length > 0 && this.layout.name === "pre-paginated") {
      this.display(this.views.first().section);
    }
  }

  /**
   * Update writing mode
   * @param {string} mode 
   * @private
   */
  updateWritingMode(mode) {
    this.writingMode = mode; // unused
  }

  /**
   * Update axis
   * @param {string} axis
   * @param {boolean} [forceUpdate=false] force update
   * @private
   */
  updateAxis(axis, forceUpdate = false) {
    if (axis === this.settings.axis && forceUpdate === false) {
      return;
    }
    this.settings.axis = axis;
    this.stage.axis(axis);
    if (this.mapping) {
      this.mapping = new src_mapping(this.layout, axis);
    }
  }

  /**
   * Get contents array from views
   * @returns {object[]} [view.contents]
   */
  getContents() {
    const contents = [];
    if (!this.views) {
      return contents;
    }
    this.views.forEach(view => {
      view && contents.push(view.contents);
    });
    return contents;
  }

  /**
   * isRendered
   * @returns {boolean}
   */
  isRendered() {
    return this.rendered;
  }
}
event_emitter_default()(DefaultViewManager.prototype);
/* harmony default export */ const managers_default = (DefaultViewManager);
;// CONCATENATED MODULE: ./src/managers/helpers/snap.js





// easing equations from https://github.com/danro/easing-js/blob/master/easing.js
const PI_D2 = Math.PI / 2;
const EASING_EQUATIONS = {
  easeOutSine: pos => {
    return Math.sin(pos * PI_D2);
  },
  easeInOutSine: pos => {
    return -0.5 * (Math.cos(Math.PI * pos) - 1);
  },
  easeInOutQuint: pos => {
    if ((pos /= 0.5) < 1) {
      return 0.5 * Math.pow(pos, 5);
    }
    return 0.5 * (Math.pow(pos - 2, 5) + 2);
  },
  easeInCubic: pos => {
    return Math.pow(pos, 3);
  }
};

/**
 * Snap
 */
class Snap {
  /**
   * Constructor
   * @param {*} manager
   * @param {object} [options]
   * @param {number} [options.duration=300]
   * @param {number} [options.minVelocity=0.2]
   * @param {number} [options.minDistance=10]
   */
  constructor(manager, options) {
    this.settings = extend({
      duration: 300,
      minVelocity: 0.2,
      minDistance: 10,
      easing: EASING_EQUATIONS["easeInCubic"]
    }, options || {});
    if (this.supportsTouch()) {
      this.setup(manager);
    }
  }

  /**
   * setup
   * @param {*} manager 
   */
  setup(manager) {
    this.manager = manager;
    this.layout = this.manager.layout;
    this.fullsize = this.manager.settings.fullsize;
    if (this.fullsize) {
      this.element = this.manager.stage.element;
      this.scroller = window;
      this.disableScroll();
    } else {
      this.element = this.manager.stage.container;
      this.scroller = this.element;
    }

    // set lookahead offset to page width
    this.manager.settings.offset = this.layout.width;
    this.manager.settings.afterScrolledTimeout = this.settings.duration * 2;
    this.isVertical = this.manager.settings.axis === "vertical";

    // disable snapping if not paginated or axis in not horizontal
    if (!this.manager.paginated || this.isVertical) {
      return;
    }
    this.touchCanceler = false;
    this.resizeCanceler = false;
    this.snapping = false;
    this.scrollLeft;
    this.scrollTop;
    this.startTouchX = undefined;
    this.startTouchY = undefined;
    this.startTime = undefined;
    this.endTouchX = undefined;
    this.endTouchY = undefined;
    this.endTime = undefined;
    this.addListeners();
  }

  /**
   * supportsTouch
   * @returns {boolean}
   */
  supportsTouch() {
    return "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch;
  }

  /**
   * disableScroll
   * @private
   */
  disableScroll() {

    //this.element.style.overflow = "hidden";
  }

  /**
   * enableScroll
   * @private
   */
  enableScroll() {

    //this.element.style.overflow = null;
  }

  /**
   * addListeners
   * @private
   */
  addListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
    this.scroller.addEventListener("scroll", this.onScroll.bind(this));
    this.scroller.addEventListener("touchstart", this.onTouchStart.bind(this), {
      passive: true
    });
    this.scroller.addEventListener("touchmove", this.onTouchMove.bind(this), {
      passive: true
    });
    this.scroller.addEventListener("touchend", this.onTouchEnd.bind(this), {
      passive: true
    });
    this.on("touchstart", this.onTouchStart.bind(this));
    this.on("touchmove", this.onTouchMove.bind(this));
    this.on("touchend", this.onTouchEnd.bind(this));
    this.manager.on(EVENTS.MANAGERS.ADDED, this.afterDisplayed.bind(this));
  }

  /**
   * removeListeners
   * @private
   */
  removeListeners() {
    window.removeEventListener("resize", this.onResize.bind(this));
    this.scroller.removeEventListener("scroll", this.onScroll.bind(this));
    this.scroller.removeEventListener("touchstart", this.onTouchStart.bind(this), {
      passive: true
    });
    this.scroller.removeEventListener("touchmove", this.onTouchMove.bind(this), {
      passive: true
    });
    this.scroller.removeEventListener("touchend", this.onTouchEnd.bind(this), {
      passive: true
    });
    this.off("touchstart", this.onTouchStart.bind(this));
    this.off("touchmove", this.onTouchMove.bind(this));
    this.off("touchend", this.onTouchEnd.bind(this));
    this.manager.off(EVENTS.MANAGERS.ADDED, this.afterDisplayed.bind(this));
  }

  /**
   * afterDisplayed
   * @param {*} view
   * @private
   */
  afterDisplayed(view) {
    const contents = view.contents;
    ["touchstart", "touchmove", "touchend"].forEach(e => {
      contents.on(e, ev => this.triggerViewEvent(ev, contents));
    });
  }

  /**
   * triggerViewEvent
   * @param {Event} e 
   * @param {Contents} contents 
   * @private
   */
  triggerViewEvent(e, contents) {
    this.emit(e.type, e, contents);
  }

  /**
   * onScroll
   * @param {Event} e 
   * @private
   */
  onScroll(e) {
    this.scrollLeft = this.fullsize ? window.scrollX : this.scroller.scrollLeft;
    this.scrollTop = this.fullsize ? window.scrollY : this.scroller.scrollTop;
  }

  /**
   * onResize
   * @param {Event} e 
   * @private
   */
  onResize(e) {
    this.resizeCanceler = true;
  }

  /**
   * onTouchStart
   * @param {Event} e 
   * @private
   */
  onTouchStart(e) {
    const {
      screenX,
      screenY
    } = e.touches[0];
    if (this.fullsize) {
      this.enableScroll();
    }
    this.touchCanceler = true;
    if (!this.startTouchX) {
      this.startTouchX = screenX;
      this.startTouchY = screenY;
      this.startTime = new Date().getTime();
    }
    this.endTouchX = screenX;
    this.endTouchY = screenY;
    this.endTime = new Date().getTime();
  }

  /**
   * onTouchMove
   * @param {Event} e 
   * @private
   */
  onTouchMove(e) {
    const {
      screenX,
      screenY
    } = e.touches[0];
    const deltaY = Math.abs(screenY - this.endTouchY);
    this.touchCanceler = true;
    if (!this.fullsize && deltaY < 10) {
      this.element.scrollLeft -= screenX - this.endTouchX;
    }
    this.endTouchX = screenX;
    this.endTouchY = screenY;
    this.endTime = new Date().getTime();
  }

  /**
   * onTouchEnd
   * @param {Event} e 
   * @private
   */
  onTouchEnd(e) {
    if (this.fullsize) {
      this.disableScroll();
    }
    this.touchCanceler = false;
    let swipped = this.wasSwiped();
    if (swipped !== 0) {
      this.snap(swipped);
    } else {
      this.snap();
    }
    this.startTouchX = undefined;
    this.startTouchY = undefined;
    this.startTime = undefined;
    this.endTouchX = undefined;
    this.endTouchY = undefined;
    this.endTime = undefined;
  }

  /**
   * wasSwiped
   * @returns {number}
   */
  wasSwiped() {
    const snapWidth = this.layout.pageWidth * this.layout.divisor;
    const distance = this.endTouchX - this.startTouchX;
    const absolute = Math.abs(distance);
    const time = this.endTime - this.startTime;
    const velocity = distance / time;
    const minVelocity = this.settings.minVelocity;
    if (absolute <= this.settings.minDistance || absolute >= snapWidth) {
      return 0;
    }
    if (velocity > minVelocity) {
      return -1; // previous
    } else if (velocity < -minVelocity) {
      return 1; // next
    }
  }

  /**
   * needsSnap
   * @returns {boolean}
   */
  needsSnap() {
    const left = this.scrollLeft;
    const snapWidth = this.layout.pageWidth * this.layout.divisor;
    return left % snapWidth !== 0;
  }

  /**
   * snap
   * @param {number} [howMany=0] 
   * @returns {Promise}
   */
  snap(howMany = 0) {
    const left = this.scrollLeft;
    const snapWidth = this.layout.pageWidth * this.layout.divisor;
    let snapTo = Math.round(left / snapWidth) * snapWidth;
    if (howMany) {
      snapTo += howMany * snapWidth;
    }
    return this.smoothScrollTo(snapTo);
  }

  /**
   * smoothScrollTo
   * @param {number} destination 
   * @returns {Promise}
   */
  smoothScrollTo(destination) {
    const deferred = new defer();
    const start = this.scrollLeft;
    const startTime = new Date().getTime();
    const duration = this.settings.duration;
    this.snapping = true;

    // add animation loop
    const tick = () => {
      const now = new Date().getTime();
      const time = Math.min(1, (now - startTime) / duration);
      if (this.touchCanceler || this.resizeCanceler) {
        this.resizeCanceler = false;
        this.snapping = false;
        deferred.resolve();
        return;
      }
      if (time < 1) {
        window.requestAnimationFrame(tick.bind(this));
        this.scrollTo(start + (destination - start) * time, 0);
      } else {
        this.scrollTo(destination, 0);
        this.snapping = false;
        deferred.resolve();
      }
    };
    tick.call(this);
    return deferred.promise;
  }

  /**
   * scrollTo
   * @param {number} [left=0] 
   * @param {number} [top=0] 
   */
  scrollTo(left = 0, top = 0) {
    if (this.fullsize) {
      window.scroll(left, top);
    } else {
      this.scroller.scrollLeft = left;
      this.scroller.scrollTop = top;
    }
  }

  /**
   * destroy
   * @returns {void}
   */
  destroy() {
    if (typeof this.scroller === "undefined") {
      return;
    }
    if (this.fullsize) {
      this.enableScroll();
    }
    this.removeListeners();
    this.scroller = undefined;
  }
}
event_emitter_default()(Snap.prototype);
/* harmony default export */ const snap = (Snap);
// EXTERNAL MODULE: ./node_modules/lodash/debounce.js
var debounce = __webpack_require__(8221);
var debounce_default = /*#__PURE__*/__webpack_require__.n(debounce);
;// CONCATENATED MODULE: ./src/managers/continuous/index.js








/**
 * Continuous view manager
 * @extends {DefaultViewManager}
 */
class ContinuousViewManager extends managers_default {
  /**
   * Constructor
   * @param {Book} book
   * @param {object} [options]
   * @param {string} [options.axis]
   * @param {object} [options.snap]
   * @param {string} [options.method] values: `"blobUrl"` OR `"srcdoc"` OR `"write"`
   * @param {string} [options.ignoreClass='']
   * @param {string|object} [options.view='iframe']
   */
  constructor(book, layout, options) {
    super(book, layout, options);
    /**
     * @member {string} name
     * @memberof ContinuousViewManager
     * @readonly
     */
    this.name = "continuous";
    this.settings = extend({
      axis: null,
      snap: null,
      view: "iframe",
      method: null,
      offset: 500,
      offsetDelta: 250,
      ignoreClass: "",
      writingMode: undefined,
      allowPopups: false,
      afterScrolledTimeout: 10,
      allowScriptedContent: false,
      resizeOnOrientationChange: true,
      forceEvenPages: false
    }, options || {});
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }

  /**
   * render
   * @param {Element} element 
   * @param {object} size 
   * @override
   */
  render(element, size) {
    super.render(element, size);
    if (this.paginated && this.settings.snap) {
      this.snapper = new snap(this, this.settings.snap);
    }
  }

  /**
   * display
   * @param {Section} section 
   * @param {string|number} [target] 
   * @returns {Promise} displaying promise
   * @override
   */
  async display(section, target) {
    return super.display(section, target).then(() => this.fill());
  }

  /**
   * fill
   * @param {Defer} value
   * @returns {Promise}
   */
  fill(value) {
    const full = value || new defer();
    this.q.enqueue(() => {
      return this.check();
    }).then(result => {
      if (result) {
        this.fill(full); // recursive call
      } else {
        full.resolve();
      }
    });
    return full.promise;
  }

  /**
   * moveTo
   * @param {object} offset 
   * @override
   */
  moveTo(offset) {
    let distX = 0,
      distY = 0;
    //let offsetX = 0, offsetY = 0; // unused

    if (this.paginated) {
      distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;
      //offsetX = distX + this.settings.offsetDelta;
    } else {
      distY = offset.top;
      //offsetY = offset.top + this.settings.offsetDelta;
    }
    if (distX > 0 || distY > 0) {
      this.scrollBy(distX, distY, true);
    }
  }

  /**
   * Remove Previous Listeners if present
   * @param {*} view 
   */
  removeShownListeners(view) {
    view.off(EVENTS.VIEWS.DISPLAYED);
  }

  /**
   * add
   * @param {Section} section 
   * @returns {Promise}
   * @override
   */
  add(section) {
    const view = this.createView(section);
    view.on(EVENTS.VIEWS.DISPLAYED, () => {
      this.afterDisplayed(view);
    });
    view.on(EVENTS.VIEWS.RESIZED, bounds => {
      this.afterResized(view);
    });
    view.on(EVENTS.VIEWS.AXIS, axis => {
      this.updateAxis(axis);
    });
    view.on(EVENTS.VIEWS.WRITING_MODE, mode => {
      this.updateWritingMode(mode);
    });
    this.views.append(view);
    return view.display(this.request);
  }

  /**
   * Append view
   * @param {Section} section 
   * @returns {*} view
   * @override
   */
  append(section) {
    const view = this.createView(section);
    view.on(EVENTS.VIEWS.DISPLAYED, () => {
      this.afterDisplayed(view);
    });
    view.on(EVENTS.VIEWS.RESIZED, bounds => {
      this.afterResized(view);
    });
    view.on(EVENTS.VIEWS.AXIS, axis => {
      this.updateAxis(axis);
    });
    view.on(EVENTS.VIEWS.WRITING_MODE, mode => {
      this.updateWritingMode(mode);
    });
    this.views.append(view);
    return view;
  }

  /**
   * Prepend view
   * @param {Section} section 
   * @returns {*} view
   * @override
   */
  prepend(section) {
    const view = this.createView(section);
    view.on(EVENTS.VIEWS.DISPLAYED, () => {
      this.afterDisplayed(view);
    });
    view.on(EVENTS.VIEWS.RESIZED, bounds => {
      this.counter(bounds);
      this.afterResized(view);
    });
    view.on(EVENTS.VIEWS.AXIS, axis => {
      this.updateAxis(axis);
    });
    view.on(EVENTS.VIEWS.WRITING_MODE, mode => {
      this.updateWritingMode(mode);
    });
    this.views.prepend(view);
    return view;
  }

  /**
   * update
   * @param {number} [offset] 
   * @returns {Promise}
   */
  async update(offset) {
    const rect = this.bounds();
    const views = this.views;
    const _offset = typeof offset !== "undefined" ? offset : this.settings.offset || 0;
    const updating = new defer();
    const promises = [];
    for (let i = 0; i < views.length; i++) {
      const view = views[i];
      const isVisible = this.isVisible(view, _offset, _offset, rect);
      if (isVisible === true) {
        if (view.displayed) {
          view.show();
        } else {
          const displayed = view.display(this.request).then(view => {
            view.show();
          }, err => {
            view.hide();
            console.error(err);
          });
          promises.push(displayed);
        }
      } else {
        this.q.enqueue(view.destroy.bind(view));
        // console.log("hidden " + view.section.index, view.displayed);

        clearTimeout(this.trimTimeout);
        this.trimTimeout = setTimeout(() => {
          this.q.enqueue(this.trim.bind(this));
        }, 250);
      }
    }
    if (promises.length) {
      return Promise.all(promises).catch(err => {
        updating.reject(err);
      });
    } else {
      updating.resolve();
      return updating.promise;
    }
  }

  /**
   * check
   * @param {number} [offsetLeft]
   * @param {number} [offsetTop]
   * @returns {Promise}
   */
  check(offsetLeft, offsetTop) {
    const checking = new defer();
    const newViews = [];
    const horizontal = this.settings.axis === "horizontal";
    let delta = this.settings.offset || 0;
    if (offsetLeft && horizontal) {
      delta = offsetLeft;
    }
    if (offsetTop && !horizontal) {
      delta = offsetTop;
    }
    const bounds = this.bounds(); // bounds saved this until resize
    const visibleLength = horizontal ? Math.floor(bounds.width) : bounds.height;
    const contentLength = horizontal ? this.container.scrollWidth : this.container.scrollHeight;
    const writingMode = this.writingMode && this.writingMode.indexOf("vertical") === 0 ? "vertical" : "horizontal";
    const rtlScrollType = this.settings.rtlScrollType;
    const rtl = this.layout.direction === "rtl";
    let offset = horizontal ? this.scrollLeft : this.scrollTop;
    if (this.settings.fullsize) {
      // Scroll offset starts at 0 and goes negative
      if (horizontal && rtl && rtlScrollType === "negative" || !horizontal && rtl && rtlScrollType === "default") {
        offset = offset * -1;
      }
    } else {
      // Scroll offset starts at width of element
      if (rtl && rtlScrollType === "default" && writingMode === "horizontal") {
        offset = contentLength - visibleLength - offset;
      }
      // Scroll offset starts at 0 and goes negative
      if (rtl && rtlScrollType === "negative" && writingMode === "horizontal") {
        offset = offset * -1;
      }
    }
    const append = () => {
      const last = this.views.last();
      const next = last && last.section.next();
      if (next) {
        newViews.push(this.append(next));
      }
    };
    const prepend = () => {
      const first = this.views.first();
      const prev = first && first.section.prev();
      if (prev) {
        newViews.push(this.prepend(prev));
      }
    };
    const end = offset + visibleLength + delta;
    const start = offset - delta;
    if (end >= contentLength) {
      append();
    }
    if (start < 0) {
      prepend();
    }
    const promises = newViews.map(view => {
      return view.display(this.request);
    });
    if (newViews.length) {
      return Promise.all(promises).then(() => {
        return this.check();
      }).then(() => {
        // Check to see if anything new is on screen after rendering
        return this.update(delta);
      }, err => {
        return err;
      });
    } else {
      this.q.enqueue(() => {
        this.update();
      });
      checking.resolve(false);
      return checking.promise;
    }
  }

  /**
   * trim
   * @returns {Promise}
   */
  trim() {
    const task = new defer();
    const displayed = this.views.displayed();
    const first = displayed[0];
    const last = displayed[displayed.length - 1];
    const firstIndex = this.views.indexOf(first);
    const lastIndex = this.views.indexOf(last);
    const above = this.views.slice(0, firstIndex);
    const below = this.views.slice(lastIndex + 1);

    // Erase all but last above
    for (let i = 0; i < above.length - 1; i++) {
      this.erase(above[i], above);
    }

    // Erase all except first below
    for (let j = 1; j < below.length; j++) {
      this.erase(below[j]);
    }
    task.resolve();
    return task.promise;
  }

  /**
   * erase
   * @param {*} view 
   * @param {*} above 
   */
  erase(view, above) {
    let prevTop;
    let prevLeft;
    if (this.settings.fullsize) {
      prevTop = window.scrollY;
      prevLeft = window.scrollX;
    } else {
      prevTop = this.container.scrollTop;
      prevLeft = this.container.scrollLeft;
    }
    const bounds = view.bounds();
    this.views.remove(view);
    if (above) {
      if (this.settings.axis === "vertical") {
        this.scrollTo(0, prevTop - bounds.height, true);
      } else {
        if (this.layout.direction === "rtl") {
          if (!this.settings.fullsize) {
            this.scrollTo(prevLeft, 0, true);
          } else {
            this.scrollTo(prevLeft + Math.floor(bounds.width), 0, true);
          }
        } else {
          this.scrollTo(prevLeft - Math.floor(bounds.width), 0, true);
        }
      }
    }
  }

  /**
   * addEventListeners
   * @override
   */
  addEventListeners() {
    window.onpagehide = e => {
      this.ignore = true;
      this.destroy();
    };
    this.addScrollListeners();
  }

  /**
   * addScrollListeners
   * @private
   */
  addScrollListeners() {
    this.tick = core_requestAnimationFrame;
    let dir;
    if (this.layout.direction === "rtl" && this.settings.rtlScrollType === "default") {
      dir = -1;
    } else {
      dir = 1;
    }
    this.scrollDeltaVert = 0;
    this.scrollDeltaHorz = 0;
    let scroller;
    if (!this.settings.fullsize) {
      scroller = this.container;
      this.scrollTop = this.container.scrollTop;
      this.scrollLeft = this.container.scrollLeft;
    } else {
      scroller = window;
      this.scrollTop = window.scrollY * dir;
      this.scrollLeft = window.scrollX * dir;
    }
    scroller.addEventListener("scroll", this.onScroll.bind(this));
    this._scrolled = debounce_default()(this.scrolled.bind(this), 30);
    this.didScroll = false;
  }

  /**
   * removeEventListeners
   * @override
   */
  removeEventListeners() {
    let scroller;
    if (this.settings.fullsize) {
      scroller = window;
    } else {
      scroller = this.container;
    }
    scroller.removeEventListener("scroll", this.onScroll.bind(this));
  }

  /**
   * onScroll
   * @override
   */
  onScroll() {
    let scrollTop;
    let scrollLeft;
    let dir;
    if (this.layout.direction === "rtl" && this.settings.rtlScrollType === "default") {
      dir = -1;
    } else {
      dir = 1;
    }
    if (!this.settings.fullsize) {
      scrollTop = this.container.scrollTop;
      scrollLeft = this.container.scrollLeft;
    } else {
      scrollTop = window.scrollY * dir;
      scrollLeft = window.scrollX * dir;
    }
    this.scrollTop = scrollTop;
    this.scrollLeft = scrollLeft;
    if (!this.ignore) {
      this._scrolled();
    } else {
      this.ignore = false;
    }
    this.scrollDeltaVert += Math.abs(scrollTop - this.prevScrollTop);
    this.scrollDeltaHorz += Math.abs(scrollLeft - this.prevScrollLeft);
    this.prevScrollTop = scrollTop;
    this.prevScrollLeft = scrollLeft;
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.scrollDeltaVert = 0;
      this.scrollDeltaHorz = 0;
    }, 150);
    clearTimeout(this.afterScrolled);
    this.didScroll = false;
  }

  /**
   * scrolled
   * @private
   */
  scrolled() {
    this.q.enqueue(() => {
      return this.check();
    });
    this.emit(EVENTS.MANAGERS.SCROLL, {
      top: this.scrollTop,
      left: this.scrollLeft
    });
    clearTimeout(this.afterScrolled);
    this.afterScrolled = setTimeout(() => {
      // Don't report scroll if we are about the snap
      if (this.snapper && this.snapper.supportsTouch() && this.snapper.needsSnap()) {
        return;
      }
      this.emit(EVENTS.MANAGERS.SCROLLED, {
        top: this.scrollTop,
        left: this.scrollLeft
      });
    }, this.settings.afterScrolledTimeout);
  }

  /**
   * next
   * @override
   */
  next() {
    let delta;
    if (this.layout.name === "pre-paginated" && this.layout.spread === "auto") {
      delta = this.layout.delta * 2;
    } else {
      delta = this.layout.delta;
    }
    if (this.views.length === 0) return;
    if (this.paginated && this.settings.axis === "horizontal") {
      this.scrollBy(delta, 0, true);
    } else {
      this.scrollBy(0, this.layout.height, true);
    }
    this.q.enqueue(() => {
      return this.check();
    });
  }

  /**
   * prev
   * @override
   */
  prev() {
    let delta;
    if (this.layout.name === "pre-paginated" && this.layout.spread === "auto") {
      delta = this.layout.delta * 2;
    } else {
      delta = this.layout.delta;
    }
    if (this.views.length === 0) return;
    if (this.paginated && this.settings.axis === "horizontal") {
      this.scrollBy(-delta, 0, true);
    } else {
      this.scrollBy(0, -this.layout.height, true);
    }
    this.q.enqueue(() => {
      return this.check();
    });
  }

  /**
   * destroy
   * @override
   */
  destroy() {
    super.destroy();
    if (this.snapper) {
      this.snapper.destroy();
    }
  }
}
/* harmony default export */ const continuous = (ContinuousViewManager);
;// CONCATENATED MODULE: ./src/rendition.js












// Default View Managers



/**
 * Displays an Epub as a series of Views for each Section.
 * Requires Manager and View class to handle specifics of rendering
 * the section content.
 * @param {Book} book
 * @param {object} [options]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.ignoreClass] class for the cfi parser to ignore
 * @param {string|function|object} [options.manager='default'] string values: default / continuous
 * @param {string|function} [options.view='iframe']
 * @param {string} [options.layout] layout to force
 * @param {string} [options.spread] force spread value
 * @param {string} [options.direction] direction `"ltr"` OR `"rtl"`
 * @param {number} [options.minSpreadWidth] overridden by spread: none (never) / both (always)
 * @param {string} [options.stylesheet] url of stylesheet to be injected
 * @param {string} [options.script] url of script to be injected
 * @param {object} [options.snap] use snap scrolling
 * @param {boolean} [options.fullsize=false]
 * @param {boolean} [options.allowPopups=false] enable opening popup in content
 * @param {boolean} [options.allowScriptedContent=false] enable running scripts in content
 * @param {boolean} [options.resizeOnOrientationChange=true] false to disable orientation events
 */
class Rendition {
  constructor(book, options) {
    /**
     * @member {object} settings
     * @memberof Rendition
     * @readonly
     */
    this.settings = extend({
      width: null,
      height: null,
      manager: "default",
      view: "iframe",
      flow: null,
      layout: null,
      spread: null,
      minSpreadWidth: 800,
      script: null,
      snap: false,
      direction: null,
      // TODO: implement to 'auto' detection
      ignoreClass: "",
      stylesheet: null,
      fullsize: false,
      allowPopups: false,
      allowScriptedContent: false,
      resizeOnOrientationChange: true
    }, options || {});
    if (typeof this.settings.manager === "object") {
      this.manager = this.settings.manager;
    }
    this.book = book;
    /**
     * Adds Hook methods to the Rendition prototype
     * @member {object} hooks
     * @property {Hook} hooks.content
     * @property {Hook} hooks.display
     * @property {Hook} hooks.layout
     * @property {Hook} hooks.render
     * @property {Hook} hooks.show
     * @property {Hook} hooks.unloaded
     * @memberof Rendition
     */
    this.hooks = {
      content: new hook(this),
      display: new hook(this),
      layout: new hook(this),
      render: new hook(this),
      show: new hook(this),
      unloaded: new hook(this)
    };
    this.hooks.content.register(this.handleLinks.bind(this));
    this.hooks.content.register(this.passEvents.bind(this));
    this.hooks.content.register(this.adjustImages.bind(this));
    this.book.sections.hooks.content.register(this.injectIdentifier.bind(this));
    if (this.settings.stylesheet) {
      this.book.sections.hooks.content.register(this.injectStylesheet.bind(this));
    }
    if (this.settings.script) {
      this.book.sections.hooks.content.register(this.injectScript.bind(this));
    }
    /**
     * @member {Annotations} annotations
     * @memberof Rendition
     * @readonly
     */
    this.annotations = new annotations(this);
    /**
     * @member {Themes} themes
     * @memberof Rendition
     * @readonly
     */
    this.themes = new themes(this);
    this.epubcfi = new src_epubcfi();
    this.q = new queue(this);

    /**
     * A Rendered Location Range
     * @typedef location
     * @type {Object}
     * @property {object} start
     * @property {string} start.index
     * @property {string} start.href
     * @property {object} start.displayed
     * @property {number} start.displayed.page
     * @property {number} start.displayed.total
     * @property {string} start.cfi EpubCFI string format
     * @property {number} start.location
     * @property {number} start.percentage
     * @property {object} end
     * @property {string} end.index
     * @property {string} end.href
     * @property {object} end.displayed
     * @property {number} end.displayed.page
     * @property {number} end.displayed.total
     * @property {string} end.cfi EpubCFI string format
     * @property {number} end.location
     * @property {number} end.percentage
     * @property {boolean} atStart Location at start position
     * @property {boolean} atEnd Location at end position
     * @memberof Rendition
     */
    this.location = undefined;

    // Hold queue until book is opened
    this.q.enqueue(this.book.opened);
    this.starting = new defer();
    /**
     * returns after the rendition has started
     * @member {Promise} started
     * @memberof Rendition
     */
    this.started = this.starting.promise;

    // Block the queue until rendering is started
    this.q.enqueue(this.start);
  }

  /**
   * Set the manager function
   * @param {function} manager
   */
  setManager(manager) {
    this.manager = manager;
  }

  /**
   * Require the manager from passed string, or as a class function
   * @param  {string|object} manager [description]
   * @return {any}
   */
  requireManager(manager) {
    let ret;

    // If manager is a string, try to load from imported managers
    if (typeof manager === "string" && manager === "default") {
      ret = managers_default;
    } else if (typeof manager === "string" && manager === "continuous") {
      ret = continuous;
    } else {
      // otherwise, assume we were passed a class function
      ret = manager;
    }
    return ret;
  }

  /**
   * Start the rendering
   */
  start() {
    // Parse metadata to get layout props
    const props = this.determineLayoutProperties();
    this.settings.layout = props.name;
    this.layout = new layout(props);
    this.layout.on(EVENTS.LAYOUT.UPDATED, (props, changed) => {
      this.emit(EVENTS.RENDITION.LAYOUT, props, changed);
    });
    if (this.manager === undefined) {
      const manager = this.requireManager(this.settings.manager);
      const options = {
        snap: this.settings.snap,
        view: this.settings.view,
        fullsize: this.settings.fullsize,
        ignoreClass: this.settings.ignoreClass,
        allowPopups: this.settings.allowPopups,
        allowScriptedContent: this.settings.allowScriptedContent,
        resizeOnOrientationChange: this.settings.resizeOnOrientationChange
      };
      this.manager = new manager(this.book, this.layout, options);
    }

    // Listen for displayed views
    this.manager.on(EVENTS.MANAGERS.ADDED, this.afterDisplayed.bind(this));
    this.manager.on(EVENTS.MANAGERS.REMOVED, this.afterRemoved.bind(this));

    // Listen for resizing
    this.manager.on(EVENTS.MANAGERS.RESIZED, this.onResized.bind(this));

    // Listen for rotation
    this.manager.on(EVENTS.MANAGERS.ORIENTATION_CHANGE, this.onOrientationChange.bind(this));

    // Listen for scroll changes
    this.manager.on(EVENTS.MANAGERS.SCROLLED, this.reportLocation.bind(this));

    /**
     * Emit that rendering has started
     * @event started
     * @memberof Rendition
     */
    this.emit(EVENTS.RENDITION.STARTED);

    // Start processing queue
    this.starting.resolve();
  }

  /**
   * Call to attach the container to an element in the dom
   * Container must be attached before rendering can begin
   * @param  {Element} element to attach to
   * @return {Promise}
   */
  attachTo(element) {
    return this.q.enqueue(() => {
      // Start rendering
      this.manager.render(element, {
        width: this.settings.width,
        height: this.settings.height
      });

      /**
       * Emit that rendering has attached to an element
       * @event attached
       * @memberof Rendition
       */
      this.emit(EVENTS.RENDITION.ATTACHED);
    });
  }

  /**
   * Display a point in the book
   * The request will be added to the rendering Queue,
   * so it will wait until book is opened, rendering started
   * and all other rendering tasks have finished to be called.
   * @param  {string} target Url or EpubCFI
   * @return {Promise}
   */
  display(target) {
    if (this.displaying) {
      this.displaying.resolve();
    }
    return this.q.enqueue(this._display, target);
  }

  /**
   * Tells the manager what to display immediately
   * @param  {string} target Url or EpubCFI
   * @return {Promise}
   * @private
   */
  _display(target) {
    if (!this.book) return;
    const displaying = new defer();
    const displayed = displaying.promise;
    this.displaying = displaying;

    // Check if this is a book percentage
    if (this.book.locations.length && isFloat(target)) {
      target = this.book.locations.cfiFromPercentage(parseFloat(target));
    }
    const section = this.book.sections.get(target);
    if (!section) {
      displaying.reject(new Error("No Section Found"));
      return displayed;
    }
    this.manager.display(section, target).then(() => {
      displaying.resolve(section);
      this.displaying = undefined;
      /**
       * Emit that a section has been displayed
       * @event displayed
       * @param {Section} section
       * @memberof Rendition
       */
      this.emit(EVENTS.RENDITION.DISPLAYED, section);
      this.reportLocation();
    }, err => {
      /**
       * Emit that has been an error displaying
       * @event displayError
       * @param {*} err
       * @memberof Rendition
       */
      this.emit(EVENTS.RENDITION.DISPLAY_ERROR, err);
    });
    return displayed;
  }

  /**
   * Report what section has been displayed
   * @param {object} view
   * @private
   */
  afterDisplayed(view) {
    view.on(EVENTS.VIEWS.MARK_CLICKED, (cfiRange, data) => {
      this.triggerMarkEvent(cfiRange, data, view.contents);
    });
    this.hooks.render.trigger(view, this).then(() => {
      if (view.contents) {
        this.hooks.content.trigger(view.contents, this).then(() => {
          /**
           * Emit that a section has been rendered
           * @event rendered
           * @param {View} view
           * @memberof Rendition
           */
          this.emit(EVENTS.RENDITION.RENDERED, view);
        });
      } else {
        this.emit(EVENTS.RENDITION.RENDERED, view);
      }
    });
  }

  /**
   * Report what has been removed
   * @param {object} view
   * @private
   */
  afterRemoved(view) {
    this.hooks.unloaded.trigger(view, this).then(() => {
      /**
       * Emit that a section has been removed
       * @event removed
       * @param {Section} section
       * @param {View} view
       * @memberof Rendition
       */
      this.emit(EVENTS.RENDITION.REMOVED, view.section, view);
    });
  }

  /**
   * Report resize events and display the last seen location
   * @param {object} size 
   * @param {string} [epubcfi]
   * @private
   */
  onResized(size, epubcfi) {
    /**
     * Emit that the rendition has been resized
     * @event resized
     * @param {number} width
     * @param {height} height
     * @param {string} [epubcfi]
     * @memberof Rendition
     */
    this.emit(EVENTS.RENDITION.RESIZED, {
      width: size.width,
      height: size.height
    }, epubcfi);
    if (this.location && this.location.start) {
      this.display(epubcfi || this.location.start.cfi);
    }
  }

  /**
   * Report orientation events and display the last seen location
   * @param {ScreenOrientation} orientation 
   * @private
   */
  onOrientationChange(orientation) {
    /**
     * Emit that the rendition has been rotated
     * @event orientationchange
     * @param {ScreenOrientation} orientation
     * @memberof Rendition
     */
    this.emit(EVENTS.RENDITION.ORIENTATION_CHANGE, orientation);
  }

  /**
   * Move the Rendition to a specific offset
   * Usually you would be better off calling display()
   * @param {object} offset
   */
  moveTo(offset) {
    this.manager.moveTo(offset);
  }

  /**
   * Trigger a resize of the views
   * @param {number} [width]
   * @param {number} [height]
   * @param {string} [epubcfi]
   */
  resize(width, height, epubcfi) {
    if (width) {
      this.settings.width = width;
    }
    if (height) {
      this.settings.height = height;
    }
    this.manager.resize(width, height, epubcfi);
  }

  /**
   * Clear all rendered views
   */
  clear() {
    this.manager.clear();
  }

  /**
   * Go to the next "page" in the rendition
   * @return {Promise}
   */
  next() {
    return this.q.enqueue(this.manager.next.bind(this.manager)).then(this.reportLocation.bind(this));
  }

  /**
   * Go to the previous "page" in the rendition
   * @return {Promise}
   */
  prev() {
    return this.q.enqueue(this.manager.prev.bind(this.manager)).then(this.reportLocation.bind(this));
  }

  /**
   * Determine the Layout properties from metadata and settings
   * @link http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
   * @return {object} Layout properties
   * @private
   */
  determineLayoutProperties() {
    const metadata = this.book.packaging.metadata;
    const direction = this.book.packaging.direction;
    return {
      name: this.settings.layout || metadata.get("layout") || "reflowable",
      flow: this.settings.flow || metadata.get("flow") || "paginated",
      spread: this.settings.spread || metadata.get("spread") || "auto",
      viewport: metadata.get("viewport") || "",
      direction: this.settings.direction || direction || "ltr",
      orientation: this.settings.orientation || metadata.get("orientation") || "auto",
      minSpreadWidth: this.settings.minSpreadWidth || 800
    };
  }

  /**
   * Layout configuration
   * @param {object} options
   */
  updateLayout(options) {
    this.layout.set(options);
    this.display(this.location.start.cfi);
  }

  /**
   * Report the current location
   * @fires relocated
   * @returns {Promise}
   */
  reportLocation() {
    const report = location => {
      const located = this.located(location);
      if (!located || !located.start || !located.end) {
        return;
      }
      this.location = located;
      /**
       * @event relocated
       * @type {displayedLocation}
       * @memberof Rendition
       */
      this.emit(EVENTS.RENDITION.RELOCATED, this.location);
    };
    const animate = () => {
      const location = this.manager.currentLocation();
      if (location && location.then && typeof location.then === "function") {
        location.then(result => report(result));
      } else if (location) {
        report(location);
      }
    };
    return this.q.enqueue(() => {
      requestAnimationFrame(animate.bind(this));
    });
  }

  /**
   * Get the Current Location object
   * @return {displayedLocation|Promise} location (may be a promise)
   */
  currentLocation() {
    const location = this.manager.currentLocation();
    if (location && location.then && typeof location.then === "function") {
      location.then(result => {
        return this.located(result);
      });
    } else if (location) {
      return this.located(location);
    }
  }

  /**
   * Creates a Rendition#locationRange from location
   * passed by the Manager
   * @param {object[]} location Location sections
   * @returns {displayedLocation}
   * @private
   */
  located(location) {
    if (location.length === 0) return {};
    const start = location[0];
    const end = location[location.length - 1];
    const located = {
      start: {
        href: start.href,
        index: start.index,
        cfi: start.mapping.start,
        displayed: {
          page: start.pages[0] || 1,
          total: start.totalPages
        }
      },
      end: {
        href: end.href,
        index: end.index,
        cfi: end.mapping.end,
        displayed: {
          page: end.pages[end.pages.length - 1] || 1,
          total: end.totalPages
        }
      }
    };
    const locationStart = this.book.locations.locationFromCfi(start.mapping.start);
    const locationEnd = this.book.locations.locationFromCfi(end.mapping.end);
    if (locationStart !== null) {
      located.start.location = locationStart;
      located.start.percentage = this.book.locations.percentageFromLocation(locationStart);
    }
    if (locationEnd !== null) {
      located.end.location = locationEnd;
      located.end.percentage = this.book.locations.percentageFromLocation(locationEnd);
    }
    const pageStart = this.book.pageList.pageFromCfi(start.mapping.start);
    const pageEnd = this.book.pageList.pageFromCfi(end.mapping.end);
    if (pageStart != -1) {
      located.start.page = pageStart;
    }
    if (pageEnd != -1) {
      located.end.page = pageEnd;
    }
    if (end.index === this.book.sections.last().index && located.end.displayed.page >= located.end.displayed.total) {
      located.atEnd = true;
    }
    if (start.index === this.book.sections.first().index && located.start.displayed.page === 1) {
      located.atStart = true;
    }
    return located;
  }

  /**
   * Remove and Clean Up the Rendition
   */
  destroy() {
    // Clear the queue
    // this.q.clear();
    // this.q = undefined;

    this.manager && this.manager.destroy();
    this.book = undefined;

    // this.views = null;
    // this.hooks.display.clear();
    // this.hooks.serialize.clear();
    // this.hooks.content.clear();
    // this.hooks.layout.clear();
    // this.hooks.render.clear();
    // this.hooks.show.clear();
    // this.hooks = {};
    // this.themes.destroy();
    // this.themes = undefined;
    // this.epubcfi = undefined;
    // this.starting = undefined;
    // this.started = undefined;
  }

  /**
   * Pass the events from a view's Contents
   * @param  {Contents} view contents
   * @private
   */
  passEvents(contents) {
    DOM_EVENTS.forEach(e => {
      contents.on(e, ev => this.triggerViewEvent(ev, contents));
    });
    contents.on(EVENTS.CONTENTS.SELECTED, e => this.triggerSelectedEvent(e, contents));
  }

  /**
   * Emit events passed by a view
   * @param  {event} e
   * @private
   */
  triggerViewEvent(e, contents) {
    this.emit(e.type, e, contents);
  }

  /**
   * Emit a selection event's CFI Range passed from a a view
   * @param  {string} cfirange
   * @private
   */
  triggerSelectedEvent(cfirange, contents) {
    /**
     * Emit that a text selection has occurred
     * @event selected
     * @param {string} cfirange
     * @param {Contents} contents
     * @memberof Rendition
     */
    this.emit(EVENTS.RENDITION.SELECTED, cfirange, contents);
  }

  /**
   * Emit a markClicked event with the cfiRange and data from a mark
   * @param  {EpubCFI} cfirange
   * @param {object} data 
   * @param {Contents} contents 
   * @private
   */
  triggerMarkEvent(cfiRange, data, contents) {
    /**
     * Emit that a mark was clicked
     * @event markClicked
     * @param {EpubCFI} cfiRange
     * @param {object} data
     * @param {Contents} contents
     * @memberof Rendition
     */
    this.emit(EVENTS.RENDITION.MARK_CLICKED, cfiRange, data, contents);
  }

  /**
   * Get a Range from a Visible CFI
   * @param  {string} epubcfi EpubCfi string
   * @param  {string} ignoreClass
   * @return {Range}
   */
  getRange(epubcfi, ignoreClass) {
    const cfi = new src_epubcfi(epubcfi);
    const found = this.manager.visible().filter(view => {
      if (cfi.spinePos === view.section.index) return true;
    });

    // Should only every return 1 item
    if (found.length) {
      return found[0].contents.range(cfi, ignoreClass);
    }
  }

  /**
   * Hook to adjust images to fit in columns
   * @param  {Contents} contents
   * @private
   */
  adjustImages(contents) {
    if (this.layout.name === "pre-paginated") {
      return new Promise(resolve => {
        resolve();
      });
    }
    const computed = contents.window.getComputedStyle(contents.content, null);
    const padding = {
      top: parseFloat(computed.paddingTop),
      bottom: parseFloat(computed.paddingBottom),
      left: parseFloat(computed.paddingLeft),
      right: parseFloat(computed.paddingRight)
    };
    const height = (contents.content.offsetHeight - (padding.top + padding.bottom)) * .95;
    const hPadding = padding.left + padding.right;
    const maxWidth = (this.layout.columnWidth ? this.layout.columnWidth - hPadding + "px" : "100%") + "!important";
    contents.addStylesheetRules({
      "img": {
        "max-width": maxWidth,
        "max-height": `${height}px !important`,
        "object-fit": "contain",
        "page-break-inside": "avoid",
        "break-inside": "avoid",
        "box-sizing": "border-box"
      },
      "svg": {
        "max-width": maxWidth,
        "max-height": `${height}px !important`,
        "page-break-inside": "avoid",
        "break-inside": "avoid"
      }
    });
    return new Promise((resolve, reject) => {
      // Wait to apply
      setTimeout(() => {
        resolve();
      }, 1);
    });
  }

  /**
   * Get the Contents object of each rendered view
   * @returns {object[]}
   */
  getContents() {
    return this.manager ? this.manager.getContents() : [];
  }

  /**
   * Get the views member from the manager
   * @returns {object[]}
   */
  views() {
    const views = this.manager ? this.manager.views : undefined;
    return views || [];
  }

  /**
   * Hook to handle link clicks in rendered content
   * @param {Contents} contents
   * @private
   */
  handleLinks(contents) {
    if (contents) {
      contents.on(EVENTS.CONTENTS.LINK_CLICKED, href => {
        const path = new utils_path(href);
        const relative = path.relative(path.directory, href);
        this.display(relative);
      });
    }
  }

  /**
   * Hook to handle injecting stylesheet before
   * a Section is serialized
   * @param {Document} doc
   * @param {Section} section
   * @private
   */
  injectStylesheet(doc, section) {
    const style = doc.createElement("link");
    style.setAttribute("type", "text/css");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", this.settings.stylesheet);
    doc.getElementsByTagName("head")[0].appendChild(style);
  }

  /**
   * Hook to handle injecting scripts before
   * a Section is serialized
   * @param {Document} doc
   * @param {Section} section
   * @private
   */
  injectScript(doc, section) {
    const script = doc.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", this.settings.script);
    script.textContent = " "; // Needed to prevent self closing tag
    doc.getElementsByTagName("head")[0].appendChild(script);
  }

  /**
   * Hook to handle the document identifier before
   * a Section is serialized
   * @param {document} doc
   * @private
   */
  injectIdentifier(doc) {
    const ident = this.book.packaging.metadata.get("identifier");
    const meta = doc.createElement("meta");
    meta.setAttribute("name", "dc.relation.ispartof");
    if (ident) meta.setAttribute("content", ident);
    doc.getElementsByTagName("head")[0].appendChild(meta);
  }
}
event_emitter_default()(Rendition.prototype);
/* harmony default export */ const rendition = (Rendition);
;// CONCATENATED MODULE: ./src/utils/request.js







// TODO: fallback for url if window isn't defined
const SUPPORTS_URL = window && window.URL ? true : false;
const BLOB_RESPONSE = SUPPORTS_URL ? "blob" : "arraybuffer";
const read = (e, def) => {
  const xhr = e.target;
  if (xhr.status === 403) {
    def.reject({
      message: "Forbidden",
      target: xhr,
      stack: new Error().stack
    });
  }
};
const load = (e, type, def) => {
  const xhr = e.target;
  let r;
  if (xhr.responseType === "document") {
    if (xhr.response === null && xhr.responseXML === null) {
      def.reject({
        message: "Empty Response",
        target: xhr,
        stack: new Error().stack
      });
    } else if (xhr.responseXML) {
      r = xhr.responseXML;
    } else if (isXml(type)) {
      r = parse(xhr.response, "text/xml");
    } else if (type === "xhtml") {
      r = parse(xhr.response, "application/xhtml+xml");
    } else if (type === "html" || type === "htm") {
      r = parse(xhr.response, "text/html");
    }
  } else if (xhr.responseType === "json") {
    r = JSON.parse(xhr.response);
  } else if (xhr.responseType === "blob") {
    if (SUPPORTS_URL) {
      r = xhr.response;
    } else {
      // Safari doesn't support responseType blob, 
      // so create a blob from arraybuffer
      r = new Blob([xhr.response]);
    }
  } else {
    r = xhr.response;
  }
  def.resolve(r);
};

/**
 * request
 * @param {string|ArrayBuffer} url 
 * @param {string} [type] 
 * @param {boolean} [withCredentials=false] 
 * @param {object[]} [headers=[]] 
 * @returns {Promise}
 */
const request = (url, type, withCredentials = false, headers = []) => {
  const def = new defer();
  const xhr = new XMLHttpRequest();
  type = type || new utils_path(url).extension;
  xhr.withCredentials = withCredentials;
  if (isXml(type)) {
    xhr.responseType = "document";
    xhr.overrideMimeType("text/xml"); // for OPF parsing
  } else if (type === "xhtml") {
    xhr.responseType = "document";
  } else if (type === "html" || type === "htm") {
    xhr.responseType = "document";
  } else if (type === "binary") {
    xhr.responseType = "arraybuffer";
  } else if (type === "blob") {
    xhr.responseType = BLOB_RESPONSE;
  } else if (type === "json") {
    xhr.responseType = "json";
    xhr.setRequestHeader("Accept", "application/json");
  }
  xhr.onreadystatechange = e => read(e, def);
  xhr.onload = e => load(e, type, def);
  xhr.onerror = e => {
    def.reject({
      message: "Error",
      target: e.target,
      stack: new Error().stack
    });
  };
  xhr.open("GET", url, true);
  for (const header in headers) {
    xhr.setRequestHeader(header, headers[header]);
  }
  xhr.send();
  return def.promise;
};
/* harmony default export */ const utils_request = (request);
// EXTERNAL MODULE: external "JSZip"
var external_JSZip_ = __webpack_require__(6838);
var external_JSZip_default = /*#__PURE__*/__webpack_require__.n(external_JSZip_);
;// CONCATENATED MODULE: ./src/archive.js










/**
 * Handles Unzipping a requesting files from an Epub Archive
 */
class Archive {
  constructor() {
    this.zip = undefined;
    this.urlCache = {};
    this.checkRequirements();
  }

  /**
   * Checks to see if JSZip exists in global namspace,
   * Requires JSZip if it isn't there
   * @private
   */
  checkRequirements() {
    if ((external_JSZip_default())) {
      this.zip = new (external_JSZip_default())();
    } else {
      throw new Error("JSZip lib not loaded");
    }
  }

  /**
   * Open an archive
   * @param {binary} input
   * @param {boolean} [isBase64] tells JSZip if the input data is base64 encoded
   * @return {Promise} zipfile
   */
  open(input, isBase64) {
    return this.zip.loadAsync(input, {
      base64: isBase64
    });
  }

  /**
   * Load and Open an archive
   * @param {string} zipUrl
   * @param {boolean} [isBase64] tells JSZip if the input data is base64 encoded
   * @return {Promise} zipfile
   */
  async openUrl(zipUrl, isBase64) {
    return utils_request(zipUrl, "binary").then(data => {
      return this.zip.loadAsync(data, {
        base64: isBase64
      });
    });
  }

  /**
   * Request a url from the archive
   * @param {string} url  a url to request from the archive
   * @param {string} [type] specify the type of the returned result
   * @return {Promise<Blob|string|JSON|Document|XMLDocument>}
   */
  request(url, type) {
    const deferred = new defer();
    const path = new utils_path(url);

    // If type isn't set, determine it from the file extension
    if (!type) {
      type = path.extension;
    }
    let response;
    if (type == "blob") {
      response = this.getBlob(url);
    } else {
      response = this.getText(url);
    }
    if (response) {
      response.then(r => {
        const result = this.handleResponse(r, type);
        deferred.resolve(result);
      });
    } else {
      deferred.reject({
        message: "File not found in the epub: " + url,
        stack: new Error().stack
      });
    }
    return deferred.promise;
  }

  /**
   * Handle the response from request
   * @param {any} response
   * @param {string} [type]
   * @return {any} the parsed result
   * @private
   */
  handleResponse(response, type) {
    let r;
    if (isXml(type)) {
      r = parse(response, "text/xml");
    } else if (type === "xhtml") {
      r = parse(response, "application/xhtml+xml");
    } else if (type == "html" || type == "htm") {
      r = parse(response, "text/html");
    } else if (type === "json") {
      r = JSON.parse(response);
    } else {
      r = response;
    }
    return r;
  }

  /**
   * Get a Blob from Archive by Url
   * @param {string} url
   * @param {string} [mimeType]
   * @return {Blob}
   */
  getBlob(url, mimeType) {
    const encodedUri = url.substring(1); // Remove first slash
    const decodededUri = window.decodeURIComponent(encodedUri);
    const entry = this.zip.file(decodededUri);
    if (entry) {
      mimeType = mimeType || mime.lookup(entry.name);
      return entry.async("uint8array").then(uint8array => {
        return new Blob([uint8array], {
          type: mimeType
        });
      });
    }
  }

  /**
   * Get Text from Archive by Url
   * @param {string} url
   * @return {string}
   */
  getText(url) {
    const encodedUri = url.substring(1); // Remove first slash
    const decodededUri = window.decodeURIComponent(encodedUri);
    const entry = this.zip.file(decodededUri);
    if (entry) {
      return entry.async("string").then(text => {
        return text;
      });
    }
  }

  /**
   * Get a base64 encoded result from Archive by Url
   * @param {string} url
   * @param {string} [mimeType]
   * @return {string} base64 encoded
   */
  getBase64(url, mimeType) {
    const encodedUri = url.substring(1); // Remove first slash
    const decodededUri = window.decodeURIComponent(encodedUri);
    const entry = this.zip.file(decodededUri);
    if (entry) {
      mimeType = mimeType || mime.lookup(entry.name);
      return entry.async("base64").then(data => {
        return "data:" + mimeType + ";base64," + data;
      });
    }
  }

  /**
   * Create a Url from an unarchived item
   * @param {string} url
   * @param {object} [options] 
   * @param {object} [options.base64] use base64 encoding or blob url
   * @return {Promise} url promise with Url string
   */
  createUrl(url, options) {
    const deferred = new defer();
    const _URL = window.URL || window.webkitURL || window.mozURL;
    const base64 = options && options.base64;
    if (url in this.urlCache) {
      deferred.resolve(this.urlCache[url]);
      return deferred.promise;
    }
    let response;
    if (base64 && (response = this.getBase64(url))) {
      response.then(tempUrl => {
        this.urlCache[url] = tempUrl;
        deferred.resolve(tempUrl);
      });
    } else if (response = this.getBlob(url)) {
      response.then(blob => {
        const tempUrl = _URL.createObjectURL(blob);
        this.urlCache[url] = tempUrl;
        deferred.resolve(tempUrl);
      });
    }
    if (typeof response === "undefined") {
      deferred.reject({
        message: "File not found in the epub: " + url,
        stack: new Error().stack
      });
    }
    return deferred.promise;
  }

  /**
   * Revoke Temp Url for a archive item
   * @param {string} url url of the item in the archive
   */
  revokeUrl(url) {
    const _URL = window.URL || window.webkitURL || window.mozURL;
    const fromCache = this.urlCache[url];
    if (fromCache) _URL.revokeObjectURL(fromCache);
  }

  /**
   * destroy
   */
  destroy() {
    const _URL = window.URL || window.webkitURL || window.mozURL;
    for (const fromCache in this.urlCache) {
      _URL.revokeObjectURL(fromCache);
    }
    this.zip = undefined;
    this.urlCache = {};
  }
}
/* harmony default export */ const archive = (Archive);
// EXTERNAL MODULE: external "localforage"
var external_localforage_ = __webpack_require__(6361);
var external_localforage_default = /*#__PURE__*/__webpack_require__.n(external_localforage_);
;// CONCATENATED MODULE: ./src/storage.js









const storage_URL = window.URL || window.webkitURL || window.mozURL;

/**
 * Handles saving and requesting files from local storage
 */
class Storage {
  /**
   * Constructor
   * @param {string} name This should be the name of the application for modals
   * @param {method} request
   * @param {method} resolve
   */
  constructor(name, request, resolve) {
    this.name = name;
    this.request = request;
    this.resolve = resolve;
    /**
     * @member {LocalForage} instance
     * @memberof Storage
     * @readonly
     */
    this.instance = undefined;
    /**
     * @member {object} urlCache
     * @memberof Storage
     * @readonly
     */
    this.urlCache = {};
    /**
     * @member {boolean} online Current status
     * @memberof Storage
     * @readonly
     */
    this.online = true;
    this.checkRequirements();
    this.appendListeners();
  }

  /**
   * Checks to see if LocalForage exists in global namspace
   * @private
   */
  checkRequirements() {
    if ((external_localforage_default())) {
      this.instance = external_localforage_default().createInstance({
        name: this.name
      });
    } else {
      throw new TypeError("LocalForage lib not loaded");
    }
  }

  /**
   * Append online and offline event listeners
   * @private
   */
  appendListeners() {
    window.addEventListener("online", this.status.bind(this));
    window.addEventListener("offline", this.status.bind(this));
  }

  /**
   * Remove online and offline event listeners
   * @private
   */
  removeListeners() {
    window.removeEventListener("online", this.status.bind(this));
    window.removeEventListener("offline", this.status.bind(this));
  }

  /**
   * Update the online / offline status
   * @param {Event} event 
   * @private
   */
  status(event) {
    this.online = event.type === "online";
    if (this.online) {
      this.emit("online");
    } else {
      this.emit("offline");
    }
  }

  /**
   * Add all of a book manifest to the storage
   * @param {Manifest} manifest  book manifest
   * @param {boolean} [force=false] force resaving manifest
   * @return {Promise<object>} store objects
   */
  add(manifest, force = false) {
    const items = manifest.values().toArray();
    const mapped = items.map(async item => {
      const {
        href
      } = item;
      const url = this.resolve(href);
      const encodedUrl = window.encodeURIComponent(url);
      return await this.instance.getItem(encodedUrl).then(item => {
        if (!item || force) {
          return this.request(url, "binary").then(data => {
            return this.instance.setItem(encodedUrl, data);
          });
        } else {
          return item;
        }
      });
    });
    return Promise.all(mapped);
  }

  /**
   * Put binary data from a url to storage
   * @param {string} url  a url to request from storage
   * @param {boolean} [withCredentials]
   * @param {object} [headers]
   * @return {Promise<Blob>}
   */
  async put(url, withCredentials, headers) {
    const encodedUrl = window.encodeURIComponent(url);
    return await this.instance.getItem(encodedUrl).then(result => {
      if (!result) {
        return this.request(url, "binary", withCredentials, headers).then(data => {
          return this.instance.setItem(encodedUrl, data);
        });
      }
      return result;
    });
  }

  /**
   * Dispatch request by url
   * @param {string} url a url to request from storage
   * @param {string} [type] specify the type of the returned result
   * @param {boolean} [withCredentials]
   * @param {Array} [headers]
   * @return {Promise<Blob|string|JSON|Document|XMLDocument>}
   */
  async dispatch(url, type, withCredentials, headers) {
    if (this.online) {
      // From network
      return this.request(url, type, withCredentials, headers).then(async data => {
        // save to store if not present
        await this.put(url);
        return data;
      });
    } else {
      // From storage
      return this.retrieve(url, type);
    }
  }

  /**
   * Request a url from storage
   * @param {string} url a url to request from storage
   * @param {string} [type] specify the type of the returned result
   * @return {Promise<Blob|string|JSON|Document|XMLDocument>}
   */
  async retrieve(url, type) {
    const path = new utils_path(url);

    // If type isn't set, determine it from the file extension
    if (!type) {
      type = path.extension;
    }
    let response;
    if (type === "blob") {
      response = this.getBlob(url);
    } else {
      response = this.getText(url);
    }
    return response.then(r => {
      const deferred = new defer();
      if (r) {
        const result = this.handleResponse(r, type);
        deferred.resolve(result);
      } else {
        deferred.reject({
          message: "File not found in storage: " + url,
          stack: new Error().stack
        });
      }
      return deferred.promise;
    });
  }

  /**
   * Handle the response from request
   * @param {any} response
   * @param {string} [type]
   * @return {any} the parsed result
   * @private
   */
  handleResponse(response, type) {
    let r;
    if (isXml(type)) {
      r = parse(response, "text/xml");
    } else if (type === "xhtml") {
      r = parse(response, "application/xhtml+xml");
    } else if (type === "html" || type === "htm") {
      r = parse(response, "text/html");
    } else if (type === "json") {
      r = JSON.parse(response);
    } else {
      r = response;
    }
    return r;
  }

  /**
   * Get a Blob from Storage by Url
   * @param {string} url
   * @param {string} [mimeType]
   * @return {Blob}
   */
  getBlob(url, mimeType) {
    const encodedUrl = window.encodeURIComponent(url);
    mimeType = mimeType || mime.lookup(url);
    return this.instance.getItem(encodedUrl).then(uint8array => {
      if (!uint8array) return;
      return new Blob([uint8array], {
        type: mimeType
      });
    });
  }

  /**
   * Get Text from Storage by Url
   * @param {string} url
   * @param {string} [mimeType]
   * @return {string}
   */
  getText(url, mimeType) {
    const encodedUrl = window.encodeURIComponent(url);
    mimeType = mimeType || mime.lookup(url);
    return this.instance.getItem(encodedUrl).then(function (uint8array) {
      if (!uint8array) return;
      const deferred = new defer();
      const reader = new FileReader();
      const blob = new Blob([uint8array], {
        type: mimeType
      });
      reader.onloadend = () => {
        deferred.resolve(reader.result);
      };
      reader.readAsText(blob, mimeType);
      return deferred.promise;
    });
  }

  /**
   * Get a base64 encoded result from Storage by Url
   * @param {string} url
   * @param {string} [mimeType]
   * @return {string} base64 encoded
   */
  getBase64(url, mimeType) {
    let encodedUrl = window.encodeURIComponent(url);
    mimeType = mimeType || mime.lookup(url);
    return this.instance.getItem(encodedUrl).then(uint8array => {
      if (!uint8array) return;
      const deferred = new defer();
      const reader = new FileReader();
      const blob = new Blob([uint8array], {
        type: mimeType
      });
      reader.onloadend = () => {
        deferred.resolve(reader.result);
      };
      reader.readAsDataURL(blob, mimeType);
      return deferred.promise;
    });
  }

  /**
   * Create a Url from a stored item
   * @param {string} url
   * @param {object} [options.base64] use base64 encoding or blob url
   * @return {Promise} url promise with Url string
   */
  createUrl(url, options) {
    const deferred = new defer();
    if (url in this.urlCache) {
      deferred.resolve(this.urlCache[url]);
      return deferred.promise;
    }
    let response;
    if (options && options.base64) {
      response = this.getBase64(url);
      if (response) {
        response.then(tempUrl => {
          this.urlCache[url] = tempUrl;
          deferred.resolve(tempUrl);
        });
      }
    } else {
      response = this.getBlob(url);
      if (response) {
        response.then(blob => {
          const tempUrl = storage_URL.createObjectURL(blob);
          this.urlCache[url] = tempUrl;
          deferred.resolve(tempUrl);
        });
      }
    }
    if (!response) {
      deferred.reject({
        message: "File not found in storage: " + url,
        stack: new Error().stack
      });
    }
    return deferred.promise;
  }

  /**
   * Revoke Temp Url for a archive item
   * @param {string} url url of the item in the store
   */
  revokeUrl(url) {
    const fromCache = this.urlCache[url];
    if (fromCache) {
      storage_URL.revokeObjectURL(fromCache);
    }
  }

  /**
   * destroy
   */
  destroy() {
    for (const fromCache in this.urlCache) {
      storage_URL.revokeObjectURL(fromCache);
    }
    this.urlCache = {};
    this.removeListeners();
  }
}
event_emitter_default()(Storage.prototype);
/* harmony default export */ const storage = (Storage);
;// CONCATENATED MODULE: ./src/section.js






/**
 * Represents a Section of the Book
 * In most books this is equivalent to a Chapter
 */
class Section {
  /**
   * Constructor
   * @param {object} item 
   * @param {object} hooks 
   */
  constructor(item, hooks) {
    /**
     * @member {string} idref
     * @memberof Section
     * @readonly
     */
    this.idref = item.idref;
    /**
     * @member {boolean} linear
     * @memberof Section
     * @readonly
     */
    this.linear = item.linear === "yes";
    /**
     * @member {number} index
     * @memberof Section
     * @readonly
     */
    this.index = item.index;
    /**
     * @member {string} href
     * @memberof Section
     * @readonly
     */
    this.href = item.href;
    /**
     * @member {string} url
     * @memberof Section
     * @readonly
     */
    this.url = item.url;
    /**
     * @member {string} canonical
     * @memberof Section
     * @readonly
     */
    this.canonical = item.canonical;
    /**
     * @member {string} cfiBase
     * @memberof Section
     * @readonly
     */
    this.cfiBase = item.cfiBase;
    /**
     * @member {function} next
     * @memberof Section
     * @readonly
     */
    this.next = item.next;
    /**
     * @member {function} prev
     * @memberof Section
     * @readonly
     */
    this.prev = item.prev;
    /**
     * @member {object[]} properties
     * @memberof Section
     * @readonly
     */
    this.properties = item.properties;
    this.hooks = hooks;
    this.document = undefined;
    this.contents = undefined;
    this.output = undefined;
  }

  /**
   * Load the section from its url
   * @param {function} request a request method to use for loading
   * @return {Promise} a promise with the xml document
   */
  load(request) {
    const loading = new defer();
    const loaded = loading.promise;
    if (this.contents) {
      loading.resolve(this.contents);
    } else {
      request(this.url).then(xml => {
        this.document = xml;
        this.contents = xml.documentElement;
        return this.hooks.content.trigger(this.document, this);
      }).then(() => {
        loading.resolve(this.contents);
      }).catch(error => {
        loading.reject(error);
      });
    }
    return loaded;
  }

  /**
   * Adds a base tag for resolving urls in the section (unused)
   * @private
   */
  base() {
    return replaceBase(this.document, this);
  }

  /**
   * Render the contents of a section
   * @param {function} request a request method to use for loading
   * @return {Promise} output a serialized XML Document
   */
  render(request) {
    const rendering = new defer();
    const rendered = rendering.promise;
    this.output; // TODO: better way to return this from hooks?
    this.load(request).then(contents => {
      const serializer = new XMLSerializer();
      this.output = serializer.serializeToString(contents);
      return this.output;
    }).then(() => {
      return this.hooks.serialize.trigger(this.output, this);
    }).then(() => {
      rendering.resolve(this.output);
    }).catch(error => {
      rendering.reject(error);
    });
    return rendered;
  }

  /**
   * Find a string in a section
   * @param {string} query The query string to find
   * @return {object[]} A list of matches, with form {cfi, excerpt}
   */
  find(query) {
    const section = this;
    const matches = [];
    const q = query.toLowerCase();
    const find = node => {
      const text = node.textContent.toLowerCase();
      const limit = 150;
      let pos,
        last = -1;
      while (pos !== -1) {
        // Search for the query
        pos = text.indexOf(q, last + 1);
        if (pos !== -1) {
          // We found it! Generate a CFI
          const range = section.document.createRange();
          range.setStart(node, pos);
          range.setEnd(node, pos + q.length);
          const cfi = section.cfiFromRange(range);
          let excerpt;
          // Generate the excerpt
          if (node.textContent.length < limit) {
            excerpt = node.textContent;
          } else {
            excerpt = node.textContent.substring(pos - limit / 2, pos + limit / 2);
            excerpt = "..." + excerpt + "...";
          }

          // Add the CFI to the matches list
          matches.push({
            cfi: cfi,
            excerpt: excerpt
          });
        }
        last = pos;
      }
    };
    sprint(section.document, node => find(node));
    return matches;
  }

  /**
   * Search a string in multiple sequential Element of the section.
   * If the document.createTreeWalker api is missed(eg: IE8), use 
   * `find` as a fallback.
   * @param {string} query The query string to search
   * @param {number} [maxSeqEle=5] The maximum number of Element that are combined for search, default value is 5.
   * @return {object[]} A list of matches, with form {cfi, excerpt}
   */
  search(query, maxSeqEle = 5) {
    if (typeof document.createTreeWalker == "undefined") {
      return this.find(query);
    }
    const matches = [];
    const excerptLimit = 150;
    const section = this;
    const q = query.toLowerCase();
    const search = nodeList => {
      const textWithCase = nodeList.reduce((acc, current) => {
        return acc + current.textContent;
      }, "");
      const text = textWithCase.toLowerCase();
      const pos = text.indexOf(q);
      if (pos !== -1) {
        const startNodeIndex = 0,
          endPos = pos + q.length;
        let endNodeIndex = 0,
          len = 0;
        if (pos < nodeList[startNodeIndex].length) {
          while (endNodeIndex < nodeList.length - 1) {
            len += nodeList[endNodeIndex].length;
            if (endPos <= len) {
              break;
            }
            endNodeIndex += 1;
          }
          const startNode = nodeList[startNodeIndex];
          const endNode = nodeList[endNodeIndex];
          const range = section.document.createRange();
          range.setStart(startNode, pos);
          const beforeEndLengthCount = nodeList.slice(0, endNodeIndex).reduce((acc, current) => {
            return acc + current.textContent.length;
          }, 0);
          range.setEnd(endNode, beforeEndLengthCount > endPos ? endPos : endPos - beforeEndLengthCount);
          const cfi = section.cfiFromRange(range);
          let excerpt = nodeList.slice(0, endNodeIndex + 1).reduce((acc, current) => {
            return acc + current.textContent;
          }, "");
          if (excerpt.length > excerptLimit) {
            excerpt = excerpt.substring(pos - excerptLimit / 2, pos + excerptLimit / 2);
            excerpt = "..." + excerpt + "...";
          }
          matches.push({
            cfi: cfi,
            excerpt: excerpt
          });
        }
      }
    };
    const treeWalker = document.createTreeWalker(section.document, NodeFilter.SHOW_TEXT, null, false);
    let node,
      nodeList = [];
    while (node = treeWalker.nextNode()) {
      nodeList.push(node);
      if (nodeList.length == maxSeqEle) {
        search(nodeList.slice(0, maxSeqEle));
        nodeList = nodeList.slice(1, maxSeqEle);
      }
    }
    if (nodeList.length > 0) {
      search(nodeList);
    }
    return matches;
  }

  /**
  * Reconciles the current chapters layout properties with
  * the global layout properties.
  * @param {object} globalLayout The global layout settings object, chapter properties string
  * @return {object} layoutProperties Object with layout properties
  */
  reconcileLayoutSettings(globalLayout) {
    //-- Get the global defaults
    const settings = {
      layout: globalLayout.layout,
      spread: globalLayout.spread,
      orientation: globalLayout.orientation
    };

    //-- Get the chapter's display type
    this.properties.forEach(prop => {
      const rendition = prop.replace("rendition:", "");
      const split = rendition.indexOf("-");
      if (split !== -1) {
        const property = rendition.slice(0, split);
        const value = rendition.slice(split + 1);
        settings[property] = value;
      }
    });
    return settings;
  }

  /**
   * Get a CFI from a Range in the Section
   * @param {range} range
   * @return {string} cfi an EpubCFI string
   */
  cfiFromRange(range) {
    return new src_epubcfi(range, this.cfiBase).toString();
  }

  /**
   * Get a CFI from an Element in the Section
   * @param {element} el
   * @return {string} cfi an EpubCFI string
   */
  cfiFromElement(el) {
    return new src_epubcfi(el, this.cfiBase).toString();
  }

  /**
   * Unload the section document
   */
  unload() {
    this.document = undefined;
    this.contents = undefined;
    this.output = undefined;
  }

  /**
   * destroy
   */
  destroy() {
    this.unload();
    this.hooks.serialize.clear();
    this.hooks.content.clear();
    this.hooks = undefined;
    this.idref = undefined;
    this.linear = undefined;
    this.properties = undefined;
    this.index = undefined;
    this.href = undefined;
    this.url = undefined;
    this.next = undefined;
    this.prev = undefined;
    this.cfiBase = undefined;
  }
}
/* harmony default export */ const src_section = (Section);
;// CONCATENATED MODULE: ./src/sections.js






/**
 * Sections class
 */
class Sections {
  constructor() {
    this.spineItems = [];
    this.spineByHref = {};
    this.spineById = {};
    /**
     * @member {object} hooks
     * @property {Hook} content
     * @property {Hook} serialize
     * @memberof Spine
     * @readonly
     */
    this.hooks = {
      content: new hook(),
      serialize: new hook()
    };
    // Register replacements
    this.hooks.content.register(replaceBase);
    this.hooks.content.register(replaceMeta);
    this.hooks.content.register(replaceCanonical);
    this.epubcfi = new src_epubcfi();
    /**
     * @member {boolean} loaded
     * @memberof Spine
     * @readonly
     */
    this.loaded = false;
  }

  /**
   * Get an item from the spine
   * @param {string|number} [target]
   * @return {Section|null} section
   * @example sections.get();
   * @example sections.get(1);
   * @example sections.get("chap1.html");
   * @example sections.get("#id1234");
   */
  get(target) {
    let index = 0;
    if (typeof target === "undefined") {
      while (index < this.spineItems.length) {
        let next = this.spineItems[index];
        if (next && next.linear) {
          break;
        }
        index += 1;
      }
    } else if (this.epubcfi.isCfiString(target)) {
      let cfi = new src_epubcfi(target);
      index = cfi.spinePos;
    } else if (typeof target === "number" || isNaN(target) === false) {
      index = target;
    } else if (typeof target === "string" && target.indexOf("#") === 0) {
      index = this.spineById[target.substring(1)];
    } else if (typeof target === "string") {
      // Remove fragments
      target = target.split("#")[0];
      index = this.spineByHref[target] || this.spineByHref[encodeURI(target)];
    }
    return this.spineItems[index] || null;
  }

  /**
   * Find the first Section in the Spine
   * @return {Section} first section
   */
  first() {
    let index = 0;
    do {
      const next = this.get(index);
      if (next && next.linear) {
        return next;
      }
      index += 1;
    } while (index < this.spineItems.length);
  }

  /**
   * Find the last Section in the Spine
   * @return {Section} last section
   */
  last() {
    let index = this.spineItems.length - 1;
    do {
      const prev = this.get(index);
      if (prev && prev.linear) {
        return prev;
      }
      index -= 1;
    } while (index >= 0);
  }

  /**
   * Append a Section to the Spine
   * @param {Section} section
   * @returns {number} index
   * @private
   */
  append(section) {
    const index = this.spineItems.length;
    section.index = index;
    this.spineItems.push(section);

    // Encode and Decode href lookups
    // see pr for details: https://github.com/futurepress/epub.js/pull/358
    this.spineByHref[decodeURI(section.href)] = index;
    this.spineByHref[encodeURI(section.href)] = index;
    this.spineByHref[section.href] = index;
    this.spineById[section.idref] = index;
    return index;
  }

  /**
   * Prepend a Section to the Spine (unused)
   * @param {Section} section
   * @returns {number}
   * @private
   */
  prepend(section) {
    // var index = this.spineItems.unshift(section);
    this.spineByHref[section.href] = 0;
    this.spineById[section.idref] = 0;

    // Re-index
    this.spineItems.forEach((item, index) => {
      item.index = index;
    });
    return 0;
  }

  /**
   * Remove a Section from the Spine (unused)
   * @param {Section} section
   * @private
   */
  remove(section) {
    const index = this.spineItems.indexOf(section);
    if (index > -1) {
      delete this.spineByHref[section.href];
      delete this.spineById[section.idref];
      return this.spineItems.splice(index, 1);
    }
  }

  /**
   * Unpack items from a opf into spine items
   * @param {Packaging} packaging
   * @param {method} resolve URL resolve
   * @param {method} canonical Resolve canonical url
   */
  unpack(packaging, resolve, canonical) {
    const manifest = packaging.manifest;
    const spine = packaging.spine;
    spine.forEach((item, key) => {
      const manifestItem = manifest.get(key);
      item.cfiBase = this.epubcfi.generateChapterComponent(spine.nodeIndex, item.index, item.id);
      if (manifestItem) {
        item.href = manifestItem.href;
        item.url = resolve(item.href, true);
        item.canonical = canonical(item.href);
        if (manifestItem.properties.length) {
          item.properties.push.apply(item.properties, manifestItem.properties);
        }
      }
      if (item.linear === "yes") {
        item.prev = () => {
          let prevIndex = item.index;
          while (prevIndex > 0) {
            let prev = this.get(prevIndex - 1);
            if (prev && prev.linear) {
              return prev;
            }
            prevIndex -= 1;
          }
          return null;
        };
        item.next = () => {
          let nextIndex = item.index;
          while (nextIndex < this.spineItems.length - 1) {
            let next = this.get(nextIndex + 1);
            if (next && next.linear) {
              return next;
            }
            nextIndex += 1;
          }
          return null;
        };
      } else {
        item.prev = () => {
          return null;
        };
        item.next = () => {
          return null;
        };
      }
      const section = new src_section(item, this.hooks);
      this.append(section);
    });
    this.loaded = true;
  }

  /**
   * Loop over the Sections in the Spine
   * @return {method} forEach
   */
  each() {
    return this.spineItems.forEach.apply(this.spineItems, arguments);
  }
  destroy() {
    this.each(section => section.destroy());
    this.spineItems = undefined;
    this.spineByHref = undefined;
    this.spineById = undefined;
    this.hooks.serialize.clear();
    this.hooks.content.clear();
    this.hooks = undefined;
    this.epubcfi = undefined;
    this.loaded = false;
  }
}
/* harmony default export */ const sections = (Sections);
;// CONCATENATED MODULE: ./src/book.js





















const CONTAINER_PATH = "META-INF/container.xml";
const INPUT_TYPE = {
  BINARY: "binary",
  BASE64: "base64",
  EPUB: "epub",
  OPF: "opf",
  MANIFEST: "json",
  DIRECTORY: "directory"
};

/**
 * An Epub representation with methods for the loading, parsing and manipulation
 * of its contents.
 * @class
 * @param {string} [url]
 * @param {object} [options]
 * @param {object} [options.request] object options to xhr request
 * @param {method} [options.request.method=null] a request function to use instead of the default
 * @param {boolean} [options.request.withCredentials=false] send the xhr request withCredentials
 * @param {object} [options.request.headers=[]] send the xhr request headers
 * @param {string} [options.encoding='binary'] optional to pass 'binary' or 'base64' for archived Epubs
 * @param {string} [options.replacements='none'] use base64, blobUrl, or none for replacing assets in archived Epubs
 * @param {method} [options.canonical] optional function to determine canonical urls for a path
 * @param {string} [options.openAs] optional string to determine the input type
 * @param {string} [options.store] cache the contents in local storage, value should be the name of the reader
 * @returns {Book}
 * @example new Book("/path/to/book.epub", {})
 * @example new Book({ replacements: "blobUrl" })
 */
class Book {
  constructor(url, options) {
    // Allow passing just options to the Book
    if (typeof options === "undefined" && typeof url !== "string" && url instanceof Blob === false && url instanceof ArrayBuffer === false) {
      options = url;
      url = undefined;
    }
    this.settings = extend({
      request: {
        method: null,
        withCredentials: false,
        headers: []
      },
      encoding: undefined,
      replacements: undefined,
      canonical: undefined,
      openAs: undefined,
      store: undefined
    }, options || {});
    this.opening = new defer(); // Promises
    /**
     * @member {promise} opened returns after the book is loaded
     * @memberof Book
     * @readonly
     */
    this.opened = this.opening.promise;
    /**
     * @member {boolean} isOpen
     * @memberof Book
     * @readonly
     */
    this.isOpen = false;
    this.loading = {
      cover: new defer(),
      spine: new defer(),
      manifest: new defer(),
      metadata: new defer(),
      pageList: new defer(),
      resources: new defer(),
      navigation: new defer()
    };
    this.loaded = {
      cover: this.loading.cover.promise,
      spine: this.loading.spine.promise,
      manifest: this.loading.manifest.promise,
      metadata: this.loading.metadata.promise,
      pageList: this.loading.pageList.promise,
      resources: this.loading.resources.promise,
      navigation: this.loading.navigation.promise
    };
    /**
     * @member {promise} ready returns after the book is loaded and parsed
     * @memberof Book
     * @readonly
     */
    this.ready = Promise.all([this.loaded.manifest, this.loaded.spine, this.loaded.metadata, this.loaded.cover, this.loaded.navigation, this.loaded.resources]);
    /**
     * Queue for methods used before opening
     * @member {boolean} isRendered
     * @memberof Book
     * @readonly
     */
    this.isRendered = false;
    /**
     * @member {method} request
     * @memberof Book
     * @readonly
     */
    this.request = this.settings.request.method || utils_request;
    /**
     * @member {Navigation} navigation
     * @memberof Book
     * @readonly
     */
    this.navigation = undefined;
    /**
     * @member {PageList} pagelist
     * @memberof Book
     * @readonly
     */
    this.pageList = undefined;
    /**
     * @member {Url} url
     * @memberof Book
     * @readonly
     */
    this.url = undefined;
    /**
     * @member {Path} path
     * @memberof Book
     * @readonly
     */
    this.path = undefined;
    /**
     * @member {boolean} archived
     * @memberof Book
     * @readonly
     */
    this.archived = false;
    /**
     * @member {Archive} archive
     * @memberof Book
     * @private
     */
    this.archive = undefined;
    /**
     * @member {Storage} storage
     * @memberof Book
     * @readonly
     */
    this.storage = undefined;
    /**
     * @member {Resources} resources
     * @memberof Book
     * @readonly
     */
    this.resources = undefined;
    /**
     * @member {Rendition} rendition
     * @memberof Book
     * @readonly
     */
    this.rendition = undefined;
    /**
     * @member {Container} container
     * @memberof Book
     * @readonly
     */
    this.container = undefined;
    /**
     * @member {Packaging} packaging
     * @memberof Book
     * @readonly
     */
    this.packaging = new packaging();
    /**
     * @member {Sections} sections
     * @memberof Book
     * @readonly
     */
    this.sections = new sections();
    /**
     * @member {Locations} locations
     * @memberof Book
     * @readonly
     */
    this.locations = new locations(this.sections, this.load.bind(this));

    // this.toc = undefined;
    if (this.settings.store) {
      this.store(this.settings.store);
    }
    if (url) {
      this.open(url, this.settings.openAs).catch(error => {
        /**
         * @event openFailed
         * @param {object} error
         * @memberof Book
         */
        this.emit(EVENTS.BOOK.OPEN_FAILED, error);
      });
    }
  }

  /**
   * Open a epub or url
   * @param {string|ArrayBuffer} input Url, Path or ArrayBuffer
   * @param {string} [what='binary', 'base64', 'epub', 'opf', 'json', 'directory'] force opening as a certain type
   * @returns {Promise} of when the book has been loaded
   * @example book.open("/path/to/book/")
   * @example book.open("/path/to/book/OPS/package.opf")
   * @example book.open("/path/to/book.epub")
   * @example book.open("https://example.com/book/")
   * @example book.open("https://example.com/book/OPS/package.opf")
   * @example book.open("https://example.com/book.epub")
   */
  open(input, what) {
    let opening;
    const type = what || this.determineType(input);
    if (type === INPUT_TYPE.BINARY) {
      this.archived = true;
      this.url = new utils_url("/", "");
      opening = this.openEpub(input);
    } else if (type === INPUT_TYPE.BASE64) {
      this.archived = true;
      this.url = new utils_url("/", "");
      opening = this.openEpub(input, type);
    } else if (type === INPUT_TYPE.EPUB) {
      this.archived = true;
      this.url = new utils_url("/", "");
      opening = this.request(input, "binary", this.settings.request.withCredentials, this.settings.request.headers).then(this.openEpub.bind(this));
    } else if (type == INPUT_TYPE.OPF) {
      this.url = new utils_url(input);
      opening = this.openPackaging(this.url.path.toString());
    } else if (type == INPUT_TYPE.MANIFEST) {
      this.url = new utils_url(input);
      opening = this.openManifest(this.url.path.toString());
    } else {
      this.url = new utils_url(input);
      opening = this.openContainer(CONTAINER_PATH).then(this.openPackaging.bind(this));
    }
    return opening;
  }

  /**
   * Open an archived epub
   * @param {binary} data
   * @param {string} [encoding]
   * @returns {Promise}
   * @private
   */
  async openEpub(data, encoding) {
    encoding = encoding || this.settings.encoding;
    return this.unarchive(data, encoding).then(() => {
      return this.openContainer(CONTAINER_PATH);
    }).then(packagePath => {
      return this.openPackaging(packagePath);
    });
  }

  /**
   * Open the epub container
   * @param {string} url
   * @returns {Promise}
   * @private
   */
  async openContainer(url) {
    return this.load(url).then(xml => {
      this.container = new container(xml);
      return this.resolve(this.container.fullPath);
    });
  }

  /**
   * Open the Open Packaging Format Xml
   * @param {string} url
   * @returns {Promise}
   * @private
   */
  async openPackaging(url) {
    this.path = new utils_path(url);
    return this.load(url).then(xml => {
      this.packaging.parse(xml);
      return this.unpack();
    });
  }

  /**
   * Open the manifest JSON
   * @param {string} url
   * @returns {Promise}
   * @private
   */
  async openManifest(url) {
    this.path = new utils_path(url);
    return this.load(url).then(json => {
      this.packaging.load(json);
      return this.unpack();
    });
  }

  /**
   * Load a resource from the Book
   * @param {string} path path to the resource to load
   * @returns {Promise} returns a promise with the requested resource
   */
  load(path) {
    const resolved = this.resolve(path);
    if (this.archived) {
      return this.archive.request(resolved);
    } else {
      return this.request(resolved, null, this.settings.request.withCredentials, this.settings.request.headers);
    }
  }

  /**
   * Resolve a path to it's absolute position in the Book
   * @param {string} path
   * @param {boolean} [absolute=false] force resolving the full URL
   * @returns {string} the resolved path string
   */
  resolve(path, absolute = false) {
    if (!path) return;
    if (path.indexOf("://") > -1) {
      return path; // is absolute
    }
    let resolved = path;
    if (this.path) {
      resolved = this.path.resolve(this.path.directory, path);
    }
    if (absolute === false && this.url) {
      resolved = this.url.resolve(resolved);
    }
    return resolved;
  }

  /**
   * Get a canonical link to a path
   * @param {string} path
   * @returns {string} the canonical path string
   */
  canonical(path) {
    if (!path) return "";
    let url;
    if (this.settings.canonical) {
      url = this.settings.canonical(path);
    } else {
      url = this.resolve(path, true);
    }
    return url;
  }

  /**
   * Determine the type of they input passed to open
   * @param {string} input
   * @returns {string} values: `"binary"` OR `"directory"` OR `"epub"` OR `"opf"`
   * @private
   */
  determineType(input) {
    if (this.settings.encoding === "base64") {
      return INPUT_TYPE.BASE64;
    }
    if (typeof input !== "string") {
      return INPUT_TYPE.BINARY;
    }
    const path = new utils_url(input).path;
    let extension = path.extension;
    // If there's a search string, remove it before determining type
    if (extension) {
      extension = extension.replace(/\?.*$/, "");
    }
    if (!extension) {
      return INPUT_TYPE.DIRECTORY;
    }
    if (extension === "epub") {
      return INPUT_TYPE.EPUB;
    }
    if (extension === "opf") {
      return INPUT_TYPE.OPF;
    }
    if (extension === "json") {
      return INPUT_TYPE.MANIFEST;
    }
  }

  /**
   * Unpack the contents of the book packaging
   * @private
   */
  async unpack() {
    this.sections.unpack(this.packaging, this.resolve.bind(this), this.canonical.bind(this));
    this.resources = new resources(this.packaging.manifest, {
      archive: this.archive,
      request: this.request.bind(this),
      resolve: this.resolve.bind(this),
      replacements: this.settings.replacements || (this.archived ? "blobUrl" : "base64")
    });
    this.loadNavigation(this.packaging).then(() => {
      // this.toc = this.navigation.toc;
      this.loading.navigation.resolve(this.navigation);
    });
    if (this.packaging.coverPath) {
      this.cover = this.resolve(this.packaging.coverPath);
    }
    // Resolve promises
    this.loading.manifest.resolve(this.packaging.manifest);
    this.loading.metadata.resolve(this.packaging.metadata);
    this.loading.spine.resolve(this.packaging.spine);
    this.loading.cover.resolve(this.cover);
    this.loading.resources.resolve(this.resources);
    this.loading.pageList.resolve(this.pageList);
    this.isOpen = true;
    if (this.archived || this.settings.replacements && this.settings.replacements !== "none") {
      this.replacements().then(() => {
        this.opening.resolve(this);
      }).catch(err => console.error(err.message));
    } else {
      this.opening.resolve(this);
    }
  }

  /**
   * Load Navigation and PageList from package
   * @param {Packaging} packaging
   * @returns {Promise}
   * @private
   */
  async loadNavigation(packaging) {
    const navPath = packaging.navPath || packaging.ncxPath;
    const toc = packaging.toc;

    // From json manifest
    if (toc) {
      return new Promise((resolve, reject) => {
        this.navigation = new navigation(toc);
        if (packaging.pageList) {
          this.pageList = new pagelist(packaging.pageList); // TODO: handle page lists from Manifest
        }
        resolve(this.navigation);
      });
    }
    if (!navPath) {
      return new Promise((resolve, reject) => {
        this.navigation = new navigation();
        this.pageList = new pagelist();
        resolve(this.navigation);
      });
    }
    return this.load(navPath, "xml").then(xml => {
      this.navigation = new navigation(xml);
      this.pageList = new pagelist(xml);
      return this.navigation;
    });
  }

  /**
   * Gets a Section of the Book from the Spine
   * Alias for `book.sections.get`
   * @param {string|number} [target]
   * @returns {Section|null}
   * @example book.section()
   * @example book.section(1)
   * @example book.section("chapter.html")
   * @example book.section("#id1234")
   */
  section(target) {
    return this.sections.get(target);
  }

  /**
   * Sugar to render a book to an element
   * @param {Element|string} element element or string to add a rendition to
   * @param {object} [options]
   * @returns {Rendition}
   */
  renderTo(element, options) {
    this.rendition = new rendition(this, options);
    this.rendition.attachTo(element);
    return this.rendition;
  }

  /**
   * Set if request should use withCredentials
   * @param {boolean} credentials
   */
  setRequestCredentials(credentials) {
    this.settings.request.withCredentials = credentials;
  }

  /**
   * Set headers request should use
   * @param {object} headers
   */
  setRequestHeaders(headers) {
    this.settings.request.headers = headers;
  }

  /**
   * Unarchive a zipped epub
   * @param {binary} input epub data
   * @param {string} [encoding]
   * @returns {Archive}
   * @private
   */
  unarchive(input, encoding) {
    this.archive = new archive();
    return this.archive.open(input, encoding);
  }

  /**
   * Storage the epubs contents
   * @param {binary} input epub data
   * @returns {Storage}
   * @private
   */
  store(input) {
    // Create new Storage
    this.storage = new storage(input, this.request.bind(this), this.resolve.bind(this));
    // Replace request method to go through store
    this.request = this.storage.dispatch.bind(this.storage);
    this.opened.then(() => {
      if (this.archived) {
        this.storage.request = this.archive.request.bind(this.archive);
      }
      // Substitute hook
      const substituteResources = (output, section) => {
        section.output = this.resources.substitute(output, section.url);
      };

      // Use "blobUrl" or "base64" for replacements
      if (this.settings.replacements && this.settings.replacements !== "none") {
        this.resources.settings.replacements = this.settings.replacements;
      } else {
        this.resources.settings.replacements = "blobUrl";
      }

      // Create replacement urls
      this.resources.replacements().then(() => {
        return this.resources.replaceCss();
      });
      let originalUrl = this.url; // Save original url

      this.storage.on("online", () => {
        // Restore original url
        this.url = originalUrl;
        // Remove hook
        this.sections.hooks.serialize.deregister(substituteResources);
      });
      this.storage.on("offline", () => {
        // Remove url to use relative resolving for hrefs
        this.url = new utils_url("/", "");
        // Add hook to replace resources in contents
        this.sections.hooks.serialize.register(substituteResources);
      });
    });
    return this.storage;
  }

  /**
   * Get the cover url
   * @returns {Promise<?string>} coverUrl
   */
  async coverUrl() {
    return this.loaded.cover.then(() => {
      if (!this.cover) {
        return null;
      }
      if (this.archived) {
        return this.archive.createUrl(this.cover);
      } else {
        return this.cover;
      }
    });
  }

  /**
   * Load replacement urls
   * @returns {Promise} completed loading urls
   * @private
   */
  async replacements() {
    this.sections.hooks.serialize.register((output, section) => {
      section.output = this.resources.substitute(output, section.url);
    });
    return this.resources.replacements().then(() => {
      return this.resources.replaceCss();
    });
  }

  /**
   * Find a DOM Range for a given CFI Range
   * @param {EpubCFI} cfiRange a epub cfi range
   * @returns {Promise}
   */
  async getRange(cfiRange) {
    const cfi = new src_epubcfi(cfiRange);
    const item = this.sections.get(cfi.spinePos);
    const request = this.load.bind(this);
    if (!item) {
      return new Promise((resolve, reject) => {
        reject(new Error("CFI could not be found"));
      });
    }
    return item.load(request).then(contents => {
      const range = cfi.toRange(item.document);
      return range;
    });
  }

  /**
   * Generates the Book Key using the identifier in the manifest or other string provided
   * @param {string} [identifier] to use instead of metadata identifier
   * @returns {string} key
   */
  key(identifier) {
    const ident = identifier || this.packaging.metadata.get("identifier") || this.url.filename;
    return `epubjs:${EPUBJS_VERSION}:${ident}`;
  }

  /**
   * Destroy the Book and all associated objects
   */
  destroy() {
    this.opened = undefined;
    this.loading = undefined;
    this.loaded = undefined;
    this.ready = undefined;
    this.isOpen = false;
    this.isRendered = false;
    this.locations && this.locations.destroy();
    this.pageList && this.pageList.destroy();
    this.archive && this.archive.destroy();
    this.resources && this.resources.destroy();
    this.container && this.container.destroy();
    this.packaging && this.packaging.destroy();
    this.rendition && this.rendition.destroy();
    this.locations = undefined;
    this.pageList = undefined;
    this.archive = undefined;
    this.resources = undefined;
    this.container = undefined;
    this.packaging = undefined;
    this.rendition = undefined;
    this.navigation = undefined;
    this.url = undefined;
    this.path = undefined;
    this.archived = false;
  }
}
event_emitter_default()(Book.prototype);
/* harmony default export */ const book = (Book);
;// CONCATENATED MODULE: ./src/epub.js










/**
 * Creates a new Book
 * @param {string|ArrayBuffer} url URL, Path or ArrayBuffer
 * @param {object} options to pass to the book
 * @returns {Book} a new Book object
 * @example ePub("/path/to/book.epub", {})
 */
function ePub(url, options) {
  return new book(url, options);
}
ePub.VERSION = EPUBJS_VERSION;
if (typeof __webpack_require__.g !== "undefined") {
  __webpack_require__.g.EPUBJS_VERSION = EPUBJS_VERSION;
}
ePub.Book = book;
ePub.Rendition = rendition;
ePub.Contents = contents;
ePub.CFI = src_epubcfi;
ePub.utils = core_namespaceObject;
/* harmony default export */ const epub = (ePub);
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=epub.legacy.js.map