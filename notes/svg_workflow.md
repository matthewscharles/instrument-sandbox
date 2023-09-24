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

### Manual