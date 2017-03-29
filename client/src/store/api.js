import R from 'ramda';
const domain = 'http://localhost:7001';
export default R.map((url) => {
    return `${domain}${url}`;
})({
    GROUPS: '/server/group',
    GROUP: '/server/group/:groupId',
    APIS: '/server/api',
    GROUP_APIS: '/server/api/:groupId',
    API: '/server/api/:groupId/:apiId'
});
