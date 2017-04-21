import apiInit from './apiInitData';
import config from '../../config';

const domain = process.env.NODE_ENV === 'development' ? config.dev.ajax : config.build.ajax;

const state = {
    groups: [],
    apiList: [],
    apiListLoading: false,
    apiListSuccess: true,
    api: apiInit(),
    mode: 'test',
    reqParams: {
        query: [],
        body: [],
        path: []
    },
    response: null,
    serverRoot: domain,
    isDslRight: true
};

export default state;
