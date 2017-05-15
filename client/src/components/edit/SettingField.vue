<template>
<div class="setting-field" :class="fullscreen ? 'fullscreen' : ''">
    <div class="hd">{{title}}
        <el-button type="info"
                   size="small"
                   :plain="true"
                   @click.natvie="switchFullscreen">{{fullscreen ? 'Esc' : '全屏'}}</el-button>
    </div>
    <div class="bd">
        <slot :fullscreen="fullscreen"></slot>
    </div>
</div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        }
    },
    methods: {
        keyupBehavior(e) {
            // 按Esc键退出全屏
            if (this.fullscreen && e.keyCode === 27) {
                this.fullscreen = false;
            }
        },
        switchFullscreen() {
            this.fullscreen = !this.fullscreen;
            if (this.fullscreen) {
                document.addEventListener('keyup', this.keyupBehavior);
            } else {
                document.removeEventListener('keyup', this.keyupBehavior);
            }
        }
    },
    data() {
        return {
            fullscreen: false
        };
    }
};
</script>
<style>
.setting-field {
    /*margin-top: 20px;*/
    /*overflow-x: scroll;*/
    background-color: #fff;
}
.setting-field.fullscreen {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
}
.setting-field.fullscreen > .hd {
    padding: 0 10px;
}
.setting-field.fullscreen > .bd {
    position: absolute;
    top: 42px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
}
.setting-field.fullscreen > .bd > div {
    height: 100%;
}
.setting-field > .hd {
    text-align: left;
    border-top: 1px solid #D3DCE6;
    border-bottom: 1px solid #D3DCE6;
    line-height: 36px;
    font-size: 16px;
    color: #C0CCDA;
    /*padding: 8px 0;*/
    line-height: 40px;
}
.setting-field > .hd button {
    float: right;
    margin: 6px 10px;
}
</style>
