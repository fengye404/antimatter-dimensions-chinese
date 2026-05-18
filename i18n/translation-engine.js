/**
 * Antimatter Dimensions 中文翻译引擎
 * 基于锅巴汉化 core.js 改良
 * 
 * 原作者: 麦子、JAR、小蓝、好阳光的小锅巴
 * 改良: fengye404
 * 
 * 工作原理:
 * 1. 加载翻译数据（JSON 词典 + 正则规则）
 * 2. 使用 MutationObserver 监控 DOM 变化
 * 3. 对新出现的文本节点执行翻译匹配
 */

(function() {
  'use strict';

  // 翻译数据将由 inject.js 注入到 window.__AD_I18N__
  const i18nData = window.__AD_I18N__ || {};
  const cnItems = i18nData.translations || {};
  const cnPostfix = i18nData.postfix || {};
  const cnExcludeWhole = (i18nData.excludeWhole || []).map(p => new RegExp(p));
  const cnRegReplace = (i18nData.regReplace || []).map(([p, r]) => [new RegExp(p), r]);

  const CNITEM_DEBUG = 0;

  // 性能优化: 使用 Map 加速查找
  const translationMap = new Map(Object.entries(cnItems));

  /**
   * 通过标签上下文匹配翻译
   */
  function cnItemByTag(text, itemgroup, node, textori) {
    for (let i in itemgroup) {
      if (i[0] === '.') {
        let current_node = node;
        while (current_node) {
          if (current_node.classList && current_node.classList.contains(i.substr(1))) {
            return itemgroup[i];
          } else if (current_node.parentElement && current_node.parentElement !== document.documentElement) {
            current_node = current_node.parentElement;
          } else {
            break;
          }
        }
      } else if (i[0] === '#') {
        let current_node = node;
        while (current_node) {
          if (current_node.id === i.substr(1)) {
            return itemgroup[i];
          } else if (current_node.parentElement && current_node.parentElement !== document.documentElement) {
            current_node = current_node.parentElement;
          } else {
            break;
          }
        }
      } else if (i[0] === '$') {
        if (document.querySelector(i.substr(1)) != null) {
          return itemgroup[i];
        }
      } else if (i[0] === '*') {
        if (textori.includes(i.substr(1))) {
          return itemgroup[i];
        }
      }
    }
    return null;
  }

  /**
   * 核心翻译函数
   */
  function cnItem(text, node) {
    if (typeof text !== 'string') return text;
    
    let textori = text;

    // 处理前缀（当前无前缀规则）
    let text_prefix = '';

    // 处理后缀
    let text_postfix = '';
    for (let postfix in cnPostfix) {
      if (postfix && text.endsWith(postfix)) {
        text_postfix = cnPostfix[postfix] + text_postfix;
        text = text.slice(0, -postfix.length);
      }
    }

    // 排除检查
    for (let reg of cnExcludeWhole) {
      if (reg.test(text)) {
        return text_prefix + text + text_postfix;
      }
    }

    // 正则替换
    for (let [pattern, replacement] of cnRegReplace) {
      if (pattern.test(text)) {
        return text_prefix + text.replace(pattern, replacement) + text_postfix;
      }
    }

    // 字典查找（Map 加速）
    if (translationMap.has(text)) {
      const value = translationMap.get(text);
      if (typeof value === 'string') {
        return text_prefix + value + text_postfix;
      } else if (typeof value === 'object') {
        const result = cnItemByTag(text, value, node, textori);
        if (result != null) {
          return text_prefix + result + text_postfix;
        }
      }
    }

    return text_prefix + text + text_postfix;
  }

  /**
   * 翻译任务管理器 - 批量处理 DOM 更新
   */
  const transTaskMgr = {
    tasks: [],
    addTask(node, attr, text) {
      this.tasks.push({ node, attr, text });
    },
    doTask() {
      let task;
      while (task = this.tasks.pop()) {
        // 检查目标文本与当前文本是否相同（避免反复设置触发 Observer）
        if (task.node[task.attr] !== task.text) {
          task.node[task.attr] = task.text;
        }
      }
    }
  };

  /**
   * 递归翻译子文本节点
   */
  function TransSubTextNode(node) {
    if (node.childNodes.length > 0) {
      for (let subnode of node.childNodes) {
        if (subnode.nodeName === '#text') {
          let text = subnode.textContent;
          let cnText = cnItem(text, subnode);
          if (cnText !== text) {
            transTaskMgr.addTask(subnode, 'textContent', cnText);
          }
        } else if (subnode.nodeName !== 'SCRIPT' && subnode.nodeName !== 'STYLE' && subnode.nodeName !== 'TEXTAREA') {
          if (!subnode.childNodes || subnode.childNodes.length === 0) {
            let text = subnode.innerText;
            if (text) {
              let cnText = cnItem(text, subnode);
              if (cnText !== text) {
                transTaskMgr.addTask(subnode, 'innerText', cnText);
              }
            }
          } else {
            TransSubTextNode(subnode);
          }
        }
      }
    }
  }

  /**
   * 初始化翻译引擎
   */
  function init() {
    console.log('[AD-i18n] readyState:', document.readyState);
    console.log('[AD-i18n] body 子节点数:', document.body.children.length);
    console.log('[AD-i18n] 加载中文翻译引擎');
    console.log(`[AD-i18n] 词典条目: ${translationMap.size}`);
    console.log(`[AD-i18n] 正则规则: ${cnRegReplace.length}`);

    const observer_config = {
      attributes: false,
      characterData: true,
      childList: true,
      subtree: true
    };

    const targetNode = document.body;

    // 翻译初始静态内容
    console.log('[AD-i18n] 首次扫描前 task 数:', transTaskMgr.tasks.length);
    TransSubTextNode(targetNode);
    console.log('[AD-i18n] 首次扫描后 task 数:', transTaskMgr.tasks.length);
    transTaskMgr.doTask();

    // 监听动态变化
    const observer = new MutationObserver(function(mutations) {
      observer.disconnect();

      for (let mutation of mutations) {
        if (mutation.target.nodeName === 'SCRIPT' || 
            mutation.target.nodeName === 'STYLE' || 
            mutation.target.nodeName === 'TEXTAREA') continue;

        if (mutation.target.nodeName === '#text') {
          let text = mutation.target.textContent;
          let cnText = cnItem(text, mutation.target);
          if (cnText !== text) {
            mutation.target.textContent = cnText;
          }
        } else if (!mutation.target.childNodes || mutation.target.childNodes.length === 0) {
          if (mutation.target.innerText) {
            let text = mutation.target.innerText;
            let cnText = cnItem(text, mutation.target);
            if (cnText !== text) {
              mutation.target.innerText = cnText;
            }
          }
        } else if (mutation.addedNodes.length > 0) {
          for (let node of mutation.addedNodes) {
            if (node.nodeName === '#text') {
              let text = node.textContent;
              let cnText = cnItem(text, node);
              if (cnText !== text) {
                node.textContent = cnText;
              }
            } else if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE' && node.nodeName !== 'TEXTAREA') {
              if (!node.childNodes || node.childNodes.length === 0) {
                if (node.innerText) {
                  let text = node.innerText;
                  let cnText = cnItem(text, node);
                  if (cnText !== text) {
                    node.innerText = cnText;
                  }
                }
              } else {
                TransSubTextNode(node);
              }
            }
          }
        }
      }

      transTaskMgr.doTask();
      observer.observe(targetNode, observer_config);
    });

    observer.observe(targetNode, observer_config);

    // 周期性重扫，弥补 MutationObserver 丢失的事件
    setInterval(() => {
      TransSubTextNode(targetNode);
      if (transTaskMgr.tasks.length > 0) {
        const count = transTaskMgr.tasks.length;
        transTaskMgr.doTask();
        if (CNITEM_DEBUG || count > 0) {
          console.log(`[AD-i18n] 周期重扫: 翻译 ${count} 个节点`);
        }
      }
    }, 1500);

    console.log('[AD-i18n] 翻译引擎已启动');
  }

  // 延迟启动，等 Vue 完全 mount 后再初始化
  function startEngine() {
    // 给 Vue 200ms mount 时间
    setTimeout(init, 200);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEngine);
  } else if (document.readyState === 'interactive') {
    document.addEventListener('DOMContentLoaded', startEngine);
  } else {
    startEngine();
  }
})();
