import apiInit from './apiInitData';
import config from '../../config';

const domain = process.env === 'production' ? config.prod.ajax : config.dev.ajax;

const state = {
    groups: [],
    apiList: [],
    api: apiInit,
    serverRoot: domain,
    dsl: ''
};

export default state;
