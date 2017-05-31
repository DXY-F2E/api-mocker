import apiInit from './apiInitData';
import { getDomain } from '../util';

const domain = getDomain();

const state = {
    user: null,
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
    response: {},
    serverRoot: domain,
    dslStatus: {
        success: true,
        msg: ''
    }
};

export default state;
