<template>
    <div class="name-box">
        <dl :class="{expanded: showDesc}">
            <dt class="name">
                <label @click="showDesc = !showDesc">
                    <i class="el-icon-caret-right"></i>
                    <span>{{api.name}}</span>
                </label>
            </dt>
            <dd class="desc">{{api.desc}}</dd>
        </dl>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showDesc: false,
            editMode: false
        };
    },
    computed: {
        api() {
            return this.$store.state.api;
        }
    }
};
</script>
<style>
.name-box dl > *{
    line-height: 20px;
    margin-bottom: 10px;
}
.name-box .desc {
    display: none;
    padding-left: 16px;
    color: #475669;
    font-size: 12px;
}
.name-box .expanded .desc {
    display: inline-block;
}
.name-box .name {
    font-size: 16px;
}
.name-box .name label {
    cursor: pointer;
    display: inline-block;
}
.name-box .name label > * {
    display: inline-block;
    vertical-align: middle;
}
.name-box .name i {
    color: #bfcbd9;
    font-size: 12px;
}
</style>
