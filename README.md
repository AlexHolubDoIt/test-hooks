# Custom Hook Test Task
## 0. List of contents
<a href="#1-description">1. Description</a><br />
<a href="#2-installation">2. Installation</a><br />
<a href="#3-usage">3. Usage</a><br />
<a href="#4-test-cases">4. Test cases</a><br />
## <span id="1-description">1. Description</span>
Goal of this test task is to create custom React Hook to toggle between `n` arbitrary states where `n >= 1`. Hook can accept list of possible states and initial state. Hook returns current state and a function to change set new state.

Test task is completed using TypeScript.

`useToggleState` hook implements next interface:
```typescript
interface IUseStateHook<T> {
  (options: { possibleStates: T[]; initialState?: T }) => [T, (value?: T) => void]
}
```
## <span id="2-installation">2. Installation</span>
1. Clone repository
2. Install dependencies `npm i`
## <span id="3-usage">3. Usage</span>
1. Import `useToggleState` hook from [src/hooks/use-toggle-state](src/hooks/use-toggle-state.ts)
2. Call `useToggleState` hook like regular `useState`, with slight exception for provided to the hook argument
```typescript
const [state, setState] = useToggleState({ possibleStates, initialState })
```
where `possibleState` is list of possible values, that state can take, and `initialState` is optional key, with which we can provide initial value for a state. If `initialState` is omitted, or invalid, first possible value for state is used instead. If `possibleStates` is an empty array, or not defined, error with corresponding message will be thrown. Hook returns similar to `setState` value, tuple with first element for current state, and second element for function for setting new state. `setState` function can accept new state from list of possible states, or can be called without providing any arguments. That way, state changes to the next possible value. If new value is not valid state value, state won't change at all, and in dev mode corresponding warning message will be displayed 
## <span id="4-test-cases">4. Test cases</span>
Hook is tested against next criterion:
1. It should throw an exception with corresponding message, if provided to the hook list of possible states is empty or undefined
2. It should set initial state to the first possible state, if provided `initialState` is not a valid state
3. It should set initial state to provided under `initialState` value, if it is a valid value from possible states list
4. It should toggle between possible states, if calling `setState` function without any arguments
5. It should change state to new state, provided for `setState` function, if it's a valid value
6. It shouldn't change a state, if new state, provided for `setState` function is not valid

To run tests, run next command in the terminal
`npm run test`