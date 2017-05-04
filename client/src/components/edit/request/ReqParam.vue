<template>
    <div class="param fill">
        <el-row type="flex" class="row-bg" >
            <el-col class="name" :span="5">
                <label>{{param.key}}<code>[{{param.type}}]</code>:</label>
            </el-col>
            <el-col class="value">
                <el-input :placeholder="getPlaceholder(param)"
                          v-model="param.value"
                          readonly
                          @click.native="expand"
                          v-if="param.type === 'object'"></el-input>
                <el-input :placeholder="getPlaceholder(param)"
                          v-model="param.value"
                          @change="updateReqParam"
                          v-else></el-input>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: ['param'],
    methods: {
        getPlaceholder(p) {
            return p.required ? '必填' : '选填';
        },
        updateReqParam() {
            this.$emit('change', this.param);
        },
        expand() {
            this.$emit('expand');
        }
    }
};
</script>
<style>
</style>
