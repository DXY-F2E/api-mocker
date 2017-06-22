const switchSideBar = (el) => {
    window.console.log('switchSideBar');
    if (el.clientWidth) {
        el.style.display = 'none';
    } else {
        el.style.display = 'block';
    }
};
// 75-K, 66-B
const mapKeys = [75, 66];
let thisEl;
let codes = [];
const matchLength = (mapKeys, keys) => mapKeys.filter((k, i) => k === keys[i]).length;
const isMatchKey = (e, mapKeys) => {
    const key = e.keyCode;
    if ((e.ctrlKey || e.metaKey) && !!mapKeys.find(k => key === k)) {
        codes.push(key);
        const length = matchLength(mapKeys, codes);
        if (length === mapKeys.length) {
            codes = [];
            e.preventDefault();
            return true;
        }
        if (length === codes.length) {
            return false;
        }
        codes = [];
        return false;
    } else {
        codes = [];
        return false;
    }
};
// 按下ctrl|command + k + b 触发元素消失
const onKeydown = e => isMatchKey(e, mapKeys) && switchSideBar(thisEl);
export default {
    bind(el) {
        thisEl = el;
        document.addEventListener('keydown', onKeydown);
    },
    unbind() {
        document.removeEventListener('keydown', onKeydown);
    }
};
