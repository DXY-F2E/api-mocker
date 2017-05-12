function Schema() {
    this.status = 200;
    this.statusText = 'status1';
    this.example = null;
    this.params = [{
        key: null,
        example: null,
        type: 'string',
        required: true,
        comment: null
    }];
}
module.exports = Schema;
