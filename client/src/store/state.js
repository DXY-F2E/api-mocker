import apiInit from './apiInitData';
import config from '../../config';

const domain = process.env.NODE_ENV === 'development' ? config.dev.ajax : config.build.ajax;

const state = {
    groups: [],
    apiList: [],
    apiListLoading: false,
    apiListSuccess: false,
    api: apiInit(),
    apiPage: {
        count: 0,
        limit: 30,
        page: 0
    },
    serverRoot: domain,
    dsl: ''
};

export default state;
