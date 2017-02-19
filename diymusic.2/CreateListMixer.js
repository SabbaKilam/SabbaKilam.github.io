/**
 * Author: Abbas Abdulmalik
 * Creation Date: April 15, 2016
 * Title:  CreateListMixer
 * Revised: June 7, 2016
 * Purpose: Factory creates a function that
 * returns a random item from collection provided (array or object)
 * Notes: Example-> var list = ["a", "short", "list"];//three (3) items to test
 *  				var getRandomItem = CreateListMixer();
 * 					getRandomItem(list);//returns first of randomized list
 * 					getRandomItem();//returns next item
 * 					getRandomItem();//returns next item (last of three)
 * 					getRandomItem();//new first item from re-ramdomized list
 *					// a new list;					
 *					var list2 = { record1: "string", record2: "anotherString", ...};
 * 					getRandomItem(list2);//returns first of new randomized list2
 * 					getRandomItem();//etc.
 * Returns a property name for objects or an array member for arrays;
 * Returns 'false' if argument of function is not an object (fails typeof arg === 'object')
 * 
*/
function CreateListMixer(){
	var	list=[], 
		randList= [],
		listLength= 0,
		itemReturned= null,
		itemReturnedIndex= -1
	;
	return function(){
		if(arguments[0]){
			if(typeof arguments[0] === 'object'){
					list = arguments[0];
				if({}.toString.call(arguments[0]) === '[object Object]'){
					list = Object.keys(list);
				}
				randList = randomize(list);
				listLength = list.length;
			}
			else{
				return false;
			}
		}
		//----| no args activity: return next random item |----
		if(itemReturnedIndex >= listLength-1){
			do{
				randList = randomize(list);
				itemReturnedIndex = -1;
			}
			while(randList[itemReturnedIndex +1] === itemReturned);
		}
		itemReturnedIndex++;
		itemReturned = randList[itemReturnedIndex];
		return itemReturned;
		//-----helpers-----
		function randomize(x){
			var mixedIndexes = [];
			var randomList = [];
			randomizeIndexes();
			return randomList;
			//----sub helper----
			function randomizeIndexes(){
				// random numbers for mixedIndexes
				while(mixedIndexes.length !== x.length){
					var match = false;
					var possibleIndex = (x.length)*Math.random();
					possibleIndex = Math.floor(possibleIndex);
					mixedIndexes.forEach(function(m){
						if(m === possibleIndex){
							match = true;
						}
					});
					if(!match){
						mixedIndexes.push(possibleIndex);
					}
				}
				for(var i = 0; i < x.length; i++){
					var newIndex = mixedIndexes[i];
					randomList.push(list[newIndex]);
				}
			}		
		}
	};//===| END returned function |======
}//===| END enclosing factory function======
function scrammbleThis(collection){
	var mix = CreateListMixer();
	var list = collection;
	var mixedList =[];
	var firstNewItem = mix(list);
	var size = 0;
	mixedList.push(firstNewItem);
	
	if(Object.prototype.toString.call(collection) === '[object Array]'){
		size = collection.length;
	}
	else{
		size = Object.keys(collection).length;		
	}
	
	for(var i = 0; i< size - 1; i++){
		var nextItem = mix();
		mixedList.push(nextItem);
	}
	return mixedList;
}