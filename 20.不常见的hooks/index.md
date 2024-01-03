
# `useContext`
# `useReducer`
# `useCallback`
# `useMemo` /  `memo`
# `useRef`
# `useEffect` / `useLayoutEffect` / `useUpdateEffect`
`useEffect`始终进行首次监听 而useUpdateEffect则忽略首次执行  
`useLayoutEffect`会在浏览器下次绘制前执行传入的函数 完成状态和组件的更新  
在需要阻塞浏览器绘制时使用 例如需要阻止闪烁  