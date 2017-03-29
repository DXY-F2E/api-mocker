import R from 'ramda';
import config from '../../config';

const domain = process.env === 'production' ? config.prod.ajax : config.dev.ajax;

export default R.map((url) => {
    return `${domain}${url}`;
})({
    GROUPS: '/server/group',
    GROUP: '/server/group/:groupId',
    APIS: '/server/api',
    GROUP_APIS: '/server/api/:groupId',
    API: '/server/api/:groupId/:apiId'
});
