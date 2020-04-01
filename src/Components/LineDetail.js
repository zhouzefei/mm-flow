import { PureComponent } from "react";

class FlowLineDetail extends PureComponent {
	state = {};
	/**
	 * 配置变化
	 */
	onChange = data => {
		const { editor, changeLine } = this.props;
		const { activeLine } = this.state;
		// // 更新editor
		const line = editor.graph.line.lines[activeLine.uuid];
		const fromNode = editor.graph.node.nodes[data.from];
		this.changeTiemout && clearTimeout(this.changeTiemout);
		this.changeTiemout = setTimeout(() => {
			line.data = data;
			changeLine && changeLine({line,fromNode});
			editor.graph.line.updateLine(line.data.uuid);
			editor.graph.fire("line:change", {line});
		}, 300);
	};

	/**
	 * 渲染
	 */
	render() {
		const { activeLine, needConfig } = this.state;
		let { editor, disabled, components } = this.props;
		if (!editor || !activeLine) return null;
		const lines = editor.graph.line.lines;
		const line = lines[activeLine.uuid] || {};
		const Component = components[activeLine.component];
		return (
			<div
				className="flow-detail-panel"
				style={{
					width: activeLine.uuid ? 300 : 0
				}}
			>
				<div className="flow-detail-main">
					{
						Component && 
						<Component
							disabled={disabled}
							needConfig={needConfig}
							data={{...activeLine}}
							onChange={this.onChange}
							editor={ editor }
						/>
					}
				</div>
			</div>
		);
	}
}
export default FlowLineDetail;
