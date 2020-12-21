import { PureComponent, Fragment } from "react";

export default class ItemPanel extends PureComponent {
    state = {
    	dragItem: undefined,
    	moving: false,
    	pageX: "",
    	pageY: ""
    }

	// 生成新节点
	onDrop = (item, e) => {
		const {size = []} = item || {};
		const { editor, onDrop } = this.props;
		const dom = editor.dom.node;
		const name = item.name;
		const transform = editor.paper.transform();
        const info = transform.globalMatrix.split();
        const { left, top } = dom && dom.getBoundingClientRect();
		if (e.clientX - left < 0 || e.clientY - top < 0) return;
		const x = (e.clientX - left - info.dx) / info.scalex - (size[0] / 2) * info.scalex;
		const y = (e.clientY - top - info.dy) / info.scalex - (size[1] / 2) * info.scalex;
		editor.graph.node.addNode(
			Object.assign({}, JSON.parse(JSON.stringify(item)), {
				name,
				x,
				y
			})
        );
        onDrop && onDrop(item,e);
	};

    onDrag(item) {
    	this.setState({
    		dragItem: item,
    		moving: false
    	});
    	this.addEvents();
    }

    addEvents() {
        const { onMove } = this.props;
    	const mousemove = e => {
            let { pageX, pageY }=e;
            if(onMove){
                const moveP=onMove(e);
                pageX = moveP.pageX;
                pageY = moveP.pageY;
            }
    		this.setState({
    			pageX: pageX,
    			pageY: pageY,
    			moving: true
    		});
    	};
    	const mouseup = e => {
    		this.onDrop(this.state.dragItem, e);
    		this.setState({
    			dragItem: undefined
    		});
    		window.document.removeEventListener("mousemove", mousemove);
    		window.document.removeEventListener("mouseup", mouseup);
    	};

    	window.document.addEventListener("mousemove", mousemove);
    	window.document.addEventListener("mouseup", mouseup);
    }

    render() {
    	const { dragItem = {}, moving, pageX = 0, pageY = 0 } = this.state || {};
		const {size = []} = dragItem || {};
        const { disabled, children, editor } = this.props
        const transform = editor && editor.paper.transform();
        const info = transform && transform.globalMatrix.split();
    	return (
    		<div className="flow-editor-sidebar">
				{
    				disabled &&
                    <div className="flow-item-mask"></div>
    			}
    			<div
    				style={{
    					left: dragItem.name ? pageX - (size[0] / 2) * info.scalex : -9999,
    					top: dragItem.name ? pageY - (size[1] / 2) * info.scalex : -9999,
    					display: moving && dragItem.name ? "block" : "none"
    				}}
    				className={`${dragItem.type || ""} flow-item drag-item`}
    			>
    				{
    					dragItem.image ?
                            <img src={dragItem.image}/>
    						: dragItem.name
    				}
    			</div>
				<div className="flow-item-panel">
					{
						React.Children.map(children, (child) => {
							return (
								<div
									draggable={false}
									onMouseDown={() => {
										this.onDrag(child.props);
									}}
								>{child}</div>
							)
						})
					}
				</div>
    		</div>
    	);
    }
}
