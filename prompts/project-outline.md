We will create a next project "from prompt to image".

We need a form where a user can add a prompt and then click a button to generate an image based on the prompt.

The user can also select the image resolution and the quality (0 - 100).

We need to store the prompts and the generated images in a database.

We need to create a function to generate an image from a prompt.

We will use the Replicate API to generate the images.

We need to create a function to store a prompt and an image in the database.

We need to create a function to retrieve all prompts from the database.

They will be displayed in a table with the prompt, resolution, quality, and image.

Technical considerations:

We will use Next.js as the framework.

We use the App Router.

Make use of React Server Components. Avoid using fetch in useEffect hooks.

We will use shadcn/ui for the UI.

We will use SQLite for the database.

We don´t want to use any ORM.

Make sure to add all node package dependencies and shadcn components to the package.json file.
