import apiInit from './apiInitData';
import config from '../../config';

const domain = process.env.NODE_ENV === 'development' ? config.dev.ajax : config.build.ajax;

const state = {
    groups: [],
    apiList: [],
    apiListLoading: false,
    apiListSuccess: true,
    api: apiInit(),
    apiUnsaved: false,
    mode: 'edit',
    reqParams: {
        query: {
            value: {},
            params: []
        },
        body: {
            value: {},
            params: []
        },
        path: {
            value: {},
            params: []
        }
    },
    response: null,
    serverRoot: domain,
    isDslRight: true
};

export default state;
