<template>
    <div class="status">
        <div class="control">Status</div>
        <ul>
            <li class="item r.status" v-for="(r, key) in response" :key="key">
                <span>{{r.status}}</span>
                <i class="el-icon-close"></i>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ['response']
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
}
.status .item:before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 10px;
    border-radius: 50%;
    background-color: #4eb509;
    vertical-align: middle;
}
.status .item span {
    display: inline-block;
    vertical-align: middle;
}
.status .item i {
    float: right;
    color: red;
    font-size: 12px;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    display: none;
    transform: scale(0.8);
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
</style>
