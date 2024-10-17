// Define a type for the icons object
type Icon = {
  name: string;
  src: string;
};

// Dynamically import all image files in the current directory
export const icons = import.meta.glob('./*.{png,jpg,jpeg,svg}', { eager: true });

// Process the icons and create a typed array of objects with name and src
const processedIcons: Icon[] = Object.keys(icons).map((key) => ({
  name: key.replace('./', '').replace('.png', ''),      // Strip the "./" prefix from the file name
  src: (icons[key] as { default: string }).default, // Access the image URL from the default export
}));

export default processedIcons;
