import React, { PureComponent } from "react";
import { Row } from "antd";

export default class ToolBar extends PureComponent {
	render() {
		if (!this.props.editor) return null;
		const { style, children, className, editor } = this.props;
		return (
			<Row className={`flow-toolbar ${className || ""}`} {...style}>
				{
					React.Children.map(children, (child, index) => {
						const propsData = {
							index
						}
						if(child.props.types && Array.isArray(child.props.types)){
							propsData.editor = editor;
						}
						return React.cloneElement(child, {
							...propsData
						});
					})
				}
			</Row>
		);
	}
}
