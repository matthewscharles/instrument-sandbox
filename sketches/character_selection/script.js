(function() {
    var innerContainer = document.getElementById('inner-container');

    var totalBoxes = 32;
    var cols = 2;
    var rows = totalBoxes / cols;
    var boxHeight = 200; 
    var currentRow = 0;
    var currentCol = 0;
    var visibleRows = 2;
    var topVisibleRow = 0;
    var bottomVisibleRow = topVisibleRow + visibleRows - 1;
    var boxes = [];

    for (var i = 0; i < totalBoxes; i++) {
        var box = document.createElement('div');
        box.className = 'box';
        box.id = 'box' + (i + 1);
        box.textContent = i + 1;
        box.style.backgroundImage = `url('characters/${i + 1}.png')`; // Set background image

        // Add class for left or right column
        if (i % cols === 0) {
            box.classList.add('left-column');
        } else {
            box.classList.add('right-column');
        }

        innerContainer.appendChild(box);
        boxes.push(box);
    }

    function updateBoxClasses() {
        console.log(boxes);
        boxes.forEach((box, index) => {
            var row = Math.floor(index / cols);
            var col = index % cols;

            // Remove existing top or bottom classes
            box.classList.remove('top-row', 'bottom-row');

            // Add class for top or bottom row based on visibility
            if (row >= topVisibleRow && row <= bottomVisibleRow) {
                if (row === topVisibleRow) {
                    box.classList.add('top-row');
                } else if (row === bottomVisibleRow) {
                    box.classList.add('bottom-row');
                }
            }
        });
    }

    function selectBox(row, col) {
        var previousBox = document.querySelector('.selected');
        if (previousBox) {
            previousBox.classList.remove('selected');
            previousBox.style.animation = 'none';
        }

        var index = row * cols + col;

        if (index >= 0 && index < boxes.length) {
            var box = boxes[index];
            box.classList.add('selected');
        }
    }

    selectBox(currentRow, currentCol);

    var isFullscreen = false;

    document.addEventListener('keydown', function(e) {
        e.preventDefault();

        if (isFullscreen) {
            if (e.key === 'Escape') {
                exitFullscreen();
            }
            return;
        }

        var previousRow = currentRow;
        var previousCol = currentCol;

        if (e.key === 'ArrowUp') {
            if (currentRow > 0) {
                currentRow--;
            }
        } else if (e.key === 'ArrowDown') {
            if (currentRow < rows - 1) {
                currentRow++;
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentCol > 0) {
                currentCol--;
            }
        } else if (e.key === 'ArrowRight') {
            if (currentCol < cols - 1) {
                currentCol++;
            }
        } else if (e.key === 'Enter') {
            enterFullscreen();
            return;
        }

        // Check if currentRow is within visible rows
        if (currentRow < topVisibleRow) {
            // Need to scroll up
            topVisibleRow = currentRow;
            bottomVisibleRow = topVisibleRow + visibleRows - 1;
            var scrollPosition = -topVisibleRow * boxHeight;
            innerContainer.style.top = scrollPosition + 'px';

            var event = new CustomEvent('scrollUp');
            document.dispatchEvent(event);
        } else if (currentRow > bottomVisibleRow) {
            bottomVisibleRow = currentRow;
            topVisibleRow = bottomVisibleRow - (visibleRows - 1);
            var scrollPosition = -topVisibleRow * boxHeight;
            innerContainer.style.top = scrollPosition + 'px';

            var event = new CustomEvent('scrollDown');
            document.dispatchEvent(event);
        }

        if (currentRow !== previousRow || currentCol !== previousCol) {
            var direction;
            if (currentRow < previousRow) direction = 'up';
            if (currentRow > previousRow) direction = 'down';
            if (currentCol < previousCol) direction = 'left';
            if (currentCol > previousCol) direction = 'right';

            var event = new CustomEvent('move', { detail: { direction: direction } });
            document.dispatchEvent(event);
        }

        selectBox(currentRow, currentCol);
        exitFullscreen();
        updateBoxClasses();
    });

    function enterFullscreen() {
        isFullscreen = true;
        var index = currentRow * cols + currentCol;
        var selectedBox = boxes[index];
        selectedBox.classList.add('fullscreen');

        boxes.forEach(function(box, idx) {
            if (box !== selectedBox) {
                box.classList.add('fade-out');
                box.classList.remove('fade-in');
            }
        });

        // Emit custom event: select
        var event = new CustomEvent('select', { detail: { boxId: selectedBox.id } });
        document.dispatchEvent(event);
    }

    function exitFullscreen() {
        isFullscreen = false;
        var index = currentRow * cols + currentCol;
        var selectedBox = boxes[index];
        selectedBox.classList.remove('fullscreen');

        // Fade in other boxes
        boxes.forEach(function(box) {
            if (box !== selectedBox) {
                box.classList.add('fade-in');
                box.classList.remove('fade-out');
            }
        });

        // Emit custom event: deselect
        var event = new CustomEvent('deselect', { detail: { boxId: selectedBox.id } });
        document.dispatchEvent(event);
    }

    // Example event listeners for custom events
    document.addEventListener('scrollUp', function() {
        console.log('Scrolled up');
    });

    document.addEventListener('scrollDown', function() {
        console.log('Scrolled down');
    });

    document.addEventListener('move', function(e) {
        console.log('Moved ' + e.detail.direction);
    });

    document.addEventListener('select', function(e) {
        console.log('Selected ' + e.detail.boxId);
    });

    document.addEventListener('deselect', function(e) {
        console.log('Deselected ' + e.detail.boxId);
    });
})();