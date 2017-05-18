<template>
    <div class="status">
        <div class="control">Status</div>
        <ul>
            <li class="item"
                :class="[r.status.toString(), {active: activeIndex === key}]"
                v-for="(r, key) in response"
                :key="key"
                @click="changeSchema(key)">
                <span>
                    <em class="code">{{r.status}}</em>
                    <em class="text">[{{r.statusText}}]</em>
                </span>
                <i class="el-icon-close" v-if="response.length > 1" @click.stop="deleteSchema(key)"></i>
            </li>
            <li class="item add" @click="addSchema">
                <i class="el-icon-plus"></i>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ['response', 'activeIndex'],
    methods: {
        addSchema() {
            this.$emit('add');
        },
        changeSchema(index) {
            this.$emit('change', index);
        },
        deleteSchema(index) {
            this.$emit('delete', index);
        }
    }
};
</script>
<style scoped>
.status .control {
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-bottom: 1px solid #d1dbe5;
}
.status .item {
    border-bottom: 1px solid #eee;
    padding: 8px 10px;
    cursor: pointer;
    opacity: 0.6;
    height: 36px;
    overflow: hidden;
}
.status .item em {
    font-style: normal;
}
.status .item .text {
    color: #333;
}
.status .item:not(.add):before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 10px;
    border-radius: 50%;
    vertical-align: middle;
}
.status .item:before {
    background-color: #333;
}
.status [class^='item 5']:before,
.status [class^='item 4']:before{
    background-color: red;
}
.status [class^='item 3']:before{
    background-color: #f5a623;
}
.status [class^='item 2']:before{
    background-color: #3eb63e;
}
.status [class^='item 1']:before{
    background-color: #aaa;
}
.status .item span {
    display: inline-block;
    vertical-align: middle;
    max-width: 92px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.status .item:not(.add) i {
    position: absolute;
    right: 10px;
    color: red;
    font-size: 12px;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    display: none;
    transform: scale(0.8);
    margin-top: 2px;
    border-radius: 3px;
}
.status .item:not(.add) i:hover{
    background-color: #fbcbcb;
}
.status .item.active,
.status .item:hover {
    opacity: 1;
    color: #666;
}
.status .item.active {
    background-color: #fafafa;
}
.status .item:hover i {
    display: inline-block;
}
.status .item.add {
    text-align: center;
}
.status .item.add:hover {
    background-color: #f8f8f8;
}
</style>
