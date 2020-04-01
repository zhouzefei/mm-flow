import { PureComponent } from "react";
class FlowNodeDetail extends PureComponent {
	state = {};
	// 监听change
	onChange = data => {
		const { editor, changeNode, needRemoveError } = this.props;
		const { uuid } = data;
		// 更新editor
		const node = editor.graph.node.nodes[uuid] || {};
		this.changeTimeout && clearTimeout(this.changeTimeout);
		this.changeTimeout = setTimeout(() => {
			node.data.config = data.config;
			node.data.name = data.name;

			// 移除节点上的error
			if (node.hasClass && node.hasClass("error") && needRemoveError) {
				node.removeClass("error");
			}

			// 节点展示文字
			const spacePad = 18; // 左右两边留白距离
			let showName = data.name;
			if (showName && showName.length > 10) {
				showName = showName.slice(0, 10) + "...";
			}
			node.select("text").node.innerHTML = showName || "";

			changeNode && changeNode({node});

			editor.graph.fire("node:change", {node});
			editor.graph.line.updateByNode(node);
			
		}, 300);
	};
	/**
	 * 渲染
	 */
	render() {
		const { activeNode } = this.state;
		let { editor, disabled, components } = this.props;
		if (!editor || !activeNode) return null;
		const input = [];
		const nodes = editor.graph.node.nodes;
		const lines = editor.graph.line.lines;
		const node = nodes[activeNode.uuid] || {};
		const fromLines = node.fromLines || [];
		fromLines.forEach(lineId => {
			const line = lines[lineId];
			input.push(nodes[line.data.from].data);
		});
		if (!input.length) {
			input[0] = { output: [] };
		}
		const Component = components[activeNode.component];
		return (
			<div
				className="flow-detail-panel"
				style={{
					width: activeNode.uuid ? 300 : 0
				}}
			>
				<div className="flow-detail-main">
					{
						Component && 
						<Component
							disabled={disabled}
							input={input}
							data={{...activeNode}}
							onChange={this.onChange}
						/>
					}
				</div>
			</div>
		);
	}
}
export default FlowNodeDetail;
