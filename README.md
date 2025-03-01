## Ballustrade Height Calculator

Built for the use of MW Design Workshop to calculate the height of ballustrades according to their placement along the treads of a staircase.

## Features

- **Precise Stair Calculations**: Calculate rise, run, rake angle, and baluster heights with precision
- **Technical Visualization**: CAD-style visualization of stair geometry with dimensions
- **Baluster Layout**: Automatically calculate baluster setbacks and heights
- **Fraction Display**: View measurements in both decimal and fractional formats
- **Print-Ready**: Generate technical drawings suitable for printing

## Technical Details

The Technical Stair Calculator is built with modern web technologies:

- **HTML5**: Semantic structure for accessibility and clarity
- **CSS3**: Grid-based layout with CAD-inspired styling
- **JavaScript**: Canvas-based visualization and real-time calculations
- **Responsive Design**: Adapts to different screen sizes

## Usage

1. Adjust the input parameters using the sliders or direct input:
   - Rise (inches): The vertical height of each step
   - Run (inches): The horizontal depth of each step
   - Rail Height (inches): The height of the handrail from the tread
   - Balusters Per Tread: Number of balusters on each tread
   - Rail Thickness (inches): The thickness of the handrail

2. View the real-time visualization and calculated values:
   - Rake Angle: The angle of the stairs
   - Net Baluster Height: The height of balusters at the nosing
   - Baluster Setbacks: The position of each baluster on the tread
   - Baluster Heights: The height of each baluster

3. Print the technical drawing for reference during construction.

## Key Calculations

- **Rake Angle**: `arctan(Rise/Run)`
- **Net Baluster Height**: `Rail Height - Rail Thickness`
- **Baluster Setbacks**: Evenly distributed along the tread
- **Baluster Heights**: Increase with distance from nosing due to the rake angle

