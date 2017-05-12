<template>
    <div class="schema-example">
        <div class="control">
            <el-button type="info" size="small">Schema => Example</el-button>
            <el-button type="info" size="small" :plain="true" >Example => Schema</el-button>
        </div>
        <json-editor class="example-editor"></json-editor>
    </div>
</template>

<script>
import JsonEditor from '../../common/JsonEditor';
export default {
    components: {
        JsonEditor
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
