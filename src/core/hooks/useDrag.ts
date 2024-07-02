import {useState, useEffect, useRef, useCallback} from 'react';
import {throttle} from "lodash";

interface DragState {
	isDragging: boolean;
	dragData: {
		x: number;
		y: number;
		percentX: number;
		percentY: number;
	};
}

interface DragCallBack {
	onDrag: (dragData: DragState['dragData']) => void;
	onMouseDown: () => void;
	onMouseUp: (DragState: DragState['dragData']) => void;
}

const useDrag = (container: HTMLElement, DragCallBack: Partial<DragCallBack>): DragState => {
	const [isDragging, setIsDragging] = useState(false);
	const dragData = useRef<DragState['dragData']>({x: 0, y: 0, percentX: 0, percentY: 0});

	const handleMouseDown = () => {
		setIsDragging(true);
		DragCallBack.onMouseDown?.()
	};

	const handleMouseUp = () => {
		setIsDragging(false);
		DragCallBack.onMouseUp?.(dragData.current)
	};

	const handleMouseMove = useCallback(throttle((e: MouseEvent) => {
		if (!isDragging) return;
		const {left, top} = container.getBoundingClientRect()
		const percentX = (e.clientX - left) / container.clientWidth;
		const percentY = (e.clientY - top) / container.clientHeight;
		dragData.current = {
			x: e.clientX,
			y: e.clientY,
			percentX: percentX,
			percentY: percentY
		}
		DragCallBack.onDrag?.(dragData.current)
	}, 10), [container, isDragging]);


	useEffect(() => {
		if (!container)
			return
		container.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			container.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, [isDragging, container]);

	return {isDragging, dragData: dragData.current};
};

export default useDrag;