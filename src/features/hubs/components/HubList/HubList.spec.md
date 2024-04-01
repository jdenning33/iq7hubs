## `HubList` Component Documentation

The `HubList` component is designed to fetch and display a list of all Hubs currently managed within the application. It leverages the `useHubs` custom hook for accessing the array of Hubs and renders them in a user-friendly table format. Additionally, each Hub in the list can be clicked to navigate to a detailed view or page dedicated to that Hub.

### Features

- **Retrieves Hubs:** Uses the `getHubs` method from the `useHubs` hook to fetch the current list of Hubs.
- **Table Format Display:** Presents each Hub's details in a table, improving readability and organization.
- **Interactivity:** Enables clicking on a Hub to open a detailed page or view for that Hub, facilitating easy access to more information or actions related to the Hub.

### Usage

Import the `HubList` component into your React component file and include it in your JSX to display the list of Hubs:

```jsx
import HubList from './path/to/HubList';

const App = () => {
  return (
    <div>
      <h1>Hubs</h1>
      <HubList />
    </div>
  );
};

export default App;
