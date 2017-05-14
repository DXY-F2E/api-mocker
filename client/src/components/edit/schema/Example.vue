<template>
    <div class="schema-example">
        <div class="control">
            <el-button type="info"
                       size="small"
                       @click.natvie="buildExample">Schema => Example</el-button>
            <el-button type="info"
                       size="small"
                       :plain="true"
                       @click.natvie="buildSchema">Example => Schema</el-button>
        </div>
        <json-editor class="example-editor" v-model="example" @change="updateExample"></json-editor>
    </div>
</template>

<script>
import JsonEditor from '../../common/JsonEditor';
import { buildSchemaFormExample, buildExampleFormSchema } from '../../../util';
export default {
    components: {
        JsonEditor
    },
    data() {
        return {
            status: {
                success: true,
                msg: ''
            }
        };
    },
    computed: {
        example: {
            get() {
                return this.schema.example;
            },
            set(val) {
                window.console.log(val);
                this.$emit('buildExample', val);
            }
        }
    },
    methods: {
        updateExample(data) {
            window.console.log(data);
            this.status = data;
            if (data.success) {
                this.example = data.data;
            }
        },
        buildExample() {
            this.example = buildExampleFormSchema(this.schema);
        },
        buildSchema() {
            if (!this.status.success) {
                this.$message.error(this.status.msg);
                return;
            }
            const schema = buildSchemaFormExample(this.example);
            this.$emit('buildSchema', schema);
        }
    },
    props: {
        schema: {
            type: Object,
            required: true
        }
    }
};
</script>
<style>
.schema-example .control {
    padding: 10px 20px;
    border-bottom: 1px solid #d1dbe5;
}
.example-editor {
    height: 251px;
}
</style>
