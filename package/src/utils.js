export default class Utils {
	static mapObject (to, from) {
		for (var key in from) {
			if (from.hasOwnProperty(key)) {
				to[key] = from[key];
			}
		}
	}

	static shuffleArray (array) {
		var counter = array.length, temp, index;

		// While there are elements in the array
		while (counter > 0) {
			// Pick a random index
			index = Math.floor(Math.random() * counter);

			// Decrease counter by 1
			counter--;

			// And swap the last element with it
			temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}

		return array;
	}
}