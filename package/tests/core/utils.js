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
});