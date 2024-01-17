# Creating an instrument SVG
Create an SVG containing images or paths for relevant note triggers.  

Each image element should have an accompanying group with the class '.hc', containing paths or shapes outlining the trigger shape.

NB. hc stands for high contrast, since these paths can also be used to generate an outline to enhance contrast in some cases.

## Using Illustrator

### Script
The script generates sillhouettes of the instrument's triggers, and places them in a group with the class '.hc'.

The outline may be too rough to use as-is (especially for the high contrast option), but can be used as a starting point for manual editing.
#### Patching
The script may leave some white areas depending on the shading of the instrument, and possibly generate multiple paths. Dragging over these will create gaps in the user's touch pickup, leading to retriggering. 

- Select the largest shape within the generated sillhouette, and use the "blob brush" tool to fill in any white areas.  
- Make sure other paths have been deleted, unless there is a good reason for including multiple retriggers on the same note. You may need to go into the layers view to select these manually.

Upon export, this should provide a single path for the instrument.

Before patching (multiple paths):
```html
 <path d="M699,496c.29-1.17,1.18-2.64.77-3.46-2.1-4.25-.24-7.14,2.81-9.78l.08-.19c.32-.58,1-1.55.89-1.69-4.68-4.82.26-11-2.26-16a36.33,36.33,0,0,0-3.22-4.42c.87-1.15,2.78-3,3.82-5.32.63-1.38.05-3.4-.23-5.1-.34-2.05-1.42-4.1-1.31-6.1.2-3.54,1.07-7,1.79-11.38l-11,6.83-2.43-6.07h-2.48l1.09-3.45-3.45,2c-.81-1.48-1.63-2.95-2.33-4.22l9-4.3L687,418.77l-2.92,3.15-1.43-.4c2.91-4.92.93-6.92-3.49-8.19-1.33-.38-2.91-2.76-2.95-4.26-.23-8.46,0-16.93,0-25.4,0-3.14-.15-6.28-.16-9.42q-.09-23.83-.15-47.68c0-13.17.1-26.35,0-39.52,0-3.81-.52-7.63-.87-11.44s1-5.47,5-5.45c13.3.06,26.54.59,39.67,2.87q20.91,3.64,41.84,7.14c3.38.57,4.69,2.47,4.81,5.85.32,9.15,1.27,18.29,1.25,27.43,0,20.69-.75,41.38-.67,62.06.06,16.21,1.27,32.42,1.27,48.62,0,10.53-1.44,21.05-1.84,31.59-.19,4.71.67,9.45.92,14.18.43,8.38,1.95,16.76-1.81,25-1,2.08.59,5.19.51,7.81q-1.41,50.07-3,100.12c-.1,3.26-1.4,5-4.93,5.61-6,1.09-11.83,3.5-17.86,4.22-8.59,1-17.31,1-26,1.52-4.44.24-8.87.73-13.3.77-8.38.07-16.76-.09-25.14-.18-5.6-.06-6.1-.67-5.84-6.47.64-14.44,1.43-28.87,1.83-43.31.57-20.85.85-41.7,1.28-62.56,0-1.63.24-3.27.41-5.53l5.49,2.95-2.16,5c5.2-1.5,6.58-5.72,7.35-9.61.56-2.83,1.3-3.79,4-3.57a7.32,7.32,0,0,0,2.9-.37c4.43-1.56,6.69-.21,8,4.86l-10.15-1.87.63,6.37Zm27.64,37.3,2-.18-2.08-6.42c-1.15.51-2.76.71-3.34,1.6-.81,1.21-.85,2.94-1.22,4.44l1.41.36c.6-1.63,1.21-3.25,2.19-5.92Z"/>
<path d="M674.69,491.8V450.12l1.67,0v10.46l.81.1,1.26-3.45c.23,0,.66-.12.77,0,1,1.22,1.89,2.48,2.82,3.73l-5.13,3.26C676.15,473.46,675.35,483.49,674.69,491.8Z"/>
<path d="M702.69,482.61l-.08.19-.65-.66Z"/>
<path d="M745.78,440.31V585L673,538.55l3.23-129.48,49.15-20.89Z"/>
```
After patching (single path):
```html
 <path d="M767.32,469.9c-.25-4.73-1.11-9.47-.92-14.18.4-10.54,1.84-21.06,1.84-31.59,0-16.2-1.21-32.41-1.27-48.62-.08-20.68.65-41.37.67-62.06,0-9.14-.93-18.28-1.25-27.43-.12-3.38-1.43-5.28-4.81-5.85q-20.93-3.53-41.84-7.14c-13.13-2.28-26.37-2.81-39.67-2.87-4.05,0-5.37,1.73-5,5.45s.85,7.63.87,11.44c.09,13.17,0,26.35,0,39.52q0,23.83.15,47.68c0,3.14.17,6.28.16,9.42,0,8.47-.25,16.94,0,25.4a5.11,5.11,0,0,0,.92,2.44q-1,18.86-2,37.7-.71,4.56-1.57,9.11a5.46,5.46,0,0,0,.85,4.23l-1.62,29.7a4.29,4.29,0,0,0,1.3,3.32l-.2,1.47-.3-.16c-.16,2.1-.35,3.65-.4,5.17-.15,1.12-.31,2.24-.46,3.37a5.62,5.62,0,0,0,.34,2.9c-.37,18.89-.65,37.77-1.17,56.65-.4,14.44-1.19,28.87-1.83,43.31-.26,5.8.24,6.41,5.84,6.47,8.38.09,16.76.25,25.14.18,4.43,0,8.86-.53,13.3-.77,8.66-.48,17.38-.48,26-1.52,6-.72,11.85-3.13,17.86-4.22,3.53-.64,4.83-2.35,4.93-5.61q1.5-50.05,3-100.12c.08-2.62-1.47-5.73-.51-7.81C769.27,486.66,767.75,478.28,767.32,469.9Z"/>
```

Note: paths do not need to have the class hc -- these will be added automatically when the web app launches.
### Manual method
Draw a single path underneath the desired note shape in the SVG.

## Photoshop notes
https://www.adobe.com/products/photoshop/vectorize-image.html

## Inkscape notes
This seems to be possible with Inkscape, but I haven't had a chance to try it properly yet.