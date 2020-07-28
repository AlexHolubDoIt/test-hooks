import { renderHook, act } from "@testing-library/react-hooks";
import { useToggleState } from "./use-toggle-state";

describe("Toggle State Hook", () => {
  it("Should throw an error, if less then one possible state is provided to the hook", () => {
    const { result } = renderHook(() => useToggleState({ possibleStates: [] }));

    expect(result.error).toBeDefined();
    expect(result.error.message).toBe("List of possible states must contain at least one item");
  });

  it("Should set state to first possible state, if provided initial state is not from the list of possible states", () => {
    const testPossibleStates = [
      [15, 10, 5, 25, 0],
      ["foo", "bar", "baz", "qux"],
      [{ foo: "bar" }, { bar: "baz" }, { baz: "qux" }],
    ];
    const { result: resultNumbers } = renderHook(() =>
      useToggleState({ possibleStates: testPossibleStates[0] as number[] })
    );
    const { result: resultStrings } = renderHook(() =>
      useToggleState({ possibleStates: testPossibleStates[1] as string[] })
    );
    const { result: resultObjects } = renderHook(() =>
      useToggleState({ possibleStates: testPossibleStates[2] as any[] })
    );

    expect(resultNumbers.current[0]).toEqual(testPossibleStates[0][0]);
    expect(resultStrings.current[0]).toEqual(testPossibleStates[1][0]);
    expect(resultObjects.current[0]).toBe(testPossibleStates[2][0]);
  });

  it("Should set initial state to value, provided under initialState key", () => {
    const testPossibleStates = [
      [15, 10, 5, 25, 0],
      ["foo", "bar", "baz", "qux"],
      [{ foo: "bar" }, { bar: "baz" }, { baz: "qux" }],
    ];

    const { result: resultNumbers } = renderHook(() =>
      useToggleState({ possibleStates: testPossibleStates[0] as number[], initialState: testPossibleStates[0][2] })
    );
    const { result: resultStrings } = renderHook(() =>
      useToggleState({ possibleStates: testPossibleStates[1] as string[], initialState: testPossibleStates[1][2] })
    );
    const { result: resultObjects } = renderHook(() =>
      useToggleState({ possibleStates: testPossibleStates[2] as any[], initialState: testPossibleStates[2][2] })
    );

    expect(resultNumbers.current[0]).toEqual(testPossibleStates[0][2]);
    expect(resultStrings.current[0]).toEqual(testPossibleStates[1][2]);
    expect(resultObjects.current[0]).toBe(testPossibleStates[2][2]);
  });

  it("Should toggle between possible states if no arguments provided to setState function", () => {
    const testPossibleStates = [0, 5, 4, 10, 15];
    const { result } = renderHook(() =>
      useToggleState({
        possibleStates: testPossibleStates,
        initialState: testPossibleStates[0],
      })
    );

    // Each time state value should equal to the next possible state. When end of list has been reached
    // state value loops from beginning of the possible states
    for (let i = 0; i < testPossibleStates.length; i++) {
      expect(result.current[0]).toEqual(testPossibleStates[i]);

      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toEqual(testPossibleStates[i === testPossibleStates.length - 1 ? 0 : i + 1]);
    }
  });

  it("Should change current state to newly provided, if new state is valid", () => {
    const testPossibleStates = [0, 1, 2, 3, 4, 5];
    const { result } = renderHook(() =>
      useToggleState({
        possibleStates: testPossibleStates,
        initialState: 3,
      })
    );

    act(() => {
      result.current[1](testPossibleStates[1]);
    });

    expect(result.current[0]).toEqual(testPossibleStates[1]);

    act(() => {
      result.current[1](testPossibleStates[4]);
    });

    expect(result.current[0]).toEqual(testPossibleStates[4]);
  });

  it("Shouldn't change state if provided new state is invalid", () => {
    const testPossibleStates = [0, 1, 2, 3, 4, 5];
    const { result } = renderHook(() => useToggleState({ possibleStates: testPossibleStates }));

    let currentState = result.current[0];

    act(() => {
      result.current[1](42);
    });

    expect(result.current[0]).toEqual(currentState);

    act(() => {
      result.current[1]();
    });

    currentState = result.current[0];

    expect(result.current[0]).toEqual(currentState);
  });
});
