class Update extends BufferClient {
	constructor (profile_id) {
		super();
		this.data = BufferClient.getProfileById(profile_id);
	}
}