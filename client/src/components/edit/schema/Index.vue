<template>
    <div class="schema">
        <el-tabs type="card" class="tabs" v-model="activeTab">
            <el-tab-pane class="tab-item structure" label="Structure" name="structure">
                <params :params="localSchema.params"
                        @updateParams="paramsChanged"></params>
            </el-tab-pane>
            <el-tab-pane class="tab-item" label="JSON Schema" name="schema">
                <json-editor v-if="activeTab === 'schema'" v-model="localSchema" @change="schemaChanged"></json-editor>
            </el-tab-pane>
            <el-tab-pane class="tab-item" label="Example" name="example">
                <Example :schema="localSchema"></Example>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Params from '../params/Index';
import R from 'ramda';
import JsonEditor from '../../common/JsonEditor';
import Example from './Example';
export default {
    components: {
        Params,
        Example,
        JsonEditor
    },
    data() {
        return {
            activeTab: 'structure'
        };
    },
    props: {
        schema: {
            type: Object,
            required: true
        }
    },
    computed: {
        localSchema() {
            return R.clone(this.schema);
        }
    },
    methods: {
        schemaChanged(rs) {
            if (rs.success) {
                this.updateSchema(rs.data);
            }
        },
        paramsChanged() {
            this.updateSchema(this.localSchema);
        },
        updateSchema(data) {
            this.$emit('change', data);
        }
    }
};
</script>
<style>
.schema .tabs .el-tabs__item{
    border-top: 0 !important;
    border-radius: 0 !important;
    margin-left: -1px;
}
.schema .el-tabs__header {
    margin-bottom: 0;
}
.schema .el-tabs__item {
    height: 36px;
    line-height: 36px;
}
.schema .el-tabs__content {
    height: 300px;
    overflow-y: auto;
}
.schema .el-tabs__content .structure {
    padding: 10px 20px;
}
</style>
