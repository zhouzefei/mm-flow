### 基于mm-flow的封装的工作流，暴露组件如下
|  组件   | 作用  |
|  ----  | ----  |
| ItemPanel  | 左侧栏目 |
| Item  | 左侧栏目子项 |
| ToolBar  | 头部bar |
| Command  | 头部操作项，撤销、回退、放大、缩小等 |
| Flow | 中间面板 |
| LineDetail | 线条详情面板 |
| NodeDetail | 节点详情面板 |



### Item参数
|  参数   | 参考值 | 作用  |
|  ----  | --- | ----  |
|  type  | flow-start | 节点类型 |
|  name  | 开始 | 节点名称 |
| size | [50, 50]  |大小|
| component |  audit | 节点详情加载的组件， 在Flow组件中传入具体的Component后续在Flow中会提及 |
| isRoot | true | 是否为跟节点 |
| nodeType | start | 节点类型,例如排他的场景type一样，所以需要通过nodeType区分排他开始、排他结束 |
| config | {} | 节点相关的属性，即节点详情中右侧的表单内容相关的值 |



### Command参数
|  参数   | 作用  |
|  ----  |  ----  |
|  redo  | 重做 |
|  undo  | 撤销 |
|  zoom-in  | 放大 |
|  zoom-out  | 缩小 |
|  fullscreen  | 适应画布 |
|  fullscreen-exit  | 世纪尺寸 |
|  自定义 {type:"",click:void 0}  | 其他按钮需要定义，注意type为antd中的Icon type |

```javascript
<Command 
    types={
        [
            "redo","undo","zoom-in","zoom-out","fullscreen","fullscreen-exit",
            {
                type:"eye",
                click:this.preview
            }
        ]
    }
/>
```




### Flow参数
|  参数   | 参考值 | 作用  |
|  ----  | --- | ----  |
|  checkNewLine  | void 0 | 判断节点之间是否可以链接，例如开始节点只能有输出节点 |
|  data  | {} | 面板中节点线条的初始化数据 |
| init | void 0  | 初始化flow的函数 |
| lineNeedConfig |  `({line, fromNode})=>{}` | 判断线条是否需要展示配置面板 |
| lineRed |  `({line, fromNode})=>{}` | 线条是否需要飘红 |
| onNodeClick | `({ node, fromNodes})=>{}`  | 节点点击事件 |
| onLineClick | `({line,fromNode,rightbarLine})=>{}` | 线条点击事件 |
| onLineAdd | `({line})=>{}` | 连接线条之间的回调 |
| click | void 0 | 点击面板空白事件 |
| changeNode | `({node})=>{console.log(node)}` | 监听节点详情中变化事件 |
| changeLine | `({line, fromNode}) => {}` | 监听线条详情中变化事件 |
| nodeComponents | `{ "audit": Audit,"base": Base}` | 将节点详情的表单组件传入，与Item中component对应 |
| lineComponents | `{"line": Line}` | 将线条详情的表单组件传入，与Item中component对应 |
|auditedNodes|`{...node,"status":2}`|一般用于审批流查看模式。节点信息基础上加上节点状态是审核中，已成功，异常|
|animate|void 0|自定义动画|