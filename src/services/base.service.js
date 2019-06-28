export default class BaseService {

    constructor(model) {
        this.model = model;
    }

    async findById(id) {
        return this.model.query().findById(id);
    }

    async findByIds(ids) {
        return this.model.query().whereIn('id', ids);
    }

    async findAll() {
        return this.model.query();
    }
}
