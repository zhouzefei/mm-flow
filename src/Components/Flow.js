import { PureComponent, Fragment } from "react";
import MMEditor from "@tntd/mm-editor";
import NodeDetail from "./NodeDetail";
import LineDetail from "./LineDetail";
import FlowExclusivity from "../sources/images/flow-exclusivity.svg";
import FlowParallel from "../sources/images/flow-parallel.svg";

const labelCfg = {
	"refX": 0,
	"refY": 0,
	"showNum": 10,
	"autoRotate": false,
	"style": {
		"fontSize": "12px",
		"fill": "#333",
		"stroke": "#f0f2f5"
	}
};

export default class Flow extends PureComponent {
    // 初始化编辑器事件
	addEditorEvent() {
        const { onNodeClick, onLineClick, onLineAdd, click, redoHistory, undoHistory } = this.props;
    	// 选中节点
    	this.editor.graph.on("node:click", ({ node }) => {
    		const fromLines = node.fromLines;
    		const fromNodes = [];
    		const nodes = this.editor.graph.node.nodes;
    		const lines = this.editor.graph.line.lines;
    		fromLines.forEach(lineId => {
    			const line = lines[lineId];
    			fromNodes.push(nodes[line.data.from].data);
			});
			this.rightbarNode.setState({
				activeNode: node.data,
				fromNodes
			});
			this.rightbarLine.setState({
				activeLine: {}
			});
			// 接收回调
			onNodeClick && 
			onNodeClick({
				node,
				fromNodes
			})
        });
        
    	// 选中线条
    	this.editor.graph.on("line:click", ({ line }) => {
			const { lineNeedConfig } = this.props;
			const fromNode = this.editor.graph.node.nodes[line.data.from];

			this.rightbarLine.setState({
				activeLine: line.data,
				needConfig:lineNeedConfig({line,fromNode})
			});

			this.rightbarNode.setState({
				activeNode: {}
			});

            onLineClick && onLineClick({ line, rightbarLine: this.rightbarLine, fromNode });
        });
        
    	// 添加完线条
    	this.editor.graph.on("line:add", ({ line }) => {
			line.data.component = "line";
			line.data.label = "";
			line.data.labelCfg = labelCfg;
			const { lineRed } = this.props;
			if(lineRed({line})){
				line.addClass("error");
			}
    		onLineAdd && onLineAdd({line});
    	});
        
    	// 空白页点击
    	this.editor.graph.on("paper:click", () => {
			this.rightbarNode.setState({
				activeNode: {},
				fromNodes:null
			});
			this.rightbarLine.setState({
				activeLine: {}
			});
    		click && click();
        });
        
    	// 监听撤销等事件
    	this.editor.on("redo", () => {
			this.watchHistory();
			redoHistory && redoHistory();
    	});

    	this.editor.on("undo", () => {
			this.watchHistory();
    		undoHistory && undoHistory();
    	});
	}

	watchHistory = () => {
		if (this.watchHistoryTimeout) {
			clearTimeout(this.watchHistoryTimeout);
		}
		this.watchHistoryTimeout = setTimeout(()=>{
			const { activeNode } = this.rightbarNode.state;
			const { activeLine } = this.rightbarLine.state;

			if (activeNode) {
				const nodes = this.editor.graph.node.nodes;
				const { uuid } = activeNode;
				const { data } = nodes[uuid] || {};
				this.rightbarNode.setState({
					activeNode: {...data}
				});
			}
			if (activeLine) {
				const lines = this.editor.graph.line.lines;
				const { uuid } = activeLine;
				const line = lines[uuid] || {};
				this.rightbarLine.setState({
					activeLine: line.data
				});
			}
		}, 0);
	}

	// 初始化组件
	initEditorShape = () => {
		const { editor } = this;
		if(!editor){
			return null;
		}
		// 开始
		editor.graph.node.registeNode(
			"flow-start",
			{
				render: (data, snapPaper) => {
					const node = snapPaper.circle(25, 25, 25);
					const text = snapPaper.text(25, 25, data.name);
					node.attr({
						fill: "#ca808b",
						class: "flow-icon-node"
					});
					text.attr({
						fill: "#fff"
					});
					return snapPaper.group(node, text);
				},
				linkPoints: [{ x: 0.5, y: 0 }, { x: 1, y: 0.5 }, { x: 0.5, y: 1 }, { x: 0, y: 0.5 }]
			},
			"default"
		);

		//  结束
		editor.graph.node.registeNode(
			"flow-end",
			{
				render: (data, snapPaper) => {
					const node = snapPaper.circle(25, 25, 25);
					const text = snapPaper.text(25, 25, data.name);
					node.attr({
						fill: "#748993",
						class: "flow-icon-node"
					});
					text.attr({
						fill: "#fff"
					});
					return snapPaper.group(node, text);
				},
				linkPoints: [{ x: 0.5, y: 0 }, { x: 1, y: 0.5 }, { x: 0.5, y: 1 }, { x: 0, y: 0.5 }]
			},
			"default"
		);

		// 审批
		editor.graph.node.registeNode(
			"flow-audit",
			{
				render: (data, snapPaper) => {
					let {name, iconPath} = data;
					if (name && name.length > 10) {
						name = name + "...";
					}
					let [icon, iconW] = [null, 0];
					if (iconPath) {
						icon = snapPaper.image(iconPath, 12, 8, 24, 24);
						iconW = icon.getBBox().w;
					}
					const spacePad = 18; // 左右两边留白距离
					const text = snapPaper.text(iconW ? (iconW + spacePad) :50, 20, name);
					const { w: textW } = text.getBBox();
					const node = snapPaper.rect(0, 0, Math.max(textW + (iconW + 36), 100), 40, 20, 20);
					node.attr({
						fill: "#bdd9fc",
						stroke: "#7faee8",
						class: "flow-icon-node"
					});
					text.attr({
						fill: "#333",
					});
					if(iconPath){
						text.attr({
							"textAnchor": "start"
						});
					}
					if (iconPath) {
						return snapPaper.group(node, text, icon);
					} else {
						return snapPaper.group(node, text);
					}

				},
				linkPoints: [{ x: 0.5, y: 0 }, { x: 1, y: 0.5 }, { x: 0.5, y: 1 }, { x: 0, y: 0.5 }]
			},
			"iconNode"
		);

		// 排他
		editor.graph.node.registeNode(
			"flow-exclusivity",
			{
				render: (data, snapPaper) => {
					const image = snapPaper.image(FlowExclusivity, 0, 0, 78, 72);
					const text = snapPaper.text(39, 36, data.name);
					text.attr({
						fill: "#333"
					});
					return snapPaper.group(image, text);
				},
				linkPoints: [{ x: 0.5, y: 0 }, { x: 1, y: 0.5 }, { x: 0.5, y: 1 }, { x: 0, y: 0.5 }]
			},
			"default"
		);

		// 并行
		editor.graph.node.registeNode(
			"flow-parallel",
			{
				render: (data, snapPaper) => {
					const image = snapPaper.image(FlowParallel, 0, 0, 78, 72);
					const text = snapPaper.text(39, 36, data.name);
					text.attr({
						fill: "#333"
					});
					return snapPaper.group(image, text);
				},
				linkPoints: [{ x: 0.5, y: 0 }, { x: 1, y: 0.5 }, { x: 0.5, y: 1 }, { x: 0, y: 0.5 }]
			},
			"default"
		);

		// 判断
		editor.graph.node.registeNode(
			"flow-decide",
			{
				render: (data, snapPaper) => {
					const image = snapPaper.image(FlowDecide, 0, 0, 78, 72);
					const text = snapPaper.text(39, 36, data.name);
					text.attr({
						fill: "#333"
					});
					return snapPaper.group(image, text);
				},
				linkPoints: [{ x: 0.5, y: 0 }, { x: 1, y: 0.5 }, { x: 0.5, y: 1 }, { x: 0, y: 0.5 }]
			},
			"default"
		);
	}

    componentDidMount(){
        const { mode, data, checkNewLine, init } = this.props;
		this.editor = new MMEditor({ dom: this.editorRef, mode });
		this.initEditorShape();
        if(checkNewLine){
            this.editor.graph.line.shapes["default"].checkNewLine = checkNewLine;
		}
		init && init();
        if(data){
			console.log(data);
            this.editor.schema.setInitData(data); // 初始值
        }
		this.addEditorEvent();
    }
    render() {
		const { className, disabled, nodeComponents, lineComponents, changeNode, changeLine, needRemoveError=true } = this.props;
    	return (
			<div className="flex-flow-wrap">
				<div
					className={`${className || ""} flow-editor-content flow`}
					ref = { (g) => this.editorRef = g }
				/>
				<NodeDetail
					changeNode={changeNode}
					editor={this.editor}
					components={nodeComponents}
					disabled={disabled}
					needRemoveError={needRemoveError}
					ref={ref => { this.rightbarNode = ref; }}
				/>
				<LineDetail
					changeLine={changeLine}
					editor={this.editor}
					components={lineComponents}
					disabled={disabled}
					ref={ref => { this.rightbarLine = ref; }}
				/>
			</div>
    		
    	);
    }
}
