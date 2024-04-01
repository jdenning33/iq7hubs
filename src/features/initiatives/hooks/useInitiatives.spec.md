## `useInitiatives` Hook API Documentation

`useInitiatives` is a custom hook designed to manage Initiatives within an application. It simplifies the process of creating, deleting, updating, and retrieving Initiatives, ensuring data persistence across browser sessions with Zustand's `persist` middleware.

### Data Model
For the `useInitiatives` hook to function effectively, you'll need an `InitiativeData` model. This model should include at least an `id` (string), `hubId` (to associate the Initiative with a specific Hub), `title` (string), and any other properties relevant to your application's needs.

```typescript
interface InitiativeData {
    id: string;
    hubId: string;
    title: string;
    description: string;
}
```



### API Definition

##### `initiatives: InitiativeData[]`

-   An array of `InitiativeData` objects representing each Initiative.

##### `createInitiative(initiativeData: InitiativeData) => InitiativeData`

-   Adds a new Initiative to the persistent list.
-   **Parameters:**
    -   `initiativeData`: An object containing the Initiative's details, excluding the `id` which is generated within the method.
-   **Returns:** The newly created `InitiativeData` object, including its unique `id`.

##### `deleteInitiative(initiativeId: string) => string`

-   Removes an Initiative from the list based on its unique identifier.
-   **Parameters:**
    -   `initiativeId`: The unique identifier (`string`) of the Initiative to be deleted.
-   **Returns:** The `id` of the deleted Initiative as a confirmation.

##### `updateInitiative(initiativeData: InitiativeData) => void`

-   Updates the details of an existing Initiative, identified by the `id` within the `initiativeData` object.
-   **Parameters:**
    -   `initiativeData`: An object representing the updated details of the Initiative, including its `id`.
-   **Returns:** Nothing. The Initiative within the list is updated.

##### `getInitiative(initiativeId: string) => InitiativeData | undefined`

-   Retrieves a specific Initiative by its unique identifier.
-   **Parameters:**
    -   `initiativeId`: The unique identifier (`string`) of the Initiative to be retrieved.
-   **Returns:** The identified `InitiativeData` object if found, or undefined.

