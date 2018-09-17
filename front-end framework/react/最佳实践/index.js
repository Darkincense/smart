/*
 * Subject
 * 内部创建了三个方法，内部维护了一个ObserverList。
 */
 
 
//contructor function
function Subject(){
  this.observers = new ObserverList();
}
 
//addObserver: 调用内部维护的ObserverList的add方法
Subject.prototype.addObserver = function( observer ){
  this.observers.add( observer );
};
 
//removeObserver: 调用内部维护的ObserverList的removeat方法
Subject.prototype.removeObserver = function( observer ){
  this.observers.removeAt( this.observers.indexOf( observer, 0 ) );
};
 
//notify: 通知函数，用于通知观察者并且执行update函数，update是一个实现接口的方法，是一个通知的触发方法。
Subject.prototype.notify = function( context ){
  var observerCount = this.observers.count();
  for(var i=0; i < observerCount; i++){
    this.observers.get(i).update( context );
  }
};
 
/*
 * ObserverList
 * 内部维护了一个数组，4个方法用于数组的操作，这里相关的内容还是属于subject，因为ObserverList的存在是为了将subject和内部维护的observers分离开来，清晰明了的作用。
 */
function ObserverList(){
  this.observerList = [];
}
 
ObserverList.prototype.add = function( obj ){
  return this.observerList.push( obj );
};
 
ObserverList.prototype.count = function(){
  return this.observerList.length;
};
 
ObserverList.prototype.get = function( index ){
  if( index > -1 && index < this.observerList.length ){
    return this.observerList[ index ];
  }
};
 
ObserverList.prototype.indexOf = function( obj, startIndex ){
  var i = startIndex;
 
  while( i < this.observerList.length ){
    if( this.observerList[i] === obj ){
      return i;
    }
    i++;
  }
 
  return -1;
};
 
ObserverList.prototype.removeAt = function( index ){
  this.observerList.splice( index, 1 );
};
 
/*
 * The Observer
 * 提供更新接口，为想要得到通知消息的主体提供接口。
 */ 
function Observer(){
  this.update = function(){
    // ...
  };
}
 
 
// Extend an object with an extension
function extend( obj, extension ){
  for ( var key in extension ){
    obj[key] = extension[key];
  }
}
 
// References to our DOM elements
 
var controlCheckbox = document.getElementById( "mainCheckbox" ),
  addBtn = document.getElementById( "addNewObserver" ),
  container = document.getElementById( "observersContainer" );
 
 
// Concrete Subject
 
// Extend the controlling checkbox with the Subject class
extend( controlCheckbox, new Subject() );
 
// Clicking the checkbox will trigger notifications to its observers
controlCheckbox.onclick = function(){
  controlCheckbox.notify( controlCheckbox.checked );
};
 
addBtn.onclick = addNewObserver;
 
// Concrete Observer
function addNewObserver(){
  // Create a new checkbox to be added
  var check = document.createElement( "input" );
  check.type = "checkbox";
 
  // Extend the checkbox with the Observer class
  extend( check, new Observer() );
 
  // Override with custom update behaviour
  check.update = function( value ){
    this.checked = value;
  };
 
  // Add the new observer to our list of observers
  // for our main subject
  controlCheckbox.addObserver( check );
 
  // Append the item to the container
  container.appendChild( check );
}
