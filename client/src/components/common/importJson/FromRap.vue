<template>
<el-upload action=""
           :auto-upload="false"
           :show-file-list="false"
           accept="application/json"
           ref="importRapJson"
           :on-change="importJsonFromRap">
    <i class="el-icon-upload2"></i>导入Rap Json
</el-upload>
</template>

<script>
import ApiInit from '../../../store/apiInitData';
export default {
    props: {
        groupId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            methods: ['get', 'post', 'put', 'delete']
        };
    },
    methods: {
        importJsonFromRap(file) {
            const oReq = new XMLHttpRequest();
            oReq.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.responseText);
                    this.buildApisFormJson(json);
                } catch (err) {
                    this.$message.error('json格式错误');
                }
            };
            oReq.open('get', file.url, true);
            oReq.send();
            this.$refs.importRapJson.clearFiles();
        },
        buildReqParams(params, parameterList, methodType) {
            methodType = Number(methodType);
            const newParams = this.buildParams(parameterList);
            if (methodType === 1) {
                params.query = newParams;
            } else {
                params.body = newParams;
            }
            return params;
        },
        buildParams(parameterList) {
            return parameterList.map(p => {
                const param = {
                    key: p.identifier,
                    type: p.dataType,
                    required: true,
                    comment: p.remark
                };
                if (param.type === 'object') {
                    param.params = this.buildParams(p.parameterList);
                }
                if (param.type.indexOf('array') >= 0) {
                    param.items.type = param.type.replace('array<', '').replace('>', '');
                    param.type = 'array';
                }
                return param;
            });
        },
        buildApisFormJson(json) {
            const apis = [];
            json.projectData.moduleList.forEach(module => {
                module.pageList.forEach(page => {
                    page.actionList.forEach(action => {
                        window.console.log(action);
                        const apiName = `${module.name}-${page.name}-${action.name}`;
                        const api = new ApiInit();
                        api.name = apiName;
                        api.desc = action.description;
                        api.prodUrl = action.requestUrl;
                        api.group = this.groupId;
                        api.options.methods = this.methods[action.type];
                        api.options.params = this.buildReqParams(api.options.params, action.requestParameterList, action.type);
                        apis.push(api);
                    });
                });
            });
            window.console.log(apis);
        }
    }
};
</script>
<style>
</style>
