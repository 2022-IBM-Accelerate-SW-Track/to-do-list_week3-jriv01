import { render, screen, fireEvent, getByTestId, getByText} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




 test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  // Getting input elements
  const inputTask = screen.getByRole("textbox", {name: /Add New Item/i});
  const inputDate = screen.getByRole("textbox", {name: /Due Date/i});
  const button = screen.getByRole("button", {name:/Add/i})
  // Adding same task twice
  fireEvent.change(inputTask, {target:{value:"Take out trash"}});
  fireEvent.change(inputDate, {target:{value:"01/01/2023"}});
  fireEvent.click(button);
  fireEvent.change(inputTask, {target:{value:"Take out trash"}});
  fireEvent.change(inputDate, {target:{value:"01/01/2023"}});
  fireEvent.click(button);
  // Checking if duplicate exists
  const check = screen.getAllByText(/Take out trash/i).length == 1;
  expect(check).toBe(true);
 });

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  // Getting input elements
  const inputDate = screen.getByRole("textbox", {name: /Due Date/i});
  const button = screen.getByRole("button", {name:/Add/i})
  // Adding task without name
  fireEvent.change(inputDate, {target:{value:"01/01/2023"}});
  fireEvent.click(button);
  // Checking if task exists
  const check = () => screen.getByText("1/1/2023");
  expect(check).toThrow();
 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  // Getting input elements
  const inputTask = screen.getByRole("textbox", {name: /Add New Item/i});
  const button = screen.getByRole("button", {name:/Add/i})
  // Adding task without due date
  fireEvent.change(inputTask, {target:{value:"Take out trash"}});
  fireEvent.click(button);
  // Checking if task exists
  const check = () => screen.getByText(/Take out trash/i);
  expect(check).toThrow();
 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  // Getting input elements
  const inputTask = screen.getByRole("textbox", {name: /Add New Item/i});
  const inputDate = screen.getByRole("textbox", {name: /Due Date/i});
  const button = screen.getByRole("button", {name:/Add/i})
  // Adding new task
  fireEvent.change(inputTask, {target:{value:"Take out trash"}});
  fireEvent.change(inputDate, {target:{value:"01/01/2023"}});
  fireEvent.click(button);
  // Clicking the checkbox
  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);
  // Checking if task got deleted
  const check = () => screen.getByText(/Take out trash/i);
  expect(check).toThrow();
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  // Getting input elements
  const inputTask = screen.getByRole("textbox", {name: /Add New Item/i});
  const inputDate = screen.getByRole("textbox", {name: /Due Date/i});
  const button = screen.getByRole("button", {name:/Add/i})
  // Adding two different tasks; one overdue
  fireEvent.change(inputTask, {target:{value:"Take out trash"}});
  fireEvent.change(inputDate, {target:{value:"01/01/2010"}});
  fireEvent.click(button);
  fireEvent.change(inputTask, {target:{value:"Walk the dog"}});
  fireEvent.change(inputDate, {target:{value:"01/01/2100"}});
  fireEvent.click(button);
  // Checking if colors are different
  const dueBack = screen.getByTestId(/Take out trash/i).style.background;
  const back = screen.getByTestId(/Walk the dog/i).style.background;
  const check = dueBack === back;
  expect(check).toBe(false);
 });
