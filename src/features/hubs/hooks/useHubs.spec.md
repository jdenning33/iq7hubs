## `useHubs` Hook API Documentation

`useHubs` is a custom hook designed for managing Hubs within an application. It abstracts the complexities of creating, deleting, and updating Hubs, leveraging local storage for durable data persistence through browser sessions with Zustand's `persist` middleware.

### API Methods

#### `hubs: HubData[]`

-   An array of `HubData` objects representing each Hub.

#### `createHub(hubData: HubData): HubData`

-   Adds a new Hub to the persistent list.
-   **Parameters:**
    -   `hubData`: An object containing the Hub's details, excluding the `id` which is generated within the method.
-   **Returns:** The newly created `HubData` object, including its unique `id`.

#### `deleteHub(hubId: string): string`

-   Removes a Hub from the list based on its unique identifier.
-   **Parameters:**
    -   `hubId`: The unique identifier (`string`) of the Hub to be deleted.
-   **Returns:** The `id` of the deleted Hub as a confirmation.

#### `updateHub(hubData: HubData): void`

-   Updates the details of an existing Hub, identified by the `id` within the `hubData` object.
-   **Parameters:**
    -   `hubData`: An object representing the updated details of the Hub, including its `id`.
-   **Returns:** The updated `HubData` object.

#### `getHub(hubId: string): HubData | undefined`

-   **Parameters:**
    -   `hubId`: The unique identifier (`string`) of the Hub to be retrieved.
-   **Returns:** The identified `HubData` object if found, or undefined.
