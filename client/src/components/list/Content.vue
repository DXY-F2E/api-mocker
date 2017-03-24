<template>
    <el-col :span="24">
        <div class="content-wrap">
            <div id="content">
                <search></search>
                <ul class="api-list">
                    <li v-for="api in apiList">
                        <api :data="api"></api>
                    </li>
                </ul>
            </div>
        </div>
    </el-col>
</template>
<script>
import Search from './Search';
import Api from './Api';
export default {
    components: {
        Search,
        Api
    },
    data() {
        return {
            apiList: [
                {
                    id: '1',
                    url: '/api/get/356',
                    name: '这是一个测试接口',
                    author: 'zhangfx@dxy.cn'
                },
                {
                    id: '2',
                    url: '/api/put/789',
                    name: '这是一个put接口',
                    author: 'zhangfx@dxy.cn'
                },
                {
                    id: '3',
                    url: '/api/post/2387428374',
                    name: '这是一个名字很长很长很长很长的接口接口',
                    author: 'lqw@dxy.cn'
                },
                {
                    id: '4',
                    url: '/api/get/356',
                    name: '这是一个测试接口',
                    author: 'lqw@dxy.cn'
                }
            ]
        };
    }
};
</script>
<style>
.content-wrap {
    padding: 20px;
    background-color: #F9FAFC;
    height: 100%;
}
.content {
    text-align: left;
}
.api-list {
    margin: 10px -10px;
}
.api-list li {
    display: inline-block;
    margin: 10px;
}
</style>
