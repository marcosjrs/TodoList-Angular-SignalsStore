# TodoList

This is a simple TodoList application built with Angular, designed to help users manage their tasks efficiently. It includes features for task creation, tracking, categorization, and time management.

## Features

-   **Task Management**: Create, update, and delete tasks.
-   **Task Categorization**: Assign categories to tasks (configurable in settings).
-   **Task Filtering & Sorting**: Filter tasks by description, category, status, and day of the week. Sort tasks by description, category, or specific date.
-   **Task Minimization**: Minimize and maximize task cards to show only the description.
-   **Calendar View**: Visualize tasks on a calendar based on their specific dates.
-   **Chrono (Stopwatch)**: A simple stopwatch with play, pause, reset, and alarm functionalities.
-   **Settings**: Configure application settings such as language, dark mode, categories, and data management.
-   **Data Persistence**: All application data (tasks, categories, dark mode preference, language) is persisted in `localStorage`.
-   **Data Import/Export**: Export application data to a JSON file and import data from a JSON file.
-   **Internationalization (i18n)**: Supports multiple languages (English, Spanish, Galician).
-   **Dark Mode**: Toggle between light and dark themes.

## Installation

To set up and run the project locally, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd TodoList
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    ng serve
    ```
    Open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Usage

### Tasks View

-   **Add Task**: Click the "Show Form" (eye icon) button to reveal the task creation form. Fill in the details and click the "+" (plus icon) button to add a new task.
-   **Task Details**: Each task card displays its description, duration, status, category, days of week, and specific date.
-   **Start/Pause/Reset Task**: For tasks with a defined duration, use the play, pause, and reset icons to control the timer.
-   **Complete Task**: Check the checkbox to mark a task as completed. Unchecking a completed timed task will reset its duration to the initial value.
-   **Delete Task**: Click the trash can icon to remove a task.
-   **Minimize/Maximize Task**: Click the chevron up/down icon in the top-right corner of a task card to minimize or maximize its content.
-   **Filter & Sort Tasks**: Click the "Show Filter Form" (eye icon) button to reveal the filter and sort options. You can filter by description, category, status, and days of the week. You can also sort by description, category, or specific date. Click "Apply" to apply the filters and sorting.

### Calendar View

-   Navigate through months using the "<" and ">" buttons.
-   Tasks with a `specificDate` will appear on the corresponding day.
-   Click on a task in the calendar to view its detailed information in a popup.
-   From the task detail popup, you can also delete the task.

### Chrono View

-   **Start/Pause/Reset**: Use the play, pause, and reset icons to control the stopwatch.
-   **Set Alarm**: Click the eye icon to show/hide the alarm setting form. Enter hours, minutes, and seconds, then click "Set Alarm" to configure an audible alert when the stopwatch reaches the specified time.

### Settings View

-   **Select Language**: Change the application language (English, Spanish, Galician).
-   **Dark Mode**: Toggle the dark mode on or off.
-   **Categories Management**: Add or remove custom categories for your tasks.
-   **Data Management**:
    -   **Export Data**: Download all application data (tasks, categories, dark mode, language) as a JSON file.
    -   **Import Data**: Upload a JSON file to restore application data. This will overwrite existing data.
    -   **Clear Completed Tasks**: Delete all tasks marked as completed (requires confirmation).
    -   **Clear Past Dated Tasks**: Delete all tasks with a `specificDate` in the past (requires confirmation).

## Development

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## Disclaimer

This project is a personal learning and testing endeavor, not a professional application. I am aware that there are many areas that could be improved, including but not limited to:

-   **Error Handling**: More robust error handling and user feedback.
-   **State Management**: More advanced state management patterns for complex scenarios.
-   **Performance**: Further optimizations for large datasets or complex operations.
-   **Accessibility**: Enhanced accessibility features.
-   **Testing**: More comprehensive unit and end-to-end tests.
-   **UI/UX**: Further refinement of the user interface and user experience.
-   **Backend Integration**: Currently, all data is stored in `localStorage`. A backend integration would be necessary for multi-user support and more robust data persistence.

This project serves as a demonstration of various Angular features and best practices, and I am continuously learning and improving.
