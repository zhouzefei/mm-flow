import { PureComponent } from "react";
import { Row, Button, message } from "antd";
import { Flow, ToolBar, ItemPanel, Item, Command } from "../dist/MMFlow";
import { FLOW_ITEM } from "./ItemMap";
import Audit from "./FlowDetail/Audit";
import Base from "./FlowDetail/Base";
import Line from "./FlowDetail/Line";
import { data, auditedNodes } from "./data";
import "./index.less"

export default class Demo extends PureComponent{
    state={
        editor: null,
        auditedNodesData: null
    }

    componentDidMount(){
        const editor = this.editorRef.editor;
        this.setState({
            editor
        })
    }

    // 连接线判断
    checkNewLine = (data, editor) => {
    	const { graph: { node: { nodes } } } = editor;
    	const { from, to } = data;
    	const { disabled } = this.props;
    	// 只读模式下无法连接线条
    	if (disabled) {
    		return false;
    	}
    	// 通组件输入输出不能连接
    	if (from === to) return false;
    	// 开始，审批节点只能有一个输出
    	const fromNode = nodes[from];
    	if (["flow-start", "flow-audit"].indexOf(fromNode.data.type) > -1 && fromNode.toLines && fromNode.toLines.size > 0) {
    		message.error((fromNode.data.type === "flow-start" ? "开始节点" : "审批节点") + "只支持一个输出");
    		return false;
    	}
    	return true;
    };

    // 判断线条是否飘红
    lineRed = ({line}) => {
        const { editor } = this.state;
    	const { data = {} } = line;
    	const { from } = data || {};
    	const { nodes = {} } = editor.graph.node || {};
    	const fromNode = nodes[from];
    	let redLine = false;
    	// 排他开始 或 排他结束 或 并行结束 线条飘红
    	const { label, priority, condition } = data;
        const { data: startData } = fromNode;
    	if (startData.type === "flow-exclusivity") {
    		if (!(label && priority && condition)) {
    			redLine = true;
    		}
    	}
    	return redLine;
    }
    // 判断是否需要显示配置
    lineNeedConfig = ({line, fromNode}) => {
        if (fromNode.data.type === "flow-exclusivity") {
            return true;
        }
        return false
    }
    // 监听线条改变
    changeLine = ({line, fromNode}) => {
        const { label, priority, condition } = line.data;
        if (fromNode.data.type === "flow-exclusivity") {
            if (label && condition && priority) {
                line.removeClass("error");
            } else {
                line.addClass("error");
            }
        }
    }

    // 节点判空
    checkNodeEmpty = (node, functionType) => {
        const { config = {}, name } = node;
        if (!name) {
            return "节点名称不为空";
        }
        if (node.type === "flow-end" && !config.callbackUrl) {
            return "结束节点业务回调不能为空";
        }
        if (node.type === "flow-audit") {
            if (!config.type) {
                return "请选择审批节点类型";
            }
            const { countersignPassRate, auditUser, auditRole, formId } = config || {};
            if (config.auditPattern === "countersign") {
                if (!countersignPassRate) {
                    return "请输入通过率";
                }
            }
        }
    }

    // 线条判空
    checkLineEmpty = (line, fromNode) => {
        const { label, priority, condition } = line;
        if (!label) {
            return "条件名称不能为空";
        }
        if (fromNode && fromNode.type === "flow-exclusivity" && !priority) {
            return "请选择优先级";
        }
        if (!condition) {
            return "请输入表达式";
        }
    };

    handleFlowData = ({data, functionType, editor}) => {
        const { linesMap, nodesMap } = data;

        // 节点
        let nodes = Object.values(nodesMap);
        let errInfo = "";
        nodes.map(node=>{
            if (!errInfo) {
                errInfo = this.checkNodeEmpty(node, functionType);
                if (errInfo) {
                    const { nodes } = editor.graph.node;
                    console.log(editor.graph);
                    nodes[node.uuid].addClass("error");
                    message.warning(errInfo);
                }
            }
        });

        // 线条
        let lines = Object.values(linesMap);
        lines.forEach(line=>{
            const { from, to } = line;
            // 并行中的节点需加isParallel标识
            if (
                nodesMap[from].nodeType === "parallelStart" ||
                (nodesMap[to].isParallel && nodesMap[from].nodeType !== "parallelEnd")
            ) {
                nodesMap[to].isParallel = true;
            }
            // 排他必填项目
            if (!errInfo && nodesMap[from].type === "flow-exclusivity") {
                errInfo = this.checkLineEmpty(line, nodesMap[from]);
                if (errInfo) {
                    message.warning(errInfo);
                }
            }
        });

        if (errInfo) {
            return;
        }
        return {
            lines,
            nodes
        };
    }
    save = () => {
        const { editor } = this.state;
        const { data = {} } = editor.schema;
        const flowData = this.handleFlowData({data, editor});
        console.log(JSON.stringify(flowData))
    }
    init = () => {

    }
    // 预览
    preview = () => {
        this.setState({
            auditedNodesData: auditedNodes
        },()=>{
            this.editorRef.runFlow()
        })
    }
    render(){
        const { editor, auditedNodesData } = this.state;
        const { disabled } = this.props;
        console.log(auditedNodesData)
        return (
            <Row
                type="flex"
                className="flow-editor-bd"
            >

                <ItemPanel
                    editor={editor}
                    onDrop={()=>{console.log("zzf")}}
                    onMove={(e)=>{
                        return {
                            pageX: e.pageX-document.documentElement.scrollLeft,
                            pageY: e.pageY- document.documentElement.scrollTop
                        }
                    }}
                >
                    {
                        FLOW_ITEM &&
                        FLOW_ITEM.length>0 &&
                        FLOW_ITEM.map(item=>{
                            return (
                                <Item {...item} key={item.type}/>
                            )
                        })
                    }
                </ItemPanel>

                <div className="flow-editor-content">
                    <Row type="flex" className="flow-editor-hd">
                        <ToolBar editor={editor}  style={{ type:"flex", justify:"space-between", align:"middle" }}>
                            <Command
                                types={
                                    ["redo","undo","zoom-in","zoom-out","fullscreen","fullscreen-exit",{
                                        type:"eye",
                                        click:this.preview
                                    }]
                                }
                            />
                            <Button type="primary" onClick={this.save}>保存</Button>
                        </ToolBar>
                    </Row>
                    <Flow
                        ref = { (g) => this.editorRef = g }
                        checkNewLine={this.checkNewLine}
                        data={data}
                        init={this.init}
                        lineNeedConfig={this.lineNeedConfig}
                        lineRed={this.lineRed}
                        onNodeClick={({ node, fromNodes})=>{}} // 点击节点事件
                        onLineClick={({line,fromNode,rightbarLine})=>{}}  // 点击线条事件
                        onLineAdd={({line})=>{}}  // 添加完线条事件
                        click={()=>{}}  // 点击空白处
					    changeNode={({node})=>{
                            console.log(node)
                        }}
                        changeLine={this.changeLine}
                        nodeComponents={{
                            "audit": Audit,
                            "base": Base
                        }}
                        lineComponents={{
                            "line": Line
                        }}
                        // animate={()=>{}}
                        auditedNodes={auditedNodesData}
                    />
                </div>
            </Row>
        )
    }
}
