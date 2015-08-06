import utils from '../../src/utils';

describe('Utility Suite', function () {
	describe('Method: mapObject', function () {
		var empty_object = {},
		    full_object = {
		    	one: 1,
		    	two: 2,
		    	three: 3
		    };

		beforeEach(function (done) {
			empty_object = {};
			done();
		});

		it('should copy the parameters from the full object to the empty object', function (done) {
			utils.mapObject(empty_object, full_object);
			empty_object.should.eql(full_object);
			done();
		});
	});

	describe('Method: shuffleArray', function () {
		var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		var array_clone = array.slice();

		it('should randomise the order of the array', function (done) {
			utils.shuffleArray(array);

			// Okay, there's a chance this test will fail
			// if the shuffled array results in the exact same order...
			array_clone.should.not.eql(array);
			done();
		});
	});
});