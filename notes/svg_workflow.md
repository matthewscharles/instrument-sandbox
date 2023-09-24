# Creating an instrument SVG
Create an SVG containing images or paths for relevant note triggers.  

Each image element should have an accompanying group with the class '.hc', containing paths or shapes outlining the trigger shape.

## Using Illustrator

### Script

#### Patching
The script may leave some white areas depending on the shading of the instrument, and possibly generate multiple paths. Dragging over these will create gaps in the user's touch pickup, leading to retriggering. 

Find the largest shape, within the generated outline, and use the "blob brush" tool to fill in these areas.  Upon export, this should provide a single path for the instrument.

### Manual