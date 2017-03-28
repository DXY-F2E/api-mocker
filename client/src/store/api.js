import R from 'ramda';
export default R.map((url) => {
    return 'http://localhost:7001'.concat(url);
})({
    GROUPS: '/server/group',
    GROUP: '/server/group/:groupId',
    APIS: '/server/api',
    GROUP_APIS: '/server/api/:groupId',
    API: '/server/api/:groupId/:apiId'
});
