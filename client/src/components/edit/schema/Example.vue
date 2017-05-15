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
        <div class="editor">
            <json-editor class="example-editor"
                         v-model="example"
                         :resize-act="fullscreen"
                         :fullscreen-tool="false"
                         @change="updateExample"></json-editor>
        </div>
    </div>
</template>

<script>
import JsonEditor from '../../common/jsonEditor/Index';
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
        },
        fullscreen: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style>
.schema-example {
    height: 100%;
}
.schema-example .control {
    padding: 10px 20px;
    border-bottom: 1px solid #d1dbe5;
}
.schema-example .editor {
    position: absolute;
    top: 49px;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>
