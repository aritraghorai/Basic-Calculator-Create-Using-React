import { useReducer } from 'react';
import DigitButtton from './DigitButtton';
import OperationButton from './OperationButton';
import './Style.css'



export const ACTION = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELTTE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'chhose-operation',
  EVALUATE: 'evaluate'
}
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTION.ADD_DIGIT:
      {
        if (state.overwrite) {
          return {
            ...state,
            current_operand: payload.digit,
            overwrite: false
          }
        }
        if (payload.digit === "0" && state.current_operand === "0") return state
        if (state.current_operand && payload.digit === "." && state.current_operand.includes(".")) return state
        return {
          ...state,
          current_operand: `${state.current_operand || ""}${payload.digit}`
        }
      }
    case ACTION.CLEAR:
      return {}
    case ACTION.CHOOSE_OPERATION:
      if (state.current_operand == null && state.previous_operand == null)
        return state
      if (state.current_operand == null)
        return {
          ...state,
          operation: payload.operation
        }
      if (state.previous_operand == null) {
        return {
          ...state,
          operation: payload.operation,
          previous_operand: state.current_operand,
          current_operand: null
        }
      }
      return {
        ...state,
        previous_operand: calculate(state),
        operation: payload.operation,
        current_operand: null,

      }
    case ACTION.EVALUATE:
      if (state.current_operand == null || state.previous_operand == null || state.operation == null)
        return state;
      return {
        ...state,
        previous_operand: null,
        current_operand: calculate(state),
        operation: null,
        overwrite: true
      }
    case ACTION.DELTTE_DIGIT:
      if (state.overwrite)
        return {
          ...state,
          current_operand: null,
          overwrite: false
        }
      if (state.current_operand == null)
        return state
      if (state.current_operand.length === 1)
        return {
          ...state,
          current_operand: null
        }
      return {
        ...state,
        current_operand: state.current_operand.slice(0, -1)
      }

  }
}
function calculate({ current_operand, previous_operand, operation }) {
  const pre = parseFloat(previous_operand)
  const curr = parseFloat(current_operand)
  if (isNaN(pre) || isNaN(curr)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = pre + curr
      break;
    case "-":
      computation = pre - curr
      break;
    case "*":
      computation = pre * curr
      break;
    case "÷":
      computation = pre / curr;
      break;
  }
  return computation.toString()
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperant(operand) {
  if (operand == null)
    return
  const [integer, decimal] = operand.split(".")
  if (decimal == null)
    return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
function App() {
  const [{ current_operand, previous_operand, operation }, dispatch] = useReducer(reducer, {})
  return (
    <>
      <h1 className="heading">Basic Calculator Build Using React</h1>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">{formatOperant(previous_operand)} {operation}</div>
          <div className="current-operand">{formatOperant(current_operand)}</div>
        </div>
        <button className="span-two" onClick={() => dispatch({ type: ACTION.CLEAR })}>AC</button>
        <button onClick={() => dispatch({ type: ACTION.DELTTE_DIGIT })}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch}></OperationButton>
        <DigitButtton digit="1" dispatch={dispatch}></DigitButtton>
        <DigitButtton digit="2" dispatch={dispatch}></DigitButtton>
        <DigitButtton digit="3" dispatch={dispatch}></DigitButtton>
        <OperationButton operation="*" dispatch={dispatch}></OperationButton>
        <DigitButtton digit="4" dispatch={dispatch}></DigitButtton>
        <DigitButtton digit="5" dispatch={dispatch}></DigitButtton>
        <DigitButtton digit="6" dispatch={dispatch}></DigitButtton>
        <OperationButton operation="+" dispatch={dispatch}></OperationButton>
        <DigitButtton digit="7" dispatch={dispatch}></DigitButtton>
        <DigitButtton digit="8" dispatch={dispatch}></DigitButtton>
        <DigitButtton digit="9" dispatch={dispatch}></DigitButtton>
        <OperationButton operation="-" dispatch={dispatch}></OperationButton>
        <DigitButtton digit="." dispatch={dispatch}></DigitButtton>
        <DigitButtton digit="0" dispatch={dispatch}></DigitButtton>
        <button className="span-two" onClick={() => dispatch({ type: ACTION.EVALUATE })}>=</button>
      </div >
    </>
  )
}

export default App;
