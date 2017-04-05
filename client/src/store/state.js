import apiInit from './apiInitData';
import config from '../../config';

const domain = process.env.NODE_ENV === 'development' ? config.dev.ajax : config.build.ajax;

const state = {
    groups: [],
    apiList: [],
    apiListLoading: false,
    apiListSuccess: false,
    api: apiInit(),
    apiQuery: {
        q: '',
        limit: 0,
        page: 0
    },
    apiCount: 0,
    mode: 'edit',
    reqParams: {},
    response: '',
    serverRoot: domain,
    isDslRight: true
};

export default state;
