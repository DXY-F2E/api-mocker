import Mock from 'mockjs'
let buildExampleFormSchema = null;
let buildExample = null;
buildExampleFormSchema = (schema) => {
    const example = {};
    schema.params.forEach(param => {
        example[param.key] = param.example || buildExample(param);
    });
    return Mock.mock(example);
};
buildExample = (param) => {
    switch (param.type) {
        case 'object':
            return buildExampleFormSchema(param);
        case 'array':
            return [buildExample(param.items)];
        case 'number':
            return Math.ceil(Math.random() * 10000);
        case 'boolean':
            return true;
        default:
            return 'value';
    }
};
export default buildExampleFormSchema;