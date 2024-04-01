# Updated Unit Management Features and Components Specification

## Features Overview

- **Recursive Unit Structure:** Enables units to contain child units, creating a tree-like hierarchy within an initiative.
- **Depth-based Display:** Units are displayed in columns, aligned according to their depth from the root unit, facilitating a clear hierarchical view.
- **Highlighting Relationships:** When a unit is selected, both its children and its parent lineage are highlighted to emphasize their relationships.

## Components Breakdown

##### `UnitTreeList`

**Description:** Displays units in a structured, hierarchical manner, organized into columns by depth from the root unit.

**Unique Features:**
- Renders the full tree of units associated with an initiative.
- Interactive selection highlights the selected unit along with its parent lineage and children.

##### `AddUnitButton`

**Description:** Initiates the process of adding a new unit, allowing for the addition of both root-level and child units.

**Special Consideration:** 
- The form may dynamically adjust to allow the specification of a parent unit when adding a child, emphasizing the unit's hierarchical placement.

##### `UnitForm`

**Description:** Used for adding new units or editing existing ones, accommodating the hierarchical nature of units.

**Context:** 
- Ideally integrated within a modal to streamline user interaction.
- Includes functionality for selecting a parent unit for new child units, reinforcing the tree structure.

##### `UnitDetailsModal`

**Description:** Provides detailed information about a unit, including its hierarchical position, children, and detailed attributes.

**Purpose:** 
- Delivers an in-depth view of a unit's details, enhancing user understanding of its role and connections within the initiative.

##### `DeleteUnitAction`

**Description:** Facilitates the deletion of units, with added logic for managing child units to prevent data loss.

**Consideration for Children:** 

- Includes safeguards and prompts regarding the handling of child units, ensuring intentional and informed deletion actions.

## Enhanced Interaction Flow

- **Hierarchical Visualization:** The `UnitTreeList` visually represents the unit hierarchy, dynamically adjusting as units are added, edited, or selected.
- **Interactive Engagement:** Selecting a unit in the `UnitTreeList` not only highlights it but also its related parent and child units, offering clarity on its context within the initiative.
- **Contextual Creation:** The `AddUnitButton` enables direct addition of child units to a selected parent unit, facilitating intuitive expansion of the unit hierarchy.
- **Detailed Insights:** The `UnitDetailsModal` enriches user interaction by providing comprehensive information and management options for the selected unit.

This specification caters to the nuanced requirements of unit management within initiatives, taking into account the recursive nature of units and providing a novel approach to visualizing and interacting with the unit hierarchy.