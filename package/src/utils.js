export default class Utils {
	/**
	 * Copies the object keys from one object and sets them on another
	 * @param  {object} to   - The object to add keys to
	 * @param  {object} from - The object to get keys from
	 */
	static mapObject (to, from) {
		for (var key in from) {
			if (from.hasOwnProperty(key)) {
				to[key] = from[key];
			}
		}
	}

	/**
	 * Shuffles an array's indexes
	 * @param  {array} array - The array to shuffle
	 * @return {array}       - The shuffled array
	 */
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