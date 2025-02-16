export async function connect(context, output, destination) {
    if (!context.initialized) {
        console.log('Node not initialized');
        await context.initPromise; // Wait for initialization
    }
    // console.log('Connecting', output, 'to', destination);
    if (destination instanceof AudioDestinationNode) {
        output.connect(destination);
    }
    else if (destination instanceof AudioNode) {
        output.connect(destination);
    }
    else if (destination instanceof AudioParam) {
        output.connect(destination);
    }
    else {
        console.error('Destination must be an AudioNode, AudioParam, or AudioDestinationNode.');
    }
}
export async function disconnect(context, output, destination, outputIndex = 0, inputIndex = 0) {
    if (!context.initialized) {
        console.log('Node not initialized');
        await context.initPromise; // Wait for initialization
    }
    if (!destination) {
        output.disconnect();
    }
    else {
        if (destination instanceof AudioDestinationNode) {
            output.disconnect(destination);
        }
        else if (destination instanceof AudioParam) {
            output.disconnect(destination, outputIndex);
        }
        else if (destination instanceof AudioNode) {
            output.disconnect(destination, outputIndex, inputIndex);
        }
        else {
            console.error('Destination must be an AudioNode, AudioParam, or AudioDestinationNode.\n Disconnecting all outputs from this node');
            output.disconnect();
        }
    }
}
