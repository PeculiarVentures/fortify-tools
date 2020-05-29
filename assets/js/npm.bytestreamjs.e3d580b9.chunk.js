(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{DtSX:function(t,e,i){"use strict";i.r(e),i.d(e,"ByteStream",(function(){return r})),i.d(e,"SeqStream",(function(){return n})),i.d(e,"parseByteMap",(function(){return s})),i.d(e,"BitStream",(function(){return f})),i.d(e,"SeqBitStream",(function(){return l}));class r{constructor(t={}){this.clear();for(const e of Object.keys(t))switch(e){case"length":this.length=t.length;break;case"stub":for(let e=0;e<this._view.length;e++)this._view[e]=t.stub;break;case"view":this.fromUint8Array(t.view);break;case"buffer":this.fromArrayBuffer(t.buffer);break;case"string":this.fromString(t.string);break;case"hexstring":this.fromHexString(t.hexstring)}}set buffer(t){this._buffer=t.slice(0),this._view=new Uint8Array(this._buffer)}get buffer(){return this._buffer}set view(t){this._buffer=new ArrayBuffer(t.length),this._view=new Uint8Array(this._buffer),this._view.set(t)}get view(){return this._view}get length(){return this._buffer.byteLength}set length(t){this._buffer=new ArrayBuffer(t),this._view=new Uint8Array(this._buffer)}clear(){this._buffer=new ArrayBuffer(0),this._view=new Uint8Array(this._buffer)}fromArrayBuffer(t){this.buffer=t}fromUint8Array(t){this._buffer=new ArrayBuffer(t.length),this._view=new Uint8Array(this._buffer),this._view.set(t)}fromString(t){const e=t.length;this.length=e;for(let i=0;i<e;i++)this.view[i]=t.charCodeAt(i)}toString(t=0,e=this.view.length-t){let i="";(t>=this.view.length||t<0)&&(t=0),(e>=this.view.length||e<0)&&(e=this.view.length-t);for(let r=t;r<t+e;r++)i+=String.fromCharCode(this.view[r]);return i}fromHexString(t){const e=t.length;this.buffer=new ArrayBuffer(e>>1),this.view=new Uint8Array(this.buffer);const i=new Map;i.set("0",0),i.set("1",1),i.set("2",2),i.set("3",3),i.set("4",4),i.set("5",5),i.set("6",6),i.set("7",7),i.set("8",8),i.set("9",9),i.set("A",10),i.set("a",10),i.set("B",11),i.set("b",11),i.set("C",12),i.set("c",12),i.set("D",13),i.set("d",13),i.set("E",14),i.set("e",14),i.set("F",15),i.set("f",15);let r=0,n=0;for(let s=0;s<e;s++)s%2?(n|=i.get(t.charAt(s)),this.view[r]=n,r++):n=i.get(t.charAt(s))<<4}toHexString(t=0,e=this.view.length-t){let i="";(t>=this.view.length||t<0)&&(t=0),(e>=this.view.length||e<0)&&(e=this.view.length-t);for(let r=t;r<t+e;r++){const t=this.view[r].toString(16).toUpperCase();i=i+(1==t.length?"0":"")+t}return i}copy(t=0,e=this._buffer.byteLength-t){if(0===t&&0===this._buffer.byteLength)return new r;if(t<0||t>this._buffer.byteLength-1)throw new Error(`Wrong start position: ${t}`);const i=new r;return i._buffer=this._buffer.slice(t,t+e),i._view=new Uint8Array(i._buffer),i}slice(t=0,e=this._buffer.byteLength){if(0===t&&0===this._buffer.byteLength)return new r;if(t<0||t>this._buffer.byteLength-1)throw new Error(`Wrong start position: ${t}`);const i=new r;return i._buffer=this._buffer.slice(t,e),i._view=new Uint8Array(i._buffer),i}realloc(t){const e=new ArrayBuffer(t),i=new Uint8Array(e);t>this._view.length?i.set(this._view):i.set(new Uint8Array(this._buffer,0,t)),this._buffer=e.slice(0),this._view=new Uint8Array(this._buffer)}append(t){const e=this._buffer.byteLength,i=t._buffer.byteLength,r=t._view.slice();this.realloc(e+i),this._view.set(r,e)}insert(t,e=0,i=this._buffer.byteLength-e){return!(e>this._buffer.byteLength-1)&&(i>this._buffer.byteLength-e&&(i=this._buffer.byteLength-e),i>t._buffer.byteLength&&(i=t._buffer.byteLength),i==t._buffer.byteLength?this._view.set(t._view,e):this._view.set(t._view.slice(0,i),e),!0)}isEqual(t){if(this._buffer.byteLength!=t._buffer.byteLength)return!1;for(let e=0;e<t._buffer.byteLength;e++)if(this.view[e]!=t.view[e])return!1;return!0}isEqualView(t){if(t.length!=this.view.length)return!1;for(let e=0;e<t.length;e++)if(this.view[e]!=t[e])return!1;return!0}findPattern(t,e=null,i=null,r=!1){null==e&&(e=r?this.buffer.byteLength:0),e>this.buffer.byteLength&&(e=this.buffer.byteLength),r?(null==i&&(i=e),i>e&&(i=e)):(null==i&&(i=this.buffer.byteLength-e),i>this.buffer.byteLength-e&&(i=this.buffer.byteLength-e));const n=t.buffer.byteLength;if(n>i)return-1;const s=[];for(let h=0;h<n;h++)s.push(t.view[h]);for(let h=0;h<=i-n;h++){let t=!0;const i=r?e-n-h:e+h;for(let e=0;e<n;e++)if(this.view[e+i]!=s[e]){t=!1;break}if(t)return r?e-n-h:e+n+h}return-1}findFirstIn(t,e=null,i=null,r=!1){null==e&&(e=r?this.buffer.byteLength:0),e>this.buffer.byteLength&&(e=this.buffer.byteLength),r?(null==i&&(i=e),i>e&&(i=e)):(null==i&&(i=this.buffer.byteLength-e),i>this.buffer.byteLength-e&&(i=this.buffer.byteLength-e));const n={id:-1,position:r?0:e+i,length:0};for(let s=0;s<t.length;s++){const h=this.findPattern(t[s],e,i,r);if(-1!=h){let e=!1;const i=t[s].length;r?h-i>=n.position-n.length&&(e=!0):h-i<=n.position-n.length&&(e=!0),e&&(n.position=h,n.id=s,n.length=i)}}return n}findAllIn(t,e=0,i=this.buffer.byteLength-e){const r=[];if(null==e&&(e=0),e>this.buffer.byteLength-1)return r;null==i&&(i=this.buffer.byteLength-e),i>this.buffer.byteLength-e&&(i=this.buffer.byteLength-e);let n={id:-1,position:e};for(;;){const e=n.position;if(n=this.findFirstIn(t,n.position,i),-1==n.id)break;i-=n.position-e,r.push({id:n.id,position:n.position})}return r}findAllPatternIn(t,e=0,i=this.buffer.byteLength-e){null==e&&(e=0),e>this.buffer.byteLength&&(e=this.buffer.byteLength),null==i&&(i=this.buffer.byteLength-e),i>this.buffer.byteLength-e&&(i=this.buffer.byteLength-e);const r=[],n=t.buffer.byteLength;if(n>i)return-1;const s=Array.from(t.view);for(let h=0;h<=i-n;h++){let t=!0;const i=e+h;for(let e=0;e<n;e++)if(this.view[e+i]!=s[e]){t=!1;break}t&&(r.push(e+n+h),h+=n-1)}return r}findFirstNotIn(t,e=null,i=null,n=!1){null==e&&(e=n?this.buffer.byteLength:0),e>this.buffer.byteLength&&(e=this.buffer.byteLength),n?(null==i&&(i=e),i>e&&(i=e)):(null==i&&(i=this.buffer.byteLength-e),i>this.buffer.byteLength-e&&(i=this.buffer.byteLength-e));const s={left:{id:-1,position:e},right:{id:-1,position:0},value:new r};let h=i;for(;h>0;){if(s.right=this.findFirstIn(t,n?e-i+h:e+i-h,h,n),-1==s.right.id){i=h,n?e-=i:e=s.left.position,s.value=new r,s.value._buffer=this._buffer.slice(e,e+i),s.value._view=new Uint8Array(s.value._buffer);break}if(s.right.position!=(n?s.left.position-t[s.right.id].buffer.byteLength:s.left.position+t[s.right.id].buffer.byteLength)){n?(e=s.right.position+t[s.right.id].buffer.byteLength,i=s.left.position-s.right.position-t[s.right.id].buffer.byteLength):(e=s.left.position,i=s.right.position-s.left.position-t[s.right.id].buffer.byteLength),s.value=new r,s.value._buffer=this._buffer.slice(e,e+i),s.value._view=new Uint8Array(s.value._buffer);break}s.left=s.right,h-=t[s.right.id]._buffer.byteLength}if(n){const t=s.right;s.right=s.left,s.left=t}return s}findAllNotIn(t,e=null,i=null){const n=[];if(null==e&&(e=0),e>this.buffer.byteLength-1)return n;null==i&&(i=this.buffer.byteLength-e),i>this.buffer.byteLength-e&&(i=this.buffer.byteLength-e);let s={left:{id:-1,position:e},right:{id:-1,position:e},value:new r};do{const e=s.right.position;s=this.findFirstNotIn(t,s.right.position,i),i-=s.right.position-e,n.push({left:{id:s.left.id,position:s.left.position},right:{id:s.right.id,position:s.right.position},value:s.value})}while(-1!=s.right.id);return n}findFirstSequence(t,e=null,i=null,n=!1){null==e&&(e=n?this.buffer.byteLength:0),e>this.buffer.byteLength&&(e=this.buffer.byteLength),n?(null==i&&(i=e),i>e&&(i=e)):(null==i&&(i=this.buffer.byteLength-e),i>this.buffer.byteLength-e&&(i=this.buffer.byteLength-e));const s=this.skipNotPatterns(t,e,i,n);if(-1==s)return{position:-1,value:new r};const h=this.skipPatterns(t,s,i-(n?e-s:s-e),n);n?(e=h,i=s-h):(e=s,i=h-s);const f=new r;return f._buffer=this._buffer.slice(e,e+i),f._view=new Uint8Array(f._buffer),{position:h,value:f}}findAllSequences(t,e=null,i=null){const n=[];if(null==e&&(e=0),e>this.buffer.byteLength-1)return n;null==i&&(i=this.buffer.byteLength-e),i>this.buffer.byteLength-e&&(i=this.buffer.byteLength-e);let s={position:e,value:new r};do{const e=s.position;s=this.findFirstSequence(t,s.position,i),-1!=s.position&&(i-=s.position-e,n.push({position:s.position,value:s.value}))}while(-1!=s.position);return n}findPairedPatterns(t,e,i=null,r=null){const n=[];if(t.isEqual(e))return n;if(null==i&&(i=0),i>this.buffer.byteLength-1)return n;null==r&&(r=this.buffer.byteLength-i),r>this.buffer.byteLength-i&&(r=this.buffer.byteLength-i);let s=0;const h=this.findAllPatternIn(t,i,r);if(0==h.length)return n;const f=this.findAllPatternIn(e,i,r);if(0==f.length)return n;for(;s<h.length&&0!=f.length;)if(h[0]!=f[0]){if(h[s]>f[0])break;for(;h[s]<f[0]&&(s++,!(s>=h.length)););n.push({left:h[s-1],right:f[0]}),h.splice(s-1,1),f.splice(0,1),s=0}else n.push({left:h[0],right:f[0]}),h.splice(0,1),f.splice(0,1);return n.sort((t,e)=>t.left-e.left),n}findPairedArrays(t,e,i=null,r=null){const n=[];if(null==i&&(i=0),i>this.buffer.byteLength-1)return n;null==r&&(r=this.buffer.byteLength-i),r>this.buffer.byteLength-i&&(r=this.buffer.byteLength-i);let s=0;const h=this.findAllIn(t,i,r);if(0==h.length)return n;const f=this.findAllIn(e,i,r);if(0==f.length)return n;for(;s<h.length&&0!=f.length;)if(h[0].position!=f[0].position){if(h[s].position>f[0].position)break;for(;h[s].position<f[0].position&&(s++,!(s>=h.length)););n.push({left:h[s-1],right:f[0]}),h.splice(s-1,1),f.splice(0,1),s=0}else n.push({left:h[0],right:f[0]}),h.splice(0,1),f.splice(0,1);return n.sort((t,e)=>t.left.position-e.left.position),n}replacePattern(t,e,i=null,r=null,n=null){let s,h;const f={status:-1,searchPatternPositions:[],replacePatternPositions:[]};if(null==i&&(i=0),i>this.buffer.byteLength-1)return!1;if(null==r&&(r=this.buffer.byteLength-i),r>this.buffer.byteLength-i&&(r=this.buffer.byteLength-i),null==n){if(s=this.findAllIn([t],i,r),0==s.length)return f}else s=n;f.searchPatternPositions.push(...Array.from(s,t=>t.position));const l=t.buffer.byteLength-e.buffer.byteLength,u=new ArrayBuffer(this.view.length-s.length*l),a=new Uint8Array(u);for(a.set(new Uint8Array(this.buffer,0,i)),h=0;h<s.length;h++){const r=0==h?i:s[h-1].position;a.set(new Uint8Array(this.buffer,r,s[h].position-t.buffer.byteLength-r),r-h*l),a.set(e.view,s[h].position-t.buffer.byteLength-h*l),f.replacePatternPositions.push(s[h].position-t.buffer.byteLength-h*l)}return h--,a.set(new Uint8Array(this.buffer,s[h].position,this.buffer.byteLength-s[h].position),s[h].position-t.buffer.byteLength+e.buffer.byteLength-h*l),this.buffer=u,this.view=new Uint8Array(this.buffer),f.status=1,f}skipPatterns(t,e=null,i=null,r=!1){null==e&&(e=r?this.buffer.byteLength:0),e>this.buffer.byteLength&&(e=this.buffer.byteLength),r?(null==i&&(i=e),i>e&&(i=e)):(null==i&&(i=this.buffer.byteLength-e),i>this.buffer.byteLength-e&&(i=this.buffer.byteLength-e));let n=e;for(let s=0;s<t.length;s++){const h=t[s].buffer.byteLength,f=r?n-h:n;let l=!0;for(let e=0;e<h;e++)if(this.view[e+f]!=t[s].view[e]){l=!1;break}if(l)if(s=-1,r){if(n-=h,n<=0)return n}else if(n+=h,n>=e+i)return n}return n}skipNotPatterns(t,e=null,i=null,r=!1){null==e&&(e=r?this.buffer.byteLength:0),e>this.buffer.byteLength&&(e=this.buffer.byteLength),r?(null==i&&(i=e),i>e&&(i=e)):(null==i&&(i=this.buffer.byteLength-e),i>this.buffer.byteLength-e&&(i=this.buffer.byteLength-e));let n=-1;for(let s=0;s<i;s++){for(let i=0;i<t.length;i++){const h=t[i].buffer.byteLength,f=r?e-s-h:e+s;let l=!0;for(let e=0;e<h;e++)if(this.view[e+f]!=t[i].view[e]){l=!1;break}if(l){n=r?e-s:e+s;break}}if(-1!=n)break}return n}}class n{constructor(t={}){this.stream=new r,this._length=0,this.backward=!1,this._start=0,this.appendBlock=0,this.prevLength=0,this.prevStart=0;for(const e of Object.keys(t))switch(e){case"stream":this.stream=t.stream;break;case"backward":this.backward=t.backward,this._start=this.stream.buffer.byteLength;break;case"length":this._length=t.length;break;case"start":this._start=t.start;break;case"appendBlock":this.appendBlock=t.appendBlock;break;case"view":this.stream=new r({view:t.view});break;case"buffer":this.stream=new r({buffer:t.buffer});break;case"string":this.stream=new r({string:t.string});break;case"hexstring":this.stream=new r({hexstring:t.hexstring})}}set stream(t){this._stream=t,this.prevLength=this._length,this._length=t._buffer.byteLength,this.prevStart=this._start,this._start=0}get stream(){return this._stream}set length(t){this.prevLength=this._length,this._length=t}get length(){return this.appendBlock?this.start:this._length}set start(t){t>this.stream.buffer.byteLength||(this.prevStart=this._start,this.prevLength=this._length,this._length-=this.backward?this._start-t:t-this._start,this._start=t)}get start(){return this._start}get buffer(){return this._stream._buffer.slice(0,this._length)}resetPosition(){this._start=this.prevStart,this._length=this.prevLength}findPattern(t,e=null){(null==e||e>this.length)&&(e=this.length);const i=this.stream.findPattern(t,this.start,this.length,this.backward);if(-1==i)return i;if(this.backward){if(i<this.start-t.buffer.byteLength-e)return-1}else if(i>this.start+t.buffer.byteLength+e)return-1;return this.start=i,i}findFirstIn(t,e=null){(null==e||e>this.length)&&(e=this.length);const i=this.stream.findFirstIn(t,this.start,this.length,this.backward);if(-1==i.id)return i;if(this.backward){if(i.position<this.start-t[i.id].buffer.byteLength-e)return{id:-1,position:this.backward?0:this.start+this.length}}else if(i.position>this.start+t[i.id].buffer.byteLength+e)return{id:-1,position:this.backward?0:this.start+this.length};return this.start=i.position,i}findAllIn(t){const e=this.backward?this.start-this.length:this.start;return this.stream.findAllIn(t,e,this.length)}findFirstNotIn(t,e=null){(null==e||e>this._length)&&(e=this._length);const i=this._stream.findFirstNotIn(t,this._start,this._length,this.backward);if(-1==i.left.id&&-1==i.right.id)return i;if(this.backward){if(-1!=i.right.id&&i.right.position<this._start-t[i.right.id]._buffer.byteLength-e)return{left:{id:-1,position:this._start},right:{id:-1,position:0},value:new r}}else if(-1!=i.left.id&&i.left.position>this._start+t[i.left.id]._buffer.byteLength+e)return{left:{id:-1,position:this._start},right:{id:-1,position:0},value:new r};return this.backward?-1==i.left.id?this.start=0:this.start=i.left.position:-1==i.right.id?this.start=this._start+this._length:this.start=i.right.position,i}findAllNotIn(t){const e=this.backward?this._start-this._length:this._start;return this._stream.findAllNotIn(t,e,this._length)}findFirstSequence(t,e=null,i=null){(null==e||e>this._length)&&(e=this._length),(null==i||i>e)&&(i=e);const n=this._stream.findFirstSequence(t,this._start,e,this.backward);if(0==n.value.buffer.byteLength)return n;if(this.backward){if(n.position<this._start-n.value._buffer.byteLength-i)return{position:-1,value:new r}}else if(n.position>this._start+n.value._buffer.byteLength+i)return{position:-1,value:new r};return this.start=n.position,n}findAllSequences(t){const e=this.backward?this.start-this.length:this.start;return this.stream.findAllSequences(t,e,this.length)}findPairedPatterns(t,e,i=null){(null==i||i>this.length)&&(i=this.length);const r=this.backward?this.start-this.length:this.start,n=this.stream.findPairedPatterns(t,e,r,this.length);if(n.length)if(this.backward){if(n[0].right<this.start-e.buffer.byteLength-i)return[]}else if(n[0].left>this.start+t.buffer.byteLength+i)return[];return n}findPairedArrays(t,e,i=null){(null==i||i>this.length)&&(i=this.length);const r=this.backward?this.start-this.length:this.start,n=this.stream.findPairedArrays(t,e,r,this.length);if(n.length)if(this.backward){if(n[0].right.position<this.start-e[n[0].right.id].buffer.byteLength-i)return[]}else if(n[0].left.position>this.start+t[n[0].left.id].buffer.byteLength+i)return[];return n}replacePattern(t,e){const i=this.backward?this.start-this.length:this.start;return this.stream.replacePattern(t,e,i,this.length)}skipPatterns(t){const e=this.stream.skipPatterns(t,this.start,this.length,this.backward);return this.start=e,e}skipNotPatterns(t){const e=this.stream.skipNotPatterns(t,this.start,this.length,this.backward);return-1==e?-1:(this.start=e,e)}append(t){this._start+t._buffer.byteLength>this._stream._buffer.byteLength&&(t._buffer.byteLength>this.appendBlock&&(this.appendBlock=t._buffer.byteLength+1e3),this._stream.realloc(this._stream._buffer.byteLength+this.appendBlock)),this._stream._view.set(t._view,this._start),this._length+=2*t._buffer.byteLength,this.start=this._start+t._buffer.byteLength,this.prevLength-=2*t._buffer.byteLength}appendView(t){this._start+t.length>this._stream._buffer.byteLength&&(t.length>this.appendBlock&&(this.appendBlock=t.length+1e3),this._stream.realloc(this._stream._buffer.byteLength+this.appendBlock)),this._stream._view.set(t,this._start),this._length+=2*t.length,this.start=this._start+t.length,this.prevLength-=2*t.length}appendChar(t){this._start+1>this._stream._buffer.byteLength&&(1>this.appendBlock&&(this.appendBlock=1e3),this._stream.realloc(this._stream._buffer.byteLength+this.appendBlock)),this._stream._view[this._start]=t,this._length+=2,this.start=this._start+1,this.prevLength-=2}appendUint16(t){this._start+2>this._stream._buffer.byteLength&&(2>this.appendBlock&&(this.appendBlock=1e3),this._stream.realloc(this._stream._buffer.byteLength+this.appendBlock));const e=new Uint16Array([t]),i=new Uint8Array(e.buffer);this._stream._view[this._start]=i[1],this._stream._view[this._start+1]=i[0],this._length+=4,this.start=this._start+2,this.prevLength-=4}appendUint24(t){this._start+3>this._stream._buffer.byteLength&&(3>this.appendBlock&&(this.appendBlock=1e3),this._stream.realloc(this._stream._buffer.byteLength+this.appendBlock));const e=new Uint32Array([t]),i=new Uint8Array(e.buffer);this._stream._view[this._start]=i[2],this._stream._view[this._start+1]=i[1],this._stream._view[this._start+2]=i[0],this._length+=6,this.start=this._start+3,this.prevLength-=6}appendUint32(t){this._start+4>this._stream._buffer.byteLength&&(4>this.appendBlock&&(this.appendBlock=1e3),this._stream.realloc(this._stream._buffer.byteLength+this.appendBlock));const e=new Uint32Array([t]),i=new Uint8Array(e.buffer);this._stream._view[this._start]=i[3],this._stream._view[this._start+1]=i[2],this._stream._view[this._start+2]=i[1],this._stream._view[this._start+3]=i[0],this._length+=8,this.start=this._start+4,this.prevLength-=8}getBlock(t,e=!0){if(this._length<=0)return[];let i;if(this._length<t&&(t=this._length),this.backward){const e=this._stream._buffer.slice(this._length-t,this._length),r=new Uint8Array(e);i=new Array(t);for(let n=0;n<t;n++)i[t-1-n]=r[n]}else{const e=this._stream._buffer.slice(this._start,this._start+t);i=Array.from(new Uint8Array(e))}return e&&(this.start+=this.backward?-1*t:t),i}getUint16(t=!0){const e=this.getBlock(2,t);if(e.length<2)return 0;const i=new Uint16Array(1),r=new Uint8Array(i.buffer);return r[0]=e[1],r[1]=e[0],i[0]}getInt16(t=!0){const e=this.getBlock(2,t);if(e.length<2)return 0;const i=new Int16Array(1),r=new Uint8Array(i.buffer);return r[0]=e[1],r[1]=e[0],i[0]}getUint24(t=!0){const e=this.getBlock(3,t);if(e.length<3)return 0;const i=new Uint32Array(1),r=new Uint8Array(i.buffer);for(let n=3;n>=1;n--)r[3-n]=e[n-1];return i[0]}getUint32(t=!0){const e=this.getBlock(4,t);if(e.length<4)return 0;const i=new Uint32Array(1),r=new Uint8Array(i.buffer);for(let n=3;n>=0;n--)r[3-n]=e[n];return i[0]}getInt32(t=!0){const e=this.getBlock(4,t);if(e.length<4)return 0;const i=new Int32Array(1),r=new Uint8Array(i.buffer);for(let n=3;n>=0;n--)r[3-n]=e[n];return i[0]}}function s(t,e,i,r=null,n=null){if(null===r&&(r=0),r>t.buffer.byteLength-1)return!1;let s;null===n&&(n=t.buffer.byteLength-r),n>t.buffer.byteLength-r&&(n=t.buffer.byteLength-r),s=0==r&&n==t.buffer.byteLength?t.view:new Uint8Array(t.buffer,r,n);const h=new Array(i);let f=0,l=0;const u=e.length;for(;l<n;){let t=0;h[f]={};for(let i=0;i<u;i++){if(0==e[i].maxlength){"defaultValue"in e[i]&&(h[f][e[i].name]=e[i].defaultValue);continue}const r=new Array(e[i].maxlength);for(let t=0;t<e[i].maxlength;t++)r[t]=s[l++];const n=e[i].func(r);if(-1==n.status)return 1==h.length?[]:h.slice(0,h.length-1);"check"!=e[i].type&&(h[f][e[i].name]=n.value),l-=e[i].maxlength-n.length,t+=n.length}h[f++].structureLength=t}return h}const h=["00000000","00000001","00000010","00000011","00000100","00000101","00000110","00000111","00001000","00001001","00001010","00001011","00001100","00001101","00001110","00001111","00010000","00010001","00010010","00010011","00010100","00010101","00010110","00010111","00011000","00011001","00011010","00011011","00011100","00011101","00011110","00011111","00100000","00100001","00100010","00100011","00100100","00100101","00100110","00100111","00101000","00101001","00101010","00101011","00101100","00101101","00101110","00101111","00110000","00110001","00110010","00110011","00110100","00110101","00110110","00110111","00111000","00111001","00111010","00111011","00111100","00111101","00111110","00111111","01000000","01000001","01000010","01000011","01000100","01000101","01000110","01000111","01001000","01001001","01001010","01001011","01001100","01001101","01001110","01001111","01010000","01010001","01010010","01010011","01010100","01010101","01010110","01010111","01011000","01011001","01011010","01011011","01011100","01011101","01011110","01011111","01100000","01100001","01100010","01100011","01100100","01100101","01100110","01100111","01101000","01101001","01101010","01101011","01101100","01101101","01101110","01101111","01110000","01110001","01110010","01110011","01110100","01110101","01110110","01110111","01111000","01111001","01111010","01111011","01111100","01111101","01111110","01111111","10000000","10000001","10000010","10000011","10000100","10000101","10000110","10000111","10001000","10001001","10001010","10001011","10001100","10001101","10001110","10001111","10010000","10010001","10010010","10010011","10010100","10010101","10010110","10010111","10011000","10011001","10011010","10011011","10011100","10011101","10011110","10011111","10100000","10100001","10100010","10100011","10100100","10100101","10100110","10100111","10101000","10101001","10101010","10101011","10101100","10101101","10101110","10101111","10110000","10110001","10110010","10110011","10110100","10110101","10110110","10110111","10111000","10111001","10111010","10111011","10111100","10111101","10111110","10111111","11000000","11000001","11000010","11000011","11000100","11000101","11000110","11000111","11001000","11001001","11001010","11001011","11001100","11001101","11001110","11001111","11010000","11010001","11010010","11010011","11010100","11010101","11010110","11010111","11011000","11011001","11011010","11011011","11011100","11011101","11011110","11011111","11100000","11100001","11100010","11100011","11100100","11100101","11100110","11100111","11101000","11101001","11101010","11101011","11101100","11101101","11101110","11101111","11110000","11110001","11110010","11110011","11110100","11110101","11110110","11110111","11111000","11111001","11111010","11111011","11111100","11111101","11111110","11111111"];class f{constructor(t={}){this.buffer=new ArrayBuffer(0),this.view=new Uint8Array(this.buffer),this.bitsCount=0;for(const e of Object.keys(t))switch(e){case"byteStream":this.fromByteStream(t.byteStream);break;case"view":this.fromUint8Array(t.view);break;case"buffer":this.fromArrayBuffer(t.buffer);break;case"string":this.fromString(t.string);break;case"uint32":this.fromUint32(t.uint32);break;case"bitsCount":this.bitsCount=t.bitsCount}}clear(){this.buffer=new ArrayBuffer(0),this.view=new Uint8Array(this.buffer),this.bitsCount=0}fromByteStream(t){this.buffer=t.buffer.slice(0),this.view=new Uint8Array(this.buffer),this.bitsCount=this.view.length<<3}fromArrayBuffer(t){this.buffer=t.slice(0),this.view=new Uint8Array(this.buffer),this.bitsCount=this.view.length<<3}fromUint8Array(t){this.buffer=new ArrayBuffer(t.length),this.view=new Uint8Array(this.buffer),this.view.set(t),this.bitsCount=this.view.length<<3}fromString(t){const e=t.length;this.buffer=new ArrayBuffer((e>>3)+(e%8?1:0)),this.view=new Uint8Array(this.buffer),this.bitsCount=1+(e>>3)<<3;let i=0;for(let r=0;r<e;r++)"1"==t[r]&&(this.view[i]|=1<<7-r%8),r&&(r+1)%8==0&&i++;e%8&&this.shiftRight(8-e%8),this.bitsCount=e}fromUint32(t){this.buffer=new ArrayBuffer(4),this.view=new Uint8Array(this.buffer);const e=new Uint32Array([t]),i=new Uint8Array(e.buffer);for(let r=3;r>=0;r--)this.view[r]=i[3-r];this.bitsCount=32}toString(t=null,e=null){null==t&&(t=0),(t>=this.view.length||t<0)&&(t=0),null==e&&(e=this.view.length-t),(e>=this.view.length||e<0)&&(e=this.view.length-t);const i=[];for(let r=t;r<t+e;r++)i.push(h[this.view[r]]);return i.join("").slice((this.view.length<<3)-this.bitsCount)}shiftRight(t,e=!0){if(0==this.view.length)return;if(t<0||t>8)throw new Error('The "shift" parameter must be in range 0-8');if(t>this.bitsCount)throw new Error('The "shift" parameter can not be bigger than "this.bitsCount"');const i=255>>8-t;this.view[this.view.length-1]>>=t;for(let r=this.view.length-2;r>=0;r--)this.view[r+1]|=(this.view[r]&i)<<8-t,this.view[r]>>=t;this.bitsCount-=t,0==this.bitsCount&&this.clear(),e&&this.shrink()}shiftLeft(t){if(0==this.view.length)return;if(t<0||t>8)throw new Error('The "shift" parameter must be in range 0-8');if(t>this.bitsCount)throw new Error('The "shift" parameter can not be bigger than "this.bitsCount"');const e=7&this.bitsCount;if(e>t)this.view[0]&=255>>e+t;else{const i=new ArrayBuffer(this.buffer.byteLength-1),r=new Uint8Array(i);r.set(new Uint8Array(this.buffer,1,this.buffer.byteLength-1)),r[0]&=255>>t-e,this.buffer=i.slice(0),this.view=new Uint8Array(this.buffer)}this.bitsCount-=t,0==this.bitsCount&&this.clear()}slice(t=null,e=null){let i=0;if(this.bitsCount%8&&(i=8-this.bitsCount%8),e+=i,null==(t+=i)&&(t=0),t<0||t>(this.view.length<<3)-1)return new f;if(null==e&&(e=(this.view.length<<3)-1),e<0||e>(this.view.length<<3)-1)return new f;if(e-t+1>this.bitsCount)return new f;const r=t>>3,n=7&t,s=e>>3,h=7&e,l=s-r==0?1:s-r+1,u=new f;return u.buffer=new ArrayBuffer(l),u.view=new Uint8Array(u.buffer),u.bitsCount=l<<3,u.view.set(new Uint8Array(this.buffer,r,l)),u.view[0]&=255>>n,u.view[l]&=255<<7-h,7-h&&u.shiftRight(7-h,!1),u.bitsCount=e-t+1,u.shrink(),u}copy(t=null,e=null){return t<0||t>(this.view.length<<3)-1?new f:(null===e&&(e=(this.view.length<<3)-t-1),e>this.bitsCount?new f:this.slice(t,t+e-1))}shrink(){const t=(this.bitsCount>>3)+(this.bitsCount%8?1:0);if(t<this.buffer.byteLength){const e=new ArrayBuffer(t);new Uint8Array(e).set(new Uint8Array(this.buffer,this.buffer.byteLength-t,t)),this.buffer=e.slice(0),this.view=new Uint8Array(this.buffer)}}reverseBytes(){for(let t=0;t<this.view.length;t++)this.view[t]=65793*(2050*this.view[t]&139536|32800*this.view[t]&558144)>>16;if(this.bitsCount%8){const t=(this.bitsCount>>3)+(this.bitsCount%8?1:0);this.view[this.view.length-t]>>=8-(7&this.bitsCount)}}reverseValue(){const t=this.toString(),e=t.length,i=new Array(e);for(let r=0;r<e;r++)i[e-1-r]=t[r];this.fromString(i.join(""))}getNumberValue(){const t=this.buffer.byteLength-1;if(t>3)return-1;if(-1==t)return 0;const e=new Uint32Array(1),i=new Uint8Array(e.buffer);for(let r=t;r>=0;r--)i[t-r]=this.view[r];return e[0]}findPattern(t,e=null,i=null,n=!1){const s=new r({string:this.toString()}),h=new r({string:t.toString()});return s.findPattern(h,e,i,n)}findFirstIn(t,e=null,i=null,n=!1){const s=new r({string:this.toString()}),h=new Array(t.length);for(let f=0;f<t.length;f++)h[f]=new r({string:t[f].toString()});return s.findFirstIn(h,e,i,n)}findAllIn(t,e=null,i=null){const n=new r({string:this.toString()}),s=new Array(t.length);for(let h=0;h<t.length;h++)s[h]=new r({string:t[h].toString()});return n.findAllIn(s,e,i)}findAllPatternIn(t,e=null,i=null){const n=new r({string:this.toString()}),s=new r({string:t.toString()});return n.findAllPatternIn(s,e,i)}findFirstNotIn(t,e=null,i=null,n=!1){const s=new r({string:this.toString()}),h=new Array(t.length);for(let f=0;f<t.length;f++)h[f]=new r({string:t[f].toString()});return s.findFirstNotIn(h,e,i,n)}findAllNotIn(t,e=null,i=null){const n=new r({string:this.toString()}),s=new Array(t.length);for(let h=0;h<t.length;h++)s[h]=new r({string:t[h].toString()});return n.findAllNotIn(s,e,i)}findFirstSequence(t,e=null,i=null,n=!1){const s=new r({string:this.toString()}),h=new Array(t.length);for(let f=0;f<t.length;f++)h[f]=new r({string:t[f].toString()});return s.findFirstSequence(h,e,i,n)}findAllSequences(t,e,i){const n=new r({string:this.toString()}),s=new Array(t.length);for(let h=0;h<t.length;h++)s[h]=new r({string:t[h].toString()});return n.findAllSequences(s,e,i)}findPairedPatterns(t,e,i=null,n=null){const s=new r({string:this.toString()}),h=new r({string:t.toString()}),f=new r({string:e.toString()});return s.findPairedPatterns(h,f,i,n)}findPairedArrays(t,e,i=null,n=null){const s=new r({string:this.toString()}),h=new Array(t.length);for(let l=0;l<t.length;l++)h[l]=new r({string:t[l].toString()});const f=new Array(e.length);for(let l=0;l<e.length;l++)f[l]=new r({string:e[l].toString()});return s.findPairedArrays(h,f,i,n)}replacePattern(t,e,i=null,n=null){const s=new r({string:this.toString()}),h=new r({string:t.toString()}),f=new r({string:e.toString()});return!!s.findPairedPatterns(h,f,i,n)&&(this.fromString(s.toString()),!0)}skipPatterns(t,e,i,n){const s=new r({string:this.toString()}),h=new Array(t.length);for(let f=0;f<t.length;f++)h[f]=new r({string:t[f].toString()});return s.skipPatterns(h,e,i,n)}skipNotPatterns(t,e,i,n){const s=new r({string:this.toString()}),h=new Array(t.length);for(let f=0;f<t.length;f++)h[f]=new r({string:t[f].toString()});return s.skipNotPatterns(h,e,i,n)}append(t){this.fromString([this.toString(),t.toString()].join(""))}}class l{constructor(t={}){this.stream=new f,this._start=0,this._length=this.stream.bitsCount,this.backward=!1,this.appendBlock=0;for(const e of Object.keys(t))switch(e){case"stream":case"start":case"length":case"backward":case"appendBlock":this[e]=t[e]}}set start(t){t>this.stream.bitsCount||(this._length-=this.backward?this._start-t:t-this._start,this._start=t,this.prevStart=this._start,this.prevLength=this._length)}get start(){return this._start}set length(t){t>this.stream.bitsCount||(this.prevLength=this._length,this._length=t)}get length(){return this._length}set stream(t){this._stream=t,this.prevLength=this._length,this._length=t.bitsCount,this.prevStart=this._start,this._start=this.backward?this.length:0}get stream(){return this._stream}getBits(t){let e;return this.start+t>this.stream.bitsCount&&(t=this.stream.bitsCount-this.start),this.backward?(e=this.stream.copy(this.start-t,t),this.start-=e.bitsCount):(e=this.stream.copy(this.start,t),this.start+=e.bitsCount),e}getBitsString(t){this.start+t>this.stream.bitsCount&&(t=this.stream.bitsCount-this.start);let e,i=[];e=this.backward?this.start-t:this.start;let r=this.start+t-1,n=0;this.stream.bitsCount%8&&(n=8-this.stream.bitsCount%8),e+=n,r+=n;const s=e>>3,f=7&e,l=r>>3,u=7&r,a=s+(l-s==0?1:l-s+1);for(let o=s;o<a;o++){let t=h[this.stream.view[o]];o==s&&(t=t.slice(f)),o==a-1&&(t=t.slice(0,u-7+t.length)),i.push(t)}return i=i.join(""),this.backward?this.start-=i.length:this.start+=i.length,i}getBitsReversedValue(t){const e=this.getBitsString(t),i=e.length;let r;const n=8-i%8,s=new Array(i),h=new Uint32Array(1),f=new Uint8Array(h.buffer,0,4);let l;if(i>32)return-1;for(r=32==t?3:i-1>>3,l=0;l<i;l++)s[i-1-l]=e[l];for(l=n;l<n+i;l++)"1"==s[l-n]&&(f[r]|=1<<7-l%8),l&&(l+1)%8==0&&r--;return h[0]}toString(){return this.stream.copy(this.start,this.length).toString()}}}}]);